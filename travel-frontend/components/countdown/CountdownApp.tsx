"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InputForm from "./InputForm";
import CountdownResult from "./CountdownResult";

const STORAGE_KEY = "countdown_data";

interface SavedData {
  birthDate: string;
  lifeExpectancy: number;
}

export default function CountdownApp() {
  const [saved, setSaved] = useState<SavedData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as SavedData;
        setSaved(data);
        setSubmitted(true);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  function handleSubmit(birthDate: string, lifeExpectancy: number) {
    const data = { birthDate, lifeExpectancy };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(data);
    setSubmitted(true);
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY);
    setSaved(null);
    setSubmitted(false);
  }

  if (!hydrated) return null;

  return (
    <AnimatePresence mode="wait">
      {submitted && saved ? (
        <motion.div
          key="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CountdownResult
            birthDate={saved.birthDate}
            lifeExpectancy={saved.lifeExpectancy}
            onReset={handleReset}
          />
        </motion.div>
      ) : (
        <motion.div
          key="input"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <InputForm
            onSubmit={handleSubmit}
            defaultBirthDate={saved?.birthDate}
            defaultLifeExpectancy={saved?.lifeExpectancy}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
