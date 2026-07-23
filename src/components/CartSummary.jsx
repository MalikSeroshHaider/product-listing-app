import { getOrderSummary } from "../utils/cartCalculations";
import "./CartSummary.css";

function CartSummary({ cartItems }) {
  const summary = getOrderSummary(cartItems);

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>

      <div className="summary-row">
        <span>Subtotal</span>
        <span>${summary.subtotal.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>Discount</span>
        <span className="summary-discount">-${summary.discount.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>Delivery</span>
        <span>{summary.delivery === 0 ? "Free" : `$${summary.delivery.toFixed(2)}`}</span>
      </div>
      <div className="summary-row">
        <span>Tax</span>
        <span>${summary.tax.toFixed(2)}</span>
      </div>

      {summary.delivery > 0 && (
        <p className="summary-shipping-note">
          Add ${(summary.freeShippingThreshold - (summary.subtotal - summary.discount)).toFixed(2)} more for free delivery
        </p>
      )}

      <div className="summary-row summary-total">
        <span>Total</span>
        <span>${summary.total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CartSummary;
