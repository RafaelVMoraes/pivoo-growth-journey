import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CheckIn {
  id: string;
  activity_id?: string;
  goal_id: string;
  user_id: string;
  date: string;
  progress_value: string;
  input_type: 'numeric' | 'checkbox' | 'percentage';
  created_at: string;
  updated_at: string;
}

export const useCheckIns = (goalId?: string, activityId?: string) => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isGuest } = useAuth();
  const { toast } = useToast();

  const fetchCheckIns = async () => {
    if (isGuest || !user || !goalId) {
      setCheckIns([]);
      setIsLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('check_ins')
        .select('*')
        .eq('user_id', user.id)
        .eq('goal_id', goalId);

      if (activityId) {
        query = query.eq('activity_id', activityId);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;
      setCheckIns((data || []) as CheckIn[]);
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      toast({
        title: "Error",
        description: "Failed to load check-ins",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckIn = async (checkInData: Omit<CheckIn, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (isGuest || !user) return;

    try {
      const { data, error } = await supabase
        .from('check_ins')
        .insert({
          ...checkInData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      setCheckIns(prev => [data as CheckIn, ...prev]);
      toast({
        title: "Success",
        description: "Progress recorded successfully"
      });
      return data;
    } catch (error) {
      console.error('Error creating check-in:', error);
      toast({
        title: "Error",
        description: "Failed to record progress",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateCheckIn = async (checkInId: string, updates: Partial<CheckIn>) => {
    if (isGuest || !user) return;

    try {
      const { data, error } = await supabase
        .from('check_ins')
        .update(updates)
        .eq('id', checkInId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setCheckIns(prev => prev.map(checkIn => checkIn.id === checkInId ? data as CheckIn : checkIn));
      toast({
        title: "Success",
        description: "Progress updated successfully"
      });
      return data;
    } catch (error) {
      console.error('Error updating check-in:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteCheckIn = async (checkInId: string) => {
    if (isGuest || !user) return;

    try {
      const { error } = await supabase
        .from('check_ins')
        .delete()
        .eq('id', checkInId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setCheckIns(prev => prev.filter(checkIn => checkIn.id !== checkInId));
      toast({
        title: "Success",
        description: "Progress entry deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting check-in:', error);
      toast({
        title: "Error",
        description: "Failed to delete progress entry",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchCheckIns();
  }, [user, isGuest, goalId, activityId]);

  return {
    checkIns,
    isLoading,
    createCheckIn,
    updateCheckIn,
    deleteCheckIn,
    refetch: fetchCheckIns
  };
};