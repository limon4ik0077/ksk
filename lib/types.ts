export type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  sizes: string[];
  image: string;
  inStock: boolean;
  createdAt: string;
};

export type PublicUser = {
  _id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
  createdAt: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
};

export type Review = {
  _id: string;
  productId: string;
  userId?: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type OrderStatus = "Новый" | "Подтвержден" | "В сборке" | "Отправлен" | "Завершен" | "Отменен";

export type Order = {
  _id: string;
  userId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  comment: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: CartItem[];
};
