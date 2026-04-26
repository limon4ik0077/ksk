import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { usersDb } from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const currentPassword = String(body.currentPassword ?? "");
    const newPassword = String(body.newPassword ?? "");

    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return NextResponse.json({ error: "Текущий пароль указан неверно." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "Новый пароль должен быть не короче 6 символов." }, { status: 400 });
    }

    await usersDb.update({ _id: user._id }, { $set: { passwordHash: await bcrypt.hash(newPassword, 10) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Требуется авторизация." }, { status: 401 });
  }
}
