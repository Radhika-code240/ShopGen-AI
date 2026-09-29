export function formatPriceIndian(price) {
  if (price === undefined || price === null) return '';
  const n = Number(price);
  if (Number.isNaN(n)) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(n));
}
