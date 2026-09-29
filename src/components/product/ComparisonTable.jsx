import React from 'react';
import { formatPriceIndian } from '../../utils/price';

export default function ComparisonTable({ products = [] }) {
  if (!products.length) return null;
  const specificationKeys = [...new Set(products.flatMap(product => Object.keys(product.specifications || {})))];
  return <div className="glass-card" style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '620px' }}><thead><tr><th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Feature</th>{products.map(product => <th key={product.id || product._id} style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>{product.name}</th>)}</tr></thead><tbody><tr><td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>Price</td>{products.map(product => <td key={product.id || product._id} style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{formatPriceIndian(product.price)}</td>)}</tr><tr><td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>Rating</td>{products.map(product => <td key={product.id || product._id} style={{ padding: '0.85rem 1rem' }}>{product.rating || 'Not rated'}</td>)}</tr>{specificationKeys.map(key => <tr key={key}><td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{key}</td>{products.map(product => <td key={product.id || product._id} style={{ padding: '0.85rem 1rem' }}>{product.specifications?.[key] || '-'}</td>)}</tr>)}</tbody></table></div>;
}
