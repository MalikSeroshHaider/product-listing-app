const BASE_URL = "https://dummyjson.com";

/**
 * Fetch all products (limit=100 so search/filter/sort have a real dataset to work with).
 * Throws an Error on network failure or non-2xx response.
 */
export async function fetchProducts(signal) {
  const response = await fetch(`${BASE_URL}/products?limit=100`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch products (status ${response.status})`);
  }

  const data = await response.json();
  return data.products;
}

/**
 * Fetch a single product by its ID (used by the /products/:id details page).
 */
export async function fetchProductById(id, signal) {
  const response = await fetch(`${BASE_URL}/products/${id}`, { signal });

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "Product not found"
        : `Failed to fetch product (status ${response.status})`
    );
  }

  return response.json();
}

/**
 * Fetch a list of products by their IDs. Used by the Favorites and
 * Compare pages, which only store IDs in localStorage and need the
 * current, up-to-date product data to display.
 */
export async function fetchProductsByIds(ids, signal) {
  const results = await Promise.all(
    ids.map((id) =>
      fetchProductById(id, signal).catch(() => null) // skip products that 404 (e.g. removed upstream)
    )
  );
  return results.filter(Boolean);
}

/**
 * Fetch the list of product categories.
 * DummyJSON returns either an array of strings or an array of
 * { slug, name, url } objects depending on API version, so we
 * normalize both shapes into a simple array of { slug, name }.
 */
export async function fetchCategories(signal) {
  const response = await fetch(`${BASE_URL}/products/categories`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories (status ${response.status})`);
  }

  const data = await response.json();

  return data.map((category) =>
    typeof category === "string"
      ? { slug: category, name: category }
      : { slug: category.slug, name: category.name }
  );
}
