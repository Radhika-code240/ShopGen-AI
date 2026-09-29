import { PRODUCTS, MOCK_REVIEWS } from '../data/mockData';
import { API_CONFIG, simulateDelay, apiFetch } from './api';

// Helper to normalize backend review objects to frontend field names
const mapReview = (raw) => {
  if (!raw) return null;
  return {
    ...raw,
    id: raw._id || raw.id,
    _id: raw._id || raw.id,
    productId: raw.product || raw.productId,
    userName: raw.user?.name || raw.userName || 'Verified Buyer',
    userAvatar: raw.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: Number(raw.rating) || 5,
    date: raw.createdAt ? new Date(raw.createdAt).toISOString().split('T')[0] : (raw.date || new Date().toISOString().split('T')[0]),
    title: raw.title || '',
    comment: raw.comment || '',
    helpfulCount: raw.helpfulCount || 0,
    verifiedPurchase: raw.verifiedPurchase !== undefined ? raw.verifiedPurchase : true
  };
};

const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80';

const mapProduct = (raw) => {
  if (!raw) return null;
  const id = raw._id || raw.id;
  const image = raw.image || raw.images?.[0] || FALLBACK_PRODUCT_IMAGE;
  return {
    ...raw,
    id,
    _id: id,
    image,
    images: Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : [image]
  };
};

export const productService = {
  // GET /api/products
  async getProducts(filters = {}) {
    if (!API_CONFIG.USE_MOCK_API) {
      const query = new URLSearchParams(filters).toString();
      const products = await apiFetch(`/products${query ? `?${query}` : ''}`);
      // MongoDB returns _id; map it to id so ProductCard link /products/:id works
      if (!Array.isArray(products)) return products;
      return products.map(mapProduct);
    }

    await simulateDelay();

    let result = [...PRODUCTS];

    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.brand && filters.brand !== 'all') {
      result = result.filter(p => p.brand === filters.brand);
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }

    if (filters.minRating) {
      result = result.filter(p => p.rating >= Number(filters.minRating));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy) {
      if (filters.sortBy === 'price-low') {
        result.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price-high') {
        result.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === 'rating') {
        result.sort((a, b) => b.rating - a.rating);
      } else if (filters.sortBy === 'popular') {
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
      }
    }

    return result;
  },

  // GET /api/products/:id
  async getProductById(id) {
    if (!API_CONFIG.USE_MOCK_API) {
      const product = await apiFetch(`/products/${id}`);
      return mapProduct(product);
    }

    await simulateDelay();
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) {
      throw new Error(`Product with ID '${id}' not found`);
    }
    return product;
  },

  // GET /api/products/:id/reviews
  async getProductReviews(productId) {
    if (!API_CONFIG.USE_MOCK_API) {
      try {
        const res = await apiFetch(`/products/${productId}/reviews`);
        const rawList = Array.isArray(res) ? res : [];
        return rawList.map(mapReview);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        return [];
      }
    }

    await simulateDelay();
    return MOCK_REVIEWS.filter(r => r.productId === productId);
  },

  // POST /api/products/:id/reviews
  async addReview(productId, reviewData) {
    if (!API_CONFIG.USE_MOCK_API) {
      // Backend expects { rating, title, comment }
      // Authenticated user is obtained from req.user on backend
      const res = await apiFetch(`/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          rating: Number(reviewData.rating),
          title: reviewData.title,
          comment: reviewData.comment
        })
      });
      return mapReview(res);
    }

    await simulateDelay();
    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      userName: reviewData.userName || 'Anonymous',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: Number(reviewData.rating),
      date: new Date().toISOString().split('T')[0],
      title: reviewData.title,
      comment: reviewData.comment,
      helpfulCount: 0,
      verifiedPurchase: true
    };
    MOCK_REVIEWS.unshift(newReview);
    return newReview;
  }
};
