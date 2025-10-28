import { Badge } from '@/components/ui/badge';
import { Goal } from '@/hooks/useGoals';

interface StatusTabsProps {
  value: 'active' | 'completed' | 'archived';
  onChange: (value: 'active' | 'completed' | 'archived') => void;
  goals: Goal[];
}

export const StatusTabs = ({ value, onChange, goals }: StatusTabsProps) => {
  const activeCount = goals.filter(g => g.status === 'active' || g.status === 'in_progress').length;
  const completedCount = goals.filter(g => g.status === 'completed').length;
  const archivedCount = goals.filter(g => g.status === 'archived').length;

  const tabs = [
    { id: 'active' as const, label: 'Active', count: activeCount, color: 'text-purple-600' },
    { id: 'completed' as const, label: 'Completed', count: completedCount, color: 'text-green-600' },
    { id: 'archived' as const, label: 'Archived', count: archivedCount, color: 'text-muted-foreground' },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-border pb-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            px-4 py-2 rounded-t-lg transition-all min-h-[44px]
            ${value === tab.id 
              ? 'bg-accent border-b-2 border-primary font-medium' 
              : 'hover:bg-accent/50'
            }
          `}
        >
          <span className={value === tab.id ? tab.color : 'text-muted-foreground'}>
            {tab.label}
          </span>
          <Badge variant="outline" className="ml-2 bg-background">
            {tab.count}
          </Badge>
        </button>
      ))}
    </div>
  );
};
