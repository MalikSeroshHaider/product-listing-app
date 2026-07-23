import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

function ReviewSection({ product }) {
  const [reviews, setReviews] = useLocalStorage(`reviews-${product.id}`, []);
  const [form, setForm] = useState({ reviewerName: "", rating: "", comment: "" });
  const [error, setError] = useState("");

  const apiReviews = product.reviews || [];
  const allReviews = [...apiReviews, ...reviews];

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.reviewerName.trim() || !form.comment.trim()) {
      setError("Reviewer name and comment are required.");
      return;
    }

    const rating = Number(form.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    const newReview = {
      id: `local-${Date.now()}`,
      reviewerName: form.reviewerName.trim(),
      rating,
      comment: form.comment.trim(),
      date: new Date().toISOString(),
    };

    setReviews((prev) => [...prev, newReview]);
    setForm({ reviewerName: "", rating: "", comment: "" });
    setError("");
  }

  if (allReviews.length === 0) {
    return (
      <section className="details-reviews">
        <h3>Reviews</h3>
        <p>No reviews available yet.</p>
      </section>
    );
  }

  return (
    <section className="details-reviews">
      <h3>Reviews</h3>
      <div className="review-list">
        {allReviews.map((review) => (
          <article key={review.id || `${review.reviewerName}-${review.date}`} className="review-card">
            <div className="review-head">
              <strong>{review.reviewerName}</strong>
              <span>⭐ {review.rating}</span>
            </div>
            <p>{review.comment}</p>
            <small>{review.date ? new Date(review.date).toLocaleDateString() : "Recently added"}</small>
          </article>
        ))}
      </div>

      <form className="review-form" onSubmit={handleSubmit}>
        <label>
          Your name
          <input value={form.reviewerName} onChange={(e) => setForm({ ...form, reviewerName: e.target.value })} />
        </label>
        <label>
          Rating
          <input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
        </label>
        <label>
          Comment
          <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary">Add Review</button>
      </form>
    </section>
  );
}

export default ReviewSection;
