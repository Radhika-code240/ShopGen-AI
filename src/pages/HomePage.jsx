import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Headphones, Home, Laptop, Search, Smartphone, Sparkles, Tablet, Watch } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { productService } from '../services/productService';
import ProductCard from '../components/product/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const all = await productService.getProducts();
      const featured = all.filter(p => p.isFeatured);
      const topRated = all.filter(p => p.isTopRated);
      setFeaturedProducts((featured.length ? featured : all).slice(0, 4));
      setTopRatedProducts((topRated.length ? topRated : [...all].sort((a, b) => b.rating - a.rating)).slice(0, 4));
    }
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Laptop': return <Laptop size={20} />;
      case 'Smartphone': return <Smartphone size={20} />;
      case 'Headphones': return <Headphones size={20} />;
      case 'Watch': return <Watch size={20} />;
      case 'Tablet': return <Tablet size={20} />;
      case 'Home': return <Home size={20} />;
      default: return <Sparkles size={20} />;
    }
  };

  return (
    <div className="home-page" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '2rem' }}>
      <section className="container" style={{ paddingTop: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Home</div>
          <form onSubmit={handleSearch} style={{ position: 'relative', width: 'min(100%, 420px)' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: '2.8rem', background: '#fff' }}
            />
            <button type="submit" aria-label="Search products" style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}>
              <Search size={17} />
            </button>
          </form>
        </div>
      </section>

      <section className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Featured Products</h2>
          <Link to="/products" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
            View all <ArrowRight size={15} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {featuredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      <section className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Need help choosing?</div>
            <h3 style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>Ask ShopGen AI</h3>
          </div>
          <Link to="/ai-assistant" className="btn-secondary" style={{ fontSize: '0.88rem', padding: '0.55rem 0.9rem' }}>
            Ask AI <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Top Rated</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {topRatedProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      <section className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Browse Categories</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.8rem' }}>
          {CATEGORIES.slice(0, 6).map(cat => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                background: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.8rem 0.9rem',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                fontWeight: 600
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  {getCategoryIcon(cat.icon)}
                </span>
                {cat.name}
              </span>
              <ArrowRight size={14} color="var(--text-secondary)" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
