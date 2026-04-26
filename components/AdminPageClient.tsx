"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import NoticeBanner from "@/components/shop/NoticeBanner";
import PageShell from "@/components/shop/PageShell";
import ShopHeader from "@/components/shop/ShopHeader";
import {
  createProduct,
  deleteProduct,
  fetchMe,
  fetchOrders,
  fetchProducts,
  initialProductForm,
  type ProductForm,
  updateOrderStatus,
  updateProduct,
  uploadImage,
} from "@/lib/shop-client";
import type { Order, OrderStatus, Product, PublicUser } from "@/lib/types";

const orderStatuses: OrderStatus[] = ["Новый", "Подтвержден", "В сборке", "Отправлен", "Завершен", "Отменен"];

function isImageUrl(value: string) {
  return /^(https?:\/\/|\/uploads\/)/i.test(value);
}

function getOrderStatusBadgeClass(status: OrderStatus) {
  if (status === "Новый") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "Подтвержден") return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "В сборке") return "border-orange-200 bg-orange-50 text-orange-700";
  if (status === "Отправлен") return "border-violet-200 bg-violet-50 text-violet-700";
  if (status === "Завершен") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-red-200 bg-red-50 text-red-700";
}

export default function AdminPageClient() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productForm, setProductForm] = useState<ProductForm>(initialProductForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [orderFilter, setOrderFilter] = useState<"all" | OrderStatus>("all");

  async function refreshProducts() {
    const data = await fetchProducts();
    setProducts(data.products);
  }

  async function refreshOrders() {
    const data = await fetchOrders();
    setOrders(data.orders);
  }

  useEffect(() => {
    void fetchMe().then((data) => setUser(data.user));
    void refreshProducts();
    void refreshOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const sorted = [...orders].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    if (orderFilter === "all") {
      return sorted;
    }
    return sorted.filter((order) => order.status === orderFilter);
  }, [orderFilter, orders]);

  function startEdit(product: Product) {
    setEditingId(product._id);
    setProductForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      description: product.description,
      sizes: product.sizes.join(", "),
      image: product.image,
    });
    setMessage(`Редактирование товара "${product.name}".`);
    setError("");
  }

  function resetForm() {
    setEditingId(null);
    setProductForm(initialProductForm);
  }

  async function saveProduct() {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await updateProduct(editingId, productForm);
        setMessage("Товар обновлен.");
      } else {
        await createProduct(productForm);
        setMessage("Товар добавлен в каталог.");
      }

      resetForm();
      await refreshProducts();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Не удалось сохранить товар.");
    } finally {
      setBusy(false);
    }
  }

  async function removeProduct(productId: string, productName: string) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await deleteProduct(productId);
      if (editingId === productId) {
        resetForm();
      }
      setMessage(`Товар "${productName}" удален.`);
      await refreshProducts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Не удалось удалить товар.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(file: File | null) {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const data = await uploadImage(file);
      setProductForm((current) => ({ ...current, image: data.url }));
      setMessage("Картинка загружена.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Не удалось загрузить изображение.");
    } finally {
      setUploading(false);
    }
  }

  async function changeStatus(orderId: string, status: OrderStatus) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await updateOrderStatus(orderId, status);
      setMessage(`Статус заказа обновлен: ${status}.`);
      await refreshOrders();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Не удалось обновить статус заказа.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell>
      <ShopHeader
        title="Панель товаров"
        subtitle="Добавляйте товары, загружайте картинки, меняйте каталог и управляйте статусами заказов."
      />

      <div className="py-8 sm:py-10">
        <NoticeBanner error={error} message={message} />

        {user?.role !== "admin" ? (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="soft-card p-8">
            <p className="eyebrow">Private Access</p>
            <h2 className="section-title mt-3">Нужен вход администратора</h2>
            <p className="mt-4 text-[12px] uppercase leading-5 tracking-[0.12em] text-black/60 sm:text-sm sm:leading-7 sm:tracking-[0.18em]">
              Войдите под администратором, чтобы управлять каталогом и заказами.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-8">
            <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)] xl:gap-8">
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="soft-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Управление</p>
                    <h2 className="section-title mt-3">{editingId ? "Редактирование товара" : "Новый товар"}</h2>
                  </div>
                  {editingId ? (
                    <button type="button" onClick={resetForm} className="button-secondary">
                      Новый
                    </button>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-4">
                  {[
                    ["name", "Название"],
                    ["price", "Цена"],
                    ["category", "Категория"],
                    ["image", "URL картинки"],
                    ["sizes", "Размеры через запятую"],
                  ].map(([key, label]) => (
                    <label key={key} className="space-y-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.24em]">
                      <span>{label}</span>
                      <input
                        value={productForm[key as keyof ProductForm]}
                        onChange={(event) => setProductForm((current) => ({ ...current, [key]: event.target.value }))}
                        className="signal-input"
                      />
                    </label>
                  ))}

                  <label className="space-y-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.24em]">
                    <span>Загрузить картинку</span>
                    <input type="file" accept="image/*" onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)} className="signal-input" />
                  </label>
                  {uploading ? <p className="text-[11px] uppercase tracking-[0.14em] text-black/50">Загрузка изображения...</p> : null}

                  <label className="space-y-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.24em]">
                    <span>Описание</span>
                    <textarea
                      value={productForm.description}
                      onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))}
                      className="signal-input min-h-28 resize-none"
                    />
                  </label>

                  <div className="overflow-hidden border border-black/10 bg-white">
                    {isImageUrl(productForm.image) ? (
                      <img src={productForm.image} alt="Product preview" className="h-44 w-full object-cover sm:h-52" />
                    ) : (
                      <div className="flex h-44 items-center justify-center bg-[#fafafa] px-6 text-center text-[11px] uppercase tracking-[0.14em] text-black/45 sm:h-52 sm:text-xs sm:tracking-[0.24em]">
                        Введите URL или загрузите файл, чтобы увидеть превью
                      </div>
                    )}
                    <div className="border-t border-black/10 px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-black/55 sm:text-xs sm:tracking-[0.2em]">
                      Превью карточки товара
                    </div>
                  </div>

                  <motion.button whileHover={{ x: 8 }} whileTap={{ scale: 0.98 }} type="button" onClick={saveProduct} disabled={busy || uploading} className="button-primary">
                    {editingId ? "Сохранить изменения" : "Добавить товар"}
                  </motion.button>
                </div>
              </motion.div>

              <div>
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow">Каталог</p>
                    <h2 className="section-title mt-3">Товары в базе</h2>
                  </div>
                  <p className="text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">{products.length} позиций</p>
                </div>

                <div className="grid gap-4">
                  {products.map((product, index) => (
                    <motion.article key={product._id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="soft-card p-4 sm:p-5">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden bg-[#fafafa] text-[11px] uppercase tracking-[0.14em] text-black/45 sm:h-28 sm:w-28 sm:text-xs sm:tracking-[0.18em]">
                            {isImageUrl(product.image) ? (
                              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="px-2 text-center">{product.image}</span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-black/45 sm:text-xs sm:tracking-[0.22em]">{product.category}</p>
                            <h3 className="mt-2 text-base font-extrabold uppercase tracking-[0.08em] sm:text-lg">{product.name}</h3>
                            <p className="mt-2 text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">{product.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {product.sizes.map((size) => (
                                <span key={size} className="border border-black/10 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-black/60 sm:text-[11px] sm:tracking-[0.18em]">
                                  {size}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                          <p className="text-lg font-extrabold text-signal sm:text-xl">{product.price.toLocaleString("ru-RU")} ₽</p>
                          <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => startEdit(product)} className="button-secondary">
                              Редактировать
                            </button>
                            <button type="button" onClick={() => void removeProduct(product._id, product.name)} disabled={busy} className="button-secondary border-red-200 text-red-600 hover:border-red-400">
                              Удалить
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>

            <section className="soft-card p-5 sm:p-6">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">Заказы</p>
                  <h2 className="section-title mt-3">Управление статусами</h2>
                </div>
                <p className="text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">
                  {filteredOrders.length} из {orders.length} заказов
                </p>
              </div>

              <div className="mb-6 grid gap-4 md:grid-cols-[280px_auto] md:items-end">
                <label className="space-y-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.24em]">
                  <span>Фильтр по статусу</span>
                  <select value={orderFilter} onChange={(event) => setOrderFilter(event.target.value as "all" | OrderStatus)} className="signal-input">
                    <option value="all">Все статусы</option>
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4">
                {filteredOrders.length === 0 ? (
                  <div className="border border-dashed border-black/15 px-4 py-5 text-[12px] uppercase tracking-[0.12em] text-black/45 sm:text-sm sm:tracking-[0.18em]">
                    Заказов с таким статусом пока нет.
                  </div>
                ) : null}

                {filteredOrders.map((order, index) => (
                  <motion.article key={order._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="border border-black/10 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <p className="text-[12px] font-bold uppercase tracking-[0.12em] sm:text-sm sm:tracking-[0.18em]">Заказ #{order._id.slice(0, 8)}</p>
                        <p className="text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">
                          {order.customerName} / {order.phone}
                        </p>
                        <p className="text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">{order.address}</p>
                        <p className="text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">
                          {order.items.length} позиций / {order.total.toLocaleString("ru-RU")} ₽
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 lg:items-end">
                        <span className={`border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] ${getOrderStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                        <select
                          value={order.status}
                          onChange={(event) => void changeStatus(order._id, event.target.value as OrderStatus)}
                          className="signal-input min-w-[220px]"
                          disabled={busy}
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </PageShell>
  );
}
