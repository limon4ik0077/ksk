"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PageShell from "@/components/shop/PageShell";
import ShopHeader from "@/components/shop/ShopHeader";
import { buildWhatsAppLink, type AssortmentCategory, type AssortmentSection } from "@/lib/assortment";

type ShopCategoryPageClientProps = {
  section: AssortmentSection;
  category: AssortmentCategory;
};

export default function ShopCategoryPageClient({ section, category }: ShopCategoryPageClientProps) {
  return (
    <PageShell>
      <ShopHeader
        title={`${category.name} / ${section.title}`}
        subtitle="Категорийная страница с подтипами, быстрым переходом к заказу и возвратом в общий магазин."
      />

      <section className="grid gap-6 py-8 sm:py-10 xl:grid-cols-[1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="border-2 border-black bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-signal">{section.title}</p>
          <h2 className="mt-3 text-2xl font-extrabold uppercase tracking-[-0.04em] sm:text-4xl">{category.name}</h2>
          <p className="mt-4 text-[11px] uppercase leading-5 tracking-[0.12em] text-black/62 sm:text-[12px] sm:leading-6">
            Раздел собран для быстрого перехода к нужной категории и уточнения подтипов перед заказом. Можно сразу перейти в WhatsApp
            и отправить заявку с уже заполненным текстом.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={buildWhatsAppLink(`Здравствуйте! Хочу заказать категорию "${category.orderText}" из раздела "${section.title}".`)}
              target="_blank"
              rel="noreferrer"
              className="button-accent"
            >
              ЗАКАЗАТЬ КАТЕГОРИЮ
            </a>
            <Link href="/shop" className="button-primary">
              ВЕРНУТЬСЯ В МАГАЗИН
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="border-2 border-black bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <p className="eyebrow">ПОДКАТЕГОРИИ</p>
          <div className="mt-4 grid gap-3">
            {category.items.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ x: 4 }}
                className="border-2 border-black bg-white px-4 py-4 shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[10px_10px_0px_#FF4500]"
              >
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-black">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}
