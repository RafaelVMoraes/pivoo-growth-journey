import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { RedesignedAddGoalDialog } from '@/components/goals/RedesignedAddGoalDialog';
import { ViewToggle } from '@/components/goals/ViewToggle';
import { StatusTabs } from '@/components/goals/StatusTabs';
import { HighLevelView } from '@/components/goals/HighLevelView';
import { TasksView } from '@/components/goals/TasksView';

type ViewMode = 'high-level' | 'tasks';
type StatusFilter = 'active' | 'completed' | 'archived';

export const Goals = () => {
  const { isGuest } = useAuth();
  const { goals, isLoading, refetch } = useGoals();
  const [viewMode, setViewMode] = useState<ViewMode>('high-level');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');

  // Filter goals by status
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
              <RedesignedAddGoalDialog>
                <Button className="gap-2">
                  <Plus size={20} />
                  Add Goal
                </Button>
              </RedesignedAddGoalDialog>
            )}
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {/* Status Tabs */}
        <StatusTabs value={statusFilter} onChange={setStatusFilter} goals={goals} />

        {/* Content Views */}
        <div className="mt-6">
          {viewMode === 'high-level' ? (
            <HighLevelView goals={filteredGoals} isLoading={isLoading} onRefresh={refetch} />
          ) : (
            <TasksView goals={filteredGoals} isLoading={isLoading} />
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {!isGuest && (
        <div className="fixed bottom-20 right-4 z-50">
          <RedesignedAddGoalDialog>
            <Button 
              size="lg" 
              className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            >
              <Plus size={24} />
            </Button>
          </RedesignedAddGoalDialog>
        </div>
      )}
    </div>
  );
};

export default Goals;
