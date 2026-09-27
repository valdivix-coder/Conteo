import { useEffect, type CSSProperties } from "react";
import { useNowMinute } from "../hooks/useChileTime";
import { DAYLIGHT, dawnAmount, skyAt, toCss } from "../lib/dawn";
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

const THEME_DAY = "#fff4d6";
const STAR_COUNT = 44;

/** Deterministic star field: the same sky on every visit. */
const STARS = Array.from({ length: STAR_COUNT }, (_, i) => ({
  x: (i * 61.8034) % 100,
  y: ((i * 37.31) % 62) + 2,
  size: 1 + ((i * 7) % 3) * 0.6,
  delay: (i * 530) % 7000,
  duration: 3200 + ((i * 910) % 4200)
}));

interface AtmosphereProps {
  phase: Phase;
}

/**
 * The sky behind everything. Journey progress sets the colour of the sky,
 * how many stars are still out and how far the sun has risen above the
 * horizon. Values update once per minute with long transitions, so the
 * change is felt from one visit to the next rather than seen happening.
 */
export function Atmosphere({ phase }: AtmosphereProps) {
  const minute = useNowMinute();
  const free = phase === "free";
  const progress = free ? 1 : journeyProgress(minute * 60_000);
  const dawn = dawnAmount(progress);
  const [top, middle, horizon] = free ? DAYLIGHT : skyAt(progress);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--progress", progress.toFixed(4));
    root.style.setProperty("--dawn", dawn.toFixed(4));
    root.style.setProperty("--energy", String(PHASE_ENERGY[phase]));
    root.style.setProperty("--sky-top", toCss(top));
    root.style.setProperty("--sky-middle", toCss(middle));
    root.style.setProperty("--sky-horizon", toCss(horizon));
    root.dataset.phase = phase;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", free ? THEME_DAY : toCss(top));
  }, [progress, dawn, phase, top, middle, horizon, free]);

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere__sky" />
      <div className="atmosphere__stars">
        {STARS.map((star, i) => (
          <span
            key={i}
            className="atmosphere__star"
            style={
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                "--size": `${star.size}px`,
                "--delay": `${star.delay}ms`,
                "--duration": `${star.duration}ms`
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="atmosphere__glow" />
      <div className="atmosphere__sun">
        <span className="atmosphere__rays" />
        <span className="atmosphere__disc" />
      </div>
    </div>
  );
}
