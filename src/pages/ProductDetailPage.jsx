import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, Heart, Scale, ShieldCheck, Truck, RefreshCw, 
  Sparkles, Star, Plus, Minus, MessageSquarePlus, ArrowLeft 
} from 'lucide-react';
import { productService } from '../services/productService';
import { formatPriceIndian } from '../utils/price';
import RatingStars from '../components/common/RatingStars';
import AIReviewSummary from '../components/product/AIReviewSummary';
import ProductCard from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';

const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        const prod = await productService.getProductById(id);
        setProduct(prod);
        setActiveImage(prod?.image || prod?.images?.[0] || FALLBACK_PRODUCT_IMAGE);

        // Fetch reviews independently so failures do not prevent product rendering
        try {
          const revs = await productService.getProductReviews(id);
          setReviews(Array.isArray(revs) ? revs : []);
        } catch (revErr) {
          console.error('Failed to load reviews:', revErr);
          setReviews([]);
        }

        // Fetch similar products independently
        try {
          const allProds = await productService.getProducts();
          setSimilarProducts(allProds.filter(p => p.category === prod.category && (p.id !== prod.id && p._id !== prod._id)));
        } catch (pErr) {
          console.error('Failed to load similar products:', pErr);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleOpenReviewForm = () => {
    if (!user) {
      alert('Please log in to write a review.');
      navigate('/login');
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review.');
      navigate('/login');
      return;
    }

    if (!newReviewComment) return;

    setReviewError('');
    setSubmittingReview(true);
    try {
      const added = await productService.addReview(id, {
        title: newReviewTitle,
        comment: newReviewComment,
        rating: newReviewRating
      });
      setReviews([added, ...reviews]);
      setNewReviewTitle('');
      setNewReviewComment('');
      setShowReviewForm(false);
      
      // Refresh product data to update average rating and reviews count
      const updatedProd = await productService.getProductById(id);
      setProduct(updatedProd);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setReviewError(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading || !product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="badge-ai animate-glow">Loading product details...</div>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id || product._id);
  const isCompared = isInCompare(product.id || product._id);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
      
      {/* Back Link */}
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Products Catalog
      </Link>

      {/* Main Product Specs & Gallery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '3rem',
        marginBottom: '4rem'
      }}>
        
        {/* Left: Image Gallery */}
        <div>
          <div className="glass-card" style={{ padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
            <img 
              src={activeImage}
              onError={(event) => { event.currentTarget.src = FALLBACK_PRODUCT_IMAGE; }}
              alt={product.name} 
              style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }} 
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    border: activeImage === img ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    opacity: activeImage === img ? 1 : 0.6
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Purchase Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge-ai">{product.brand}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                Category: {product.category}
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', lineHeight: 1.2, fontWeight: 800, color: 'var(--text-primary)' }}>
              {product.name}
            </h1>
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <RatingStars rating={product.rating || 0} reviewsCount={reviews.length || product.reviewsCount || 0} size={18} />
            <a href="#customer-reviews" style={{ fontSize: '0.85rem', color: 'var(--primary)', textDecoration: 'underline' }}>
              ({reviews.length} reviews)
            </a>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-green)', fontWeight: 600 }}>
              {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
            </span>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatPriceIndian(product.price)}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {formatPriceIndian(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.98rem' }}>
            {product.description}
          </p>

          {/* Quantity Selector & Action CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem' }}>
            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(17, 24, 39, 0.9)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '0.2rem' }}>
                <Minus size={16} />
              </button>
              <span style={{ fontSize: '1rem', fontWeight: 700, minWidth: '30px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '0.2rem' }}>
                <Plus size={16} />
              </button>
            </div>

            {/* Add to Cart */}
            <button 
              onClick={() => addToCart(product, quantity)}
              className="btn-primary"
              style={{ flex: 1, minWidth: '160px', padding: '0.85rem 1.25rem' }}
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>

            {/* Buy Now */}
            <button 
              onClick={handleBuyNow}
              className="btn-ai"
              style={{ padding: '0.85rem 1.5rem' }}
            >
              Buy Now
            </button>

            {/* Wishlist & Compare Buttons */}
            <button 
              onClick={() => toggleWishlist(product)}
              className="btn-secondary"
              title="Save to Wishlist"
              style={{ color: isFavorited ? 'var(--accent-red)' : 'var(--text-primary)' }}
            >
              <Heart size={18} fill={isFavorited ? 'var(--accent-red)' : 'none'} />
            </button>

            <button 
              onClick={() => toggleCompare(product)}
              className="btn-secondary"
              title="Compare Specs"
              style={{ color: isCompared ? 'var(--primary)' : 'var(--text-primary)' }}
            >
              <Scale size={18} />
            </button>
          </div>

          {/* Value Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={16} color="var(--primary)" /> Express Delivery
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="var(--accent-green)" /> 2 Year Warranty
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={16} color="var(--accent-gold)" /> 30-Day Returns
            </div>
          </div>

        </div>

      </div>

      {/* Specifications Breakdown */}
      <section className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Technical Specifications</h2>
        {product.specifications ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} style={{ background: 'rgba(17, 24, 39, 0.6)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>{key}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{val}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Standard electronic specifications apply.</p>
        )}
      </section>

      {/* AI Review Summary Section */}
      <AIReviewSummary summary={product.aiReviewSummary} />

      {/* Customer Reviews Section */}
      <section id="customer-reviews" className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Customer Reviews</h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Based on {reviews.length} verified buyer reviews</span>
          </div>

          <button 
            onClick={handleOpenReviewForm}
            className="btn-secondary"
            style={{ fontSize: '0.9rem' }}
          >
            <MessageSquarePlus size={16} /> Write a Review
          </button>
        </div>

        {/* Write Review Form Accordion */}
        {showReviewForm && (
          <form onSubmit={handleAddReviewSubmit} className="glass-card-sm" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Write Your Honest Feedback</h3>
            
            {reviewError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                {reviewError}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Rating:</span>
              <div style={{ display: 'flex', gap: '0.3rem', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={20} 
                    fill={star <= newReviewRating ? 'var(--accent-gold)' : 'none'} 
                    color="var(--accent-gold)"
                    onClick={() => setNewReviewRating(star)}
                  />
                ))}
              </div>
            </div>

            <input 
              type="text" 
              placeholder="Review Title (e.g. Excellent build quality & fast compile speeds)" 
              className="input-field"
              value={newReviewTitle}
              onChange={(e) => setNewReviewTitle(e.target.value)}
            />

            <textarea 
              rows={4}
              placeholder="Detail your experience with performance, battery, display, and daily use..."
              className="input-field"
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              required
            />

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                Cancel
              </button>
              <button type="submit" disabled={submittingReview} className="btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No reviews yet for this product.</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Be the first to share your experience with other shoppers!</p>
            </div>
          ) : (
            reviews.map(rev => (
              <div key={rev.id || rev._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={rev.userAvatar} alt={rev.userName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{rev.userName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', marginLeft: '0.5rem' }}>Verified Purchase</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                </div>

                <RatingStars rating={rev.rating} showText={false} size={14} />

                {rev.title && (
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0.4rem 0 0.2rem', color: 'var(--text-primary)' }}>
                    {rev.title}
                  </h4>
                )}
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Similar Products You Might Like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {similarProducts.slice(0, 4).map(prod => (
              <ProductCard key={prod.id || prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
