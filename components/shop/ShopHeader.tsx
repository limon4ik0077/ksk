"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { assortmentSections } from "@/lib/assortment";
import { CART_UPDATED_EVENT, cartCount, cartTotal, loadCart } from "@/lib/shop-client";
import type { CartItem } from "@/lib/types";

const navItems = [
  { label: "МАГАЗИН", href: "/shop" },
  { label: "О НАС", href: "/about" },
  { label: "КОРЗИНА", href: "/checkout" },
  { label: "КАБИНЕТ", href: "/account" },
];

type ShopHeaderProps = {
  title: string;
  subtitle: string;
};

export default function ShopHeader({ title, subtitle }: ShopHeaderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const syncCart = () => setCart(loadCart());
    syncCart();
    window.addEventListener("focus", syncCart);
    window.addEventListener("storage", syncCart);
    window.addEventListener(CART_UPDATED_EVENT, syncCart);

    return () => {
      window.removeEventListener("focus", syncCart);
      window.removeEventListener("storage", syncCart);
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
    };
  }, []);

  const count = cartCount(cart);
  const total = cartTotal(cart);
  const desktopSections = useMemo(() => assortmentSections, []);

  function isActive(href: string) {
    if (href === "/shop") {
      return pathname === "/shop" || pathname.startsWith("/shop/");
    }
    return pathname === href;
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="sticky top-0 z-50 border-b-2 border-black bg-white shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
        style={{ marginLeft: "calc(var(--page-gutter) * -1)", marginRight: "calc(var(--page-gutter) * -1)" }}
      >
        <div
          className="flex items-center justify-between gap-4 py-4 sm:py-5"
          style={{ paddingLeft: "var(--page-gutter)", paddingRight: "var(--page-gutter)" }}
        >
          <div className="flex min-w-0 items-center gap-4 xl:gap-8">
            <Link href="/" className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-black transition-colors hover:text-signal sm:text-[12px]">
              KSK SHOP
            </Link>

            <div className="relative hidden xl:block" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
              <button
                type="button"
                onClick={() => setMegaOpen((current) => !current)}
                className={`border-2 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-all ${
                  megaOpen || isActive("/shop")
                    ? "border-black bg-signal text-black shadow-[10px_10px_0px_#FF4500]"
                    : "border-black bg-white text-black hover:shadow-[10px_10px_0px_#FF4500]"
                }`}
              >
                МАГАЗИН
              </button>

              <AnimatePresence>
                {megaOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 top-full mt-3 w-[min(1120px,78vw)] border-2 border-black bg-white p-6 shadow-[10px_10px_0px_#FF4500]"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      {desktopSections.map((section) => (
                        <div key={section.id} className="border-2 border-black bg-[#fffdfb] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
                          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-signal">{section.title}</p>
                          <p className="mt-2 text-[11px] uppercase leading-5 tracking-[0.12em] text-black/60">{section.description}</p>
                          <div className="mt-4 grid gap-3">
                            {section.categories.map((category) => (
                              <Link
                                key={category.slug}
                                href={`/shop/category/${category.slug}`}
                                className="border border-black/20 bg-white px-3 py-3 transition-shadow hover:shadow-[10px_10px_0px_#FF4500]"
                              >
                                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-black">{category.name}</p>
                                <p className="mt-2 text-[10px] uppercase leading-5 tracking-[0.12em] text-black/55">{category.items.join(" / ")}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <nav className="hidden items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-black/70 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border-2 px-3 py-2 transition-all ${
                    isActive(item.href) ? "border-black bg-signal text-black shadow-[10px_10px_0px_#FF4500]" : "border-black bg-white hover:text-signal hover:shadow-[10px_10px_0px_#FF4500]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setMenuOpen((current) => !current)} className="button-secondary px-3 xl:hidden">
              МЕНЮ
            </button>
            <Link
              href="/checkout"
              className="shrink-0 border-2 border-black bg-signal px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-black transition-all hover:bg-[#ff5c1f] hover:shadow-[10px_10px_0px_#FF4500] sm:px-3.5 sm:text-[11px]"
            >
              {total.toLocaleString("ru-RU")} ₽ / {count} ШТ.
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden xl:hidden"
            >
              <div className="grid gap-5 px-4 py-4 sm:px-5">
                <div className="grid gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`border-2 px-3 py-3 text-[11px] font-bold uppercase tracking-[0.16em] transition-all ${
                        isActive(item.href)
                          ? "border-black bg-signal text-black shadow-[10px_10px_0px_#FF4500]"
                          : "border-black bg-white text-black shadow-[0_6px_18px_rgba(0,0,0,0.04)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="grid gap-4">
                  {desktopSections.map((section) => (
                    <div key={section.id} className="border-2 border-black bg-[#fffdfb] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-signal">{section.title}</p>
                      <div className="mt-3 grid gap-2">
                        {section.categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/shop/category/${category.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="border border-black/20 bg-white px-3 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
                          >
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em]">{category.name}</p>
                            <p className="mt-1 text-[10px] uppercase leading-5 tracking-[0.12em] text-black/55">{category.items.join(" / ")}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      <div className="py-6 sm:py-8 lg:py-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/45 sm:text-[11px]">KSK SHOP</p>
        <h1 className="mt-2 text-base font-extrabold tracking-[-0.02em] text-black sm:text-xl lg:text-2xl 2xl:text-[2rem]">{title}</h1>
        <p className="mt-2 max-w-4xl text-[11px] uppercase leading-5 tracking-[0.12em] text-black/55 sm:text-[12px] sm:leading-6">
          {subtitle}
        </p>
      </div>

      <div className="fixed bottom-3 left-3 right-3 z-40 xl:hidden">
        <Link
          href="/checkout"
          className="flex items-center justify-between border-2 border-black bg-signal px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-black shadow-[10px_10px_0px_#FF4500]"
        >
          <span>КОРЗИНА</span>
          <span>
            {count} ШТ. / {total.toLocaleString("ru-RU")} ₽
          </span>
        </Link>
      </div>
    </>
  );
}
