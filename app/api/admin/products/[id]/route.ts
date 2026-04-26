import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { initDb, productsDb, reviewsDb } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await initDb();

  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Доступ только для администратора." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const update = {
    name: String(body.name ?? "").trim(),
    price: Number(body.price ?? 0),
    category: String(body.category ?? "").trim(),
    description: String(body.description ?? "").trim(),
    sizes: String(body.sizes ?? "")
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean),
    image: String(body.image ?? "KSK / ITEM").trim(),
    inStock: body.inStock === false ? false : true,
  };

  if (!update.name || !update.category || !update.description || update.price <= 0) {
    return NextResponse.json({ error: "Заполните название, категорию, описание и цену." }, { status: 400 });
  }

  await productsDb.update({ _id: id }, { $set: update });
  const product = await productsDb.findOne({ _id: id });
  return NextResponse.json({ product });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await initDb();

  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Доступ только для администратора." }, { status: 403 });
  }

  const { id } = await params;
  await productsDb.remove({ _id: id }, {});
  await reviewsDb.remove({ productId: id }, { multi: true });
  return NextResponse.json({ success: true });
}
