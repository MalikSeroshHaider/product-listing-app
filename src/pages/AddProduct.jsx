import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

const initialForm = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  discountPercentage: "",
  rating: "",
  stock: "",
  thumbnail: "",
};

function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [localProducts, setLocalProducts] = useLocalStorage("product-hub-local-products", []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const requiredFields = ["title", "description", "category", "brand", "price", "rating", "stock", "thumbnail"];
    for (const field of requiredFields) {
      if (!String(form[field]).trim()) {
        return `${field.replace(/([A-Z])/g, " $1")} is required.`;
      }
    }

    if (Number(form.price) < 0) return "Price cannot be negative.";
    if (Number(form.stock) < 0) return "Stock cannot be negative.";
    if (Number(form.rating) < 0 || Number(form.rating) > 5) return "Rating must be between 0 and 5.";
    if (Number(form.discountPercentage) < 0 || Number(form.discountPercentage) > 100) return "Discount percentage must be between 0 and 100.";

    return "";
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const nextProduct = {
      id: `local-${Date.now()}`,
      isLocal: true,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      discountPercentage: Number(form.discountPercentage || 0),
      rating: Number(form.rating),
      stock: Number(form.stock),
      thumbnail: form.thumbnail.trim(),
      images: [form.thumbnail.trim()],
      availabilityStatus: Number(form.stock) > 0 ? "In Stock" : "Out of Stock",
      warrantyInformation: "Local product warranty",
      shippingInformation: "Standard shipping",
    };

    setLocalProducts((prev) => [...prev, nextProduct]);
    setForm(initialForm);
    setError("");
    navigate("/");
  }

  return (
    <main className="page-content">
      <h2>Add Product</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Product title
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
          <input type="number" name="price" min="0" value={form.price} onChange={handleChange} />
        </label>
        <label>
          Discount percentage
          <input type="number" name="discountPercentage" min="0" max="100" value={form.discountPercentage} onChange={handleChange} />
        </label>
        <label>
          Rating
          <input type="number" name="rating" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} />
        </label>
        <label>
          Stock
          <input type="number" name="stock" min="0" value={form.stock} onChange={handleChange} />
        </label>
        <label>
          Thumbnail URL
          <input name="thumbnail" value={form.thumbnail} onChange={handleChange} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save Product</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </main>
  );
}

export default AddProduct;


