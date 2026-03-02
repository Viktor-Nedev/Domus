import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Maximize, Bed, Bath } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Property } from '@/types';
import { useCurrency } from '@/components/common/CurrencySelector';
import { saveProperty, unsaveProperty, isPropertySaved } from '@/db/api';
import { useAuth } from '@/contexts/AuthContext';

interface PropertyCardProps {
  property: Property;
  showMatchScore?: boolean;
  matchScore?: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, showMatchScore, matchScore }) => {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      checkSaved();
    }
  }, [user, property.id]);

  const checkSaved = async () => {
    if (user) {
      const saved = await isPropertySaved(user.id, property.id);
      setIsSaved(saved);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to save properties');
      return;
    }

    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const mainPhoto =
    property.photos && property.photos.length > 0
      ? property.photos[0]
      : '/images/property-placeholder.svg';

  return (
    <Link to={`/property/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow domus-shadow">
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainPhoto}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/property-placeholder.svg';
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 bg-background/80 backdrop-blur ${isSaved ? 'text-destructive' : ''}`}
            onClick={handleSave}
            disabled={loading}
          >
            <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
          {property.domus_score >= 70 && (
            <Badge className="absolute top-2 left-2 bg-primary">
              DOMUS Score: {property.domus_score}
            </Badge>
          )}
          {showMatchScore && matchScore && (
            <Badge className="absolute bottom-2 left-2 bg-secondary text-secondary-foreground">
              {matchScore}% Match
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {property.city}, {property.country}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            {property.bedrooms && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {property.bedrooms}
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {property.bathrooms}
              </div>
            )}
            <div className="flex items-center">
              <Maximize className="h-4 w-4 mr-1" />
              {property.size_sqm}m²
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">
            {formatPrice(property.price_eur)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
