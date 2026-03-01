import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createProperty } from '@/db/api';
import { supabase } from '@/db/supabase';
import { SUPPORTED_CURRENCIES } from '@/types';

const AddPropertyPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
        photos: [],
      };

      const property = await createProperty(propertyData, user.id);

      if (property) {
        // Trigger AI analysis
        await supabase.functions.invoke('ai-deal-analyzer', {
          body: { propertyId: property.id },
        });

        toast.success('Property added successfully!');
        navigate('/broker');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Add New Property</h1>

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

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding Property...' : 'Add to DOMUS'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;
