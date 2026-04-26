import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Загрузка доступна только администратору." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Выберите изображение." }, { status: 400 });
  }

  await fs.mkdir(uploadsDir, { recursive: true });

  const extension = path.extname(file.name) || ".png";
  const filename = `${randomUUID()}${extension}`;
  const filepath = path.join(uploadsDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filepath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
