import { APP_CONFIG } from "../config/app";

export const GROUP_SEPARATOR = "·";
export const APPROXIMATE_SIGN = "≈";

function toSafeInteger(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.floor(value);
}

/** 0 → "00", 9 → "09", 42 → "42". Values above 99 fall back to pair groups. */
export function formatPair(value: number): string {
  const n = toSafeInteger(value);
  return n > 99 ? formatPairGroups(n) : String(n).padStart(2, "0");
}

/** Splits an integer into pairs from the right: 11064 → ["01", "10", "64"]. */
export function toPairGroups(value: number): string[] {
  let digits = String(toSafeInteger(value));
  if (digits.length % 2 === 1) digits = `0${digits}`;
  return digits.match(/\d{2}/g) ?? ["00"];
}

/** 461 → "04·61", 39830400 → "39·83·04·00". */
export function formatPairGroups(value: number): string {
  return toPairGroups(value).join(GROUP_SEPARATOR);
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
  /** Visual form, e.g. "≈ 22·00·00". */
  display: string;
  /** Visual digits without the sign, e.g. "22·00·00". */
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
  const digits = formatPairGroups(rounded);
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
