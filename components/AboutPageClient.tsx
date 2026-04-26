"use client";

import { motion } from "framer-motion";
import PageShell from "@/components/shop/PageShell";
import ShopHeader from "@/components/shop/ShopHeader";

const features = [
  "Базовый ассортимент одежды для повседневного гардероба.",
  "Оффлайн-точки для покупки и самовывоза.",
  "Отдельные страницы под каталог, заказ и личный кабинет.",
];

export default function AboutPageClient() {
  return (
    <PageShell>
      <ShopHeader
        title="О бренде и магазине"
        subtitle="Информационная страница о KSK Shop с адресами, форматом работы и базовым описанием проекта."
      />

      <section className="grid gap-6 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-5"
        >
          <p className="eyebrow">О KSK Shop</p>
          <h2 className="section-title">Магазин одежды с чистой витриной и понятной навигацией</h2>
          <p className="text-[12px] uppercase leading-5 tracking-[0.12em] text-black/60 sm:text-sm sm:leading-7 sm:tracking-[0.18em]">
            KSK Shop объединяет онлайн-каталог, оформление заказа и личный кабинет в одном проекте.
            Страница может быть расширена историей бренда, фотографиями и подробными описаниями коллекций.
          </p>
        </motion.div>

        <div className="grid gap-4">
          {features.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + index * 0.1, duration: 0.5 }}
              className="soft-card p-4 sm:p-5"
            >
              <p className="eyebrow">Блок {index + 1}</p>
              <p className="mt-4 text-base font-bold uppercase tracking-[0.1em] sm:text-lg sm:tracking-[0.12em]">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 pb-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="soft-card p-5 sm:p-6"
        >
          <p className="eyebrow">Мелитополь</p>
          <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">пр. Б. Хмельницкого, 40</h3>
          <p className="mt-4 text-[12px] uppercase tracking-[0.14em] text-black/60 sm:text-sm sm:tracking-[0.18em]">+7 (990) 026-63-57</p>
          <p className="mt-4 text-[12px] uppercase leading-5 tracking-[0.12em] text-black/60 sm:text-sm sm:leading-7 sm:tracking-[0.18em]">
            Точка продаж и консультаций по ассортименту.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="soft-card p-5 sm:p-6"
        >
          <p className="eyebrow">Геническ</p>
          <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">Ц. Рынок</h3>
          <p className="mt-4 text-[12px] uppercase tracking-[0.14em] text-black/60 sm:text-sm sm:tracking-[0.18em]">+7 (990) 273-76-05</p>
          <p className="mt-4 text-[12px] uppercase leading-5 tracking-[0.12em] text-black/60 sm:text-sm sm:leading-7 sm:tracking-[0.18em]">
            Локальная точка выдачи и знакомства с коллекцией.
          </p>
        </motion.div>
      </section>
    </PageShell>
  );
}
