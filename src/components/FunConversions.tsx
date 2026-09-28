import { useEffect, useMemo, useRef, useState } from "react";
import { useNowSecond } from "../hooks/useChileTime";
import { computeConversions, type Conversions } from "../lib/conversions";
import { formatPair } from "../lib/numberFormat";
import { countCalendarDays, remainingSeconds } from "../lib/time";
import { LiveHeartbeats } from "./LiveHeartbeats";
import { PairNumber } from "./PairNumber";

interface Item {
  id: keyof Conversions;
  lead?: string;
  unit: string;
  note: string;
  /** Shows ≈: the reference itself is an estimate. */
  approximate?: boolean;
}

const ITEMS: readonly Item[] = [
  { id: "mondays", lead: "Solo quedan", unit: "lunes", note: "Cada uno, el último de su especie." },
  { id: "weekends", unit: "fines de semana", note: "Pronto dejarán de ser la única recompensa." },
  { id: "sunrises", unit: "amaneceres", note: "Uno menos cada mañana.", approximate: true },
  { id: "moons", unit: "lunas", note: "Ciclos de 29,53 días. La luna también cuenta." },
  { id: "dogYears", unit: "años de perro", note: "Cálculo científicamente dudoso.", approximate: true },
  { id: "mercuryYears", unit: "años de Mercurio", note: "Allá un año dura 88 días terrestres." },
  { id: "marsSols", unit: "soles marcianos", note: "Un día en Marte: 24 h 39 min 35 s." },
  { id: "heartbeats", unit: "latidos", note: "Estimación a 70 latidos por minuto.", approximate: true },
  { id: "songs", unit: "canciones", note: "De tres minutos cada una. Elige bien." },
  { id: "matiNaps", unit: "siestas de la Mati", note: "Sin despertador ni culpa. Una detrás de otra." },
  { id: "venegasEpisodes", unit: "capítulos de Los Venegas", note: "Maratón garantizada. Nadie se levanta del sillón." },
  { id: "isiJokes", unit: "chistes de la Isi", note: "Dicen que traen remate. Generalmente no lo traen." },
  { id: "simonShowers", unit: "duchas de Simón", note: "Secarse cuenta por separado." },
  { id: "juCookies", unit: "galletas de la Ju", note: "En su versión motivada. Del horno directo a la mesa." }
];

interface FunConversionsProps {
  dayKey: string;
}

export function FunConversions({ dayKey }: FunConversionsProps) {
  // Whole units from the exact remaining time, checked every second: a figure
  // changes the moment a whole unit elapses and otherwise stays put.
  const second = useNowSecond();
  const calendar = useMemo(() => countCalendarDays(dayKey), [dayKey]);
  const conversions = computeConversions(remainingSeconds(second * 1000), calendar);

  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const first = track.firstElementChild as HTMLElement | null;
        const width = first?.offsetWidth ?? 1;
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
        setActive(atEnd ? ITEMS.length - 1 : Math.round(track.scrollLeft / width));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    const item = track?.children[index] as HTMLElement | undefined;
    if (!track || !item) return;
    const reduce = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: item.offsetLeft - track.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="section conversions" aria-labelledby="conversions-title">
      <div className="conversions__head">
        <h2 id="conversions-title" className="section__title">
          Otras formas de contar la fuga
        </h2>
        <div className="carousel-nav">
          <span className="carousel-nav__count" aria-hidden="true">
            {formatPair(active + 1)} / {formatPair(ITEMS.length)}
          </span>
          <button
            type="button"
            className="icon-button"
            aria-label="Equivalencia anterior"
            disabled={active === 0}
            onClick={() => scrollTo(active - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Equivalencia siguiente"
            disabled={active === ITEMS.length - 1}
            onClick={() => scrollTo(active + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <ul ref={trackRef} className="conversions__track" tabIndex={0} aria-label="Equivalencias del tiempo restante">
        {ITEMS.map((item) => {
          return (
            <li key={item.id} className="conversion">
              {item.lead && <span className="conversion__lead">{item.lead}</span>}
              <span className="figure-stack conversion__figure">
                {item.id === "heartbeats" ? (
                  <LiveHeartbeats unit={item.unit} />
                ) : (
                  <PairNumber
                    value={conversions[item.id]}
                    unit={item.unit}
                    approximate={item.approximate}
                    className="conversion__number"
                  />
                )}
                <span className="figure-label conversion__unit" aria-hidden="true">
                  {item.unit}
                </span>
              </span>
              <span className="conversion__note">{item.note}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
