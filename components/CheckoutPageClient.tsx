"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import NoticeBanner from "@/components/shop/NoticeBanner";
import PageShell from "@/components/shop/PageShell";
import ShopHeader from "@/components/shop/ShopHeader";
import { cartTotal, initialCheckoutForm, loadCart, parseJson, saveCart } from "@/lib/shop-client";
import type { CartItem, Order } from "@/lib/types";

function isImageUrl(value: string) {
  return /^(https?:\/\/|\/uploads\/)/i.test(value);
}

export default function CheckoutPageClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState(initialCheckoutForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [cartReady, setCartReady] = useState(false);
  const total = useMemo(() => cartTotal(cart), [cart]);

  useEffect(() => {
    setCart(loadCart());
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    saveCart(cart);
  }, [cart, cartReady]);

  function updateQuantity(productId: string, size: string, delta: number) {
    setCart((current) =>
      current.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  }

  function removeItem(productId: string, size: string) {
    setCart((current) => current.filter((item) => !(item.productId === productId && item.size === size)));
  }

  async function submitOrder() {
    setBusy(true);
    setMessage("");
    setError("");

    try {
      await parseJson<{ order: Order }>(
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, total, items: cart }),
        }),
      );

      setCart([]);
      setForm(initialCheckoutForm);
      setMessage("Заказ оформлен.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось оформить заказ.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <ShopHeader
        title="Корзина и оформление"
        subtitle="Проверьте состав заказа, измените количество позиций и отправьте заявку на оформление."
      />

      <div className="py-8 sm:py-10">
        <NoticeBanner error={error} message={message} />

        <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="soft-card p-5 sm:p-6"
          >
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Корзина</p>
                <h2 className="section-title mt-3">Ваши товары</h2>
              </div>
              <p className="text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">{cart.length} позиций</p>
            </div>

            <div className="space-y-4">
              {cart.length === 0 ? (
                <div className="border border-dashed border-black/15 px-4 py-6 text-[12px] uppercase tracking-[0.12em] text-black/45 sm:text-sm sm:tracking-[0.18em]">
                  В корзине пока нет товаров. Добавьте позиции из каталога, и они появятся здесь.
                </div>
              ) : null}

              {cart.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${item.size}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="flex flex-col gap-4 border-b border-black/10 pb-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden bg-[#fafafa] text-[10px] uppercase tracking-[0.12em] text-black/45 sm:h-20 sm:w-20 sm:text-xs sm:tracking-[0.18em]">
                      {isImageUrl(item.image) ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="px-2 text-center">{item.image.slice(0, 12)}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-[0.12em] sm:text-sm sm:tracking-[0.18em]">{item.name}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-black/50 sm:text-xs sm:tracking-[0.18em]">
                        {item.size} / {item.price.toLocaleString("ru-RU")} ₽
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={() => updateQuantity(item.productId, item.size, -1)} className="button-secondary px-3 py-2">
                      -
                    </button>
                    <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.productId, item.size, 1)} className="button-secondary px-3 py-2">
                      +
                    </button>
                    <button type="button" onClick={() => removeItem(item.productId, item.size)} className="button-secondary px-3 py-2">
                      Убрать
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="soft-card p-5 sm:p-6"
          >
            <p className="eyebrow">Оформление</p>
            <h2 className="section-title mt-3">Контактные данные</h2>

            <div className="mt-6 grid gap-4">
              {[
                ["customerName", "Имя получателя"],
                ["email", "Email"],
                ["phone", "Телефон"],
                ["address", "Адрес доставки"],
              ].map(([key, label]) => (
                <motion.label
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  className="space-y-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.24em]"
                >
                  <span>{label}</span>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                    className="signal-input"
                  />
                </motion.label>
              ))}

              <label className="space-y-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.24em]">
                <span>Комментарий</span>
                <textarea
                  value={form.comment}
                  onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
                  className="signal-input min-h-28 resize-none"
                />
              </label>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-6 border-t border-black/10 pt-5"
            >
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="eyebrow">Итого</p>
                  <p className="mt-2 text-2xl font-extrabold sm:text-3xl">{total.toLocaleString("ru-RU")} ₽</p>
                </div>
                <p className="text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">Доставка уточняется после заявки</p>
              </div>

              <motion.button whileHover={{ scale: 1.03, x: 8 }} whileTap={{ scale: 0.98 }} disabled={busy} onClick={submitOrder} className="button-primary w-full">
                Отправить заказ
              </motion.button>
            </motion.div>
          </motion.div>
        </section>
      </div>
    </PageShell>
  );
}
