import { useEffect, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

const RECENT_KEY = "product-hub-recently-viewed";
const MAX_RECENT = 5;

export function useRecentlyViewed() {
  const [recentIds, setRecentIds] = useLocalStorage(RECENT_KEY, []);

  const addRecentlyViewed = (productId) => {
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, MAX_RECENT);
    });
  };

  const clearRecentlyViewed = () => setRecentIds([]);

  const recentList = useMemo(() => recentIds, [recentIds]);

  return {
    recentIds: recentList,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
}

export default useRecentlyViewed;
