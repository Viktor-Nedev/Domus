import React, { useEffect, useState } from 'react';
import { Search, Filter, Home, DollarSign, Bed, MapPin, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/db/supabase';
import type { Property } from '@/types';

const MapExplorerPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [userLocation, setUserLocation] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, broker:profiles!properties_broker_id_fkey(id, name, email, agency_name)')
        .eq('status', 'active')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .limit(50);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const handleAiAssist = async () => {
    if (!userLocation.trim()) return;
    
    setLoading(true);
    try {
      // Simulate AI suggestion (in production, call your AI Edge Function)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const nearbyProperties = properties.slice(0, 3);
      const suggestion = `Based on your location "${userLocation}", I recommend checking out these areas:\n\n` +
        nearbyProperties.map((p, i) => 
          `${i + 1}. ${p.title} in ${p.city}, ${p.country}\n   - Price: €${p.price_eur?.toLocaleString()}\n   - ${p.bedrooms} bedrooms, ${p.size_sqm}m²\n   - DOMUS Score: ${p.domus_score}/100`
        ).join('\n\n') +
        `\n\nThese properties offer great value and are in areas with good infrastructure and amenities.`;
      
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
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
          <h1 className="text-4xl font-bold mb-2 gradient-text">Map Explorer</h1>
          <p className="text-muted-foreground">
            Discover properties on an interactive map with AI-powered location assistance
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - AI Assistant & Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Location Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Location Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Where are you located?
                  </label>
                  <Input
                    placeholder="e.g., Sofia, Barcelona, Athens..."
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAiAssist()}
                  />
                </div>
                <Button 
                  onClick={handleAiAssist} 
                  disabled={loading || !userLocation.trim()}
                  className="w-full"
                >
                  {loading ? 'Analyzing...' : 'Get AI Suggestions'}
                </Button>
                {aiSuggestion && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-line">{aiSuggestion}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Quick Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Under €100k
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bed className="mr-2 h-4 w-4" />
                  2+ Bedrooms
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  High DOMUS Score
                </Button>
              </CardContent>
            </Card>

            {/* Properties Count */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {properties.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Properties with location data
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-[700px]">
              <CardContent className="p-0 h-full">
                {/* Mapbox Integration Placeholder */}
                <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg relative">
                  <div className="text-center p-8">
                    <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Interactive Map Coming Soon</h3>
                    <p className="text-muted-foreground mb-4 max-w-md">
                      Mapbox integration will display all properties as interactive markers. 
                      Click any marker to see property details, photos, and contact information.
                    </p>
                    <Badge variant="secondary">Mapbox API Integration Required</Badge>
                  </div>

                  {/* Sample Property Markers (Visual Representation) */}
                  <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                    <Home className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                    <Home className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
                    <Home className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Property Details */}
            {selectedProperty && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{selectedProperty.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-medium">{selectedProperty.city}, {selectedProperty.country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="font-medium">€{selectedProperty.price_eur?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Size</p>
                      <p className="font-medium">{selectedProperty.size_sqm}m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">DOMUS Score</p>
                      <Badge variant="default">{selectedProperty.domus_score}/100</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-4">View Full Details</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapExplorerPage;
