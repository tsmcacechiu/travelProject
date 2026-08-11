import { apiFetch } from "./api";
import { setToken, clearToken } from "./token";
import type { AuthResponse, User } from "@/types";

export async function loginWithGoogle(accessToken: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ accessToken }),
  });
  setToken(data.token);
  return data;
}

export function fetchCurrentUser(): Promise<User> {
  return apiFetch<User>("/api/auth/me");
}

export function updateProfile(name: string): Promise<User> {
  return apiFetch<User>("/api/auth/me", {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export function logout() {
  clearToken();
}
