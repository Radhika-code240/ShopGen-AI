import React, { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopgen_wishlist') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('shopgen_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const productId = product => product?.id || product?._id;
  const isInWishlist = id => wishlist.some(product => productId(product) === id);
  const toggleWishlist = product => {
    const id = productId(product);
    setWishlist(current => current.some(item => productId(item) === id) ? current.filter(item => productId(item) !== id) : [...current, product]);
  };

  return <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
