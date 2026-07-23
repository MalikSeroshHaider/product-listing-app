import "./CategoryFilter.css";

export const PER_PAGE_OPTIONS = [8, 12, 20];

function ProductsPerPage({ value, onChange }) {
  return (
    <div className="category-filter">
      <label htmlFor="per-page-select" className="sort-label">
        Show
      </label>
      <select
        id="per-page-select"
        className="sort-select"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {PER_PAGE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option} per page
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProductsPerPage;
