import React, { useEffect, useState } from 'react';
import { MapPin, Search, Shield, Home, Phone, Clock, Users, Bot, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/db/supabase';
import type { Property } from '@/types';

const ShelterMapPage: React.FC = () => {
  const [shelters, setShelters] = useState<Property[]>([]);
  const [selectedShelter, setSelectedShelter] = useState<Property | null>(null);
  const [userLocation, setUserLocation] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadShelters();
  }, []);

  const loadShelters = async () => {
    try {
      // Load properties with RECLAIM listings (emergency housing)
      const { data: reclaimListings } = await supabase
        .from('reclaim_listings')
        .select('property_id');

      if (reclaimListings && reclaimListings.length > 0) {
        const propertyIds = reclaimListings.map((listing: any) => listing.property_id);

        const { data, error } = await supabase
          .from('properties')
          .select('*, broker:profiles!properties_broker_id_fkey(id, name, email, phone, agency_name)')
          .in('id', propertyIds)
          .eq('status', 'active')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (error) throw error;
        setShelters(data || []);
      }

      // Also load regular properties with coordinates as potential shelters
      const { data: regularProperties, error: regError } = await supabase
        .from('properties')
        .select('*, broker:profiles!properties_broker_id_fkey(id, name, email, phone, agency_name)')
        .eq('status', 'active')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .limit(20);

      if (regError) throw regError;
      if (regularProperties) {
        setShelters(prev => [...prev, ...regularProperties]);
      }
    } catch (error) {
      console.error('Error loading shelters:', error);
    }
  };

  const handleAiSearch = async () => {
    if (!userLocation.trim()) return;

    setLoading(true);
    try {
      // Call Edge Function to search for shelters
      const { data, error } = await supabase.functions.invoke('search-shelters', {
        body: { location: userLocation },
      });

      if (error) {
        const errorMsg = await error?.context?.text();
        console.error('Edge function error in search-shelters:', errorMsg || error?.message);
        setAiSuggestion('Sorry, I encountered an error searching for shelters. Please try again.');
        return;
      }

      if (data && data.success) {
        setShelters(data.shelters || []);
        setAiSuggestion(data.aiSuggestion || 'Search completed.');
        if (data.shelters && data.shelters.length > 0) {
          setSelectedShelter(data.shelters[0]);
        }
      } else {
        setAiSuggestion('No shelters found for this location. Please try a different search.');
      }
    } catch (error) {
      console.error('Error with AI search:', error);
      setAiSuggestion('Sorry, I encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">Emergency Shelter Map</h1>
              <p className="text-muted-foreground">
                Find safe housing near you with AI-powered location assistance
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {shelters.length} Safe Housing Options Available
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - AI Search & Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Location Search */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Shelter Finder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Where are you located?
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter your location..."
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAiSearch()}
                    />
                    <Button
                      onClick={handleAiSearch}
                      disabled={loading || !userLocation.trim()}
                      size="icon"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {loading && (
                  <div className="text-center py-4">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">AI analyzing your location...</p>
                  </div>
                )}
                {aiSuggestion && !loading && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm whitespace-pre-line">{aiSuggestion}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Use</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">View on Map</p>
                    <p className="text-muted-foreground">All shelters are marked on the interactive map</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bot className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">AI Assistance</p>
                    <p className="text-muted-foreground">Get personalized recommendations based on your location</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Direct Contact</p>
                    <p className="text-muted-foreground">Message property owners directly for immediate help</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Emergency Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">24/7 Humanitarian Hotline:</p>
                <p className="text-lg font-bold text-primary">+1-800-SHELTER</p>
                <p className="text-muted-foreground mt-2">
                  For immediate emergency assistance, contact our partner organizations.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-[700px]">
              <CardContent className="p-0 h-full">
                {/* Mapbox Integration */}
                <div id="shelter-map" className="h-full w-full rounded-lg relative">
                  {/* Map will be rendered here by Mapbox GL JS */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                    <div className="text-center p-8 z-10">
                      <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Interactive Shelter Map</h3>
                      <p className="text-muted-foreground mb-4 max-w-md">
                        Map will display here with Mapbox integration. Enter a location above to search for shelters.
                      </p>
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                        Mapbox API Key Required
                      </Badge>
                      <div className="mt-6 text-sm text-muted-foreground">
                        <p className="font-medium mb-2">Map Features:</p>
                        <ul className="space-y-1">
                          <li>✓ Real-time shelter locations</li>
                          <li>✓ Distance calculation</li>
                          <li>✓ Route navigation</li>
                          <li>✓ Availability status</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Shelter Details */}
            {selectedShelter && (
              <Card className="mt-6 border-2 border-secondary/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedShelter.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedShelter.city}, {selectedShelter.country}
                      </p>
                    </div>
                    <Badge className="bg-secondary text-secondary-foreground">
                      {(selectedShelter as any).badge || 'Available Now'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedShelter.bedrooms} bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedShelter.size_sqm}m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Exact coordinates available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {(selectedShelter as any).available_immediately ? 'Immediate availability' : 'Contact for availability'}
                      </span>
                    </div>
                  </div>
                  {(selectedShelter as any).special_terms && (
                    <div className="mb-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                      <p className="text-sm font-medium text-secondary-foreground">
                        ✓ {(selectedShelter as any).special_terms}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Owner
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Navigation className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shelter List */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold">All Available Shelters ({shelters.length})</h3>
              {shelters.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">
                      Enter a location above to search for available shelters and emergency housing.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {shelters.slice(0, 10).map((shelter) => (
                    <Card
                      key={shelter.id}
                      className="cursor-pointer hover:border-secondary transition-colors"
                      onClick={() => setSelectedShelter(shelter)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{shelter.title}</h4>
                              <Badge 
                                className={
                                  (shelter as any).type === 'emergency_shelter' 
                                    ? 'emergency-badge' 
                                    : 'shelter-badge'
                                }
                              >
                                {(shelter as any).badge}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {shelter.city}, {shelter.country}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>{shelter.bedrooms} beds</span>
                              <span>{shelter.size_sqm}m²</span>
                              {(shelter as any).price && (
                                <Badge variant="secondary" className="text-xs">
                                  €{(shelter as any).price?.toLocaleString()}/mo
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShelterMapPage;
