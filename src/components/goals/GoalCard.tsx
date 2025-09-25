import { Goal } from '@/hooks/useGoals';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Target, CheckCircle2, Pause, Play } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const { updateGoal } = useGoals();

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
      default:
        return <Target size={20} className="text-primary" />;
    }
  };

  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed':
        return 'bg-success/20 text-success';
      case 'on_hold':
        return 'bg-warning/20 text-warning';
      case 'in_progress':
        return 'bg-primary/20 text-primary';
      case 'archived':
        return 'bg-muted/20 text-muted-foreground';
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
    <Card className="glass-card border-glass p-4 hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h3 className="font-semibold text-foreground">{goal.title}</h3>
        </div>
        <Badge className={getStatusColor()}>
          {goal.status}
        </Badge>
      </div>

      {goal.description && (
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {goal.description}
        </p>
      )}

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
      </div>
    </Card>
  );
};