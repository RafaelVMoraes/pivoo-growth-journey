import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LifeWheelData {
  area_name: string;
  current_score: number;
  desired_score: number;
}

interface LifeWheelChartProps {
  data: LifeWheelData[];
}

export const LifeWheelChart = ({ data }: LifeWheelChartProps) => {
  const chartData = data.map(item => ({
    area: item.area_name,
    current: item.current_score,
    desired: item.desired_score,
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

  return (
    <Card className="gradient-card shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Life Wheel Overview</CardTitle>
        
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