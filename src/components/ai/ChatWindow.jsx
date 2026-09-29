import React from 'react';
import ChatMessage from './ChatMessage';
import AIRecommendationCard from './AIRecommendationCard';

export default function ChatWindow({ messages = [], loading = false }) {
  return <div style={{ minHeight: '340px', maxHeight: '560px', overflowY: 'auto', padding: '1rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
    {messages.map(message => <React.Fragment key={message.id}><ChatMessage message={message} /><AIRecommendationCard products={message.recommendedProducts} /></React.Fragment>)}
    {loading && <div className="badge-ai">Thinking...</div>}
  </div>;
}
