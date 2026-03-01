import React, { useEffect, useState } from 'react';
import { MapPin, Search, Shield, Home, AlertTriangle, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/db/supabase';
import { EmergencyShelterMap } from '@/components/map/EmergencyShelterMap';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { EmergencyShelter } from '@/types/emergency';
import type { Property } from '@/types';

const EmergencyHousingPage: React.FC = () => {
  const [allShelters, setAllShelters] = useState<EmergencyShelter[]>([]);
  const [displayedShelters, setDisplayedShelters] = useState<EmergencyShelter[]>([]);
  const [searchCountry, setSearchCountry] = useState('all');
  const [loading, setLoading] = useState(false);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  // Load ALL shelters on mount
  useEffect(() => {
    loadAllShelters();
  }, []);

  const loadAllShelters = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('emergency_shelters')
        .select('*')
        .eq('status', 'active')
        .order('country', { ascending: true });

      if (error) throw error;
      
      setAllShelters(data || []);
      setDisplayedShelters(data || []);
      
      // Extract unique countries
      const uniqueCountries = Array.from(new Set(data?.map(s => s.country) || [])).sort();
      setCountries(uniqueCountries);
      
    } catch (error) {
      console.error('Error loading shelters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchCountry === 'all') {
      setDisplayedShelters(allShelters);
      setRelatedProperties([]);
      return;
    }

    setLoading(true);

    try {
      // Filter shelters by country - show ALL results
      const filteredShelters = allShelters.filter(shelter => 
        shelter.country.toLowerCase() === searchCountry.toLowerCase()
      );

      setDisplayedShelters(filteredShelters);

      // Load related properties
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .ilike('country', searchCountry)
        .order('domus_score', { ascending: false })
        .limit(6);

      if (!propertyError) {
        setRelatedProperties(propertyData || []);
      }

    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-[1800px]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="h-16 w-16 text-primary" />
            <div>
              <h1 className="text-5xl font-bold gradient-text mb-2">Emergency Housing</h1>
              <p className="text-muted-foreground text-xl">
                Find safe shelter and temporary accommodation during humanitarian crises
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Badge variant="outline" className="text-base px-4 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              War & Conflict
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Earthquake
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Flood & Natural Disasters
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Fire
            </Badge>
            <Badge variant="outline" className="text-base px-4 py-2">
              <Heart className="h-4 w-4 mr-2" />
              Humanitarian Crisis
            </Badge>
          </div>

          <Badge variant="secondary" className="text-lg px-6 py-3">
            {displayedShelters.length} Emergency Shelters {searchCountry !== 'all' ? 'Found' : 'Available Worldwide'}
          </Badge>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-primary/20 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Search className="h-7 w-7" />
              Search Emergency Housing by Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={searchCountry} onValueChange={setSearchCountry}>
                <SelectTrigger className="flex-1 h-14 text-lg">
                  <SelectValue placeholder="Select country..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleSearch} 
                className="bg-secondary hover:bg-secondary/90 px-10 h-14 text-lg"
                disabled={loading}
              >
                <Search className="h-5 w-5 mr-3" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map Section - PRIMARY FOCUS */}
        <Card className="shadow-2xl mb-8">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <MapPin className="h-7 w-7" />
              Emergency Shelter Locations
              {searchCountry !== 'all' && <span className="text-secondary">in {searchCountry}</span>}
            </CardTitle>
            <p className="text-muted-foreground text-base mt-2">
              Click on any marker to view detailed shelter information
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="h-[800px] flex items-center justify-center">
                <p className="text-muted-foreground text-lg">Loading shelter locations...</p>
              </div>
            ) : displayedShelters.length === 0 ? (
              <div className="h-[800px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg m-6">
                <div className="text-center p-12">
                  <Shield className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
                  <p className="text-2xl font-medium mb-3">No shelters found</p>
                  <p className="text-muted-foreground text-lg">
                    No emergency shelters found for the selected country.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[800px]">
                <EmergencyShelterMap shelters={displayedShelters} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Properties */}
        {searchCountry !== 'all' && relatedProperties.length > 0 && (
          <Card className="border-secondary/30 shadow-lg mb-8">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Home className="h-7 w-7 text-secondary" />
                    Available Properties in {searchCountry}
                  </CardTitle>
                  <p className="text-base text-muted-foreground mt-2">
                    Looking for long-term housing? Explore properties for sale in this country.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/properties'}
                  className="border-secondary text-secondary hover:bg-secondary/10 h-12 px-6 text-base"
                >
                  View All Properties
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Banner */}
        <Alert className="bg-primary/5 border-primary/20 shadow-md">
          <Heart className="h-6 w-6 text-primary" />
          <AlertDescription className="text-lg">
            <span className="font-semibold">This is a humanitarian service.</span> Emergency shelters listed here provide temporary accommodation during crises. 
            This is separate from our property marketplace. If you need to list an emergency shelter, please contact our support team.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default EmergencyHousingPage;
