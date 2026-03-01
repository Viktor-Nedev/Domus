import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Maximize, Bed, Bath, Calendar, Heart, MessageSquare, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/components/common/CurrencySelector';
import { getProperty, saveProperty, unsaveProperty, isPropertySaved, getOrCreateConversation } from '@/db/api';
import { PropertyMap } from '@/components/map/PropertyMap';
import type { Property } from '@/types';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { formatPrice } = useCurrency();
  const [property, setProperty] = useState<Property | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    if (!id) return;

    try {
      const data = await getProperty(id);
      setProperty(data);

      if (user && data) {
        const saved = await isPropertySaved(user.id, data.id);
        setIsSaved(saved);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !property) {
      toast.error('Please sign in to save properties');
      return;
    }

    try {
      if (isSaved) {
        await unsaveProperty(user.id, property.id);
        setIsSaved(false);
        toast.success('Property removed from favorites');
      } else {
        await saveProperty(user.id, property.id);
        setIsSaved(true);
        toast.success('Property saved to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleMessageBroker = async () => {
    if (!user || !property) {
      toast.error('Please sign in to message brokers');
      navigate('/auth');
      return;
    }

    try {
      const conversation = await getOrCreateConversation(user.id, property.broker_id, property.id);
      if (conversation) {
        navigate(`/messages?conversation=${conversation.id}`);
      }
    } catch (error) {
      toast.error('Failed to start conversation');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this property on DOMUS`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Property not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Photo Gallery */}
        <div className="mb-8">
          {property.photos && property.photos.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {property.photos.map((photo, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] md:h-[600px] rounded-lg overflow-hidden">
                      <img
                        src={photo}
                        alt={`${property.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No photos available</p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Price */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.address && `${property.address}, `}
                    {property.city}, {property.country}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleSave}>
                    <Heart className={`h-5 w-5 ${isSaved ? 'fill-current text-destructive' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="text-4xl font-bold text-primary mb-4">
                {formatPrice(property.price_eur)}
              </div>
              {property.domus_score >= 70 && (
                <Badge className="bg-primary text-lg py-1 px-3">
                  DOMUS Score: {property.domus_score}/100
                </Badge>
              )}
            </div>

            {/* Key Info */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <Maximize className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Size</p>
                      <p className="font-semibold">{property.size_sqm}m²</p>
                    </div>
                  </div>
                  {property.bedrooms && (
                    <div className="flex items-center">
                      <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center">
                      <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bathrooms</p>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  {property.year_built && (
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Built</p>
                        <p className="font-semibold">{property.year_built}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Location Map */}
          {property.latitude && property.longitude && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Property Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PropertyMap 
                  latitude={typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude} 
                  longitude={typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude}
                  title={property.title}
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {property.address}, {property.city}, {property.country}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {property.parking && <div className="flex items-center">✓ Parking</div>}
                  {property.elevator && <div className="flex items-center">✓ Elevator</div>}
                  {property.balcony && <div className="flex items-center">✓ Balcony</div>}
                  {property.furnished && <div className="flex items-center">✓ Furnished</div>}
                  {property.heating_type && <div className="flex items-center">✓ {property.heating_type} Heating</div>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Broker */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Broker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.broker && (
                  <div>
                    <p className="font-semibold">{property.broker.name}</p>
                    {property.broker.agency_name && (
                      <p className="text-sm text-muted-foreground">{property.broker.agency_name}</p>
                    )}
                  </div>
                )}
                <Button className="w-full" onClick={handleMessageBroker}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Broker
                </Button>
              </CardContent>
            </Card>

            {/* DOMUS AI Analysis */}
            {property.domus_score > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>DOMUS AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold mb-1">Deal Score</p>
                      <div className="flex items-center">
                        <div className="flex-1 bg-muted rounded-full h-2 mr-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${property.domus_score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{property.domus_score}/100</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>This property has been analyzed by our AI and scored based on:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Market price comparison</li>
                        <li>Location quality</li>
                        <li>Property features</li>
                        <li>Investment potential</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
