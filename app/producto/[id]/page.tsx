import { getProductById, getActiveCategories } from "@/lib/firestore";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function ProductPage({ params }: Props) {
  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getActiveCategories(),
  ]);

  if (!product) notFound();

  const categoryName =
    categories.find((c) => c.id === product.category)?.name ?? product.category;

  return <ProductDetailClient product={product} categoryName={categoryName} />;
}
