import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const CART_KEY = "product-hub-cart";

/**
 * Manages cart items, persisted to localStorage.
 * Each cart item stores a snapshot of the product plus a quantity,
 * so the cart page still works even if the product later goes out
 * of the fetched list (e.g. after a filter change).
 */
export function useCart() {
  const [cartItems, setCartItems] = useLocalStorage(CART_KEY, []);

  const addToCart = useCallback(
    (product, quantity = 1) => {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          const nextQuantity = Math.min(existing.quantity + quantity, product.stock);
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: nextQuantity } : item
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: product.price,
            discountPercentage: product.discountPercentage,
            stock: product.stock,
            quantity: Math.min(quantity, product.stock),
          },
        ];
      });
    },
    [setCartItems]
  );

  const increaseQuantity = useCallback(
    (productId) => {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item
        )
      );
    },
    [setCartItems]
  );

  const decreaseQuantity = useCallback(
    (productId) => {
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    [setCartItems]
  );

  const removeFromCart = useCallback(
    (productId) => {
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    },
    [setCartItems]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, [setCartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartCount,
  };
}

export default useCart;
