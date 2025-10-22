import React from 'react';
import { Chatbot } from './Chatbot';

// Simple test component to verify chatbot integration
export const ChatbotTest: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Chatbot Integration Test</h2>
      <p className="mb-4">The chatbot should appear as a floating button in the bottom right corner.</p>
      <Chatbot />
    </div>
  );
};
