import { useMemo } from "react";
import { describeDay } from "../lib/dates";
import { formatPair } from "../lib/numberFormat";

interface CurrentDateProps {
  dayKey: string;
  finished: boolean;
}

export function CurrentDate({ dayKey, finished }: CurrentDateProps) {
  const label = useMemo(() => describeDay(dayKey), [dayKey]);

  return (
    <header className="topbar">
      <p className="today">
        <span className="today__weekday">{label.weekday}</span>
        <span className="today__date">
          <time dateTime={dayKey}>
            {label.dayMonth} <span className="today__year">{label.year}</span>
          </time>
        </span>
      </p>
      {!finished && label.journeyDay > 0 && (
        <p className="journey-day">
          <span className="journey-day__label">Día</span>
          <span className="journey-day__value">{formatPair(label.journeyDay)}</span>
          <span className="sr-only"> del viaje</span>
        </p>
      )}
    </header>
  );
}
