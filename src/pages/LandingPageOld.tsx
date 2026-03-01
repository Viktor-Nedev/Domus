import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Brain, TrendingUp, DollarSign, MapPin, MessageSquare, HandHeart, Heart, Sparkles, Map, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyCard } from '@/components/property/PropertyCard';
import { getTopProperties } from '@/db/api';
import type { Property } from '@/types';

const LandingPage: React.FC = () => {
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
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Find Your Perfect Property with AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Global real estate intelligence platform powered by AI. Find undervalued properties, get market insights, and connect with your dream home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/ai-finder">
                <Button size="lg" className="text-lg px-8">
                  <Sparkles className="mr-2 h-5 w-5" />
                  AI Home Finder
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/properties">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Browse Properties
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">The DOMUS Philosophy</h2>
            <p className="text-lg text-muted-foreground italic">
              "In ancient Rome, DOMUS was more than a house - it was the center of life, family, and prosperity. 
              Today, we bring that same wisdom to your property journey."
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>AI Scans Global Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our AI monitors property portals worldwide 24/7
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle>Smart Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Evaluates each property against market data, ROI potential, and your preferences
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Instant Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get notified only when a true deal matches your criteria
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-card">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <Globe className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Global Coverage</h3>
                <p className="text-sm text-muted-foreground">
                  Properties from Bulgaria, Romania, Greece, Turkey, Germany, Spain, Italy, and more
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Brain className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">AI Matchmaking</h3>
                <p className="text-sm text-muted-foreground">
                  Find homes that match your lifestyle, not just square meters
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Price Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Historical price charts and market trends for any location
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <DollarSign className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Multi-Currency Support</h3>
                <p className="text-sm text-muted-foreground">
                  EUR, USD, GBP, BGN, RON, TRY, CHF, and more
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Exact Location</h3>
                <p className="text-sm text-muted-foreground">
                  Every listing has precise coordinates and interactive maps
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MessageSquare className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Direct Messaging</h3>
                <p className="text-sm text-muted-foreground">
                  Chat directly with property brokers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Properties */}
      {topProperties.length > 0 && (
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Top DOMUS Listings</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/auth">
                <Button size="lg">
                  View All Properties
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,234+</div>
              <p className="text-muted-foreground">Active Listings</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <p className="text-muted-foreground">Countries</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Brokers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">92%</div>
              <p className="text-muted-foreground">Satisfied Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* DOMUS RECLAIM Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <HandHeart className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Introducing DOMUS RECLAIM</h2>
              <p className="text-lg text-muted-foreground">
                Helping people who lost their homes to war, disaster, or displacement find safe, dignified housing
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-background p-6 rounded-lg border">
                <Heart className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">For Those Seeking Home</h3>
                <p className="text-muted-foreground mb-4">
                  Our AI matches displaced families with properties offering special terms, humanitarian support, and community connections.
                </p>
                <Link to="/reclaim">
                  <Button variant="outline" className="w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <HandHeart className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">For Those Who Want to Help</h3>
                <p className="text-muted-foreground mb-4">
                  List properties with reduced rent, flexible terms, or special support to help families rebuild their lives.
                </p>
                <Link to="/reclaim">
                  <Button variant="outline" className="w-full">
                    Make a Difference
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="text-center">
              <Link to="/reclaim">
                <Button size="lg">
                  Visit DOMUS RECLAIM
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Brokers */}
      <section className="py-16 bg-gradient-to-br from-secondary/10 to-primary/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Are you a real estate broker?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              List your properties on DOMUS, reach qualified buyers, and use our AI to find the right clients
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Join as Broker
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  "DOMUS found me a property 15% below market value in Barcelona"
                </p>
                <p className="font-semibold">- Maria, investor</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  "The AI matched me with my dream home in Sofia"
                </p>
                <p className="font-semibold">- Ivan, first-time buyer</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  "The messaging system made it so easy to connect with brokers"
                </p>
                <p className="font-semibold">- Elena, buyer</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
