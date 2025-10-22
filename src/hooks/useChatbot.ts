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
    setMessages((prev) => [...prev, newMessage]);
  };

  const sendMessage = async (prompt: string): Promise<void> => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message
    addMessage(prompt, 'user');

    try {
      // Call the Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke(
        'Chatbot-gemini',
        {
          body: { prompt },
          headers: {
            'Content-Type': 'application/json', // ensure JSON is sent
          },
        }
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      // Some Edge Functions return 'text' directly, some wrap in data
      const responseText =
        (data && typeof data === 'object' && 'text' in data
          ? (data as { text: string }).text
          : 'No response received');

      addMessage(responseText, 'assistant');
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
