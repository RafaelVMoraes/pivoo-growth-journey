import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { useCheckIns } from '@/hooks/useCheckIns';
import { useTranslation } from '@/hooks/useTranslation';

interface CheckInFormProps {
  goalId: string;
  activityId?: string;
}

export const CheckInForm = ({ goalId, activityId }: CheckInFormProps) => {
  const { checkIns, isLoading, createCheckIn } = useCheckIns(goalId, activityId);
  const { t } = useTranslation();
  const [inputType, setInputType] = useState<'numeric' | 'checkbox' | 'percentage'>('checkbox');
  const [progressValue, setProgressValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let value = progressValue;
    if (inputType === 'checkbox') {
      value = 'true'; // Always true when submitted
    }

    if (!value.trim()) return;

    setIsSubmitting(true);
    try {
      await createCheckIn({
        goal_id: goalId,
        activity_id: activityId,
        progress_value: value,
        input_type: inputType,
        date: new Date().toISOString()
      });
      setProgressValue('');
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCheckInValue = (checkIn: any) => {
    switch (checkIn.input_type) {
      case 'percentage':
        return `${checkIn.progress_value}%`;
      case 'checkbox':
        return checkIn.progress_value === 'true' ? `✓ ${t('checkin.done')}` : `✗ ${t('checkin.notDone')}`;
      default:
        return checkIn.progress_value;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">{t('checkin.progressTracking')}</h4>
        <TrendingUp size={16} className="text-primary" />
      </div>

      {/* Check-in form */}
      <Card className="p-4 bg-accent/30">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <Select value={inputType} onValueChange={(value: any) => setInputType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checkbox">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    {t('checkin.doneNotDone')}
                  </div>
                </SelectItem>
                <SelectItem value="numeric">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} />
                    {t('checkin.number')}
                  </div>
                </SelectItem>
                <SelectItem value="percentage">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {t('checkin.percentage')}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {inputType === 'checkbox' ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                <CheckCircle size={14} className="mr-1" />
                {isSubmitting ? t('checkin.recording') : t('checkin.markAsDone')}
              </Button>
            ) : (
              <>
                <Input
                  value={progressValue}
                  onChange={(e) => setProgressValue(e.target.value)}
                  placeholder={inputType === 'percentage' ? '0-100' : t('checkin.enterValue')}
                  type={inputType === 'percentage' ? 'number' : 'text'}
                  min={inputType === 'percentage' ? '0' : undefined}
                  max={inputType === 'percentage' ? '100' : undefined}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !progressValue.trim()}
                >
                  {isSubmitting ? t('checkin.recording') : t('checkin.record')}
                </Button>
              </>
            )}
          </div>
        </form>
      </Card>

      {/* Recent check-ins */}
      {checkIns.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('checkin.recentProgress')}</Label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {checkIns.slice(0, 5).map(checkIn => (
              <div key={checkIn.id} className="flex items-center justify-between text-sm p-2 bg-accent/20 rounded">
                <span className="text-foreground font-medium">
                  {formatCheckInValue(checkIn)}
                </span>
                <span className="text-muted-foreground text-xs">
                  {formatDate(checkIn.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};