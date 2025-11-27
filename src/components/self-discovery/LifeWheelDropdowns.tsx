import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Info, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface LifeWheelData {
  area_name: string;
  current_score: number;
  desired_score: number;
  is_focus_area?: boolean;
}

interface LifeWheelDropdownsProps {
  data: LifeWheelData[];
  onUpdate: (areaName: string, updates: Partial<LifeWheelData>) => void;
  saving: boolean;
  categories: Record<string, string[]>;
}

const SCORE_LABELS: Record<number, string> = {
  1: 'Not Goal',
  2: 'Very Low',
  3: 'Initial Awareness',
  4: 'Early Practice',
  5: 'Basic Consistency',
  6: 'Moderate Development',
  7: 'Solid Growth',
  8: 'Strong Stable',
  9: 'High Priority',
  10: 'Top Focus'
};

const SCORE_DESCRIPTIONS: Record<number, string> = {
  1: 'Not a goal, undeveloped',
  2: 'Very low clarity',
  3: 'Initial awareness',
  4: 'Early practice',
  5: 'Basic consistency',
  6: 'Moderate development',
  7: 'Solid growth',
  8: 'Strong and stable',
  9: 'High priority, highly developed (focus area only)',
  10: 'Most important focus area, fully integrated (focus area only)'
};

const ScaleInfoDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Info size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Life Wheel Scale Guide</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {Object.entries(SCORE_DESCRIPTIONS).map(([score, description]) => (
            <div key={score} className="flex gap-3">
              <div className="font-bold text-primary min-w-[2rem]">{score}</div>
              <div className="text-sm text-muted-foreground">{description}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const LifeWheelDropdowns = ({ data, onUpdate, saving, categories }: LifeWheelDropdownsProps) => {
  const { t } = useTranslation();
  const [localData, setLocalData] = useState(data);

  // Sync with incoming data
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFocusToggle = (areaName: string, checked: boolean) => {
    setLocalData(prev => prev.map(area => 
      area.area_name === areaName ? { ...area, is_focus_area: checked } : area
    ));
    onUpdate(areaName, { is_focus_area: checked });
  };

  const handleScoreChange = (areaName: string, type: 'current' | 'desired', value: string) => {
    const numValue = parseInt(value);
    const area = localData.find(a => a.area_name === areaName);
    
    // Check if trying to set 9 or 10 without focus area
    if ((numValue === 9 || numValue === 10) && !area?.is_focus_area) {
      return; // Don't allow
    }

    const updates = type === 'current' 
      ? { current_score: numValue }
      : { desired_score: numValue };
    
    setLocalData(prev => prev.map(area => 
      area.area_name === areaName ? { ...area, ...updates } : area
    ));
    onUpdate(areaName, updates);
  };

  // Calculate averages
  const currentAverage = localData.length > 0 
    ? (localData.reduce((sum, area) => sum + area.current_score, 0) / localData.length).toFixed(1)
    : '0';
  
  const desiredAverage = localData.length > 0
    ? (localData.reduce((sum, area) => sum + area.desired_score, 0) / localData.length).toFixed(1)
    : '0';

  // Category colors
  const categoryColors: Record<string, string> = {
    'Life Quality': 'text-green-600 dark:text-green-400 border-green-500/30',
    'Personal': 'text-purple-600 dark:text-purple-400 border-purple-500/30',
    'Professional': 'text-blue-600 dark:text-blue-400 border-blue-500/30',
    'Relationships': 'text-pink-600 dark:text-pink-400 border-pink-500/30'
  };

  return (
    <Card className="gradient-card shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t('selfDiscovery.rateLifeAreas')}</CardTitle>
          <ScaleInfoDialog />
        </div>
        <p className="text-sm text-muted-foreground">
          {t('selfDiscovery.rateDescription')}
        </p>
        
        {/* Averages Display */}
        <div className="flex gap-4 mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground mb-1">Current Average</p>
            <p className="text-2xl font-bold text-primary">{currentAverage}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground mb-1">Target Average</p>
            <p className="text-2xl font-bold text-accent">{desiredAverage}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {Object.entries(categories).map(([categoryName, areas]) => (
          <div key={categoryName} className="space-y-4">
            {/* Category Header */}
            <div className={`flex items-center gap-2 pb-2 border-b-2 ${categoryColors[categoryName]}`}>
              <h3 className="font-semibold text-lg">
                {categoryName}
              </h3>
            </div>

            {/* Areas in this category */}
            {areas.map((areaName) => {
              const area = localData.find(a => a.area_name === areaName);
              if (!area) return null;

              return (
                <div key={area.area_name} className="space-y-3 pb-4 border-b last:border-b-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-base">{area.area_name}</h4>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`focus-${area.area_name}`}
                        checked={area.is_focus_area || false}
                        onCheckedChange={(checked) => handleFocusToggle(area.area_name, checked as boolean)}
                        disabled={saving}
                      />
                      <Label 
                        htmlFor={`focus-${area.area_name}`}
                        className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1"
                      >
                        <Star size={12} className={area.is_focus_area ? 'fill-primary text-primary' : ''} />
                        Focus Area
                      </Label>
                    </div>
                  </div>

                  {/* Side-by-side dropdowns */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Current Level */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Current Level</Label>
                      <Select
                        value={area.current_score.toString()}
                        onValueChange={(value) => handleScoreChange(area.area_name, 'current', value)}
                        disabled={saving}
                      >
                        <SelectTrigger className="w-full h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((score) => (
                            <SelectItem key={score} value={score.toString()}>
                              {score} – {SCORE_LABELS[score]}
                            </SelectItem>
                          ))}
                          {area.is_focus_area && (
                            <>
                              <SelectItem value="9">9 – {SCORE_LABELS[9]}</SelectItem>
                              <SelectItem value="10">10 – {SCORE_LABELS[10]}</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Target Level */}
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Target Level</Label>
                      <Select
                        value={area.desired_score.toString()}
                        onValueChange={(value) => handleScoreChange(area.area_name, 'desired', value)}
                        disabled={saving}
                      >
                        <SelectTrigger className="w-full h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((score) => (
                            <SelectItem key={score} value={score.toString()}>
                              {score} – {SCORE_LABELS[score]}
                            </SelectItem>
                          ))}
                          {area.is_focus_area && (
                            <>
                              <SelectItem value="9">9 – {SCORE_LABELS[9]}</SelectItem>
                              <SelectItem value="10">10 – {SCORE_LABELS[10]}</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};