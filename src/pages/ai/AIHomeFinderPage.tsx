import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Home, DollarSign, MapPin, Users, Heart, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { PropertyCard } from '@/components/property/PropertyCard';
import { supabase } from '@/db/supabase';
import type { Property } from '@/types';

interface AIQuestions {
  budget: number;
  location: string;
  propertyType: string;
  bedrooms: number;
  purpose: string;
  lifestyle: {
    transport: number;
    schools: number;
    nightlife: number;
    quiet: number;
    greenSpaces: number;
  };
}

interface RankedRecommendation {
  property: Property;
  matchScore: number;
}

const normalizeText = (value: string) => value.trim().toLowerCase();

const calculateLocationScore = (property: Property, location: string): number => {
  const wanted = normalizeText(location);
  if (!wanted) return 1;

  const city = normalizeText(property.city || '');
  const country = normalizeText(property.country || '');

  if (!city && !country) return 0;
  if (city === wanted || country === wanted) return 1;
  if (city.includes(wanted) || country.includes(wanted)) return 0.85;
  if (wanted.includes(city) || wanted.includes(country)) return 0.7;
  return 0.2;
};

const calculateBedroomScore = (propertyBedrooms: number | undefined, wantedBedrooms: number): number => {
  const current = propertyBedrooms || 0;
  if (current === wantedBedrooms) return 1;
  if (current > wantedBedrooms) return Math.max(0.75, 1 - (current - wantedBedrooms) * 0.08);
  return Math.max(0.2, 1 - (wantedBedrooms - current) * 0.2);
};

const calculateLifestyleScore = (property: Property, answers: AIQuestions): number => {
  let score = 0.5;

  if (answers.lifestyle.quiet >= 7 && property.type === 'house') score += 0.15;
  if (answers.lifestyle.greenSpaces >= 7 && (property.type === 'house' || property.type === 'land')) score += 0.12;
  if (answers.lifestyle.nightlife >= 7 && property.type === 'apartment') score += 0.12;
  if (answers.lifestyle.transport >= 7 && property.type === 'apartment') score += 0.11;
  if (answers.lifestyle.schools >= 7 && (property.bedrooms || 0) >= 2) score += 0.1;

  return Math.min(1, score);
};

