import { getActiveProducts, getActiveCategories } from "@/lib/firestore";
import { IS_DEMO } from "@/lib/firebase";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import ProductGrid from "@/components/ProductGrid";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getActiveProducts(),
    getActiveCategories(),
  ]);

  return (
    <div className="hud-shell">
      <header className="navbar">
        <div className="container navbar-inner">
          {IS_DEMO && (
            <nav aria-label="Modo demostración">
              <span className="navbar-demo-badge" aria-label="Modo demostración">
                DEMO
              </span>
            </nav>
          )}
        </div>
      </header>

      <main className="hud-main">
        <HeroSection />

        <CategoryFilter categories={categories} />

        <section className="product-section" aria-labelledby="catalog-heading">
          <div className="container">
            <header className="product-section-header">
              <h2 id="catalog-heading" className="product-section-title">
                Catálogo
              </h2>
              <div className="product-section-line" role="presentation" />
            </header>
            <ProductGrid products={products} categories={categories} />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p className="footer-brand">SEAWORTHOUSE</p>
          <p className="footer-sub">
            © {new Date().getFullYear()} シーワースハウス · Todos los derechos reservados
          </p>
          <p className="footer-credit">
            Desarrollado por{" "}
            <a
              href="https://solvearg.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-credit-link"
            >
              SolveArg.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}