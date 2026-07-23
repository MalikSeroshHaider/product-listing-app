import "./CartItem.css";

function getDiscountedPrice(price, discountPercentage) {
  return (price - (price * discountPercentage) / 100).toFixed(2);
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const discountedPrice = getDiscountedPrice(item.price, item.discountPercentage);
  const lineTotal = (discountedPrice * item.quantity).toFixed(2);
  const atMaxStock = item.quantity >= item.stock;

  return (
    <div className="cart-item">
      <img src={item.thumbnail} alt={item.title} className="cart-item-thumb" />

      <div className="cart-item-info">
        <p className="cart-item-title">{item.title}</p>
        <p className="cart-item-unit-price">${discountedPrice} each</p>
        {atMaxStock && <p className="cart-item-stock-note">Max available stock reached</p>}
      </div>

      <div className="cart-item-qty">
        <button
          className="qty-btn"
          onClick={() => onDecrease(item.id)}
          aria-label={`Decrease quantity of ${item.title}`}
        >
          −
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => onIncrease(item.id)}
          disabled={atMaxStock}
          aria-label={`Increase quantity of ${item.title}`}
        >
          +
        </button>
      </div>

      <div className="cart-item-total">${lineTotal}</div>

      <button
        className="cart-item-remove"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.title} from cart`}
      >
        ✕
      </button>
    </div>
  );
}

export default CartItem;
