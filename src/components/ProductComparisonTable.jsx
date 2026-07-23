import "./ProductComparisonTable.css";

function getDiscountedPrice(price, discountPercentage) {
  return (price - (price * discountPercentage) / 100).toFixed(2);
}

const ROWS = [
  { key: "image", label: "" },
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "brand", label: "Brand" },
  { key: "price", label: "Price" },
  { key: "discountedPrice", label: "Discounted Price" },
  { key: "rating", label: "Rating" },
  { key: "stock", label: "Stock" },
  { key: "warrantyInformation", label: "Warranty" },
  { key: "shippingInformation", label: "Shipping" },
];

function ProductComparisonTable({ products, onRemove }) {
  return (
    <div className="compare-table-wrap">
      <table className="compare-table">
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key}>
              <th>{row.label}</th>
              {products.map((product) => (
                <td key={product.id}>
                  {row.key === "image" && (
                    <div className="compare-image-cell">
                      <img src={product.thumbnail} alt={product.title} />
                      <button
                        className="compare-remove-btn"
                        onClick={() => onRemove(product.id)}
                        aria-label={`Remove ${product.title} from comparison`}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {row.key === "price" && `$${product.price.toFixed(2)}`}
                  {row.key === "discountedPrice" &&
                    `$${getDiscountedPrice(product.price, product.discountPercentage)}`}
                  {row.key === "rating" && `⭐ ${product.rating}`}
                  {row.key === "stock" &&
                    (product.stock > 0 ? `${product.stock} available` : "Out of stock")}
                  {!["image", "price", "discountedPrice", "rating", "stock"].includes(
                    row.key
                  ) && (product[row.key] || "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductComparisonTable;
