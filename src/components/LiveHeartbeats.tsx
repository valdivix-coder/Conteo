import { useEffect, useState } from "react";
import { readLiveMs } from "../lib/clock";
import { heartbeatsIn } from "../lib/conversions";
import { TARGET } from "../lib/time";
import { PairNumber } from "./PairNumber";

/**
 * A heartbeat lasts ~0.86 s, faster than the shared once-per-second clock,
 * so this is the only measure with its own sub-second refresh: it counts
 * down one beat at a time, at the real rhythm.
 */
const REFRESH_MS = 200;

function remainingSecondsNow(): number {
  return Math.max(0, (TARGET.toMillis() - readLiveMs()) / 1000);
}

export function LiveHeartbeats({ unit }: { unit: string }) {
  const [beats, setBeats] = useState(() => heartbeatsIn(remainingSecondsNow()));

  useEffect(() => {
    // setState bails out when the whole number has not changed, so React only
    // re-renders on an actual beat.
    const timer = setInterval(() => setBeats(heartbeatsIn(remainingSecondsNow())), REFRESH_MS);
    return () => clearInterval(timer);
  }, []);

  return <PairNumber value={beats} unit={unit} approximate className="conversion__number" />;
}
