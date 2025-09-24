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
      const goal = await createGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
        target_date: targetDate || undefined,
        type: goalType,
        status,
        life_wheel_area: selectedArea,
        related_values: selectedValues.length > 0 ? selectedValues : undefined,
      });

      if (goal && activities.some(a => a.description.trim())) {
        // Create activities for the goal
        for (const activity of activities) {
          if (activity.description.trim()) {
            await createActivity({
              goal_id: goal.id,
              description: activity.description.trim(),
              frequency: activity.frequency || undefined,
              status: 'active'
            });
          }
        }
      }

      resetForm();
      setIsOpen(false);
    } catch (error) {
      // Error handled by hooks
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
    setActivities(prev => [...prev, { description: '', frequency: '' }]);
  };

  const removeActivity = (index: number) => {
    setActivities(prev => prev.filter((_, i) => i !== index));
  };

  const updateActivity = (index: number, field: keyof ActivityInput, value: string) => {
    setActivities(prev => prev.map((activity, i) => 
      i === index ? { ...activity, [field]: value } : activity
    ));
  };

  const canProceedFromStep1 = selectedArea;
  const canProceedFromStep2 = goalType;
  const canProceedFromStep3 = title.trim();
  const canSubmit = title.trim() && selectedArea;

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Select Life Area & Values</h3>
        <p className="text-sm text-muted-foreground">Choose which area of life this goal focuses on</p>
      </div>

      <div className="space-y-2">
        <Label>Life Area *</Label>
        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger>
            <SelectValue placeholder="Select a life area" />
          </SelectTrigger>
          <SelectContent>
            {lifeWheelAreas.map(area => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {availableValues.length > 0 && (
        <div className="space-y-2">
          <Label>Related Values (Optional)</Label>
          <div className="flex flex-wrap gap-2">
            {availableValues.map(value => (
              <Badge
                key={value}
                variant={selectedValues.includes(value) ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => toggleValue(value)}
              >
                {value}
                {selectedValues.includes(value) && (
                  <X size={12} className="ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Goal Type</h3>
        <p className="text-sm text-muted-foreground">Choose how you want to structure this goal</p>
      </div>

      <RadioGroup value={goalType} onValueChange={(value: 'outcome' | 'process') => setGoalType(value)}>
        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
          <RadioGroupItem value="outcome" id="outcome" />
          <div className="flex-1">
            <Label htmlFor="outcome" className="flex items-center gap-2 cursor-pointer">
              <Target size={20} className="text-primary" />
              <div>
                <div className="font-medium">Outcome Goal 🎯</div>
                <div className="text-sm text-muted-foreground">Result to achieve (e.g., "Reach 75kg by December")</div>
              </div>
            </Label>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
          <RadioGroupItem value="process" id="process" />
          <div className="flex-1">
            <Label htmlFor="process" className="flex items-center gap-2 cursor-pointer">
              <RotateCcw size={20} className="text-primary" />
              <div>
                <div className="font-medium">Process Goal 🔄</div>
                <div className="text-sm text-muted-foreground">Recurring effort (e.g., "Run 3 times per week")</div>
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Goal Details</h3>
        <p className="text-sm text-muted-foreground">Define your goal specifics</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Goal Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your goal"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your goal in detail"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Personal Development">Personal Development</SelectItem>
              <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
              <SelectItem value="Career">Career</SelectItem>
              <SelectItem value="Relationships">Relationships</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Travel">Travel</SelectItem>
              <SelectItem value="Hobbies">Hobbies</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetDate">Deadline (Optional)</Label>
          <Input
            id="targetDate"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={(value: any) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Activities & Habits</h3>
        <p className="text-sm text-muted-foreground">Define concrete actions to achieve your goal</p>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1 space-y-2">
              <Input
                placeholder="Activity description"
                value={activity.description}
                onChange={(e) => updateActivity(index, 'description', e.target.value)}
              />
              <Input
                placeholder="Frequency (e.g., 3x/week, daily)"
                value={activity.frequency}
                onChange={(e) => updateActivity(index, 'frequency', e.target.value)}
              />
            </div>
            {activities.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeActivity(index)}
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
          className="w-full"
        >
          <Plus size={16} className="mr-1" />
          Add Activity
        </Button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Progress Tracking</h3>
        <p className="text-sm text-muted-foreground">How will you measure progress?</p>
      </div>

      <RadioGroup value={trackingType} onValueChange={(value: any) => setTrackingType(value)}>
        <div className="flex items-center space-x-2 p-3 border rounded-lg">
          <RadioGroupItem value="checkbox" id="checkbox" />
          <Label htmlFor="checkbox" className="flex-1 cursor-pointer">
            <div className="font-medium">Checkbox ✓</div>
            <div className="text-sm text-muted-foreground">Simple done/not done tracking</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 p-3 border rounded-lg">
          <RadioGroupItem value="numeric" id="numeric" />
          <Label htmlFor="numeric" className="flex-1 cursor-pointer">
            <div className="font-medium">Numeric 📊</div>
            <div className="text-sm text-muted-foreground">Track quantities (kg, hours, reps, etc.)</div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 p-3 border rounded-lg">
          <RadioGroupItem value="percentage" id="percentage" />
          <Label htmlFor="percentage" className="flex-1 cursor-pointer">
            <div className="font-medium">Percentage %</div>
            <div className="text-sm text-muted-foreground">Track completion percentage</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="glass-card border-glass max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            Add New Goal
            <span className="text-sm text-muted-foreground">Step {step} of 5</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="min-h-[400px]">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : setIsOpen(false)}
            disabled={isSubmitting}
          >
            {step > 1 ? <ChevronLeft size={16} className="mr-1" /> : null}
            {step > 1 ? 'Back' : 'Cancel'}
          </Button>
          
          {step < 5 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !canProceedFromStep1) ||
                (step === 2 && !canProceedFromStep2) ||
                (step === 3 && !canProceedFromStep3)
              }
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
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