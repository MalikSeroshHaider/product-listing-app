import "./CategoryFilter.css";

function formatLabel(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
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
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {formatLabel(category.name)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;
