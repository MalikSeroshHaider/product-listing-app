import ProductComparisonTable from "../components/ProductComparisonTable";
import EmptyState from "../components/EmptyState";

function Compare({ comparison }) {
  const { compareItems, removeFromCompare, clearCompare, maxCompare } = comparison;

  return (
    <main className="page-content">
      <div className="cart-header">
        <h2>Compare Products</h2>
        {compareItems.length > 0 && (
          <button className="cart-clear-btn" onClick={clearCompare}>
            Clear All
          </button>
        )}
      </div>

      {compareItems.length === 0 ? (
        <EmptyState
          icon="⚖️"
          title="No products to compare"
          message={`Add up to ${maxCompare} products from the listing to compare them side by side.`}
          actionLabel="Browse Products"
          actionTo="/"
        />
      ) : (
        <ProductComparisonTable products={compareItems} onRemove={removeFromCompare} />
      )}
    </main>
  );
}

export default Compare;
