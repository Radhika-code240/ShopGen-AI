import React from 'react';
import { CATEGORIES, BRANDS } from '../../data/mockData';
import { formatPriceIndian } from '../../utils/price';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import RatingStars from '../common/RatingStars';

export default function ProductFilters({ filters, onFilterChange, onReset }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>
          <SlidersHorizontal size={18} color="var(--primary)" />
          Filter Products
        </div>
        <button 
          onClick={onReset}
          style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
          Category
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="category"
              checked={!filters.category || filters.category === 'all'} 
              onChange={() => onFilterChange('category', 'all')}
            />
            All Categories
          </label>
          {CATEGORIES.map(cat => (
            <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="category"
                checked={filters.category === cat.id} 
                onChange={() => onFilterChange('category', cat.id)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Max Price
          </h4>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
            {filters.maxPrice ? formatPriceIndian(filters.maxPrice) : '₹1,00,000'}
          </span>
        </div>
        <input 
          type="range" 
          min="5000" 
          max="100000" 
          step="5000"
          value={filters.maxPrice || 100000} 
          onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
          <span>₹5,000</span>
          <span>₹1,00,000</span>
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
          Brand
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="brand"
              checked={!filters.brand || filters.brand === 'all'} 
              onChange={() => onFilterChange('brand', 'all')}
            />
            All Brands
          </label>
          {BRANDS.map(brand => (
            <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="brand"
                checked={filters.brand === brand} 
                onChange={() => onFilterChange('brand', brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
          Minimum Rating
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[4.5, 4.0, 3.5].map(rating => (
            <label key={rating} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="rating"
                checked={Number(filters.minRating) === rating} 
                onChange={() => onFilterChange('minRating', rating)}
              />
              <RatingStars rating={rating} showText={false} size={14} /> & Up
            </label>
          ))}
        </div>
      </div>

    </div>
  );
}
