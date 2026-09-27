/**
 * The night-to-dawn palette. Journey progress picks a point on this curve;
 * each stop is a [top, middle, horizon] sky triple.
 *
 * Every pre-final stop keeps white text above WCAG AA (≥ 4.5:1): the sky only
 * reaches full daylight in the final state, where the text turns dark.
 */

export type Rgb = readonly [number, number, number];
export type SkyStop = readonly [Rgb, Rgb, Rgb];

const hex = (value: string): Rgb => {
  const n = Number.parseInt(value.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const sky = (top: string, middle: string, horizon: string): SkyStop => [hex(top), hex(middle), hex(horizon)];

/** [progress, sky] keyframes, ordered. */
export const DAWN_KEYFRAMES: readonly (readonly [number, SkyStop])[] = [
  [0, sky("#07111f", "#0d1b2a", "#0f1d2c")], // Babylon: deep night
  [0.3, sky("#0a1a33", "#16294a", "#2a2b4b")], // blue hour
  [0.6, sky("#11264a", "#2b3461", "#683a4c")], // violet dawn
  [0.85, sky("#1a3964", "#45396a", "#94472f")], // embers on the horizon
  [1, sky("#244c7a", "#554266", "#ab552a")] // the sun is about to rise
];

/** Full daylight, used once Babylon is over. */
export const DAYLIGHT: SkyStop = sky("#fff4d6", "#ffe8a3", "#ffd65a");

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [0, 1, 2].map((i) => Math.round(a[i]! + (b[i]! - a[i]!) * t)) as unknown as Rgb;
}

/**
 * Perceived dawn: slightly front-loaded (exponent < 1) so the first weeks
 * already show visible change instead of an imperceptible crawl.
 */
export function dawnAmount(progress: number): number {
  const p = Math.min(1, Math.max(0, progress));
  return p ** 0.8;
}

export function skyAt(progress: number): SkyStop {
  const d = dawnAmount(progress);
  for (let i = 1; i < DAWN_KEYFRAMES.length; i += 1) {
    const [p1, s1] = DAWN_KEYFRAMES[i]!;
    const [p0, s0] = DAWN_KEYFRAMES[i - 1]!;
    if (d <= p1) {
      const t = (d - p0) / (p1 - p0);
      return [mix(s0[0], s1[0], t), mix(s0[1], s1[1], t), mix(s0[2], s1[2], t)];
    }
  }
  return DAWN_KEYFRAMES[DAWN_KEYFRAMES.length - 1]![1];
}

export const toCss = ([r, g, b]: Rgb) => `rgb(${r} ${g} ${b})`;

/** WCAG relative luminance. */
export function luminance([r, g, b]: Rgb): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
