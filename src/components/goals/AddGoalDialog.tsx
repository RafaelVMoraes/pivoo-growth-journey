import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useGoals } from '@/hooks/useGoals';
import { useSelfDiscovery } from '@/hooks/useSelfDiscovery';
import { useTranslation } from '@/hooks/useTranslation';

interface AddGoalDialogProps {
  children: React.ReactNode;
}

export const AddGoalDialog = ({ children }: AddGoalDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [lifeWheelArea, setLifeWheelArea] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createGoal } = useGoals();
  const { lifeWheelData, valuesData } = useSelfDiscovery();
  const { t } = useTranslation();

  const lifeWheelAreas = lifeWheelData.map(item => item.area_name);
  const availableValues = valuesData.filter(value => value.selected).map(value => value.value_name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await createGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
        target_date: targetDate || undefined,
        type: 'outcome',
        status: 'active',
        life_wheel_area: lifeWheelArea || undefined,
        related_values: selectedValues.length > 0 ? selectedValues : undefined,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setTargetDate('');
      setLifeWheelArea('');
      setSelectedValues([]);
      setIsOpen(false);
    } catch (error) {
      // Error handled by useGoals hook
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

  const categories = [
    { key: 'category.personalDevelopment', value: 'Personal Development' },
    { key: 'category.healthFitness', value: 'Health & Fitness' },
    { key: 'category.career', value: 'Career' },
    { key: 'category.relationships', value: 'Relationships' },
    { key: 'category.finance', value: 'Finance' },
    { key: 'category.education', value: 'Education' },
    { key: 'category.travel', value: 'Travel' },
    { key: 'category.hobbies', value: 'Hobbies' },
    { key: 'category.other', value: 'Other' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="glass-card border-glass max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t('goal.addNew')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('goal.title')} *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('goal.enterGoal')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('goal.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('goal.describeGoal')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{t('goals.categories')}</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('goal.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.key} value={cat.value}>{t(cat.key)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">{t('goal.targetDate')}</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          {lifeWheelAreas.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="lifeWheelArea">{t('goal.lifeArea')}</Label>
              <Select value={lifeWheelArea} onValueChange={setLifeWheelArea}>
                <SelectTrigger>
                  <SelectValue placeholder={t('goal.selectLifeArea')} />
                </SelectTrigger>
                <SelectContent>
                  {lifeWheelAreas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {availableValues.length > 0 && (
            <div className="space-y-2">
              <Label>{t('goal.relatedValues')}</Label>
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

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? t('goal.creating') : t('goal.createGoal')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};