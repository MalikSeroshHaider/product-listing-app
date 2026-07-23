import { useState } from "react";
import "./PriceRangeFilter.css";

function PriceRangeFilter({ minPrice, maxPrice, onApply, onClear }) {
  const [minInput, setMinInput] = useState(minPrice ?? "");
  const [maxInput, setMaxInput] = useState(maxPrice ?? "");
  const [validationError, setValidationError] = useState("");

  function handleApply() {
    const min = minInput === "" ? null : Number(minInput);
    const max = maxInput === "" ? null : Number(maxInput);

    if (min !== null && max !== null && min > max) {
      setValidationError("Minimum price can't be greater than maximum price.");
      return;
    }

    setValidationError("");
    onApply(min, max);
  }

  function handleClear() {
    setMinInput("");
    setMaxInput("");
    setValidationError("");
    onClear();
  }

  const hasActiveFilter = minPrice !== null || maxPrice !== null;

  return (
    <div className="price-filter">
      <div className="price-filter-row">
        <label className="price-filter-label" htmlFor="min-price">
          Min Price
        </label>
        <input
          id="min-price"
          type="number"
          min="0"
          className="price-input"
          placeholder="$0"
          value={minInput}
          onChange={(e) => setMinInput(e.target.value)}
        />

        <label className="price-filter-label" htmlFor="max-price">
          Max Price
        </label>
        <input
          id="max-price"
          type="number"
          min="0"
          className="price-input"
          placeholder="Any"
          value={maxInput}
          onChange={(e) => setMaxInput(e.target.value)}
        />

        <button className="btn btn-primary price-apply-btn" onClick={handleApply}>
          Apply
        </button>
        {hasActiveFilter && (
          <button className="price-clear-btn" onClick={handleClear}>
            Clear Price Filter
          </button>
        )}
      </div>
      {validationError && <p className="price-filter-error">{validationError}</p>}
    </div>
  );
}

export default PriceRangeFilter;
