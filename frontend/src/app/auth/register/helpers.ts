import type { PasswordStrength } from "./types";

export function getPasswordStrength(pw: string): PasswordStrength {
  let score = 0;
  if (pw.length >= 8)            score++;
  if (pw.length >= 12)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;

  if (score <= 1) return { score, label: "Weak",   color: "bg-red-400" };
  if (score <= 3) return { score, label: "Fair",   color: "bg-gold-400" };
  return             { score, label: "Strong", color: "bg-teal-500" };
}

/** Compute age in full years from a YYYY-MM-DD string. */
export function getAgeFromDob(dob: string): number {
  return (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}
