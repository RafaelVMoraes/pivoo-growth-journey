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
              {selectedValues.map((value) => (
                <Badge key={value.value_name} variant="secondary" className="text-sm px-3 py-1">
                  {value.value_name}
                </Badge>
              ))}
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