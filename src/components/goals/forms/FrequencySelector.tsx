import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export interface FrequencySelectorProps {
  value: {
    type: 'daily' | 'weekly' | 'monthly';
    value?: number;
    timeOfDay?: 'morning' | 'afternoon' | 'night';
    daysOfWeek?: string[];
    dayOfMonth?: number;
  };
  onChange: (value: FrequencySelectorProps['value']) => void;
}

export const FrequencySelector = ({ value, onChange }: FrequencySelectorProps) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    const currentDays = value.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    onChange({ ...value, daysOfWeek: newDays });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm">Frequency Type</Label>
          <Select
            value={value.type}
            onValueChange={(type: 'daily' | 'weekly' | 'monthly') =>
              onChange({ ...value, type, value: type === 'daily' ? undefined : value.value || 3 })
            }
          >
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

        {value.type !== 'daily' && (
          <div className="space-y-2">
            <Label className="text-sm">
              {value.type === 'weekly' ? 'Times per week' : 'Times per month'}
            </Label>
            <Input
              type="number"
              min="1"
              max={value.type === 'weekly' ? '7' : '31'}
              value={value.value || ''}
              onChange={(e) => onChange({ ...value, value: parseInt(e.target.value) || 1 })}
              className="min-h-[44px]"
            />
          </div>
        )}
      </div>

      {/* Daily - Time of Day */}
      {value.type === 'daily' && (
        <div className="space-y-2">
          <Label className="text-sm">Time of Day</Label>
          <Select
            value={value.timeOfDay || ''}
            onValueChange={(time: 'morning' | 'afternoon' | 'night') =>
              onChange({ ...value, timeOfDay: time })
            }
          >
            <SelectTrigger className="min-h-[44px]">
              <SelectValue placeholder="Select time of day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="night">Night</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Weekly - Days of Week */}
      {value.type === 'weekly' && (
        <div className="space-y-2">
          <Label className="text-sm">Specific Days (optional)</Label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map(day => (
              <Badge
                key={day}
                variant={(value.daysOfWeek || []).includes(day) ? 'default' : 'outline'}
                className="cursor-pointer hover:scale-105 transition-transform px-3 py-1"
                onClick={() => toggleDay(day)}
              >
                {day.substring(0, 3)}
                {(value.daysOfWeek || []).includes(day) && <X size={12} className="ml-1" />}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Monthly - Day of Month */}
      {value.type === 'monthly' && (
        <div className="space-y-2">
          <Label className="text-sm">Day of Month (optional)</Label>
          <Input
            type="number"
            min="1"
            max="31"
            value={value.dayOfMonth || ''}
            onChange={(e) => onChange({ ...value, dayOfMonth: parseInt(e.target.value) || undefined })}
            placeholder="e.g., 15"
            className="min-h-[44px]"
          />
        </div>
      )}
    </div>
  );
};
