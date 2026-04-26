"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  index: number;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  onAddToCart: () => void;
  onOpen?: () => void;
};

function isImageUrl(value: string) {
  return /^(https?:\/\/|\/uploads\/)/i.test(value);
}

export default function ProductCard({
  product,
  index,
  selectedSize,
  onSelectSize,
  onAddToCart,
  onOpen,
}: ProductCardProps) {
  const hasImage = isImageUrl(product.image);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      whileHover={{ y: -8 }}
      className="soft-card flex min-h-[360px] flex-col justify-between overflow-hidden p-4 sm:min-h-[390px] sm:p-5"
    >
      <div>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-black/45 sm:text-xs sm:tracking-[0.24em]">
          <span>{product.category}</span>
          <span>{product.inStock ? "В наличии" : "Нет в наличии"}</span>
        </div>

        <button type="button" onClick={onOpen} className="mt-4 block w-full overflow-hidden border border-signal/20 bg-[#fff8f4] text-left">
          {hasImage ? (
            <img src={product.image} alt={product.name} className="h-44 w-full object-contain bg-[#fff8f4] p-3 sm:h-56" />
          ) : (
            <div className="flex h-44 items-end justify-between p-4 sm:h-56 sm:p-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-black/45 sm:text-xs sm:tracking-[0.24em]">{product.image}</p>
                <h3 className="mt-3 text-lg font-extrabold sm:text-2xl">{product.name}</h3>
              </div>
              <p className="text-lg font-bold text-signal sm:text-2xl">{product.price.toLocaleString("ru-RU")} ₽</p>
            </div>
          )}
          {hasImage ? (
            <div className="flex items-end justify-between gap-3 border-t border-signal/15 p-4 sm:gap-4 sm:p-5">
              <h3 className="text-lg font-extrabold sm:text-2xl">{product.name}</h3>
              <p className="text-lg font-bold text-signal sm:text-2xl">{product.price.toLocaleString("ru-RU")} ₽</p>
            </div>
          ) : null}
        </button>

        <p className="mt-4 text-[12px] uppercase leading-5 tracking-[0.12em] text-black/60 sm:text-sm sm:leading-6 sm:tracking-[0.18em]">{product.description}</p>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-black/45 sm:text-xs sm:tracking-[0.24em]">Размер</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => {
              const isActive = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(size)}
                  className={`px-3 py-2 text-[10px] uppercase tracking-[0.14em] transition-all sm:text-xs sm:tracking-[0.24em] ${
                    isActive ? "bg-black text-white" : "border border-black/10 bg-white hover:border-signal"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <motion.button
            whileHover={{ x: 8, y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            onClick={onAddToCart}
            className="button-primary w-full animate-pulse-glow"
          >
            Добавить в корзину
          </motion.button>
          <button type="button" onClick={onOpen} className="button-secondary px-3">
            Подробнее
          </button>
        </div>
      </div>
    </motion.article>
  );
}
