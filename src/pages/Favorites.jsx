import { useEffect, useState } from "react";
import { fetchProductsByIds } from "../services/productApi";
import ProductGrid from "../components/ProductGrid";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function Favorites({ favorites, cart, comparison }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadFavorites() {
    if (favorites.favoriteIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductsByIds(favorites.favoriteIds);
      setProducts(data);
    } catch (err) {
      setError(err.message || "Unable to load your favorites.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites.favoriteIds]);

  return (
    <main className="page-content">
      <h2 className="section-heading">Your Favorites</h2>

      {loading && <Loader />}

      {!loading && error && <ErrorMessage message={error} onRetry={loadFavorites} />}

      {!loading && !error && favorites.favoriteIds.length === 0 && (
        <EmptyState
          icon="❤️"
          title="No favorite products yet"
          message="Tap the heart icon on any product to save it here."
          actionLabel="Browse Products"
          actionTo="/"
        />
      )}

      {!loading && !error && favorites.favoriteIds.length > 0 && (
        <ProductGrid
          products={products}
          favorites={favorites.favoriteIds}
          onToggleFavorite={favorites.toggleFavorite}
          onAddToCart={cart.addToCart}
          compareIds={comparison.compareItems.map((item) => item.id)}
          onToggleCompare={(product) =>
            comparison.isComparing(product.id)
              ? comparison.removeFromCompare(product.id)
              : comparison.addToCompare(product)
          }
        />
      )}
    </main>
  );
}

export default Favorites;
