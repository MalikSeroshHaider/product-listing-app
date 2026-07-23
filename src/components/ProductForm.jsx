import { useState } from "react";

function ProductForm({ initialValues = {}, onSubmit, submitLabel = "Save" }) {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.title?.trim()) return "Title is required.";
    if (!form.description?.trim()) return "Description is required.";
    if (!form.category?.trim()) return "Category is required.";
    if (!form.brand?.trim()) return "Brand is required.";
    if (!form.price && form.price !== 0) return "Price is required.";
    if (!form.rating && form.rating !== 0) return "Rating is required.";
    if (!form.stock && form.stock !== 0) return "Stock is required.";
    if (!form.thumbnail?.trim()) return "Thumbnail URL is required.";
    if (Number(form.price) < 0) return "Price cannot be negative.";
    if (Number(form.stock) < 0) return "Stock cannot be negative.";
    if (Number(form.rating) < 0 || Number(form.rating) > 5) return "Rating must be between 0 and 5.";
    return "";
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }
    setError("");
    onSubmit(form);
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <label>
        Product title
        <input name="title" value={form.title || ""} onChange={handleChange} />
      </label>
      <label>
        Description
        <textarea name="description" value={form.description || ""} onChange={handleChange} />
      </label>
      <label>
        Category
        <input name="category" value={form.category || ""} onChange={handleChange} />
      </label>
      <label>
        Brand
        <input name="brand" value={form.brand || ""} onChange={handleChange} />
      </label>
      <label>
        Price
        <input type="number" name="price" min="0" value={form.price || ""} onChange={handleChange} />
      </label>
      <label>
        Discount percentage
        <input type="number" name="discountPercentage" min="0" max="100" value={form.discountPercentage || ""} onChange={handleChange} />
      </label>
      <label>
        Rating
        <input type="number" name="rating" min="0" max="5" step="0.1" value={form.rating || ""} onChange={handleChange} />
      </label>
      <label>
        Stock
        <input type="number" name="stock" min="0" value={form.stock || ""} onChange={handleChange} />
      </label>
      <label>
        Thumbnail URL
        <input name="thumbnail" value={form.thumbnail || ""} onChange={handleChange} />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn btn-primary">{submitLabel}</button>
    </form>
  );
}

export default ProductForm;
