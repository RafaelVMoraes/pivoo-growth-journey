import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Goal, useGoals } from '@/hooks/useGoals';
import { useSelfDiscovery } from '@/hooks/useSelfDiscovery';
import { useTranslation } from '@/hooks/useTranslation';
import { X } from 'lucide-react';

interface EditGoalDialogProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

export const EditGoalDialog = ({ goal, isOpen, onClose }: EditGoalDialogProps) => {
  const { updateGoal } = useGoals();
  const { lifeWheelData, valuesData } = useSelfDiscovery();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description || '');
  const [targetDate, setTargetDate] = useState(goal.target_date || '');
  const [priority, setPriority] = useState<Goal['priority']>(goal.priority);
  const [selectedAreas, setSelectedAreas] = useState<string[]>(
    Array.isArray(goal.life_wheel_area) ? goal.life_wheel_area : goal.life_wheel_area ? [goal.life_wheel_area] : []
  );
  const [selectedValues, setSelectedValues] = useState<string[]>(goal.related_values || []);
  const [status, setStatus] = useState<Goal['status']>(goal.status);

  const lifeWheelAreas = lifeWheelData.map(item => item.area_name);
  const availableValues = valuesData.filter(value => value.selected).map(value => value.value_name);

  useEffect(() => {
    setTitle(goal.title);
    setDescription(goal.description || '');
    setTargetDate(goal.target_date || '');
    setPriority(goal.priority);
    setSelectedAreas(Array.isArray(goal.life_wheel_area) ? goal.life_wheel_area : goal.life_wheel_area ? [goal.life_wheel_area] : []);
    setSelectedValues(goal.related_values || []);
    setStatus(goal.status);
  }, [goal]);

  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const toggleValue = (value: string) => {
    setSelectedValues(prev => 
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedAreas.length === 0) return;

    setIsSubmitting(true);
    try {
      await updateGoal(goal.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        target_date: targetDate || undefined,
        priority,
        life_wheel_area: selectedAreas,
        related_values: selectedValues.length > 0 ? selectedValues : undefined,
        status,
      });
      onClose();
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-[44px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPriority('gold')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  priority === 'gold'
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-border hover:border-yellow-500/50'
                }`}
              >
                <div className="text-xl mb-1">🥇</div>
                <div className="text-sm font-medium">Gold</div>
              </button>
              <button
                type="button"
                onClick={() => setPriority('silver')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  priority === 'silver'
                    ? 'border-gray-400 bg-gray-400/10'
                    : 'border-border hover:border-gray-400/50'
                }`}
              >
                <div className="text-xl mb-1">🥈</div>
                <div className="text-sm font-medium">Silver</div>
              </button>
              <button
                type="button"
                onClick={() => setPriority('bronze')}
                className={`p-3 rounded-lg border-2 transition-all ${
                  priority === 'bronze'
                    ? 'border-amber-700 bg-amber-700/10'
                    : 'border-border hover:border-amber-700/50'
                }`}
              >
                <div className="text-xl mb-1">🥉</div>
                <div className="text-sm font-medium">Bronze</div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Life Areas * (select one or more)</Label>
            <div className="flex flex-wrap gap-2">
              {lifeWheelAreas.map(area => (
                <Badge
                  key={area}
                  variant={selectedAreas.includes(area) ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform min-h-[44px] px-4 text-sm"
                  onClick={() => toggleArea(area)}
                  role="button"
                  tabIndex={0}
                >
                  {area}
                  {selectedAreas.includes(area) && <X size={12} className="ml-2" />}
                </Badge>
              ))}
            </div>
          </div>

          {availableValues.length > 0 && (
            <div className="space-y-2">
              <Label>Related Values</Label>
              <div className="flex flex-wrap gap-2">
                {availableValues.map(value => (
                  <Badge
                    key={value}
                    variant={selectedValues.includes(value) ? "default" : "outline"}
                    className="cursor-pointer hover:scale-105 transition-transform px-3 py-1 bg-background border-2 font-medium"
                    onClick={() => toggleValue(value)}
                  >
                    {value}
                    {selectedValues.includes(value) && <X size={12} className="ml-2" />}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-date">Target Date</Label>
              <Input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="min-h-[44px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: Goal['status']) => setStatus(value)}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || selectedAreas.length === 0}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
