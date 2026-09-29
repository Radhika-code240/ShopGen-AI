import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export default function RatingStars({ rating = 0, reviewsCount, showText = true, size = 16 }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} fill="currentColor" />
        ))}
        {hasHalfStar && <StarHalf size={size} fill="currentColor" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} style={{ opacity: 0.3 }} />
        ))}
      </div>
      {showText && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {rating.toFixed(1)} {reviewsCount !== undefined && `(${reviewsCount})`}
        </span>
      )}
    </div>
  );
}
