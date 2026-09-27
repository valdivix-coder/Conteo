import { chileDateTime } from "./time";

/**
 * Single source of "now" for the whole app.
 *
 * Ticks are aligned to the start of each real second with setTimeout, and
 * every tick re-reads Date.now(): nothing is accumulated, so background tabs,
 * a locked phone or a suspended PWA recover the exact value on the next tick.
 * visibilitychange / focus / pageshow force an immediate resync.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let offsetMs = readSimulatedOffset();
let currentMs = Date.now() + offsetMs;
let timer: ReturnType<typeof setTimeout> | undefined;

function readNow(): number {
  return Date.now() + offsetMs;
}

/**
 * QA aid: `?simular=2027-12-30T23:59:50` shifts the clock so the given Chilean
 * wall-clock time is "now" at page load, then keeps running in real time.
 */
function readSimulatedOffset(): number {
  try {
    const value = new URLSearchParams(globalThis.location?.search ?? "").get("simular");
    if (!value) return 0;
    const simulated = chileDateTime(value);
    return simulated.isValid ? simulated.toMillis() - Date.now() : 0;
  } catch {
    return 0;
  }
}

function emit(): void {
  currentMs = readNow();
  listeners.forEach((listener) => listener());
}

function schedule(): void {
  clearTimeout(timer);
  const untilNextSecond = 1000 - (readNow() % 1000);
  // A few ms of slack guarantee we land just after the boundary, not before it.
  timer = setTimeout(() => {
    emit();
    schedule();
  }, untilNextSecond + 4);
}

function resync(): void {
  if (typeof document !== "undefined" && document.visibilityState === "hidden") {
    clearTimeout(timer);
    return;
  }
  emit();
  schedule();
}

function start(): void {
  if (typeof window === "undefined") return;
  document.addEventListener("visibilitychange", resync);
  window.addEventListener("focus", resync);
  window.addEventListener("pageshow", resync);
  resync();
}

function stop(): void {
  clearTimeout(timer);
  if (typeof window === "undefined") return;
  document.removeEventListener("visibilitychange", resync);
  window.removeEventListener("focus", resync);
  window.removeEventListener("pageshow", resync);
}

export function subscribe(listener: Listener): () => void {
  if (listeners.size === 0) start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stop();
  };
}

export function getNowMs(): number {
  return currentMs;
}

export function getNowSecond(): number {
  return Math.floor(currentMs / 1000);
}

export function getNowMinute(): number {
  return Math.floor(currentMs / 60_000);
}
