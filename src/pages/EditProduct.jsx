import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [localProducts, setLocalProducts] = useLocalStorage("product-hub-local-products", []);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const product = localProducts.find((item) => item.id === id);
    if (!product) {
      navigate("/");
      return;
    }
    setForm({
      title: product.title,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      stock: product.stock,
      thumbnail: product.thumbnail,
    });
  }, [id, localProducts, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form) return;

    if (!form.title.trim() || !form.description.trim() || !form.category.trim() || !form.brand.trim()) {
      setError("All required fields must be filled in.");
      return;
    }

    if (Number(form.price) < 0 || Number(form.stock) < 0) {
      setError("Price and stock cannot be negative.");
      return;
    }

    if (Number(form.rating) < 0 || Number(form.rating) > 5) {
      setError("Rating must stay between 0 and 5.");
      return;
    }

    setLocalProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...form,
              price: Number(form.price),
              discountPercentage: Number(form.discountPercentage || 0),
              rating: Number(form.rating),
              stock: Number(form.stock),
              thumbnail: form.thumbnail.trim(),
              images: [form.thumbnail.trim()],
            }
          : item
      )
    );

    navigate("/");
  }

  if (!form) return null;

  return (
    <main className="page-content">
      <h2>Edit Product</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <label>
          Category
          <input name="category" value={form.category} onChange={handleChange} />
        </label>
        <label>
          Brand
          <input name="brand" value={form.brand} onChange={handleChange} />
        </label>
        <label>
          Price
          <input type="number" min="0" name="price" value={form.price} onChange={handleChange} />
        </label>
        <label>
          Discount percentage
          <input type="number" min="0" max="100" name="discountPercentage" value={form.discountPercentage} onChange={handleChange} />
        </label>
        <label>
          Rating
          <input type="number" min="0" max="5" step="0.1" name="rating" value={form.rating} onChange={handleChange} />
        </label>
        <label>
          Stock
          <input type="number" min="0" name="stock" value={form.stock} onChange={handleChange} />
        </label>
        <label>
          Thumbnail URL
          <input name="thumbnail" value={form.thumbnail} onChange={handleChange} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Update Product</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </main>
  );
}

export default EditProduct;
