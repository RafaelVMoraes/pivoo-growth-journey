import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FrequencySelectorProps {
  value: {
    type: 'daily' | 'weekly' | 'monthly';
    value?: number;
  };
  onChange: (frequency: { type: 'daily' | 'weekly' | 'monthly'; value?: number }) => void;
}

export const FrequencySelector = ({ value, onChange }: FrequencySelectorProps) => {
  const handleTypeChange = (type: 'daily' | 'weekly' | 'monthly') => {
    if (type === 'daily') {
      onChange({ type, value: 1 });
    } else {
      onChange({ type, value: value.value || 1 });
    }
  };

  const handleValueChange = (numValue: number) => {
    onChange({ ...value, value: numValue });
  };

  return (
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
  );
};