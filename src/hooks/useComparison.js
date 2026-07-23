import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

const COMPARE_KEY = "product-hub-compare";
const MAX_COMPARE = 3;

/**
 * Manages up to 3 products selected for side-by-side comparison.
 * Stores lightweight product snapshots so the compare page still
 * renders correctly after a refresh.
 */
export function useComparison() {
  const [compareItems, setCompareItems] = useLocalStorage(COMPARE_KEY, []);
  const [compareError, setCompareError] = useState("");

  const addToCompare = useCallback(
    (product) => {
      setCompareError("");
      setCompareItems((prev) => {
        if (prev.some((item) => item.id === product.id)) return prev;
        if (prev.length >= MAX_COMPARE) {
          setCompareError(`You can only compare up to ${MAX_COMPARE} products at a time.`);
          return prev;
        }
        return [...prev, product];
      });
    },
    [setCompareItems]
  );

  const removeFromCompare = useCallback(
    (productId) => {
      setCompareItems((prev) => prev.filter((item) => item.id !== productId));
    },
    [setCompareItems]
  );

  const clearCompare = useCallback(() => {
    setCompareItems([]);
  }, [setCompareItems]);

  const isComparing = useCallback(
    (productId) => compareItems.some((item) => item.id === productId),
    [compareItems]
  );

  return {
    compareItems,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isComparing,
    compareError,
    maxCompare: MAX_COMPARE,
  };
}

export default useComparison;
