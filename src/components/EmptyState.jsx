import { Link } from "react-router-dom";
import "./EmptyState.css";

/**
 * Reusable empty-state block used by the product grid, cart,
 * favorites, compare, and product-not-found screens.
 */
function EmptyState({ icon = "🔎", title, message, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      <p className="empty-icon" aria-hidden="true">
        {icon}
      </p>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary empty-action">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
