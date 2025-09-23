import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

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

  return (
    <Card className="gradient-card shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Rate Your Life Areas</CardTitle>
        <p className="text-sm text-muted-foreground">
          Use the sliders to rate where you are now and where you want to be
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((area) => (
          <div key={area.area_name} className="space-y-3">
            <h4 className="font-medium text-base">{area.area_name}</h4>
            
            {/* Current Score Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-muted-foreground">Where I am now</label>
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
                <label className="text-sm text-muted-foreground">Where I want to be</label>
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