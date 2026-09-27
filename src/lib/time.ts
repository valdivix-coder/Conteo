import { DateTime } from "luxon";
import { APP_CONFIG } from "../config/app";

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const DAYS_PER_WEEK = 7;

const zone = APP_CONFIG.timeZone;

/** Interprets an ISO wall-clock string as local time in America/Santiago. */
export function chileDateTime(iso: string): DateTime {
  return DateTime.fromISO(iso, { zone });
}

export function toChile(epochMs: number): DateTime {
  return DateTime.fromMillis(epochMs, { zone });
}

export const TARGET = chileDateTime(APP_CONFIG.targetDate);
export const JOURNEY_START = chileDateTime(APP_CONFIG.journeyStartDate);

export interface Countdown {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Whole seconds left, rounded up so the counter only reads zero at the target. */
  totalSeconds: number;
  finished: boolean;
}

/**
 * Whole seconds between `nowMs` and the target, rounded up.
 * Computed from scratch every call: there is no accumulated state to drift.
 */
export function remainingSeconds(nowMs: number, target: DateTime = TARGET): number {
  const diffMs = target.toMillis() - nowMs;
  return diffMs <= 0 ? 0 : Math.ceil(diffMs / MS_PER_SECOND);
}

/** Calendar-aware breakdown (real month lengths, DST-aware via Luxon). */
export function computeCountdown(nowMs: number, target: DateTime = TARGET): Countdown {
  const totalSeconds = remainingSeconds(nowMs, target);
  if (totalSeconds === 0) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, finished: true };
  }

  const from = DateTime.fromMillis(target.toMillis() - totalSeconds * MS_PER_SECOND, { zone: target.zone });
  const diff = target.diff(from, ["months", "days", "hours", "minutes", "seconds"]).toObject();

  return {
    months: Math.max(0, Math.floor(diff.months ?? 0)),
    days: Math.max(0, Math.floor(diff.days ?? 0)),
    hours: Math.max(0, Math.floor(diff.hours ?? 0)),
    minutes: Math.max(0, Math.floor(diff.minutes ?? 0)),
    seconds: Math.max(0, Math.round(diff.seconds ?? 0)),
    totalSeconds,
    finished: false
  };
}

export interface Totals {
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  /** Whole calendar days (DST-aware: a 23 h day still counts as one). */
  totalDays: number;
  weeks: number;
  weekRemainderDays: number;
  months: number;
  monthRemainderDays: number;
}

export function computeTotals(nowMs: number, target: DateTime = TARGET): Totals {
  const totalSeconds = remainingSeconds(nowMs, target);
  const from = DateTime.fromMillis(target.toMillis() - totalSeconds * MS_PER_SECOND, { zone: target.zone });
  const totalDays = totalSeconds === 0 ? 0 : Math.floor(target.diff(from, "days").days);
  const calendar = computeCountdown(nowMs, target);

  return {
    totalSeconds,
    totalMinutes: Math.floor(totalSeconds / SECONDS_PER_MINUTE),
    totalHours: Math.floor(totalSeconds / SECONDS_PER_HOUR),
    totalDays,
    weeks: Math.floor(totalDays / DAYS_PER_WEEK),
    weekRemainderDays: totalDays % DAYS_PER_WEEK,
    months: calendar.months,
    monthRemainderDays: calendar.days
  };
}

/** Journey progress in [0, 1], using the real elapsed-time ratio. */
export function journeyProgress(nowMs: number, start: DateTime = JOURNEY_START, target: DateTime = TARGET): number {
  const span = target.toMillis() - start.toMillis();
  if (span <= 0) return 1;
  const ratio = (nowMs - start.toMillis()) / span;
  return Math.min(1, Math.max(0, ratio));
}

/** ISO calendar date (yyyy-MM-dd) as lived in Chile at `nowMs`. */
export function chileDayKey(nowMs: number): string {
  return toChile(nowMs).toISODate() ?? "";
}

/** Calendar days between today's Chilean date and the target's date. */
export function calendarDaysLeft(dayKey: string, target: DateTime = TARGET): number {
  const today = chileDateTime(dayKey).startOf("day");
  const targetDay = target.startOf("day");
  return Math.max(0, Math.round(targetDay.diff(today, "days").days));
}

const MONDAY = 1;
const SATURDAY = 6;
const SUNDAY = 7;

export interface CalendarCounts {
  /** Mondays from today (inclusive, if still being lived) until the target. */
  mondays: number;
  /** Weekends with at least one day left before the target (the current one included). */
  weekends: number;
  /** Calendar days left, used as the sunrise approximation. */
  days: number;
}

/**
 * Walks the Chilean calendar day by day. Cheap (≈ 500 iterations at most)
 * and only evaluated when the date changes.
 */
export function countCalendarDays(dayKey: string, target: DateTime = TARGET): CalendarCounts {
  let cursor = chileDateTime(dayKey).startOf("day");
  const end = target;
  let mondays = 0;
  let weekends = 0;
  let days = 0;

  if (cursor >= end) return { mondays: 0, weekends: 0, days: 0 };
  if (cursor.weekday === SUNDAY) weekends += 1;

  while (cursor < end) {
    if (cursor.weekday === MONDAY) mondays += 1;
    if (cursor.weekday === SATURDAY) weekends += 1;
    days += 1;
    cursor = cursor.plus({ days: 1 });
  }

  return { mondays, weekends, days };
}
