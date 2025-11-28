import { useState } from 'react';
import { useChatbot } from '@/hooks/useChatbot';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Brain, Target, TrendingUp, Calendar, Award, BarChart } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Module {
  id: string;
  title: string;
  description: string;
  initialPrompt: string;
  icon: React.ReactNode;
}

const modules: Module[] = [
  {
    id: 'workload',
    title: 'Workload Analysis',
    description: 'Evaluates current workload, prioritization, deadlines, and life balance.',
    initialPrompt: 'Analyze my current workload considering urgency, impact, available time, and personal–professional balance. Identify overload risks, tasks that can be delegated, postponed, removed, or re-prioritized.',
    icon: <BarChart className="h-6 w-6" />
  },
  {
    id: 'goals-areas',
    title: 'Goals vs. Life Areas Analysis',
    description: 'Analyzes how goals connect with life-wheel areas and balance.',
    initialPrompt: 'Analyze my goals in relation to my life areas. Identify imbalances, neglected domains, excess focus zones, and propose improvements.',
    icon: <Target className="h-6 w-6" />
  },
  {
    id: 'goal-deepdive',
    title: 'Specific Goal Deep-Dive',
    description: 'Analyzes clarity, structure, feasibility, KPIs, and risks of a single goal.',
    initialPrompt: "Let's analyze a specific goal. Evaluate clarity, feasibility, KPIs, risks, required resources, and alignment with my priorities.",
    icon: <Brain className="h-6 w-6" />
  },
  {
    id: 'progress-review',
    title: 'Weekly & Monthly Progress Review',
    description: 'Evaluates execution consistency, task completion, and next steps.',
    initialPrompt: 'Provide a weekly and monthly progress review. Highlight wins, weaknesses, deviations, and give clear recommendations for improvement.',
    icon: <TrendingUp className="h-6 w-6" />
  },
  {
    id: 'annual-review',
    title: 'Annual Progress Review',
    description: 'Macro-level reflection on evolution, maturity, obstacles, and direction.',
    initialPrompt: 'Perform a full annual progress review considering evolution, learnings, habits formed, obstacles faced, and strategic suggestions for the next cycle.',
    icon: <Award className="h-6 w-6" />
  }
];

const AIChatbot = () => {
  const { t } = useTranslation();
  const { messages, isLoading, sendMessage, clearChat } = useChatbot();
  const [inputValue, setInputValue] = useState('');
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const handleModuleClick = async (module: Module) => {
    clearChat();
    setActiveModule(module.id);
    await sendMessage(module.initialPrompt);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          AI Assistant
        </h1>
        <p className="text-muted-foreground mt-2">
          Quick analysis modules for guided insights
        </p>
      </div>

      {/* Modules Section */}
      {messages.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => (
            <Card 
              key={module.id}
              className="cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-105"
              onClick={() => handleModuleClick(module)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {module.icon}
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{module.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Chat Window */}
      {messages.length > 0 && (
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>
                {activeModule && modules.find(m => m.id === activeModule)?.title}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => { clearChat(); setActiveModule(null); }}>
              New Analysis
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'glass-card'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="glass-card rounded-lg p-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Continue the conversation..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                className="h-[60px] w-[60px] shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIChatbot;
