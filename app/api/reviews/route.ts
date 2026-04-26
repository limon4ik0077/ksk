import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { initDb, reviewsDb } from "@/lib/db";

export async function GET(request: Request) {
  await initDb();
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ reviews: [] });
  }

  const reviews = await reviewsDb.find({ productId }).sort({ createdAt: -1 });
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  await initDb();

  try {
    const user = await requireUser();
    const body = await request.json();
    const productId = String(body.productId ?? "").trim();
    const text = String(body.text ?? "").trim();
    const rating = Number(body.rating ?? 5);

    if (!productId || !text) {
      return NextResponse.json({ error: "Заполните текст отзыва." }, { status: 400 });
    }

    const review = {
      _id: randomUUID(),
      productId,
      userId: user._id,
      authorName: user.name,
      rating: Math.max(1, Math.min(5, rating)),
      text,
      createdAt: new Date().toISOString(),
    };

    await reviewsDb.insert(review);
    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ error: "Войдите в аккаунт, чтобы оставить отзыв." }, { status: 401 });
  }
}
