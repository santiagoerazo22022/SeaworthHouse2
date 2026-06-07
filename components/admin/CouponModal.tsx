"use client";

import { useState } from "react";
import type { Coupon } from "@/types";

interface Props {
  coupon?: Coupon | null;
  onSave: (data: Omit<Coupon, "id">) => Promise<void>;
  onClose: () => void;
}

export default function CouponModal({ coupon, onSave, onClose }: Props) {
  const [code, setCode] = useState(coupon?.code ?? "");
  const [discount, setDiscount] = useState(coupon?.discount ?? 10);
  const [active, setActive] = useState(coupon?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) { setError("El código es requerido."); return; }
    if (discount <= 0 || discount > 100) { setError("El descuento debe estar entre 1 y 100."); return; }
    setSaving(true);
    try {
      await onSave({ code: code.trim().toUpperCase(), discount: Number(discount), active });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: "400px" }}>
        <div className="modal-header">
          <span className="modal-title">
            {coupon ? "Editar Cupón" : "Nuevo Cupón"}
          </span>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Código *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: KAMEHAMEHA"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{ textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-display)" }}
                required
                autoFocus
              />
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Se guardará en mayúsculas.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Descuento (%)</label>
              <input
                type="number"
                className="form-input"
                min={1}
                max={100}
                step={1}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                style={{ accentColor: "var(--neon-cyan)", width: "16px", height: "16px" }}
              />
              <span className="form-label" style={{ textTransform: "none", letterSpacing: 0, color: "var(--text-secondary)" }}>
                Activo (acepta este cupón)
              </span>
            </label>

            {error && (
              <p style={{ fontSize: "0.8rem", color: "#ff5252" }}>{error}</p>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-cyan" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
