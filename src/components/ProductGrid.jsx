import ProductCard from "./ProductCard";
import "./ProductGrid.css";

function ProductGrid({ products, favorites, onToggleFavorite, onViewDetails }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-icon" aria-hidden="true">
          🔎
        </p>
        <h3>No products found</h3>
        <p>Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={favorites.includes(product.id)}
          onToggleFavorite={onToggleFavorite}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
