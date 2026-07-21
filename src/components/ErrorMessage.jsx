import "./ErrorMessage.css";

/**
 * Friendly error state with a Retry button.
 * `onRetry` is called when the user wants to re-attempt the fetch.
 */
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <p className="error-icon" aria-hidden="true">
        ⚠️
      </p>
      <h3>Something went wrong</h3>
      <p className="error-text">
        {message || "We couldn't load the products. Please check your connection and try again."}
      </p>
      <button className="btn btn-primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default ErrorMessage;
