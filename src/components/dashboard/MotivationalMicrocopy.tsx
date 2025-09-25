import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles } from 'lucide-react';
import { useMemo } from 'react';

interface KPIData {
  goalsCompletedPercentage: number;
  longestStreak: number;
  strongestLifeArea: string;
  weakestLifeArea: string;
}

interface MotivationalMicrocopyProps {
  kpiData: KPIData;
  isLoading: boolean;
}

export const MotivationalMicrocopy = ({ kpiData, isLoading }: MotivationalMicrocopyProps) => {
  const motivationalMessage = useMemo(() => {
    if (isLoading) return { message: "Loading your progress...", tone: "neutral" };

    const { goalsCompletedPercentage, longestStreak, strongestLifeArea } = kpiData;
    
    // Determine progress level
    const progressLevel = goalsCompletedPercentage >= 70 ? "high" : 
                         goalsCompletedPercentage >= 40 ? "medium" : "low";

    const messages = {
      high: [
        `Amazing work! You've completed ${goalsCompletedPercentage}% of your goals. You're truly thriving! 🎉`,
        `Your consistency is inspiring! ${longestStreak} days shows real commitment to growth.`,
        `You're excelling in ${strongestLifeArea} - this strength can fuel progress in other areas too!`,
        `Outstanding progress! Your dedication is transforming your life, one goal at a time.`
      ],
      medium: [
        `You're making steady progress! ${goalsCompletedPercentage}% completion shows you're on the right path.`,
        `Great momentum with your ${longestStreak}-day streak! Small steps lead to big changes.`,
        `Your strength in ${strongestLifeArea} is shining through. Keep building on this foundation!`,
        `Solid progress! You're proving that consistency beats perfection every time.`
      ],
      low: [
        `Every journey starts with a single step. You're here, and that's what matters most.`,
        `Your ${longestStreak} days of effort show you have what it takes. Keep going!`,
        `${strongestLifeArea} is your superpower - let it inspire growth in other areas.`,
        `Progress isn't always linear. What matters is that you keep showing up for yourself.`,
        `You're building something meaningful. Trust the process and celebrate small wins.`
      ]
    };

    const messageArray = messages[progressLevel];
    const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];
    
    return { 
      message: randomMessage, 
      tone: progressLevel 
    };
  }, [kpiData, isLoading]);

  if (isLoading) {
    return (
      <Card className="glass-card shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Heart className="text-primary animate-pulse" size={20} />
            <div className="h-4 bg-muted/50 rounded animate-pulse flex-1" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIcon = () => {
    switch (motivationalMessage.tone) {
      case "high":
        return <Sparkles className="text-warning" size={20} />;
      case "medium":
        return <Heart className="text-primary" size={20} />;
      default:
        return <Heart className="text-muted-foreground" size={20} />;
    }
  };

  const getTextColor = () => {
    switch (motivationalMessage.tone) {
      case "high":
        return "text-foreground font-medium";
      case "medium":
        return "text-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="glass-card shadow-card border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getIcon()}</div>
          <p className={`text-sm leading-relaxed ${getTextColor()}`}>
            {motivationalMessage.message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};