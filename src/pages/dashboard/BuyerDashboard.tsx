import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Search, Sparkles, Clock, Eye, Loader2, Globe2, LineChart as LineChartIcon } from 'lucide-react';
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

// Safe JSON parse helper for Gemini responses
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
    maxTokens = 1024
  ) => {
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
          temperature,
          maxOutputTokens: maxTokens,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Gemini API error (${modelName}): ${res.status} ${errText}`);
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
      setAiMessage('Enter a country for analysis.');
      return;
    }

    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!geminiApiKey) {
      setAiMessage('Missing Gemini API key (VITE_GEMINI_API_KEY).');
      return;
    }

    setAiLoading(true);
    setAiMessage(null);
    try {
      const prompt = `
Return ONLY JSON:
{
  "country": "${countryQuery}",
  "currency": "EUR",
  "points": [
    {"year": 2018, "price_per_m2": 1800}
  ]
}
Rules:
- 8 yearly points (oldest to newest)
- numbers only
- no markdown
`;

      const data = await callGemini(prompt, geminiApiKey, 0.2, 1024);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed: any = safeParseJson(text);

      // Retry once with a stricter minimal prompt if first response is malformed
      let finalParsed = parsed;
      if (!finalParsed) {
        const retryPrompt = `JSON only: {"country":"${countryQuery}","currency":"EUR","points":[{"year":2018,"price_per_m2":1800},{"year":2019,"price_per_m2":1850},{"year":2020,"price_per_m2":1900},{"year":2021,"price_per_m2":2000},{"year":2022,"price_per_m2":2100},{"year":2023,"price_per_m2":2200},{"year":2024,"price_per_m2":2300},{"year":2025,"price_per_m2":2400}]}`;
        const retryData = await callGemini(retryPrompt, geminiApiKey, 0.1, 1024);
        const retryText = retryData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        finalParsed = safeParseJson(retryText);
      }
      if (!finalParsed) {
        console.error('AI parse error', text);
        setAiMessage('AI returned invalid JSON. Please try again.');
        setPriceTrend([]);
        return;
      }

      const points = Array.isArray(finalParsed.points)
        ? finalParsed.points
            .map((p: any) => ({
              year: Number(p.year),
              price: Number(p.price_per_m2),
            }))
            .filter((p) => !isNaN(p.year) && !isNaN(p.price))
        : [];

      if (points.length === 0) {
        setAiMessage('AI did not return valid data.');
        setPriceTrend([]);
        return;
      }

      setTrendCurrency(finalParsed.currency || 'EUR');
      setPriceTrend(points.sort((a, b) => a.year - b.year));
      setAiMessage(`Showing data for ${finalParsed.country || countryQuery}.`);
    } catch (err) {
      console.error('AI trend error', err);
      setAiMessage('An error occurred during the AI request.');
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
  const currencyPrefix = trendCurrency === 'EUR' ? '€' : trendCurrency;
  const peakYoY =
    yoySeries.length > 0 ? Math.max(...yoySeries.map((item) => item.change)) : null;
  const avgYoY =
    yoySeries.length > 0
      ? (yoySeries.reduce((sum, item) => sum + item.change, 0) / yoySeries.length).toFixed(1)
      : null;
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/60 via-background to-background">
      <div className="container py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-yellow-700">
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
                <Heart className="h-8 w-8 text-yellow-500" />
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
                <Sparkles className="h-8 w-8 text-yellow-500" />
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
                <Eye className="h-8 w-8 text-yellow-500" />
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
                <MessageSquare className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Market Trends */}
        <Card className="mb-8 border-yellow-200 bg-yellow-50/40">
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
              Enter a country to view historical average property prices (EUR/m2) for recent years.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                value={countryQuery}
                onChange={(e) => setCountryQuery(e.target.value)}
                placeholder="e.g. Germany, Bulgaria, Spain..."
                className="h-11 md:flex-1 text-base"
              />
              <Button
                onClick={handleAiMarketSearch}
                disabled={aiLoading}
                className="h-11 px-5 bg-yellow-500 hover:bg-yellow-600 text-black"
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
                      className="h-full w-full !aspect-auto"
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
                            tickFormatter={(v) => `${currencyPrefix}${Number(v).toLocaleString()}`}
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
                      className="h-full w-full !aspect-auto"
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
                        {currencyPrefix}
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
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">
                        Peak YoY Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{peakYoY !== null ? `${peakYoY}%` : '—'}</p>
                      <p className="text-xs text-muted-foreground">highest annual change</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">
                        Avg YoY Change
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{avgYoY !== null ? `${avgYoY}%` : '—'}</p>
                      <p className="text-xs text-muted-foreground">average annual growth</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No data to display. Run an AI request with a country.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saved Properties */}
        {savedProperties.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart className="h-6 w-6 text-yellow-500" />
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
                <Sparkles className="h-6 w-6 text-yellow-500" />
                Recommended for You
              </h2>
              <Link to="/properties">
                <Button variant="outline">Browse All</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((property) => (
                <div key={property.id} className="relative">
                  <Badge className="absolute top-4 right-4 z-10 bg-yellow-500 text-black">
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
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
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
                    <p className="font-medium">Received message from housing partner</p>
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
                    Home Finder
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
