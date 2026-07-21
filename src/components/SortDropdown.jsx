import "./CategoryFilter.css";

export const SORT_OPTIONS = {
  DEFAULT: "default",
  PRICE_LOW_HIGH: "price-asc",
  PRICE_HIGH_LOW: "price-desc",
  RATING_HIGH_LOW: "rating-desc",
  NAME_A_Z: "name-asc",
};

function SortDropdown({ value, onChange }) {
  return (
    <div className="category-filter">
      <label htmlFor="sort-select" className="sort-label">
        Sort by
      </label>
      <select
        id="sort-select"
        className="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value={SORT_OPTIONS.DEFAULT}>Featured</option>
        <option value={SORT_OPTIONS.PRICE_LOW_HIGH}>Price: Low to High</option>
        <option value={SORT_OPTIONS.PRICE_HIGH_LOW}>Price: High to Low</option>
        <option value={SORT_OPTIONS.RATING_HIGH_LOW}>Rating: High to Low</option>
        <option value={SORT_OPTIONS.NAME_A_Z}>Product Name: A to Z</option>
      </select>
    </div>
  );
}

export default SortDropdown;
