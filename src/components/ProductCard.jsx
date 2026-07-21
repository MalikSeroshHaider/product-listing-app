import "./ProductCard.css";

function getDiscountedPrice(price, discountPercentage) {
  const discounted = price - (price * discountPercentage) / 100;
  return discounted.toFixed(2);
}

function ProductCard({ product, isFavorite, onToggleFavorite, onViewDetails }) {
  const {
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
        <img src={thumbnail} alt={title} className="product-thumb" loading="lazy" />
        <button
          className={`fav-btn ${isFavorite ? "fav-btn-active" : ""}`}
          onClick={() => onToggleFavorite(product.id)}
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

        <button className="btn btn-primary btn-block" onClick={() => onViewDetails(product)}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
