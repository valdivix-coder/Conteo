import { useEffect, useState, type CSSProperties } from "react";

const PARTICLES = 28;
const DURATION_MS = 2600;

interface CelebrationProps {
  /** Changing the key replays the burst. */
  burstKey: string | number;
  intensity?: "milestone" | "final";
}

/**
 * Brief, non-blocking burst of light: thin solar rays expand from the horizon
 * and fade. Pure transform/opacity, pointer-events disabled, removed after
 * it ends and skipped entirely under prefers-reduced-motion (via CSS).
 */
export function Celebration({ burstKey, intensity = "milestone" }: CelebrationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), DURATION_MS * (intensity === "final" ? 1.6 : 1));
    return () => clearTimeout(timer);
  }, [burstKey, intensity]);

  if (!visible) return null;

  return (
    <div className={`celebration celebration--${intensity}`} aria-hidden="true">
      <span className="celebration__flash" />
      {Array.from({ length: PARTICLES }, (_, i) => {
        const angle = -180 + (180 / (PARTICLES - 1)) * i + ((i * 37) % 11) - 5;
        const distance = 38 + ((i * 53) % 34);
        const delay = (i * 29) % 240;
        return (
          <span
            key={i}
            className="celebration__ray"
            style={
              {
                "--angle": `${angle}deg`,
                "--distance": `${distance}vmin`,
                "--delay": `${delay}ms`
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
