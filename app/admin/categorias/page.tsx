"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/firestore";
import { IS_DEMO } from "@/lib/firebase";
import type { Category } from "@/types";
import CategoryModal from "@/components/admin/CategoryModal";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminLoading from "@/components/admin/AdminLoading";

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data: { name: string; active: boolean }) => {
    if (editing) {
      await updateCategory(editing.id, data);
      if (IS_DEMO) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editing.id ? { ...c, ...data } : c))
        );
      } else {
        await load();
      }
    } else {
      const id = await addCategory(data);
      if (IS_DEMO) {
        setCategories((prev) => [...prev, { id, ...data }]);
      } else {
        await load();
      }
    }
    setEditing(null);
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría?")) return;
    setDeleting(id);
    await deleteCategory(id);
    if (IS_DEMO) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      await load();
    }
    setDeleting(null);
  };

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setModalOpen(true);
  };

  return (
    <>
      <AdminTopbar title="Categorías" />

      <div className="admin-page">
        <div className="page-header">
          <h2 className="page-title">Gestión de categorías</h2>
          <button type="button" className="btn btn-cyan" onClick={openNew}>
            + Nueva categoría
          </button>
        </div>

        {loading ? (
          <AdminLoading />
        ) : categories.length === 0 ? (
          <p className="admin-empty">No hay categorías.</p>
        ) : (
          <div className="table-wrap">
            <div className="table-overflow-x">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>
                        <span className="admin-table-name">{cat.name}</span>
                      </td>
                      <td>
                        <span className={`badge ${cat.active ? "badge-active" : "badge-inactive"}`}>
                          {cat.active ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(cat)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(cat.id)}
                            disabled={deleting === cat.id}
                          >
                            {deleting === cat.id ? "..." : "Eliminar"}
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
        <CategoryModal
          category={editing}
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
