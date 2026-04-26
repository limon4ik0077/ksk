import type { CartItem, Order, OrderStatus, Product, PublicUser, Review } from "@/lib/types";

export const CART_UPDATED_EVENT = "ksk-cart-updated";

export type AuthForm = {
  name: string;
  email: string;
  password: string;
};

export type CheckoutForm = {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  comment: string;
};

export type ProductForm = {
  name: string;
  price: string;
  category: string;
  description: string;
  sizes: string;
  image: string;
};

export type PasswordForm = {
  currentPassword: string;
  newPassword: string;
};

export type ReviewForm = {
  productId: string;
  rating: number;
  text: string;
};

export const initialAuthForm: AuthForm = { name: "", email: "", password: "" };
export const initialCheckoutForm: CheckoutForm = {
  customerName: "",
  email: "",
  phone: "",
  address: "",
  comment: "",
};
export const initialProductForm: ProductForm = {
  name: "",
  price: "",
  category: "",
  description: "",
  sizes: "",
  image: "",
};
export const initialPasswordForm: PasswordForm = { currentPassword: "", newPassword: "" };
export const initialReviewForm = (productId: string): ReviewForm => ({ productId, rating: 5, text: "" });

export async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Request error.");
  }
  return data as T;
}

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawCart = window.localStorage.getItem("ksk-cart");
  if (!rawCart) {
    return [];
  }

  try {
    return JSON.parse(rawCart) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("ksk-cart", JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
}

export function cartCount(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export async function fetchProducts() {
  return parseJson<{ products: Product[] }>(await fetch("/api/products"));
}

export async function fetchReviews(productId: string) {
  return parseJson<{ reviews: Review[] }>(await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`));
}

export async function updateProduct(productId: string, payload: ProductForm) {
  return parseJson<{ product: Product }>(
    await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteProduct(productId: string) {
  return parseJson<{ success: true }>(
    await fetch(`/api/admin/products/${productId}`, {
      method: "DELETE",
    }),
  );
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return parseJson<{ url: string }>(
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    }),
  );
}

export async function changePassword(payload: PasswordForm) {
  return parseJson<{ ok: true }>(
    await fetch("/api/auth/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function createReview(payload: ReviewForm) {
  return parseJson<{ review: Review }>(
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function createProduct(payload: ProductForm) {
  return parseJson<{ product: Product }>(
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function fetchMe() {
  return parseJson<{ user: PublicUser | null }>(await fetch("/api/auth/me"));
}

export async function fetchOrders() {
  return parseJson<{ orders: Order[] }>(await fetch("/api/orders"));
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  return parseJson<{ order: Order }>(
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    }),
  );
}
