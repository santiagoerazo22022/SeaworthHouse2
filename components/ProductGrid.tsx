"use client";

import { useState, useEffect } from "react";
import type { Product, Category } from "@/types";
import ProductCard from "./ProductCard";
import EmptyCatalogState from "./EmptyCatalogState";

interface Props {
  products: Product[];
  categories: Category[];
}

export default function ProductGrid({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const handler = (e: Event) => {
      setActiveCategory((e as CustomEvent<string>).detail);
    };
    window.addEventListener("categoryFilterChange", handler);
    return () => window.removeEventListener("categoryFilterChange", handler);
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name ?? catId;
  };

  if (filtered.length === 0) {
    const categoryName =
      activeCategory !== "all" ? getCategoryName(activeCategory) : null;

    return <EmptyCatalogState categoryName={categoryName} />;
  }

  return (
    <section className="product-grid" aria-label="Productos">
      {filtered.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categoryName={getCategoryName(product.category)}
        />
      ))}
    </section>
  );
}
