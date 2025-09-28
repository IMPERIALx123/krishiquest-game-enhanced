import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGame, FieldData, FieldTile } from '@/contexts/GameContext';
import { toast } from 'sonner';

interface FieldScannerProps {
  open: boolean;
  onClose: () => void;
}

interface AnalysisResult {
  moistureLevel: number;
  soilCondition: string;
  recommendations: string[];
  fieldSize: string;
  soilType: string;
}

export const FieldScanner: React.FC<FieldScannerProps> = ({ open, onClose }) => {
  const { t } = useLanguage();
  const { addField } = useGame();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setScannedImage(imageUrl);
        analyzeField(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeField = async (imageUrl: string) => {
    setIsScanning(true);
    
    // Simulate AI analysis with mock data
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalysis: AnalysisResult = {
      moistureLevel: Math.floor(Math.random() * 40) + 30, // 30-70%
      soilCondition: ['Good', 'Fair', 'Excellent'][Math.floor(Math.random() * 3)],
      recommendations: [
        'Soil pH is optimal for crop growth',
        'Consider adding organic matter',
        'Regular watering schedule recommended',
        'Monitor for pest activity',
      ],
      fieldSize: '2.5 acres',
      soilType: 'Loamy soil',
    };

    setAnalysisResult(mockAnalysis);
    setIsScanning(false);
  };

  const createFieldFromScan = () => {
    if (!analysisResult || !scannedImage) return;

    // Create a 10x10 grid of field tiles
    const tiles: FieldTile[] = [];
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        tiles.push({
          id: `${x}-${y}`,
          type: 'empty',
          x,
          y,
          progress: 0,
          lastUpdated: new Date(),
        });
      }
    }

    const newField: FieldData = {
      id: Date.now().toString(),
      name: 'My Farm Field',
      tiles,
      moistureLevel: analysisResult.moistureLevel,
      soilCondition: analysisResult.soilCondition,
      recommendations: analysisResult.recommendations,
      imageUrl: scannedImage,
    };

    addField(newField);
    toast.success('Field added successfully!');
    onClose();
  };

  const getBadgeVariant = (condition: string) => {
    if (condition === 'Excellent') return 'default';
    if (condition === 'Good') return 'secondary';
    return 'outline';
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('scanYourField')}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {!scannedImage ? (
              <>
                <p className="text-muted-foreground text-center">
                  Upload an image of your farm field to get AI-powered analysis
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10"
                    variant="outline"
                  >
                    <Upload className="h-8 w-8 mb-2" />
                    <span>Upload Image</span>
                  </Button>
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10"
                    variant="outline"
                  >
                    <Camera className="h-8 w-8 mb-2" />
                    <span>Take Photo</span>
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  capture="environment"
                />
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <img
                    src={scannedImage}
                    alt="Scanned field"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  {isScanning ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mr-2" />
                      <span>Analyzing field conditions...</span>
                    </div>
                  ) : analysisResult ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Analysis Results</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-secondary rounded-lg">
                          <div className="text-sm text-muted-foreground">{t('moistureLevel')}</div>
                          <div className="text-2xl font-bold text-primary">
                            {analysisResult.moistureLevel}%
                          </div>
                        </div>
                        <div className="p-3 bg-secondary rounded-lg">
                          <div className="text-sm text-muted-foreground">{t('soilCondition')}</div>
                          <Badge variant={getBadgeVariant(analysisResult.soilCondition)}>
                            {analysisResult.soilCondition}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">{t('recommendations')}</h4>
                        <ul className="space-y-1">
                          {analysisResult.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={createFieldFromScan} className="flex-1">
                          Add to My Fields
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setScannedImage(null);
                            setAnalysisResult(null);
                          }}
                        >
                          Scan Again
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};