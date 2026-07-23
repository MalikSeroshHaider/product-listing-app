import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchProductById } from "../services/productApi";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";
import ConfirmationModal from "../components/ConfirmationModal";
import ReviewSection from "../components/ReviewSection";
import "./ProductDetails.css";

function getDiscountedPrice(price, discountPercentage) {
  return (price - (price * discountPercentage) / 100).toFixed(2);
}

function ProductDetails({ favorites, cart, comparison }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [localProducts, setLocalProducts] = useLocalStorage("product-hub-local-products", []);
  const { addRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  async function loadProduct(signal) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductById(id, signal);
      setProduct(data);
      setActiveImage(0);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError(err.message || "Unable to load this product.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadProduct(controller.signal);

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (product?.id) {
      addRecentlyViewed(product.id);
    }
  }, [product, addRecentlyViewed]);

  if (loading) {
    return (
      <main className="page-content">
        <Loader count={1} />
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-content">
        {error === "Product not found" ? (
          <EmptyState
            icon="🚫"
            title="Product not found"
            message="This product may have been removed."
            actionLabel="Back to Products"
            actionTo="/"
          />
        ) : (
          <ErrorMessage message={error} onRetry={loadProduct} />
        )}
      </main>
    );
  }

  if (!product) return null;

  const {
    title,
    description,
    category,
    brand,
    price,
    discountPercentage,
    rating,
    stock,
    warrantyInformation,
    shippingInformation,
    availabilityStatus,
    images,
  } = product;

  const gallery = images && images.length > 0 ? images : [product.thumbnail];
  const discountedPrice = getDiscountedPrice(price, discountPercentage);
  const inStock = stock > 0;
  const isFavorite = favorites.isFavorite(product.id);

  return (
    <main className="page-content">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Products
      </button>

      <div className="details-layout">
        <div className="details-gallery">
          <img src={gallery[activeImage]} alt={title} className="details-main-image" />
          {gallery.length > 1 && (
            <div className="details-thumbs">
              {gallery.map((img, index) => (
                <button
                  key={img + index}
                  className={`details-thumb-btn ${
                    index === activeImage ? "details-thumb-active" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show image ${index + 1}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="details-info">
          <p className="details-category">
            {category} {brand ? `· ${brand}` : ""}
          </p>
          <h1 className="details-title">{title}</h1>
          <p className="details-rating">⭐ {rating} rating</p>

          <div className="details-price-row">
            <span className="details-price-discounted">${discountedPrice}</span>
            {discountPercentage > 0 && (
              <>
                <span className="details-price-original">${price.toFixed(2)}</span>
                <span className="details-discount-pct">
                  {Math.round(discountPercentage)}% off
                </span>
              </>
            )}
          </div>

          <p className="details-description">{description}</p>

          <ul className="details-list">
            <li>
              <strong>Availability:</strong>{" "}
              {availabilityStatus || (inStock ? "In Stock" : "Out of Stock")}
            </li>
            <li>
              <strong>Stock:</strong> {inStock ? `${stock} available` : "Out of stock"}
            </li>
            {warrantyInformation && (
              <li>
                <strong>Warranty:</strong> {warrantyInformation}
              </li>
            )}
            {shippingInformation && (
              <li>
                <strong>Shipping:</strong> {shippingInformation}
              </li>
            )}
          </ul>

          <div className="details-actions">
            <button
              className="btn btn-primary details-cart-btn"
              disabled={!inStock}
              onClick={() => cart.addToCart(product)}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </button>
            <button
              className={`btn btn-fav-toggle ${isFavorite ? "btn-fav-active" : ""}`}
              onClick={() => favorites.toggleFavorite(product.id)}
            >
              {isFavorite ? "❤️ In Favorites" : "🤍 Add to Favorites"}
            </button>
            {product.isLocal && (
              <>
                <Link to={`/products/${product.id}/edit`} className="btn btn-secondary">
                  Edit Product
                </Link>
                <button className="btn btn-danger" onClick={() => setConfirmDeleteOpen(true)}>
                  Delete Product
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ReviewSection product={product} />

      <ConfirmationModal
        open={confirmDeleteOpen}
        title="Delete this product?"
        message="This local product will be removed from the listing, cart, favorites, and comparison state."
        confirmLabel="Delete"
        onConfirm={() => {
          setLocalProducts((prev) => prev.filter((item) => item.id !== product.id));
          cart.removeFromCart(product.id);
          favorites.removeFavorite(product.id);
          comparison.removeFromCompare(product.id);
          setConfirmDeleteOpen(false);
          navigate("/");
        }}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </main>
  );
}

export default ProductDetails;
