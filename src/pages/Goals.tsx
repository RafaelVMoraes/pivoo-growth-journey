import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Clock, CheckCircle, Tag, Bell } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { AddGoalDialog } from '@/components/goals/AddGoalDialog';
import { GoalCard } from '@/components/goals/GoalCard';

export const Goals = () => {
  const { user, isGuest } = useAuth();
  const { goals, isLoading } = useGoals();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Target size={48} className="mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading goals...</p>
        </div>
      </div>
    );
  }

  const hasGoals = goals.length > 0;

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-foreground">Goals</h1>
            {!isGuest && (
              <AddGoalDialog>
                <Button className="gap-2">
                  <Plus size={20} />
                  Add Goal
                </Button>
              </AddGoalDialog>
            )}
          </div>
          <p className="text-muted-foreground">
            Set and track your personal development objectives
          </p>
        </div>

        {/* Goals List or Empty State */}
        {hasGoals ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            <div className="text-center py-12">
              <div className="gradient-card p-8 rounded-2xl mb-6">
                <Target size={64} className="mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Set Your First Goal
                </h2>
                <p className="text-muted-foreground mb-6">
                  Transform your aspirations into achievable objectives with our SMART goal framework
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-6">
                  <Badge variant="secondary">Time-bound</Badge>
                  <Badge variant="secondary">Specific</Badge>
                  <Badge variant="secondary">Achievable</Badge>
                </div>

                {isGuest ? (
                  <p className="text-sm text-muted-foreground">
                    Sign up to start tracking your goals and connect them with your values
                  </p>
                ) : (
                  <AddGoalDialog>
                    <Button className="gap-2">
                      <Plus size={20} />
                      Add Your First Goal
                    </Button>
                  </AddGoalDialog>
                )}
              </div>
            </div>

            {/* Feature Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="text-primary" size={24} />
                  <h3 className="font-semibold text-foreground">Smart Goals</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Create specific, measurable, achievable, relevant, and time-bound objectives
                </p>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="text-primary" size={24} />
                  <h3 className="font-semibold text-foreground">Progress Tracking</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Monitor your progress with visual indicators and milestone tracking
                </p>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Tag className="text-primary" size={24} />
                  <h3 className="font-semibold text-foreground">Categories</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Organize goals by life areas and connect them with your core values
                </p>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Bell className="text-primary" size={24} />
                  <h3 className="font-semibold text-foreground">Reminders</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Stay on track with smart notifications and deadline alerts
                </p>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Goals;