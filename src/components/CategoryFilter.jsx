import "./CategoryFilter.css";

function formatLabel(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * `categoryCounts` is a { [slug]: count } map built from the full
 * product list (before category filtering is applied) so counts stay
 * accurate as search/price/rating filters change. `totalCount` is the
 * count for "All Categories".
 */
function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
  totalCount = 0,
}) {
  return (
    <div className="category-filter">
      <label htmlFor="category-select" className="category-label">
        Category
      </label>
      <select
        id="category-select"
        className="category-select"
        value={selectedCategory}
        onChange={(e) => onSelectCategory(e.target.value)}
      >
        <option value="all">All Categories ({totalCount})</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {formatLabel(category.name)} ({categoryCounts[category.slug] || 0})
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;
