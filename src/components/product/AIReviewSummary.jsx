import React from 'react';
import { Sparkles, Check, X } from 'lucide-react';

export default function AIReviewSummary({ summary }) {
  if (!summary) return null;
  return <section className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}><Sparkles size={20} color="var(--ai-purple)" /><h2 style={{ fontSize: '1.4rem' }}>AI Review Summary</h2></div>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{summary.verdict}</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
      <div className="glass-card-sm" style={{ padding: '1rem' }}><strong style={{ color: 'var(--accent-green)', display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}><Check size={16} /> Pros</strong>{(summary.pros || []).map(item => <div key={item} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>{item}</div>)}</div>
      <div className="glass-card-sm" style={{ padding: '1rem' }}><strong style={{ color: 'var(--accent-red)', display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}><X size={16} /> Cons</strong>{(summary.cons || []).map(item => <div key={item} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>{item}</div>)}</div>
    </div>
  </section>;
}
