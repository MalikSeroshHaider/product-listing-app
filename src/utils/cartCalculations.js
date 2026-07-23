const TAX_RATE = 0.08; // 8% flat tax, applied to the post-discount subtotal
const FREE_SHIPPING_THRESHOLD = 50;
const FLAT_DELIVERY_CHARGE = 5.99;

function toSafeNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}

/** Discounted unit price for a single cart item. */
export function getItemDiscountedPrice(item) {
  const price = toSafeNumber(item.price);
  const discount = toSafeNumber(item.discountPercentage);
  return price - (price * discount) / 100;
}

/** Sum of original (pre-discount) price × quantity for all items. */
export function getSubtotal(cartItems) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + toSafeNumber(item.price) * toSafeNumber(item.quantity),
    0
  );
  return Number(subtotal.toFixed(2));
}

/** Sum of (original price - discounted price) × quantity for all items. */
export function getTotalDiscount(cartItems) {
  const discount = cartItems.reduce((sum, item) => {
    const price = toSafeNumber(item.price);
    const discounted = getItemDiscountedPrice(item);
    return sum + (price - discounted) * toSafeNumber(item.quantity);
  }, 0);
  return Number(discount.toFixed(2));
}

/** Delivery charge: free above the threshold, flat fee otherwise, $0 for an empty cart. */
export function getDeliveryCharge(cartItems) {
  if (cartItems.length === 0) return 0;
  const postDiscountSubtotal = getSubtotal(cartItems) - getTotalDiscount(cartItems);
  return postDiscountSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_DELIVERY_CHARGE;
}

/** Tax calculated on the post-discount subtotal. */
export function getTax(cartItems) {
  const postDiscountSubtotal = getSubtotal(cartItems) - getTotalDiscount(cartItems);
  return Number((postDiscountSubtotal * TAX_RATE).toFixed(2));
}

/** Final total: subtotal - discount + delivery + tax, never negative. */
export function getFinalTotal(cartItems) {
  const subtotal = getSubtotal(cartItems);
  const discount = getTotalDiscount(cartItems);
  const delivery = getDeliveryCharge(cartItems);
  const tax = getTax(cartItems);
  const total = subtotal - discount + delivery + tax;
  return Number(Math.max(0, total).toFixed(2));
}

/** All order-summary figures at once, each already rounded to 2 decimals. */
export function getOrderSummary(cartItems) {
  return {
    subtotal: getSubtotal(cartItems),
    discount: getTotalDiscount(cartItems),
    delivery: getDeliveryCharge(cartItems),
    tax: getTax(cartItems),
    total: getFinalTotal(cartItems),
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  };
}
