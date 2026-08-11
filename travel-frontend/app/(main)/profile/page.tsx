"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import GoogleLoginPlaceholder from "@/components/auth/GoogleLoginPlaceholder";
import { updateProfile } from "@/lib/auth";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function ProfilePage() {
  const { user, isLoading, logout, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (isLoading) {
    return <main className="min-h-screen bg-slate-50 pt-24 px-6" />;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 pt-24 px-6">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-800">尚未登入</h1>
          <p className="mt-2 text-slate-500">請先使用 Google 登入以查看個人資料</p>
          <div className="mt-6 flex justify-center">
            {GOOGLE_CLIENT_ID ? <GoogleLoginButton /> : <GoogleLoginPlaceholder />}
          </div>
        </div>
      </main>
    );
  }

  function startEditing() {
    setNameInput(user!.name ?? "");
    setError("");
    setIsEditing(true);
  }

  async function handleSave() {
    if (!nameInput.trim()) {
      setError("名稱不能為空");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      const updated = await updateProfile(nameInput.trim());
      setUser(updated);
      setIsEditing(false);
    } catch {
      setError("更新失敗，請稍後再試");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 px-6">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          {user.pictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.pictureUrl}
              alt={user.name ?? user.email}
              className="mx-auto h-20 w-20 rounded-full ring-4 ring-emerald-200"
            />
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-semibold text-emerald-600 ring-4 ring-emerald-200">
              {(user.name ?? user.email).charAt(0).toUpperCase()}
            </div>
          )}

          {isEditing ? (
            <div className="mt-4">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-center text-xl font-bold text-slate-800 focus:border-emerald-400 focus:outline-none"
              />
              {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
              <div className="mt-3 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-full bg-emerald-500 px-5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                >
                  {isSaving ? "儲存中…" : "儲存"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="rounded-full border border-slate-200 px-5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-700"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold text-slate-800">{user.name || "旅人"}</h1>
              <button
                type="button"
                onClick={startEditing}
                title="編輯名稱"
                className="text-slate-300 transition-colors hover:text-emerald-600"
              >
                ✏️
              </button>
            </div>
          )}

          <p className="mt-1 text-slate-500">{user.email}</p>
          {user.createdAt && (
            <p className="mt-4 text-xs tracking-wide text-slate-400 uppercase">
              加入於 {new Date(user.createdAt).toLocaleDateString("zh-TW")}
            </p>
          )}
          <button
            type="button"
            onClick={logout}
            className="mt-6 rounded-full border border-slate-200 px-6 py-2 text-sm font-medium text-slate-500 transition-colors hover:border-emerald-300 hover:text-emerald-600"
          >
            登出
          </button>
        </div>
      </div>
    </main>
  );
}
