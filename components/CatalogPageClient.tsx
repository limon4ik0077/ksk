"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import NoticeBanner from "@/components/shop/NoticeBanner";
import PageShell from "@/components/shop/PageShell";
import ProductCard from "@/components/shop/ProductCard";
import ShopHeader from "@/components/shop/ShopHeader";
import { createReview, fetchMe, fetchProducts, fetchReviews, loadCart, saveCart } from "@/lib/shop-client";
import type { CartItem, Product, PublicUser, Review } from "@/lib/types";

function isImageUrl(value: string) {
  return /^(https?:\/\/|\/uploads\/)/i.test(value);
}

type SortMode = "default" | "price-asc" | "price-desc";

export default function CatalogPageClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cartReady, setCartReady] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    setCart(loadCart());
    setCartReady(true);
    void fetchProducts().then((data) => setProducts(data.products)).catch((fetchError: Error) => setError(fetchError.message));
    void fetchMe().then((data) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const nextSearch = params.get("q") ?? "";
    const nextCategory = params.get("category") ?? "all";
    const nextSize = params.get("size") ?? "all";
    const nextSort = (params.get("sort") as SortMode | null) ?? "default";

    setSearch(nextSearch);
    setCategory(nextCategory);
    setSizeFilter(nextSize);
    setSortMode(nextSort);
    setFiltersReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    saveCart(cart);
  }, [cart, cartReady]);

  useEffect(() => {
    if (!filtersReady) return;
    if (typeof window === "undefined") return;

    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (category !== "all") params.set("category", category);
    if (sizeFilter !== "all") params.set("size", sizeFilter);
    if (sortMode !== "default") params.set("sort", sortMode);

    const nextQuery = params.toString();
    const currentQuery = window.location.search.replace(/^\?/, "");
    if (nextQuery === currentQuery) return;

    const nextUrl = nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [category, filtersReady, search, sizeFilter, sortMode]);

  useEffect(() => {
    if (!selectedProduct) {
      setReviews([]);
      setReviewText("");
      setReviewRating(5);
      return;
    }

    void fetchReviews(selectedProduct._id).then((data) => setReviews(data.reviews)).catch((fetchError: Error) => setError(fetchError.message));
  }, [selectedProduct]);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(products.map((product) => product.category))).sort()],
    [products],
  );

  const sizes = useMemo(
    () => ["all", ...Array.from(new Set(products.flatMap((product) => product.sizes))).sort()],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);
      const matchesCategory = category === "all" || product.category === category;
      const matchesSize = sizeFilter === "all" || product.sizes.includes(sizeFilter);
      return matchesSearch && matchesCategory && matchesSize;
    });

    if (sortMode === "price-asc") {
      return [...result].sort((a, b) => a.price - b.price);
    }

    if (sortMode === "price-desc") {
      return [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, category, sizeFilter, sortMode]);

  function addToCart(product: Product) {
    const size = selectedSizes[product._id] ?? product.sizes[0] ?? "ONE SIZE";
    setCart((current) => {
      const existing = current.find((item) => item.productId === product._id && item.size === size);
      if (existing) {
        return current.map((item) =>
          item.productId === product._id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { productId: product._id, name: product.name, price: product.price, quantity: 1, size, image: product.image }];
    });
    setMessage(`Товар "${product.name}" добавлен в корзину.`);
    setError("");
  }

  async function submitReview() {
    if (!selectedProduct) return;
    try {
      const data = await createReview({ productId: selectedProduct._id, rating: reviewRating, text: reviewText });
      setReviews((current) => [data.review, ...current]);
      setReviewText("");
      setReviewRating(5);
      setMessage("Отзыв добавлен.");
      setError("");
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Не удалось сохранить отзыв.");
    }
  }

  return (
    <PageShell>
      <ShopHeader
        title="Каталог одежды"
        subtitle="Актуальные позиции магазина. Используйте поиск и фильтры, чтобы быстрее найти нужный товар."
      />

      <div className="py-8 sm:py-10">
        <NoticeBanner error={error} message={message} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Каталог</p>
            <h2 className="section-title mt-3">Текущие позиции</h2>
          </div>
          <p className="max-w-xl text-[12px] uppercase leading-5 tracking-[0.12em] text-black/60 sm:text-sm sm:leading-7 sm:tracking-[0.18em]">
            Фильтруйте каталог по категории, размеру и цене. Карточка товара открывается поверх витрины.
          </p>
        </motion.div>

        <div className="soft-card mb-8 grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.24em]">
            <span>Поиск</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="signal-input" placeholder="НАЗВАНИЕ ИЛИ КАТЕГОРИЯ" />
          </label>
          <label className="space-y-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.24em]">
            <span>Категория</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="signal-input">
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "Все категории" : item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.24em]">
            <span>Размер</span>
            <select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)} className="signal-input">
              {sizes.map((item) => (
                <option key={item} value={item}>
                  {item === "all" ? "Все размеры" : item}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-[11px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.24em]">
            <span>Сортировка</span>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="signal-input">
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена по возрастанию</option>
              <option value="price-desc">Цена по убыванию</option>
            </select>
          </label>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-[12px] uppercase tracking-[0.12em] text-black/60 sm:text-sm sm:tracking-[0.18em]">Найдено: {filteredProducts.length}</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setSizeFilter("all");
              setSortMode("default");
            }}
            className="button-secondary"
          >
            Сбросить фильтры
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              index={index}
              selectedSize={selectedSizes[product._id] ?? product.sizes[0] ?? "ONE SIZE"}
              onSelectSize={(size) => setSelectedSizes((current) => ({ ...current, [product._id]: size }))}
              onAddToCart={() => addToCart(product)}
              onOpen={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/55 p-3 sm:p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18 }}
              className="mx-auto grid max-h-[92vh] max-w-6xl gap-4 overflow-y-auto border border-signal/20 bg-white p-4 sm:gap-6 sm:p-6 lg:grid-cols-[1fr_0.95fr]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="overflow-hidden border border-signal/15 bg-[#fff8f4]">
                {isImageUrl(selectedProduct.image) ? (
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full max-h-[52vh] w-full object-contain bg-[#fff8f4] p-3 sm:max-h-[70vh] sm:p-4" />
                ) : (
                  <div className="flex min-h-[280px] items-center justify-center p-6 text-center text-lg font-bold uppercase tracking-[0.14em] text-black/45 sm:min-h-[420px] sm:p-10 sm:text-xl sm:tracking-[0.2em]">
                    {selectedProduct.image}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="inline-flex border border-signal/30 bg-signal/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-signal sm:tracking-[0.28em]">
                        {selectedProduct.category}
                      </p>
                      <h3 className="mt-3 text-2xl font-extrabold uppercase tracking-[-0.04em] sm:text-3xl">{selectedProduct.name}</h3>
                    </div>
                    <button type="button" onClick={() => setSelectedProduct(null)} className="button-secondary">
                      Закрыть
                    </button>
                  </div>

                  <p className="mt-4 text-xl font-extrabold text-signal sm:mt-5 sm:text-2xl">{selectedProduct.price.toLocaleString("ru-RU")} ₽</p>
                  <p className="mt-4 text-[12px] uppercase leading-5 tracking-[0.12em] text-black/65 sm:mt-5 sm:text-sm sm:leading-7 sm:tracking-[0.18em]">
                    {selectedProduct.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSizes((current) => ({ ...current, [selectedProduct._id]: size }))}
                        className={`px-3 py-2 text-[10px] uppercase tracking-[0.14em] sm:text-xs sm:tracking-[0.24em] ${
                          (selectedSizes[selectedProduct._id] ?? selectedProduct.sizes[0]) === size ? "border border-signal bg-signal text-black" : "border border-black/10"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button type="button" onClick={() => addToCart(selectedProduct)} className="button-primary">
                      Добавить в корзину
                    </button>
                  </div>
                </div>

                <div className="border-t border-black/10 pt-6">
                  <p className="eyebrow">Отзывы</p>
                  <h4 className="mt-2 text-lg font-extrabold uppercase sm:text-xl">Оценки покупателей</h4>

                  <div className="mt-4 space-y-3">
                    {reviews.length === 0 ? (
                      <div className="border border-dashed border-black/15 px-4 py-4 text-[12px] uppercase tracking-[0.12em] text-black/45 sm:text-sm sm:tracking-[0.18em]">
                        Пока нет отзывов по этому товару.
                      </div>
                    ) : null}

                    {reviews.map((review) => (
                      <div key={review._id} className="border border-signal/15 bg-[#fffdfa] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[12px] font-bold uppercase tracking-[0.12em] sm:text-sm sm:tracking-[0.18em]">{review.authorName}</p>
                          <span className="text-[12px] font-bold text-signal sm:text-sm">{`${review.rating}/5`}</span>
                        </div>
                        <p className="mt-3 text-[12px] uppercase leading-5 tracking-[0.12em] text-black/65 sm:text-sm sm:leading-6 sm:tracking-[0.16em]">
                          {review.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {user ? (
                    <div className="mt-5 grid gap-3">
                      <select value={reviewRating} onChange={(event) => setReviewRating(Number(event.target.value))} className="signal-input">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} / 5
                          </option>
                        ))}
                      </select>
                      <textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} className="signal-input min-h-24 resize-none" placeholder="ВАШ ОТЗЫВ" />
                      <button type="button" onClick={() => void submitReview()} className="button-primary">
                        Оставить отзыв
                      </button>
                    </div>
                  ) : (
                    <p className="mt-4 text-[12px] uppercase tracking-[0.12em] text-black/55 sm:text-sm sm:tracking-[0.18em]">
                      Чтобы оставить отзыв, войдите в аккаунт.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PageShell>
  );
}
