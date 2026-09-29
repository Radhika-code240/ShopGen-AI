import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingBag, Heart, Scale, User, Menu, X,
  Bot, LogOut, PackageCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { compareList } = useCompare();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase())
      .join('') || 'U';
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.8rem 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'var(--ai-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--ai-glow)'
          }}>
            <Bot size={20} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            ShopGen <span className="gradient-text">AI</span>
          </span>
        </Link>

        <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '540px', position: 'relative' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search products or brands"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '2.7rem',
              borderRadius: 'var(--radius-full)',
              background: '#ffffff',
              fontSize: '0.9rem'
            }}
          />
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        </form>

        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/products" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Products
          </Link>

          <Link to="/compare" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <Scale size={17} />
            Compare
            {compareList.length > 0 && (
              <span style={{
                background: 'var(--primary)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px',
                fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
              }}>{compareList.length}</span>
            )}
          </Link>

          <Link to="/ai-assistant" className="btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.88rem' }}>
            AI Assistant
          </Link>

          <Link to="/profile" title="Wishlist" style={{ position: 'relative', color: 'var(--text-secondary)' }}>
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-8px', background: 'var(--accent-red)', color: '#fff',
                borderRadius: '50%', width: '16px', height: '16px', fontSize: '0.68rem', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontWeight: 700
              }}>{wishlist.length}</span>
            )}
          </Link>

          <Link to="/cart" title="Shopping Cart" style={{ position: 'relative', color: 'var(--text-primary)' }}>
            <div className="btn-icon" style={{ width: '38px', height: '38px', borderRadius: '50%' }}>
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-5px', background: 'var(--primary)', color: '#fff',
                  borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: 700
                }}>{cartCount}</span>
              )}
            </div>
          </Link>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem' }}>
                  {getInitials(user.name)}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '120%', width: '200px', background: '#ffffff',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem'
                }}>
                  <Link to="/profile" onClick={() => setUserDropdownOpen(false)} style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <User size={16} /> My Account
                  </Link>
                  <Link to="/orders" onClick={() => setUserDropdownOpen(false)} style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <PackageCheck size={16} /> My Orders
                  </Link>
                  <button onClick={() => { logout(); setUserDropdownOpen(false); }} style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--accent-red)', width: '100%', textAlign: 'left' }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.88rem' }}>
              Login
            </Link>
          )}

          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ display: 'none' }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {mobileMenuOpen && (
        <div style={{ background: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
          <Link to="/compare" onClick={() => setMobileMenuOpen(false)}>Compare Products ({compareList.length})</Link>
          <Link to="/ai-assistant" onClick={() => setMobileMenuOpen(false)}>AI Assistant</Link>
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Cart ({cartCount})</Link>
          <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
          {user ? (
            <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ color: 'var(--accent-red)', textAlign: 'left' }}>
              Logout ({user.name})
            </button>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login / Register</Link>
          )}
        </div>
      )}
    </header>
  );
}
