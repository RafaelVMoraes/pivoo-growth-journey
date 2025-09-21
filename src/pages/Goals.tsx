import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Star, Clock } from 'lucide-react';

export const Goals = () => {
  const { user, isGuest } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Goals</h1>
          <p className="text-muted-foreground">Track your meaningful objectives</p>
        </div>
        <Button disabled className="shadow-soft">
          <Plus size={16} className="mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Empty State */}
      <Card className="gradient-card shadow-card text-center py-12">
        <CardContent className="space-y-6">
          <div className="relative">
            <Target size={64} className="text-primary mx-auto opacity-80" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Star size={12} className="text-primary-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Ready to set your first goal?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Transform your aspirations into achievable objectives. Set SMART goals and track your progress.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <Badge variant="secondary" className="text-xs">
              <Clock size={12} className="mr-1" />
              Time-bound
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Target size={12} className="mr-1" />
              Specific
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Star size={12} className="mr-1" />
              Achievable
            </Badge>
          </div>

          {isGuest ? (
            <Card className="border-primary/20 bg-primary/5 max-w-sm mx-auto">
              <CardContent className="pt-4">
                <p className="text-sm text-primary">
                  Sign up to create and track your personal goals
                </p>
              </CardContent>
            </Card>
          ) : (
            <Button disabled className="mt-4">
              Add Your First Goal
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Feature Preview Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="gradient-card shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Smart Goals</CardTitle>
            <CardDescription className="text-sm">
              Set Specific, Measurable, Achievable, Relevant, and Time-bound objectives
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="gradient-card shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Progress Tracking</CardTitle>
            <CardDescription className="text-sm">
              Monitor your advancement with visual progress indicators and milestones
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="gradient-card shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Categories</CardTitle>
            <CardDescription className="text-sm">
              Organize goals by life areas: Health, Career, Relationships, Personal Growth
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="gradient-card shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Reminders</CardTitle>
            <CardDescription className="text-sm">
              Stay motivated with gentle nudges and progress celebrations
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Goals;