const rankProperties = (properties: Property[], answers: AIQuestions): RankedRecommendation[] => {
  return properties
    .map((property) => {
      const budgetDiff = Math.abs((property.price_eur || 0) - answers.budget);
      const budgetScore = Math.max(0, 1 - budgetDiff / Math.max(answers.budget, 1));
      const locationScore = calculateLocationScore(property, answers.location);
      const typeScore =
        answers.propertyType === 'any' ? 1 : property.type === answers.propertyType ? 1 : 0.25;
      const bedroomScore = calculateBedroomScore(property.bedrooms, answers.bedrooms);
      const domusScore = Math.max(0, Math.min(1, (property.domus_score || 0) / 100));
      const lifestyleScore = calculateLifestyleScore(property, answers);

      const totalScore =
        budgetScore * 0.3 +
        locationScore * 0.25 +
        typeScore * 0.15 +
        bedroomScore * 0.15 +
        domusScore * 0.1 +
        lifestyleScore * 0.05;

      return {
        property,
        matchScore: Math.round(totalScore * 100),
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

const AIHomeFinderPage: React.FC = () => {
  const navigate = useNavigate();
  const actionButtonClass = 'bg-yellow-500 hover:bg-yellow-600 text-black';
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RankedRecommendation[]>([]);
  const [usedClosestMatches, setUsedClosestMatches] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  
  const [answers, setAnswers] = useState<AIQuestions>({
    budget: 150000,
    location: '',
    propertyType: 'apartment',
    bedrooms: 2,
    purpose: 'primary_residence',
    lifestyle: {
      transport: 5,
      schools: 5,
      nightlife: 5,
      quiet: 5,
      greenSpaces: 5,
    },
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleFindHome();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFindHome = async () => {
    setLoading(true);
    try {
      // Query exact matches first
      let exactQuery = supabase
        .from('properties')
        .select('*, broker:profiles!properties_broker_id_fkey(id, name, email, agency_name)')
        .eq('status', 'active')
        .lte('price_eur', answers.budget * 1.1);

      if (answers.location) {
        exactQuery = exactQuery.or(`city.ilike.%${answers.location}%,country.ilike.%${answers.location}%`);
      }

      if (answers.propertyType !== 'any') {
        exactQuery = exactQuery.eq('type', answers.propertyType);
      }

      if (answers.bedrooms > 0) {
        exactQuery = exactQuery.gte('bedrooms', answers.bedrooms);
      }

      exactQuery = exactQuery.order('domus_score', { ascending: false }).limit(12);

      const { data: exactData, error: exactError } = await exactQuery;

      if (exactError) throw exactError;

      const exactMatches = exactData || [];
      let rankedMatches = rankProperties(exactMatches, answers).slice(0, 6);
      let fallbackUsed = false;

      if (rankedMatches.length === 0) {
        fallbackUsed = true;
        let broadQuery = supabase
          .from('properties')
          .select('*, broker:profiles!properties_broker_id_fkey(id, name, email, agency_name)')
          .eq('status', 'active')
          .lte('price_eur', answers.budget * 1.8)
          .order('domus_score', { ascending: false })
          .limit(120);

        const { data: broadData, error: broadError } = await broadQuery;
        if (broadError) throw broadError;

        rankedMatches = rankProperties(broadData || [], answers).slice(0, 6);
      }

      setUsedClosestMatches(fallbackUsed);
      setRecommendations(rankedMatches);

      const explanation =
        rankedMatches.length > 0
          ? `${fallbackUsed
              ? `I couldn't find exact matches, so I ranked the closest available properties by compatibility score.\n\n`
              : `I found ${rankedMatches.length} properties that match your criteria.\n\n`}` +
            `✓ Budget: Up to €${answers.budget.toLocaleString()}\n` +
            `✓ Location: ${answers.location || 'Any location'}\n` +
            `✓ Property Type: ${answers.propertyType}\n` +
            `✓ Bedrooms: ${answers.bedrooms}+\n` +
            `✓ Purpose: ${answers.purpose.replace('_', ' ')}\n\n` +
            `Results are ranked by budget fit, location relevance, property type, bedrooms, DOMUS score, and lifestyle priorities.`
          : `No suitable properties were found at the moment. Try increasing budget range or selecting "Any Type".`;

      setAiExplanation(explanation);
      setStep(5);
    } catch (error) {
      console.error('Error finding homes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/70 via-background to-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Bot className="h-12 w-12 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-yellow-700">Perfect Home Finder</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions and get your best property match
          </p>
        </div>

        {/* Progress Indicator */}
        {step < 5 && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Step {step} of 4</span>
              <span className="text-sm text-muted-foreground">{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-500 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {/* Step 1: Budget & Location */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                  Budget & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-4 block">What's your budget?</Label>
                  <div className="space-y-4">
                    <Slider
                      value={[answers.budget]}
                      onValueChange={(value) => setAnswers({ ...answers, budget: value[0] })}
                      min={50000}
                      max={5000000}
                      step={10000}
                    />
                    <div className="text-center">
                      <span className="text-2xl font-bold text-yellow-700">
                        €{answers.budget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="location" className="mb-2 block">
                    Preferred location (city or country)
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Sofia, Barcelona, Greece..."
                    value={answers.location}
                    onChange={(e) => setAnswers({ ...answers, location: e.target.value })}
                  />
                </div>
                <Button onClick={handleNext} className={`w-full ${actionButtonClass}`} size="lg">
                  Next Step
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Property Type & Size */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-6 w-6 text-yellow-600" />
                  Property Type & Size
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">What type of property?</Label>
                  <RadioGroup
                    value={answers.propertyType}
                    onValueChange={(value) => setAnswers({ ...answers, propertyType: value })}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="apartment" id="apartment" />
                      <Label htmlFor="apartment" className="flex-1 cursor-pointer">Apartment</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="house" id="house" />
                      <Label htmlFor="house" className="flex-1 cursor-pointer">House</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any" className="flex-1 cursor-pointer">Any Type</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label className="mb-3 block">How many bedrooms?</Label>
                  <Select
                    value={answers.bedrooms.toString()}
                    onValueChange={(value) => setAnswers({ ...answers, bedrooms: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleBack} variant="outline" className="flex-1">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button onClick={handleNext} className={`flex-1 ${actionButtonClass}`}>
                    Next Step
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Purpose */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-yellow-600" />
                  Purpose & Lifestyle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">What's your purpose?</Label>
                  <RadioGroup
                    value={answers.purpose}
                    onValueChange={(value) => setAnswers({ ...answers, purpose: value })}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="primary_residence" id="primary" />
                      <Label htmlFor="primary" className="flex-1 cursor-pointer">Primary Residence</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="investment" id="investment" />
                      <Label htmlFor="investment" className="flex-1 cursor-pointer">Investment</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <RadioGroupItem value="vacation_home" id="vacation" />
                      <Label htmlFor="vacation" className="flex-1 cursor-pointer">Vacation Home</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleBack} variant="outline" className="flex-1">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button onClick={handleNext} className={`flex-1 ${actionButtonClass}`}>
                    Next Step
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Lifestyle Preferences */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-yellow-600" />
                  Lifestyle Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Rate the importance of each factor (1 = Not Important, 10 = Very Important)
                </p>
                
                {Object.entries({
                  transport: 'Proximity to Public Transport',
                  schools: 'Schools Nearby',
                  nightlife: 'Nightlife & Restaurants',
                  quiet: 'Quiet Neighborhood',
                  greenSpaces: 'Green Spaces & Parks',
                }).map(([key, label]) => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <Label>{label}</Label>
                      <Badge variant="secondary">
                        {answers.lifestyle[key as keyof typeof answers.lifestyle]}/10
                      </Badge>
                    </div>
                    <Slider
                      value={[answers.lifestyle[key as keyof typeof answers.lifestyle]]}
                      onValueChange={(value) => 
                        setAnswers({
                          ...answers,
                          lifestyle: { ...answers.lifestyle, [key]: value[0] }
                        })
                      }
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleBack} variant="outline" className="flex-1">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button onClick={handleNext} className={`flex-1 ${actionButtonClass}`} disabled={loading}>
                    {loading ? 'Finding Your Perfect Home...' : 'Find My Perfect Home'}
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Results */}
          {step === 5 && (
            <div className="space-y-6">
              {/* AI Explanation */}
              <Card className="bg-gradient-to-br from-yellow-100/80 to-yellow-50/70 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-yellow-600" />
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-sm">{aiExplanation}</p>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {recommendations.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold">
                    {usedClosestMatches ? 'Closest Matches To Your Needs' : 'Your Perfect Matches'}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {recommendations.map((recommendation, index) => (
                      <div key={recommendation.property.id} className="relative">
                        <Badge className="absolute top-4 right-4 z-10">
                          {recommendation.matchScore}% Match
                        </Badge>
                        <PropertyCard property={recommendation.property} />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      No properties found matching your exact criteria. Try adjusting your preferences.
                    </p>
                    <Button onClick={() => setStep(1)}>Start Over</Button>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Start New Search
                </Button>
                <Button onClick={() => navigate('/properties')} className={`flex-1 ${actionButtonClass}`}>
                  Browse All Properties
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIHomeFinderPage;
