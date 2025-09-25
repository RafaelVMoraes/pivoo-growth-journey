import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, TrendingUp, Heart } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { WeeklyHabitsChart } from '@/components/dashboard/WeeklyHabitsChart';
import { MonthlyProgressChart } from '@/components/dashboard/MonthlyProgressChart';
import { KPICards } from '@/components/dashboard/KPICards';
import { MotivationalMicrocopy } from '@/components/dashboard/MotivationalMicrocopy';

export const Dashboard = () => {
  const { user, isGuest } = useAuth();
  const { 
    isLoading, 
    weeklyHabitsData, 
    monthlyProgressData, 
    kpiData 
  } = useDashboardStats();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          {isGuest ? 'Welcome, Explorer' : user ? `Welcome back` : 'Welcome'}
        </h1>
        <p className="text-muted-foreground">
          {isGuest 
            ? 'Your overview will appear here once you create an account'
            : 'Here\'s your daily overview and progress'
          }
        </p>
      </div>

      {/* Motivational Message */}
      <MotivationalMicrocopy kpiData={kpiData} isLoading={isLoading} />

      {/* KPI Cards */}
      <KPICards data={kpiData} isLoading={isLoading} />

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyHabitsChart data={weeklyHabitsData} isLoading={isLoading} />
        <MonthlyProgressChart data={monthlyProgressData} isLoading={isLoading} />
      </div>

      {/* Daily Check-in Card */}
      <Card className="glass-card shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Daily Check-in
            </CardTitle>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
          <CardDescription>Start your day with intention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Daily reflections and mood tracking will appear here
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mindfulness Corner */}
      <Card className="glass-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart size={20} className="text-primary" />
            Mindfulness Corner
          </CardTitle>
          <CardDescription>Take a moment for yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 text-center space-y-2">
            <Heart size={32} className="text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foregroround">
              Breathing exercises and mindful moments will be here
            </p>
          </div>
        </CardContent>
      </Card>

      {isGuest && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-primary">Ready to start your journey?</h3>
              <p className="text-sm text-muted-foreground">
                Create an account to track your progress and unlock all features
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;