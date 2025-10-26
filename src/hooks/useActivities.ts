import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Activity {
  id: string;
  goal_id: string;
  user_id: string;
  description: string;
  frequency?: string;
  frequency_type?: 'daily' | 'weekly' | 'monthly' | 'custom';
  frequency_value?: number;
  status: 'active' | 'completed';
  created_at: string;
  updated_at: string;
}

export const useActivities = (goalId?: string) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isGuest } = useAuth();
  const { toast } = useToast();

  const fetchActivities = async () => {
    if (isGuest || !user || !goalId) {
      setActivities([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .eq('goal_id', goalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities((data || []) as Activity[]);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to load activities",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createActivity = async (activityData: Omit<Activity, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (isGuest || !user) return;

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert({
          ...activityData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setActivities(prev => [data as Activity, ...prev]);
      toast({
        title: "Success",
        description: "Activity created successfully"
      });
      return data;
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({
        title: "Error",
        description: "Failed to create activity",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateActivity = async (activityId: string, updates: Partial<Activity>) => {
    if (isGuest || !user) return;

    try {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', activityId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setActivities(prev => prev.map(activity => activity.id === activityId ? data as Activity : activity));
      toast({
        title: "Success",
        description: "Activity updated successfully"
      });
      return data;
    } catch (error) {
      console.error('Error updating activity:', error);
      toast({
        title: "Error",
        description: "Failed to update activity",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteActivity = async (activityId: string) => {
    if (isGuest || !user) return;

    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setActivities(prev => prev.filter(activity => activity.id !== activityId));
      toast({
        title: "Success",
        description: "Activity deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast({
        title: "Error",
        description: "Failed to delete activity",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [user, isGuest, goalId]);

  return {
    activities,
    isLoading,
    createActivity,
    updateActivity,
    deleteActivity,
    refetch: fetchActivities
  };
};