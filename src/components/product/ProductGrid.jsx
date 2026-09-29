import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products = [], loading = false }) {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card" style={{ height: '380px', opacity: 0.5, animation: 'pulseGlow 1.5s infinite alternate' }} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', width: '100%' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>No matching products found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try clearing filters or searching for another key spec.</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '1.5rem',
      width: '100%'
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
