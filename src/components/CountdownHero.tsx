import { useCountdown } from "../hooks/useCountdown";
import { targetLabel } from "../lib/dates";
import { formatPair } from "../lib/numberFormat";
import type { Countdown } from "../lib/time";
import { RollingDigits } from "./RollingDigits";

const UNITS = [
  { key: "months", label: "Meses", short: "Meses", spoken: ["mes", "meses"] },
  { key: "days", label: "Días", short: "Días", spoken: ["día", "días"] },
  { key: "hours", label: "Horas", short: "Horas", spoken: ["hora", "horas"] },
  { key: "minutes", label: "Minutos", short: "Min", spoken: ["minuto", "minutos"] },
  { key: "seconds", label: "Segundos", short: "Seg", spoken: ["segundo", "segundos"] }
] as const satisfies readonly { key: keyof Countdown; label: string; short: string; spoken: readonly [string, string] }[];

function spokenCountdown(c: Countdown): string {
  // Minute precision on purpose: screen readers should not hear every second.
  const parts = UNITS.slice(0, 4).map(({ key, spoken }) => {
    const n = c[key];
    return `${n} ${n === 1 ? spoken[0] : spoken[1]}`;
  });
  return `Faltan ${parts.slice(0, -1).join(", ")} y ${parts.at(-1)} para escapar de Babylon.`;
}

function CounterUnit({ unit, value }: { unit: (typeof UNITS)[number]; value: number }) {
  return (
    <div className={`counter__unit counter__unit--${unit.key}`}>
      <span className="counter__value">
        <RollingDigits value={formatPair(value)} variant={unit.key === "seconds" ? "roll" : "fade"} />
      </span>
      <span className="counter__label">
        <span className="counter__label-long">{unit.label}</span>
        <span className="counter__label-short">{unit.short}</span>
      </span>
    </div>
  );
}

interface CountdownHeroProps {
  banner: string | null;
}

export function CountdownHero({ banner }: CountdownHeroProps) {
  const countdown = useCountdown();

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__intro">
        {banner ? (
          <p className="hero__banner">{banner}</p>
        ) : (
          <p className="eyebrow">Operación libertad</p>
        )}
        <h1 id="hero-title" className="hero__title">
          Escapar de <span className="hero__title-accent">Babylon</span>
        </h1>
        <p className="hero__micro">Cada segundo cuenta.</p>
      </div>

      <div className="counter" role="timer" aria-atomic="true">
        <p className="sr-only">{spokenCountdown(countdown)}</p>
        <div className="counter__grid" aria-hidden="true">
          {UNITS.slice(0, 2).map((unit) => (
            <CounterUnit key={unit.key} unit={unit} value={countdown[unit.key]} />
          ))}
          <div className="counter__clock">
            {UNITS.slice(2).map((unit) => (
              <CounterUnit key={unit.key} unit={unit} value={countdown[unit.key]} />
            ))}
          </div>
        </div>
      </div>

      <div className="destination">
        <span className="destination__rule" aria-hidden="true" />
        <p className="destination__text">
          <span className="destination__eyebrow">Babylon termina aquí</span>
          <span className="destination__date">{targetLabel()}</span>
        </p>
      </div>
    </section>
  );
}
