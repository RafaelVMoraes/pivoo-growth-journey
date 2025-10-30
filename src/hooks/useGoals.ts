import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  target_date?: string;
  type: 'outcome' | 'process';
  status: 'active' | 'in_progress' | 'on_hold' | 'completed' | 'archived';
  life_wheel_area?: string | string[];
  related_values?: string[];
  parent_goal_id?: string;
  surface_motivation?: string;
  deeper_motivation?: string;
  identity_motivation?: string;
  created_at: string;
  updated_at: string;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isGuest } = useAuth();
  const { toast } = useToast();

  const fetchGoals = async () => {
    if (isGuest || !user) {
      setGoals([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals((data || []) as Goal[]);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to load goals",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (isGuest || !user) return;

    try {
      const insertData: any = {
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        type: goalData.type,
        status: goalData.status,
        target_date: goalData.target_date,
        life_wheel_area: goalData.life_wheel_area,
        related_values: goalData.related_values,
        parent_goal_id: goalData.parent_goal_id,
        surface_motivation: goalData.surface_motivation,
        deeper_motivation: goalData.deeper_motivation,
        identity_motivation: goalData.identity_motivation,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('goals')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      
      setGoals(prev => [data as Goal, ...prev]);
      toast({
        title: "Success",
        description: "Goal created successfully"
      });
      return data;
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    if (isGuest || !user) return;

    try {
      const cleanUpdates: any = {};
      if (updates.title !== undefined) cleanUpdates.title = updates.title;
      if (updates.description !== undefined) cleanUpdates.description = updates.description;
      if (updates.category !== undefined) cleanUpdates.category = updates.category;
      if (updates.type !== undefined) cleanUpdates.type = updates.type;
      if (updates.status !== undefined) cleanUpdates.status = updates.status;
      if (updates.target_date !== undefined) cleanUpdates.target_date = updates.target_date;
      if (updates.life_wheel_area !== undefined) cleanUpdates.life_wheel_area = updates.life_wheel_area;
      if (updates.related_values !== undefined) cleanUpdates.related_values = updates.related_values;
      if (updates.parent_goal_id !== undefined) cleanUpdates.parent_goal_id = updates.parent_goal_id;
      if (updates.surface_motivation !== undefined) cleanUpdates.surface_motivation = updates.surface_motivation;
      if (updates.deeper_motivation !== undefined) cleanUpdates.deeper_motivation = updates.deeper_motivation;
      if (updates.identity_motivation !== undefined) cleanUpdates.identity_motivation = updates.identity_motivation;

      const { data, error } = await supabase
        .from('goals')
        .update(cleanUpdates)
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setGoals(prev => prev.map(goal => goal.id === goalId ? data as Goal : goal));
      toast({
        title: "Success",
        description: "Goal updated successfully"
      });
      return data;
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (isGuest || !user) return;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast({
        title: "Success",
        description: "Goal deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [user, isGuest]);

  // Filter goals by selected filters (life areas or values)
  const filterGoals = (filters: string[]) => {
    if (filters.length === 0) return goals;
    
    return goals.filter(goal => {
      const matchesArea = filters.some(filter => 
        Array.isArray(goal.life_wheel_area) 
          ? goal.life_wheel_area.includes(filter)
          : goal.life_wheel_area === filter
      );
      const matchesValue = filters.some(filter => 
        goal.related_values?.includes(filter)
      );
      return matchesArea || matchesValue;
    });
  };

  // Get sub-goals for a parent goal
  const getSubGoals = (parentGoalId: string) => {
    return goals.filter(goal => goal.parent_goal_id === parentGoalId);
  };

  return {
    goals,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
    filterGoals,
    getSubGoals
  };
};