import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, ArrowUpDown, X } from 'lucide-react';
import { productService } from '../services/productService';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialFilters = {
    category: searchParams.get('category') || 'all',
    brand: searchParams.get('brand') || 'all',
    search: searchParams.get('search') || '',
    maxPrice: 100000,
    minRating: 0,
    sortBy: 'popular'
  };

  const [filters, setFilters] = useState(initialFilters);

  // Sync state if URL search query changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get('category') || prev.category,
      search: searchParams.get('search') !== null ? searchParams.get('search') : prev.search
    }));
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await productService.getProducts(filters);
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      brand: 'all',
      search: '',
      maxPrice: 100000,
      minRating: 0,
      sortBy: 'popular'
    });
    setSearchParams({});
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Explore Electronics & Tech
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Browse our curated catalog or use AI filters to find the ideal match.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '2rem',
        alignItems: 'flex-start'
      }}>
        
        {/* Sidebar Filters */}
        <aside style={{ position: 'sticky', top: '100px' }}>
          <ProductFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
            onReset={handleResetFilters} 
          />
        </aside>

        {/* Catalog Main Content */}
        <main>
          {/* Controls Bar */}
          <div className="glass-card" style={{
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            {/* Active Filters Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Showing <strong>{products.length}</strong> products
              </span>

              {filters.search && (
                <span className="badge-ai" style={{ fontSize: '0.75rem' }}>
                  Search: "{filters.search}"
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '0.3rem' }} onClick={() => handleFilterChange('search', '')} />
                </span>
              )}

              {filters.category !== 'all' && (
                <span className="badge-ai" style={{ fontSize: '0.75rem' }}>
                  Category: {filters.category}
                  <X size={12} style={{ cursor: 'pointer', marginLeft: '0.3rem' }} onClick={() => handleFilterChange('category', 'all')} />
                </span>
              )}
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Sort by:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input-field"
                style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.88rem' }}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid products={products} loading={loading} />
        </main>

      </div>

    </div>
  );
}
