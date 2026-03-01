import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { useAuth } from '@/contexts/AuthContext';
import { getBrokerProperties, getUnreadCount } from '@/db/api';
import type { Property } from '@/types';

const BrokerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!profile) return;

    try {
      const [props, unread] = await Promise.all([
        getBrokerProperties(profile.id),
        getUnreadCount(profile.id),
      ]);

      setProperties(props);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalViews = properties.reduce((sum, p) => sum + (p.views_count || 0), 0);
  const avgScore = properties.length > 0
    ? Math.round(properties.reduce((sum, p) => sum + p.domus_score, 0) / properties.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {profile?.name}
            </h1>
            <p className="text-muted-foreground">
              {profile?.agency_name || 'DOMUS Broker Dashboard'}
            </p>
          </div>
          <Link to="/broker/add-property">
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add New Property
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties.length}</div>
              <p className="text-xs text-muted-foreground">Active properties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Views This Month</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">Total property views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg DOMUS Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgScore}</div>
              <p className="text-xs text-muted-foreground">Your listing quality</p>
            </CardContent>
          </Card>
        </div>

        {/* My Listings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">My Listings</h2>
            <Link to="/broker/add-property">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading properties...</div>
          ) : properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">You haven't added any properties yet</p>
                <Link to="/broker/add-property">
                  <Button>Add Your First Property</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrokerDashboard;
