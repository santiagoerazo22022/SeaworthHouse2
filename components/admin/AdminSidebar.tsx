"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { IS_DEMO } from "@/lib/firebase";
import { auth } from "@/lib/firebase-client";

const navItems = [
  { href: "/admin", label: "Dashboard", code: "DSH" },
  { href: "/admin/productos", label: "Productos", code: "PRD" },
  { href: "/admin/categorias", label: "Categorías", code: "CAT" },
  { href: "/admin/cupones", label: "Cupones", code: "CPN" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (IS_DEMO) {
      sessionStorage.removeItem("admin_demo");
      router.push("/admin/login");
      return;
    }
    if (auth) await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <aside className="admin-sidebar" aria-label="Navegación admin">
      <div className="admin-sidebar-header">
        <Link href="/admin" className="admin-sidebar-brand">
          SEA<span>WORTH</span>HOUSE
        </Link>
        <p className="admin-sidebar-sub">Panel de control</p>
      </div>

      <nav className="admin-sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item${isActive ? " active" : ""}`}
            >
              <span className="admin-nav-code">{item.code}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-nav-item admin-nav-item--store" target="_blank" rel="noopener noreferrer">
          <span className="admin-nav-code">WEB</span>
          <span>Ver tienda</span>
        </Link>
        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
