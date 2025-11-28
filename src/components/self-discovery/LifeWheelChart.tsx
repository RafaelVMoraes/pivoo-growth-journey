import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LifeWheelData {
  area_name: string;
  current_score: number;
  desired_score: number;
  is_focus_area?: boolean;
}

interface LifeWheelChartProps {
  data: LifeWheelData[];
}

// Category mapping
const CATEGORY_MAP: Record<string, { name: string; color: string }> = {
  'Health & Energy': { name: 'Life Quality', color: 'hsl(var(--category-life-quality))' },
  'Mental & Emotional Well-being': { name: 'Life Quality', color: 'hsl(var(--category-life-quality))' },
  'Lifestyle & Leisure': { name: 'Life Quality', color: 'hsl(var(--category-life-quality))' },
  'Personal Growth & Learning': { name: 'Personal', color: 'hsl(var(--category-personal))' },
  'Spirituality / Purpose': { name: 'Personal', color: 'hsl(var(--category-personal))' },
  'Contribution / Community': { name: 'Personal', color: 'hsl(var(--category-personal))' },
  'Career & Mission': { name: 'Professional', color: 'hsl(var(--category-professional))' },
  'Finances': { name: 'Professional', color: 'hsl(var(--category-professional))' },
  'Physical Environment': { name: 'Professional', color: 'hsl(var(--category-professional))' },
  'Relationships & Social Life': { name: 'Relationships', color: 'hsl(var(--category-relationships))' },
  'Love & Partnership': { name: 'Relationships', color: 'hsl(var(--category-relationships))' },
  'Family': { name: 'Relationships', color: 'hsl(var(--category-relationships))' },
};

export const LifeWheelChart = ({ data }: LifeWheelChartProps) => {
  const chartData = data.map(item => ({
    area: item.area_name,
    current: item.current_score,
    desired: item.desired_score,
    fill: CATEGORY_MAP[item.area_name]?.color || 'hsl(var(--primary))',
  }));

  // Calculate averages
  const currentAverage = data.length > 0 
    ? (data.reduce((sum, area) => sum + area.current_score, 0) / data.length).toFixed(1)
    : '0';
  
  const desiredAverage = data.length > 0
    ? (data.reduce((sum, area) => sum + area.desired_score, 0) / data.length).toFixed(1)
    : '0';
  
  const averageDifference = Math.abs(parseFloat(desiredAverage) - parseFloat(currentAverage));
  const totalDesired = data.reduce((sum, area) => sum + area.desired_score, 0);

  const showOverloadAlert = averageDifference > 1.5;
  const showHighExpectationsAlert = totalDesired > 50;

  // Get unique categories for legend
  const categories = [
    { name: 'Life Quality', color: 'hsl(var(--category-life-quality))' },
    { name: 'Personal', color: 'hsl(var(--category-personal))' },
    { name: 'Professional', color: 'hsl(var(--category-professional))' },
    { name: 'Relationships', color: 'hsl(var(--category-relationships))' },
  ];

  return (
    <Card className="gradient-card shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Life Wheel Overview</CardTitle>
        
        {/* Category Legend */}
        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((cat) => (
            <Badge 
              key={cat.name}
              className="text-xs px-2 py-1"
              style={{ 
                backgroundColor: cat.color,
                color: 'white'
              }}
            >
              {cat.name}
            </Badge>
          ))}
        </div>

        {/* Averages Display */}
        <div className="flex gap-4 mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground mb-1">Média Atual</p>
            <p className="text-2xl font-bold text-primary">{currentAverage}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-muted-foreground mb-1">Média Desejada</p>
            <p className="text-2xl font-bold text-accent">{desiredAverage}</p>
          </div>
        </div>

        {/* Alerts */}
        {showOverloadAlert && (
          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">
              ⚠️ A diferença entre seu estado atual e desejado pode indicar sobrecarga. Considere ajustar suas expectativas.
            </p>
          </div>
        )}
        
        {showHighExpectationsAlert && (
          <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <p className="text-sm font-medium" style={{ color: 'hsl(var(--warning))' }}>
              💭 Você pode estar se cobrando muito. Reavalie se suas metas são realistas para este momento.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid />
              <PolarAngleAxis 
                dataKey="area" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 10]}
                className="text-xs"
                tick={{ fontSize: 10 }}
              />
              <Radar
                name="Current"
                dataKey="current"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="Desired"
                dataKey="desired"
                stroke="hsl(var(--secondary))"
                fill="hsl(var(--secondary))"
                fillOpacity={0.2}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="line"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};