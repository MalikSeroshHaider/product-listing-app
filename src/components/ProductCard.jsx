import { Link } from "react-router-dom";
import "./ProductCard.css";

function getDiscountedPrice(price, discountPercentage) {
  const discounted = price - (price * discountPercentage) / 100;
  return discounted.toFixed(2);
}

function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  isComparing,
  onToggleCompare,
}) {
  const {
    id,
    title,
    category,
    price,
    discountPercentage,
    rating,
    stock,
    thumbnail,
  } = product;

  const discountedPrice = getDiscountedPrice(price, discountPercentage);
  const inStock = stock > 0;

  return (
    <div className="product-card">
      <div className="product-thumb-wrap">
        <Link to={`/products/${id}`}>
          <img
            src={thumbnail}
            alt={title}
            className="product-thumb"
            loading="lazy"
            width="230"
            height="170"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='230' height='170'><rect width='100%25' height='100%25' fill='%23e3e5e9'/></svg>";
            }}
          />
        </Link>
        <button
          className={`fav-btn ${isFavorite ? "fav-btn-active" : ""}`}
          onClick={() => onToggleFavorite(id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
        {discountPercentage > 0 && (
          <span className="discount-badge">-{Math.round(discountPercentage)}%</span>
        )}
      </div>

      <div className="product-body">
        <p className="product-category">{category}</p>
        <h3 className="product-title" title={title}>
          {title}
        </h3>

        <div className="product-price-row">
          <span className="product-price-discounted">${discountedPrice}</span>
          {discountPercentage > 0 && (
            <span className="product-price-original">${price.toFixed(2)}</span>
          )}
        </div>

        <div className="product-meta-row">
          <span className="product-rating">⭐ {rating}</span>
          <span className={`product-stock ${inStock ? "in-stock" : "out-stock"}`}>
            {inStock ? `${stock} in stock` : "Out of stock"}
          </span>
        </div>

        <div className="product-card-actions">
          <button
            className="btn btn-primary btn-block"
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
          <div className="product-card-actions-row">
            <Link to={`/products/${id}`} className="btn btn-secondary btn-block">
              View Details
            </Link>
            <button
              className={`btn btn-compare ${isComparing ? "btn-compare-active" : ""}`}
              onClick={() => onToggleCompare(product)}
              title={isComparing ? "Remove from comparison" : "Add to comparison"}
            >
              {isComparing ? "✓ Compare" : "+ Compare"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
