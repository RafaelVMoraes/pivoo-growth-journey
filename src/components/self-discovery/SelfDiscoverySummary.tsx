import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { LifeWheelChart } from './LifeWheelChart';
import { Badge } from '@/components/ui/badge';

interface LifeWheelData {
  area_name: string;
  current_score: number;
  desired_score: number;
  is_focus_area?: boolean;
}

interface ValuesData {
  value_name: string;
  selected: boolean;
}

interface VisionData {
  vision_1y?: string;
  vision_3y?: string;
  word_year?: string;
  phrase_year?: string;
}

interface SelfDiscoverySummaryProps {
  lifeWheelData: LifeWheelData[];
  valuesData: ValuesData[];
  visionData: VisionData;
  onEdit: () => void;
}

export const SelfDiscoverySummary = ({ 
  lifeWheelData, 
  valuesData, 
  visionData, 
  onEdit 
}: SelfDiscoverySummaryProps) => {
  const selectedValues = valuesData.filter(v => v.selected);

  // Category colors with proper contrast
  const categoryColors: Record<string, { bg: string, text: string }> = {
    'Identity & Integrity': { bg: 'bg-purple-500/20 dark:bg-purple-500/30', text: 'text-purple-900 dark:text-purple-100' },
    'Growth & Mastery': { bg: 'bg-blue-500/20 dark:bg-blue-500/30', text: 'text-blue-900 dark:text-blue-100' },
    'Connection & Community': { bg: 'bg-pink-500/20 dark:bg-pink-500/30', text: 'text-pink-900 dark:text-pink-100' },
    'Well-being & Balance': { bg: 'bg-green-500/20 dark:bg-green-500/30', text: 'text-green-900 dark:text-green-100' },
    'Purpose & Impact': { bg: 'bg-orange-500/20 dark:bg-orange-500/30', text: 'text-orange-900 dark:text-orange-100' }
  };

  const PREDEFINED_VALUES = {
    'Identity & Integrity': ['Authenticity', 'Responsibility', 'Honesty', 'Discipline', 'Courage', 'Reliability'],
    'Growth & Mastery': ['Learning', 'Curiosity', 'Excellence', 'Innovation', 'Resilience', 'Ambition'],
    'Connection & Community': ['Empathy', 'Belonging', 'Collaboration', 'Diversity', 'Family', 'Generosity'],
    'Well-being & Balance': ['Health', 'Stability', 'Mindfulness', 'Joy', 'Simplicity', 'Peace'],
    'Purpose & Impact': ['Freedom', 'Contribution', 'Creativity', 'Sustainability', 'Leadership', 'Vision']
  };

  const getCategoryForValue = (valueName: string): string => {
    for (const [category, values] of Object.entries(PREDEFINED_VALUES)) {
      if (values.includes(valueName)) return category;
    }
    return 'Identity & Integrity'; // fallback for custom values
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Your Self-Discovery Summary</h1>
          <p className="text-muted-foreground">Your complete vision and focus areas</p>
        </div>
        <Button onClick={onEdit} className="gap-2">
          <Edit size={16} />
          Edit
        </Button>
      </div>

      {/* Word and Phrase of the Year */}
      {(visionData.word_year || visionData.phrase_year) && (
        <Card className="gradient-card shadow-soft">
          <CardHeader>
            <CardTitle>Year Focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {visionData.word_year && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Word of the Year</p>
                <p className="text-3xl font-bold text-primary">{visionData.word_year}</p>
              </div>
            )}
            {visionData.phrase_year && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Phrase of the Year</p>
                <p className="text-xl font-medium italic">{visionData.phrase_year}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Life Wheel Chart */}
      <LifeWheelChart data={lifeWheelData} />

      {/* Selected Values */}
      {selectedValues.length > 0 && (
        <Card className="gradient-card shadow-soft">
          <CardHeader>
            <CardTitle>Core Values</CardTitle>
            <p className="text-sm text-muted-foreground">
              Your {selectedValues.length} guiding principles
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((value) => {
                const category = getCategoryForValue(value.value_name);
                const colors = categoryColors[category];
                return (
                  <Badge 
                    key={value.value_name} 
                    className={`text-sm px-3 py-1.5 border ${colors.bg} ${colors.text} border-current/30`}
                  >
                    {value.value_name}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vision Statements */}
      {(visionData.vision_1y || visionData.vision_3y) && (
        <Card className="gradient-card shadow-soft">
          <CardHeader>
            <CardTitle>Vision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {visionData.vision_1y && (
              <div>
                <h3 className="font-semibold text-lg mb-2 text-primary">1 Year Vision</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{visionData.vision_1y}</p>
              </div>
            )}
            {visionData.vision_3y && (
              <div>
                <h3 className="font-semibold text-lg mb-2 text-accent">3 Year Vision</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{visionData.vision_3y}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};