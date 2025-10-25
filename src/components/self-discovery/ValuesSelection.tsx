import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

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
  const { t } = useTranslation();
  const selectedValues = valuesData.filter(v => v.selected);
  const unselectedValues = valuesData.filter(v => !v.selected);

  // Define colors for each category
  const categoryColors: Record<string, { bg: string, text: string, border: string }> = {
    'Growth': { bg: 'bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
    'Freedom': { bg: 'bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
    'Connection': { bg: 'bg-pink-500/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-500/30' },
    'Creativity': { bg: 'bg-orange-500/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/30' },
    'Stability': { bg: 'bg-green-500/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-500/30' }
  };

  // Get category for a value
  const getCategoryForValue = (valueName: string): string => {
    for (const [category, values] of Object.entries(categories)) {
      if (values.includes(valueName)) return category;
    }
    return 'Growth'; // fallback
  };

  const handleValueClick = (valueName: string, currentSelected: boolean) => {
    onUpdate(valueName, !currentSelected);
  };

  return (
    <Card className="gradient-card shadow-soft">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t('selfDiscovery.coreValues')}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('selfDiscovery.selectValues')}
        </p>
        <div className="text-sm font-medium text-primary">
          {t('selfDiscovery.selectedCount').replace('{count}', selectedCount.toString())}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Values */}
        {selectedValues.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-base flex items-center gap-2">
              <Check size={16} className="text-primary" />
              {t('selfDiscovery.selectedValues')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedValues.map((value) => {
                const category = getCategoryForValue(value.value_name);
                const colors = categoryColors[category];
                return (
                  <Button
                    key={value.value_name}
                    variant="outline"
                    size="sm"
                    onClick={() => handleValueClick(value.value_name, value.selected)}
                    disabled={saving}
                    className={`animate-scale-in hover:animate-none ${colors.bg} ${colors.text} ${colors.border} border-2 font-medium`}
                  >
                    {value.value_name}
                    <Check size={14} className="ml-1" />
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Values by Category */}
        <div className="space-y-4">
          <h4 className="font-medium text-base">{t('selfDiscovery.chooseFromValues')}</h4>
          
          {Object.entries(categories).map(([category, categoryValues]) => {
            const colors = categoryColors[category];
            return (
              <div key={category} className="space-y-2">
                <h5 className={`text-sm font-semibold ${colors.text}`}>{category}</h5>
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
                        className={`justify-start text-left h-auto py-2 px-3 ${colors.border} border hover:${colors.bg} transition-all`}
                      >
                        {valueName}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};