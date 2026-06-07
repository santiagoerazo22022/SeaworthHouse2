import type { Category, Product, Coupon } from "@/types";

export const demoCategories: Category[] = [
  { id: "cat-1", name: "Ropa", active: true },
  { id: "cat-2", name: "Figuras", active: true },
  { id: "cat-3", name: "Posters", active: true },
];

export const demoProducts: Product[] = [
  {
    id: "prod-1",
    name: "Remera Akatsuki",
    description:
      "Remera oversize con el emblema de la Akatsuki de Naruto Shippuden. Tela de algodón 100%, serigrafía de alta calidad que resiste lavados. Ideal para los fans del anime.",
    category: "cat-1",
    price: 15000,
    discountPercentage: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    variants: ["S", "M", "L", "XL", "XXL"],
    active: true,
  },
  {
    id: "prod-2",
    name: "Figura Goku Ultra Instinct",
    description:
      "Figura de colección de Son Goku en su forma Ultra Instinto. Escala 1/8, resina de alta calidad con pintura a mano. Incluye base iluminada.",
    category: "cat-2",
    price: 85000,
    discountPercentage: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=600&q=80",
    variants: ["Versión Estándar", "Versión Limitada con LED"],
    active: true,
  },
  {
    id: "prod-3",
    name: "Poster Evangelion",
    description:
      "Poster oficial de Neon Genesis Evangelion con la unidad EVA-01 en formato A2. Impresión en papel satinado de alta resolución.",
    category: "cat-3",
    price: 8500,
    discountPercentage: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&q=80",
    variants: ["A2 (42x59cm)", "A1 (59x84cm)"],
    active: true,
  },
  {
    id: "prod-4",
    name: "Buzo Attack on Titan",
    description:
      "Buzo hoodie con el emblema del Cuerpo de Reconocimiento de Shingeki no Kyojin. Tela polar, capucha doble capa y cordones resistentes.",
    category: "cat-1",
    price: 28000,
    discountPercentage: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    variants: ["S", "M", "L", "XL"],
    active: true,
  },
  {
    id: "prod-5",
    name: "Figura Nezuko Kamado",
    description:
      "Figura de Nezuko de Demon Slayer en posición de combate. Material PVC premium, pintura detallada con efecto respiración del agua.",
    category: "cat-2",
    price: 62000,
    discountPercentage: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80",
    variants: ["Versión Normal", "Versión Demonio"],
    active: true,
  },
  {
    id: "prod-6",
    name: "Remera One Piece Gear 5",
    description:
      "Remera con el diseño exclusivo de Luffy en Gear Fifth. Estampado full print de alta definición, tela dry-fit transpirable.",
    category: "cat-1",
    price: 18000,
    discountPercentage: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&q=80",
    variants: ["S", "M", "L", "XL", "XXL"],
    active: true,
  },
  {
    id: "prod-7",
    name: "Poster Demon Slayer Mugen Train",
    description:
      "Poster panorámico del Tren Infinito de Demon Slayer. Edición especial con acabado brillante y colores vibrantes. Formato A1.",
    category: "cat-3",
    price: 12000,
    discountPercentage: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
    variants: ["A2 (42x59cm)", "A1 (59x84cm)", "A0 (84x119cm)"],
    active: true,
  },
  {
    id: "prod-8",
    name: "Figura Zenitsu Agatsuma",
    description:
      "Figura de Zenitsu con su técnica de rayo. Escala 1/7, base incluida con efectos de iluminación eléctrica. Edición limitada.",
    category: "cat-2",
    price: 75000,
    discountPercentage: 0,
    imageUrl:
      "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=600&q=80",
    variants: ["Versión Dormido", "Versión Activo"],
    active: true,
  },
];

export const demoCoupons: Coupon[] = [
  { id: "coup-1", code: "OTAKU10", discount: 10, active: true },
  { id: "coup-2", code: "KAMEHAMEHA", discount: 20, active: true },
];
