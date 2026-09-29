import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowRight, PackageCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

import { formatPriceIndian } from '../utils/price';

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      if (cart.length > 0) {
        alert('Please log in to proceed to checkout.');
        navigate('/login');
      } else {
        // If cart is empty, send user to products
        navigate('/products');
      }
    }
  }, [user]);

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    email: user ? user.email : '',
    phone: '+1 (555) 019-2831',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    country: 'United States'
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [error, setError] = useState('');

  const shippingFee = cartSubtotal >= 1000 ? 0 : 99;
  const tax = Math.round(cartSubtotal * 0.08);
  const grandTotal = cartSubtotal + shippingFee + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!user) {
      alert('Please log in to place an order.');
      navigate('/login');
      return;
    }

    setError('');
    setPlacingOrder(true);
    try {
      const orderData = {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.zipCode,
        fullName: formData.fullName
      };
      const result = await orderService.createOrder(orderData);
      setCreatedOrder(result);
      await clearCart();
    } catch (err) {
      console.error('Failed to place order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (createdOrder) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '550px', margin: '0 auto', padding: '3.5rem 2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle2 size={48} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Placed Successfully!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Thank you for shopping with ShopGen AI. Your order reference number is:
          </p>
          <div style={{ background: 'rgba(17, 24, 39, 0.8)', padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', display: 'inline-block', marginBottom: '2rem' }}>
            {createdOrder.id || createdOrder._id}
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/orders')} className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
              <PackageCheck size={18} /> View My Orders
            </button>
            <button onClick={() => navigate('/products')} className="btn-secondary" style={{ padding: '0.8rem 1.5rem' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>No items in checkout.</h2>
        <Link to="/products" className="btn-primary" style={{ marginTop: '1rem' }}>Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Checkout</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Complete your shipping & contact details to place your order.</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '2.5rem',
        alignItems: 'flex-start'
      }}>
        
        {/* Left: Shipping Form */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={20} color="var(--primary)" /> 1. Shipping Address & Contact Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Full Name *</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="input-field" />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Phone Number *</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="input-field" />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Street Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required className="input-field" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required className="input-field" />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>State *</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} required className="input-field" />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>Zip Code / Pincode *</label>
              <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} required className="input-field" />
            </div>
          </div>

          {/* Payment Method Notice */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} color="var(--ai-purple)" /> 2. Payment Method
          </h3>

          <div className="glass-card-sm" style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={24} color="var(--accent-green)" />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Simulated Test Payment (No Gateway Required)</strong>
              <div style={{ fontSize: '0.8rem' }}>Backend payment gateways will be configured in production stage.</div>
            </div>
          </div>

        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="glass-card" style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>Order Review</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.3rem' }}>
            {cart.map(item => (
              <div key={item.product.id || item.product._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem' }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Qty: {item.quantity} x {formatPriceIndian(item.product.price)}</div>
                </div>
                <div style={{ fontWeight: 700 }}>{formatPriceIndian(item.product.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text-primary)' }}>{formatPriceIndian(cartSubtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span>
              <span style={{ color: shippingFee === 0 ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                {shippingFee === 0 ? 'FREE' : formatPriceIndian(shippingFee)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax (8%)</span>
              <span style={{ color: 'var(--text-primary)' }}>{formatPriceIndian(tax)}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <span>Total</span>
              <span className="gradient-text">{formatPriceIndian(grandTotal)}</span>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={placingOrder} 
            className="btn-ai" 
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
          >
            {placingOrder ? 'Processing Order...' : 'Place Order Now'}
          </button>
        </div>

      </form>

    </div>
  );
}
