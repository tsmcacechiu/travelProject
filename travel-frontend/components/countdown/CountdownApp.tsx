"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InputForm from "./InputForm";
import CountdownResult from "./CountdownResult";
import { estimateLifeExpectancy, type HealthProfile } from "@/lib/lifeExpectancy";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchLifecycle, saveLifecycle } from "@/lib/lifecycle";

const STORAGE_KEY = "countdown_profile";

interface SavedData {
  profile: HealthProfile;
  lifeExpectancy: number;
}

export default function CountdownApp() {
  const { user, isLoading: authLoading } = useAuth();
  const [saved, setSaved] = useState<SavedData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Wait for the login check to resolve first, so a logged-in user's saved account
    // record (if any) takes priority over whatever's sitting in this browser's
    // localStorage, instead of flashing local data that then gets replaced.
    if (authLoading) return;

    async function hydrate() {
      if (user) {
        const remote = await fetchLifecycle();
        if (remote) {
          const { lifeExpectancy, updatedAt: _updatedAt, ...profile } = remote;
          const data: SavedData = { profile, lifeExpectancy };
          setSaved(data);
          setSubmitted(true);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          setHydrated(true);
          return;
        }
      }

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
    }

    hydrate();
  }, [user, authLoading]);

  function handleSubmit(profile: HealthProfile) {
    const lifeExpectancy = estimateLifeExpectancy(profile).value;
    const data = { profile, lifeExpectancy };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(data);
    setSubmitted(true);

    // Logged-out visitors can still try the calculator freely — it just stays local.
    // Only once logged in does the result get written into the account's lifecycle record.
    if (user) {
      saveLifecycle(profile, lifeExpectancy).catch(() => {
        // Best-effort: the local copy above already reflects the result either way.
      });
    }
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
