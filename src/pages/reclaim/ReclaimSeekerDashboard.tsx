import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Users, FileText, MessageSquare, Heart, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/db/supabase';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { ReclaimSeeker, ReclaimMatch, ReclaimApplication, Property } from '@/types';

const ReclaimSeekerDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [seekerProfile, setSeekerProfile] = useState<ReclaimSeeker | null>(null);
  const [matches, setMatches] = useState<ReclaimMatch[]>([]);
  const [applications, setApplications] = useState<ReclaimApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || profile?.account_type !== 'reclaim_seeker') {
      navigate('/reclaim');
      return;
    }
    loadDashboardData();
  }, [user, profile]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Load seeker profile
      const { data: seekerData } = await supabase
        .from('reclaim_seekers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (seekerData) {
        setSeekerProfile(seekerData);

        // Load matches
        const { data: matchesData } = await supabase
          .from('reclaim_matches')
          .select(`
            *,
            property:properties(
              *,
              broker:profiles!properties_broker_id_fkey(id, name, email, agency_name),
              reclaim_listing:reclaim_listings(*)
            )
          `)
          .eq('seeker_id', (seekerData as any).id)
          .order('match_score', { ascending: false })
          .limit(6);

        if (matchesData) setMatches(matchesData);

        // Load applications
        const { data: applicationsData } = await supabase
          .from('reclaim_applications')
          .select(`
            *,
            property:properties(
              *,
              broker:profiles!properties_broker_id_fkey(id, name, email, agency_name)
            )
          `)
          .eq('seeker_id', (seekerData as any).id)
          .order('applied_date', { ascending: false});

        if (applicationsData) setApplications(applicationsData);
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

  if (!seekerProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              To start finding homes through DOMUS RECLAIM, please complete your seeker profile first.
            </p>
            <Link to="/reclaim/seeker/profile">
              <Button>Complete Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusProgress = () => {
    if (seekerProfile.status === 'housed') return 100;
    if (seekerProfile.status === 'matched') return 66;
    if (applications.length > 0) return 50;
    if (matches.length > 0) return 33;
    return 10;
  };

  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const viewedApplications = applications.filter(app => app.status === 'viewed').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Welcome to DOMUS RECLAIM</h1>
          <p className="text-muted-foreground">
            We're here to help you find a new home, {profile?.name}.
          </p>
        </div>

        {/* Urgent Status Alert */}
        {seekerProfile.urgent_status && (
          <Alert className="mb-6 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your profile is marked as urgent. We're prioritizing matches for your family.
            </AlertDescription>
          </Alert>
        )}

        {/* Journey Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Your Journey to a New Home
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {seekerProfile.status === 'housed' ? 'Housed' : 
                     seekerProfile.status === 'matched' ? 'Matched' : 
                     'Seeking'}
                  </span>
                </div>
                <Progress value={getStatusProgress()} className="h-2" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-xs font-medium">Profile Created</p>
                </div>
                <div className="text-center">
                  {matches.length > 0 ? (
                    <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  ) : (
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  )}
                  <p className="text-xs font-medium">Matches Found</p>
                </div>
                <div className="text-center">
                  {applications.length > 0 ? (
                    <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  ) : (
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  )}
                  <p className="text-xs font-medium">Applications Sent</p>
                </div>
                <div className="text-center">
                  {seekerProfile.status === 'housed' ? (
                    <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                  ) : (
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  )}
                  <p className="text-xs font-medium">New Home</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Matches Found</p>
                  <p className="text-3xl font-bold">{matches.length}</p>
                </div>
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-3xl font-bold">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold">{pendingApplications}</p>
                </div>
                <Clock className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Viewed</p>
                  <p className="text-3xl font-bold">{viewedApplications}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/reclaim/seeker/find-help">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Find Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse RECLAIM properties with special terms for displaced families
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/reclaim/seeker/applications">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>My Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track your housing applications and responses from helpers
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
                  Communicate with property owners and support organizations
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Top Matches */}
        {matches.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Top Matches</h2>
              <Link to="/reclaim/seeker/find-help">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.slice(0, 3).map((match) => (
                match.property && (
                  <div key={match.id} className="relative">
                    <Badge className="absolute top-4 right-4 z-10 bg-primary">
                      {match.match_score}% Match
                    </Badge>
                    <PropertyCard property={match.property as Property} />
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Recent Applications */}
        {applications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Applications</h2>
              <Link to="/reclaim/seeker/applications">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {applications.slice(0, 3).map((application) => (
                <Card key={application.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {application.property?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {application.property?.city}, {application.property?.country}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Applied {new Date(application.applied_date).toLocaleDateString()}
                        </p>
                      </div>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {matches.length === 0 && applications.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Finding Matches for You</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Our AI is searching for properties that match your family's needs. Check back soon or browse available RECLAIM properties.
              </p>
              <Link to="/reclaim/seeker/find-help">
                <Button>Browse Properties</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReclaimSeekerDashboard;
