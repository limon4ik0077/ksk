"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ShopFooter() {
  const pathname = usePathname();

  return (
    <footer className="mt-12 border-t border-black/10 pt-6 pb-20 md:pb-6">
      <div className="grid gap-6 border-[3px] border-black bg-white p-5 text-[10px] uppercase tracking-[0.16em] text-black/55 sm:grid-cols-[1fr_auto] sm:items-end sm:text-[11px]">
        <div>
          <Link href="/" className="font-bold text-black transition-colors hover:text-signal">
            KSK Shop
          </Link>
          <p className="mt-3 text-[10px] uppercase leading-5 tracking-[0.14em] text-black/55">
            г. Мелитополь, пр. Б. Хмельницкого 40
          </p>
          <a href="tel:+79900266357" className="mt-2 block font-bold text-black transition-colors hover:text-signal">
            +79900266357
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/catalog" className={`transition-colors hover:text-signal ${pathname === "/catalog" ? "text-signal" : ""}`}>
            Каталог
          </Link>
          <Link href="/about" className={`transition-colors hover:text-signal ${pathname === "/about" ? "text-signal" : ""}`}>
            О нас
          </Link>
          <Link href="/checkout" className={`transition-colors hover:text-signal ${pathname === "/checkout" ? "text-signal" : ""}`}>
            Заказ
          </Link>
          <Link href="/account" className={`transition-colors hover:text-signal ${pathname === "/account" ? "text-signal" : ""}`}>
            Кабинет
          </Link>
        </div>
      </div>
    </footer>
  );
}
