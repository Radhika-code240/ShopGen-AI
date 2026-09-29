import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { API_CONFIG } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();


  useEffect(() => {
    async function loadCart() {
      if (!API_CONFIG.USE_MOCK_API && !localStorage.getItem('shopgen_token')) {
        setCart([]);
        setLoading(false);
        return;
      }
      try {
        const items = await cartService.getCart();
        setCart(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error('Failed to load cart:', err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    }
    loadCart();
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    try {
      if (!API_CONFIG.USE_MOCK_API && !localStorage.getItem('shopgen_token')) {
        alert('Please log in to add items to your cart.');
        window.location.href = '/login';
        return;
      }
      const updated = await cartService.addToCart(product, quantity);
      setCart(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (!API_CONFIG.USE_MOCK_API && !localStorage.getItem('shopgen_token')) {
        alert('Please log in to update your cart.');
        window.location.href = '/login';
        return;
      }
      const updated = await cartService.updateCartItem(productId, quantity);
      setCart(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (!API_CONFIG.USE_MOCK_API && !localStorage.getItem('shopgen_token')) {
        alert('Please log in to update your cart.');
        window.location.href = '/login';
        return;
      }
      const updated = await cartService.removeFromCart(productId);
      setCart(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartSubtotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
