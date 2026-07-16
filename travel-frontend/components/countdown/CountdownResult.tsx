"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { calculateTimeRemaining, lifePercent, type TimeRemaining } from "@/lib/countdown";
import { randomQuote, type Quote } from "@/lib/quotes";
import LifeGrid from "./LifeGrid";

interface Props {
  birthDate: string;
  lifeExpectancy: number;
  onReset: () => void;
}

interface TimeUnit {
  label: string;
  value: number;
}

function pad(n: number, digits = 2) {
  return String(n).padStart(digits, "0");
}

export default function CountdownResult({ birthDate, lifeExpectancy, onReset }: Props) {
  const birth = new Date(birthDate);
  const [time, setTime] = useState<TimeRemaining>(() => calculateTimeRemaining(birth, lifeExpectancy));
  const [quote] = useState<Quote>(() => randomQuote());
  const percent = lifePercent(birth, lifeExpectancy);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(calculateTimeRemaining(birth, lifeExpectancy));
    }, 1000);
    return () => clearInterval(id);
  }, [birthDate, lifeExpectancy]);

  const units: TimeUnit[] = [
    { label: "年", value: time.years },
    { label: "月", value: time.months },
    { label: "週", value: time.weeks },
    { label: "天", value: time.days },
  ];

  const clockUnits: TimeUnit[] = [
    { label: "時", value: time.hours },
    { label: "分", value: time.minutes },
    { label: "秒", value: time.seconds },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between px-6 py-6"
      >
        <p className="text-xs font-semibold tracking-[0.4em] text-white/30 uppercase">
          生命倒數計時表
        </p>
        <button
          onClick={onReset}
          className="text-xs tracking-widest text-white/30 uppercase transition-colors hover:text-white"
        >
          重新輸入
        </button>
      </motion.div>

      {/* Main countdown units */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="border-b border-white/10 px-6 py-12"
      >
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 text-xs font-semibold tracking-[0.3em] text-white/30 uppercase">
            剩餘時間
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {units.map((u) => (
              <div key={u.label} className="space-y-1">
                <p className="text-5xl font-bold tabular-nums text-white md:text-6xl">
                  {u.value.toLocaleString()}
                </p>
                <p className="text-xs tracking-widest text-white/30 uppercase">{u.label}</p>
              </div>
            ))}
          </div>

          {/* Clock */}
          <div className="mt-10 flex gap-6">
            {clockUnits.map((u, i) => (
              <div key={u.label} className="flex items-baseline gap-1">
                <span className="text-2xl font-mono font-semibold tabular-nums text-white/70">
                  {pad(u.value)}
                </span>
                <span className="text-xs text-white/30">{u.label}</span>
                {i < clockUnits.length - 1 && (
                  <span className="ml-1 text-white/20">:</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Life progress bar */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="border-b border-white/10 px-6 py-12"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[0.3em] text-white/30 uppercase">
              人生進度
            </p>
            <p className="text-sm text-white">
              <span className="text-2xl font-bold">{percent.toFixed(1)}</span>
              <span className="ml-1 text-white/40">% 已走過</span>
            </p>
          </div>
          <div className="h-px w-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              className="h-full bg-white"
            />
          </div>
          <div className="flex justify-between text-xs text-white/20">
            <span>誕生</span>
            <span>{lifeExpectancy} 歲</span>
          </div>
        </div>
      </motion.section>

      {/* Life calendar */}
      <div className="border-b border-white/10">
        <LifeGrid birthDate={birth} lifeExpectancy={lifeExpectancy} />
      </div>

      {/* Philosophy quote */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="px-6 py-20 text-center"
      >
        <blockquote className="mx-auto max-w-lg">
          <p className="text-xl font-light leading-relaxed text-white/80 md:text-2xl">
            &ldquo;{quote.text}&rdquo;
          </p>
          <footer className="mt-6 text-sm text-white/30">— {quote.author}</footer>
        </blockquote>
      </motion.section>
    </div>
  );
}
