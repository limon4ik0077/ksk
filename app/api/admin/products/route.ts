import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { initDb, productsDb } from "@/lib/db";

export async function POST(request: Request) {
  await initDb();

  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Доступ только для администратора." }, { status: 403 });
  }

  const body = await request.json();
  const product = {
    _id: randomUUID(),
    name: String(body.name ?? "").trim(),
    price: Number(body.price ?? 0),
    category: String(body.category ?? "").trim(),
    description: String(body.description ?? "").trim(),
    sizes: String(body.sizes ?? "")
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean),
    image: String(body.image ?? "KSK / ITEM").trim(),
    inStock: true,
    createdAt: new Date().toISOString(),
  };

  if (!product.name || !product.category || !product.description || product.price <= 0) {
    return NextResponse.json({ error: "Заполните название, категорию, описание и цену." }, { status: 400 });
  }

  await productsDb.insert(product);
  return NextResponse.json({ product });
}
