import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Flame, TrendingUp, TrendingDown } from 'lucide-react';

interface KPIData {
  goalsCompletedPercentage: number;
  longestStreak: number;
  strongestLifeArea: string;
  weakestLifeArea: string;
}

interface KPICardsProps {
  data: KPIData;
  isLoading: boolean;
}

export const KPICards = ({ data, isLoading }: KPICardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="glass-card shadow-card">
            <CardContent className="p-4">
              <div className="h-16 bg-muted/50 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Goals Completed",
      value: `${data.goalsCompletedPercentage}%`,
      description: "of all your goals",
      icon: Target,
      color: "text-primary",
      badge: data.goalsCompletedPercentage >= 70 ? "Excellent" : data.goalsCompletedPercentage >= 40 ? "Good" : "Needs Focus",
      badgeVariant: data.goalsCompletedPercentage >= 70 ? "default" : data.goalsCompletedPercentage >= 40 ? "secondary" : "destructive"
    },
    {
      title: "Longest Streak",
      value: `${data.longestStreak}`,
      description: "consecutive days",
      icon: Flame,
      color: "text-secondary",
      badge: data.longestStreak >= 7 ? "On Fire!" : data.longestStreak >= 3 ? "Building" : "Start Strong",
      badgeVariant: data.longestStreak >= 7 ? "default" : "secondary"
    },
    {
      title: "Strongest Area",
      value: data.strongestLifeArea,
      description: "highest life score",
      icon: TrendingUp,
      color: "text-success",
      badge: "Strong",
      badgeVariant: "default"
    },
    {
      title: "Focus Area",
      value: data.weakestLifeArea,
      description: "needs attention",
      icon: TrendingDown,
      color: "text-warning",
      badge: "Opportunity",
      badgeVariant: "secondary"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiCards.map((kpi, index) => (
        <Card key={index} className="glass-card shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <kpi.icon size={20} className={kpi.color} />
              <Badge variant={kpi.badgeVariant as any} className="text-xs">
                {kpi.badge}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{kpi.value}</CardTitle>
              <CardDescription className="text-xs">{kpi.description}</CardDescription>
              <p className="text-sm font-medium text-foreground">{kpi.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};