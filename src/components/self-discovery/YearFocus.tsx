import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Quote } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface VisionData {
  word_year?: string;
  phrase_year?: string;
}

interface YearFocusProps {
  visionData: VisionData;
  onUpdate: (updates: Partial<VisionData>) => void;
  saving: boolean;
}

export const YearFocus = ({ visionData, onUpdate, saving }: YearFocusProps) => {
  const { t } = useTranslation();
  const handleChange = (field: keyof VisionData, value: string) => {
    onUpdate({ [field]: value });
  };

  const currentYear = new Date().getFullYear();

  return (
    <Card className="gradient-card shadow-soft border-primary/20 bg-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Quote size={20} className="text-primary" />
          {t('selfDiscovery.yearFocus').replace('{year}', currentYear.toString())}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('selfDiscovery.guidingTheme')}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Word of the Year */}
        <div className="space-y-2">
          <Label htmlFor="word-year" className="text-base font-medium">
            {t('selfDiscovery.wordOfYear')}
          </Label>
          <Input
            id="word-year"
            placeholder={t('selfDiscovery.wordPlaceholder')}
            value={visionData.word_year || ''}
            onChange={(e) => handleChange('word_year', e.target.value)}
            disabled={saving}
            className="text-center text-lg font-medium bg-background/50"
          />
        </div>

        {/* Phrase of the Year */}
        <div className="space-y-2">
          <Label htmlFor="phrase-year" className="text-base font-medium">
            {t('selfDiscovery.phraseOfYear')}
          </Label>
          <Input
            id="phrase-year"
            placeholder={t('selfDiscovery.phrasePlaceholder')}
            value={visionData.phrase_year || ''}
            onChange={(e) => handleChange('phrase_year', e.target.value)}
            disabled={saving}
            className="text-center text-lg font-medium bg-background/50"
          />
        </div>

        {/* Display Quote Style */}
        {(visionData.word_year || visionData.phrase_year) && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
            <div className="text-center space-y-2">
              {visionData.word_year && (
                <div className="text-2xl font-bold text-primary">
                  {visionData.word_year}
                </div>
              )}
              {visionData.phrase_year && (
                <div className="text-lg font-medium text-muted-foreground italic">
                  "{visionData.phrase_year}"
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};