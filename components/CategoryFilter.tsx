"use client";

import { useState, useEffect, useRef } from "react";
import type { Category } from "@/types";

interface Props {
  categories: Category[];
}

export default function CategoryFilter({ categories }: Props) {
  const [active, setActive] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    const handler = (e: Event) => {
      setActive((e as CustomEvent<string>).detail);
    };
    window.addEventListener("categoryFilterChange", handler);
    return () => window.removeEventListener("categoryFilterChange", handler);
  }, []);

  const handleClick = (id: string) => {
    if (drag.current.moved) return; // блокуем клик если было перетаскивание
    setActive(id);
    window.dispatchEvent(
      new CustomEvent("categoryFilterChange", { detail: id })
    );
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, moved: false };
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!drag.current.active || !el) return;
    const x = e.pageX - el.offsetLeft;
    const delta = x - drag.current.startX;
    if (Math.abs(delta) > 5) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - delta;
  };

  const onMouseUp = () => {
    const el = scrollRef.current;
    drag.current.active = false;
    if (el) { el.style.cursor = ""; el.style.userSelect = ""; }
    // Reset moved flag after click handlers fire
    setTimeout(() => { drag.current.moved = false; }, 0);
  };

  return (
    <nav className="category-filter" aria-label="Filtrar por categoría">
      <div className="container">
        <div
          ref={scrollRef}
          className="category-filter-inner"
          role="tablist"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
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
