import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import "./ProductGrid.css";

function ProductGrid({
  products,
  favorites,
  onToggleFavorite,
  onAddToCart,
  compareIds,
  onToggleCompare,
}) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        message="Try changing your search or filters."
      />
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
          onAddToCart={onAddToCart}
          isComparing={compareIds.includes(product.id)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
