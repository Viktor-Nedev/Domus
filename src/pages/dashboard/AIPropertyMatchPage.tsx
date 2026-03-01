import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Home, DollarSign, Bed } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyCard } from '@/components/property/PropertyCard';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { saveBuyerPreferences } from '@/db/api';
import { supabase } from '@/db/supabase';
import type { PropertyMatch } from '@/types';

const AIPropertyMatchPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<PropertyMatch[]>([]);

  // Step 1: Budget and basics
  const [budgetMin, setBudgetMin] = useState('50000');
  const [budgetMax, setBudgetMax] = useState('300000');
  const [propertyTypes, setPropertyTypes] = useState<string[]>(['apartment']);
  const [countries, setCountries] = useState<string[]>(['Bulgaria']);
  const [cities, setCities] = useState('');
  const [purpose, setPurpose] = useState<'investment' | 'primary_residence' | 'vacation_home'>('primary_residence');
  const [bedroomsMin, setBedroomsMin] = useState('1');
  const [bedroomsMax, setBedroomsMax] = useState('4');
  const [sizeMin, setSizeMin] = useState('50');
  const [sizeMax, setSizeMax] = useState('150');

  // Step 2: Lifestyle preferences (1-10 scale)
  const [proximityTransport, setProximityTransport] = useState([5]);
  const [proximitySchools, setProximitySchools] = useState([5]);
  const [proximityNightlife, setProximityNightlife] = useState([5]);
  const [proximityQuiet, setProximityQuiet] = useState([5]);
  const [proximityGreen, setProximityGreen] = useState([5]);
  const [proximityShopping, setProximityShopping] = useState([5]);
  const [proximityMedical, setProximityMedical] = useState([5]);

  const handlePropertyTypeToggle = (type: string) => {
    setPropertyTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleCountryToggle = (country: string) => {
    setCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!budgetMin || !budgetMax || propertyTypes.length === 0 || countries.length === 0) {
        toast.error('Моля, попълнете всички задължителни полета');
        return;
      }
      setStep(2);
    }
  };

  const handleFindMatches = async () => {
    if (!user) {
      toast.error('Моля, влезте в профила си');
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      // Save preferences
      const citiesArray = cities.split(',').map(c => c.trim()).filter(c => c);
      
      await saveBuyerPreferences(user.id, {
        budget_min: parseFloat(budgetMin),
        budget_max: parseFloat(budgetMax),
        property_types: propertyTypes as any[],
        countries,
        cities: citiesArray.length > 0 ? citiesArray : undefined,
        purpose,
        bedrooms_min: parseInt(bedroomsMin),
        bedrooms_max: parseInt(bedroomsMax),
        size_min: parseFloat(sizeMin),
        size_max: parseFloat(sizeMax),
        proximity_transport: proximityTransport[0],
        proximity_schools: proximitySchools[0],
        proximity_nightlife: proximityNightlife[0],
        proximity_quiet: proximityQuiet[0],
        proximity_green: proximityGreen[0],
        proximity_shopping: proximityShopping[0],
        proximity_medical: proximityMedical[0],
      });

      // Call AI matcher
      const { data, error } = await supabase.functions.invoke('ai-matcher', {
        body: { userId: user.id },
      });

      if (error) throw error;

      if (data?.matches) {
        setMatches(data.matches);
        setStep(3);
        toast.success(`Намерихме ${data.matches.length} имота, които отговарят на вашите критерии!`);
      }
    } catch (error: any) {
      console.error('Error finding matches:', error);
      toast.error('Грешка при търсене на имоти');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">AI Съвпадение на Имоти</h1>
          <p className="text-muted-foreground">
            Нашият AI ще намери перфектния DOMUS за вас
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              1
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              2
            </div>
            <div className={`h-1 w-16 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Basic Preferences */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Вашият DOMUS Профил</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Budget */}
              <div>
                <Label className="text-lg mb-4 block">Бюджет (EUR)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget-min">Минимум</Label>
                    <Input
                      id="budget-min"
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget-max">Максимум</Label>
                    <Input
                      id="budget-max"
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <Label className="text-lg mb-4 block">Тип имот</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'apartment', label: 'Апартамент', icon: Home },
                    { value: 'house', label: 'Къща', icon: Home },
                    { value: 'land', label: 'Земя', icon: MapPin },
                    { value: 'commercial', label: 'Търговски', icon: DollarSign },
                  ].map((type) => (
                    <div
                      key={type.value}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        propertyTypes.includes(type.value) ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handlePropertyTypeToggle(type.value)}
                    >
                      <Checkbox
                        checked={propertyTypes.includes(type.value)}
                        onCheckedChange={() => handlePropertyTypeToggle(type.value)}
                      />
                      <type.icon className="h-4 w-4" />
                      <Label className="cursor-pointer">{type.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countries */}
              <div>
                <Label className="text-lg mb-4 block">Локация (държави)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Bulgaria', 'Spain', 'Italy', 'Greece', 'Romania', 'Turkey'].map((country) => (
                    <div
                      key={country}
                      className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        countries.includes(country) ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      onClick={() => handleCountryToggle(country)}
                    >
                      <Checkbox
                        checked={countries.includes(country)}
                        onCheckedChange={() => handleCountryToggle(country)}
                      />
                      <Label className="cursor-pointer">{country}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div>
                <Label htmlFor="cities">Градове (опционално, разделени със запетая)</Label>
                <Input
                  id="cities"
                  value={cities}
                  onChange={(e) => setCities(e.target.value)}
                  placeholder="напр. Sofia, Barcelona, Rome"
                />
              </div>

              {/* Purpose */}
              <div>
                <Label htmlFor="purpose">Цел на покупката</Label>
                <Select value={purpose} onValueChange={(v: any) => setPurpose(v)}>
                  <SelectTrigger id="purpose">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investment">Инвестиция</SelectItem>
                    <SelectItem value="primary_residence">Основно жилище</SelectItem>
                    <SelectItem value="vacation_home">Ваканционен дом</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div>
                <Label className="text-lg mb-4 block">Брой спални</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms-min">Минимум</Label>
                    <Input
                      id="bedrooms-min"
                      type="number"
                      value={bedroomsMin}
                      onChange={(e) => setBedroomsMin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bedrooms-max">Максимум</Label>
                    <Input
                      id="bedrooms-max"
                      type="number"
                      value={bedroomsMax}
                      onChange={(e) => setBedroomsMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Size */}
              <div>
                <Label className="text-lg mb-4 block">Площ (кв.м)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="size-min">Минимум</Label>
                    <Input
                      id="size-min"
                      type="number"
                      value={sizeMin}
                      onChange={(e) => setSizeMin(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="size-max">Максимум</Label>
                    <Input
                      id="size-max"
                      type="number"
                      value={sizeMax}
                      onChange={(e) => setSizeMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleNextStep} className="w-full" size="lg">
                Следваща стъпка
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Lifestyle Preferences */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Предпочитания за начин на живот</CardTitle>
              <p className="text-sm text-muted-foreground">
                Какво прави един DOMUS идеален за вас? (1 = не е важно, 10 = много важно)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Близост до обществен транспорт</Label>
                  <span className="text-sm font-semibold">{proximityTransport[0]}/10</span>
                </div>
                <Slider
                  value={proximityTransport}
                  onValueChange={setProximityTransport}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Училища наблизо</Label>
                  <span className="text-sm font-semibold">{proximitySchools[0]}/10</span>
                </div>
                <Slider
                  value={proximitySchools}
                  onValueChange={setProximitySchools}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Нощен живот и ресторанти</Label>
                  <span className="text-sm font-semibold">{proximityNightlife[0]}/10</span>
                </div>
                <Slider
                  value={proximityNightlife}
                  onValueChange={setProximityNightlife}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Тих квартал</Label>
                  <span className="text-sm font-semibold">{proximityQuiet[0]}/10</span>
                </div>
                <Slider
                  value={proximityQuiet}
                  onValueChange={setProximityQuiet}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Зелени площи и паркове</Label>
                  <span className="text-sm font-semibold">{proximityGreen[0]}/10</span>
                </div>
                <Slider
                  value={proximityGreen}
                  onValueChange={setProximityGreen}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Търговски центрове</Label>
                  <span className="text-sm font-semibold">{proximityShopping[0]}/10</span>
                </div>
                <Slider
                  value={proximityShopping}
                  onValueChange={setProximityShopping}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Медицински заведения</Label>
                  <span className="text-sm font-semibold">{proximityMedical[0]}/10</span>
                </div>
                <Slider
                  value={proximityMedical}
                  onValueChange={setProximityMedical}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Назад
                </Button>
                <Button onClick={handleFindMatches} className="flex-1" size="lg" disabled={loading}>
                  {loading ? 'Търсене...' : 'Намери моя DOMUS'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-6 w-6 mr-2 text-primary" />
                  AI Анализ завършен!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Намерихме <span className="font-bold text-primary">{matches.length} имота</span>, които отговарят на вашите критерии.
                  Всеки имот е оценен според вашите предпочитания.
                </p>
                <Button onClick={() => setStep(1)} variant="outline">
                  Промени критериите
                </Button>
              </CardContent>
            </Card>

            {matches.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {matches.map((match) => (
                  <div key={match.property.id} className="relative">
                    <PropertyCard
                      property={match.property}
                      showMatchScore
                      matchScore={match.match_score}
                    />
                    <Card className="mt-2 bg-primary/5 border-primary/20">
                      <CardContent className="pt-4">
                        <p className="text-sm font-semibold mb-2">Защо този имот ви подхожда:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {match.reasons.map((reason, idx) => (
                            <li key={idx}>• {reason}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    Не намерихме имоти, които отговарят на всички ваши критерии.
                  </p>
                  <Button onClick={() => setStep(1)}>
                    Промени критериите
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPropertyMatchPage;
