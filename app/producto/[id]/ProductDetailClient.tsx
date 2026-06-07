"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { validateCoupon } from "@/lib/firestore";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "549XXXXXXXXXX";

interface Props {
  product: Product;
  categoryName: string;
}

function formatPrice(n: number) {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export default function ProductDetailClient({ product, categoryName }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [couponInput, setCouponInput] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [appliedCode, setAppliedCode] = useState<string>("");
  const [couponStatus, setCouponStatus] = useState<
    "idle" | "valid" | "invalid" | "loading"
  >("idle");

  const basePrice = product.price;
  const hasIndividualDiscount = product.discountPercentage > 0;
  const priceAfterDiscount = hasIndividualDiscount
    ? basePrice * (1 - product.discountPercentage / 100)
    : basePrice;
  const finalPrice = priceAfterDiscount * (1 - couponDiscount / 100);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponStatus("loading");
    const coupon = await validateCoupon(couponInput.trim());
    if (coupon) {
      setCouponDiscount(coupon.discount);
      setAppliedCode(coupon.code);
      setCouponStatus("valid");
    } else {
      setCouponDiscount(0);
      setAppliedCode("");
      setCouponStatus("invalid");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponInput("");
    setCouponDiscount(0);
    setAppliedCode("");
    setCouponStatus("idle");
  };

  const buildWhatsAppUrl = () => {
    const lines = [
      `*Hola Seaworthouse!*`,
      ``,
      `Me interesa el siguiente producto:`,
      `*Producto:* ${product.name}`,
      `*Variante:* ${selectedVariant}`,
    ];
    if (appliedCode) {
      lines.push(`*Cupon:* ${appliedCode} (-${couponDiscount}%)`);
    }
    lines.push(`*Total:* ${formatPrice(finalPrice)}`);
    lines.push(``);
    lines.push(`Esta disponible?`);
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link href="/" className="navbar-brand">
            SEA<span>WORTH</span>HOUSE
          </Link>
          <Link
            href="/"
            style={{
              fontSize: "0.68rem",
              fontFamily: "var(--font-display)",
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
          >
            ← Catálogo
          </Link>
        </div>
      </nav>

      <main className="product-detail">
        <div className="container">
          <div className="product-detail-grid">
            {/* Image */}
            <div className="product-detail-image-wrap">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    fontSize: "4rem",
                  }}
                >
                  📦
                </div>
              )}
            </div>

            {/* Info */}
            <div className="product-detail-info">
              <div>
                <p className="product-detail-category">{categoryName}</p>
                <h1 className="product-detail-name">{product.name}</h1>
              </div>

              <p className="product-detail-desc">{product.description}</p>

              {/* Price Block */}
              <div className="price-block">
                <p className="price-block-label">Precio</p>

                {hasIndividualDiscount && (
                  <div className="price-block-row">
                    <span>Precio base</span>
                    <span className="price-original">{formatPrice(basePrice)}</span>
                  </div>
                )}

                {hasIndividualDiscount && (
                  <div className="price-block-row">
                    <span>
                      Descuento{" "}
                      <span className="price-discount-tag">
                        -{product.discountPercentage}%
                      </span>
                    </span>
                    <span className="price-block-value" style={{ color: "var(--neon-magenta)" }}>
                      {formatPrice(priceAfterDiscount)}
                    </span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <>
                    <div className="divider" />
                    <div className="price-block-row">
                      <span>
                        Cupón{" "}
                        <span className="price-discount-tag" style={{ borderColor: "var(--neon-cyan-dim)", color: "var(--neon-cyan)" }}>
                          {appliedCode} -{couponDiscount}%
                        </span>
                      </span>
                    </div>
                  </>
                )}

                <div className="divider" />
                <div className="price-block-row">
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    Total
                  </span>
                  <span className="price-final">{formatPrice(finalPrice)}</span>
                </div>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <p
                    className="form-label"
                    style={{ marginBottom: "0.5rem" }}
                  >
                    Opciones / Variantes
                  </p>
                  <div className="variant-options">
                    {product.variants.map((v) => (
                      <button
                        key={v}
                        className={`variant-btn${selectedVariant === v ? " selected" : ""}`}
                        onClick={() => setSelectedVariant(v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  {!selectedVariant && (
                    <p
                      style={{
                        marginTop: "0.4rem",
                        fontSize: "0.75rem",
                        color: "var(--neon-magenta)",
                        opacity: 0.8,
                      }}
                    >
                      * Seleccioná una variante para continuar
                    </p>
                  )}
                </div>
              )}

              {/* Coupon */}
              <div className="form-group">
                <label className="form-label">Código promocional</label>
                {couponStatus === "valid" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        flex: 1,
                        padding: "0.65rem 0.9rem",
                        background: "rgba(0,230,118,0.08)",
                        border: "1px solid rgba(0,230,118,0.3)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.9rem",
                        color: "#00e676",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                      }}
                    >
                      {appliedCode} — {couponDiscount}% OFF ✓
                    </span>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={handleRemoveCoupon}
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <div className="coupon-row">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: OTAKU10"
                      value={couponInput}
                      onChange={(e) =>
                        setCouponInput(e.target.value.toUpperCase())
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      style={{ textTransform: "uppercase" }}
                    />
                    <button
                      className="btn btn-cyan btn-sm"
                      onClick={handleApplyCoupon}
                      disabled={couponStatus === "loading" || !couponInput.trim()}
                    >
                      {couponStatus === "loading" ? "..." : "Aplicar"}
                    </button>
                  </div>
                )}
                {couponStatus === "invalid" && (
                  <p className="coupon-feedback error">
                    Código inválido o inactivo.
                  </p>
                )}
              </div>

              {/* WhatsApp CTA */}
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-whatsapp btn-full${!selectedVariant && product.variants?.length ? " disabled" : ""}`}
                onClick={(e) => {
                  if (!selectedVariant && product.variants?.length) {
                    e.preventDefault();
                  }
                }}
                style={
                  !selectedVariant && product.variants?.length
                    ? { pointerEvents: "none", opacity: 0.4 }
                    : {}
                }
                aria-disabled={!selectedVariant && !!product.variants?.length}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Pedir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
