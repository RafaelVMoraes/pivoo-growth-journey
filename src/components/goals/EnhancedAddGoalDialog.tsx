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
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { FrequencySelector } from './FrequencySelector';

interface EnhancedAddGoalDialogProps {
  children: React.ReactNode;
}

interface ActivityInput {
  description: string;
  frequency: string;
  frequencyType: 'daily' | 'weekly' | 'monthly' | 'custom';
  frequencyValue?: number;
}

export const EnhancedAddGoalDialog = ({ children }: EnhancedAddGoalDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [goalType, setGoalType] = useState<'outcome' | 'process'>('outcome');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [parentGoalId, setParentGoalId] = useState('');
  const [status, setStatus] = useState<'active' | 'in_progress' | 'on_hold' | 'completed' | 'archived'>('active');
  const [activities, setActivities] = useState<ActivityInput[]>([{ description: '', frequency: '', frequencyType: 'weekly', frequencyValue: 3 }]);
  const [trackingType, setTrackingType] = useState<'numeric' | 'checkbox' | 'percentage'>('checkbox');

  const { createGoal, goals } = useGoals();
  const { createActivity } = useActivities();
  const { lifeWheelData, valuesData } = useSelfDiscovery();
  const { t } = useTranslation();
  const { toast } = useToast();

  const lifeWheelAreas = lifeWheelData.map(item => item.area_name);
  const availableValues = valuesData.filter(value => value.selected).map(value => value.value_name);

  const resetForm = () => {
    setStep(1);
    setSelectedAreas([]);
    setSelectedValues([]);
    setGoalType('outcome');
    setTitle('');
    setDescription('');
    setCategory('');
    setTargetDate('');
    setParentGoalId('');
    setStatus('active');
    setActivities([{ description: '', frequency: '', frequencyType: 'weekly', frequencyValue: 3 }]);
    setTrackingType('checkbox');
  };

  const handleSubmit = async () => {
    if (!title.trim() || selectedAreas.length === 0) return;

    setIsSubmitting(true);
    try {
      const goalData = {
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        type: goalType,
        status,
        target_date: targetDate || undefined,
        life_wheel_area: selectedAreas,
        related_values: selectedValues.length > 0 ? selectedValues : undefined,
        parent_goal_id: parentGoalId || undefined,
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
            frequency_type: activity.frequencyType,
            frequency_value: activity.frequencyValue,
            status: 'active',
          });
        }
      }

      toast({
        title: t('goal.created'),
        description: `"${title}" ${t('goal.createdDesc')}`,
      });

      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: t('goal.error'),
        description: t('goal.errorDesc'),
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
    setActivities([...activities, { description: '', frequency: '', frequencyType: 'weekly', frequencyValue: 3 }]);
  };

  const removeActivity = (index: number) => {
    if (activities.length > 1) {
      setActivities(activities.filter((_, i) => i !== index));
    }
  };

  const updateActivity = (index: number, field: keyof ActivityInput, value: string | number) => {
    setActivities(prev => prev.map((activity, i) => 
      i === index ? { ...activity, [field]: value } : activity
    ));
  };

  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const canProceedFromStep1 = title.trim() && selectedAreas.length > 0 && goalType;
  const canSubmit = title.trim() && selectedAreas.length > 0;

  // Get available parent goals (only top-level goals, not sub-goals)
  const availableParentGoals = goals.filter(g => !g.parent_goal_id);

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground">{t('goal.createYourGoal')}</h3>
        <p className="text-sm text-muted-foreground">{t('goal.defineWhatYouWant')}</p>
      </div>

      {/* Goal Type Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">{t('goal.type')} *</Label>
        <RadioGroup value={goalType} onValueChange={(value: 'outcome' | 'process') => setGoalType(value)}>
          <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-accent/30 cursor-pointer transition-colors">
            <RadioGroupItem value="outcome" id="outcome" />
            <div className="flex-1">
              <Label htmlFor="outcome" className="flex items-center gap-3 cursor-pointer">
                <Target size={20} className="text-primary" />
                <div>
                  <div className="font-medium">{t('goal.outcomeGoal')} 🎯</div>
                  <div className="text-sm text-muted-foreground">{t('goal.outcomeDesc')}</div>
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
                  <div className="font-medium">{t('goal.processGoal')} 🔄</div>
                  <div className="text-sm text-muted-foreground">{t('goal.processDesc')}</div>
                </div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Goal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title" className="text-base font-medium">{t('goal.title')} *</Label>
          <Input
            id="title"
            placeholder={goalType === 'outcome' ? t('goal.titlePlaceholderOutcome') : t('goal.titlePlaceholderProcess')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-base font-medium">{t('goal.lifeArea')} * (select one or more)</Label>
          <div className="flex flex-wrap gap-2">
            {lifeWheelAreas.map(area => (
              <Badge
                key={area}
                variant={selectedAreas.includes(area) ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform min-h-[44px] px-4 text-sm"
                onClick={() => toggleArea(area)}
                role="button"
                tabIndex={0}
                aria-pressed={selectedAreas.includes(area)}
                onKeyDown={(e) => e.key === 'Enter' && toggleArea(area)}
              >
                {area}
                {selectedAreas.includes(area) && <X size={12} className="ml-2" />}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="parent-goal">{t('goal.parentGoal')} (optional)</Label>
          <Select value={parentGoalId} onValueChange={setParentGoalId}>
            <SelectTrigger className="min-h-[44px]">
              <SelectValue placeholder="None - standalone goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None - standalone goal</SelectItem>
              {availableParentGoals.map(goal => (
                <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="target-date">{t('goal.targetDate')}</Label>
          <Input
            id="target-date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">{t('goal.descriptionOptional')}</Label>
          <Textarea
            id="description"
            placeholder={t('goal.descriptionPlaceholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Values Connection */}
      {availableValues.length > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-medium">{t('goal.connectToValues')}</Label>
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
        <h3 className="text-xl font-semibold text-foreground">{t('goal.addActivities')}</h3>
        <p className="text-sm text-muted-foreground">{t('goal.defineActions')}</p>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="space-y-3 p-4 border rounded-lg bg-accent/10">
            <div className="flex items-center justify-between">
              <Label className="font-medium">Activity {index + 1}</Label>
              {activities.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeActivity(index)}
                  className="h-8 w-8 p-0"
                  aria-label="Remove activity"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            
            <Input
              id={`activity-${index}`}
              placeholder={t('goal.activityPlaceholder')}
              value={activity.description}
              onChange={(e) => updateActivity(index, 'description', e.target.value)}
              className="min-h-[44px]"
            />
            
            <FrequencySelector
              value={{
                type: activity.frequencyType,
                value: activity.frequencyValue
              }}
              onChange={(freq) => {
                updateActivity(index, 'frequencyType', freq.type);
                updateActivity(index, 'frequencyValue', freq.value || 0);
              }}
            />
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addActivity}
          className="w-full gap-2"
        >
          <Plus size={16} />
          {t('goal.addAnotherActivity')}
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
            {t('goal.addNew')} - {t('goal.stepOf')} {step} {t('goal.of')} 2
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
            {step === 1 ? t('common.cancel') : (
              <>
                <ChevronLeft size={16} />
                {t('common.back')}
              </>
            )}
          </Button>

          {step < 2 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceedFromStep1 || isSubmitting}
            >
              {t('goal.nextAddActivities')}
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? t('goal.creating') : t('goal.createGoal')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};