"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InputForm from "./InputForm";
import CountdownResult from "./CountdownResult";
import { estimateLifeExpectancy, type HealthProfile } from "@/lib/lifeExpectancy";

const STORAGE_KEY = "countdown_profile";

interface SavedData {
  profile: HealthProfile;
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

  function handleSubmit(profile: HealthProfile) {
    const lifeExpectancy = estimateLifeExpectancy(profile).value;
    const data = { profile, lifeExpectancy };
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
    <AnimatePresence mode="popLayout" initial={false}>
      {submitted && saved ? (
        <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <CountdownResult
            birthDate={saved.profile.birthDate}
            lifeExpectancy={saved.lifeExpectancy}
            onReset={handleReset}
          />
        </motion.div>
      ) : (
        <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <InputForm onSubmit={handleSubmit} defaultProfile={saved?.profile} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
