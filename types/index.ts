export interface Category {
  id: string;
  name: string;
  active: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  imageUrl: string;
  variants: string[];
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  active: boolean;
}
