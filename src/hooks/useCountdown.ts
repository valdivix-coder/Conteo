import { useMemo } from "react";
import { computeCountdown, computeTotals, type Countdown, type Totals } from "../lib/time";
import { useNowSecond } from "./useChileTime";

export function useCountdown(): Countdown {
  const second = useNowSecond();
  return useMemo(() => computeCountdown(second * 1000), [second]);
}

export function useTotals(): Totals {
  const second = useNowSecond();
  return useMemo(() => computeTotals(second * 1000), [second]);
}
