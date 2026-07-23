import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../pages/Home";

const mockProducts = [
  {
    id: 1,
    title: "Alpha Lamp",
    category: "beauty",
    brand: "Brand A",
    price: 20,
    discountPercentage: 5,
    rating: 4,
    stock: 10,
    thumbnail: "https://example.com/a.png",
  },
  {
    id: 2,
    title: "Beta Chair",
    category: "furniture",
    brand: "Brand B",
    price: 120,
    discountPercentage: 10,
    rating: 5,
    stock: 3,
    thumbnail: "https://example.com/b.png",
  },
];

const cart = {
  cartCount: 2,
  addToCart: vi.fn(),
};

const favorites = {
  favoriteIds: [1],
  toggleFavorite: vi.fn(),
};

const comparison = {
  compareItems: [],
  compareError: "",
  isComparing: () => false,
  addToCompare: vi.fn(),
  removeFromCompare: vi.fn(),
};

vi.mock("../hooks/useProducts", () => ({
  useProducts: () => ({
    products: mockProducts,
    categories: [{ slug: "beauty", name: "Beauty" }, { slug: "furniture", name: "Furniture" }],
    loading: false,
    error: null,
    retry: vi.fn(),
  }),
}));

describe("Home page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders product cards", () => {
    render(
      <MemoryRouter>
        <Home cart={cart} favorites={favorites} comparison={comparison} />
      </MemoryRouter>
    );

    expect(screen.getByText("Alpha Lamp")).toBeInTheDocument();
    expect(screen.getByText("Beta Chair")).toBeInTheDocument();
  });

  it("filters product cards by search term", () => {
    render(
      <MemoryRouter initialEntries={["/?search=chair"]}>
        <Home cart={cart} favorites={favorites} comparison={comparison} />
      </MemoryRouter>
    );

    expect(screen.getByText("Beta Chair")).toBeInTheDocument();
    expect(screen.queryByText("Alpha Lamp")).not.toBeInTheDocument();
  });
});
