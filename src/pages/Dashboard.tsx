import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Target, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { useSelfDiscovery } from '@/hooks/useSelfDiscovery';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const { valuesData, visionData, lifeWheelData, selectedValuesCount } = useSelfDiscovery();

  // Check if user has completed any self-discovery activities
  const hasStartedSelfDiscovery = !isGuest && (
    selectedValuesCount > 0 ||
    (visionData.vision_1y || visionData.vision_3y || visionData.word_year || visionData.phrase_year) ||
    lifeWheelData.some(area => area.current_score !== 5 || area.desired_score !== 8)
  );

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

      {/* Self-Discovery CTA - Only shown when user hasn't started */}
      {!isGuest && !hasStartedSelfDiscovery && (
        <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 to-primary-glow/10 shadow-glow animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
          <CardContent className="relative pt-6 pb-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow animate-pulse">
                <Sparkles size={32} className="text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Discover Your True Self</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start your journey of self-discovery. Understand your values, visualize your future, and create a life aligned with who you truly are.
                </p>
              </div>
              <Button 
                size="lg"
                onClick={() => navigate('/self-discovery')}
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 shadow-glow hover:shadow-lg transition-all duration-300 animate-pulse hover:animate-none text-white font-semibold px-8"
              >
                <Sparkles size={20} className="mr-2" />
                Begin Self-Discovery
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Check-in Card */}
      <Card className="gradient-card shadow-card">
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

      {/* Goals Overview */}
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target size={20} className="text-primary" />
            Goals Overview
          </CardTitle>
          <CardDescription>Your progress at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 text-center space-y-2">
            <Target size={32} className="text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              Your active goals and progress will be displayed here
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Insights */}
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            Weekly Insights
          </CardTitle>
          <CardDescription>Patterns and growth trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 text-center space-y-2">
            <TrendingUp size={32} className="text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              Analytics and insights about your journey will appear here
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mindfulness Corner */}
      <Card className="gradient-card shadow-card">
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
            <p className="text-sm text-muted-foreground">
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