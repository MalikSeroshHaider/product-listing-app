import "./SearchBar.css";

/**
 * Controlled search input. Filtering itself happens in Home.jsx
 * (single source of truth for the product list); this component
 * just reports keystrokes upward.
 */
function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">
        🔍
      </span>
      <input
        type="text"
        className="search-input"
        placeholder="Search by title, category, or brand..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search products"
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
