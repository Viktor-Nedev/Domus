import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, Users, Globe, ArrowRight, CheckCircle2, HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/db/supabase';
import type { ReclaimStory, PartnerOrganization } from '@/types';

const ReclaimHubPage: React.FC = () => {
  const [stories, setStories] = useState<ReclaimStory[]>([]);
  const [partners, setPartners] = useState<PartnerOrganization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storiesData, partnersData] = await Promise.all([
        supabase
          .from('reclaim_stories')
          .select('*')
          .eq('approved', true)
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('partner_organizations')
          .select('*')
          .eq('verified', true)
          .limit(6),
      ]);

      if (storiesData.data) setStories(storiesData.data);
      if (partnersData.data) setPartners(partnersData.data);
    } catch (error) {
      console.error('Error loading RECLAIM data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <HandHeart className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              DOMUS RECLAIM: Finding Home Again
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              We help people who lost their homes to war, disaster, or displacement find safe, dignified housing and rebuild their lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?type=reclaim_seeker">
                <Button size="lg" className="text-lg px-8">
                  <Home className="mr-2 h-5 w-5" />
                  I Need a Home
                </Button>
              </Link>
              <Link to="/auth?type=helper">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Heart className="mr-2 h-5 w-5" />
                  I Want to Help
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Challenge We Face Together</h2>
            <p className="text-lg text-muted-foreground">
              Millions of people worldwide have lost their homes due to war, natural disasters, and forced displacement.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Global Crisis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Over 100 million people displaced worldwide due to conflict, persecution, and disasters.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Home className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Housing Urgency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Families need safe, affordable housing immediately, but traditional systems aren't designed for their situation.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Displaced persons need more than housing - they need community, support networks, and hope.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How DOMUS RECLAIM Works</h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* For Seekers */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Home className="mr-3 h-8 w-8 text-primary" />
                For Those Seeking Home
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tell Us Your Situation</h4>
                    <p className="text-muted-foreground">
                      Share your story and needs through our private, secure form. Your information is protected and only shared with your permission.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">AI Matches You with Help</h4>
                    <p className="text-muted-foreground">
                      Our AI finds properties with special terms, plus NGO and government support programs that match your family's needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Connect and Rebuild</h4>
                    <p className="text-muted-foreground">
                      Direct contact with helpers who understand your situation. Find not just housing, but community and hope.
                    </p>
                  </div>
                </div>
              </div>
              <Link to="/auth?type=reclaim_seeker">
                <Button className="mt-6" size="lg">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* For Helpers */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Heart className="mr-3 h-8 w-8 text-primary" />
                For Those Who Want to Help
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">List Your Property with Heart</h4>
                    <p className="text-muted-foreground">
                      Add special terms for displaced families - reduced rent, flexible leases, or humanitarian vouchers accepted.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Connect with Seekers</h4>
                    <p className="text-muted-foreground">
                      Our AI matches your property with families that fit what you can offer. Review applications and connect directly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Make a Difference</h4>
                    <p className="text-muted-foreground">
                      Provide more than housing - provide hope. Track your impact and see the lives you've helped rebuild.
                    </p>
                  </div>
                </div>
              </div>
              <Link to="/auth?type=helper">
                <Button className="mt-6" size="lg" variant="outline">
                  Offer Your Help
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      {stories.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">Success Stories</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Real stories of hope, resilience, and new beginnings through DOMUS RECLAIM
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {stories.map((story) => (
                <Card key={story.id} className="overflow-hidden">
                  {story.featured_image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={story.featured_image}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    {story.featured && (
                      <Badge className="mb-2 w-fit">Featured Story</Badge>
                    )}
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-4 mb-4">
                      {story.story}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{story.origin_country} → {story.property_location}</span>
                      {story.helper_name && <span>Helper: {story.helper_name}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partner Organizations */}
      {partners.length > 0 && (
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">Our Partners</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Working together with humanitarian organizations to provide comprehensive support
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {partners.map((partner) => (
                <Card key={partner.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      {partner.verified && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <Badge variant="outline">{partner.type}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {partner.description}
                    </p>
                    {partner.services_offered && partner.services_offered.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold">Services:</p>
                        <div className="flex flex-wrap gap-1">
                          {partner.services_offered.slice(0, 3).map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join the DOMUS RECLAIM Community</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you need help or want to provide it, every connection makes a difference. Together, we're rebuilding lives, one home at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?type=reclaim_seeker">
                <Button size="lg">I Need a Home</Button>
              </Link>
              <Link to="/auth?type=helper">
                <Button size="lg" variant="outline">I Want to Help</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReclaimHubPage;
