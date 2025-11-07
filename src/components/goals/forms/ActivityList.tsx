import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Plus, X, Edit2, Check, RotateCcw, Loader2, Calendar } from 'lucide-react';
import { useActivities, Activity } from '@/hooks/useActivities';
import { useCheckIns } from '@/hooks/useCheckIns';
import { FrequencySelector } from './FrequencySelector';

interface ActivityListProps {
  goalId: string;
}

export const ActivityList = ({ goalId }: ActivityListProps) => {
  const { activities, isLoading, createActivity, updateActivity, deleteActivity } = useActivities(goalId);
  const { checkIns, createCheckIn } = useCheckIns(goalId);
  const [newActivity, setNewActivity] = useState({ 
    description: '', 
    frequencyType: 'weekly' as 'daily' | 'weekly' | 'monthly',
    frequencyValue: 3
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState({ 
    description: '', 
    frequencyType: 'weekly' as 'daily' | 'weekly' | 'monthly',
    frequencyValue: 3
  });
  const [isAdding, setIsAdding] = useState(false);
  const [creatingCheckIn, setCreatingCheckIn] = useState<string | null>(null);

  // Calculate progress for each activity
  const [activityProgress, setActivityProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const progress: Record<string, number> = {};
    
    activities.forEach(activity => {
      const activityCheckIns = checkIns.filter(ci => ci.activity_id === activity.id);
      
      // Calculate expected check-ins for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentCheckIns = activityCheckIns.filter(ci => new Date(ci.date) >= thirtyDaysAgo);
      
      let expectedCheckIns = 0;
      if (activity.frequency_type === 'daily') {
        expectedCheckIns = 30;
      } else if (activity.frequency_type === 'weekly') {
        expectedCheckIns = (activity.frequency_value || 1) * 4;
      } else if (activity.frequency_type === 'monthly') {
        expectedCheckIns = (activity.frequency_value || 1);
      }
      
      if (expectedCheckIns > 0) {
        progress[activity.id] = Math.min(Math.round((recentCheckIns.length / expectedCheckIns) * 100), 100);
      } else {
        progress[activity.id] = 0;
      }
    });
    
    setActivityProgress(progress);
  }, [activities, checkIns]);

  const handleAddActivity = async () => {
    if (!newActivity.description.trim()) return;

    try {
      await createActivity({
        goal_id: goalId,
        description: newActivity.description.trim(),
        frequency_type: newActivity.frequencyType,
        frequency_value: newActivity.frequencyValue,
        status: 'active'
      });
      setNewActivity({ description: '', frequencyType: 'weekly', frequencyValue: 3 });
      setIsAdding(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const [editingFrequency, setEditingFrequency] = useState<{
    type: 'daily' | 'weekly' | 'monthly';
    value?: number;
    timeOfDay?: 'morning' | 'afternoon' | 'night';
    daysOfWeek?: string[];
    dayOfMonth?: number;
  }>({ type: 'weekly' });

  const handleEditActivity = (activity: Activity) => {
    setEditingId(activity.id);
    const validType = activity.frequency_type === 'custom' ? 'weekly' : (activity.frequency_type || 'weekly');
    setEditingActivity({
      description: activity.description,
      frequencyType: validType as 'daily' | 'weekly' | 'monthly',
      frequencyValue: activity.frequency_value || 3
    });
    setEditingFrequency({
      type: validType as 'daily' | 'weekly' | 'monthly',
      value: activity.frequency_value,
      timeOfDay: activity.time_of_day,
      daysOfWeek: activity.days_of_week,
      dayOfMonth: activity.day_of_month
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingActivity.description.trim()) return;

    try {
      await updateActivity(editingId, {
        description: editingActivity.description.trim(),
        frequency_type: editingFrequency.type,
        frequency_value: editingFrequency.value,
        time_of_day: editingFrequency.timeOfDay,
        days_of_week: editingFrequency.daysOfWeek,
        day_of_month: editingFrequency.dayOfMonth
      });
      setEditingId(null);
      setEditingActivity({ description: '', frequencyType: 'weekly', frequencyValue: 3 });
      setEditingFrequency({ type: 'weekly' });
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleMarkDone = async (activity: Activity) => {
    if (creatingCheckIn === activity.id) return;

    setCreatingCheckIn(activity.id);
    
    try {
      await createCheckIn({
        goal_id: goalId,
        activity_id: activity.id,
        date: new Date().toISOString(),
        progress_value: 'done',
        input_type: 'checkbox'
      });
    } finally {
      setCreatingCheckIn(null);
    }
  };

  const formatFrequency = (activity: Activity) => {
    if (activity.frequency_type === 'daily') return 'Daily';
    if (activity.frequency_type === 'weekly') return `${activity.frequency_value || 1}x/week`;
    if (activity.frequency_type === 'monthly') return `${activity.frequency_value || 1}x/month`;
    return activity.frequency || 'Custom';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Activities & Habits</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="text-xs h-9 min-h-[44px] px-4"
        >
          <Plus size={12} className="mr-1" />
          Add Activity
        </Button>
      </div>

      {/* Add new activity form */}
      {isAdding && (
        <div className="bg-accent/50 p-4 rounded-lg space-y-3 border border-border">
          <Input
            placeholder="Activity description (e.g., Run 30 min)"
            value={newActivity.description}
            onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
            className="text-sm min-h-[44px]"
          />
          <FrequencySelector
            value={{
              type: newActivity.frequencyType,
              value: newActivity.frequencyValue
            }}
            onChange={(freq) => setNewActivity(prev => ({
              ...prev,
              frequencyType: freq.type,
              frequencyValue: freq.value || 3
            }))}
          />
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleAddActivity} 
              disabled={!newActivity.description.trim()}
              className="min-h-[44px]"
            >
              <Check size={12} className="mr-1" />
              Add
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setIsAdding(false);
                setNewActivity({ description: '', frequencyType: 'weekly', frequencyValue: 3 });
              }}
              className="min-h-[44px]"
            >
              <X size={12} className="mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Activities list */}
      <div className="space-y-3">
        {activities.map(activity => {
          const isCreating = creatingCheckIn === activity.id;
          const progress = activityProgress[activity.id] || 0;
          
          return (
            <div key={activity.id} className="bg-accent/30 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  {editingId === activity.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editingActivity.description}
                        onChange={(e) => setEditingActivity(prev => ({ ...prev, description: e.target.value }))}
                        className="text-sm min-h-[44px]"
                      />
                      <FrequencySelector
                        value={editingFrequency}
                        onChange={(freq) => setEditingFrequency(freq)}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit} className="min-h-[44px]">
                          <Check size={12} className="mr-1" />
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setEditingId(null)}
                          className="min-h-[44px]"
                        >
                          <X size={12} className="mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-foreground mb-1">
                        {activity.description}
                      </p>
                      <Badge variant="outline" className="text-xs bg-background border-2 font-medium">
                        <RotateCcw size={10} className="mr-1" />
                        {formatFrequency(activity)}
                      </Badge>
                    </>
                  )}
                </div>

                {editingId !== activity.id && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditActivity(activity)}
                      className="h-9 w-9 min-h-[44px] min-w-[44px] p-0 flex items-center justify-center hover:bg-accent rounded-md transition-colors"
                      aria-label="Edit activity"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteActivity(activity.id)}
                      className="h-9 w-9 min-h-[44px] min-w-[44px] p-0 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                      aria-label="Delete activity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {editingId !== activity.id && (
                <>
                  {/* Progress tracking */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Last 30 days</span>
                      <span className={`font-medium ${progress >= 70 ? 'text-success' : progress >= 40 ? 'text-warning' : 'text-muted-foreground'}`}>
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>

                  {/* Mark done button */}
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleMarkDone(activity)}
                    disabled={isCreating}
                    className="w-full min-h-[44px]"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 size={14} className="mr-1.5 animate-spin" />
                        Recording...
                      </>
                    ) : (
                      <>
                        <Calendar size={14} className="mr-1.5" />
                        Mark as Done Today
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          );
        })}
        
        {activities.length === 0 && !isAdding && (
          <div className="text-center py-8 px-4 bg-accent/20 rounded-lg border-2 border-dashed border-border">
            <p className="text-sm text-muted-foreground mb-3">
              No activities yet — let's add some concrete actions!
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Try adding: "Run 30 min 3x/week" or "Read 10 pages daily"
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAdding(true)}
              className="min-h-[44px]"
            >
              <Plus size={14} className="mr-2" />
              Add your first activity
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};