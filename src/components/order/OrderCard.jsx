import React, { useState } from 'react';
import { formatPriceIndian } from '../../utils/price';
import { PackageCheck, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export default function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'var(--accent-green)';
      case 'processing': return 'var(--accent-gold)';
      case 'shipped': return 'var(--primary)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Order Number</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{order.id || order._id}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Date</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={14} /> {order.date}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Amount</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{formatPriceIndian(order.totalPrice || order.totalAmount)}</div>
          </div>

          <div style={{
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: `rgba(255,255,255,0.05)`,
            border: `1px solid ${getStatusColor(order.status)}`,
            color: getStatusColor(order.status),
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            {order.status}
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {order.items.map((item, idx) => (
            <div key={item.id || item._id || idx} style={{ position: 'relative' }}>
              <img src={item.image} alt={item.name} style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
              {item.quantity > 1 && (
                <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--primary)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)' }}>
                  x{item.quantity}
                </span>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
        >
          {expanded ? <>Hide Details <ChevronUp size={16} /></> : <>View Order Details <ChevronDown size={16} /></>}
        </button>
      </div>

      {/* Expanded Details Modal/Accordion */}
      {expanded && (
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Item Breakdown</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {order.items.map((item, idx) => (
              <div key={item.id || item._id || idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>{item.name} (x{item.quantity})</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatPriceIndian(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {order.shippingAddress && (
            <div style={{ background: 'rgba(17, 24, 39, 0.5)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} color="var(--primary)" /> Shipping Address
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {order.shippingAddress.fullName ? `${order.shippingAddress.fullName} — ` : ''}
                {order.shippingAddress.street || order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode || order.shippingAddress.zipCode}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
