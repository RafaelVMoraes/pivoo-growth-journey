import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from '@/hooks/useGoals';
import { useSelfDiscovery } from '@/hooks/useSelfDiscovery';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, X, Plus } from 'lucide-react';
import { FrequencySelector } from '../forms/FrequencySelector';
import { ReflectionLayer } from '../forms/ReflectionLayer';

interface AddGoalDialogProps {
  children: React.ReactNode;
}

interface ActivityInput {
  description: string;
  frequencyType: 'daily' | 'weekly' | 'monthly';
  //frequencyValue?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'night';
  daysOfWeek?: string[];
  dayOfMonth?: number;
}

export const AddGoalDialog = ({ children }: AddGoalDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { refetch } = useGoals();
  const { lifeWheelData, valuesData } = useSelfDiscovery();
  const { t } = useTranslation();
  const { toast } = useToast();

  // Step 1 - Basic goal info
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'outcome' | 'process'>('outcome');
  const [priority, setPriority] = useState<'gold' | 'silver' | 'bronze'>('bronze');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [parentGoalId, setParentGoalId] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Step 2 - Reflection
  const [surfaceMotivation, setSurfaceMotivation] = useState('');
  const [deeperMotivation, setDeeperMotivation] = useState('');
  const [identityMotivation, setIdentityMotivation] = useState('');

  // Step 3 - Activities
  const [activities, setActivities] = useState<ActivityInput[]>([]);

  const lifeWheelAreas = lifeWheelData.map(item => item.area_name);
  const availableValues = valuesData.filter(value => value.selected).map(value => value.value_name);

  const resetForm = () => {
    setStep(1);
    setTitle('');
    setType('outcome');
    setPriority('bronze');
    setSelectedAreas([]);
    setParentGoalId('');
    setTargetDate('');
    setDescription('');
    setSelectedValues([]);
    setSurfaceMotivation('');
    setDeeperMotivation('');
    setIdentityMotivation('');
    setActivities([]);
  };

  const handleSubmit = async () => {
    if (!user || !title.trim()) return;

    setIsSubmitting(true);
    try {
      // Create goal
      const { data: goalData, error: goalError } = await supabase
        .from('goals')
        .insert({
          title: title.trim(),
          description: description.trim() || undefined,
          type,
          status: 'active',
          priority,
          life_wheel_area: selectedAreas.length > 0 ? selectedAreas : undefined,
          parent_goal_id: parentGoalId || undefined,
          target_date: targetDate || undefined,
          related_values: selectedValues.length > 0 ? selectedValues : undefined,
          surface_motivation: surfaceMotivation.trim() || undefined,
          deeper_motivation: deeperMotivation.trim() || undefined,
          identity_motivation: identityMotivation.trim() || undefined,
          user_id: user.id,
        })
        .select()
        .single();

      if (goalError) throw goalError;

      // Create activities
      if (activities.length > 0) {
        const activitiesData = activities.map(activity => ({
          goal_id: goalData.id,
          description: activity.description,
          frequency_type: activity.frequencyType,
          //frequency_value: activity.frequencyValue,
          time_of_day: activity.timeOfDay,
          days_of_week: activity.daysOfWeek,
          day_of_month: activity.dayOfMonth,
          status: 'active',
          user_id: user.id,
        }));

        const { error: activitiesError } = await supabase
          .from('activities')
          .insert(activitiesData);

        if (activitiesError) throw activitiesError;
      }

      toast({
        title: 'Success',
        description: 'Goal created successfully',
      });

      resetForm();
      setIsOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to create goal',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArea = (area: string) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const toggleValue = (value: string) => {
    setSelectedValues(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const addActivity = () => {
    setActivities(prev => [
      ...prev,
      { description: '', frequencyType: 'weekly' },
    ]);
  };

  const removeActivity = (index: number) => {
    setActivities(prev => prev.filter((_, i) => i !== index));
  };

  const updateActivity = (index: number, updates: Partial<ActivityInput>) => {
    setActivities(prev =>
      prev.map((activity, i) => (i === index ? { ...activity, ...updates } : activity))
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('goal.type')}</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('outcome')}
            className={`p-4 rounded-lg border-2 transition-all ${
              type === 'outcome'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium">Outcome Goal</div>
            <div className="text-xs text-muted-foreground">A specific result to achieve</div>
          </button>
          <button
            type="button"
            onClick={() => setType('process')}
            className={`p-4 rounded-lg border-2 transition-all ${
              type === 'process'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium">Process Goal</div>
            <div className="text-xs text-muted-foreground">A habit or repeated action</div>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">{t('goal.title')} *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Run a marathon, Learn Spanish"
          className="min-h-[44px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Priority *</Label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setPriority('gold')}
            className={`p-4 rounded-lg border-2 transition-all ${
              priority === 'gold'
                ? 'border-yellow-500 bg-yellow-500/10'
                : 'border-border hover:border-yellow-500/50'
            }`}
          >
            <div className="text-2xl mb-2">🥇</div>
            <div className="font-medium">Gold</div>
            <div className="text-xs text-muted-foreground">Max 3 goals</div>
          </button>
          <button
            type="button"
            onClick={() => setPriority('silver')}
            className={`p-4 rounded-lg border-2 transition-all ${
              priority === 'silver'
                ? 'border-gray-400 bg-gray-400/10'
                : 'border-border hover:border-gray-400/50'
            }`}
          >
            <div className="text-2xl mb-2">🥈</div>
            <div className="font-medium">Silver</div>
            <div className="text-xs text-muted-foreground">Max 5 goals</div>
          </button>
          <button
            type="button"
            onClick={() => setPriority('bronze')}
            className={`p-4 rounded-lg border-2 transition-all ${
              priority === 'bronze'
                ? 'border-amber-700 bg-amber-700/10'
                : 'border-border hover:border-amber-700/50'
            }`}
          >
            <div className="text-2xl mb-2">🥉</div>
            <div className="font-medium">Bronze</div>
            <div className="text-xs text-muted-foreground">Unlimited</div>
          </button>
        </div>
      </div>

      {lifeWheelAreas.length > 0 && (
        <div className="space-y-2">
          <Label>{t('goal.lifeArea')} *</Label>
          <div className="flex flex-wrap gap-2">
            {lifeWheelAreas.map(area => (
              <Badge
                key={area}
                variant={selectedAreas.includes(area) ? 'default' : 'outline'}
                className="cursor-pointer hover:scale-105 transition-transform min-h-[44px] px-4 text-sm"
                onClick={() => toggleArea(area)}
              >
                {area}
                {selectedAreas.includes(area) && <X size={12} className="ml-2" />}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="target-date">{t('goal.targetDate')}</Label>
        <Input
          id="target-date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="min-h-[44px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t('goal.description')}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your goal in more detail..."
          rows={3}
        />
      </div>

      {availableValues.length > 0 && (
        <div className="space-y-2">
          <Label>{t('goal.relatedValues')}</Label>
          <div className="flex flex-wrap gap-2">
            {availableValues.map(value => (
              <Badge
                key={value}
                variant={selectedValues.includes(value) ? 'default' : 'outline'}
                className="cursor-pointer hover:scale-105 transition-transform px-3 py-1"
                onClick={() => toggleValue(value)}
              >
                {value}
                {selectedValues.includes(value) && <X size={12} className="ml-2" />}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <ReflectionLayer
      onSave={(reflection) => {
        setSurfaceMotivation(reflection.surface);
        setDeeperMotivation(reflection.deeper);
        setIdentityMotivation(reflection.identity);
      }}
      initialValues={{
        surface: surfaceMotivation,
        deeper: deeperMotivation,
        identity: identityMotivation,
      }}
    />
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Activities & Habits</Label>
        <Button type="button" size="sm" variant="outline" onClick={addActivity}>
          <Plus size={14} className="mr-1" />
          Add Activity
        </Button>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="p-4 bg-accent/30 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Activity description"
                value={activity.description}
                onChange={(e) => updateActivity(index, { description: e.target.value })}
                className="flex-1 min-h-[44px]"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeActivity(index)}
              >
                <X size={14} />
              </Button>
            </div>

            <FrequencySelector
              value={{
                type: activity.frequencyType,
                //value: activity.frequencyValue,
                timeOfDay: activity.timeOfDay,
                daysOfWeek: activity.daysOfWeek,
                dayOfMonth: activity.dayOfMonth,
              }}
              onChange={(freq) =>
                updateActivity(index, {
                  frequencyType: freq.type,
                  //frequencyValue: freq.value,
                  timeOfDay: freq.timeOfDay,
                  daysOfWeek: freq.daysOfWeek,
                  dayOfMonth: freq.dayOfMonth,
                })
              }
            />
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
            <p>No activities yet. Add specific actions to achieve this goal.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && 'Create New Goal'}
            {step === 2 && 'Reflect on Your Why'}
            {step === 3 && 'Add Activities'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <div className="flex justify-between gap-2 pt-4 border-t">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={14} className="mr-2" />
              Back
            </Button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && (!title.trim() || selectedAreas.length === 0)}
            >
              Next
              <ArrowRight size={14} className="ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Goal'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
