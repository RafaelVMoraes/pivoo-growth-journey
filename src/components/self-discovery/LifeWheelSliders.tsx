import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface LifeWheelData {
  area_name: string;
  current_score: number;
  desired_score: number;
}

interface LifeWheelSlidersProps {
  data: LifeWheelData[];
  onUpdate: (areaName: string, updates: Partial<LifeWheelData>) => void;
  saving: boolean;
}

export const LifeWheelSliders = ({ data, onUpdate, saving }: LifeWheelSlidersProps) => {
  const { t } = useTranslation();
  const [showingValue, setShowingValue] = useState<{area: string, type: 'current' | 'desired'} | null>(null);

  const handleSliderChange = (areaName: string, type: 'current' | 'desired', value: number[]) => {
    const updates = type === 'current' 
      ? { current_score: value[0] }
      : { desired_score: value[0] };
    
    onUpdate(areaName, updates);
    setShowingValue({ area: areaName, type });
    
    // Hide value after 2 seconds
    setTimeout(() => setShowingValue(null), 2000);
  };

  // Calculate averages
  const currentAverage = data.length > 0 
    ? (data.reduce((sum, area) => sum + area.current_score, 0) / data.length).toFixed(1)
    : '0';
  
  const desiredAverage = data.length > 0
    ? (data.reduce((sum, area) => sum + area.desired_score, 0) / data.length).toFixed(1)
    : '0';
  
  const averageDifference = Math.abs(parseFloat(desiredAverage) - parseFloat(currentAverage));
  const totalDesired = data.reduce((sum, area) => sum + area.desired_score, 0);

  const showOverloadAlert = averageDifference > 1.5;
  const showHighExpectationsAlert = totalDesired > 50;

  return (
    <Card className="gradient-card shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t('selfDiscovery.rateLifeAreas')}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('selfDiscovery.rateDescription')}
        </p>
        
        {/* Averages Display */}
        <div className="flex gap-4 mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground mb-1">Média Atual</p>
            <p className="text-2xl font-bold text-primary">{currentAverage}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground mb-1">Média Desejada</p>
            <p className="text-2xl font-bold text-accent">{desiredAverage}</p>
          </div>
        </div>

        {/* Alerts */}
        {showOverloadAlert && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">
              ⚠️ A diferença entre seu estado atual e desejado pode indicar sobrecarga. Considere ajustar suas expectativas.
            </p>
          </div>
        )}
        
        {showHighExpectationsAlert && (
          <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <p className="text-sm font-medium" style={{ color: 'hsl(var(--warning))' }}>
              💭 Você pode estar se cobrando muito. Reavalie se suas metas são realistas para este momento.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((area) => (
          <div key={area.area_name} className="space-y-3">
            <h4 className="font-medium text-base">{area.area_name}</h4>
            
            {/* Current Score Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-muted-foreground">{t('selfDiscovery.whereIAmNow')}</label>
                <div className="relative">
                  <span className="text-sm font-medium text-primary">
                    {area.current_score}
                  </span>
                  {showingValue?.area === area.area_name && showingValue.type === 'current' && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 glass text-foreground px-2 py-1 rounded-lg text-xs animate-fade-in shadow-glass">
                      {area.current_score}
                    </div>
                  )}
                </div>
              </div>
              <Slider
                value={[area.current_score]}
                onValueChange={(value) => handleSliderChange(area.area_name, 'current', value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
                disabled={saving}
              />
            </div>

            {/* Desired Score Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-muted-foreground">{t('selfDiscovery.whereIWantToBe')}</label>
                <div className="relative">
                  <span className="text-sm font-medium text-accent">
                    {area.desired_score}
                  </span>
                  {showingValue?.area === area.area_name && showingValue.type === 'desired' && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 glass text-foreground px-2 py-1 rounded-lg text-xs animate-fade-in shadow-glass">
                      {area.desired_score}
                    </div>
                  )}
                </div>
              </div>
              <Slider
                value={[area.desired_score]}
                onValueChange={(value) => handleSliderChange(area.area_name, 'desired', value)}
                max={10}
                min={1}
                step={1}
                className="w-full [&>span:first-child]:glass-card [&>span:first-child>span]:bg-gradient-to-r [&>span:first-child>span]:from-accent [&>span:first-child>span]:to-primary-glow [&>span:last-child]:border-accent [&>span:last-child]:bg-background [&>span:last-child]:shadow-glass"
                disabled={saving}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};