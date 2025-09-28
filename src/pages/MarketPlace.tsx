import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface MarketPrice {
  crop: string;
  currentPrice: number;
  change: number;
  demand: 'High' | 'Medium' | 'Low';
  season: string;
  unit: string;
}

const mockMarketData: MarketPrice[] = [
  { crop: 'Wheat', currentPrice: 2250, change: 1.2, demand: 'High', season: 'Rabi', unit: 'quintal' },
  { crop: 'Rice', currentPrice: 1800, change: -2.3, demand: 'Medium', season: 'Kharif', unit: 'quintal' },
  { crop: 'Tomato', currentPrice: 45, change: 15.8, demand: 'High', season: 'Year round', unit: 'kg' },
  { crop: 'Onion', currentPrice: 25, change: -8.1, demand: 'Medium', season: 'Rabi', unit: 'kg' },
  { crop: 'Sugarcane', currentPrice: 280, change: 4.5, demand: 'Low', season: 'Year round', unit: 'quintal' },
];

const marketTrends = [
  { category: 'Vegetables', trend: 'up', percentage: 12.5 },
  { category: 'Grains', trend: 'down', percentage: 3.2 },
  { category: 'Pulses', trend: 'up', percentage: 8.7 },
  { category: 'Oilseeds', trend: 'down', percentage: 5.1 },
];

export default function MarketPlace() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockMarketData.filter(item =>
    item.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('marketplace')}</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Prices Table */}
        <div className="lg:col-span-2">
          <Card className="farming-card">
            <CardHeader>
              <CardTitle>Market Prices</CardTitle>
              <p className="text-sm text-muted-foreground">Real time market prices and crop recommendations</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-semibold">Crop</th>
                      <th className="text-right py-3 font-semibold">Current Price</th>
                      <th className="text-right py-3 font-semibold">Change</th>
                      <th className="text-center py-3 font-semibold">Demand</th>
                      <th className="text-center py-3 font-semibold">Season</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.crop} className="border-b border-border hover:bg-secondary/50">
                        <td className="py-4 font-medium">{item.crop}</td>
                        <td className="text-right py-4">
                          <div>
                            <span className="font-semibold">₹{item.currentPrice}</span>
                            <span className="text-sm text-muted-foreground">/{item.unit}</span>
                          </div>
                        </td>
                        <td className="text-right py-4">
                          <div className={`flex items-center justify-end ${
                            item.change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.change > 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            <span className="font-medium">{Math.abs(item.change)}%</span>
                          </div>
                        </td>
                        <td className="text-center py-4">
                          <Badge className={getDemandColor(item.demand)}>
                            {item.demand}
                          </Badge>
                        </td>
                        <td className="text-center py-4 text-sm text-muted-foreground">
                          {item.season}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Trends */}
        <div className="space-y-6">
          <Card className="farming-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketTrends.map((trend) => (
                <div key={trend.category} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="font-medium">{trend.category}</span>
                  <div className={`flex items-center ${
                    trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="font-semibold">{trend.percentage}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="farming-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Price History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Set Price Alerts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Search className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}