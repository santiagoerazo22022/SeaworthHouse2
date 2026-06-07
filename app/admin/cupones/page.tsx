"use client";

import { useEffect, useState } from "react";
import {
  getCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/lib/firestore";
import { IS_DEMO } from "@/lib/firebase";
import type { Coupon } from "@/types";
import CouponModal from "@/components/admin/CouponModal";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminLoading from "@/components/admin/AdminLoading";

export default function CuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await getCoupons();
    setCoupons(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (data: Omit<Coupon, "id">) => {
    if (editing) {
      await updateCoupon(editing.id, data);
      if (IS_DEMO) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === editing.id ? { ...c, ...data } : c))
        );
      } else {
        await load();
      }
    } else {
      const id = await addCoupon(data);
      if (IS_DEMO) {
        setCoupons((prev) => [...prev, { id, ...data }]);
      } else {
        await load();
      }
    }
    setEditing(null);
    setModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este cupón?")) return;
    setDeleting(id);
    await deleteCoupon(id);
    if (IS_DEMO) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } else {
      await load();
    }
    setDeleting(null);
  };

  const handleToggle = async (coupon: Coupon) => {
    const updated = { ...coupon, active: !coupon.active };
    await updateCoupon(coupon.id, { active: updated.active });
    if (IS_DEMO) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? updated : c))
      );
    } else {
      await load();
    }
  };

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setModalOpen(true);
  };

  return (
    <>
      <AdminTopbar title="Cupones" />

      <div className="admin-page">
        <div className="page-header">
          <h2 className="page-title">Gestión de cupones</h2>
          <button type="button" className="btn btn-cyan" onClick={openNew}>
            + Nuevo cupón
          </button>
        </div>

        {loading ? (
          <AdminLoading />
        ) : coupons.length === 0 ? (
          <p className="admin-empty">No hay cupones.</p>
        ) : (
          <div className="table-wrap">
            <div className="table-overflow-x">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descuento</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>
                        <span className="admin-table-code">{coupon.code}</span>
                      </td>
                      <td>
                        <span className="price-discount-tag price-discount-tag--cyan">
                          -{coupon.discount}%
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`badge badge-toggle ${coupon.active ? "badge-active" : "badge-inactive"}`}
                          onClick={() => handleToggle(coupon)}
                          title="Click para alternar"
                        >
                          {coupon.active ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(coupon)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(coupon.id)}
                            disabled={deleting === coupon.id}
                          >
                            {deleting === coupon.id ? "..." : "Eliminar"}
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

        <div className="admin-notice">
          <strong>¿Cómo funcionan?</strong> Los clientes ingresan el código en la ficha de
          producto. El descuento se aplica sobre el precio ya descontado.{" "}
          <code className="admin-code">Final = Precio × (1 - Desc%) × (1 - Cupón%)</code>
        </div>
      </div>

      {modalOpen && (
        <CouponModal
          coupon={editing}
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
