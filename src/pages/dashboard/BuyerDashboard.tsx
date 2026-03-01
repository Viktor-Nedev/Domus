import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Heart, MessageSquare, Search, Sparkles, Map, BarChart3, Clock, Eye, Loader2, Globe2, LineChart as LineChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { Property } from '@/types';
import { Input } from '@/components/ui/input';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  CartesianGrid,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
} from 'recharts';

const BuyerDashboardRedesigned: React.FC = () => {
  const { user, profile } = useAuth();
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);
  const [recommendations, setRecommendations] = useState<Property[]>([]);
  const [stats, setStats] = useState({
    savedCount: 0,
    viewedCount: 0,
    newMatches: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [countryQuery, setCountryQuery] = useState('');
  const [priceTrend, setPriceTrend] = useState<
    { year: number; price: number }[]
  >([]);
  const [trendCurrency, setTrendCurrency] = useState('€');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const callGemini = async (
    prompt: string,
    apiKey: string,
    temperature = 0.3,
    maxTokens = 300
  ) => {
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
          generationConfig: { temperature, maxOutputTokens: maxTokens },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Gemini API error: ${res.status} ${errText}`);
    }

    return res.json();
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load saved properties
      const { data: savedData } = await supabase
        .from('saved_properties')
        .select('property:properties(*, broker:profiles!properties_broker_id_fkey(id, name, email, agency_name))')
        .eq('user_id', user.id)
        .order('saved_date', { ascending: false })
        .limit(3);

      if (savedData) {
        const properties = savedData.map((item: any) => item.property).filter(Boolean);
        setSavedProperties(properties);
        setStats(prev => ({ ...prev, savedCount: savedData.length }));
      }

      // Load recommendations (high DOMUS score properties)
      const { data: recommendationsData } = await supabase
        .from('properties')
        .select('*, broker:profiles!properties_broker_id_fkey(id, name, email, agency_name)')
        .eq('status', 'active')
        .gte('domus_score', 80)
        .order('domus_score', { ascending: false })
        .limit(3);

      if (recommendationsData) {
        setRecommendations(recommendationsData);
        setStats(prev => ({ ...prev, newMatches: recommendationsData.length }));
      }

      // Load unread messages count
      const { data: conversationsData } = await supabase
        .from('conversations')
        .select('unread_count_1, unread_count_2, participant_1_id')
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`);

      if (conversationsData) {
        const unreadCount = conversationsData.reduce((sum: number, conv: any) => {
          return sum + (conv.participant_1_id === user.id ? conv.unread_count_1 : conv.unread_count_2);
        }, 0);
        setStats(prev => ({ ...prev, unreadMessages: unreadCount }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAiMarketSearch = async () => {
    if (!countryQuery.trim()) {
      setAiMessage('Въведи държава за анализ.');
      return;
    }

    const geminiApiKey =
      import.meta.env.VITE_GEMINI_API_KEY ||
      'AIzaSyAOZVXfJIuHT_PFcYGFAG1dCDXb7rRF18A';
    if (!geminiApiKey) {
      setAiMessage('Липсва Gemini API ключ (VITE_GEMINI_API_KEY).');
      return;
    }

    setAiLoading(true);
    setAiMessage(null);
    try {
      const prompt = `
        You are a real estate data assistant.
        For the country "${countryQuery}", provide historical residential property price per square meter (average) for the last 8 years (most recent year included).
        Respond ONLY with compact JSON:
        {
          "country": "<name>",
          "currency": "€",
          "points": [
            {"year": 2018, "price_per_m2": 1800},
            ...
          ]
        }
        Use best available public/global index data; if specific numbers are uncertain, estimate realistic European-level prices.
        Do not include any extra text or code fences.
      `;

      const data = await callGemini(prompt, geminiApiKey, 0.3, 300);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);

      const points = Array.isArray(parsed.points)
        ? parsed.points
            .map((p: any) => ({
              year: Number(p.year),
              price: Number(p.price_per_m2),
            }))
            .filter((p) => !isNaN(p.year) && !isNaN(p.price))
        : [];

      if (points.length === 0) {
        setAiMessage('AI не върна валидни данни.');
        setPriceTrend([]);
        return;
      }

      setTrendCurrency(parsed.currency || '€');
      setPriceTrend(points.sort((a, b) => a.year - b.year));
      setAiMessage(`Показани са данни за ${parsed.country || countryQuery}.`);
    } catch (err) {
      console.error('AI trend error', err);
      setAiMessage('Възникна грешка при AI заявката.');
      setPriceTrend([]);
    } finally {
      setAiLoading(false);
    }
  };

  const yoySeries = useMemo(() => {
    if (priceTrend.length < 2) return [];
    return priceTrend.slice(1).map((point, idx) => {
      const prev = priceTrend[idx].price;
      const change = prev === 0 ? 0 : ((point.price - prev) / prev) * 100;
      return { year: point.year, change: Number(change.toFixed(1)) };
    });
  }, [priceTrend]);

  const latestPrice = priceTrend.at(-1)?.price;
  const firstPrice = priceTrend[0]?.price;
  const cagr =
    priceTrend.length >= 2
      ? (
          (Math.pow(
            (latestPrice || 0) / (firstPrice || 1),
            1 / (priceTrend.length - 1)
          ) -
            1) *
          100
        ).toFixed(1)
      : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {profile?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's your personalized property dashboard
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saved Properties</p>
                  <p className="text-3xl font-bold">{stats.savedCount}</p>
                </div>
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">New Matches</p>
                  <p className="text-3xl font-bold">{stats.newMatches}</p>
                </div>
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recently Viewed</p>
                  <p className="text-3xl font-bold">{stats.viewedCount}</p>
                </div>
                <Eye className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread Messages</p>
                  <p className="text-3xl font-bold">{stats.unreadMessages}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Market Trends */}
        <Card className="mb-8">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <LineChartIcon className="h-5 w-5" />
                Market Price Trends (AI)
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                Powered by Gemini
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Въведи държава, за да видиш исторически средни цени на имоти (€/m²) за последните години.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                value={countryQuery}
                onChange={(e) => setCountryQuery(e.target.value)}
                placeholder="напр. Germany, Bulgaria, Spain..."
                className="h-11 md:flex-1 text-base"
              />
              <Button
                onClick={handleAiMarketSearch}
                disabled={aiLoading}
                className="h-11 px-5"
              >
                {aiLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Globe2 className="h-4 w-4 mr-2" />
                )}
                AI Analyze
              </Button>
            </div>
            {aiMessage && (
              <p className="text-sm text-muted-foreground">{aiMessage}</p>
            )}

            {priceTrend.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-72">
                    <ChartContainer
                      config={
                        {
                          price: { label: '€/m²', color: 'hsl(var(--primary))' },
                        } as ChartConfig
                      }
                    >
                      <ResponsiveContainer>
                        <LineChart data={priceTrend}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                          <XAxis dataKey="year" stroke="var(--muted-foreground)" />
                          <YAxis
                            dataKey="price"
                            stroke="var(--muted-foreground)"
                            tickFormatter={(v) => `${trendCurrency}${v}`}
                          />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="var(--color-price)"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <div className="h-60">
                    <ChartContainer
                      config={
                        {
                          change: { label: 'YoY %', color: 'hsl(var(--secondary))' },
                        } as ChartConfig
                      }
                    >
                      <ResponsiveContainer>
                        <BarChart data={yoySeries}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                          <XAxis dataKey="year" stroke="var(--muted-foreground)" />
                          <YAxis tickFormatter={(v) => `${v}%`} stroke="var(--muted-foreground)" />
                          <Tooltip
                            content={
                              <ChartTooltipContent
                                labelFormatter={(v) => `Year ${v}`}
                                formatter={(val) => [`${val}%`, 'YoY change']}
                              />
                            }
                          />
                          <Bar dataKey="change" fill="var(--color-change)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">
                        Latest price
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {trendCurrency}
                        {latestPrice?.toLocaleString() || '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">per m² (most recent year)</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">
                        CAGR (period)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {cagr ? `${cagr}%` : '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Based on first vs. latest year
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">
                        Data points
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{priceTrend.length}</p>
                      <p className="text-xs text-muted-foreground">years of history</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Няма данни за показване. Изпълни AI заявка с държава.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/ai-finder">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <Sparkles className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI Home Finder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Answer a few questions and let AI find your perfect property match
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/map">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <Map className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Map Explorer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore properties on an interactive map with AI location assistance
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/market">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Market Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View market trends, price analytics, and investment insights
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Saved Properties */}
        {savedProperties.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                Your Saved Properties
              </h2>
              <Link to="/dashboard/saved">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Recommended for You
              </h2>
              <Link to="/properties">
                <Button variant="outline">Browse All</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((property) => (
                <div key={property.id} className="relative">
                  <Badge className="absolute top-4 right-4 z-10 bg-primary">
                    {property.domus_score}/100
                  </Badge>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">Saved a property in Sofia</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <div>
                    <p className="font-medium">Viewed 3 properties in Barcelona</p>
                    <p className="text-sm text-muted-foreground">Yesterday</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  <div>
                    <p className="font-medium">Received message from broker</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {savedProperties.length === 0 && recommendations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Your Property Search</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Use our AI-powered tools to find your perfect property match
              </p>
              <div className="flex gap-3 justify-center">
                <Link to="/ai-finder">
                  <Button>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Home Finder
                  </Button>
                </Link>
                <Link to="/properties">
                  <Button variant="outline">Browse Properties</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboardRedesigned;
