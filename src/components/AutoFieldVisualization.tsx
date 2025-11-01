import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Droplets, Sun, Wind, Cloud, Camera, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface FieldData {
  id: string;
  name: string;
  size_acres: number;
  soil_condition: string;
  moisture_level: number;
  current_stage: string;
  last_scanned_at: string;
  image_url: string | null;
}

interface FieldVisualizationProps {
  fieldId: string;
  onRescan: () => void;
}

const STAGE_COLORS = {
  empty: 'from-amber-200 to-amber-300',
  ploughed: 'from-amber-600 to-amber-700',
  planted: 'from-green-300 to-green-400',
  growing: 'from-green-400 to-green-500',
  mature: 'from-green-500 to-green-600',
  harvested: 'from-yellow-300 to-yellow-400',
};

const STAGE_NAMES = {
  empty: 'Unploughed Land',
  ploughed: 'Ploughed Field',
  planted: 'Seeds Planted',
  growing: 'Crops Growing',
  mature: 'Ready to Harvest',
  harvested: 'Harvested',
};

export const AutoFieldVisualization: React.FC<FieldVisualizationProps> = ({ fieldId, onRescan }) => {
  const [field, setField] = useState<FieldData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<'sunny' | 'cloudy' | 'windy'>('sunny');

  useEffect(() => {
    fetchFieldData();
    const interval = setInterval(fetchFieldData, 30000);
    return () => clearInterval(interval);
  }, [fieldId]);

  useEffect(() => {
    const weatherCycle = setInterval(() => {
      const effects: ('sunny' | 'cloudy' | 'windy')[] = ['sunny', 'cloudy', 'windy'];
      setWeather(effects[Math.floor(Math.random() * effects.length)]);
    }, 8000);
    return () => clearInterval(weatherCycle);
  }, []);

  const fetchFieldData = async () => {
    try {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('id', fieldId)
        .maybeSingle();

      if (error) throw error;
      if (data) setField(data);
    } catch (error) {
      console.error('Error fetching field:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="farming-card animate-pulse">
        <CardContent className="h-96 flex items-center justify-center">
          <div className="text-muted-foreground">Loading field visualization...</div>
        </CardContent>
      </Card>
    );
  }

  if (!field) {
    return (
      <Card className="farming-card">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Field not found</p>
        </CardContent>
      </Card>
    );
  }

  const stageProgress = {
    empty: 0,
    ploughed: 20,
    planted: 40,
    growing: 70,
    mature: 95,
    harvested: 100,
  }[field.current_stage] || 0;

  const getWeatherIcon = () => {
    switch (weather) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-500 animate-spin-slow" />;
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-400 animate-float" />;
      case 'windy':
        return <Wind className="h-6 w-6 text-blue-400 animate-pulse" />;
    }
  };

  return (
    <Card className="farming-card overflow-hidden">
      <CardHeader className="relative">
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {getWeatherIcon()}
          <Badge variant="outline" className="capitalize">{weather}</Badge>
        </div>
        <CardTitle className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
            <Zap className="h-5 w-5 text-white" />
          </div>
          {field.name}
        </CardTitle>
        <div className="flex items-center space-x-4 mt-2">
          <Badge variant="outline">{field.size_acres} acres</Badge>
          <Badge variant="secondary">Moisture: {field.moisture_level}%</Badge>
          <Badge className="bg-green-100 text-green-800">
            {STAGE_NAMES[field.current_stage as keyof typeof STAGE_NAMES]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Growth Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Field Progress</span>
            <span className="text-primary">{stageProgress}%</span>
          </div>
          <Progress value={stageProgress} className="h-3" />
        </div>

        {/* Animated Field Visualization */}
        <div className="relative">
          <div className={`absolute inset-0 rounded-lg transition-all duration-1000 ${
            weather === 'sunny' ? 'bg-gradient-to-b from-blue-300 to-blue-100' :
            weather === 'cloudy' ? 'bg-gradient-to-b from-gray-300 to-gray-100' :
            'bg-gradient-to-b from-blue-400 to-blue-200'
          }`}>
            <div className="absolute top-2 left-4 animate-float">
              <div className="w-8 h-4 bg-white rounded-full opacity-70"></div>
            </div>
            <div className="absolute top-4 right-8 animate-float-delayed">
              <div className="w-6 h-3 bg-white rounded-full opacity-60"></div>
            </div>
            <div className="absolute top-3 left-1/3 animate-float-slow">
              <div className="w-10 h-5 bg-white rounded-full opacity-50"></div>
            </div>
          </div>

          <div className={`relative z-10 h-96 rounded-lg bg-gradient-to-b ${STAGE_COLORS[field.current_stage as keyof typeof STAGE_COLORS]} p-8 transition-all duration-1000`}>
            <div className="h-full w-full flex items-center justify-center">
              {field.current_stage === 'empty' && (
                <div className="text-center space-y-4">
                  <div className="text-6xl opacity-50">🏜️</div>
                  <p className="text-amber-900 font-semibold">Empty Field - Ready for Ploughing</p>
                </div>
              )}

              {field.current_stage === 'ploughed' && (
                <div className="grid grid-cols-8 gap-2 w-full h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-amber-800 rounded-sm animate-pulse"
                      style={{ animationDelay: `${i * 50}ms` }}
                    />
                  ))}
                </div>
              )}

              {field.current_stage === 'planted' && (
                <div className="grid grid-cols-8 gap-3 w-full h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-end justify-center animate-grow-plant"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <div className="text-2xl">🌱</div>
                    </div>
                  ))}
                </div>
              )}

              {field.current_stage === 'growing' && (
                <div className="grid grid-cols-8 gap-3 w-full h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-end justify-center animate-float"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="text-3xl">🌿</div>
                    </div>
                  ))}
                </div>
              )}

              {field.current_stage === 'mature' && (
                <div className="grid grid-cols-8 gap-3 w-full h-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-end justify-center animate-bounce"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="text-4xl">🌾</div>
                    </div>
                  ))}
                </div>
              )}

              {field.current_stage === 'harvested' && (
                <div className="text-center space-y-4">
                  <div className="text-6xl animate-pulse">✨</div>
                  <p className="text-yellow-900 font-semibold text-xl">Field Harvested Successfully!</p>
                  <p className="text-yellow-800 text-sm">Scan again to start a new crop cycle</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Field Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-lg border border-primary/20">
            <div className="text-sm text-muted-foreground">Soil Condition</div>
            <div className="font-semibold text-primary">{field.soil_condition}</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="text-sm text-muted-foreground flex items-center">
              <Droplets className="h-3 w-3 mr-1" />
              Moisture
            </div>
            <div className="font-semibold text-blue-700">{field.moisture_level}%</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="text-sm text-muted-foreground">Last Scan</div>
            <div className="font-semibold text-green-700 text-xs">
              {new Date(field.last_scanned_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Rescan Button */}
        <Button onClick={onRescan} className="w-full" size="lg">
          <Camera className="h-5 w-5 mr-2" />
          Re-scan Field to Update Progress
        </Button>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> After completing work on your field in real life, scan it again to automatically update the visualization and earn points!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
