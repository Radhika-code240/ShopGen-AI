import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

import { formatPriceIndian } from '../../utils/price';

const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const productId = product.id || product._id;
  const image = product.image || product.images?.[0] || FALLBACK_PRODUCT_IMAGE;
  const isFavorited = isInWishlist(productId);

  return (
    <div className="glass-card product-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', transition: 'var(--transition)' }}>
      <button
        onClick={() => toggleWishlist(product)}
        title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 5,
          width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.96)',
          border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isFavorited ? 'var(--accent-red)' : 'var(--text-secondary)'
        }}
      >
        <Heart size={16} fill={isFavorited ? 'var(--accent-red)' : 'none'} />
      </button>

      <div style={{ position: 'relative', width: '100%', paddingTop: '70%', overflow: 'hidden', background: '#f1f3f7' }}>
        <img src={image} alt={product.name} onError={(event) => { event.currentTarget.src = FALLBACK_PRODUCT_IMAGE; }} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.7rem' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {product.brand}
        </span>

        <Link to={`/products/${productId}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35, minHeight: '2.7em' }}>
            {product.name}
          </h3>
        </Link>

        <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} />

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: 'auto' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {formatPriceIndian(product.price)}
          </span>
        </div>

        <button onClick={() => addToCart(product, 1)} className="btn-primary" style={{ width: '100%', padding: '0.7rem 0.8rem', fontSize: '0.85rem' }}>
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
