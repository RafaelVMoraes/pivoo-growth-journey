import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Circle, 
  Heart, 
  Compass, 
  Star, 
  ArrowRight,
  Clock,
  BarChart3,
  List,
  Loader2
} from 'lucide-react';
import { useSelfDiscovery } from '@/hooks/useSelfDiscovery';
import { LifeWheelChart } from '@/components/self-discovery/LifeWheelChart';
import { LifeWheelSliders } from '@/components/self-discovery/LifeWheelSliders';
import { ValuesSelection } from '@/components/self-discovery/ValuesSelection';
import { VisionInputs } from '@/components/self-discovery/VisionInputs';
import { YearFocus } from '@/components/self-discovery/YearFocus';
import { useAuth } from '@/contexts/AuthContext';

export const SelfDiscovery = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  const {
    loading,
    saving,
    lifeWheelData,
    valuesData,
    visionData,
    selectedValuesCount,
    updateLifeWheel,
    updateValues,
    updateVision,
    PREDEFINED_VALUES
  } = useSelfDiscovery();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
        <div className="text-center space-y-4">
          <Loader2 size={32} className="animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your self-discovery data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Self-Discovery</h1>
        <p className="text-muted-foreground">
          Explore your inner landscape and authentic self
        </p>
        {saving && (
          <div className="flex items-center justify-center gap-2 text-sm text-primary">
            <Loader2 size={16} className="animate-spin" />
            Saving changes...
          </div>
        )}
      </div>

      <Tabs defaultValue="wheel" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="wheel" className="text-xs">Life Wheel</TabsTrigger>
          <TabsTrigger value="values" className="text-xs">Values</TabsTrigger>
          <TabsTrigger value="vision" className="text-xs">Vision</TabsTrigger>
          <TabsTrigger value="focus" className="text-xs">Year Focus</TabsTrigger>
        </TabsList>

        {/* Life Wheel Tab */}
        <TabsContent value="wheel" className="space-y-6">
          {/* View Toggle for Mobile */}
          <div className="flex justify-center">
            <div className="bg-muted p-1 rounded-lg flex gap-1">
              <Button
                variant={viewMode === 'chart' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('chart')}
                className="flex items-center gap-2"
              >
                <BarChart3 size={16} />
                Chart
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2"
              >
                <List size={16} />
                List
              </Button>
            </div>
          </div>

          {/* Chart or Sliders View */}
          {viewMode === 'chart' ? (
            <LifeWheelChart data={lifeWheelData} />
          ) : (
            <LifeWheelSliders 
              data={lifeWheelData}
              onUpdate={updateLifeWheel}
              saving={saving}
            />
          )}
        </TabsContent>

        {/* Values Tab */}
        <TabsContent value="values" className="space-y-6">
          <ValuesSelection
            valuesData={valuesData}
            selectedCount={selectedValuesCount}
            onUpdate={updateValues}
            categories={PREDEFINED_VALUES}
            saving={saving}
          />
        </TabsContent>

        {/* Vision Tab */}
        <TabsContent value="vision" className="space-y-6">
          <VisionInputs
            visionData={visionData}
            onUpdate={updateVision}
            saving={saving}
          />
        </TabsContent>

        {/* Year Focus Tab */}
        <TabsContent value="focus" className="space-y-6">
          <YearFocus
            visionData={visionData}
            onUpdate={updateVision}
            saving={saving}
          />
        </TabsContent>
      </Tabs>

      {/* Guest Mode Notice */}
      {!user && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-primary font-medium mb-2">
              You're in guest mode. Your changes are saved locally but won't persist across devices.
            </p>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth'}>
              Sign up to save your progress
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SelfDiscovery;