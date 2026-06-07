"use client";

import { useState } from "react";
import type { Product, Category } from "@/types";

interface Props {
  product?: Product | null;
  categories: Category[];
  onSave: (data: Omit<Product, "id">) => Promise<void>;
  onClose: () => void;
}

export default function ProductModal({
  product,
  categories,
  onSave,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    category: product?.category ?? (categories[0]?.id ?? ""),
    price: product?.price ?? 0,
    discountPercentage: product?.discountPercentage ?? 0,
    imageUrl: product?.imageUrl ?? "",
    variantsRaw: product?.variants?.join(", ") ?? "",
    active: product?.active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "El nombre es requerido.";
    if (form.price <= 0) e.price = "El precio debe ser mayor a 0.";
    if (form.discountPercentage < 0 || form.discountPercentage > 100)
      e.discountPercentage = "El descuento debe estar entre 0 y 100.";
    if (!form.category) e.category = "Seleccioná una categoría.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      const variants = form.variantsRaw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      await onSave({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        discountPercentage: Number(form.discountPercentage),
        imageUrl: form.imageUrl.trim(),
        variants,
        active: form.active,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">
            {product ? "Editar Producto" : "Nuevo Producto"}
          </span>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: Remera Akatsuki"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                autoFocus
              />
              {errors.name && (
                <span style={{ fontSize: "0.75rem", color: "#ff5252" }}>
                  {errors.name}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-textarea"
                placeholder="Descripción del producto..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Categoría *</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span style={{ fontSize: "0.75rem", color: "#ff5252" }}>
                  {errors.category}
                </span>
              )}
            </div>

            {/* Price + Discount row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div className="form-group">
                <label className="form-label">Precio Base (ARS) *</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  step={100}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
                {errors.price && (
                  <span style={{ fontSize: "0.75rem", color: "#ff5252" }}>
                    {errors.price}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Descuento Individual (%)</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  max={100}
                  step={1}
                  value={form.discountPercentage}
                  onChange={(e) => set("discountPercentage", e.target.value)}
                />
                {errors.discountPercentage && (
                  <span style={{ fontSize: "0.75rem", color: "#ff5252" }}>
                    {errors.discountPercentage}
                  </span>
                )}
              </div>
            </div>

            {/* Price preview */}
            {Number(form.discountPercentage) > 0 && Number(form.price) > 0 && (
              <div
                style={{
                  padding: "0.6rem 0.9rem",
                  background: "rgba(0,240,255,0.06)",
                  border: "1px solid rgba(0,240,255,0.15)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.8rem",
                  color: "var(--neon-cyan)",
                }}
              >
                Precio final con descuento:{" "}
                <strong>
                  ${(
                    Number(form.price) *
                    (1 - Number(form.discountPercentage) / 100)
                  ).toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                </strong>
              </div>
            )}

            {/* Image URL */}
            <div className="form-group">
              <label className="form-label">URL de Imagen</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://i.ibb.co/ejemplo/imagen.jpg"
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "0.3rem",
                  padding: "0.6rem 0.8rem",
                  background: "rgba(0,240,255,0.04)",
                  border: "1px solid rgba(0,240,255,0.12)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <span style={{ fontSize: "1rem" }}>💡</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  ¿Sin hosting de imágenes?{" "}
                  <a
                    href="https://imgbb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--neon-cyan)",
                      textDecoration: "none",
                      fontWeight: 600,
                      textShadow: "0 0 6px rgba(0,240,255,0.4)",
                    }}
                  >
                    ImgBB.com
                  </a>
                  {" "}— subí tu imagen gratis, copiá el{" "}
                  <strong style={{ color: "var(--text-secondary)" }}>Direct link</strong>
                  {" "}y pegalo acá.
                </span>
              </div>
            </div>

            {/* Variants */}
            <div className="form-group">
              <label className="form-label">
                Variantes / Opciones
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: S, M, L, XL  o  Goku, Vegeta, Gohan"
                value={form.variantsRaw}
                onChange={(e) => set("variantsRaw", e.target.value)}
              />
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Separadas por comas. Dejar vacío si no aplica.
              </span>
            </div>

            {/* Active */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => set("active", e.target.checked)}
                style={{ accentColor: "var(--neon-cyan)", width: "16px", height: "16px" }}
              />
              <span
                className="form-label"
                style={{ textTransform: "none", letterSpacing: 0, color: "var(--text-secondary)" }}
              >
                Activo (visible en el catálogo)
              </span>
            </label>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-cyan"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
