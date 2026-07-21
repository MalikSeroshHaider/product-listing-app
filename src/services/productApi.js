const BASE_URL = "https://dummyjson.com";

/**
 * Fetch all products (limit=100 so search/filter/sort have a real dataset to work with).
 * Throws an Error on network failure or non-2xx response.
 */
export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/products?limit=100`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products (status ${response.status})`);
  }

  const data = await response.json();
  return data.products;
}

/**
 * Fetch the list of product categories.
 * DummyJSON returns either an array of strings or an array of
 * { slug, name, url } objects depending on API version, so we
 * normalize both shapes into a simple array of { slug, name }.
 */
export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/products/categories`);

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
