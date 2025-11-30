import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { AddGoalDialog } from '@/components/goals/dialogs/AddGoalDialog';
import { ViewToggle } from '@/components/goals/filters/ViewToggle';
import { StatusTabs } from '@/components/goals/filters/StatusTabs';
import { EnhancedGoalCard } from '@/components/goals/cards/GoalCard';
import { TasksView } from '@/components/goals/views/TasksView';

type ViewMode = 'high-level' | 'tasks';
type StatusFilter = 'active' | 'completed' | 'archived';

export const Goals = () => {
  const { isGuest } = useAuth();
  const { goals, isLoading, refetch } = useGoals();
  const [viewMode, setViewMode] = useState<ViewMode>('high-level');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');

  // Filter goals by status (already sorted by priority in useGoals)
  const filteredGoals = goals.filter(goal => {
    if (statusFilter === 'active') return goal.status === 'active' || goal.status === 'in_progress';
    if (statusFilter === 'completed') return goal.status === 'completed';
    if (statusFilter === 'archived') return goal.status === 'archived';
    return true;
  });

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-foreground">
            {viewMode === 'high-level' ? '🎯 Goals' : '✅ Tasks'}
          </h1>
          <div className="flex items-center gap-3">
            {!isGuest && (
              <AddGoalDialog>
                <Button className="gap-2">
                  <Plus size={20} />
                  Add Goal
                </Button>
              </AddGoalDialog>
            )}
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {/* Status Tabs */}
        <StatusTabs value={statusFilter} onChange={setStatusFilter} goals={goals} />

        {/* Content Views */}
        <div className="mt-6">
          {viewMode === 'high-level' ? (
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredGoals.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No goals found</p>
                </div>
              ) : (
                filteredGoals.map(goal => (
                  <EnhancedGoalCard key={goal.id} goal={goal} />
                ))
              )}
            </div>
          ) : (
            <TasksView goals={filteredGoals} isLoading={isLoading} />
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {!isGuest && (
        <div className="fixed bottom-20 right-4 z-50">
          <AddGoalDialog>
            <Button 
              size="lg" 
              className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Plus size={24} />
            </Button>
          </AddGoalDialog>
        </div>
      )}
    </div>
  );
};

export default Goals;
