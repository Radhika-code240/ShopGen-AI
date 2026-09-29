import React from 'react';
import { Link } from 'react-router-dom';
import { formatPriceIndian } from '../../utils/price';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { product, quantity } = item;
  const itemTotal = product.price * quantity;

  return (
    <div className="glass-card-sm" style={{
      display: 'grid',
      gridTemplateColumns: '80px 1fr auto auto',
      gap: '1.25rem',
      alignItems: 'center',
      padding: '1rem 1.25rem',
      marginBottom: '1rem'
    }}>
      {/* Product Image */}
      <img 
        src={product.image} 
        alt={product.name} 
        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} 
      />

      {/* Info */}
      <div>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700 }}>
          {product.brand}
        </span>
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.2rem 0' }}>
            {product.name}
          </h4>
        </Link>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Price per item: <strong>{formatPriceIndian(product.price)}</strong>
        </div>
      </div>

      {/* Quantity Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(17, 24, 39, 0.8)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
          style={{ color: 'var(--text-secondary)', padding: '0.2rem' }}
          title="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>
          {quantity}
        </span>
        <button 
          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
          style={{ color: 'var(--text-secondary)', padding: '0.2rem' }}
          title="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Item Total & Actions */}
      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          {formatPriceIndian(itemTotal)}
        </span>
        <button 
          onClick={() => onRemove(product.id)}
          style={{ color: 'var(--accent-red)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          title="Remove item"
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>

    </div>
  );
}
