import React, { useEffect, useState } from 'react';
import { Filter, Home, DollarSign, Bed, MapPin, Bot, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/db/supabase';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { Property } from '@/types';

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

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const COUNTRY_ALIASES: Record<string, string[]> = {
  Bulgaria: ['bulgaria', 'bg', 'bulgariq', 'bulgariya', 'българия'],
  Germany: ['germany', 'de', 'deutschland', 'германия'],
  Spain: ['spain', 'es', 'espana', 'españa', 'испания'],
  France: ['france', 'fr', 'francais', 'français', 'франция'],
  Italy: ['italy', 'it', 'italia', 'италия'],
  Greece: ['greece', 'gr', 'hellas', 'ελλάδα', 'гърция'],
  Romania: ['romania', 'ro', 'romania', 'румъния'],
  Turkey: ['turkey', 'tr', 'turkiye', 'türkiye', 'турция'],
  UK: ['uk', 'united kingdom', 'england', 'great britain', 'британия'],
  USA: ['usa', 'us', 'united states', 'america', 'америка', 'сша'],
};

const canonicalCountryFromText = (input: string) => {
  const normalized = normalizeText(input);
  for (const [country, aliases] of Object.entries(COUNTRY_ALIASES)) {
    if (aliases.some((alias) => normalized.includes(alias))) {
      return country;
    }
  }
  return '';
};

const MapExplorerPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [userLocation, setUserLocation] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedProperties, setMatchedProperties] = useState<Property[]>([]);

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
        .limit(200);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const GEMINI_MODELS = [
    'models/gemini-1.5-flash-002',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro',
    'models/gemini-pro',
  ];

  const callGeminiLocation = async (query: string, apiKey: string) => {
    const prompt = `Return JSON only: {"country":"", "city":""}. Parse location from query: "${query}".`;
    const errors: string[] = [];

    for (const modelName of GEMINI_MODELS) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 256 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return safeParseJson(text);
      }

      const errText = await res.text().catch(() => '');
      if (res.status === 403) {
        throw new Error('Gemini API key is blocked or invalid. Please set a new VITE_GEMINI_API_KEY.');
      }
      errors.push(`${modelName}: ${res.status} ${errText}`);
    }

    throw new Error(`Gemini location error: ${errors.join(' | ')}`);
  };

  const handleAiAssist = async () => {
    if (!userLocation.trim()) return;

    setLoading(true);
    setAiSuggestion('');
    try {
      let extractedCountry = '';
      let extractedCity = '';
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (geminiKey) {
        try {
          const parsed = await callGeminiLocation(userLocation, geminiKey);
          extractedCountry = parsed?.country || '';
          extractedCity = parsed?.city || '';
        } catch (error) {
          console.error('AI extraction failed, falling back to local match:', error);
        }
      }

      const countryFromInput = canonicalCountryFromText(userLocation);
      const country = extractedCountry || countryFromInput || userLocation;
      const city = extractedCity || '';
      const normalizedCountry = normalizeText(country);
      const normalizedCity = normalizeText(city);
      const normalizedQuery = normalizeText(userLocation);

      const results = properties
        .filter((property) => {
          const propertyCountry = normalizeText(property.country || '');
          const propertyCity = normalizeText(property.city || '');
          const propertyTitle = normalizeText(property.title || '');
          const propertyCanonicalCountry = canonicalCountryFromText(property.country || '');

          if (normalizedCity) {
            return propertyCity.includes(normalizedCity);
          }

          if (normalizedCountry) {
            return (
              propertyCountry.includes(normalizedCountry) ||
              normalizeText(propertyCanonicalCountry).includes(normalizedCountry)
            );
          }

          return (
            propertyCountry.includes(normalizedQuery) ||
            propertyCity.includes(normalizedQuery) ||
            propertyTitle.includes(normalizedQuery)
          );
        })
        .sort((a, b) => b.domus_score - a.domus_score);

      setMatchedProperties(results);
      setSelectedProperty(results.length > 0 ? results[0] : null);

      if (results.length === 0) {
        setAiSuggestion(
          `No properties found for "${userLocation}". Try a country name like "Bulgaria", "Germany", or a city like "Sofia".`
        );
        return;
      }

      const preview = results
        .slice(0, 10)
        .map(
          (p, i) =>
            `${i + 1}. ${p.title} (${p.city}, ${p.country}) - €${p.price_eur?.toLocaleString()} - Score ${p.domus_score}`
        )
        .join('\n');

      setAiSuggestion(
        `Found ${results.length} matching properties for "${userLocation}".\n\nTop matches:\n${preview}`
      );
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      setAiSuggestion('Sorry, I encountered an error. Please try again.');
      setMatchedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Map Explorer</h1>
          <p className="text-muted-foreground">
            Discover properties on an interactive map with AI-powered location assistance
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Location Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Where are you looking?</label>
                  <Input
                    placeholder="e.g., Bulgaria, Sofia, Germany..."
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiAssist()}
                  />
                </div>
                <Button
                  onClick={handleAiAssist}
                  disabled={loading || !userLocation.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Get AI Suggestions'
                  )}
                </Button>
                {aiSuggestion && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-line">{aiSuggestion}</p>
                  </div>
                )}
              </CardContent>
            </Card>

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
                  Under EUR 100k
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

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{properties.length}</div>
                  <p className="text-sm text-muted-foreground">Properties with location data</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-[700px]">
              <CardContent className="p-0 h-full">
                <div className="h-full flex items-center justify-center bg-muted/30 rounded-lg relative">
                  <div className="text-center p-8">
                    <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Interactive Map Coming Soon</h3>
                    <p className="text-muted-foreground mb-4 max-w-md">
                      The map UI is ready. AI search now returns improved country/city matches and
                      lists all matched properties below.
                    </p>
                    <Badge variant="secondary">Mapbox API Integration Required</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedProperty && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{selectedProperty.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-medium">
                        {selectedProperty.city}, {selectedProperty.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="font-medium">EUR {selectedProperty.price_eur?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Size</p>
                      <p className="font-medium">{selectedProperty.size_sqm}m2</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">DOMUS Score</p>
                      <Badge variant="default">{selectedProperty.domus_score}/100</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {matchedProperties.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>AI Matched Properties ({matchedProperties.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {matchedProperties.slice(0, 6).map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
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

export default MapExplorerPage;
