"use client";

import { useState, useEffect } from "react";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
}

export default function CategoryFilter({ categories }: Props) {
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    const handler = (e: Event) => {
      setActive((e as CustomEvent<string>).detail);
    };
    window.addEventListener("categoryFilterChange", handler);
    return () => window.removeEventListener("categoryFilterChange", handler);
  }, []);

  const handleClick = (id: string) => {
    setActive(id);
    window.dispatchEvent(
      new CustomEvent("categoryFilterChange", { detail: id })
    );
  };

  return (
    <nav className="category-filter" aria-label="Filtrar por categoría">
      <div className="container">
        <div className="category-filter-inner" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={active === "all"}
            className={`category-btn${active === "all" ? " active" : ""}`}
            onClick={() => handleClick("all")}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active === cat.id}
              className={`category-btn${active === cat.id ? " active" : ""}`}
              onClick={() => handleClick(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
