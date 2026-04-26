import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { initDb, ordersDb } from "@/lib/db";

export async function GET() {
  await initDb();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ orders: [] });
  }

  const query = user.role === "admin" ? {} : { userId: user._id };
  const orders = await ordersDb.find(query).sort({ createdAt: -1 });
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  await initDb();
  const body = await request.json();
  const user = await getCurrentUser();

  const order = {
    _id: randomUUID(),
    userId: user?._id,
    customerName: String(body.customerName ?? "").trim(),
    email: String(body.email ?? "").trim(),
    phone: String(body.phone ?? "").trim(),
    address: String(body.address ?? "").trim(),
    comment: String(body.comment ?? "").trim(),
    total: Number(body.total ?? 0),
    status: "Новый",
    createdAt: new Date().toISOString(),
    items: Array.isArray(body.items) ? body.items : [],
  };

  if (!order.customerName || !order.email || !order.phone || !order.address || order.items.length === 0) {
    return NextResponse.json({ error: "Заполните данные заказа и добавьте товар в корзину." }, { status: 400 });
  }

  await ordersDb.insert(order);
  return NextResponse.json({ order });
}

export async function PATCH(request: Request) {
  await initDb();

  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Доступ только для администратора." }, { status: 403 });
  }

  const body = await request.json();
  const orderId = String(body.orderId ?? "").trim();
  const status = String(body.status ?? "").trim();

  if (!orderId || !status) {
    return NextResponse.json({ error: "Укажите заказ и новый статус." }, { status: 400 });
  }

  await ordersDb.update({ _id: orderId }, { $set: { status } });
  const order = await ordersDb.findOne({ _id: orderId });
  return NextResponse.json({ order });
}
