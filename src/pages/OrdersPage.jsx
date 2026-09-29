import React, { useState, useEffect } from 'react';
import { PackageCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import OrderCard from '../components/order/OrderCard';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        // Ensure user is authenticated before fetching orders
        const token = localStorage.getItem('shopgen_token');
        if (!token) {
          setOrders([]);
          setLoading(false);
          return;
        }
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem', maxWidth: '900px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Profile
        </Link>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <PackageCheck size={28} color="var(--primary)" /> My Orders History
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Track and view past electronic purchases and shipping details.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="badge-ai animate-glow">Loading order history...</div>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>No Orders Placed Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>When you complete a checkout, your orders will appear here.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

    </div>
  );
}
