import { useState } from 'react';
import { Goal } from '@/hooks/useGoals';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar, Target, CheckCircle2, Pause, Play, RotateCcw, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { ActivityList } from './ActivityList';
import { CheckInForm } from './CheckInForm';
import { ReflectionLayer } from './ReflectionLayer';

interface EnhancedGoalCardProps {
  goal: Goal;
}

export const EnhancedGoalCard = ({ goal }: EnhancedGoalCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateGoal } = useGoals();

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
        return <CheckCircle2 size={20} className="text-green-500" />;
      case 'on_hold':
        return <Pause size={20} className="text-yellow-500" />;
      case 'in_progress':
        return <Play size={20} className="text-blue-500" />;
      case 'archived':
        return <Target size={20} className="text-gray-500" />;
      default:
        return <Target size={20} className="text-primary" />;
    }
  };

  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300';
      case 'on_hold':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-300';
      case 'archived':
        return 'bg-gray-500/20 text-gray-300';
      default:
        return 'bg-primary/20 text-primary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="glass-card border-glass hover:scale-[1.02] transition-all duration-300">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {getTypeIcon()}
              <h3 className="font-semibold text-foreground truncate">{goal.title}</h3>
              <span className="text-xs">{getTypeEmoji()}</span>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Badge className={getStatusColor()}>
                {goal.status.replace('_', ' ')}
              </Badge>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-1">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Goal info */}
          {goal.description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {goal.description}
            </p>
          )}

          {/* Metadata */}
          <div className="space-y-2 mb-4">
            {goal.category && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {goal.category}
                </Badge>
              </div>
            )}

            {goal.target_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={14} />
                <span>Target: {formatDate(goal.target_date)}</span>
              </div>
            )}

            {goal.life_wheel_area && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  📊 {goal.life_wheel_area}
                </Badge>
              </div>
            )}

            {goal.related_values && goal.related_values.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {goal.related_values.map(value => (
                  <Badge key={value} variant="outline" className="text-xs">
                    ✨ {value}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={goal.status === 'completed' ? 'outline' : 'default'}
              onClick={handleStatusChange}
              className="flex-1"
            >
              {goal.status === 'completed' ? (
                <>
                  <Play size={14} className="mr-1" />
                  Reactivate
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} className="mr-1" />
                  Complete
                </>
              )}
            </Button>
            
            <ReflectionLayer goalTitle={goal.title}>
              <Button size="sm" variant="outline" className="px-3">
                <Lightbulb size={14} />
              </Button>
            </ReflectionLayer>
          </div>
        </div>

        {/* Expanded content */}
        <CollapsibleContent>
          <div className="border-t p-4 space-y-6">
            {/* Activities section */}
            <ActivityList goalId={goal.id} />
            
            {/* Check-in section */}
            <CheckInForm goalId={goal.id} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};