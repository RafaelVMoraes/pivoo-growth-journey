import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit2, Check, RotateCcw } from 'lucide-react';
import { useActivities, Activity } from '@/hooks/useActivities';

interface ActivityListProps {
  goalId: string;
}

export const ActivityList = ({ goalId }: ActivityListProps) => {
  const { activities, isLoading, createActivity, updateActivity, deleteActivity } = useActivities(goalId);
  const [newActivity, setNewActivity] = useState({ description: '', frequency: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState({ description: '', frequency: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddActivity = async () => {
    if (!newActivity.description.trim()) return;

    try {
      await createActivity({
        goal_id: goalId,
        description: newActivity.description.trim(),
        frequency: newActivity.frequency.trim() || undefined,
        status: 'active'
      });
      setNewActivity({ description: '', frequency: '' });
      setIsAdding(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingId(activity.id);
    setEditingActivity({
      description: activity.description,
      frequency: activity.frequency || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingActivity.description.trim()) return;

    try {
      await updateActivity(editingId, {
        description: editingActivity.description.trim(),
        frequency: editingActivity.frequency.trim() || undefined
      });
      setEditingId(null);
      setEditingActivity({ description: '', frequency: '' });
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleToggleStatus = async (activity: Activity) => {
    const newStatus = activity.status === 'active' ? 'completed' : 'active';
    await updateActivity(activity.id, { status: newStatus });
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading activities...</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Activities & Habits</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="text-xs h-7"
        >
          <Plus size={12} className="mr-1" />
          Add Activity
        </Button>
      </div>

      {/* Add new activity form */}
      {isAdding && (
        <div className="bg-accent/50 p-3 rounded-lg space-y-2">
          <Input
            placeholder="Activity description"
            value={newActivity.description}
            onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
            className="text-sm"
          />
          <Input
            placeholder="Frequency (e.g., 3x/week, daily)"
            value={newActivity.frequency}
            onChange={(e) => setNewActivity(prev => ({ ...prev, frequency: e.target.value }))}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddActivity} disabled={!newActivity.description.trim()}>
              <Check size={12} className="mr-1" />
              Add
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
              setIsAdding(false);
              setNewActivity({ description: '', frequency: '' });
            }}>
              <X size={12} className="mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Activities list */}
      <div className="space-y-2">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
            <Checkbox
              checked={activity.status === 'completed'}
              onCheckedChange={() => handleToggleStatus(activity)}
              className="mt-0.5"
            />
            
            <div className="flex-1 min-w-0">
              {editingId === activity.id ? (
                <div className="space-y-2">
                  <Input
                    value={editingActivity.description}
                    onChange={(e) => setEditingActivity(prev => ({ ...prev, description: e.target.value }))}
                    className="text-sm"
                  />
                  <Input
                    placeholder="Frequency (optional)"
                    value={editingActivity.frequency}
                    onChange={(e) => setEditingActivity(prev => ({ ...prev, frequency: e.target.value }))}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveEdit}>
                      <Check size={12} className="mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
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
                  {activity.frequency && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      <RotateCcw size={10} className="mr-1" />
                      {activity.frequency}
                    </Badge>
                  )}
                </>
              )}
            </div>

            {editingId !== activity.id && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditActivity(activity)}
                  className="h-6 w-6 p-0"
                >
                  <Edit2 size={12} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteActivity(activity.id)}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <X size={12} />
                </Button>
              </div>
            )}
          </div>
        ))}
        
        {activities.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No activities yet. Add some concrete actions to achieve your goal!
          </p>
        )}
      </div>
    </div>
  );
};