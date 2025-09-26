import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface HistoryRecord {
  id: string;
  user_id: string;
  year: number;
  summary?: string;
  achievements?: string[];
  completed_goals_count: number;
  total_goals_count: number;
  created_at: string;
  updated_at: string;
}

export interface YearArchive {
  year: number;
  history?: HistoryRecord;
  vision?: {
    word_year?: string;
    phrase_year?: string;
    vision_1y?: string;
    vision_3y?: string;
  };
  goals: {
    completed: number;
    total: number;
    archivedGoals: any[];
  };
}

export const useHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [yearArchives, setYearArchives] = useState<YearArchive[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        toast({
          title: 'Error loading history',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setHistory(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchYearArchives = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Get all unique years from goals, vision, and history
      const [goalsResponse, visionResponse, historyResponse] = await Promise.all([
        supabase
          .from('goals')
          .select('created_at, status, title, description')
          .eq('user_id', user.id),
        supabase
          .from('vision')
          .select('year, word_year, phrase_year, vision_1y, vision_3y')
          .eq('user_id', user.id),
        supabase
          .from('history')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (goalsResponse.error || visionResponse.error || historyResponse.error) {
        throw new Error('Failed to fetch archive data');
      }

      // Process years
      const yearSet = new Set<number>();
      const currentYear = new Date().getFullYear();
      
      // Add years from goals
      goalsResponse.data?.forEach(goal => {
        const year = new Date(goal.created_at).getFullYear();
        if (year < currentYear) yearSet.add(year);
      });

      // Add years from vision
      visionResponse.data?.forEach(vision => {
        if (vision.year < currentYear) yearSet.add(vision.year);
      });

      // Add years from history
      historyResponse.data?.forEach(hist => {
        if (hist.year < currentYear) yearSet.add(hist.year);
      });

      // Create archives for each year
      const archives: YearArchive[] = [];
      for (const year of Array.from(yearSet).sort((a, b) => b - a)) {
        const yearGoals = goalsResponse.data?.filter(goal => 
          new Date(goal.created_at).getFullYear() === year
        ) || [];
        
        const yearVision = visionResponse.data?.find(v => v.year === year);
        const yearHistory = historyResponse.data?.find(h => h.year === year);

        const completedGoals = yearGoals.filter(g => g.status === 'completed' || g.status === 'archived');

        archives.push({
          year,
          history: yearHistory,
          vision: yearVision,
          goals: {
            completed: completedGoals.length,
            total: yearGoals.length,
            archivedGoals: completedGoals
          }
        });
      }

      setYearArchives(archives);
    } catch (error) {
      console.error('Error fetching year archives:', error);
      toast({
        title: 'Error loading archives',
        description: 'Failed to load historical data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateHistory = async (year: number, data: Partial<HistoryRecord>) => {
    if (!user) return;

    try {
      const { data: result, error } = await supabase
        .from('history')
        .upsert({
          user_id: user.id,
          year,
          ...data,
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating history:', error);
        toast({
          title: 'Error updating history',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'History updated',
        description: 'Your yearly summary has been saved.',
      });

      fetchHistory();
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchYearArchives();
  }, [user]);

  return {
    history,
    yearArchives,
    loading,
    createOrUpdateHistory,
    refetchHistory: fetchHistory,
    refetchArchives: fetchYearArchives,
  };
};