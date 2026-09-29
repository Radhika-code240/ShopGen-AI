import React from 'react';
import ProductCard from '../product/ProductCard';

export default function AIRecommendationCard({ products = [] }) {
  if (!products.length) return null;
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginTop: '1rem' }}>{products.map(product => <ProductCard key={product.id || product._id} product={{ ...product, id: product.id || product._id }} />)}</div>;
}
