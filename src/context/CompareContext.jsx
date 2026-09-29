import React, { createContext, useContext, useEffect, useState } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopgen_compare') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('shopgen_compare', JSON.stringify(compareList));
  }, [compareList]);

  const productId = product => product?.id || product?._id;
  const isInCompare = id => compareList.some(product => productId(product) === id);
  const toggleCompare = product => {
    const id = productId(product);
    setCompareList(current => current.some(item => productId(item) === id) ? current.filter(item => productId(item) !== id) : current.length >= 4 ? current : [...current, product]);
  };

  return <CompareContext.Provider value={{ compareList, toggleCompare, isInCompare }}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within a CompareProvider');
  return context;
}
