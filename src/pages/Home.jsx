import { useEffect, useMemo, useState } from "react";
import { fetchProducts, fetchCategories } from "../services/productApi";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import SortDropdown, { SORT_OPTIONS } from "../components/SortDropdown";
import ProductGrid from "../components/ProductGrid";
import ProductModal from "../components/ProductModal";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const FAVORITES_KEY = "product-hub-favorites";
const THEME_KEY = "product-hub-theme";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.DEFAULT);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem(THEME_KEY) === "dark";
  });

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [productList, categoryList] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ]);
      setProducts(productList);
      setCategories(categoryList);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    localStorage.setItem(THEME_KEY, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  function toggleFavorite(productId) {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  const visibleProducts = useMemo(() => {
    let result = [...products];

    // Search by title, category, or brand
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          (product.brand && product.brand.toLowerCase().includes(term))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Sort
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
  }, [products, searchTerm, selectedCategory, sortOption]);

  return (
    <div className="page">
      <Header
        favoritesCount={favorites.length}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
      />

      <main className="page-content">
        {!loading && !error && (
          <div className="toolbar">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <div className="toolbar-controls">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <SortDropdown value={sortOption} onChange={setSortOption} />
            </div>
          </div>
        )}

        {!loading && !error && (
          <p className="result-count">
            {visibleProducts.length} product{visibleProducts.length !== 1 ? "s" : ""} found
          </p>
        )}

        {loading && <Loader />}

        {!loading && error && <ErrorMessage message={error} onRetry={loadData} />}

        {!loading && !error && (
          <ProductGrid
            products={visibleProducts}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onViewDetails={setSelectedProduct}
          />
        )}
      </main>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

export default Home;
