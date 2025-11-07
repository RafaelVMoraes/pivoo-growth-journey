import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface ReflectionLayerProps {
  onSave: (reflection: { surface: string; deeper: string; identity: string }) => void;
  initialValues?: { surface: string; deeper: string; identity: string };
}

export const ReflectionLayer = ({ onSave, initialValues }: ReflectionLayerProps) => {
  const [surface, setSurface] = useState(initialValues?.surface || '');
  const [deeper, setDeeper] = useState(initialValues?.deeper || '');
  const [identity, setIdentity] = useState(initialValues?.identity || '');

  const handleSave = () => {
    onSave({ surface, deeper, identity });
  };

  return (
    <Card className="p-6 space-y-6 bg-accent/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={24} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Why this goal?</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="surface" className="text-sm font-medium mb-2 block">
            What's driving you to pursue this goal?
          </Label>
          <Textarea
            id="surface"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
            placeholder="What sparked this goal? What immediate motivation do you have?"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="deeper" className="text-sm font-medium mb-2 block">
            What deeper need or value does it fulfill for you?
          </Label>
          <Textarea
            id="deeper"
            value={deeper}
            onChange={(e) => setDeeper(e.target.value)}
            placeholder="What does achieving this really give you? What need does it satisfy?"
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="identity" className="text-sm font-medium mb-2 block">
            How does this goal connect with who you are or who you want to become?
          </Label>
          <Textarea
            id="identity"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            placeholder="How does this relate to your identity and purpose?"
            className="min-h-[80px]"
          />
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Reflection
      </Button>
    </Card>
  );
};
