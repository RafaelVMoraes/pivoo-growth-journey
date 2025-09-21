import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNavigation } from './BottomNavigation';
import { DrawerMenu } from './DrawerMenu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { user, isGuest } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Only show layout for authenticated users or guests
  if (!user && !isGuest) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Pivoo
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="p-2"
          >
            <Menu size={20} />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Drawer Menu */}
      <DrawerMenu 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
      />
    </div>
  );
};