import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyCard } from '@/components/property/PropertyCard';
import { supabase } from '@/db/supabase';
import type { Property } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const AllPropertiesPage: React.FC = () => {
  const { profile } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('domus_score');

  useEffect(() => {
    loadProperties();
  }, [selectedCountry, selectedType, sortBy]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select('*, broker:profiles!properties_broker_id_fkey(id, name, email, agency_name)')
        .eq('status', 'active');

      if (selectedCountry !== 'all') {
        query = query.eq('country', selectedCountry);
      }

      if (selectedType !== 'all') {
        query = query.eq('type', selectedType);
      }

      // Sort
      if (sortBy === 'domus_score') {
        query = query.order('domus_score', { ascending: false });
      } else if (sortBy === 'price_asc') {
        query = query.order('price_eur', { ascending: true });
      } else if (sortBy === 'price_desc') {
        query = query.order('price_eur', { ascending: false });
      } else if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      }

      query = query.limit(50);

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      property.title.toLowerCase().includes(search) ||
      property.city.toLowerCase().includes(search) ||
      property.country.toLowerCase().includes(search) ||
      property.description.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">All Properties</h1>
          <p className="text-muted-foreground">
            Browse {properties.length} properties from around the world
          </p>
          </div>
          {profile?.account_type === 'broker' && (
            <Link to="/broker/add-property">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="h-4 w-4 mr-2" />
                Add New Property
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by city, country, or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Country Filter */}
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="Italy">Italy</SelectItem>
                  <SelectItem value="Greece">Greece</SelectItem>
                  <SelectItem value="Romania">Romania</SelectItem>
                  <SelectItem value="Turkey">Turkey</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sort by:</span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domus_score">DOMUS Score (Highest)</SelectItem>
                  <SelectItem value="price_asc">Price (Lowest)</SelectItem>
                  <SelectItem value="price_desc">Price (Highest)</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No properties found matching your criteria
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCountry('all');
                setSelectedType('all');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Показани {filteredProperties.length} от {properties.length} имота
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllPropertiesPage;
