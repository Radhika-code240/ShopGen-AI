import { API_CONFIG, simulateDelay, apiFetch } from './api';

// Helper to normalize cart response from backend into array of items with id & _id
const mapCartItems = (res) => {
  const rawItems = (res && res.items) || (Array.isArray(res) ? res : []);
  return rawItems
    .filter(item => item && item.product)
    .map(item => ({
      ...item,
      product: {
        ...item.product,
        id: item.product.id || item.product._id
      }
    }));
};

export const cartService = {
  // GET /api/cart
  async getCart() {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await apiFetch('/cart');
      return mapCartItems(res);
    }

    await simulateDelay(200);
    const savedCart = localStorage.getItem('shopgen_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  },

  // POST /api/cart
  async addToCart(product, quantity = 1) {
    if (!API_CONFIG.USE_MOCK_API) {
      const productId = product._id || product.id;
      const res = await apiFetch('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity })
      });
      return mapCartItems(res);
    }

    await simulateDelay(200);
    const cart = await this.getCart();
    const existingIndex = cart.findIndex(item => (item.product.id === product.id || item.product._id === product.id));

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    localStorage.setItem('shopgen_cart', JSON.stringify(cart));
    return cart;
  },

  // PUT /api/cart/:productId
  async updateCartItem(productId, quantity) {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await apiFetch(`/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
      return mapCartItems(res);
    }

    await simulateDelay(150);
    let cart = await this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => (item.product.id !== productId && item.product._id !== productId));
    } else {
      const item = cart.find(item => (item.product.id === productId || item.product._id === productId));
      if (item) item.quantity = quantity;
    }

    localStorage.setItem('shopgen_cart', JSON.stringify(cart));
    return cart;
  },

  // DELETE /api/cart/:productId
  async removeFromCart(productId) {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await apiFetch(`/cart/${productId}`, {
        method: 'DELETE'
      });
      return mapCartItems(res);
    }

    await simulateDelay(150);
    const cart = await this.getCart();
    const updated = cart.filter(item => (item.product.id !== productId && item.product._id !== productId));
    localStorage.setItem('shopgen_cart', JSON.stringify(updated));
    return updated;
  },

  async clearCart() {
    if (!API_CONFIG.USE_MOCK_API) {
      const res = await apiFetch('/cart/clear', {
        method: 'DELETE'
      });
      localStorage.removeItem('shopgen_cart');
      return mapCartItems(res);
    }

    localStorage.removeItem('shopgen_cart');
    return [];
  }
};
