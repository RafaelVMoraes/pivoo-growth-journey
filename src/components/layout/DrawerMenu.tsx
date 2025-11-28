import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  LifeBuoy, 
  User, 
  Settings, 
  LogOut,
  UserPlus,
  LogIn,
  MessageSquare
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

export const DrawerMenu = ({ open, onClose }: DrawerMenuProps) => {
  const { user, isGuest, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 glass">
        <SheetHeader className="text-left">
          <SheetTitle className="bg-gradient-primary bg-clip-text text-transparent">
            {t('nav.menu')}
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-2">
          {/* Self-Discovery Section */}
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => handleNavigation('/self-discovery')}
          >
            <LifeBuoy className="mr-3 h-5 w-5" />
            {t('nav.selfDiscovery')}
          </Button>

          {/* AI Chatbot */}
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => handleNavigation('/ai-chatbot')}
          >
            <MessageSquare className="mr-3 h-5 w-5" />
            AI Chatbot
          </Button>

          <Separator className="my-4" />

          {/* Profile & Settings */}
          {(user || isGuest) && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={() => handleNavigation('/profile')}
                disabled={isGuest}
              >
                <User className="mr-3 h-5 w-5" />
                {t('nav.profile')}
                {isGuest && <span className="ml-auto text-xs text-muted-foreground">{t('nav.loginRequired')}</span>}
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={() => handleNavigation('/settings')}
              >
                <Settings className="mr-3 h-5 w-5" />
                {t('nav.settings')}
              </Button>

              <Separator className="my-4" />
            </>
          )}

          {/* Authentication Actions */}
          {user ? (
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              {t('nav.signOut')}
            </Button>
          ) : isGuest ? (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={() => handleNavigation('/auth')}
              >
                <LogIn className="mr-3 h-5 w-5" />
                {t('nav.signIn')}
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-12"
                onClick={() => handleNavigation('/auth?tab=signup')}
              >
                <UserPlus className="mr-3 h-5 w-5" />
                {t('nav.createAccount')}
              </Button>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs text-muted-foreground text-center">
            {isGuest ? t('nav.exploringAsGuest') : user ? `${t('dashboard.welcome')}, ${user.email}` : t('nav.growthJourney')}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
