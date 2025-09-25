import { useState, useEffect, useMemo } from 'react';
import { useGoals } from './useGoals';
import { useCheckIns } from './useCheckIns';
import { useSelfDiscovery } from './useSelfDiscovery';
import { useAuth } from '@/contexts/AuthContext';

interface WeeklyHabitData {
  week: string;
  completionRate: number;
}

interface MonthlyProgressData {
  month: string;
  progress: number;
}

interface KPIData {
  goalsCompletedPercentage: number;
  longestStreak: number;
  strongestLifeArea: string;
  weakestLifeArea: string;
}

export const useDashboardStats = () => {
  const { user, isGuest } = useAuth();
  const { goals, isLoading: goalsLoading } = useGoals();
  const { checkIns, isLoading: checkInsLoading } = useCheckIns();
  const { lifeWheelData, loading: lifeWheelLoading } = useSelfDiscovery();

  const isLoading = goalsLoading || checkInsLoading || lifeWheelLoading;

  // Calculate weekly habits data
  const weeklyHabitsData = useMemo(() => {
    if (isGuest || !checkIns.length) return [];

    // Get last 8 weeks
    const weeksData: WeeklyHabitData[] = [];
    const now = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekCheckIns = checkIns.filter(checkIn => {
        const checkInDate = new Date(checkIn.date);
        return checkInDate >= weekStart && checkInDate <= weekEnd;
      });

      // Get process goals (habits) for this week
      const processGoals = goals.filter(goal => goal.type === 'process');
      
      // Calculate completion rate
      let completionRate = 0;
      if (processGoals.length > 0) {
        const completedHabits = weekCheckIns.filter(checkIn => 
          checkIn.progress_value === 'true' || 
          (checkIn.input_type === 'percentage' && parseInt(checkIn.progress_value) > 50) ||
          (checkIn.input_type === 'numeric' && parseInt(checkIn.progress_value) > 0)
        ).length;
        
        completionRate = Math.round((completedHabits / (processGoals.length * 7)) * 100);
      }

      weeksData.push({
        week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completionRate: Math.min(100, completionRate)
      });
    }

    return weeksData;
  }, [checkIns, goals, isGuest]);

  // Calculate monthly progress data
  const monthlyProgressData = useMemo(() => {
    if (isGuest || !checkIns.length) return [];

    const monthsData: MonthlyProgressData[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const monthCheckIns = checkIns.filter(checkIn => {
        const checkInDate = new Date(checkIn.date);
        return checkInDate >= monthStart && checkInDate <= monthEnd;
      });

      // Calculate average progress
      let averageProgress = 0;
      if (monthCheckIns.length > 0) {
        const totalProgress = monthCheckIns.reduce((sum, checkIn) => {
          if (checkIn.input_type === 'percentage') {
            return sum + parseInt(checkIn.progress_value);
          } else if (checkIn.input_type === 'checkbox') {
            return sum + (checkIn.progress_value === 'true' ? 100 : 0);
          } else if (checkIn.input_type === 'numeric') {
            // Normalize numeric values to percentage (assuming target achievement)
            return sum + Math.min(100, parseInt(checkIn.progress_value) * 10);
          }
          return sum;
        }, 0);
        
        averageProgress = Math.round(totalProgress / monthCheckIns.length);
      }

      monthsData.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        progress: averageProgress
      });
    }

    return monthsData;
  }, [checkIns, isGuest]);

  // Calculate KPIs
  const kpiData = useMemo((): KPIData => {
    if (isGuest) {
      return {
        goalsCompletedPercentage: 0,
        longestStreak: 0,
        strongestLifeArea: 'Health',
        weakestLifeArea: 'Career'
      };
    }

    // Goals completion percentage
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const goalsCompletedPercentage = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

    // Longest streak calculation
    let longestStreak = 0;
    let currentStreak = 0;
    
    if (checkIns.length > 0) {
      const sortedCheckIns = [...checkIns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      let lastDate: Date | null = null;

      for (const checkIn of sortedCheckIns) {
        const checkInDate = new Date(checkIn.date);
        checkInDate.setHours(0, 0, 0, 0);

        if (!lastDate || checkInDate.getTime() - lastDate.getTime() === 86400000) { // 1 day difference
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else if (checkInDate.getTime() - lastDate.getTime() > 86400000) {
          currentStreak = 1;
        }
        
        lastDate = checkInDate;
      }
    }

    // Strongest and weakest life areas
    let strongestLifeArea = 'Health';
    let weakestLifeArea = 'Career';
    
    if (lifeWheelData.length > 0) {
      const sortedByScore = [...lifeWheelData].sort((a, b) => b.current_score - a.current_score);
      strongestLifeArea = sortedByScore[0]?.area_name || 'Health';
      weakestLifeArea = sortedByScore[sortedByScore.length - 1]?.area_name || 'Career';
    }

    return {
      goalsCompletedPercentage,
      longestStreak,
      strongestLifeArea,
      weakestLifeArea
    };
  }, [goals, checkIns, lifeWheelData, isGuest]);

  return {
    isLoading,
    weeklyHabitsData,
    monthlyProgressData,
    kpiData
  };
};