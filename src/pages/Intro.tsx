import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-growth.jpg';

export const Intro = () => {
  const navigate = useNavigate();
  const { setGuestMode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestMode = async () => {
    setIsLoading(true);
    setGuestMode(true);
    
    // Small delay for smooth transition
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md mx-auto text-center space-y-8 animate-fade-in">
          {/* Hero Image */}
          <div className="relative">
            <img
              src={heroImage}
              alt="Personal growth journey"
              className="w-48 h-36 object-cover rounded-3xl shadow-card mx-auto"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-glow">
              <Sparkles size={16} className="text-primary-foreground" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Pivoo
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your space of clarity and growth. Track your journey, set meaningful goals, and discover your authentic self.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-8">
            <Button
              onClick={handleGuestMode}
              disabled={isLoading}
              className="w-full h-12 text-base font-medium shadow-soft hover:shadow-glow transition-all duration-200"
            >
              {isLoading ? (
                "Getting started..."
              ) : (
                <>
                  Start Exploring
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={handleSignIn}
              className="w-full h-12 text-base font-medium"
            >
              I already have an account
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8">
        <p className="text-center text-sm text-muted-foreground">
          Continue as guest to explore, or create an account to save your progress
        </p>
      </div>
    </div>
  );
};

export default Intro;