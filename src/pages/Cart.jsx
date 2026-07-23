import { useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import EmptyState from "../components/EmptyState";
import ConfirmationModal from "../components/ConfirmationModal";
import "./Cart.css";

function Cart({ cart }) {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = cart;
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  if (cartItems.length === 0) {
    return (
      <main className="page-content">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Looks like you haven't added anything yet."
          actionLabel="Browse Products"
          actionTo="/"
        />
      </main>
    );
  }

  return (
    <main className="page-content">
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button className="cart-clear-btn" onClick={() => setConfirmClearOpen(true)}>
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        <CartSummary cartItems={cartItems} />
      </div>

      <Link to="/" className="btn btn-secondary cart-continue-link">
        ← Continue Shopping
      </Link>

      <ConfirmationModal
        open={confirmClearOpen}
        title="Clear your cart?"
        message="This will remove all items from your cart. This can't be undone."
        confirmLabel="Clear Cart"
        onConfirm={() => {
          clearCart();
          setConfirmClearOpen(false);
        }}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </main>
  );
}

export default Cart;
