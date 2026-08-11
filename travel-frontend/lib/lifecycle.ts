import { apiFetch } from "./api";
import type { HealthProfile } from "./lifeExpectancy";

export type LifecycleRecord = HealthProfile & {
  lifeExpectancy: number;
  updatedAt?: string;
};

/** Returns null when the user has no saved lifecycle yet (or the request fails). */
export async function fetchLifecycle(): Promise<LifecycleRecord | null> {
  try {
    return await apiFetch<LifecycleRecord>("/api/countdown/lifecycle");
  } catch {
    return null;
  }
}

export function saveLifecycle(profile: HealthProfile, lifeExpectancy: number): Promise<LifecycleRecord> {
  const body: LifecycleRecord = { ...profile, lifeExpectancy };
  return apiFetch<LifecycleRecord>("/api/countdown/lifecycle", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
