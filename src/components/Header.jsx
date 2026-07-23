import { Link, NavLink } from "react-router-dom";
import "./Header.css";

function Header({ favoritesCount, cartCount, compareCount, isDarkMode, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="app-title">
          🛍️ <span>Product</span>Hub
        </Link>

        <nav className="app-nav">
          <NavLink to="/" end className="app-nav-link">
            Home
          </NavLink>
          <NavLink to="/favorites" className="app-nav-link">
            ❤️ Favorites{favoritesCount > 0 ? ` (${favoritesCount})` : ""}
          </NavLink>
          <NavLink to="/compare" className="app-nav-link">
            ⚖️ Compare{compareCount > 0 ? ` (${compareCount})` : ""}
          </NavLink>
          <NavLink to="/cart" className="app-nav-link app-nav-cart">
            🛒 Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </NavLink>
          <NavLink to="/products/add" className="app-nav-link">
            ➕ Add Product
          </NavLink>
        </nav>

        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

export default Header;
