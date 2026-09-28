import { useEffect, useRef, useState, type CSSProperties } from "react";
import { readLiveMs } from "../lib/clock";
import { splitFixed, stepDecimals } from "../lib/numberFormat";
import { TARGET } from "../lib/time";
import { PairNumber } from "./PairNumber";

const SECOND = 1;
/** Sub-second refresh for units whose last digit changes faster than once a second. */
const FAST_REFRESH_MS = 200;

interface LiveMeasureProps {
  /** Whole seconds left, from the shared once-per-second clock. */
  remainingSeconds: number;
  /** Length of one unit in seconds (e.g. a nap: 7200). */
  unitSeconds: number;
  unit: string;
  approximate?: boolean;
}

/** Remaining seconds with millisecond precision, refreshed several times a second. */
function useFastRemaining(enabled: boolean): number | null {
  const [value, setValue] = useState<number | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const read = () => setValue(Math.max(0, (TARGET.toMillis() - readLiveMs()) / 1000));
    read();
    const timer = setInterval(read, FAST_REFRESH_MS);
    return () => clearInterval(timer);
  }, [enabled]);
  return value;
}

/**
 * A recreational unit counting down live. Decimals (0–2) are chosen so each
 * step of the last digit lasts at least one refresh: the figure always moves
 * by exactly one, at a steady rhythm. A hairline empties continuously until
 * the next step, so even slow units read as alive.
 */
export function LiveMeasure({ remainingSeconds, unitSeconds, unit, approximate = false }: LiveMeasureProps) {
  const fast = unitSeconds < SECOND;
  const fastRemaining = useFastRemaining(fast);
  const refreshSeconds = fast ? FAST_REFRESH_MS / 1000 : SECOND;
  const decimals = stepDecimals(unitSeconds, refreshSeconds);

  const seconds = fast && fastRemaining !== null ? fastRemaining : remainingSeconds;
  const scaled = (seconds / unitSeconds) * 10 ** decimals;
  const { integer, fraction } = splitFixed(seconds / unitSeconds, decimals);
  const stepLeft = scaled - Math.floor(scaled);

  // The bar drains smoothly; when a step completes it refills without animating backwards.
  const previous = useRef(stepLeft);
  const refilled = stepLeft > previous.current;
  useEffect(() => {
    previous.current = stepLeft;
  }, [stepLeft]);

  return (
    <>
      <PairNumber
        value={integer}
        fraction={fraction}
        unit={unit}
        approximate={approximate}
        className="conversion__number"
      />
      {!fast && (
        <span
          className={`conversion__step${refilled ? " conversion__step--refill" : ""}`}
          style={{ "--step": stepLeft.toFixed(4) } as CSSProperties}
          aria-hidden="true"
        />
      )}
    </>
  );
}
