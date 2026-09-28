import { APP_CONFIG } from "../config/app";

/** Chilean thousands separator: 39830400 → 39.830.400. */
export const GROUP_SEPARATOR = ".";
export const APPROXIMATE_SIGN = "≈";

function toSafeInteger(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.floor(value);
}

/** 0 → "00", 9 → "09", 42 → "42". Values above 99 use thousands grouping. */
export function formatPair(value: number): string {
  const n = toSafeInteger(value);
  return n > 99 ? formatGrouped(n) : String(n).padStart(2, "0");
}

/**
 * Display groups: below 100 a single two-digit block ("07"); from 100 on,
 * natural thousands groups from the right: 11064 → ["11", "064"].
 */
export function toDisplayGroups(value: number): string[] {
  const n = toSafeInteger(value);
  if (n <= 99) return [String(n).padStart(2, "0")];
  const groups: string[] = [];
  let digits = String(n);
  while (digits.length > 3) {
    groups.unshift(digits.slice(-3));
    digits = digits.slice(0, -3);
  }
  groups.unshift(digits);
  return groups;
}

/** 7 → "07", 461 → "461", 39830400 → "39.830.400". */
export function formatGrouped(value: number): string {
  return toDisplayGroups(value).join(GROUP_SEPARATOR);
}

export const DECIMAL_SEPARATOR = ",";

/**
 * Truncates (never rounds up) to a fixed number of decimals, so a value that
 * is counting down never appears to jump back up: 15.49218379 → { 15, "4921837" }.
 */
export function splitFixed(value: number, decimals: number): { integer: number; fraction: string } {
  const safe = Number.isFinite(value) && value > 0 ? value : 0;
  if (decimals <= 0) return { integer: Math.floor(safe), fraction: "" };
  const scale = 10 ** decimals;
  const scaled = Math.floor(safe * scale + 1e-9);
  return {
    integer: Math.floor(scaled / scale),
    fraction: String(scaled % scale).padStart(decimals, "0")
  };
}

export const MAX_LIVE_DECIMALS = 2;

/**
 * Decimals for a live countdown of a unit lasting `unitSeconds`, refreshed
 * every `refreshSeconds`: as many as possible (up to two) while each step of
 * the last digit still lasts at least one refresh, so the last digit always
 * moves by exactly one and never skips.
 */
export function stepDecimals(unitSeconds: number, refreshSeconds = 1, max = MAX_LIVE_DECIMALS): number {
  if (!(unitSeconds > 0) || !(refreshSeconds > 0)) return 0;
  const fits = Math.floor(Math.log10(unitSeconds / refreshSeconds) + 1e-9);
  return Math.min(max, Math.max(0, fits));
}

/** Rounds to a number of significant digits: 221280 → 220000, 15.63 → 16. */
export function roundSignificant(value: number, significantDigits = 2): number {
  const n = Math.max(0, value);
  if (n === 0 || !Number.isFinite(n)) return 0;
  const magnitude = Math.floor(Math.log10(n));
  const factor = 10 ** (magnitude - significantDigits + 1);
  return factor >= 1 ? Math.round(n / factor) * factor : Math.round(n);
}

export interface Approximation {
  /** The rounded integer that is displayed. */
  value: number;
  /** Visual form, e.g. "≈ 220.000". */
  display: string;
  /** Visual digits without the sign, e.g. "220.000". */
  digits: string;
}

/**
 * Clean, visually balanced approximation. Passing `significantDigits: null`
 * keeps the whole integer and only adds the ≈ sign.
 */
export function formatApproximate(
  value: number,
  options: { significantDigits?: number | null } = {}
): Approximation {
  const { significantDigits = 2 } = options;
  const rounded = significantDigits === null ? Math.round(Math.max(0, value)) : roundSignificant(value, significantDigits);
  const digits = formatGrouped(rounded);
  return { value: rounded, digits, display: `${APPROXIMATE_SIGN} ${digits}` };
}

const spokenFormatter = new Intl.NumberFormat(APP_CONFIG.locale, { maximumFractionDigits: 0 });

/** Number as it should be announced by assistive technology: 461 → "461". */
export function formatSpoken(value: number): string {
  return spokenFormatter.format(toSafeInteger(value));
}

/** Two-digit percentage with 100 as the only three-digit case. */
export function formatPercent(ratio: number): { whole: string; decimals: string } {
  const clamped = Math.min(1, Math.max(0, ratio));
  const hundredths = Math.floor(clamped * 10_000);
  const whole = Math.floor(hundredths / 100);
  return {
    whole: whole >= 100 ? "100" : String(whole).padStart(2, "0"),
    decimals: String(hundredths % 100).padStart(2, "0")
  };
}
