import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const FAVORITES_KEY = "product-hub-favorites";

/**
 * Manages the list of favorited product IDs, persisted to localStorage.
 */
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useLocalStorage(FAVORITES_KEY, []);

  const toggleFavorite = useCallback(
    (productId) => {
      setFavoriteIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    },
    [setFavoriteIds]
  );

  const removeFavorite = useCallback(
    (productId) => {
      setFavoriteIds((prev) => prev.filter((id) => id !== productId));
    },
    [setFavoriteIds]
  );

  const isFavorite = useCallback(
    (productId) => favoriteIds.includes(productId),
    [favoriteIds]
  );

  return { favoriteIds, toggleFavorite, removeFavorite, isFavorite };
}

export default useFavorites;
