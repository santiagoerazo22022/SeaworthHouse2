"use client";

import { useEffect, useState } from "react";
import { getProducts, getCategories, getCoupons } from "@/lib/firestore";
import { IS_DEMO } from "@/lib/firebase";
import Link from "next/link";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminLoading from "@/components/admin/AdminLoading";

const quickLinks = [
  { href: "/admin/productos", label: "Productos", code: "PRD", accent: "cyan" as const },
  { href: "/admin/categorias", label: "Categorías", code: "CAT", accent: "magenta" as const },
  { href: "/admin/cupones", label: "Cupones", code: "CPN", accent: "cyan" as const },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    categories: 0,
    coupons: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [products, cats, coupons] = await Promise.all([
        getProducts(),
        getCategories(),
        getCoupons(),
      ]);
      setStats({
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.active).length,
        categories: cats.length,
        coupons: coupons.filter((c) => c.active).length,
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <AdminTopbar title="Dashboard" />

      <div className="admin-page">
        {loading ? (
          <AdminLoading />
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-label">Total productos</div>
                <div className="stat-card-value">{stats.totalProducts}</div>
              </div>
              <div className="stat-card stat-card--magenta">
                <div className="stat-card-label">Activos</div>
                <div className="stat-card-value">{stats.activeProducts}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-label">Categorías</div>
                <div className="stat-card-value">{stats.categories}</div>
              </div>
              <div className="stat-card stat-card--magenta">
                <div className="stat-card-label">Cupones activos</div>
                <div className="stat-card-value">{stats.coupons}</div>
              </div>
            </div>

            <section className="admin-section" aria-labelledby="quick-links-heading">
              <h2 id="quick-links-heading" className="admin-section-title">
                Accesos rápidos
              </h2>
              <div className="admin-quick-links">
                {quickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-quick-link admin-quick-link--${item.accent}`}
                  >
                    <span className="admin-quick-link-code">{item.code}</span>
                    <span className="admin-quick-link-label">{item.label}</span>
                  </Link>
                ))}
              </div>
            </section>

            {IS_DEMO && (
              <div className="admin-notice admin-notice--magenta">
                <strong>Modo demo activo.</strong> Los cambios no se guardan en base de
                datos. Configurá{" "}
                <code className="admin-code">.env.local</code> con Firebase para producción.
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
