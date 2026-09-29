import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Trash2 } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import ComparisonTable from '../components/product/ComparisonTable';

export default function ComparisonPage() {
  const { compareList, toggleCompare } = useCompare();
  return <main className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}><div><h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '2.2rem' }}><Scale size={30} color="var(--primary)" /> Compare Products</h1><p style={{ color: 'var(--text-secondary)' }}>Review important specifications side by side.</p></div>{compareList.length > 0 && <button className="btn-secondary" onClick={() => compareList.forEach(toggleCompare)}><Trash2 size={16} /> Clear Comparison</button>}</div>
    {compareList.length < 2 ? <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}><h2>Add at least two products to compare</h2><p style={{ color: 'var(--text-secondary)', margin: '0.6rem 0 1.5rem' }}>Choose products from the catalog to see their specifications together.</p><Link to="/products" className="btn-primary">Browse Products</Link></div> : <ComparisonTable products={compareList} />}
  </main>;
}
