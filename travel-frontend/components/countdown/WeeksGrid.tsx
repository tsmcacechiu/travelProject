"use client";

import { motion } from "framer-motion";
import { totalWeeks } from "@/lib/countdown";

interface Props {
  lived: number;
  lifeExpectancy: number;
}

export default function WeeksGrid({ lived, lifeExpectancy }: Props) {
  const total = totalWeeks(lifeExpectancy);
  const cols = 52;

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-white/30 uppercase">
          人生週數視覺化
        </p>
        <p className="mb-6 text-sm text-white/40">
          每個方格代表一週。已填 <span className="text-white">{lived}</span> 週，剩餘{" "}
          <span className="text-white">{total - lived}</span> 週
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid gap-px"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square ${
                i < lived
                  ? "bg-white"
                  : "bg-white/8 border border-white/10"
              }`}
            />
          ))}
        </motion.div>

        <div className="mt-4 flex items-center gap-6 text-xs text-white/30">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 bg-white" /> 已過去
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 border border-white/20 bg-white/8" /> 尚剩餘
          </span>
        </div>
      </div>
    </section>
  );
}
