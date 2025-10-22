import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatbotResponse {
  text: string;
  error?: string;
}

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async (prompt: string): Promise<void> => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message
    addMessage(prompt, 'user');

    try {
      // Call the Supabase function
      const { data, error: functionError } = await supabase.functions.invoke('Chatbot-gemini', {
        body: { prompt }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Add assistant response
      const response = data?.text || 'No response received';
      addMessage(response, 'assistant');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      addMessage(`Sorry, I encountered an error: ${errorMessage}`, 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
};
