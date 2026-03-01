import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Heart, TrendingUp, MessageSquare, Search, Sparkles, Map, BarChart3, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { Property } from '@/types';

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
