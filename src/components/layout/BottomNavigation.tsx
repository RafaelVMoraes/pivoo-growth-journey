import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: Home,
  },
  {
    id: 'goals',
    label: 'Goals',
    path: '/goals',
    icon: Target,
  },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border glass z-50">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200',
                'min-w-0 flex-1 max-w-[80px]',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-glow scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};