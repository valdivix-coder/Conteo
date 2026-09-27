import { useEffect, useMemo, useRef, useState } from "react";
import { useNowMinute } from "../hooks/useChileTime";
import { computeConversions, type Conversions } from "../lib/conversions";
import { formatApproximate, formatPair } from "../lib/numberFormat";
import { countCalendarDays, remainingSeconds } from "../lib/time";
import { PairNumber } from "./PairNumber";

interface Item {
  id: keyof Conversions;
  lead?: string;
  unit: string;
  note: string;
  /** null keeps the full integer; a number rounds to that many significant digits. */
  approximate?: number | null;
}

const ITEMS: readonly Item[] = [
  { id: "mondays", lead: "Solo quedan", unit: "lunes", note: "Cada uno, el último de su especie." },
  { id: "weekends", unit: "fines de semana", note: "Pronto dejarán de ser la única recompensa." },
  { id: "sunrises", unit: "amaneceres", note: "Uno menos cada mañana.", approximate: null },
  { id: "moons", unit: "lunas", note: "Ciclos de 29,53 días. La luna también cuenta.", approximate: 2 },
  { id: "dogYears", unit: "años de perro", note: "Cálculo científicamente dudoso.", approximate: 2 },
  { id: "mercuryYears", unit: "años de Mercurio", note: "Allá un año dura 88 días terrestres.", approximate: 2 },
  { id: "marsSols", unit: "soles marcianos", note: "Un día en Marte: 24 h 39 min 35 s.", approximate: 2 },
  { id: "heartbeatsMillions", unit: "millones de latidos", note: "Estimación a 70 latidos por minuto.", approximate: 2 },
  { id: "songs", unit: "canciones", note: "De tres minutos cada una. Elige bien.", approximate: 2 },
  { id: "matiNaps", unit: "siestas de la Mati", note: "Sin despertador ni culpa. Una detrás de otra.", approximate: 2 },
  { id: "venegasEpisodes", unit: "capítulos de Los Venegas", note: "Maratón garantizada. Nadie se levanta del sillón.", approximate: 2 },
  { id: "isiJokes", unit: "chistes de la Isi", note: "Dicen que traen remate. Generalmente no lo traen.", approximate: 2 },
  { id: "simonShowers", unit: "duchas de Simón", note: "Secarse cuenta por separado.", approximate: 2 },
  { id: "juCookies", unit: "galletas de la Ju", note: "En su versión motivada. Del horno directo a la mesa.", approximate: 2 }
];

interface FunConversionsProps {
  dayKey: string;
}

export function FunConversions({ dayKey }: FunConversionsProps) {
  const minute = useNowMinute();
  const calendar = useMemo(() => countCalendarDays(dayKey), [dayKey]);
  const conversions = useMemo(
    () => computeConversions(remainingSeconds(minute * 60_000), calendar),
    [minute, calendar]
  );

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
          const raw = conversions[item.id];
          const isApprox = item.approximate !== undefined;
          const value = isApprox ? formatApproximate(raw, { significantDigits: item.approximate }).value : raw;
          return (
            <li key={item.id} className="conversion">
              {item.lead && <span className="conversion__lead">{item.lead}</span>}
              <span className="figure-stack conversion__figure">
                <PairNumber value={value} unit={item.unit} approximate={isApprox} className="conversion__number" />
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
