import "./CategoryFilter.css";

export const RATING_OPTIONS = [
  { value: "all", label: "All Ratings" },
  { value: "4", label: "4 Stars and Above" },
  { value: "3", label: "3 Stars and Above" },
  { value: "2", label: "2 Stars and Above" },
];

function RatingFilter({ value, onChange }) {
  return (
    <div className="category-filter">
      <label htmlFor="rating-select" className="sort-label">
        Rating
      </label>
      <select
        id="rating-select"
        className="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {RATING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RatingFilter;
