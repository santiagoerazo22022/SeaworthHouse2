// Server-safe module — Firebase SDK is only imported dynamically and only
// when IS_DEMO is false. Server components in demo mode never trigger the import.

import { IS_DEMO, firebaseConfig } from "./firebase";
import {
  demoCategories,
  demoProducts,
  demoCoupons,
} from "./demoData";
import type { Category, Product, Coupon } from "@/types";

// ─── Lazy Firebase helpers ────────────────────────────────────────────────────

async function getDb() {
  const { initializeApp, getApps } = await import("firebase/app");
  const { getFirestore } = await import("firebase/firestore");
  const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getFirestore(app);
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  if (IS_DEMO) return demoCategories;
  const { collection, getDocs } = await import("firebase/firestore");
  const db = await getDb();
  const snap = await getDocs(collection(db, "categories"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

export async function getActiveCategories(): Promise<Category[]> {
  if (IS_DEMO) return demoCategories.filter((c) => c.active);
  const { collection, getDocs, query, where } = await import(
    "firebase/firestore"
  );
  const db = await getDb();
  const q = query(collection(db, "categories"), where("active", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
}

export async function addCategory(
  data: Omit<Category, "id">
): Promise<string> {
  if (IS_DEMO) return "demo-id";
  const { collection, addDoc } = await import("firebase/firestore");
  const db = await getDb();
  const ref = await addDoc(collection(db, "categories"), data);
  return ref.id;
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, "id">>
): Promise<void> {
  if (IS_DEMO) return;
  const { doc, updateDoc } = await import("firebase/firestore");
  const db = await getDb();
  await updateDoc(doc(db, "categories", id), data);
}

export async function deleteCategory(id: string): Promise<void> {
  if (IS_DEMO) return;
  const { doc, deleteDoc } = await import("firebase/firestore");
  const db = await getDb();
  await deleteDoc(doc(db, "categories", id));
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  if (IS_DEMO) return demoProducts;
  const { collection, getDocs } = await import("firebase/firestore");
  const db = await getDb();
  const snap = await getDocs(collection(db, "products"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getActiveProducts(): Promise<Product[]> {
  if (IS_DEMO) return demoProducts.filter((p) => p.active);
  const { collection, getDocs, query, where } = await import(
    "firebase/firestore"
  );
  const db = await getDb();
  const q = query(collection(db, "products"), where("active", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | null> {
  if (IS_DEMO) {
    return demoProducts.find((p) => p.id === id) ?? null;
  }
  const { doc, getDoc } = await import("firebase/firestore");
  const db = await getDb();
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Product;
}

export async function addProduct(data: Omit<Product, "id">): Promise<string> {
  if (IS_DEMO) return "demo-id";
  const { collection, addDoc } = await import("firebase/firestore");
  const db = await getDb();
  const ref = await addDoc(collection(db, "products"), data);
  return ref.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id">>
): Promise<void> {
  if (IS_DEMO) return;
  const { doc, updateDoc } = await import("firebase/firestore");
  const db = await getDb();
  await updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id: string): Promise<void> {
  if (IS_DEMO) return;
  const { doc, deleteDoc } = await import("firebase/firestore");
  const db = await getDb();
  await deleteDoc(doc(db, "products", id));
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function getCoupons(): Promise<Coupon[]> {
  if (IS_DEMO) return demoCoupons;
  const { collection, getDocs } = await import("firebase/firestore");
  const db = await getDb();
  const snap = await getDocs(collection(db, "coupons"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Coupon));
}

export async function validateCoupon(code: string): Promise<Coupon | null> {
  if (IS_DEMO) {
    return (
      demoCoupons.find(
        (c) => c.code.toUpperCase() === code.toUpperCase() && c.active
      ) ?? null
    );
  }
  const { collection, getDocs, query, where } = await import(
    "firebase/firestore"
  );
  const db = await getDb();
  const q = query(
    collection(db, "coupons"),
    where("code", "==", code.toUpperCase()),
    where("active", "==", true)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Coupon;
}

export async function addCoupon(data: Omit<Coupon, "id">): Promise<string> {
  if (IS_DEMO) return "demo-id";
  const { collection, addDoc } = await import("firebase/firestore");
  const db = await getDb();
  const ref = await addDoc(collection(db, "coupons"), {
    ...data,
    code: data.code.toUpperCase(),
  });
  return ref.id;
}

export async function updateCoupon(
  id: string,
  data: Partial<Omit<Coupon, "id">>
): Promise<void> {
  if (IS_DEMO) return;
  const { doc, updateDoc } = await import("firebase/firestore");
  const db = await getDb();
  await updateDoc(doc(db, "coupons", id), data);
}

export async function deleteCoupon(id: string): Promise<void> {
  if (IS_DEMO) return;
  const { doc, deleteDoc } = await import("firebase/firestore");
  const db = await getDb();
  await deleteDoc(doc(db, "coupons", id));
}
