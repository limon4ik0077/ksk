"use client";

import { motion } from "framer-motion";
import PageShell from "@/components/shop/PageShell";
import ShopHeader from "@/components/shop/ShopHeader";
import { buildWhatsAppLink } from "@/lib/assortment";

export default function HomeHub() {
  return (
    <PageShell>
      <ShopHeader
        title="KSK — БРЕНДОВЫЙ МАГАЗИН ЖЕНСКОЙ ОДЕЖДЫ"
        subtitle="Neo-brutalism витрина бренда, новые сезонные капсулы и навигация по ассортименту."
      />

      <section className="grid gap-6 py-8 sm:py-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="eyebrow">PORTFOLIO / HERO</p>
          <h2 className="mt-4 text-2xl font-extrabold uppercase tracking-[-0.04em] text-black sm:text-4xl xl:text-5xl">
            KSK — БРЕНДОВЫЙ МАГАЗИН ЖЕНСКОЙ ОДЕЖДЫ
          </h2>
          <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.18em] text-signal sm:text-sm">
            НОВАЯ КОЛЛЕКЦИЯ: ОСЕНЬ-ЗИМА 24-25 ⚡️
          </p>
          <p className="mt-5 max-w-3xl text-[12px] uppercase leading-6 tracking-[0.14em] text-black/68 sm:text-sm sm:leading-7">
            Новая коллекция собрана вокруг плотного хлопка, техничного силуэта и вещей на каждый день. В фокусе —
            худи, костюмы, zip-модели, брюки и капсульные решения для женского гардероба.
          </p>
          <a href="/shop" className="button-accent mt-8 inline-flex">
            ⚡ ПЕРЕЙТИ В МАГАЗИН
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="border-2 border-black bg-white p-5 shadow-[10px_10px_0px_#FF4500]"
        >
          <p className="eyebrow">TEAM / BRAND NOTE</p>
          <p className="mt-4 text-[12px] uppercase leading-6 tracking-[0.14em] text-black/72 sm:text-sm sm:leading-7">
            Осень-зима 24-25 — это сезон вещей, которые работают в городе, в повседневной носке и в капсулах под заказ.
            Бренд собирает чистые формы, жёсткие линии и плотный хлопок в понятный гардероб без лишнего шума.
          </p>
        </motion.div>
      </section>

      <section className="grid gap-6 py-8 xl:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="border-2 border-black bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
        >
          <p className="eyebrow">КОМАНДА</p>
          <h2 className="section-title mt-3">Ценности производства</h2>
          <p className="mt-4 text-[12px] font-bold uppercase leading-6 tracking-[0.12em] text-black sm:text-sm sm:leading-7">
            «Цели производства одежды — выглядеть на миллион при доступности каждому».
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="border-2 border-black bg-black p-5 shadow-[10px_10px_0px_#FF4500]"
        >
          <p className="text-[10px] uppercase tracking-[0.22em] text-signal">B2B / PRINT</p>
          <h2 className="mt-4 text-lg font-extrabold uppercase tracking-[-0.03em] text-white sm:text-2xl lg:text-3xl">
            ИЗГОТОВИМ МАССОВКУ И НАНЕСЕМ ПРИНТ
          </h2>
          <a
            href={buildWhatsAppLink("Здравствуйте! Нужен B2B заказ: массовка и нанесение принта.")}
            target="_blank"
            rel="noreferrer"
            className="button-accent mt-6 inline-flex"
          >
            ОСТАВИТЬ ЗАЯВКУ
          </a>
        </motion.div>
      </section>

      <section className="py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-4 xl:grid-cols-[1fr_1fr_auto]"
        >
          <div className="border-2 border-black bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <p className="eyebrow">МЕЛИТОПОЛЬ</p>
            <h3 className="mt-3 text-xl font-extrabold uppercase tracking-[-0.03em]">ПР. Б. ХМЕЛЬНИЦКОГО 40</h3>
          </div>
          <div className="border-2 border-black bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <p className="eyebrow">ГЕНИЧЕСК</p>
            <h3 className="mt-3 text-xl font-extrabold uppercase tracking-[-0.03em]">Ц. РЫНОК</h3>
          </div>
          <a href="tel:+79900266357" className="button-primary min-h-full justify-center">
            +79900266357
          </a>
        </motion.div>
      </section>
    </PageShell>
  );
}
