import React, { useState } from 'react';

export const TestChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  console.log('TestChatbot rendered, isOpen:', isOpen);

  if (!isOpen) {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#3b82f6',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontSize: '24px'
        }}
        onClick={() => {
          console.log('Test chatbot button clicked');
          setIsOpen(true);
        }}
        title="Open AI Chat"
      >
        🤖
      </div>
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        width: '400px',
        height: '600px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div 
        style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <h3 style={{ margin: 0, fontWeight: '600' }}>AI Assistant</h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>
      <div style={{ flex: 1, padding: '16px' }}>
        <p>Test chatbot is working! This is a simple test message.</p>
      </div>
    </div>
  );
};
