"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import NoticeBanner from "@/components/shop/NoticeBanner";
import PageShell from "@/components/shop/PageShell";
import ShopHeader from "@/components/shop/ShopHeader";
import {
  changePassword,
  fetchMe,
  fetchOrders,
  initialAuthForm,
  initialPasswordForm,
  parseJson,
} from "@/lib/shop-client";
import type { Order, PublicUser } from "@/lib/types";

export default function AccountPageClient() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loginForm, setLoginForm] = useState(initialAuthForm);
  const [registerForm, setRegisterForm] = useState(initialAuthForm);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetchMe().then((data) => setUser(data.user));
    void fetchOrders().then((data) => setOrders(data.orders));
  }, []);

  async function auth(mode: "login" | "register") {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const form = mode === "login" ? loginForm : registerForm;
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login" ? { email: form.email, password: form.password } : form;
      const data = await parseJson<{ user: PublicUser }>(
        await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );

      setUser(data.user);
      setOrders((await fetchOrders()).orders);
      setMessage(mode === "login" ? "Вход выполнен." : "Аккаунт создан.");
      setLoginForm(initialAuthForm);
      setRegisterForm(initialAuthForm);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Ошибка авторизации.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOrders([]);
    setPasswordForm(initialPasswordForm);
    setMessage("Вы вышли из аккаунта.");
  }

  async function submitPasswordChange() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await changePassword(passwordForm);
      setPasswordForm(initialPasswordForm);
      setMessage("Пароль обновлён.");
    } catch (passwordError) {
      setError(passwordError instanceof Error ? passwordError.message : "Не удалось изменить пароль.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <ShopHeader
        title="Личный кабинет"
        subtitle="Авторизация, история заказов, смена пароля и доступ к панели управления для администратора."
      />

      <div className="py-8 sm:py-10">
        <NoticeBanner error={error} message={message} />

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} className="soft-card p-5 sm:p-6">
            <p className="eyebrow">Профиль</p>
            <h2 className="section-title mt-3">{user ? "Ваш аккаунт" : "Вход и регистрация"}</h2>

            {!user ? (
              <div className="mt-6">
                <div className="mb-5 flex gap-2">
                  <button type="button" onClick={() => setTab("login")} className={tab === "login" ? "button-primary" : "button-secondary"}>
                    Вход
                  </button>
                  <button type="button" onClick={() => setTab("register")} className={tab === "register" ? "button-primary" : "button-secondary"}>
                    Регистрация
                  </button>
                </div>

                {tab === "login" ? (
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
                    <input value={loginForm.email} onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))} className="signal-input" placeholder="EMAIL" />
                    <input type="password" value={loginForm.password} onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} className="signal-input" placeholder="PASSWORD" />
                    <motion.button whileHover={{ x: 8 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => void auth("login")} disabled={busy} className="button-primary">
                      Войти
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4">
                    <input value={registerForm.name} onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))} className="signal-input" placeholder="ИМЯ" />
                    <input value={registerForm.email} onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))} className="signal-input" placeholder="EMAIL" />
                    <input type="password" value={registerForm.password} onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))} className="signal-input" placeholder="PASSWORD" />
                    <motion.button whileHover={{ x: 8 }} whileTap={{ scale: 0.98 }} type="button" onClick={() => void auth("register")} disabled={busy} className="button-primary">
                      Создать аккаунт
                    </motion.button>
                  </motion.div>
                )}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-5">
                <div className="soft-card bg-[#fafafa] p-4">
                  <p className="eyebrow">Профиль</p>
                  <p className="mt-3 text-xl font-extrabold sm:text-2xl">{user.name}</p>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">{user.email}</p>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">Роль: {user.role}</p>
                </div>

                {user.role === "admin" ? (
                  <Link href="/control-room-ksk" className="button-primary">
                    Перейти в админку
                  </Link>
                ) : null}

                <div className="soft-card p-4">
                  <p className="eyebrow">Безопасность</p>
                  <h3 className="mt-3 text-lg font-extrabold uppercase sm:text-xl">Сменить пароль</h3>
                  <div className="mt-4 grid gap-3">
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))}
                      className="signal-input"
                      placeholder="ТЕКУЩИЙ ПАРОЛЬ"
                    />
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                      className="signal-input"
                      placeholder="НОВЫЙ ПАРОЛЬ"
                    />
                    <button type="button" onClick={() => void submitPasswordChange()} className="button-secondary">
                      Обновить пароль
                    </button>
                  </div>
                </div>

                <button type="button" onClick={logout} className="button-secondary">
                  Выйти
                </button>
              </motion.div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} className="soft-card p-5 sm:p-6">
            <p className="eyebrow">История заказов</p>
            <h2 className="section-title mt-3">Мои заказы</h2>
            <div className="mt-6 grid gap-3">
              {orders.length === 0 ? (
                <div className="border border-dashed border-black/15 px-4 py-5 text-[12px] uppercase tracking-[0.12em] text-black/45 sm:text-sm sm:tracking-[0.18em]">
                  Заказов пока нет. Здесь будет появляться история ваших покупок.
                </div>
              ) : null}

              {orders.map((order, index) => (
                <motion.div key={order._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + index * 0.06 }} className="soft-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[12px] font-bold uppercase tracking-[0.12em] sm:text-sm sm:tracking-[0.18em]">Заказ #{order._id.slice(0, 8)}</p>
                    <span className="bg-signal/15 px-3 py-2 text-[10px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.2em]">{order.status}</span>
                  </div>
                  <p className="mt-3 text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">
                    {new Date(order.createdAt).toLocaleDateString("ru-RU")} / {order.total.toLocaleString("ru-RU")} ₽
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </PageShell>
  );
}
