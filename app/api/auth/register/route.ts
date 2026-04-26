import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { initDb, sanitizeUser, usersDb, type UserRecord } from "@/lib/db";

export async function POST(request: Request) {
  await initDb();
  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!name || !email || password.length < 6) {
    return NextResponse.json({ error: "Заполните имя, email и пароль от 6 символов." }, { status: 400 });
  }

  const existing = await usersDb.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Пользователь с таким email уже существует." }, { status: 409 });
  }

  const user: UserRecord = {
    _id: randomUUID(),
    email,
    name,
    passwordHash: await bcrypt.hash(password, 10),
    role: "customer",
    createdAt: new Date().toISOString(),
  };

  await usersDb.insert(user);
  await createSession(user._id);
  return NextResponse.json({ user: await sanitizeUser(user) });
}
