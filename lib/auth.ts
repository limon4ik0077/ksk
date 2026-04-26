import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { initDb, sanitizeUser, sessionsDb, usersDb, type SessionRecord, type UserRecord } from "@/lib/db";

const SESSION_COOKIE = "ksk_session";

export async function createSession(userId: string) {
  await initDb();

  const token = randomUUID();
  const session: SessionRecord = {
    _id: randomUUID(),
    userId,
    token,
    createdAt: new Date().toISOString(),
  };

  await sessionsDb.insert(session);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await sessionsDb.remove({ token }, { multi: true });
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<Awaited<ReturnType<typeof sanitizeUser>>> {
  await initDb();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = (await sessionsDb.findOne({ token })) as SessionRecord | null;
  if (!session) {
    return null;
  }

  const user = (await usersDb.findOne({ _id: session.userId })) as UserRecord | null;
  return sanitizeUser(user);
}

export async function getCurrentUserRecord(): Promise<UserRecord | null> {
  await initDb();

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = (await sessionsDb.findOne({ token })) as SessionRecord | null;
  if (!session) {
    return null;
  }

  return (await usersDb.findOne({ _id: session.userId })) as UserRecord | null;
}

export async function requireUser() {
  const user = await getCurrentUserRecord();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
