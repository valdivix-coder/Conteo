import { useDailyMessage } from "../hooks/useDailyMessage";
import { chileDateTime } from "../lib/time";

interface DailyMessageProps {
  dayKey: string;
}

export function DailyMessage({ dayKey }: DailyMessageProps) {
  const message = useDailyMessage(dayKey);
  const stamp = chileDateTime(dayKey).toFormat("dd'·'LL");

  return (
    <section className="section message" aria-labelledby="message-title">
      <h2 id="message-title" className="eyebrow">
        Mensaje del día <span className="message__stamp">{stamp}</span>
      </h2>
      {/* Keyed by day so the text re-enters when the Chilean date changes. */}
      <blockquote key={dayKey} className="message__text">
        <p>{message}</p>
      </blockquote>
    </section>
  );
}
