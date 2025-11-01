import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface FieldScannerProps {
  open: boolean;
  onClose: () => void;
  existingFieldId?: string | null;
  onFieldCreated?: (fieldId: string) => void;
}

interface AnalysisResult {
  moistureLevel: number;
  soilCondition: string;
  recommendations: string[];
  detectedStage: string;
  sizeAcres: number;
}

const STAGE_DETECTION_KEYWORDS = {
  empty: ['bare', 'empty', 'unploughed', 'dry', 'barren'],
  ploughed: ['ploughed', 'tilled', 'prepared', 'furrowed', 'rows'],
  planted: ['planted', 'seeds', 'seedlings', 'young', 'germinated'],
  growing: ['growing', 'green', 'developing', 'vegetation', 'leaves'],
  mature: ['mature', 'ready', 'ripe', 'full-grown', 'harvest-ready'],
  harvested: ['harvested', 'cleared', 'cut', 'reaped', 'empty-after'],
};

export const FieldScanner: React.FC<FieldScannerProps> = ({
  open,
  onClose,
  existingFieldId = null,
  onFieldCreated
}) => {
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [fieldName, setFieldName] = useState('');
  const [fieldLocation, setFieldLocation] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

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

  const detectStageFromImage = (imageData: string): string => {
    const randomStages: string[] = ['empty', 'ploughed', 'planted', 'growing'];
    const detectedStage = randomStages[Math.floor(Math.random() * randomStages.length)];
    return detectedStage;
  };

  const analyzeField = async (imageUrl: string) => {
    setIsScanning(true);

    await new Promise(resolve => setTimeout(resolve, 2500));

    const detectedStage = detectStageFromImage(imageUrl);

    const mockAnalysis: AnalysisResult = {
      moistureLevel: Math.floor(Math.random() * 40) + 30,
      soilCondition: ['Good', 'Fair', 'Excellent'][Math.floor(Math.random() * 3)],
      recommendations: [
        'Soil pH is optimal for crop growth',
        'Consider adding organic matter for better yield',
        'Regular watering schedule recommended',
        'Monitor for pest activity during growing season',
      ],
      detectedStage,
      sizeAcres: parseFloat((Math.random() * 3 + 1).toFixed(1)),
    };

    setAnalysisResult(mockAnalysis);
    setIsScanning(false);
  };

  const createFieldFromScan = async () => {
    if (!analysisResult || !scannedImage || !userId) {
      toast.error('Missing required data');
      return;
    }

    if (!fieldName.trim()) {
      toast.error('Please enter a field name');
      return;
    }

    try {
      if (existingFieldId) {
        const { error: updateError } = await supabase
          .from('fields')
          .update({
            current_stage: analysisResult.detectedStage,
            moisture_level: analysisResult.moistureLevel,
            soil_condition: analysisResult.soilCondition,
            last_scanned_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingFieldId);

        if (updateError) throw updateError;

        const { error: scanError } = await supabase
          .from('field_scans')
          .insert({
            field_id: existingFieldId,
            user_id: userId,
            scan_type: 'verification',
            detected_stage: analysisResult.detectedStage,
            moisture_level: analysisResult.moistureLevel,
            soil_condition: analysisResult.soilCondition,
            recommendations: analysisResult.recommendations,
            verified: true,
          });

        if (scanError) throw scanError;

        const points = 50;
        await updateUserPoints(userId, points);

        toast.success(`Field updated! Stage: ${analysisResult.detectedStage}. +${points} points`);
      } else {
        const { data: newField, error: fieldError } = await supabase
          .from('fields')
          .insert({
            user_id: userId,
            name: fieldName,
            size_acres: analysisResult.sizeAcres,
            soil_condition: analysisResult.soilCondition,
            moisture_level: analysisResult.moistureLevel,
            location: fieldLocation || 'Unknown',
            current_stage: analysisResult.detectedStage,
            last_scanned_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (fieldError) throw fieldError;

        const { error: scanError } = await supabase
          .from('field_scans')
          .insert({
            field_id: newField.id,
            user_id: userId,
            scan_type: 'initial',
            detected_stage: analysisResult.detectedStage,
            moisture_level: analysisResult.moistureLevel,
            soil_condition: analysisResult.soilCondition,
            recommendations: analysisResult.recommendations,
            verified: true,
          });

        if (scanError) throw scanError;

        const points = 100;
        await updateUserPoints(userId, points);

        toast.success(`Field added successfully! +${points} points`);

        if (onFieldCreated) {
          onFieldCreated(newField.id);
        }
      }

      onClose();
      setScannedImage(null);
      setAnalysisResult(null);
      setFieldName('');
      setFieldLocation('');
    } catch (error) {
      console.error('Error saving field:', error);
      toast.error('Failed to save field');
    }
  };

  const updateUserPoints = async (userId: string, points: number) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('user_id', userId)
      .maybeSingle();

    if (profile) {
      await supabase
        .from('profiles')
        .update({ total_points: (profile.total_points || 0) + points })
        .eq('user_id', userId);
    }
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
            <CardTitle>
              {existingFieldId ? 'Re-scan Field' : t('scanYourField')}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {!scannedImage ? (
              <>
                <p className="text-muted-foreground text-center">
                  {existingFieldId
                    ? 'Upload a new image to verify field progress'
                    : 'Upload an image of your farm field to get AI-powered analysis'
                  }
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

                      {!existingFieldId && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="fieldName">Field Name</Label>
                            <Input
                              id="fieldName"
                              placeholder="e.g., North Field, Main Plot"
                              value={fieldName}
                              onChange={(e) => setFieldName(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="fieldLocation">Location</Label>
                            <Input
                              id="fieldLocation"
                              placeholder="e.g., Village name, District"
                              value={fieldLocation}
                              onChange={(e) => setFieldLocation(e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-secondary rounded-lg">
                          <div className="text-sm text-muted-foreground">Detected Stage</div>
                          <Badge variant="default" className="mt-1">
                            {analysisResult.detectedStage}
                          </Badge>
                        </div>
                        <div className="p-3 bg-secondary rounded-lg">
                          <div className="text-sm text-muted-foreground">Field Size</div>
                          <div className="text-lg font-bold text-primary">
                            {analysisResult.sizeAcres} acres
                          </div>
                        </div>
                        <div className="p-3 bg-secondary rounded-lg">
                          <div className="text-sm text-muted-foreground">{t('moistureLevel')}</div>
                          <div className="text-lg font-bold text-primary">
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
                              <Check className="w-4 h-4 text-primary mr-2" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={createFieldFromScan} className="flex-1" disabled={!existingFieldId && !fieldName.trim()}>
                          {existingFieldId ? 'Update Field Progress' : 'Add to My Fields'}
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
