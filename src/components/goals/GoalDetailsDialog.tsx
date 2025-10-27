import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Goal } from '@/hooks/useGoals';
import { ActivityList } from './ActivityList';
import { Target, RotateCcw } from 'lucide-react';

interface GoalDetailsDialogProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

export const GoalDetailsDialog = ({ goal, isOpen, onClose }: GoalDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {goal.type === 'outcome' ? (
              <Target size={20} className="text-primary" />
            ) : (
              <RotateCcw size={20} className="text-primary" />
            )}
            <span>{goal.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {goal.description && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
              <p className="text-foreground">{goal.description}</p>
            </div>
          )}

          <ActivityList goalId={goal.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};