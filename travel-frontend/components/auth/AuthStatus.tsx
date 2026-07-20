"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import GoogleLoginButton from "./GoogleLoginButton";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function AuthStatus() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return null;

  // useGoogleLogin() calls Google's own SDK as soon as it mounts, which throws if
  // client_id is empty — so don't mount the button until one is actually configured.
  if (!user) return GOOGLE_CLIENT_ID ? <GoogleLoginButton /> : null;

  return (
    <div className="flex items-center gap-3">
      {user.pictureUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.pictureUrl}
          alt={user.name ?? user.email}
          className="h-7 w-7 rounded-full ring-2 ring-orange-200"
        />
      ) : (
        <span className="text-sm text-stone-700">{user.name ?? user.email}</span>
      )}
      <button
        type="button"
        onClick={logout}
        className="text-xs font-medium text-stone-400 transition-colors hover:text-orange-600"
      >
        登出
      </button>
    </div>
  );
}
