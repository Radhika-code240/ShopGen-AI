import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPriceIndian } from '../utils/price';
import CartItem from '../components/cart/CartItem';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartSubtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SHOPGEN10') {
      setDiscount(Math.round(cartSubtotal * 0.10));
      setPromoApplied(true);
    } else {
      alert('Invalid Promo Code. Try "SHOPGEN10" for 10% off.');
    }
  };

  const shippingFee = cartSubtotal >= 1000 ? 0 : 99;
  const tax = Math.round(cartSubtotal * 0.08);
  const grandTotal = cartSubtotal - discount + shippingFee + tax;

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3.5rem 2rem' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
            <ShoppingBag size={36} />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Looks like you haven't added any products to your cart yet. Explore our AI-curated catalog to find tech deals!
          </p>
          <Link to="/products" className="btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Shopping Cart</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review your items and proceed to checkout.</p>
        </div>
        <button onClick={clearCart} style={{ color: 'var(--accent-red)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Trash2 size={16} /> Clear All Items
        </button>
      </div>

      {/* Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: '2.5rem',
        alignItems: 'flex-start'
      }}>
        
        {/* Cart Items List */}
        <div>
          {/* Free Shipping Progress Indicator */}
          <div className="glass-card-sm" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Truck size={20} color="var(--accent-green)" />
            <div style={{ fontSize: '0.9rem' }}>
              {cartSubtotal >= 1000 ? (
                <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>
                  🎉 You qualify for FREE Express Shipping!
                </span>
              ) : (
                <span>Add <strong>{formatPriceIndian(1000 - cartSubtotal)}</strong> more to qualify for Free Shipping!</span>
              )}
            </div>
          </div>

          {/* Items Loop */}
          {cart.map(item => (
            <CartItem 
              key={item.product.id} 
              item={item} 
              onUpdateQuantity={updateQuantity} 
              onRemove={removeFromCart} 
            />
          ))}

          <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '1rem' }}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="glass-card" style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatPriceIndian(cartSubtotal)}</span>
            </div>

            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-green)' }}>
                <span>Promo Discount (SHOPGEN10)</span>
                <span>-{formatPriceIndian(discount)}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated Shipping</span>
                <span style={{ color: shippingFee === 0 ? 'var(--accent-green)' : 'var(--text-primary)', fontWeight: 600 }}>
                {shippingFee === 0 ? 'FREE' : formatPriceIndian(shippingFee)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Estimated Tax (8%)</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatPriceIndian(tax)}</span>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <span>Total Amount</span>
              <span className="gradient-text">{formatPriceIndian(grandTotal)}</span>
            </div>
          </div>

          {/* Promo Form */}
          <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              placeholder="Promo Code (e.g. SHOPGEN10)" 
              className="input-field"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={promoApplied}
              style={{ fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn-secondary" disabled={promoApplied} style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}>
              Apply
            </button>
          </form>


          <button 
            onClick={() => navigate('/checkout')}
            className="btn-ai"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>

      </div>

    </div>
  );
}
