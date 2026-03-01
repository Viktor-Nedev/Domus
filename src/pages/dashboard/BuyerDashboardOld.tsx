import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, TrendingUp, Heart, Bell, MessageSquare, User, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { getTopProperties, getSavedProperties, getUnreadCount } from '@/db/api';
import type { Property, SavedProperty } from '@/types';

const BuyerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [properties, saved, unread] = await Promise.all([
        getTopProperties(3),
        profile ? getSavedProperties(profile.id) : Promise.resolve([]),
        profile ? getUnreadCount(profile.id) : Promise.resolve(0),
      ]);

      setRecommendedProperties(properties);
      setSavedCount(saved.length);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Salve, {profile?.name}! Welcome to DOMUS
          </h1>
          <p className="text-muted-foreground">Your personal real estate intelligence dashboard</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Deals This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recommendedProperties.length}</div>
              <p className="text-xs text-muted-foreground">Properties matching your criteria</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savedCount}</div>
              <p className="text-xs text-muted-foreground">In your favorites</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/dashboard/match">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
              <Search className="h-6 w-6 mb-2" />
              <span className="text-sm">AI Property Match</span>
            </Button>
          </Link>
          <Link to="/market">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm">Market Analytics</span>
            </Button>
          </Link>
          <Link to="/dashboard/saved">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
              <Heart className="h-6 w-6 mb-2" />
              <span className="text-sm">Saved Properties</span>
            </Button>
          </Link>
          <Link to="/messages">
            <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center">
              <MessageSquare className="h-6 w-6 mb-2" />
              <span className="text-sm">Messages</span>
            </Button>
          </Link>
        </div>

        {/* Recommended Properties */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recommended for You</h2>
            <Link to="/dashboard/match">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading properties...</div>
          ) : recommendedProperties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">No recommendations yet</p>
                <Link to="/dashboard/match">
                  <Button>Set Your Preferences</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
