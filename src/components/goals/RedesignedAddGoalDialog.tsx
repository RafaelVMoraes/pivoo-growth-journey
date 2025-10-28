import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Target, RotateCcw, Calendar, HelpCircle } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { useSelfDiscovery } from '@/hooks/useSelfDiscovery';

interface RedesignedAddGoalDialogProps {
  children: React.ReactNode;
}

type GoalType = 'milestone' | 'recurring';

export const RedesignedAddGoalDialog = ({ children }: RedesignedAddGoalDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [goalType, setGoalType] = useState<GoalType>('milestone');
  const { createGoal } = useGoals();
  const { lifeWheelData } = useSelfDiscovery();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [whyGoal, setWhyGoal] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const lifeAreas = Array.from(new Set(lifeWheelData.map(w => w.area_name)));

  const resetForm = () => {
    setStep('type');
    setGoalType('milestone');
    setTitle('');
    setDescription('');
    setWhyGoal('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setSelectedArea('');
    setFrequency('weekly');
  };

  const handleSubmit = async () => {
    try {
      await createGoal({
        title,
        description: `${description}\n\nWhy: ${whyGoal}`,
        type: goalType === 'milestone' ? 'outcome' : 'process',
        status: 'active',
        life_wheel_area: selectedArea ? [selectedArea] : undefined,
        target_date: goalType === 'milestone' ? endDate : undefined,
      });
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'type' ? 'What type of goal do you want to create?' : 'Goal Details'}
          </DialogTitle>
        </DialogHeader>

        {step === 'type' ? (
          <div className="space-y-4 py-4">
            <RadioGroup value={goalType} onValueChange={(v) => setGoalType(v as GoalType)}>
              {/* Milestone Goal */}
              <label
                className={`
                  flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${goalType === 'milestone' ? 'border-primary bg-accent/50' : 'border-border hover:bg-accent/30'}
                `}
              >
                <RadioGroupItem value="milestone" id="milestone" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={20} className="text-primary" />
                    <span className="font-semibold text-foreground">🎯 Milestone Goal</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Has a defined end result. Example: "Read 12 books by December."
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>✓ Has a clear finish line</p>
                    <p>✓ Can measure progress from 0 → 100%</p>
                    <p>✓ Can be completed one day</p>
                  </div>
                </div>
              </label>

              {/* Recurring Goal */}
              <label
                className={`
                  flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${goalType === 'recurring' ? 'border-primary bg-accent/50' : 'border-border hover:bg-accent/30'}
                `}
              >
                <RadioGroupItem value="recurring" id="recurring" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw size={20} className="text-primary" />
                    <span className="font-semibold text-foreground">🔁 Recurring Goal</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Focuses on continuous habits. Example: "Exercise 3x per week."
                  </p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>✓ Something to repeat regularly</p>
                    <p>✓ No final point, only consistency</p>
                    <p>✓ Progress measured by repetition</p>
                  </div>
                </div>
              </label>
            </RadioGroup>

            <Button onClick={() => setStep('details')} className="w-full" size="lg">
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Goal Title */}
            <div>
              <Label htmlFor="title">Goal Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={goalType === 'milestone' ? 'e.g., Read 12 books' : 'e.g., Exercise regularly'}
                className="min-h-[44px]"
              />
            </div>

            {/* Why this goal */}
            <div className="bg-accent/30 p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle size={18} className="text-primary" />
                <Label htmlFor="why">Why this goal?</Label>
              </div>
              <Textarea
                id="why"
                value={whyGoal}
                onChange={(e) => setWhyGoal(e.target.value)}
                placeholder="What motivates you? How will achieving this improve your life?"
                className="min-h-[80px]"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about your goal..."
                className="min-h-[80px]"
              />
            </div>

            {/* Life Area */}
            <div>
              <Label htmlFor="area">Life Area</Label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue placeholder="Select a life area" />
                </SelectTrigger>
                <SelectContent>
                  {lifeAreas.map((area: string) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Milestone-specific fields */}
            {goalType === 'milestone' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start">Start Date</Label>
                    <Input
                      id="start"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="min-h-[44px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end">End Date *</Label>
                    <Input
                      id="end"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="min-h-[44px]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Recurring-specific fields */}
            {goalType === 'recurring' && (
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as any)}>
                  <SelectTrigger className="min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setStep('type')} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!title || (goalType === 'milestone' && !endDate)}
                className="flex-1"
              >
                Create Goal
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
