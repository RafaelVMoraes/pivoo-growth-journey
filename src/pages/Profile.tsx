import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Camera, Save, Mail, Globe, Bell, History, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HistoryArchive } from '@/components/profile/HistoryArchive';

export const Profile = () => {
  const { user, isGuest, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    language: 'en',
    notifications_enabled: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        language: profile.language || 'en',
        notifications_enabled: profile.notifications_enabled ?? true,
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'notifications_enabled') {
      setFormData(prev => ({ ...prev, [field]: value === 'true' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        language: profile.language || 'en',
        notifications_enabled: profile.notifications_enabled ?? true,
      });
    }
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logged out successfully',
        description: 'You have been signed out of your account.',
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getLanguageLabel = (lang: string) => {
    const languages = {
      en: t('language.en'),
      pt: t('language.pt'),
      fr: t('language.fr'),
    };
    return languages[lang as keyof typeof languages] || t('language.en');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isGuest) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="gradient-card shadow-card text-center py-12">
          <CardContent className="space-y-4">
            <User size={48} className="text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Profile Access</h2>
              <p className="text-muted-foreground">
                Sign up to create and customize your profile
              </p>
            </div>
            <Button onClick={() => window.location.href = '/auth'}>
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('profile.title')}</h1>
          <p className="text-muted-foreground">{t('profile.subtitle')}</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="secondary">
            {t('profile.edit')}
          </Button>
        )}
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            {t('profile.title')}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History size={16} />
            {t('nav.history')}
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield size={16} />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">

      {/* Profile Card */}
      <Card className="gradient-card shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {profile?.name ? getInitials(profile.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0"
                  disabled
                >
                  <Camera size={14} />
                </Button>
              )}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">
                {profile?.name || 'User'}
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Mail size={14} />
                {profile?.email || user?.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <User size={16} />
              Personal Information
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('profile.name')}</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-sm py-2 px-3 bg-muted/50 rounded-md">
                    {profile?.name || 'Not set'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t('profile.email')}</Label>
                <div className="flex items-center gap-2">
                  <p className="text-sm py-2 px-3 bg-muted/50 rounded-md flex-1">
                    {profile?.email || user?.email}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Globe size={16} />
              Preferences
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="language">{t('profile.language')}</Label>
              {isEditing ? (
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t('language.en')}</SelectItem>
                    <SelectItem value="pt">{t('language.pt')}</SelectItem>
                    <SelectItem value="fr">{t('language.fr')}</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm py-2 px-3 bg-muted/50 rounded-md">
                  {getLanguageLabel(profile?.language || 'en')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notifications">{t('profile.notifications')}</Label>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Enable notifications</p>
                  <p className="text-xs text-muted-foreground">Receive updates and reminders</p>
                </div>
                {isEditing ? (
                  <Switch
                    id="notifications"
                    checked={formData.notifications_enabled}
                    onCheckedChange={(checked) => handleInputChange('notifications_enabled', String(checked))}
                  />
                ) : (
                  <Badge variant={profile?.notifications_enabled ? "default" : "secondary"}>
                    {profile?.notifications_enabled ? "On" : "Off"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1"
              >
                <Save size={16} className="mr-2" />
                {isSaving ? t('profile.saving') : t('profile.save')}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleCancel}
                disabled={isSaving}
              >
                {t('profile.cancel')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="gradient-card shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Account Information</CardTitle>
          <CardDescription className="text-sm">
            Your account was created on {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
          </CardDescription>
        </CardHeader>
      </Card>
        </TabsContent>

        <TabsContent value="history">
          <HistoryArchive />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          {/* Privacy Disclaimer */}
          <Card className="gradient-card shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-primary mt-1" />
                <div className="space-y-2">
                  <h3 className="font-medium">Privacy & Data Security</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('privacy.disclaimer')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="gradient-card shadow-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Account Actions</CardTitle>
              <CardDescription>
                Manage your account and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Sign Out</p>
                  <p className="text-sm text-muted-foreground">Sign out of your account</p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  {t('settings.logout')}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" disabled>
                  {t('settings.delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;