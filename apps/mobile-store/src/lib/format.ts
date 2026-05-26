export function formatPrice(cents: number, currency = 'INR') {
  return (cents / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
}
