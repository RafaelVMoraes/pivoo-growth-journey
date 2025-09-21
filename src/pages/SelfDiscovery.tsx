import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Circle, 
  Heart, 
  Compass, 
  Star, 
  ArrowRight,
  Clock
} from 'lucide-react';

export const SelfDiscovery = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Self-Discovery</h1>
        <p className="text-muted-foreground">
          Explore your inner landscape and authentic self
        </p>
      </div>

      {/* Main Feature - Wheel of Life */}
      <Card className="gradient-card shadow-card text-center">
        <CardHeader className="pb-4">
          <div className="relative mx-auto w-20 h-20 mb-4">
            <Circle size={80} className="text-primary opacity-20 absolute" />
            <Circle size={60} className="text-primary opacity-40 absolute top-2.5 left-2.5" />
            <Circle size={40} className="text-primary opacity-60 absolute top-5 left-5" />
            <Star size={20} className="text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <CardTitle className="text-xl">Wheel of Life</CardTitle>
          <CardDescription>
            Assess and visualize balance across all areas of your life
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="text-xs">Career</Badge>
            <Badge variant="outline" className="text-xs">Relationships</Badge>
            <Badge variant="outline" className="text-xs">Health</Badge>
            <Badge variant="outline" className="text-xs">Personal Growth</Badge>
            <Badge variant="outline" className="text-xs">Recreation</Badge>
            <Badge variant="outline" className="text-xs">Environment</Badge>
          </div>
          
          <Button disabled className="shadow-soft">
            Start Your Assessment
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Additional Tools */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Explore More Tools</h2>
        
        <div className="grid gap-4">
          <Card className="gradient-card shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart size={18} className="text-primary" />
                Values Discovery
                <Badge variant="secondary" className="ml-auto text-xs">
                  <Clock size={10} className="mr-1" />
                  15 min
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm">
                Identify your core values and what truly matters to you
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="gradient-card shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Compass size={18} className="text-primary" />
                Purpose Explorer
                <Badge variant="secondary" className="ml-auto text-xs">
                  <Clock size={10} className="mr-1" />
                  20 min
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm">
                Discover your life purpose and direction through guided reflection
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="gradient-card shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Star size={18} className="text-primary" />
                Strengths Assessment
                <Badge variant="secondary" className="ml-auto text-xs">
                  <Clock size={10} className="mr-1" />
                  10 min
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm">
                Uncover your natural talents and areas of excellence
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6 text-center">
          <p className="text-sm text-primary font-medium">
            Self-discovery tools are coming soon! These powerful assessments will help you gain deeper insights into yourself.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfDiscovery;