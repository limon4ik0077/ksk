import bcrypt from "bcryptjs";
import Datastore from "nedb-promises";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type UserRecord = {
  _id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "customer" | "admin";
  createdAt: string;
};

type SessionRecord = {
  _id: string;
  userId: string;
  token: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const productsDb = Datastore.create({
  filename: path.join(dataDir, "products.db"),
  autoload: false,
});

export const usersDb = Datastore.create({
  filename: path.join(dataDir, "users.db"),
  autoload: false,
});

export const sessionsDb = Datastore.create({
  filename: path.join(dataDir, "sessions.db"),
  autoload: false,
});

export const ordersDb = Datastore.create({
  filename: path.join(dataDir, "orders.db"),
  autoload: false,
});

export const reviewsDb = Datastore.create({
  filename: path.join(dataDir, "reviews.db"),
  autoload: false,
});

let initPromise: Promise<void> | null = null;

const sampleProducts = [
  {
    _id: randomUUID(),
    name: "KSK BASIC HOODIE",
    price: 6900,
    category: "Худи",
    description: "Базовое худи свободного кроя из плотного футера.",
    sizes: ["S", "M", "L", "XL"],
    image: "KSK / BASIC",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: randomUUID(),
    name: "KSK WIDE PANTS",
    price: 5400,
    category: "Брюки",
    description: "Широкие брюки для повседневного гардероба и комплекта.",
    sizes: ["S", "M", "L"],
    image: "KSK / WIDE",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: randomUUID(),
    name: "KSK LIGHT TEE",
    price: 2900,
    category: "Футболки",
    description: "Лаконичная футболка с мягкой посадкой и плотной горловиной.",
    sizes: ["M", "L", "XL"],
    image: "KSK / TEE",
    inStock: true,
    createdAt: new Date().toISOString(),
  },
];

export async function initDb() {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    await Promise.all([productsDb.load(), usersDb.load(), sessionsDb.load(), ordersDb.load(), reviewsDb.load()]);

    const productsCount = await productsDb.count({});
    if (productsCount === 0) {
      await productsDb.insert(sampleProducts);
    }

    const usersCount = await usersDb.count({});
    if (usersCount === 0) {
      const adminPassword = await bcrypt.hash("admin123", 10);
      await usersDb.insert({
        _id: randomUUID(),
        email: "admin@ksk.shop",
        name: "KSK Admin",
        passwordHash: adminPassword,
        role: "admin",
        createdAt: new Date().toISOString(),
      } satisfies UserRecord);
    }
  })();

  return initPromise;
}

export async function sanitizeUser(user: UserRecord | null) {
  if (!user) {
    return null;
  }

  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export type { SessionRecord, UserRecord };
