import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Camera, Save, Mail, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Profile = () => {
  const { user, isGuest } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    language: 'en',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        language: profile.language || 'en',
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      });
    }
    setIsEditing(false);
  };

  const getLanguageLabel = (lang: string) => {
    const languages = {
      en: 'English',
      pt: 'Português',
      fr: 'Français',
    };
    return languages[lang as keyof typeof languages] || 'English';
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
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="secondary">
            Edit Profile
          </Button>
        )}
      </div>

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
                <Label htmlFor="name">Display Name</Label>
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
                <Label>Email</Label>
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
              <Label htmlFor="language">Language</Label>
              {isEditing ? (
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm py-2 px-3 bg-muted/50 rounded-md">
                  {getLanguageLabel(profile?.language || 'en')}
                </p>
              )}
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
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
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
    </div>
  );
};

export default Profile;