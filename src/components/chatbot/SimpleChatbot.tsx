import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

export const SimpleChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  console.log('SimpleChatbot rendered, isOpen:', isOpen);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[9999]">
        <Button
          onClick={() => {
            console.log('Chatbot button clicked');
            setIsOpen(true);
          }}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-primary text-primary-foreground"
          title="Open AI Chat"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px]">
      <div className="bg-white border rounded-lg shadow-2xl h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">AI Assistant</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            ×
          </Button>
        </div>
        <div className="flex-1 p-4">
          <p>Chatbot is working! This is a test message.</p>
        </div>
      </div>
    </div>
  );
};
