import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Goal } from '@/hooks/useGoals';
import { ActivityList } from '../forms/ActivityList';
import { Target, RotateCcw, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface GoalDetailsDialogProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

export const GoalDetailsDialog = ({ goal, isOpen, onClose }: GoalDetailsDialogProps) => {
  const [showReflection, setShowReflection] = useState(false);
  const hasReflection = goal.surface_motivation || goal.deeper_motivation || goal.identity_motivation;

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

          {/* Reflection Section Toggle */}
          {hasReflection && (
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReflection(!showReflection)}
                className="w-full flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle size={16} />
                  Why This Goal Matters
                </span>
                {showReflection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
              
              {showReflection && (
                <div className="mt-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="space-y-3">
                    {goal.surface_motivation && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">What sparked it?</p>
                        <p className="text-sm text-foreground italic">"{goal.surface_motivation}"</p>
                      </div>
                    )}
                    {goal.deeper_motivation && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">What deeper need does it fulfill?</p>
                        <p className="text-sm text-foreground italic">"{goal.deeper_motivation}"</p>
                      </div>
                    )}
                    {goal.identity_motivation && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">How does it connect to who you are?</p>
                        <p className="text-sm text-foreground font-medium italic">"{goal.identity_motivation}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <ActivityList goalId={goal.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
