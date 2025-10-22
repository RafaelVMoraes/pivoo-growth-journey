import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Moon, 
  Download,
  Trash,
  AlertTriangle,
  LogOut
} from 'lucide-react';

export const Settings = () => {
  const { user, isGuest, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!profile) return;
    
    try {
      await updateProfile({ notifications_enabled: enabled });
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: t('common.loggedOutSuccessfully'),
        description: t('common.loggedOutDesc'),
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: t('common.error'),
        description: t('common.failedLogout'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.subtitle')}</p>
      </div>

      {/* Notifications */}
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            {t('settings.notifications.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.notifications.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isGuest && profile ? (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">{t('common.enableNotifications')}</p>
                <p className="text-sm text-muted-foreground">{t('common.receiveUpdates')}</p>
              </div>
              <Switch
                checked={profile.notifications_enabled ?? true}
                onCheckedChange={handleNotificationToggle}
              />
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.signInDescription')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon size={18} className="text-primary" />
            {t('settings.appearance')}
          </CardTitle>
          <CardDescription>
            {t('settings.appearanceDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t('settings.themeComingSoon')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            {t('settings.privacy.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.privacy.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('privacy.disclaimer')}
            </p>
          </div>
          
          <div className="space-y-3">
            {!isGuest && (
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                <p className="text-sm font-medium">{t('settings.logout')}</p>
                <p className="text-xs text-muted-foreground">{t('common.signOutAccount')}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut size={14} className="mr-2" />
                  {t('settings.logout')}
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">{t('settings.export')}</p>
                <p className="text-xs text-muted-foreground">{t('settings.downloadData')}</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                <Download size={14} className="mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-destructive">{t('settings.delete')}</p>
                <p className="text-xs text-muted-foreground">{t('settings.permanentlyDeleteAccount')}</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={isGuest}>
                    <Trash size={14} className="mr-2" />
                    {t('settings.delete')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="gradient-card shadow-soft">
        <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
            <SettingsIcon size={16} className="text-primary" />
            {t('settings.appInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('settings.version')}</span>
            <Badge variant="secondary">1.0.0 Beta</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('settings.status')}</span>
            <Badge variant="secondary">{t('settings.development')}</Badge>
          </div>
        </CardContent>
      </Card>

      {isGuest && (
        <Card className="glass-card bg-warning/10 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle size={20} className="text-warning mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {t('settings.limitedGuestAccess')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('settings.guestAccessDesc')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;