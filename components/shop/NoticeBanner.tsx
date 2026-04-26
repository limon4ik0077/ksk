"use client";

import { AnimatePresence, motion } from "framer-motion";

type NoticeBannerProps = {
  error: string;
  message: string;
};

export default function NoticeBanner({ error, message }: NoticeBannerProps) {
  return (
    <AnimatePresence mode="wait">
      {(message || error) && (
        <motion.div
          key={`${message}-${error}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`mb-8 px-4 py-3 text-sm uppercase tracking-[0.18em] ${
            error ? "bg-red-50 text-red-700" : "bg-signal/12 text-black"
          }`}
        >
          {error || message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
