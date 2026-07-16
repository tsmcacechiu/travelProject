export interface TimeRemaining {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function calculateTimeRemaining(birthDate: Date, lifeExpectancy: number): TimeRemaining {
  const now = new Date();
  const endDate = new Date(birthDate);
  endDate.setFullYear(endDate.getFullYear() + lifeExpectancy);

  const diffMs = Math.max(0, endDate.getTime() - now.getTime());

  const totalSec = Math.floor(diffMs / 1000);
  const years = Math.floor(diffMs / (365.25 * 24 * 3600 * 1000));
  const months = Math.floor(diffMs / (30.44 * 24 * 3600 * 1000));
  const weeks = Math.floor(diffMs / (7 * 24 * 3600 * 1000));
  const days = Math.floor(diffMs / (24 * 3600 * 1000));
  const hours = Math.floor((diffMs % (24 * 3600 * 1000)) / (3600 * 1000));
  const minutes = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));
  const seconds = Math.floor((totalSec) % 60);

  return { years, months, weeks, days, hours, minutes, seconds };
}

export function lifePercent(birthDate: Date, lifeExpectancy: number): number {
  const now = new Date();
  const totalMs = lifeExpectancy * 365.25 * 24 * 3600 * 1000;
  const livedMs = now.getTime() - birthDate.getTime();
  return Math.min(100, Math.max(0, (livedMs / totalMs) * 100));
}

