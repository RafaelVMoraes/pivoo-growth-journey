import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, X, Edit2, Check, RotateCcw, Loader2 } from 'lucide-react';
import { useActivities, Activity } from '@/hooks/useActivities';
import { FrequencySelector } from './FrequencySelector';

interface ActivityListProps {
  goalId: string;
}

export const ActivityList = ({ goalId }: ActivityListProps) => {
  const { activities, isLoading, createActivity, updateActivity, deleteActivity } = useActivities(goalId);
  const [newActivity, setNewActivity] = useState({ 
    description: '', 
    frequencyType: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'custom',
    frequencyValue: 3
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState({ 
    description: '', 
    frequencyType: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'custom',
    frequencyValue: 3
  });
  const [isAdding, setIsAdding] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

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

  const handleEditActivity = (activity: Activity) => {
    setEditingId(activity.id);
    setEditingActivity({
      description: activity.description,
      frequencyType: activity.frequency_type || 'weekly',
      frequencyValue: activity.frequency_value || 3
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingActivity.description.trim()) return;

    try {
      await updateActivity(editingId, {
        description: editingActivity.description.trim(),
        frequency_type: editingActivity.frequencyType,
        frequency_value: editingActivity.frequencyValue
      });
      setEditingId(null);
      setEditingActivity({ description: '', frequencyType: 'weekly', frequencyValue: 3 });
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleToggleStatus = async (activity: Activity) => {
    // Prevent multiple clicks
    if (updatingIds.has(activity.id)) return;

    setUpdatingIds(prev => new Set(prev).add(activity.id));
    
    try {
      const newStatus = activity.status === 'active' ? 'completed' : 'active';
      await updateActivity(activity.id, { status: newStatus });
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(activity.id);
        return newSet;
      });
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
      <div className="space-y-2">
        {activities.map(activity => {
          const isUpdating = updatingIds.has(activity.id);
          
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
              <div className="relative">
                <Checkbox
                  checked={activity.status === 'completed'}
                  onCheckedChange={() => handleToggleStatus(activity)}
                  className="mt-0.5 min-h-[20px] min-w-[20px]"
                  disabled={isUpdating}
                />
                {isUpdating && (
                  <Loader2 size={14} className="absolute top-0.5 left-0.5 animate-spin text-primary" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                {editingId === activity.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editingActivity.description}
                      onChange={(e) => setEditingActivity(prev => ({ ...prev, description: e.target.value }))}
                      className="text-sm min-h-[44px]"
                    />
                    <FrequencySelector
                      value={{
                        type: editingActivity.frequencyType,
                        value: editingActivity.frequencyValue
                      }}
                      onChange={(freq) => setEditingActivity(prev => ({
                        ...prev,
                        frequencyType: freq.type,
                        frequencyValue: freq.value || 3
                      }))}
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
                    <p className={`text-sm ${activity.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {activity.description}
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">
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