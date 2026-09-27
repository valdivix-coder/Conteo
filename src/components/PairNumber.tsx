import type { CSSProperties } from "react";
import { toPairGroups, formatSpoken, APPROXIMATE_SIGN } from "../lib/numberFormat";

// Approximate advance widths in em (tabular digit incl. tight tracking, separator, ≈ sign).
const DIGIT_EM = 0.6;
const SEPARATOR_EM = 0.36;
const APPROX_EM = 0.44;

interface PairNumberProps {
  value: number;
  /** Accessible unit, e.g. "días". */
  unit: string;
  approximate?: boolean;
  className?: string;
}

/**
 * Renders 461 as "04·61" while exposing "461 días" to assistive technology.
 * The separators are dimmed so the figure reads as one number. `--pair-em`
 * exposes the figure's width in em so CSS can fit it to its container.
 */
export function PairNumber({ value, unit, approximate = false, className }: PairNumberProps) {
  const groups = toPairGroups(value);
  const widthEm =
    groups.length * 2 * DIGIT_EM + (groups.length - 1) * SEPARATOR_EM + (approximate ? APPROX_EM : 0);
  const spoken = `${approximate ? "aproximadamente " : ""}${formatSpoken(value)} ${unit}`;

  return (
    <span
      className={["pair-number", className].filter(Boolean).join(" ")}
      style={{ "--pair-em": widthEm.toFixed(3) } as CSSProperties}
    >
      <span className="sr-only">{spoken}</span>
      <span className="pair-number__visual" aria-hidden="true">
        {approximate && <span className="pair-number__approx">{APPROXIMATE_SIGN}</span>}
        {groups.map((group, index) => (
          <span key={index} className="pair-number__group">
            {index > 0 && <span className="pair-number__sep">·</span>}
            {group}
          </span>
        ))}
      </span>
    </span>
  );
}
