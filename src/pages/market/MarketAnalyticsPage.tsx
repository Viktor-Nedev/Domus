import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Home } from 'lucide-react';

const MarketAnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Market Analytics</h1>
        <p className="text-muted-foreground mb-8">
          Comprehensive real estate market data and trends powered by DOMUS AI
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Price/m²</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€2,450</div>
              <p className="text-xs text-muted-foreground">+8% from last year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">Across all markets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Market Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">Year over year</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>DOMUS Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Top Growing Markets</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Sofia, Bulgaria - +15% average price growth</li>
                  <li>• Bucharest, Romania - +12% average price growth</li>
                  <li>• Athens, Greece - +10% average price growth</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Investment Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI has identified 47 properties currently undervalued by 10% or more compared to market averages.
                  Sign in to see personalized recommendations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketAnalyticsPage;
