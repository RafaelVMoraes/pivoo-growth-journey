import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
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
    addMessage(prompt, 'user');

    console.groupCollapsed('💬 Chatbot request');
    console.log('Prompt sent:', prompt);

    try {
      console.log('Invoking Supabase function: chatbot-gemini');

      const { data, error: functionError } = await supabase.functions.invoke(
        // ✅ ensure the function name matches your deployment (case-sensitive)
        'Chatbot-gemini',
        {
          body: { prompt },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Supabase function response:', { data, functionError });

      if (functionError) throw new Error(functionError.message);

      const responseText =
        data && typeof data === 'object' && 'text' in data
          ? (data as { text: string }).text
          : '⚠️ No response text received from function';

      console.log('Parsed Gemini response text:', responseText);

      addMessage(responseText, 'assistant');
      console.log('✅ Assistant message added to chat');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unexpected error';
      console.error('❌ Error sending message:', errorMessage);
      setError(errorMessage);
      addMessage(`Sorry, I encountered an error: ${errorMessage}`, 'assistant');
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  };

  const clearChat = () => {
    console.log('🧹 Clearing chat history');
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
