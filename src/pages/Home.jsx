import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useDebounce } from "../hooks/useDebounce";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import SortDropdown, { SORT_OPTIONS } from "../components/SortDropdown";
import RatingFilter from "../components/RatingFilter";
import PriceRangeFilter from "../components/PriceRangeFilter";
import ProductsPerPage from "../components/ProductsPerPage";
import ProductGrid from "../components/ProductGrid";
import ProductStatistics from "../components/ProductStatistics";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import { exportProductsToCsv } from "../utils/csvExport";

function Home({ cart, favorites, comparison }) {
  const { products, categories, loading, error, retry } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useLocalStorage("product-hub-layout", "grid");
  const { recentIds, clearRecentlyViewed } = useRecentlyViewed();

  // All filter/sort/page state lives in the URL, so filtered views are
  // shareable and survive a refresh (Task 10: URL Search Parameters).
  const searchTerm = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const sortOption = searchParams.get("sort") || SORT_OPTIONS.DEFAULT;
  const ratingFilter = searchParams.get("rating") || "all";
  const minPrice = searchParams.has("minPrice") ? Number(searchParams.get("minPrice")) : null;
  const maxPrice = searchParams.has("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
  const perPage = Number(searchParams.get("perPage")) || 12;
  const currentPage = Number(searchParams.get("page")) || 1;

  const debouncedSearch = useDebounce(searchTerm, 400);

  function updateParams(updates, resetPage = true) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (resetPage) next.delete("page");
    setSearchParams(next);
  }

  const filteredBeforeCategory = useMemo(() => {
    let result = [...products];

    if (debouncedSearch.trim()) {
      const term = debouncedSearch.trim().toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          (product.brand && product.brand.toLowerCase().includes(term))
      );
    }

    if (minPrice !== null) {
      result = result.filter((product) => product.price >= minPrice);
    }
    if (maxPrice !== null) {
      result = result.filter((product) => product.price <= maxPrice);
    }

    if (ratingFilter !== "all") {
      result = result.filter((product) => product.rating >= Number(ratingFilter));
    }

    return result;
  }, [products, debouncedSearch, minPrice, maxPrice, ratingFilter]);

  // Category counts are computed from the list BEFORE the category
  // filter itself is applied, so the dropdown shows accurate counts
  // for every category regardless of which one is currently selected.
  const categoryCounts = useMemo(() => {
    const counts = {};
    filteredBeforeCategory.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    return counts;
  }, [filteredBeforeCategory]);

  const visibleProducts = useMemo(() => {
    let result = filteredBeforeCategory;

    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    result = [...result];
    switch (sortOption) {
      case SORT_OPTIONS.PRICE_LOW_HIGH:
        result.sort((a, b) => a.price - b.price);
        break;
      case SORT_OPTIONS.PRICE_HIGH_LOW:
        result.sort((a, b) => b.price - a.price);
        break;
      case SORT_OPTIONS.RATING_HIGH_LOW:
        result.sort((a, b) => b.rating - a.rating);
        break;
      case SORT_OPTIONS.NAME_A_Z:
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [filteredBeforeCategory, selectedCategory, sortOption]);

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / perPage));
  const safePage = Math.min(currentPage, totalPages);

  const recentProducts = useMemo(
    () => products.filter((product) => recentIds.includes(product.id)),
    [products, recentIds]
  );

  const pagedProducts = useMemo(() => {
    const start = (safePage - 1) * perPage;
    return visibleProducts.slice(start, start + perPage);
  }, [visibleProducts, safePage, perPage]);

  function handlePageChange(page) {
    updateParams({ page }, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleToggleCompare(product) {
    if (comparison.isComparing(product.id)) {
      comparison.removeFromCompare(product.id);
    } else {
      comparison.addToCompare(product);
    }
  }

  return (
    <main className="page-content">
      {!loading && !error && (
        <>
          <ProductStatistics
            products={products}
            categories={categories}
            favoritesCount={favorites.favoriteIds.length}
            cartCount={cart.cartCount}
          />

          <div className="toolbar-shell">
            <div className="toolbar">
              <SearchBar
                value={searchTerm}
                onChange={(value) => updateParams({ search: value })}
              />
              <div className="toolbar-controls">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(value) => updateParams({ category: value })}
                  categoryCounts={categoryCounts}
                  totalCount={filteredBeforeCategory.length}
                />
                <RatingFilter
                  value={ratingFilter}
                  onChange={(value) => updateParams({ rating: value })}
                />
                <SortDropdown
                  value={sortOption}
                  onChange={(value) => updateParams({ sort: value })}
                />
                <ProductsPerPage
                  value={perPage}
                  onChange={(value) => updateParams({ perPage: value })}
                />
                <div className="view-toggle" role="group" aria-label="Choose display layout">
                  <button
                    className={`btn btn-secondary ${layout === "grid" ? "btn-active" : ""}`}
                    onClick={() => setLayout("grid")}
                  >
                    Grid View
                  </button>
                  <button
                    className={`btn btn-secondary ${layout === "list" ? "btn-active" : ""}`}
                    onClick={() => setLayout("list")}
                  >
                    List View
                  </button>
                </div>
              </div>
            </div>
          </div>

          <PriceRangeFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onApply={(min, max) => updateParams({ minPrice: min, maxPrice: max })}
            onClear={() => updateParams({ minPrice: null, maxPrice: null })}
          />

          {comparison.compareError && (
            <p className="compare-error-banner">{comparison.compareError}</p>
          )}

          <p className="result-count">
            {visibleProducts.length === 0
              ? "0 products found"
              : `Showing ${(safePage - 1) * perPage + 1}–${Math.min(
                  safePage * perPage,
                  visibleProducts.length
                )} of ${visibleProducts.length} product${
                  visibleProducts.length !== 1 ? "s" : ""
                }`}
          </p>

          <div className="toolbar-actions">
            <button className="btn btn-primary" onClick={() => exportProductsToCsv(visibleProducts)}>
              Export Products
            </button>
          </div>

          {recentProducts.length > 0 && (
            <section className="recently-viewed-shell">
              <div className="recently-viewed-header">
                <h3>Recently Viewed</h3>
                <button className="btn btn-secondary" onClick={clearRecentlyViewed}>
                  Clear Recently Viewed
                </button>
              </div>
              <div className="product-grid">
                {recentProducts.map((product) => (
                  <ProductGrid
                    key={`recent-${product.id}`}
                    products={[product]}
                    favorites={favorites.favoriteIds}
                    onToggleFavorite={favorites.toggleFavorite}
                    onAddToCart={cart.addToCart}
                    compareIds={comparison.compareItems.map((item) => item.id)}
                    onToggleCompare={handleToggleCompare}
                    layout={layout}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {loading && <Loader />}

      {!loading && error && <ErrorMessage message={error} onRetry={retry} />}

      {!loading && !error && (
        <>
          <ProductGrid
            products={pagedProducts}
            favorites={favorites.favoriteIds}
            onToggleFavorite={favorites.toggleFavorite}
            onAddToCart={cart.addToCart}
            compareIds={comparison.compareItems.map((item) => item.id)}
            onToggleCompare={handleToggleCompare}
            layout={layout}
          />
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}

export default Home;
