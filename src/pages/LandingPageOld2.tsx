import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, Heart, Shield, Users, MapPin, Sparkles, Search, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PropertyCard } from '@/components/property/PropertyCard';
import { getTopProperties } from '@/db/api';
import type { Property } from '@/types';

const LandingPageRedesigned: React.FC = () => {
  const [topProperties, setTopProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopProperties();
  }, []);

  const loadTopProperties = async () => {
    try {
      const properties = await getTopProperties(6);
      setTopProperties(properties);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Humanitarian Mission First */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 text-base px-6 py-2" variant="secondary">
              Humanitarian Housing Support Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Safe Housing When You Need It Most
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Whether you've lost your home to conflict, natural disaster, or displacement, 
              we're here to help you find a safe place to rebuild your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/shelter-map">
                <Button size="lg" className="text-lg px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Shield className="mr-2 h-5 w-5" />
                  Find Emergency Housing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/ai-finder">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Sparkles className="mr-2 h-5 w-5" />
                  AI Home Finder
                </Button>
              </Link>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8 border-t">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">1,200+</div>
                <p className="text-sm text-muted-foreground">Families Helped</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <p className="text-sm text-muted-foreground">Safe Homes</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <p className="text-sm text-muted-foreground">AI Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Help */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Help You Find Safety</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform connects displaced families with safe housing options, 
              humanitarian partners, and supportive communities.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Emergency Housing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Immediate access to safe shelters and temporary housing for families in crisis situations.
                </p>
                <Link to="/shelter-map">
                  <Button variant="outline" className="w-full">
                    Get Help Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>AI Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our AI understands your situation and matches you with the most suitable housing options.
                </p>
                <Link to="/ai-finder">
                  <Button variant="outline" className="w-full">
                    Start AI Search
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Community Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect with humanitarian organizations, local communities, and support networks.
                </p>
                <Link to="/shelter-map">
                  <Button variant="outline" className="w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Housing */}
      {topProperties.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Available Safe Housing</h2>
              <p className="text-lg text-muted-foreground">
                Browse properties offering special terms for families in need
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/properties">
                <Button size="lg">
                  View All Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* For Property Owners & Brokers */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Want to Help?</h2>
              <p className="text-lg text-muted-foreground">
                If you're a property owner or broker, you can make a difference by offering housing to families in need.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardHeader>
                  <Heart className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Property Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    List your property with special terms for displaced families. Offer reduced rent, 
                    flexible contracts, or humanitarian support.
                  </p>
                  <Link to="/auth">
                    <Button className="w-full">
                      List Your Property
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <Home className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>Real Estate Brokers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Join our platform to connect with clients, manage listings, and contribute 
                    to humanitarian housing efforts.
                  </p>
                  <Link to="/auth">
                    <Button className="w-full">
                      Join as Broker
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Real Estate Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Traditional Real Estate Services</h2>
            <p className="text-lg text-muted-foreground">
              Looking for property investment or a new home? We also offer full real estate services.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Property Search</h3>
              <p className="text-sm text-muted-foreground">
                Browse thousands of properties across multiple countries
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Home Finder</h3>
              <p className="text-sm text-muted-foreground">
                Let AI find your perfect property based on your preferences
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Direct Contact</h3>
              <p className="text-sm text-muted-foreground">
                Message brokers directly about properties you're interested in
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/properties">
              <Button size="lg" variant="outline">
                Browse All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 to-secondary/10 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Safe Place?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you need emergency housing or are looking for a new home, we're here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shelter-map">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  <Shield className="mr-2 h-5 w-5" />
                  Get Emergency Help
                </Button>
              </Link>
              <Link to="/ai-finder">
                <Button size="lg" variant="outline">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Find Your Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageRedesigned;
