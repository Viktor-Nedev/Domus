import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { getSavedProperties } from '@/db/api';
import type { SavedProperty } from '@/types';

const SavedPropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedProperties();
    }
  }, [user]);

  const loadSavedProperties = async () => {
    if (!user) return;

    try {
      const saved = await getSavedProperties(user.id);
      setSavedProperties(saved);
    } catch (error) {
      console.error('Error loading saved properties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading saved properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Heart className="h-8 w-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold">Saved Properties</h1>
        </div>

        {savedProperties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">You haven't saved any properties yet</p>
              <Link to="/dashboard">
                <Button>Explore Properties</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((saved) =>
              saved.property ? (
                <PropertyCard key={saved.id} property={saved.property} />
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPropertiesPage;
