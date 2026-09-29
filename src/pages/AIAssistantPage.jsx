import React, { useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import ChatWindow from '../components/ai/ChatWindow';
import ChatInput from '../components/ai/ChatInput';
import { aiService } from '../services/aiService';

const initialMessage = { id: 'welcome', sender: 'ai', text: 'Tell me what you are shopping for and I will help you find suitable products.', timestamp: '' };

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([initialMessage]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    const userMessage = { id: `msg-${Date.now()}`, sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const history = messages.map(message => ({ sender: message.sender, text: message.text }));
    setMessages(current => [...current, userMessage]);
    setLoading(true);
    try {
      const response = await aiService.sendMessage(text, history);
      setMessages(current => [...current, { ...response, id: response.id || `ai-${Date.now()}`, sender: response.sender || 'ai' }]);
    } catch (error) {
      setMessages(current => [...current, { id: `error-${Date.now()}`, sender: 'ai', text: error.message || 'The assistant is temporarily unavailable. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return <main className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '960px' }}>
    <div style={{ marginBottom: '1.5rem' }}><div className="badge-ai"><Sparkles size={14} /> Shopping assistant</div><h1 style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '2.2rem', marginTop: '0.75rem' }}><Bot size={30} color="var(--primary)" /> AI Assistant</h1><p style={{ color: 'var(--text-secondary)' }}>Get help comparing products and choosing the right option for your needs.</p></div>
    <section className="glass-card" style={{ padding: '1rem' }}><ChatWindow messages={messages} loading={loading} /><div style={{ marginTop: '1rem' }}><ChatInput onSend={sendMessage} disabled={loading} /></div></section>
  </main>;
}
