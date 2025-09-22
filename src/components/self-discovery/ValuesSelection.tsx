import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ValuesData {
  value_name: string;
  selected: boolean;
}

interface ValuesSelectionProps {
  valuesData: ValuesData[];
  selectedCount: number;
  onUpdate: (valueName: string, selected: boolean) => void;
  categories: Record<string, string[]>;
  saving: boolean;
}

export const ValuesSelection = ({ 
  valuesData, 
  selectedCount, 
  onUpdate, 
  categories, 
  saving 
}: ValuesSelectionProps) => {
  const selectedValues = valuesData.filter(v => v.selected);
  const unselectedValues = valuesData.filter(v => !v.selected);

  const handleValueClick = (valueName: string, currentSelected: boolean) => {
    onUpdate(valueName, !currentSelected);
  };

  return (
    <Card className="gradient-card shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Your Core Values</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select 5-7 values that resonate most with you
        </p>
        <div className="text-sm font-medium text-primary">
          You have selected {selectedCount} out of 7 values
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Values */}
        {selectedValues.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-base flex items-center gap-2">
              <Check size={16} className="text-primary" />
              Your Selected Values
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((value) => (
                <Button
                  key={value.value_name}
                  variant="default"
                  size="sm"
                  onClick={() => handleValueClick(value.value_name, value.selected)}
                  disabled={saving}
                  className="animate-pulse hover:animate-none"
                >
                  {value.value_name}
                  <Check size={14} className="ml-1" />
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Available Values by Category */}
        <div className="space-y-4">
          <h4 className="font-medium text-base">Choose from these values:</h4>
          
          {Object.entries(categories).map(([category, categoryValues]) => (
            <div key={category} className="space-y-2">
              <h5 className="text-sm font-medium text-muted-foreground">{category}</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categoryValues.map((valueName) => {
                  const valueData = unselectedValues.find(v => v.value_name === valueName);
                  if (!valueData) return null;
                  
                  return (
                    <Button
                      key={valueName}
                      variant="outline"
                      size="sm"
                      onClick={() => handleValueClick(valueName, valueData.selected)}
                      disabled={saving || (selectedCount >= 7 && !valueData.selected)}
                      className="justify-start text-left h-auto py-2 px-3 hover:animate-pulse"
                    >
                      {valueName}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};