import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface FrequencySelectorProps {
  value: {
    type: 'daily' | 'weekly' | 'monthly';
    value?: number;
    timeOfDay?: 'morning' | 'afternoon' | 'night';
    daysOfWeek?: string[];
    dayOfMonth?: number;
  };
  onChange: (frequency: { 
    type: 'daily' | 'weekly' | 'monthly'; 
    value?: number;
    timeOfDay?: 'morning' | 'afternoon' | 'night';
    daysOfWeek?: string[];
    dayOfMonth?: number;
  }) => void;
}

export const FrequencySelector = ({ value, onChange }: FrequencySelectorProps) => {
  const daysOfWeekOptions = [
    { value: 'monday', label: 'M' },
    { value: 'tuesday', label: 'T' },
    { value: 'wednesday', label: 'W' },
    { value: 'thursday', label: 'T' },
    { value: 'friday', label: 'F' },
    { value: 'saturday', label: 'S' },
    { value: 'sunday', label: 'S' }
  ];

  const handleTypeChange = (type: 'daily' | 'weekly' | 'monthly') => {
    if (type === 'daily') {
      onChange({ type, value: 1, timeOfDay: undefined, daysOfWeek: undefined, dayOfMonth: undefined });
    } else if (type === 'weekly') {
      onChange({ type, value: value.value || 1, daysOfWeek: [], timeOfDay: undefined, dayOfMonth: undefined });
    } else {
      onChange({ type, value: value.value || 1, dayOfMonth: 1, timeOfDay: undefined, daysOfWeek: undefined });
    }
  };

  const handleValueChange = (numValue: number) => {
    onChange({ ...value, value: numValue });
  };

  const handleTimeOfDayChange = (timeOfDay: 'morning' | 'afternoon' | 'night') => {
    onChange({ ...value, timeOfDay });
  };

  const toggleDayOfWeek = (day: string) => {
    const currentDays = value.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    onChange({ ...value, daysOfWeek: newDays });
  };

  const handleDayOfMonthChange = (day: number) => {
    onChange({ ...value, dayOfMonth: day });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <div className="flex-1 min-w-[120px]">
          <Label className="text-sm">Frequency</Label>
          <Select value={value.type} onValueChange={handleTypeChange}>
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
          <div className="w-20">
            <Label className="text-sm">Times</Label>
            <Input
              type="number"
              min="1"
              max="30"
              value={value.value || 1}
              onChange={(e) => handleValueChange(parseInt(e.target.value) || 1)}
              className="min-h-[44px]"
              aria-label="Number of times"
            />
          </div>
        )}
      </div>

      {/* Daily: Time of day selector */}
      {value.type === 'daily' && (
        <div>
          <Label className="text-sm mb-2 block">Time of Day</Label>
          <div className="flex gap-2">
            {(['morning', 'afternoon', 'night'] as const).map(time => (
              <Badge
                key={time}
                variant={value.timeOfDay === time ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 capitalize"
                onClick={() => handleTimeOfDayChange(time)}
              >
                {time}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Weekly: Days of week selector */}
      {value.type === 'weekly' && (
        <div>
          <Label className="text-sm mb-2 block">Days of Week</Label>
          <div className="flex gap-2">
            {daysOfWeekOptions.map(day => (
              <Badge
                key={day.value}
                variant={value.daysOfWeek?.includes(day.value) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 w-8 h-8 flex items-center justify-center p-0"
                onClick={() => toggleDayOfWeek(day.value)}
              >
                {day.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Monthly: Day of month selector */}
      {value.type === 'monthly' && (
        <div>
          <Label className="text-sm mb-2 block">Day of Month</Label>
          <Input
            type="number"
            min="1"
            max="31"
            value={value.dayOfMonth || 1}
            onChange={(e) => handleDayOfMonthChange(parseInt(e.target.value) || 1)}
            className="min-h-[44px]"
            placeholder="Day (1-31)"
          />
        </div>
      )}
    </div>
  );
};