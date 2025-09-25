import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X, Target, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { useActivities } from '@/hooks/useActivities';
import { useSelfDiscovery } from '@/hooks/useSelfDiscovery';
import { useToast } from '@/hooks/use-toast';

interface EnhancedAddGoalDialogProps {
  children: React.ReactNode;
}

interface ActivityInput {
  description: string;
  frequency: string;
}

export const EnhancedAddGoalDialog = ({ children }: EnhancedAddGoalDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [goalType, setGoalType] = useState<'outcome' | 'process'>('outcome');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState<'active' | 'in_progress' | 'on_hold' | 'completed' | 'archived'>('active');
  const [activities, setActivities] = useState<ActivityInput[]>([{ description: '', frequency: '' }]);
  const [trackingType, setTrackingType] = useState<'numeric' | 'checkbox' | 'percentage'>('checkbox');

  const { createGoal } = useGoals();
  const { createActivity } = useActivities();
  const { lifeWheelData, valuesData } = useSelfDiscovery();
  const { toast } = useToast();

  const lifeWheelAreas = lifeWheelData.map(item => item.area_name);
  const availableValues = valuesData.filter(value => value.selected).map(value => value.value_name);

  const resetForm = () => {
    setStep(1);
    setSelectedArea('');
    setSelectedValues([]);
    setGoalType('outcome');
    setTitle('');
    setDescription('');
    setCategory('');
    setTargetDate('');
    setStatus('active');
    setActivities([{ description: '', frequency: '' }]);
    setTrackingType('checkbox');
  };

  const handleSubmit = async () => {
    if (!title.trim() || !selectedArea) return;

    setIsSubmitting(true);
    try {
      const goalData = {
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        type: goalType,
        status,
        target_date: targetDate || undefined,
        life_wheel_area: selectedArea,
        related_values: selectedValues.length > 0 ? selectedValues : undefined,
      };

      const newGoal = await createGoal(goalData);
      
      // Create activities if any are provided
      if (newGoal) {
        const validActivities = activities.filter(activity => activity.description.trim());
        for (const activity of validActivities) {
          await createActivity({
            goal_id: newGoal.id,
            description: activity.description.trim(),
            frequency: activity.frequency.trim() || undefined,
            status: 'active',
          });
        }
      }

      toast({
        title: "Goal created!",
        description: `"${title}" has been added to your goals.`,
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleValue = (value: string) => {
    setSelectedValues(prev => 
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const addActivity = () => {
    setActivities([...activities, { description: '', frequency: '' }]);
  };

  const removeActivity = (index: number) => {
    if (activities.length > 1) {
      setActivities(activities.filter((_, i) => i !== index));
    }
  };

  const updateActivity = (index: number, field: keyof ActivityInput, value: string) => {
    setActivities(prev => prev.map((activity, i) => 
      i === index ? { ...activity, [field]: value } : activity
    ));
  };

  const canProceedFromStep1 = title.trim() && selectedArea && goalType;
  const canSubmit = title.trim() && selectedArea;

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground">Create Your Goal</h3>
        <p className="text-sm text-muted-foreground">Define what you want to achieve and how</p>
      </div>

      {/* Goal Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Goal Type *</Label>
        <RadioGroup value={goalType} onValueChange={(value: 'outcome' | 'process') => setGoalType(value)}>
          <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-accent/30 cursor-pointer transition-colors">
            <RadioGroupItem value="outcome" id="outcome" />
            <div className="flex-1">
              <Label htmlFor="outcome" className="flex items-center gap-3 cursor-pointer">
                <Target size={20} className="text-primary" />
                <div>
                  <div className="font-medium">Outcome Goal 🎯</div>
                  <div className="text-sm text-muted-foreground">A specific result to achieve</div>
                </div>
              </Label>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-accent/30 cursor-pointer transition-colors">
            <RadioGroupItem value="process" id="process" />
            <div className="flex-1">
              <Label htmlFor="process" className="flex items-center gap-3 cursor-pointer">
                <RotateCcw size={20} className="text-primary" />
                <div>
                  <div className="font-medium">Process Goal 🔄</div>
                  <div className="text-sm text-muted-foreground">A habit or recurring action</div>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Goal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title" className="text-base font-medium">Goal Title *</Label>
          <Input
            id="title"
            placeholder={goalType === 'outcome' ? 'e.g., Reach 75kg by December' : 'e.g., Exercise 3 times per week'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Life Area *</Label>
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              {lifeWheelAreas.map(area => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-date">Target Date</Label>
          <Input
            id="target-date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Why is this goal important to you?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Values Connection */}
      {availableValues.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Connect to Your Values (Optional)</Label>
          <div className="flex flex-wrap gap-2">
            {availableValues.map(value => (
              <Badge
                key={value}
                variant={selectedValues.includes(value) ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform px-3 py-1"
                onClick={() => toggleValue(value)}
              >
                ✨ {value}
                {selectedValues.includes(value) && (
                  <X size={12} className="ml-2" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground">Add Activities</h3>
        <p className="text-sm text-muted-foreground">Define specific actions that will help you achieve this goal</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor={`activity-${index}`}>Activity {index + 1}</Label>
              <Input
                id={`activity-${index}`}
                placeholder="e.g., Go to the gym, Read for 30 minutes"
                value={activity.description}
                onChange={(e) => updateActivity(index, 'description', e.target.value)}
              />
            </div>
            <div className="w-32 space-y-2">
              <Label htmlFor={`frequency-${index}`}>Frequency</Label>
              <Input
                id={`frequency-${index}`}
                placeholder="e.g., 3x/week"
                value={activity.frequency}
                onChange={(e) => updateActivity(index, 'frequency', e.target.value)}
              />
            </div>
            {activities.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeActivity(index)}
                className="mb-0"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addActivity}
          className="w-full gap-2"
        >
          <Plus size={16} />
          Add Another Activity
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="text-primary" />
            Add New Goal - Step {step} of 2
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : setIsOpen(false)}
            disabled={isSubmitting}
          >
            {step === 1 ? 'Cancel' : (
              <>
                <ChevronLeft size={16} />
                Back
              </>
            )}
          </Button>

          {step < 2 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceedFromStep1 || isSubmitting}
            >
              Next: Add Activities
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Goal'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};