import React from 'react';
import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid var(--border-color)',
      marginTop: '4rem',
      paddingTop: '3rem',
      paddingBottom: '2rem'
    }}>
      <div className="container" style={{ display: 'grid', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--ai-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>ShopGen <span className="gradient-text">AI</span></span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem', maxWidth: '280px' }}>
              Simple, practical shopping for electronics and tech essentials.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/ai-assistant">AI Assistant</Link></li>
              <li><Link to="/compare">Compare</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.8rem' }}>Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/products?category=laptops">Laptops & PCs</Link></li>
              <li><Link to="/products?category=smartphones">Smartphones</Link></li>
              <li><Link to="/products?category=headphones">Audio</Link></li>
              <li><Link to="/products?category=smartwatches">Smartwatches</Link></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          © {new Date().getFullYear()} ShopGen AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
