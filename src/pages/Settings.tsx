import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Moon, 
  Download,
  Trash,
  AlertTriangle
} from 'lucide-react';

export const Settings = () => {
  const { user, isGuest } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your Pivoo experience</p>
      </div>

      {/* Notifications */}
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive updates and reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Notification preferences will be available soon
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Moon size={18} className="text-primary" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Theme settings and customization options coming soon
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Control your data and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Data Export</p>
                <p className="text-xs text-muted-foreground">Download your personal data</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                <Download size={14} className="mr-2" />
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Account Deletion</p>
                <p className="text-xs text-muted-foreground">Permanently delete your account</p>
              </div>
              <Button variant="outline" size="sm" disabled className="text-destructive hover:text-destructive">
                <Trash size={14} className="mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="gradient-card shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <SettingsIcon size={16} className="text-primary" />
            App Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Version</span>
            <Badge variant="secondary">1.0.0 Beta</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="secondary">Development</Badge>
          </div>
        </CardContent>
      </Card>

      {isGuest && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle size={20} className="text-orange-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Limited Guest Access
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  Some settings require an account. Create one to unlock full functionality.
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