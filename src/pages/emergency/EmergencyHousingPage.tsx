import React, { useEffect, useState } from 'react';
import { MapPin, Shield, Home, AlertTriangle, Heart, Loader2, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/db/supabase';
import { EmergencyShelterMap } from '@/components/map/EmergencyShelterMap';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { EmergencyShelter } from '@/types/emergency';
import type { Property } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Safely parse Gemini JSON replies (tolerates wrappers / partials)
const safeParseJson = (text: string) => {
  if (!text) return null;
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
};

const EmergencyHousingPage: React.FC = () => {
  const { profile } = useAuth();
  const [allShelters, setAllShelters] = useState<EmergencyShelter[]>([]);
  const [displayedShelters, setDisplayedShelters] = useState<EmergencyShelter[]>([]);
  const [searchCountry, setSearchCountry] = useState('all');
  const [loading, setLoading] = useState(false);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [savingShelter, setSavingShelter] = useState(false);
  const [newShelter, setNewShelter] = useState({
    name: '',
    country: '',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
    description: '',
  });

  const callGemini = async (prompt: string, apiKey: string, maxOutputTokens = 1024) => {
    // List models (v1) and pick a supported one
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    if (!listRes.ok) {
      const errText = await listRes.text().catch(() => '');
      throw new Error(`Gemini list error: ${listRes.status} ${errText}`);
    }
    const list = await listRes.json();
    const models: string[] =
      list?.models?.map((m: any) => m.name).filter((n: string) => n) || [];

    const pick =
      models.find((m) => m.includes('gemini-1.5-flash-002')) ||
      models.find((m) => m.includes('gemini-1.5-flash-001')) ||
      models.find((m) => m.includes('gemini-1.5-flash')) ||
      models.find((m) => m.includes('gemini-1.5-pro')) ||
      models.find((m) => m.includes('gemini-pro')) ||
      models[0];

    if (!pick) throw new Error('Gemini API error: no available models returned');

    const modelName = pick.startsWith('models/') ? pick : `models/${pick}`;

    const url = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Gemini API error (${modelName}): ${res.status} ${errText}`);
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

  const handleAddShelter = async () => {
    if (profile?.account_type !== 'broker') return;
    if (!newShelter.name || !newShelter.country || !newShelter.city || !newShelter.address) {
      setAiMessage('Please fill shelter name, country, city, and address.');
      return;
    }

    const latitude = Number(newShelter.latitude);
    const longitude = Number(newShelter.longitude);
    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      setAiMessage('Please enter valid coordinates for the new shelter.');
      return;
    }

    setSavingShelter(true);
    try {
      const { error } = await supabase.from('emergency_shelters').insert({
        name: newShelter.name,
        country: newShelter.country,
        city: newShelter.city,
        address: newShelter.address,
        latitude,
        longitude,
        description: newShelter.description || null,
        shelter_type: 'emergency_shelter',
        status: 'active',
        accepts_families: true,
        accepts_pets: false,
        wheelchair_accessible: false,
        crisis_types: ['humanitarian_crisis'],
      });

      if (error) throw error;

      setNewShelter({
        name: '',
        country: '',
        city: '',
        address: '',
        latitude: '',
        longitude: '',
        description: '',
      });
      setAiMessage('New shelter was added successfully.');
      await loadAllShelters();
    } catch (error) {
      console.error('Error adding shelter:', error);
      setAiMessage('Failed to add shelter. Check your Supabase policies.');
    } finally {
      setSavingShelter(false);
    }
  };

  const handleAiSearch = async () => {
    if (!aiQuery.trim()) {
      setAiMessage('Enter a country or region for AI search.');
      return;
    }

    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!geminiApiKey) {
      setAiMessage('Missing Gemini API key. Set VITE_GEMINI_API_KEY in .env.');
      return;
    }

    setAiLoading(true);
    setAiMessage(null);

    try {
      const countryPrompt = `
Extract country from user query. Return ONLY JSON:
{"countries":["Country"]}
User query: "${aiQuery}"`;

      const countryData = await callGemini(countryPrompt, geminiApiKey, 256);
      const countryText = countryData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      let countryParsed: any = safeParseJson(countryText);
      if (!countryParsed) {
        const retryCountryData = await callGemini(`JSON only: {"countries":["Bulgaria"]}. Query: ${aiQuery}`, geminiApiKey, 256);
        const retryCountryText = retryCountryData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        countryParsed = safeParseJson(retryCountryText);
      }
      if (!countryParsed) {
        console.error('Failed to parse Gemini country response', countryText);
        setAiMessage('AI did not return a valid country. Please try again.');
        return;
      }

      const countriesFromAi: string[] = Array.isArray(countryParsed?.countries)
        ? countryParsed.countries
        : [];

      if (countriesFromAi.length === 0) {
        setAiMessage('AI could not recognize a country. Please try again.');
        return;
      }

      // Filter shelters by the first detected country
      const targetCountry = countriesFromAi[0];
      setSearchCountry(targetCountry);

      const filteredShelters = allShelters.filter(
        (shelter) => shelter.country.toLowerCase() === targetCountry.toLowerCase()
      );

      const suggestionsPrompt = `
For country "${targetCountry}", return up to 12 emergency shelter marker suggestions.
Return ONLY JSON:
{
  "suggestions":[
    {"name":"...", "city":"...", "country":"${targetCountry}", "address":"...", "latitude":0, "longitude":0}
  ]
}
Skip entries without coordinates.`;

      const suggestionsData = await callGemini(suggestionsPrompt, geminiApiKey, 1536);
      const suggestionsText = suggestionsData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      let suggestionsParsed: any = safeParseJson(suggestionsText);
      if (!suggestionsParsed) {
        const retrySuggestionsData = await callGemini(
          `JSON only for ${targetCountry}: {"suggestions":[{"name":"Emergency Shelter","city":"City","country":"${targetCountry}","address":"Address","latitude":42.0,"longitude":23.0}]}`,
          geminiApiKey,
          1024
        );
        const retrySuggestionsText = retrySuggestionsData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        suggestionsParsed = safeParseJson(retrySuggestionsText);
      }
      const suggestions: any[] = Array.isArray(suggestionsParsed?.suggestions)
        ? suggestionsParsed.suggestions
        : [];

      const aiShelters: EmergencyShelter[] = suggestions
        .map((sugg, idx) => {
          const lat = Number(sugg.latitude);
          const lng = Number(sugg.longitude);
          if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
          return {
            id: `ai-${Date.now()}-${idx}`,
            name: sugg.name || 'AI Suggested Shelter',
            address: sugg.address || `${sugg.city || ''} ${sugg.country || ''}`.trim(),
            city: sugg.city || targetCountry,
            country: sugg.country || targetCountry,
            latitude: lat,
            longitude: lng,
            shelter_type: 'AI_SUGGESTED',
            status: 'active',
            capacity: null,
            available_beds: null,
            description: sugg.description || 'AI suggested location',
            contact_phone: null,
            accepts_families: null,
            accepts_pets: null,
            wheelchair_accessible: null,
            crisis_types: null,
          } as EmergencyShelter;
        })
        .filter(Boolean) as EmergencyShelter[];

      setDisplayedShelters([...filteredShelters, ...aiShelters]);

      const { data: propertyData } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .ilike('country', targetCountry)
        .order('domus_score', { ascending: false })
        .limit(6);

      setRelatedProperties(propertyData || []);
      setAiMessage(
        `AI detected country: ${targetCountry} (${filteredShelters.length} in database, ${aiShelters.length} AI suggestions)`
      );
    } catch (error) {
      console.error('AI search error:', error);
      setAiMessage('An error occurred during AI search.');
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
                  placeholder='Type a country, e.g. "Find shelters in Germany"'
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

        {profile?.account_type === 'broker' && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50/40 shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-yellow-700">
                Housing Partner: Add Emergency Shelter Marker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  placeholder="Shelter name"
                  value={newShelter.name}
                  onChange={(e) => setNewShelter({ ...newShelter, name: e.target.value })}
                />
                <Input
                  placeholder="Country"
                  value={newShelter.country}
                  onChange={(e) => setNewShelter({ ...newShelter, country: e.target.value })}
                />
                <Input
                  placeholder="City"
                  value={newShelter.city}
                  onChange={(e) => setNewShelter({ ...newShelter, city: e.target.value })}
                />
                <Input
                  placeholder="Address"
                  value={newShelter.address}
                  onChange={(e) => setNewShelter({ ...newShelter, address: e.target.value })}
                />
                <Input
                  placeholder="Latitude"
                  value={newShelter.latitude}
                  onChange={(e) => setNewShelter({ ...newShelter, latitude: e.target.value })}
                />
                <Input
                  placeholder="Longitude"
                  value={newShelter.longitude}
                  onChange={(e) => setNewShelter({ ...newShelter, longitude: e.target.value })}
                />
              </div>
              <Input
                placeholder="Description (optional)"
                value={newShelter.description}
                onChange={(e) => setNewShelter({ ...newShelter, description: e.target.value })}
              />
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={handleAddShelter}
                disabled={savingShelter}
              >
                {savingShelter ? 'Saving...' : 'Add Shelter Marker'}
              </Button>
            </CardContent>
          </Card>
        )}

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
