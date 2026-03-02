import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImagePlus, Link2, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createProperty, getProperty, updateProperty } from '@/db/api';
import { supabase } from '@/db/supabase';
import { SUPPORTED_CURRENCIES } from '@/types';

const PROPERTY_IMAGES_BUCKET = 'app-9y1d22zfrldt_property_images';
const MAX_PHOTOS = 12;

interface LocalPhoto {
  file: File;
  previewUrl: string;
}

const AddPropertyPage: React.FC = () => {
  const { id: propertyId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEditing = Boolean(propertyId);
  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'apartment' | 'house' | 'land' | 'commercial'>('apartment');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [sizeSqm, setSizeSqm] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [parking, setParking] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [elevator, setElevator] = useState(false);
  const [balcony, setBalcony] = useState(false);
  const [localPhotos, setLocalPhotos] = useState<LocalPhoto[]>([]);
  const [externalPhotoUrl, setExternalPhotoUrl] = useState('');
  const [externalPhotos, setExternalPhotos] = useState<string[]>([]);
  const localPhotosRef = useRef<LocalPhoto[]>([]);

  useEffect(() => {
    const loadPropertyForEdit = async () => {
      if (!isEditing || !propertyId) {
        setInitialLoading(false);
        return;
      }

      try {
        const property = await getProperty(propertyId);
        if (!property) {
          toast.error('Property not found.');
          navigate('/broker');
          return;
        }

        if (user && property.broker_id !== user.id) {
          toast.error('You can edit only your own properties.');
          navigate('/broker');
          return;
        }

        setTitle(property.title || '');
        setDescription(property.description || '');
        setType(property.type || 'apartment');
        setPrice(property.price?.toString() || '');
        setCurrency(property.currency || 'EUR');
        setSizeSqm(property.size_sqm?.toString() || '');
        setBedrooms(property.bedrooms?.toString() || '');
        setBathrooms(property.bathrooms?.toString() || '');
        setCountry(property.country || '');
        setCity(property.city || '');
        setAddress(property.address || '');
        setLatitude(property.latitude?.toString() || '');
        setLongitude(property.longitude?.toString() || '');
        setParking(Boolean(property.parking));
        setFurnished(Boolean(property.furnished));
        setElevator(Boolean(property.elevator));
        setBalcony(Boolean(property.balcony));
        setExternalPhotos(Array.isArray(property.photos) ? property.photos : []);
      } catch (error) {
        console.error('Error loading property for edit:', error);
        toast.error('Failed to load property details.');
        navigate('/broker');
      } finally {
        setInitialLoading(false);
      }
    };

    loadPropertyForEdit();
  }, [isEditing, propertyId, user, navigate]);

  useEffect(() => {
    localPhotosRef.current = localPhotos;
  }, [localPhotos]);

  useEffect(() => {
    return () => {
      localPhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    };
  }, []);

  const handlePhotoFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = Math.max(0, MAX_PHOTOS - localPhotos.length - externalPhotos.length);
    if (remainingSlots === 0) {
      toast.error(`You can upload up to ${MAX_PHOTOS} photos per property.`);
      e.target.value = '';
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remainingSlots);
    const preparedFiles: LocalPhoto[] = selectedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setLocalPhotos((prev) => [...prev, ...preparedFiles]);

    if (selectedFiles.length < files.length) {
      toast.info(`Only ${remainingSlots} more photo(s) were added due to the ${MAX_PHOTOS}-photo limit.`);
    }

    e.target.value = '';
  };

  const removeLocalPhoto = (index: number) => {
    setLocalPhotos((prev) => {
      const photoToRemove = prev[index];
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const addExternalPhoto = () => {
    const trimmed = externalPhotoUrl.trim();
    if (!trimmed) return;

    if (localPhotos.length + externalPhotos.length >= MAX_PHOTOS) {
      toast.error(`You can upload up to ${MAX_PHOTOS} photos per property.`);
      return;
    }

    try {
      new URL(trimmed);
    } catch {
      toast.error('Please enter a valid image URL.');
      return;
    }

    setExternalPhotos((prev) => [...prev, trimmed]);
    setExternalPhotoUrl('');
  };

  const removeExternalPhoto = (index: number) => {
    setExternalPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadLocalPhotos = async (userId: string): Promise<string[]> => {
    if (localPhotos.length === 0) return [];

    setUploadingPhotos(true);
    try {
      const uploadedUrls: string[] = [];

      for (const photo of localPhotos) {
        const extension = photo.file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

        const { error } = await supabase.storage
          .from(PROPERTY_IMAGES_BUCKET)
          .upload(filePath, photo.file, { cacheControl: '3600', upsert: false });

        if (error) {
          throw new Error(`Failed to upload "${photo.file.name}": ${error.message}`);
        }

        const { data } = supabase.storage.from(PROPERTY_IMAGES_BUCKET).getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      localPhotos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      setLocalPhotos([]);
      return uploadedUrls;
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to add properties');
      return;
    }

    if (!latitude || !longitude) {
      toast.error('Coordinates are required. Every DOMUS needs its location!');
      return;
    }

    setLoading(true);

    try {
      const uploadedPhotoUrls = await uploadLocalPhotos(user.id);
      const allPhotoUrls = [...externalPhotos, ...uploadedPhotoUrls];

      const propertyData = {
        title,
        description,
        type,
        price: parseFloat(price),
        currency,
        size_sqm: parseFloat(sizeSqm),
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
        country,
        city,
        address: address || undefined,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        parking,
        furnished,
        elevator,
        balcony,
        photos: allPhotoUrls,
      };

      if (isEditing && propertyId) {
        const updated = await updateProperty(propertyId, propertyData);
        if (updated) {
          await supabase.functions.invoke('ai-deal-analyzer', {
            body: { propertyId: updated.id },
          });

          toast.success('Property updated successfully!');
          navigate('/broker');
        }
      } else {
        const created = await createProperty(propertyData, user.id);
        if (created) {
          await supabase.functions.invoke('ai-deal-analyzer', {
            body: { propertyId: created.id },
          });

          toast.success('Property added successfully!');
          navigate('/broker');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading property details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-background to-yellow-100/40">
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Property' : 'Add New Property'}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Modern 2-bedroom apartment in city center"
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  placeholder="Describe the property in detail..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Property Type *</Label>
                  <Select value={type} onValueChange={(v: any) => setType(v)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="size">Size (m²) *</Label>
                  <Input
                    id="size"
                    type="number"
                    value={sizeSqm}
                    onChange={(e) => setSizeSqm(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_CURRENCIES.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.symbol} {curr.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location (MANDATORY)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                    placeholder="e.g., 42.6977"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                    placeholder="e.g., 23.3219"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">
                Every DOMUS needs its coordinates! Use a map service to find exact coordinates.
              </p>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Property Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="photos">Upload Photos</Label>
                <div className="mt-2 rounded-lg border border-dashed border-muted-foreground/40 p-4">
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <ImagePlus className="h-4 w-4" />
                    Select multiple images at once (up to {MAX_PHOTOS})
                  </div>
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoFilesChange}
                    disabled={loading || uploadingPhotos}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="photo-url">Or Add Image URL</Label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id="photo-url"
                    value={externalPhotoUrl}
                    onChange={(e) => setExternalPhotoUrl(e.target.value)}
                    placeholder="https://example.com/property-image.jpg"
                    disabled={loading || uploadingPhotos}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addExternalPhoto}
                    disabled={loading || uploadingPhotos || !externalPhotoUrl.trim()}
                  >
                    <Link2 className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                </div>
              </div>

              {(localPhotos.length > 0 || externalPhotos.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {localPhotos.map((photo, index) => (
                    <div key={`${photo.file.name}-${index}`} className="relative rounded-md overflow-hidden border bg-muted/20">
                      <img
                        src={photo.previewUrl}
                        alt={photo.file.name}
                        className="w-full h-28 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeLocalPhoto(index)}
                        className="absolute top-1 right-1 rounded-full bg-background/90 p-1 border"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="px-2 py-1.5 text-[11px] truncate">
                        {photo.file.name}
                      </div>
                    </div>
                  ))}

                  {externalPhotos.map((photoUrl, index) => (
                    <div key={`${photoUrl}-${index}`} className="relative rounded-md overflow-hidden border bg-muted/20">
                      <img
                        src={photoUrl}
                        alt={`External property photo ${index + 1}`}
                        className="w-full h-28 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExternalPhoto(index)}
                        className="absolute top-1 right-1 rounded-full bg-background/90 p-1 border"
                        aria-label="Remove image"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="px-2 py-1.5 text-[11px] truncate">
                        External image URL
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-yellow-300/70 bg-yellow-50/70">
            <CardHeader>
              <CardTitle className="text-yellow-900">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="parking"
                  checked={parking}
                  onCheckedChange={(checked) => setParking(checked as boolean)}
                />
                <Label htmlFor="parking" className="font-normal">Parking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="furnished"
                  checked={furnished}
                  onCheckedChange={(checked) => setFurnished(checked as boolean)}
                />
                <Label htmlFor="furnished" className="font-normal">Furnished</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="elevator"
                  checked={elevator}
                  onCheckedChange={(checked) => setElevator(checked as boolean)}
                />
                <Label htmlFor="elevator" className="font-normal">Elevator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="balcony"
                  checked={balcony}
                  onCheckedChange={(checked) => setBalcony(checked as boolean)}
                />
                <Label htmlFor="balcony" className="font-normal">Balcony</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/broker')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploadingPhotos}>
              {loading || uploadingPhotos ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Property...
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Add to DOMUS'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;
