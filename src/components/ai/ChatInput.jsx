import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInput({ onSend, disabled = false }) {
  const [value, setValue] = useState('');
  const submit = event => {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
  };
  return <form onSubmit={submit} style={{ display: 'flex', gap: '0.75rem' }}><input className="input-field" value={value} onChange={event => setValue(event.target.value)} placeholder="Ask about products..." disabled={disabled} /><button type="submit" className="btn-ai" disabled={disabled} title="Send message"><Send size={17} /></button></form>;
}
