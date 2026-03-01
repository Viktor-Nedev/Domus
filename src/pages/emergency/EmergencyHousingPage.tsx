import React, { useEffect, useState } from 'react';
import { MapPin, Shield, Home, AlertTriangle, Heart, Loader2, Bot } from 'lucide-react';
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
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const callGemini = async (prompt: string, apiKey: string) => {
    // Get available models and pick flash
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    if (!listRes.ok) {
      const errText = await listRes.text().catch(() => '');
      throw new Error(`Gemini list error: ${listRes.status} ${errText}`);
    }
    const list = await listRes.json();
    const models: string[] =
      list?.models?.map((m: any) => m.name).filter((n: string) => n) || [];

    const pick =
      models.find((m) => m.includes('gemini-1.5-flash')) ||
      models.find((m) => m.includes('gemini-1.0-pro')) ||
      'models/gemini-1.5-flash';

    const modelName = pick.startsWith('models/') ? pick : `models/${pick}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 256 },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Gemini API error: ${res.status} ${errText}`);
    }

    return res.json();
  };

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
      
    } catch (error) {
      console.error('Error loading shelters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAiSearch = async () => {
    if (!aiQuery.trim()) {
      setAiMessage('Въведи държава или регион за AI търсене.');
      return;
    }

    const geminiApiKey =
      import.meta.env.VITE_GEMINI_API_KEY ||
      'AIzaSyB0GLsmyOJfbZi3SAf3vGML_h-H8ZUNJtQ';
    if (!geminiApiKey) {
      setAiMessage('Липсва Gemini API ключ. Задай VITE_GEMINI_API_KEY в .env.');
      return;
    }

    setAiLoading(true);
    setAiMessage(null);

    try {
      const prompt = `
        Extract the country names mentioned in the user query.
        Return ONLY valid country names as JSON string:
        {"countries":["Country 1","Country 2"]}
        If none are found, return {"countries":[]}.
        User query: "${aiQuery}"
      `;

      const data = await callGemini(prompt, geminiApiKey);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      let countriesFromAi: string[] = [];
      try {
        const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
        countriesFromAi = parsed.countries || [];
      } catch (err) {
        console.error('Failed to parse Gemini response', err, text);
      }

      if (countriesFromAi.length === 0) {
        setAiMessage('AI не разпозна държава. Опитай отново.');
        return;
      }

      // Filter shelters by the first detected country
      const targetCountry = countriesFromAi[0];
      setSearchCountry(targetCountry);

      const filteredShelters = allShelters.filter(
        (shelter) => shelter.country.toLowerCase() === targetCountry.toLowerCase()
      );
      setDisplayedShelters(filteredShelters);

      const { data: propertyData } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .ilike('country', targetCountry)
        .order('domus_score', { ascending: false })
        .limit(6);

      setRelatedProperties(propertyData || []);
      setAiMessage(`AI намери държава: ${targetCountry} (${filteredShelters.length} убежища)`);
    } catch (error) {
      console.error('AI search error:', error);
      setAiMessage('Възникна проблем с AI търсенето.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-[1400px]">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-1">Emergency Housing</h1>
              <p className="text-muted-foreground text-lg">
                Find safe shelter and temporary accommodation during humanitarian crises
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-sm px-3 py-1.5">
              <AlertTriangle className="h-4 w-4 mr-2" />
              War & Conflict
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1.5">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Earthquake
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1.5">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Flood & Natural Disasters
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1.5">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Fire
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1.5">
              <Heart className="h-4 w-4 mr-2" />
              Humanitarian Crisis
            </Badge>
          </div>

          <Badge variant="secondary" className="text-base px-4 py-2">
            {displayedShelters.length} Emergency Shelters {searchCountry !== 'all' ? 'Found' : 'Available Worldwide'}
          </Badge>
        </div>

        {/* AI Search Section (sole search) */}
        <Card className="mb-6 border-primary/20 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Bot className="h-6 w-6" />
              AI Search for Emergency Housing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-center">
                <Input
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Напиши държава, напр. “Find shelters in Germany”"
                  className="h-11 text-base"
                />
                <Button
                  className="h-11 px-6 text-base bg-secondary hover:bg-secondary/90"
                  onClick={handleAiSearch}
                  disabled={aiLoading}
                >
                  {aiLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Bot className="h-5 w-5 mr-2" />}
                  AI Locate
                </Button>
              </div>
              {aiMessage && (
                <p className="text-sm text-muted-foreground">{aiMessage}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Map Section - PRIMARY FOCUS */}
        <Card className="shadow-xl mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <MapPin className="h-6 w-6" />
              Emergency Shelter Locations
              {searchCountry !== 'all' && <span className="text-secondary">in {searchCountry}</span>}
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              Click on any marker to view detailed shelter information
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="h-[680px] flex items-center justify-center">
                <p className="text-muted-foreground text-base">Loading shelter locations...</p>
              </div>
            ) : displayedShelters.length === 0 ? (
              <div className="h-[680px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg m-6">
                <div className="text-center p-8">
                  <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-xl font-medium mb-2">No shelters found</p>
                  <p className="text-muted-foreground text-base">
                    No emergency shelters found for the selected country.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[680px]">
                <EmergencyShelterMap shelters={displayedShelters} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Properties */}
        {searchCountry !== 'all' && relatedProperties.length > 0 && (
          <Card className="border-secondary/30 shadow-md mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Home className="h-6 w-6 text-secondary" />
                    Available Properties in {searchCountry}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Looking for long-term housing? Explore properties for sale in this country.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/properties'}
                  className="border-secondary text-secondary hover:bg-secondary/10 h-10 px-5 text-sm"
                >
                  View All Properties
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Banner */}
        <Alert className="bg-primary/5 border-primary/20 shadow-sm">
          <Heart className="h-5 w-5 text-primary" />
          <AlertDescription className="text-base">
            <span className="font-semibold">This is a humanitarian service.</span> Emergency shelters listed here provide temporary accommodation during crises. 
            This is separate from our property marketplace. If you need to list an emergency shelter, please contact our support team.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default EmergencyHousingPage;
