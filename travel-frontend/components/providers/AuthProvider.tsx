"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchCurrentUser, logout as clearSession } from "@/lib/auth";
import { getToken } from "@/lib/token";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (!getToken()) {
        setIsLoading(false);
        return;
      }
      try {
        setUser(await fetchCurrentUser());
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
