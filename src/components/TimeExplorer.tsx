import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useTotals } from "../hooks/useCountdown";
import type { Totals } from "../lib/time";
import { PairNumber } from "./PairNumber";

interface Line {
  value: number;
  unit: string;
}

interface View {
  id: string;
  tab: string;
  lines: (t: Totals) => Line[];
}

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

const VIEWS: readonly View[] = [
  {
    id: "calendar",
    tab: "Calendario",
    lines: (t) => [
      { value: t.months, unit: plural(t.months, "mes", "meses") },
      { value: t.monthRemainderDays, unit: plural(t.monthRemainderDays, "día", "días") }
    ]
  },
  {
    id: "weeks",
    tab: "Semanas",
    lines: (t) => {
      const weeks = { value: t.weeks, unit: plural(t.weeks, "semana", "semanas") };
      return t.weekRemainderDays === 0
        ? [weeks]
        : [weeks, { value: t.weekRemainderDays, unit: plural(t.weekRemainderDays, "día", "días") }];
    }
  },
  { id: "days", tab: "Días", lines: (t) => [{ value: t.totalDays, unit: plural(t.totalDays, "día", "días") }] },
  { id: "hours", tab: "Horas", lines: (t) => [{ value: t.totalHours, unit: plural(t.totalHours, "hora", "horas") }] },
  {
    id: "minutes",
    tab: "Minutos",
    lines: (t) => [{ value: t.totalMinutes, unit: plural(t.totalMinutes, "minuto", "minutos") }]
  },
  {
    id: "seconds",
    tab: "Segundos",
    lines: (t) => [{ value: t.totalSeconds, unit: plural(t.totalSeconds, "segundo", "segundos") }]
  }
];

const SWIPE_THRESHOLD_PX = 48;
const DRAG_LOCK_PX = 8;
const DRAG_RESISTANCE = 0.35;

type Direction = "next" | "prev";

export function TimeExplorer() {
  const totals = useTotals();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; dx: number; horizontal: boolean | null } | null>(null);

  const go = (next: number, focusTab = false) => {
    const wrapped = (next + VIEWS.length) % VIEWS.length;
    setDirection(next > index ? "next" : "prev");
    setIndex(wrapped);
    if (focusTab) tabRefs.current[wrapped]?.focus();
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: VIEWS.length - 1
    };
    const target = moves[event.key];
    if (target === undefined) return;
    event.preventDefault();
    go(target, true);
  };

  const setStageOffset = (px: number) => {
    const stage = stageRef.current;
    if (stage) stage.style.transform = px === 0 ? "" : `translate3d(${px}px, 0, 0)`;
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, dx: 0, horizontal: null };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;
    const dx = event.clientX - state.x;
    const dy = event.clientY - state.y;
    if (state.horizontal === null && (Math.abs(dx) > DRAG_LOCK_PX || Math.abs(dy) > DRAG_LOCK_PX)) {
      state.horizontal = Math.abs(dx) > Math.abs(dy);
      if (state.horizontal) event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (state.horizontal) {
      state.dx = dx;
      setStageOffset(dx * DRAG_RESISTANCE);
    }
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const state = drag.current;
    drag.current = null;
    setStageOffset(0);
    if (!state || cancelled) return;
    if (state.horizontal && Math.abs(state.dx) >= SWIPE_THRESHOLD_PX) {
      go(state.dx < 0 ? index + 1 : index - 1);
    } else if (state.horizontal === null && event.pointerType !== "mouse") {
      go(index + 1);
    }
  };

  const view = VIEWS[index] ?? VIEWS[0]!;
  const lines = view.lines(totals);
  const panelId = `${baseId}-panel`;

  return (
    <section className="section explorer" aria-labelledby={`${baseId}-title`}>
      <h2 id={`${baseId}-title`} className="section__title">
        ¿Cuánto falta <em>realmente</em>?
      </h2>

      <div className="segmented" role="tablist" aria-label="Unidad de tiempo">
        {VIEWS.map((v, i) => (
          <button
            key={v.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${v.id}`}
            aria-selected={i === index}
            aria-controls={panelId}
            tabIndex={i === index ? 0 : -1}
            className="segmented__tab"
            onClick={() => go(i)}
            onKeyDown={onTabKeyDown}
          >
            {v.tab}
          </button>
        ))}
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${view.id}`}
        className="explorer__panel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => endDrag(e)}
        onPointerCancel={(e) => endDrag(e, true)}
      >
        <div ref={stageRef} className="explorer__stage">
          <div key={view.id} className={`explorer__view explorer__view--${direction}`}>
            {lines.map((line, i) => (
              <p key={i} className={`figure-stack explorer__line${i > 0 ? " explorer__line--secondary" : ""}`}>
                <PairNumber value={line.value} unit={line.unit} className="explorer__number" />
                <span className="figure-label explorer__unit" aria-hidden="true">
                  {line.unit}
                </span>
              </p>
            ))}
          </div>
        </div>
        <p className="explorer__hint" aria-hidden="true">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span className="explorer__hint-rule" />
          <span>{String(VIEWS.length).padStart(2, "0")}</span>
          <span className="explorer__hint-text">Desliza para cambiar la escala</span>
        </p>
      </div>
    </section>
  );
}
