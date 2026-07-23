import { useMemo } from "react";
import "./ProductStatistics.css";

function ProductStatistics({ products, categories, favoritesCount, cartCount }) {
  const stats = useMemo(() => {
    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
    const averagePrice = products.length ? totalPrice / products.length : 0;
    const averageRating = products.length
      ? products.reduce((sum, product) => sum + product.rating, 0) / products.length
      : 0;
    const inStock = products.filter((product) => product.stock > 0).length;
    const outOfStock = products.length - inStock;

    return [
      { label: "Total Products", value: products.length },
      { label: "Total Categories", value: categories.length },
      { label: "Average Price", value: `$${averagePrice.toFixed(2)}` },
      { label: "Average Rating", value: averageRating.toFixed(1) },
      { label: "In Stock", value: inStock },
      { label: "Out of Stock", value: outOfStock },
      { label: "Favorite Products", value: favoritesCount },
      { label: "Cart Items", value: cartCount },
    ];
  }, [products, categories, favoritesCount, cartCount]);

  return (
    <section className="stats-shell" aria-label="Product statistics dashboard">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <span className="stat-label">{stat.label}</span>
          <strong className="stat-value">{stat.value}</strong>
        </div>
      ))}
    </section>
  );
}

export default ProductStatistics;
