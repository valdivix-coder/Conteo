import type { CSSProperties } from "react";
import { APP_CONFIG } from "../config/app";
import { targetLabel } from "../lib/dates";
import { Celebration } from "./Celebration";

const LINES = ["El contador terminó.", "La rueda dejó de girar.", "El tiempo vuelve a ser tuyo."];

export function FinalState() {
  return (
    <section className="hero final" aria-labelledby="final-title">
      <Celebration burstKey="final" intensity="final" />
      <div className="final__sun" aria-hidden="true">
        <span className="final__rays" />
        <span className="final__disc" />
      </div>

      <div className="final__content">
        <p className="eyebrow eyebrow--freedom">Operación libertad · completada</p>
        <h1 id="final-title" className="final__title">
          {APP_CONFIG.personName} escapó de <span className="final__accent">Babylon.</span>
        </h1>
        <ul className="final__lines">
          {LINES.map((line, i) => (
            <li key={line} style={{ "--i": i } as CSSProperties}>
              {line}
            </li>
          ))}
        </ul>
        <p className="final__zero" aria-label="Tiempo restante: cero">
          <span aria-hidden="true">00 : 00 : 00 : 00 : 00</span>
        </p>
        <p className="final__date">{targetLabel()}</p>
      </div>
    </section>
  );
}
