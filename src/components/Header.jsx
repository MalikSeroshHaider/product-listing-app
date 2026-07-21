import "./Header.css";

function Header({ favoritesCount, isDarkMode, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <h1 className="app-title">
          🛍️ <span>Product</span>Hub
        </h1>

        <div className="app-header-actions">
          <div className="favorites-badge" title="Favorited products">
            ❤️ {favoritesCount}
          </div>
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
