import { NextResponse } from "next/server";
import { initDb, productsDb } from "@/lib/db";

export async function GET() {
  await initDb();
  const products = await productsDb.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ products });
}
