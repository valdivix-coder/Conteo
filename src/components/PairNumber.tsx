import type { CSSProperties } from "react";
import { toDisplayGroups, formatSpoken, APPROXIMATE_SIGN, GROUP_SEPARATOR } from "../lib/numberFormat";

// Approximate advance widths in em (tabular digit incl. tight tracking, separator, ≈ sign).
// The ≈ sign sits in symmetric side padding so labels centre on the digits, not the sign.
const DIGIT_EM = 0.6;
const SEPARATOR_EM = 0.3;
const APPROX_EM = 0.44;

interface PairNumberProps {
  value: number;
  /** Accessible unit, e.g. "días". */
  unit: string;
  approximate?: boolean;
  className?: string;
}

/**
 * Renders 7 as "07" and 11064 as "11.064", exposing "11064 horas" to
 * assistive technology. Separators are dimmed so the figure reads as one number. `--pair-em`
 * exposes the figure's width in em so CSS can fit it to its container.
 */
export function PairNumber({ value, unit, approximate = false, className }: PairNumberProps) {
  const groups = toDisplayGroups(value);
  const widthEm =
    groups.join("").length * DIGIT_EM + (groups.length - 1) * SEPARATOR_EM + (approximate ? APPROX_EM * 2 : 0);
  const spoken = `${approximate ? "aproximadamente " : ""}${formatSpoken(value)} ${unit}`;

  return (
    <span
      className={["pair-number", approximate && "pair-number--approx", className].filter(Boolean).join(" ")}
      style={{ "--pair-em": widthEm.toFixed(3) } as CSSProperties}
    >
      <span className="sr-only">{spoken}</span>
      <span className="pair-number__visual" aria-hidden="true">
        {approximate && <span className="pair-number__approx">{APPROXIMATE_SIGN}</span>}
        {groups.map((group, index) => (
          <span key={index} className="pair-number__group">
            {index > 0 && <span className="pair-number__sep">{GROUP_SEPARATOR}</span>}
            {group}
          </span>
        ))}
      </span>
    </span>
  );
}
