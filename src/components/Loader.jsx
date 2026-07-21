import "./Loader.css";

/**
 * Skeleton card grid shown while products are being fetched.
 * Using skeleton cards (instead of a bare spinner) keeps the
 * page layout stable and feels faster to the user.
 */
function Loader({ count = 8 }) {
  return (
    <div className="skeleton-grid" role="status" aria-label="Loading products">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton skeleton-img" />
          <div className="skeleton skeleton-line skeleton-line-lg" />
          <div className="skeleton skeleton-line skeleton-line-sm" />
          <div className="skeleton skeleton-line skeleton-line-sm" />
        </div>
      ))}
    </div>
  );
}

export default Loader;
