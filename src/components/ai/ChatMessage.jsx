import React from 'react';

export default function ChatMessage({ message }) {
  const isAI = message.sender === 'ai';
  return (
    <div style={{ display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end', marginBottom: '1rem' }}>
      <div style={{ maxWidth: '78%', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: isAI ? '#f0efff' : 'var(--primary)', color: isAI ? 'var(--text-primary)' : '#fff' }}>
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{message.text}</div>
        {message.timestamp && <small style={{ display: 'block', marginTop: '0.4rem', opacity: 0.65 }}>{message.timestamp}</small>}
      </div>
    </div>
  );
}
