"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "@/lib/firestore";
import { IS_DEMO } from "@/lib/firebase";
import type { Product, Category } from "@/types";
import ProductModal from "@/components/admin/ProductModal";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminLoading from "@/components/admin/AdminLoading";

function formatPrice(n: number) {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const getCatName = (catId: string) =>
    categories.find((c) => c.id === catId)?.name ?? catId;

  const handleSave = async (data: Omit<Product, "id">) => {
    if (editing) {
      await updateProduct(editing.id, data);
      if (IS_DEMO) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...data } : p))
        );
      } else {
        await load();
      }
    } else {
      const id = await addProduct(data);
      if (IS_DEMO) {
        setProducts((prev) => [...prev, { id, ...data }]);
      } else {
        await load();
      }
    }
    setEditing(null);
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setDeleting(id);
    await deleteProduct(id);
    if (IS_DEMO) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      await load();
    }
    setDeleting(null);
  };

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setModalOpen(true);
  };

  return (
    <>
      <AdminTopbar title="Productos" />

      <div className="admin-page">
        <div className="page-header">
          <h2 className="page-title">Gestión de productos</h2>
          <button type="button" className="btn btn-cyan" onClick={openNew}>
            + Nuevo producto
          </button>
        </div>

        {loading ? (
          <AdminLoading />
        ) : products.length === 0 ? (
          <p className="admin-empty">No hay productos.</p>
        ) : (
          <div className="table-wrap">
            <div className="table-overflow-x">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Descuento</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <div className="admin-table-product">
                          {prod.imageUrl && (
                            <div className="admin-table-thumb">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={prod.imageUrl} alt="" />
                            </div>
                          )}
                          <span className="admin-table-name">{prod.name}</span>
                        </div>
                      </td>
                      <td>{getCatName(prod.category)}</td>
                      <td>
                        <span className="admin-table-price">{formatPrice(prod.price)}</span>
                      </td>
                      <td>
                        {prod.discountPercentage > 0 ? (
                          <span className="price-discount-tag">
                            -{prod.discountPercentage}%
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${prod.active ? "badge-active" : "badge-inactive"}`}>
                          {prod.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(prod)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(prod.id)}
                            disabled={deleting === prod.id}
                          >
                            {deleting === prod.id ? "..." : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <ProductModal
          product={editing}
          categories={categories}
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}
