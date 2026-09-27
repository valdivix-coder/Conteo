import { useNowMinute } from "../hooks/useChileTime";
import { JOURNEY_START_COMPACT, TARGET_COMPACT } from "../lib/dates";
import { formatPercent } from "../lib/numberFormat";
import { journeyProgress } from "../lib/time";

const CENTER_X = 200;
const BASELINE_Y = 200;
const RADIUS = 176;
const ARC_START = `M ${CENTER_X - RADIUS} ${BASELINE_Y}`;
const FULL_ARC = `${ARC_START} A ${RADIUS} ${RADIUS} 0 0 1 ${CENTER_X + RADIUS} ${BASELINE_Y}`;

function sunPosition(progress: number): { x: number; y: number } {
  const angle = Math.PI * progress;
  return {
    x: CENTER_X - RADIUS * Math.cos(angle),
    y: BASELINE_Y - RADIUS * Math.sin(angle)
  };
}

export function JourneyProgress() {
  const minute = useNowMinute();
  const progress = journeyProgress(minute * 60_000);
  const percent = formatPercent(progress);
  const sun = sunPosition(progress);
  const spokenPercent = `${Math.floor(progress * 100)} por ciento del camino recorrido`;

  return (
    <section className="section journey" aria-labelledby="journey-title">
      <h2 id="journey-title" className="eyebrow">
        El horizonte
      </h2>

      <div className="journey__layout">
        <p className="journey__percent">
          <span className="sr-only">{spokenPercent}</span>
          <span aria-hidden="true" className="journey__figure">
            <span className="journey__whole">{percent.whole}</span>
            <span className="journey__decimals">,{percent.decimals}</span>
            <span className="journey__sign">%</span>
          </span>
          <span aria-hidden="true" className="journey__caption">
            del camino recorrido
          </span>
        </p>

        <figure className="arc" aria-hidden="true">
          <svg viewBox="0 0 400 214" className="arc__svg" focusable="false">
            <defs>
              <radialGradient id="sun-glow">
                <stop offset="0%" stopColor="var(--color-sun)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--color-sun)" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d={FULL_ARC} className="arc__track" pathLength={1} />
            <path
              d={FULL_ARC}
              className="arc__travelled"
              pathLength={1}
              strokeDasharray={`${progress} 1`}
            />
            <line x1="0" x2="400" y1={BASELINE_Y} y2={BASELINE_Y} className="arc__horizon" />
            <circle cx={sun.x} cy={sun.y} r="34" fill="url(#sun-glow)" className="arc__glow" />
            <circle cx={sun.x} cy={sun.y} r="8" className="arc__sun" />
          </svg>
          <figcaption className="arc__ends">
            <span>
              <span className="arc__end-label">Salida</span>
              {JOURNEY_START_COMPACT}
            </span>
            <span className="arc__end--target">
              <span className="arc__end-label">Libertad</span>
              {TARGET_COMPACT}
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
