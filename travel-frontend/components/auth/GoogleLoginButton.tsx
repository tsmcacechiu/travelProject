"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "@/lib/auth";
import { useAuth } from "@/components/providers/AuthProvider";

export default function GoogleLoginButton() {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    scope: "openid profile email",
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const { user } = await loginWithGoogle(tokenResponse.access_token);
        setUser(user);
      } catch (error) {
        console.error("Google 登入失敗", error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => console.error("Google 登入失敗"),
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      disabled={isLoading}
      className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 disabled:opacity-50"
    >
      {isLoading ? "登入中…" : "使用 Google 登入"}
    </button>
  );
}
