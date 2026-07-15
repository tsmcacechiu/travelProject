"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onSubmit: (birthDate: string, lifeExpectancy: number) => void;
  defaultBirthDate?: string;
  defaultLifeExpectancy?: number;
}

export default function InputForm({ onSubmit, defaultBirthDate = "", defaultLifeExpectancy = 80 }: Props) {
  const [birthDate, setBirthDate] = useState(defaultBirthDate);
  const [lifeExpectancy, setLifeExpectancy] = useState(defaultLifeExpectancy);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthDate) {
      setError("請輸入你的出生日期");
      return;
    }
    const birth = new Date(birthDate);
    if (birth > new Date()) {
      setError("出生日期不能在未來");
      return;
    }
    setError("");
    onSubmit(birthDate, lifeExpectancy);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex min-h-screen flex-col items-center justify-center px-6"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-3 text-xs font-semibold tracking-[0.4em] text-white/30 uppercase"
      >
        生命倒數計時表
      </motion.p>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-4xl font-bold text-white md:text-5xl"
      >
        你還剩下多少時間？
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 max-w-sm text-center text-sm text-white/40"
      >
        輸入你的出生日期，看見生命的真實重量
      </motion.p>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onSubmit={handleSubmit}
        className="mt-12 w-full max-w-sm space-y-8"
      >
        <div className="space-y-2">
          <label className="block text-xs font-medium tracking-widest text-white/40 uppercase">
            出生日期
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full border-0 border-b border-white/20 bg-transparent py-3 text-lg text-white focus:border-white focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium tracking-widest text-white/40 uppercase">
              預期壽命
            </label>
            <span className="text-sm font-semibold text-white">{lifeExpectancy} 歲</span>
          </div>
          <input
            type="range"
            min={50}
            max={120}
            value={lifeExpectancy}
            onChange={(e) => setLifeExpectancy(Number(e.target.value))}
            className="w-full accent-white"
          />
          <div className="flex justify-between text-xs text-white/20">
            <span>50</span>
            <span>120</span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          className="w-full border border-white/20 py-4 text-sm font-semibold tracking-widest text-white uppercase transition-all hover:bg-white hover:text-black"
        >
          開始計算
        </button>
      </motion.form>
    </motion.div>
  );
}
