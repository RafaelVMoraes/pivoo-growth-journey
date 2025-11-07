import { useState, useEffect } from 'react';
import { Goal } from '@/hooks/useGoals';
import { useActivities, Activity } from '@/hooks/useActivities';
import { useCheckIns } from '@/hooks/useCheckIns';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, RotateCcw, Calendar, AlertCircle } from 'lucide-react';
import { format, isToday, isThisWeek, isThisMonth, isFuture, parseISO, startOfDay, startOfWeek, startOfMonth, isPast } from 'date-fns';

interface TasksViewProps {
  goals: Goal[];
  isLoading: boolean;
}

interface Task {
  id: string;
  goalId: string;
  goalTitle: string;
  activityId?: string;
  description: string;
  dueDate?: Date;
  frequency?: string;
  frequencyType?: string;
  frequencyValue?: number;
  lifeArea?: string;
  isCompleted: boolean;
  isLate: boolean;
}

export const TasksView = ({ goals, isLoading }: TasksViewProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Target size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  // Get all tasks from all goals
  const allTasks: Task[] = [];

  goals.forEach(goal => {
    const lifeArea = Array.isArray(goal.life_wheel_area) 
      ? goal.life_wheel_area[0] 
      : goal.life_wheel_area || 'Other';

    // For milestone goals with target dates
    if (goal.target_date) {
      const dueDate = parseISO(goal.target_date);
      const isLate = isPast(dueDate) && goal.status !== 'completed';
      
      allTasks.push({
        id: `goal-${goal.id}`,
        goalId: goal.id,
        goalTitle: goal.title,
        description: goal.title,
        dueDate,
        lifeArea,
        isCompleted: goal.status === 'completed',
        isLate,
      });
    }

    // TODO: Add activities as tasks (would need to fetch activities for each goal)
    // This would require a more complex setup with multiple useActivities calls
    // or a combined query. For now, showing goals with dates.
  });

  // Group tasks by time period
  const today: Task[] = [];
  const thisWeek: Task[] = [];
  const thisMonth: Task[] = [];
  const future: Task[] = [];

  allTasks.forEach(task => {
    if (!task.dueDate) {
      future.push(task);
      return;
    }

    if (isToday(task.dueDate)) {
      today.push(task);
    } else if (isThisWeek(task.dueDate)) {
      thisWeek.push(task);
    } else if (isThisMonth(task.dueDate)) {
      thisMonth.push(task);
    } else if (isFuture(task.dueDate)) {
      future.push(task);
    }
  });

  if (allTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Card className="p-8 bg-accent/20">
          <Calendar size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">No tasks to display</h3>
          <p className="text-sm text-muted-foreground">
            Create goals with target dates or add activities to see tasks here
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {today.length > 0 && (
        <TaskSection title="🔹 Today" tasks={today} />
      )}
      {thisWeek.length > 0 && (
        <TaskSection title="🔹 This Week" tasks={thisWeek} />
      )}
      {thisMonth.length > 0 && (
        <TaskSection title="🔹 This Month" tasks={thisMonth} />
      )}
      {future.length > 0 && (
        <TaskSection title="🔹 Future" tasks={future} />
      )}
    </div>
  );
};

const TaskSection = ({ title, tasks }: { title: string; tasks: Task[] }) => {
  const { createCheckIn } = useCheckIns(tasks[0]?.goalId || '');
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const handleToggleTask = async (task: Task) => {
    if (completedTasks.has(task.id)) {
      setCompletedTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    } else {
      setCompletedTasks(prev => new Set(prev).add(task.id));
      
      // Create check-in if it's an activity
      if (task.activityId) {
        try {
          await createCheckIn({
            goal_id: task.goalId,
            activity_id: task.activityId,
            date: new Date().toISOString(),
            progress_value: 'done',
            input_type: 'checkbox',
          });
        } catch (error) {
          console.error('Failed to create check-in:', error);
        }
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
      <Card className="divide-y divide-border">
        {tasks.map(task => {
          const isCompleted = completedTasks.has(task.id) || task.isCompleted;
          
          return (
            <div
              key={task.id}
              className="p-4 flex items-center gap-4 hover:bg-accent/30 transition-colors"
            >
              <Checkbox
                checked={isCompleted}
                onCheckedChange={() => handleToggleTask(task)}
                className="h-5 w-5"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-medium text-foreground ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {task.description}
                  </p>
                  {task.isLate && !isCompleted && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle size={10} className="mr-1" />
                      Late
                    </Badge>
                  )}
                  {task.lifeArea && (
                    <Badge variant="outline" className="text-xs bg-accent/50">
                      {task.lifeArea}
                    </Badge>
                  )}
                </div>
                {task.frequency && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-background border-2">
                      <RotateCcw size={10} className="mr-1" />
                      {task.frequency}
                    </Badge>
                  </div>
                )}
              </div>

              {task.dueDate && (
                <span className="text-xs text-muted-foreground">
                  {format(task.dueDate, 'MMM d')}
                </span>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
};
