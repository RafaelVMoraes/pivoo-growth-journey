import { useState, useEffect } from 'react';
import { Goal } from '@/hooks/useGoals';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, Target, CheckCircle2, Pause, Play, RotateCcw, Maximize2, Lightbulb, Flame, TrendingUp, MoreVertical, Edit2, Archive, Trash2 } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { useTranslation } from '@/hooks/useTranslation';
import { useCheckIns } from '@/hooks/useCheckIns';
import { useActivities } from '@/hooks/useActivities';
import { ReflectionLayer } from './ReflectionLayer';
import { GoalDetailsDialog } from './GoalDetailsDialog';
import { EditGoalDialog } from './EditGoalDialog';

interface EnhancedGoalCardProps {
  goal: Goal;
}

export const EnhancedGoalCard = ({ goal }: EnhancedGoalCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { updateGoal, deleteGoal, getSubGoals, refetch } = useGoals();
  const { t } = useTranslation();
  const { checkIns } = useCheckIns(goal.id);
  const { activities } = useActivities(goal.id);

  const subGoals = getSubGoals(goal.id);

  // Calculate progress from check-ins
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    if (goal.type === 'outcome') {
      // For outcome goals, calculate based on sub-goals completion
      if (subGoals.length > 0) {
        const completedSubGoals = subGoals.filter(sg => sg.status === 'completed').length;
        setProgressPercentage(Math.round((completedSubGoals / subGoals.length) * 100));
      } else {
        // If no sub-goals, use check-ins count as progress indicator
        setProgressPercentage(Math.min(checkIns.length * 5, 100));
      }
    } else {
      // For process goals, calculate streak and completion rate
      const sortedCheckIns = [...checkIns].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Calculate streak
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < sortedCheckIns.length; i++) {
        const checkInDate = new Date(sortedCheckIns[i].date);
        checkInDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
        } else {
          break;
        }
      }
      setStreakDays(streak);

      // Calculate completion rate for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentCheckIns = checkIns.filter(ci => new Date(ci.date) >= thirtyDaysAgo);
      
      // Expected check-ins based on activities frequency
      let expectedCheckIns = 0;
      activities.forEach(activity => {
        if (activity.frequency_type === 'daily') {
          expectedCheckIns += 30;
        } else if (activity.frequency_type === 'weekly') {
          expectedCheckIns += (activity.frequency_value || 1) * 4;
        } else if (activity.frequency_type === 'monthly') {
          expectedCheckIns += (activity.frequency_value || 1);
        }
      });
      
      if (expectedCheckIns > 0) {
        setCompletionRate(Math.min(Math.round((recentCheckIns.length / expectedCheckIns) * 100), 100));
      }
    }
  }, [goal.type, checkIns, subGoals, activities]);

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

  const handleMarkComplete = async () => {
    await updateGoal(goal.id, { status: 'completed' });
  };

  const handleReactivate = async () => {
    await updateGoal(goal.id, { status: 'active' });
  };

  const handleArchive = async () => {
    await updateGoal(goal.id, { status: 'archived' });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await deleteGoal(goal.id);
    }
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
            <span className="font-medium text-foreground">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
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
              <div className="text-sm font-medium text-foreground">{streakDays} day streak</div>
              <div className="text-xs text-muted-foreground">{streakDays > 0 ? 'Keep it up!' : 'Start today!'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <TrendingUp size={16} className={completionRate >= 70 ? "text-success" : "text-warning"} />
            <span className={`text-sm font-medium ${completionRate >= 70 ? "text-success" : "text-warning"}`}>
              {completionRate}% completion
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Card className="glass-card hover:scale-[1.01] transition-all duration-200 overflow-hidden">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 mt-0.5">
                {getTypeIcon()}
                <span className="text-lg">{getTypeEmoji()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground leading-tight mb-1">{goal.title}</h3>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 hover:bg-accent/50 rounded-md transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Goal actions"
                  >
                    <MoreVertical size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <Edit2 size={14} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleArchive}>
                    <Archive size={14} className="mr-2" />
                    Archive
                  </DropdownMenuItem>
                  {goal.status === 'completed' && (
                    <DropdownMenuItem onClick={handleReactivate}>
                      <Play size={14} className="mr-2" />
                      Reactivate
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  <Badge key={value} variant="outline" className="text-xs px-2 py-1 bg-background border-2 font-medium">
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
            {goal.status !== 'completed' && goal.type === 'outcome' && (
              <Button
                size="sm"
                variant="default"
                onClick={handleMarkComplete}
                className="flex-1 h-11 min-h-[44px]"
              >
                <CheckCircle2 size={14} className="mr-1.5" />
                {t('goal.markComplete')}
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsDetailsOpen(true)}
              className={`${goal.status !== 'completed' && goal.type === 'outcome' ? 'flex-1' : 'flex-[2]'} h-11 min-h-[44px] whitespace-nowrap overflow-hidden`}
            >
              <Maximize2 size={14} className="mr-1.5 flex-shrink-0" />
              <span className="truncate">View Details</span>
            </Button>
            
            <ReflectionLayer goalTitle={goal.title}>
              <Button size="sm" variant="outline" className="px-3 h-11 min-h-[44px] min-w-[44px] flex-shrink-0" aria-label="Reflect on goal">
                <Lightbulb size={14} />
              </Button>
            </ReflectionLayer>
          </div>
        </div>
      </Card>

      {/* Dialogs */}
      <GoalDetailsDialog goal={goal} isOpen={isDetailsOpen} onClose={() => { setIsDetailsOpen(false); refetch(); }} />
      <EditGoalDialog goal={goal} isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); refetch(); }} />
    </>
  );
};