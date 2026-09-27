import { APP_CONFIG } from "../config/app";
import { chileDateTime } from "./time";

export type Phase = "journey" | "energy" | "two-weeks" | "last-week" | "final-day" | "free";

export interface DayContext {
  daysLeft: number;
  /** The milestone value when today is exactly one, else null. */
  milestone: number | null;
  phase: Phase;
  isNewMonth: boolean;
  /** Short narrative banner integrated in the composition. */
  banner: string | null;
}

const ENERGY_THRESHOLD = 30;
const TWO_WEEKS = 14;
const ONE_WEEK = 7;

export function milestoneFor(daysLeft: number): number | null {
  return (APP_CONFIG.milestoneDays as readonly number[]).includes(daysLeft) ? daysLeft : null;
}

export function phaseFor(daysLeft: number, finished: boolean): Phase {
  if (finished) return "free";
  if (daysLeft <= 1) return "final-day";
  if (daysLeft <= ONE_WEEK) return "last-week";
  if (daysLeft <= TWO_WEEKS) return "two-weeks";
  if (daysLeft <= ENERGY_THRESHOLD) return "energy";
  return "journey";
}

const PHASE_BANNERS: Partial<Record<Phase, string>> = {
  "two-weeks": "Últimas dos semanas.",
  "last-week": "Última semana en Babylon.",
  "final-day": "Comenzó la cuenta regresiva final."
};

export function dayContext(dayKey: string, daysLeft: number, finished: boolean): DayContext {
  const phase = phaseFor(daysLeft, finished);
  const isNewMonth = chileDateTime(dayKey).day === 1;
  const banner = PHASE_BANNERS[phase] ?? (isNewMonth && !finished ? "Otro mes menos en Babylon." : null);

  return { daysLeft, milestone: finished ? null : milestoneFor(daysLeft), phase, isNewMonth, banner };
}

/* Local persistence — every access is defensive: storage may be disabled or full. */

function readCelebrated(): number[] {
  try {
    const raw = globalThis.localStorage?.getItem(APP_CONFIG.storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is number => typeof v === "number") : [];
  } catch {
    return [];
  }
}

export function hasCelebrated(milestone: number): boolean {
  return readCelebrated().includes(milestone);
}

export function markCelebrated(milestone: number): void {
  try {
    const next = Array.from(new Set([...readCelebrated(), milestone]));
    globalThis.localStorage?.setItem(APP_CONFIG.storageKey, JSON.stringify(next));
  } catch {
    // Without storage the celebration may repeat; the countdown is unaffected.
  }
}
