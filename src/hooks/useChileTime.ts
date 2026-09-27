import { useSyncExternalStore } from "react";
import { getNowMinute, getNowMs, getNowSecond, subscribe } from "../lib/clock";
import { chileDayKey, remainingSeconds } from "../lib/time";

let cachedSecond = Number.NaN;
let cachedDayKey = "";

function getDayKey(): string {
  const second = getNowSecond();
  if (second !== cachedSecond) {
    cachedSecond = second;
    cachedDayKey = chileDayKey(getNowMs());
  }
  return cachedDayKey;
}

function getFinished(): boolean {
  return remainingSeconds(getNowMs()) === 0;
}

/** Epoch second. Re-renders the caller once per second. */
export function useNowSecond(): number {
  return useSyncExternalStore(subscribe, getNowSecond, getNowSecond);
}

/** Epoch minute. Re-renders the caller once per minute. */
export function useNowMinute(): number {
  return useSyncExternalStore(subscribe, getNowMinute, getNowMinute);
}

/** Chilean calendar date (yyyy-MM-dd). Re-renders the caller once per day. */
export function useChileDayKey(): string {
  return useSyncExternalStore(subscribe, getDayKey, getDayKey);
}

/** True from the exact target instant on. Re-renders the caller once. */
export function useIsFinished(): boolean {
  return useSyncExternalStore(subscribe, getFinished, getFinished);
}
