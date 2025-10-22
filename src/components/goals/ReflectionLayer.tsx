import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lightbulb, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ReflectionLayerProps {
  goalTitle: string;
  children: React.ReactNode;
}

export const ReflectionLayer = ({ goalTitle, children }: ReflectionLayerProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    step1: '',
    step2: '',
    step3: ''
  });

  const questions = [
    {
      title: t('reflection.whatsDriving'),
      description: t('reflection.drivingDescription'),
      placeholder: t('reflection.drivingPlaceholder')
    },
    {
      title: t('reflection.deeperNeed'),
      description: t('reflection.deeperDescription'),
      placeholder: t('reflection.deeperPlaceholder')
    },
    {
      title: t('reflection.connectIdentity'),
      description: t('reflection.identityDescription'),
      placeholder: t('reflection.identityPlaceholder')
    }
  ];

  const currentQuestion = questions[step - 1];

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [`step${step}` as keyof typeof answers]: value
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    // Here you could save the reflection answers to the database
    // For now, we'll just close the dialog
    setIsOpen(false);
    // Reset for next time
    setTimeout(() => {
      setStep(1);
      setAnswers({ step1: '', step2: '', step3: '' });
    }, 300);
  };

  const getCurrentAnswer = () => {
    return answers[`step${step}` as keyof typeof answers];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="glass-card border-glass max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Lightbulb className="text-primary" size={20} />
            {t('reflection.exploreWhy')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(num => (
              <div
                key={num}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  num === step 
                    ? 'bg-primary text-primary-foreground' 
                    : num < step 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-accent text-muted-foreground'
                }`}
              >
                {num}
              </div>
            ))}
            <div className="flex-1 ml-2">
              <p className="text-sm text-muted-foreground">{t('reflection.stepOf').replace('{step}', step.toString())}</p>
            </div>
          </div>

          {/* Goal context */}
          <Card className="p-3 bg-accent/30">
            <p className="text-sm text-muted-foreground">{t('reflection.reflectingOn')}</p>
            <p className="font-medium text-foreground">{goalTitle}</p>
          </Card>

          {/* Current question */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                {currentQuestion.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentQuestion.description}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reflection-answer">{t('reflection.yourThoughts')}</Label>
              <Textarea
                id="reflection-answer"
                value={getCurrentAnswer()}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={currentQuestion.placeholder}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={step === 1 ? () => setIsOpen(false) : handleBack}
            >
              {step === 1 ? (
                t('common.cancel')
              ) : (
                <>
                  <ChevronLeft size={16} className="mr-1" />
                  {t('common.back')}
                </>
              )}
            </Button>

            <Button
              onClick={step === 3 ? handleFinish : handleNext}
              disabled={!getCurrentAnswer().trim()}
            >
              {step === 3 ? (
                t('reflection.completeReflection')
              ) : (
                <>
                  {t('common.next')}
                  <ChevronRight size={16} className="ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};