"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "@/components/shop/PageShell";
import ShopHeader from "@/components/shop/ShopHeader";
import { assortmentSections, buildWhatsAppLink, type AssortmentSection } from "@/lib/assortment";

const filters: AssortmentSection["title"][] = ["ЖЕНСКОЕ", "МУЖСКОЕ", "ДЕТСКОЕ", "КОРПОРАТИВНОЕ"];

const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

export default function ShopPageClient() {
  const [activeFilter, setActiveFilter] = useState<AssortmentSection["title"]>("ЖЕНСКОЕ");

  const activeSection = useMemo(
    () => assortmentSections.find((section) => section.title === activeFilter) ?? assortmentSections[0],
    [activeFilter],
  );

  return (
    <PageShell>
      <ShopHeader
        title="МАГАЗИН / КАТАЛОГ"
        subtitle="Навигация по женскому, мужскому, детскому и корпоративному ассортименту с переходом в отдельные категории."
      />

      <section className="py-8 sm:py-10">
        <div className="mb-6 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`border-2 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] transition-all sm:text-[11px] ${
                activeFilter === filter
                  ? "border-black bg-signal text-black shadow-[10px_10px_0px_#FF4500]"
                  : "border-black bg-white text-black shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[10px_10px_0px_#FF4500]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mb-8 border-2 border-black bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] uppercase tracking-[0.22em] text-signal">{activeSection.title}</p>
          <h2 className="mt-3 text-2xl font-extrabold uppercase tracking-[-0.04em] sm:text-3xl">{activeSection.title}</h2>
          <p className="mt-3 max-w-3xl text-[11px] uppercase leading-5 tracking-[0.12em] text-black/62 sm:text-[12px] sm:leading-6">
            {activeSection.description}
          </p>
        </div>

        <motion.div variants={gridVariants} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeSection.categories.map((category) => (
            <motion.article
              key={category.slug}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className="category-card border-2 border-black bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[10px_10px_0px_#FF4500]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-signal">{activeSection.title}</p>
                  <h3 className="mt-3 text-xl font-extrabold uppercase tracking-[-0.03em] text-black">{category.name}</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">{category.items.length}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <span key={item} className="border border-black/15 bg-[#fff8f5] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-black/72">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/shop/category/${category.slug}`} className="button-primary">
                  ОТКРЫТЬ КАТЕГОРИЮ
                </Link>
                <a
                  href={buildWhatsAppLink(`Здравствуйте! Интересует категория "${category.orderText}" в разделе "${activeSection.title}".`)}
                  target="_blank"
                  rel="noreferrer"
                  className="button-accent"
                >
                  ЗАКАЗАТЬ КАТЕГОРИЮ
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </PageShell>
  );
}
