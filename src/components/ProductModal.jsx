import { useEffect, useState } from "react";
import "./ProductModal.css";

function getDiscountedPrice(price, discountPercentage) {
  const discounted = price - (price * discountPercentage) / 100;
  return discounted.toFixed(2);
}

function ProductModal({ product, onClose }) {
  const [activeImage, setActiveImage] = useState(0);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

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
    images,
  } = product;

  const gallery = images && images.length > 0 ? images : [product.thumbnail];
  const discountedPrice = getDiscountedPrice(price, discountPercentage);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close details">
          ✕
        </button>

        <div className="modal-body">
          <div className="modal-gallery">
            <img
              src={gallery[activeImage]}
              alt={`${title} - view ${activeImage + 1}`}
              className="modal-main-image"
            />
            {gallery.length > 1 && (
              <div className="modal-thumbs">
                {gallery.map((img, index) => (
                  <button
                    key={img + index}
                    className={`modal-thumb-btn ${
                      index === activeImage ? "modal-thumb-active" : ""
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

          <div className="modal-info">
            <p className="modal-category">
              {category} {brand ? `· ${brand}` : ""}
            </p>
            <h2 className="modal-title">{title}</h2>
            <p className="modal-rating">⭐ {rating} rating</p>

            <div className="modal-price-row">
              <span className="modal-price-discounted">${discountedPrice}</span>
              {discountPercentage > 0 && (
                <>
                  <span className="modal-price-original">${price.toFixed(2)}</span>
                  <span className="modal-discount-pct">
                    {Math.round(discountPercentage)}% off
                  </span>
                </>
              )}
            </div>

            <p className="modal-description">{description}</p>

            <ul className="modal-detail-list">
              <li>
                <strong>Stock:</strong> {stock > 0 ? `${stock} available` : "Out of stock"}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
