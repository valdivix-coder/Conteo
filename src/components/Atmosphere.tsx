import { useEffect } from "react";
import { useNowMinute } from "../hooks/useChileTime";
import type { Phase } from "../lib/milestones";
import { journeyProgress } from "../lib/time";

const PHASE_ENERGY: Record<Phase, number> = {
  journey: 0,
  energy: 0.35,
  "two-weeks": 0.55,
  "last-week": 0.75,
  "final-day": 1,
  free: 1
};

interface AtmosphereProps {
  phase: Phase;
}

/**
 * The night sky and the horizon glow behind everything. Journey progress is
 * written to CSS custom properties once per minute; CSS turns it into light,
 * warmth and horizon height, with long transitions so change is felt, not seen.
 */
export function Atmosphere({ phase }: AtmosphereProps) {
  const minute = useNowMinute();
  const progress = phase === "free" ? 1 : journeyProgress(minute * 60_000);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--progress", progress.toFixed(4));
    root.style.setProperty("--energy", String(PHASE_ENERGY[phase]));
    root.dataset.phase = phase;
  }, [progress, phase]);

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere__sky" />
      <div className="atmosphere__glow" />
    </div>
  );
}
