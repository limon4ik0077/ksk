import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { initDb, sanitizeUser, usersDb, type UserRecord } from "@/lib/db";

export async function POST(request: Request) {
  await initDb();
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  const user = (await usersDb.findOne({ email })) as UserRecord | null;

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Неверный email или пароль." }, { status: 401 });
  }

  await createSession(user._id);
  return NextResponse.json({ user: await sanitizeUser(user) });
}
