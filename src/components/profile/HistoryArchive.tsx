import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useHistory, YearArchive } from '@/hooks/useHistory';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Calendar, 
  Target, 
  Award, 
  BookOpen, 
  Lightbulb,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useState } from 'react';

interface HistoryArchiveProps {}

export const HistoryArchive = ({}: HistoryArchiveProps) => {
  const { yearArchives, loading, createOrUpdateHistory } = useHistory();
  const { t } = useTranslation();
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [editingSummary, setEditingSummary] = useState('');

  const handleEditSummary = (archive: YearArchive) => {
    setEditingYear(archive.year);
    setEditingSummary(archive.history?.summary || '');
  };

  const handleSaveSummary = async (year: number) => {
    await createOrUpdateHistory(year, { summary: editingSummary });
    setEditingYear(null);
    setEditingSummary('');
  };

  const handleCancelEdit = () => {
    setEditingYear(null);
    setEditingSummary('');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (yearArchives.length === 0) {
    return (
      <Card className="gradient-card shadow-soft">
        <CardContent className="py-12 text-center">
          <BookOpen size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">{t('history.noData')}</h3>
          <p className="text-muted-foreground text-sm">
            {t('history.completeGoals')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('history.title')}</h2>
        <p className="text-muted-foreground text-sm">{t('history.subtitle')}</p>
      </div>

      <div className="space-y-4">
        {yearArchives.map((archive) => (
          <Card key={archive.year} className="gradient-card shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar size={18} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{archive.year}</CardTitle>
                    <CardDescription>
                      {archive.goals.total > 0 && (
                        <span>{archive.goals.completed} {t('history.goalsCompleted').replace('{total}', archive.goals.total.toString())}</span>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  {archive.goals.total > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Target size={12} />
                      {Math.round((archive.goals.completed / archive.goals.total) * 100)}% Complete
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Vision Section */}
              {(archive.vision?.word_year || archive.vision?.phrase_year) && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Lightbulb size={16} className="text-primary" />
                    {t('history.visionFor')} {archive.year}
                  </h4>
                  <div className="space-y-2">
                    {archive.vision.word_year && (
                      <div>
                        <span className="text-sm text-muted-foreground">{t('history.word')}: </span>
                        <Badge variant="outline">{archive.vision.word_year}</Badge>
                      </div>
                    )}
                    {archive.vision.phrase_year && (
                      <div>
                        <span className="text-sm text-muted-foreground">{t('history.phrase')}: </span>
                        <span className="text-sm font-medium">{archive.vision.phrase_year}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Goals Summary */}
              {archive.goals.archivedGoals.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Award size={16} className="text-success" />
                    {t('history.completedGoals')}
                  </h4>
                  <div className="space-y-2">
                    {archive.goals.archivedGoals.slice(0, 3).map((goal, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{goal.title}</span>
                        {goal.description && (
                          <p className="text-muted-foreground text-xs mt-1">{goal.description}</p>
                        )}
                      </div>
                    ))}
                    {archive.goals.archivedGoals.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        {t('history.moreGoals').replace('{count}', (archive.goals.archivedGoals.length - 3).toString())}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Year Summary */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <BookOpen size={16} className="text-primary" />
                    {t('history.yearSummary')}
                  </h4>
                  {editingYear !== archive.year && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSummary(archive)}
                    >
                      <Edit size={14} />
                    </Button>
                  )}
                </div>
                
                {editingYear === archive.year ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editingSummary}
                      onChange={(e) => setEditingSummary(e.target.value)}
                      placeholder={t('history.summaryPlaceholder')}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveSummary(archive.year)}
                      >
                        <Save size={14} className="mr-2" />
                        {t('common.save')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        <X size={14} className="mr-2" />
                        {t('common.cancel')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {archive.history?.summary ? (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {archive.history.summary}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        {t('history.noSummary')} {archive.year}.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};