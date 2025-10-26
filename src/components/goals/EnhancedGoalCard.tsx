import { useState } from 'react';
import { Goal } from '@/hooks/useGoals';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar, Target, CheckCircle2, Pause, Play, RotateCcw, ChevronDown, ChevronUp, Lightbulb, Flame, TrendingUp } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { useTranslation } from '@/hooks/useTranslation';
import { ActivityList } from './ActivityList';
import { CheckInForm } from './CheckInForm';
import { ReflectionLayer } from './ReflectionLayer';

interface EnhancedGoalCardProps {
  goal: Goal;
}

export const EnhancedGoalCard = ({ goal }: EnhancedGoalCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateGoal, getSubGoals } = useGoals();
  const { t } = useTranslation();

  const subGoals = getSubGoals(goal.id);

  const getTypeIcon = () => {
    return goal.type === 'outcome' ? (
      <Target size={16} className="text-primary" />
    ) : (
      <RotateCcw size={16} className="text-primary" />
    );
  };

  const getTypeEmoji = () => {
    return goal.type === 'outcome' ? '🎯' : '🔄';
  };

  const handleStatusChange = async () => {
    const newStatus = goal.status === 'active' 
      ? 'completed' 
      : goal.status === 'completed' 
        ? 'active' 
        : 'active';

    await updateGoal(goal.id, { status: newStatus });
  };

  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed':
        return <CheckCircle2 size={20} className="text-success" />;
      case 'on_hold':
        return <Pause size={20} className="text-warning" />;
      case 'in_progress':
        return <Play size={20} className="text-primary" />;
      case 'archived':
        return <Target size={20} className="text-muted-foreground" />;
      default:
        return <Target size={20} className="text-primary" />;
    }
  };

  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed':
        return 'bg-success/20 text-success border-success/30';
      case 'on_hold':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'in_progress':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'archived':
        return 'bg-muted/20 text-muted-foreground border-muted/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderLifeAreas = () => {
    if (!goal.life_wheel_area) return null;
    
    const areas = Array.isArray(goal.life_wheel_area) 
      ? goal.life_wheel_area 
      : [goal.life_wheel_area];

    return areas.map(area => (
      <div key={area} className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-primary"></div>
        <span>{area}</span>
      </div>
    ));
  };

  // Different UI based on goal type
  const renderGoalTypeSpecific = () => {
    if (goal.type === 'outcome') {
      // Outcome goals: show milestone progress and target date
      return (
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress to target</span>
            <span className="font-medium text-foreground">45%</span>
          </div>
          <Progress value={45} className="h-2" />
          {goal.target_date && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={14} />
              <span>Target: {formatDate(goal.target_date)}</span>
            </div>
          )}
        </div>
      );
    } else {
      // Process goals: show streak/habit completion
      return (
        <div className="flex items-center gap-4 mb-4 p-3 bg-accent/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-orange-500" />
            <div>
              <div className="text-sm font-medium text-foreground">7 day streak</div>
              <div className="text-xs text-muted-foreground">Keep it up!</div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <TrendingUp size={16} className="text-success" />
            <span className="text-sm font-medium text-success">85% completion</span>
          </div>
        </div>
      );
    }
  };

  return (
    <Card className="glass-card hover:scale-[1.01] transition-all duration-200 overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getTypeIcon()}
                <span className="text-lg inline-block p-1 rounded bg-gray-100 dark:bg-gray-800 align-middle">
                  {getTypeEmoji()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground leading-tight mb-1">
                  {goal.title}
                </h3>
                {goal.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {goal.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-3">
              <Badge className={`${getStatusColor()} font-medium border`}>
                {t(`goal.status${goal.status.charAt(0).toUpperCase() + goal.status.slice(1).replace('_', '')}`)}
              </Badge>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-accent/50 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={isExpanded ? "Collapse" : "Expand"}
                aria-expanded={isExpanded}
              >
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {/* Type-specific UI */}
          {renderGoalTypeSpecific()}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {renderLifeAreas()}
            
            {goal.category && (
              <Badge variant="outline" className="text-xs font-medium">
                {goal.category}
              </Badge>
            )}
          </div>

          {/* Values */}
          {goal.related_values && goal.related_values.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {goal.related_values.map(value => (
                  <Badge
                    key={value}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-800 
                              dark:bg-blue-900 dark:text-blue-100 border-none"
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
          
          )}

          {/* Sub-goals */}
          {subGoals.length > 0 && (
            <div className="mb-4 p-3 bg-accent/10 rounded-lg border border-border">
              <div className="text-xs font-medium text-muted-foreground mb-2">Sub-goals ({subGoals.length})</div>
              <div className="space-y-1">
                {subGoals.map(subGoal => (
                  <div key={subGoal.id} className="text-sm text-foreground flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${subGoal.status === 'completed' ? 'bg-success' : 'bg-muted'}`}></div>
                    <span className={subGoal.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
                      {subGoal.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={goal.status === 'completed' ? 'outline' : 'default'}
              onClick={handleStatusChange}
              className="flex-1 h-11 min-h-[44px]"
            >
              {goal.status === 'completed' ? (
                <>
                  <Play size={14} className="mr-1.5" />
                  {t('goal.reactivate')}
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} className="mr-1.5" />
                  {t('goal.markComplete')}
                </>
              )}
            </Button>
            
            <ReflectionLayer goalTitle={goal.title}>
              <Button size="sm" variant="outline" className="px-3 h-11 min-h-[44px] min-w-[44px]" aria-label="Reflect on goal">
                <Lightbulb size={14} />
              </Button>
            </ReflectionLayer>
          </div>
        </div>

        {/* Expanded content */}
        <CollapsibleContent>
          <div className="border-t bg-accent/10 p-5 space-y-6">
            <ActivityList goalId={goal.id} />
            <CheckInForm goalId={goal.id} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};