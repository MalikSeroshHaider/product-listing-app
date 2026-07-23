import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Loader from "./components/Loader";
import { useCart } from "./hooks/useCart";
import { useFavorites } from "./hooks/useFavorites";
import { useComparison } from "./hooks/useComparison";
import { useTheme } from "./hooks/useTheme";

const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Compare = lazy(() => import("./pages/Compare"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const EditProduct = lazy(() => import("./pages/EditProduct"));

function App() {
  const cart = useCart();
  const favorites = useFavorites();
  const comparison = useComparison();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div className="page">
        <Header
          favoritesCount={favorites.favoriteIds.length}
          cartCount={cart.cartCount}
          compareCount={comparison.compareItems.length}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        <Suspense fallback={<Loader count={3} />}>
          <Routes>
            <Route
              path="/"
              element={<Home cart={cart} favorites={favorites} comparison={comparison} />}
            />
            <Route
              path="/products/:id"
              element={
                <ProductDetails cart={cart} favorites={favorites} comparison={comparison} />
              }
            />
            <Route path="/cart" element={<Cart cart={cart} />} />
            <Route
              path="/favorites"
              element={<Favorites favorites={favorites} cart={cart} comparison={comparison} />}
            />
            <Route path="/compare" element={<Compare comparison={comparison} />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/:id/edit" element={<EditProduct />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
