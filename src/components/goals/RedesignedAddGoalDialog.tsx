import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useGoals } from '@/hooks/useGoals';
import { useSelfDiscovery } from '@/hooks/useSelfDiscovery';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Target, RotateCcw, X, Plus, Lightbulb } from 'lucide-react';
import { FrequencySelector } from './FrequencySelector';
import { ReflectionLayer } from './ReflectionLayer';

interface RedesignedAddGoalDialogProps {
  children: React.ReactNode;
}

interface ActivityInput {
  description: string;
  frequency: string;
  frequencyType: 'daily' | 'weekly' | 'monthly' | 'custom';
  frequencyValue?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'night';
  daysOfWeek?: string[];
  dayOfMonth?: number;
}

export const RedesignedAddGoalDialog = ({ children }: RedesignedAddGoalDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [goalType, setGoalType] = useState<'outcome' | 'process'>('outcome');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [targetDate, setTargetDate] = useState('');
  const [checkFrequency, setCheckFrequency] = useState('weekly');
  const [activities, setActivities] = useState<ActivityInput[]>([]);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState({ surface: '', deeper: '', identity: '' });
  const [createdGoalId, setCreatedGoalId] = useState<string | null>(null);

  const { createGoal, refetch } = useGoals();
  const { lifeWheelData } = useSelfDiscovery();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Helper function to create activities after goal creation
  const createActivitiesForGoal = async (goalId: string) => {
    if (activities.length === 0) return;
    
    for (const activity of activities) {
      if (activity.description.trim()) {
        try {
          await supabase.from('activities').insert({
            goal_id: goalId,
            user_id: user?.id,
            description: activity.description,
            frequency: activity.frequency,
            frequency_type: activity.frequencyType,
            frequency_value: activity.frequencyValue,
            time_of_day: activity.timeOfDay,
            days_of_week: activity.daysOfWeek,
            day_of_month: activity.dayOfMonth,
            status: 'active',
          });
        } catch (actErr) {
          console.error('Failed to create activity:', actErr);
        }
      }
    }
  };

  const resetForm = () => {
    setStep(1);
    setGoalType('outcome');
    setTitle('');
    setDescription('');
    setSelectedAreas([]);
    setTargetDate('');
    setCheckFrequency('weekly');
    setActivities([]);
    setShowReflection(false);
    setReflection({ surface: '', deeper: '', identity: '' });
    setCreatedGoalId(null);
  };

  const toggleArea = (area: string) => {
    setSelectedAreas(prev => 
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const addActivity = () => {
    setActivities([...activities, { 
      description: '', 
      frequency: '', 
      frequencyType: 'custom',
      frequencyValue: undefined,
      timeOfDay: undefined,
      daysOfWeek: undefined,
      dayOfMonth: undefined
    }]);
  };

  const updateActivity = (index: number, field: keyof ActivityInput, value: any) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || selectedAreas.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in the goal title and select at least one life area",
        variant: "destructive"
      });
      return;
    }

    if (goalType === 'outcome' && !targetDate) {
      toast({
        title: "Missing target date",
        description: "Milestone goals require a target date",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const goalData = {
        title,
        description: description || undefined,
        type: goalType,
        status: 'active' as const,
        life_wheel_area: selectedAreas,
        target_date: goalType === 'outcome' ? targetDate : undefined,
        related_values: [],
      };

      const createdGoal = await createGoal(goalData);

      if (createdGoal && createdGoal.id) {
        setCreatedGoalId(createdGoal.id);
        
        // Create activities if any
        await createActivitiesForGoal(createdGoal.id);
      }

      // Refresh the goals list to show the new goal immediately
      await refetch();

      toast({
        title: "Success!",
        description: "Goal created successfully",
      });

      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReflectionSave = (reflectionData: { surface: string; deeper: string; identity: string }) => {
    setReflection(reflectionData);
    setShowReflection(false);
    toast({
      title: "Reflection saved",
      description: "Your reflection has been saved with this goal",
    });
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
          </DialogHeader>

          {showReflection ? (
            <ReflectionLayer
              onSave={handleReflectionSave}
              initialValues={reflection}
            />
          ) : (
            <div className="space-y-6 py-4">
              {/* Step 1: Goal Type Selection */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      What type of goal do you want to create?
                    </Label>
                    <RadioGroup value={goalType} onValueChange={(val) => setGoalType(val as 'outcome' | 'process')}>
                      <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
                        <RadioGroupItem value="outcome" id="outcome" />
                        <div className="flex-1">
                          <Label htmlFor="outcome" className="cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <Target size={18} className="text-primary" />
                              <span className="font-semibold">🎯 Milestone Goal</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Has a defined end result (e.g., "Read 12 books by December")
                            </p>
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border-2 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer">
                        <RadioGroupItem value="process" id="process" />
                        <div className="flex-1">
                          <Label htmlFor="process" className="cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <RotateCcw size={18} className="text-primary" />
                              <span className="font-semibold">🔁 Recurring Goal</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Focuses on continuous habits (e.g., "Exercise 3x per week")
                            </p>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button onClick={() => setStep(2)} className="w-full">
                    Next
                  </Button>
                </div>
              )}

              {/* Step 2: Goal Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Goal Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="What do you want to achieve?"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add more details about this goal..."
                      className="mt-1 min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Life Areas * (select multiple)</Label>
                    <div className="flex flex-wrap gap-2">
                      {lifeWheelData.map((area) => (
                        <Badge
                          key={area.area_name}
                          variant={selectedAreas.includes(area.area_name) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary/80"
                          onClick={() => toggleArea(area.area_name)}
                        >
                          {area.area_name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {goalType === 'outcome' && (
                    <>
                      <div>
                        <Label htmlFor="targetDate">Target Date *</Label>
                        <Input
                          id="targetDate"
                          type="date"
                          value={targetDate}
                          onChange={(e) => setTargetDate(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="checkFrequency">Progress Check Frequency</Label>
                        <Select value={checkFrequency} onValueChange={setCheckFrequency}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setShowReflection(true)}
                    className="w-full"
                  >
                    <Lightbulb size={16} className="mr-2" />
                    Why this goal? (Reflection)
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1">
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Activities */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base font-semibold">Related Activities</Label>
                      <Button size="sm" variant="outline" onClick={addActivity}>
                        <Plus size={16} className="mr-1" />
                        Add Activity
                      </Button>
                    </div>

                    {activities.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        No activities yet. Add activities to track your progress.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {activities.map((activity, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start gap-2">
                              <Input
                                placeholder="Activity description"
                                value={activity.description}
                                onChange={(e) => updateActivity(index, 'description', e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeActivity(index)}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                            <FrequencySelector
                              value={{ 
                                type: activity.frequencyType === 'custom' ? 'daily' : activity.frequencyType,
                                value: activity.frequencyValue,
                                timeOfDay: activity.timeOfDay,
                                daysOfWeek: activity.daysOfWeek,
                                dayOfMonth: activity.dayOfMonth
                              }}
                              onChange={(freq) => {
                                updateActivity(index, 'frequencyType', freq.type);
                                updateActivity(index, 'frequencyValue', freq.value);
                                updateActivity(index, 'timeOfDay', freq.timeOfDay);
                                updateActivity(index, 'daysOfWeek', freq.daysOfWeek);
                                updateActivity(index, 'dayOfMonth', freq.dayOfMonth);
                                
                                // Build frequency string
                                let freqStr = `${freq.value || 1}x ${freq.type}`;
                                if (freq.type === 'daily' && freq.timeOfDay) {
                                  freqStr += ` (${freq.timeOfDay})`;
                                } else if (freq.type === 'weekly' && freq.daysOfWeek && freq.daysOfWeek.length > 0) {
                                  freqStr += ` (${freq.daysOfWeek.join(', ')})`;
                                } else if (freq.type === 'monthly' && freq.dayOfMonth) {
                                  freqStr += ` (day ${freq.dayOfMonth})`;
                                }
                                updateActivity(index, 'frequency', freqStr);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isSubmitting || !title.trim() || selectedAreas.length === 0}
                      className="flex-1"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Goal'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
