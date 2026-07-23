function escapeCsv(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function exportProductsToCsv(products) {
  const rows = [
    [
      "Title",
      "Category",
      "Brand",
      "Price",
      "Discount",
      "Discounted Price",
      "Rating",
      "Stock",
      "Availability",
    ],
    ...products.map((product) => {
      const discountedPrice = (
        product.price - (product.price * product.discountPercentage) / 100
      ).toFixed(2);
      return [
        product.title,
        product.category,
        product.brand,
        product.price.toFixed(2),
        `${product.discountPercentage}%`,
        discountedPrice,
        product.rating,
        product.stock,
        product.stock > 0 ? "In Stock" : "Out of Stock",
      ];
    }),
  ];

  const csvContent = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "products.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default exportProductsToCsv;
