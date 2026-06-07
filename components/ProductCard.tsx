import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

interface Props {
  product: Product;
  categoryName?: string;
}

function formatPrice(n: number) {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export default function ProductCard({ product, categoryName }: Props) {
  const hasDiscount = product.discountPercentage > 0;
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  return (
    <article className="product-card">
      <span className="product-card-corner product-card-corner--tl" aria-hidden="true" />
      <span className="product-card-corner product-card-corner--br" aria-hidden="true" />

      <div className="product-card-image-wrap">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        ) : (
          <div className="product-card-placeholder" aria-hidden="true">
            📦
          </div>
        )}
        {hasDiscount && (
          <span className="product-card-badge" aria-label={`Descuento ${product.discountPercentage} por ciento`}>
            -{product.discountPercentage}%
          </span>
        )}
      </div>

      <div className="product-card-body">
        {categoryName && (
          <span className="product-card-category">{categoryName}</span>
        )}
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-price-row">
          <span className="product-card-price">{formatPrice(finalPrice)}</span>
          {hasDiscount && (
            <span className="product-card-price-original">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <Link href={`/producto/${product.id}`} className="product-card-btn">
          Ver Producto
        </Link>
      </div>
    </article>
  );
}
