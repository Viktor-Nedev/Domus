import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Home, Users, TrendingUp, MessageSquare, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import type { ReclaimListing, ReclaimApplication, Property } from '@/types';

const ReclaimHelperDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [reclaimListings, setReclaimListings] = useState<ReclaimListing[]>([]);
  const [applications, setApplications] = useState<ReclaimApplication[]>([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    totalApplications: 0,
    pendingApplications: 0,
    familiesHelped: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || profile?.account_type !== 'broker') {
      navigate('/reclaim');
      return;
    }
    loadHelperData();
  }, [user, profile]);

  const loadHelperData = async () => {
    if (!user) return;

    try {
      // Load broker's RECLAIM listings
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('id')
        .eq('broker_id', user.id);

      if (propertiesData && propertiesData.length > 0) {
        const propertyIds = propertiesData.map((p: any) => p.id);

        const { data: listingsData } = await supabase
          .from('reclaim_listings')
          .select(`
            *,
            property:properties(*)
          `)
          .in('property_id', propertyIds);

        if (listingsData) {
          setReclaimListings(listingsData);

          // Load applications for these properties
          const { data: applicationsData } = await supabase
            .from('reclaim_applications')
            .select(`
              *,
              property:properties(*),
              seeker:reclaim_seekers(*)
            `)
            .in('property_id', propertyIds)
            .order('applied_date', { ascending: false });

          if (applicationsData) {
            setApplications(applicationsData);

            // Calculate stats
            const pending = applicationsData.filter((app: any) => app.status === 'pending').length;
            const accepted = applicationsData.filter((app: any) => app.status === 'accepted').length;

            setStats({
              totalListings: listingsData.length,
              totalApplications: applicationsData.length,
              pendingApplications: pending,
              familiesHelped: accepted,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading helper data:', error);
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">DOMUS RECLAIM Helper Dashboard</h1>
          <p className="text-muted-foreground">
            Thank you for helping rebuild lives, {profile?.name}.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">RECLAIM Listings</p>
                  <p className="text-3xl font-bold">{stats.totalListings}</p>
                </div>
                <Home className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-3xl font-bold">{stats.totalApplications}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold">{stats.pendingApplications}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Families Helped</p>
                  <p className="text-3xl font-bold">{stats.familiesHelped}</p>
                </div>
                <Heart className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/broker/add-property?reclaim=true">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <Plus className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Add RECLAIM Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  List a property with special terms for displaced families
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/broker">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <Home className="h-8 w-8 text-primary mb-2" />
                <CardTitle>My Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage all your properties and RECLAIM listings
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/messages">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Communicate with seekers and respond to applications
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Applications */}
        {applications.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Applications</h2>
            </div>
            <div className="space-y-4">
              {applications.slice(0, 5).map((application) => (
                <Card key={application.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            Application for {application.property?.title}
                          </h3>
                          <Badge
                            variant={
                              application.status === 'accepted' ? 'default' :
                              application.status === 'viewed' ? 'secondary' :
                              application.status === 'rejected' ? 'destructive' :
                              'outline'
                            }
                          >
                            {application.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {application.seeker && (
                            <>
                              Family: {application.seeker.family_size_adults} adults, {application.seeker.family_size_children} children
                              {application.seeker.family_size_elderly > 0 && `, ${application.seeker.family_size_elderly} elderly`}
                            </>
                          )}
                        </p>
                        {application.message && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            "{application.message}"
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Applied {new Date(application.applied_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/messages?property=${application.property_id}`}>
                          <Button size="sm">Message</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Start Making a Difference</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                List your first RECLAIM property to help displaced families find safe, dignified housing.
              </p>
              <Link to="/broker/add-property?reclaim=true">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add RECLAIM Property
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Impact Message */}
        {stats.familiesHelped > 0 && (
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <TrendingUp className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Your Impact</h3>
                  <p className="text-muted-foreground">
                    You've helped {stats.familiesHelped} {stats.familiesHelped === 1 ? 'family' : 'families'} find a new home through DOMUS RECLAIM. Thank you for making a difference!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReclaimHelperDashboard;
