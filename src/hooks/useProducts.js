import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProducts, fetchCategories } from "../services/productApi";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Owns fetching the product list + categories, along with
 * loading/error state and a retry function.
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localProducts] = useLocalStorage("product-hub-local-products", []);

  const loadData = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const [productList, categoryList] = await Promise.all([
        fetchProducts(signal),
        fetchCategories(signal),
      ]);
      setProducts(productList);
      setCategories(categoryList);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);

    return () => controller.abort();
  }, [loadData]);

  const mergedProducts = useMemo(() => [...products, ...localProducts], [products, localProducts]);
  const mergedCategories = useMemo(
    () => Array.from(new Map([...categories.map((category) => [category.slug, category])]).values()),
    [categories]
  );

  return { products: mergedProducts, categories: mergedCategories, loading, error, retry: loadData };
}

export default useProducts;
