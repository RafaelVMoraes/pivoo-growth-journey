import { useState } from 'react';
import { Goal } from '@/hooks/useGoals';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Target, RotateCcw, Eye } from 'lucide-react';
import { GoalDetailsDialog } from './GoalDetailsDialog';

interface HighLevelViewProps {
  goals: Goal[];
  isLoading: boolean;
}

export const HighLevelView = ({ goals, isLoading }: HighLevelViewProps) => {
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Target size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  // Group goals by life area
  const goalsByArea = goals.reduce((acc, goal) => {
    const areas = Array.isArray(goal.life_wheel_area) ? goal.life_wheel_area : [goal.life_wheel_area || 'Other'];
    areas.forEach(area => {
      if (!acc[area]) acc[area] = [];
      acc[area].push(goal);
    });
    return acc;
  }, {} as Record<string, Goal[]>);

  const toggleArea = (area: string) => {
    const newExpanded = new Set(expandedAreas);
    if (newExpanded.has(area)) {
      newExpanded.delete(area);
    } else {
      newExpanded.add(area);
    }
    setExpandedAreas(newExpanded);
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <Card className="p-8 bg-accent/20">
          <Target size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">No goals yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first goal to start tracking your progress
          </p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {Object.entries(goalsByArea).map(([area, areaGoals]) => {
          const isExpanded = expandedAreas.has(area);
          
          return (
            <Card key={area} className="overflow-hidden">
              {/* Area Header */}
              <button
                onClick={() => toggleArea(area)}
                className="w-full p-4 flex items-center justify-between hover:bg-accent/30 transition-colors min-h-[60px]"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <h3 className="text-lg font-semibold text-foreground">{area}</h3>
                  <Badge variant="outline" className="bg-background">
                    {areaGoals.length} {areaGoals.length === 1 ? 'goal' : 'goals'}
                  </Badge>
                </div>
              </button>

              {/* Area Goals */}
              {isExpanded && (
                <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {areaGoals.map(goal => (
                    <GoalMiniCard 
                      key={goal.id} 
                      goal={goal} 
                      onViewDetails={() => setSelectedGoal(goal)}
                    />
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {selectedGoal && (
        <GoalDetailsDialog
          goal={selectedGoal}
          isOpen={!!selectedGoal}
          onClose={() => setSelectedGoal(null)}
        />
      )}
    </>
  );
};

// Mini goal card for high-level view
const GoalMiniCard = ({ goal, onViewDetails }: { goal: Goal; onViewDetails: () => void }) => {
  // Simple progress calculation (can be enhanced)
  const progress = goal.status === 'completed' ? 100 : 0;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {goal.type === 'outcome' ? (
              <Target size={18} className="text-primary flex-shrink-0" />
            ) : (
              <RotateCcw size={18} className="text-primary flex-shrink-0" />
            )}
            <h4 className="font-medium text-foreground truncate">{goal.title}</h4>
          </div>
        </div>

        {/* Life Areas */}
        {goal.life_wheel_area && (
          <div className="flex flex-wrap gap-1">
            {(Array.isArray(goal.life_wheel_area) ? goal.life_wheel_area : [goal.life_wheel_area]).map(area => (
              <Badge key={area} variant="outline" className="text-xs bg-background border-2">
                {area}
              </Badge>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Actions */}
        <Button
          size="sm"
          variant="outline"
          onClick={onViewDetails}
          className="w-full min-h-[44px]"
        >
          <Eye size={14} className="mr-2" />
          View Details
        </Button>
      </div>
    </Card>
  );
};
