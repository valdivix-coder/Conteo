import { PairNumber } from "./PairNumber";
import { Celebration } from "./Celebration";

const MILESTONE_COPY: Record<number, { title: string; line: string }> = {
  365: { title: "Un año exacto.", line: "La última vuelta completa al sol dentro de Babylon." },
  300: { title: "Trescientos.", line: "Babylon ya no alcanza ni para un año." },
  250: { title: "Doscientos cincuenta.", line: "Un cuarto de mil. El reloj no negocia." },
  200: { title: "Doscientos.", line: "Queda menos de lo que ya se aguantó." },
  150: { title: "Ciento cincuenta.", line: "Cinco lunas. La salida se empieza a ver." },
  100: { title: "Cien días.", line: "Última vez en tres dígitos. Desde mañana, solo dos." },
  75: { title: "Setenta y cinco.", line: "El último trimestre de Babylon ya empezó." },
  50: { title: "Cincuenta.", line: "Medio centenar. La rueda ya va perdiendo impulso." },
  30: { title: "Treinta días.", line: "Un mes. Uno solo." },
  14: { title: "Catorce.", line: "Últimas dos semanas." },
  7: { title: "Siete.", line: "Última semana en Babylon." },
  3: { title: "Tres.", line: "Se cuentan con una mano. Y sobran dedos." },
  2: { title: "Dos.", line: "Pasado mañana, el tiempo vuelve a ser tuyo." },
  1: { title: "Un día.", line: "Comenzó la cuenta regresiva final." }
};

interface MilestoneMomentProps {
  milestone: number;
  celebrate: boolean;
}

export function MilestoneMoment({ milestone, celebrate }: MilestoneMomentProps) {
  const copy = MILESTONE_COPY[milestone];
  const isGrand = milestone === 100 || milestone === 365 || milestone === 1;

  return (
    <section
      className={`section milestone${isGrand ? " milestone--grand" : ""}${celebrate ? " milestone--live" : ""}`}
      aria-labelledby="milestone-title"
    >
      {celebrate && <Celebration burstKey={milestone} />}
      <p id="milestone-title" className="eyebrow eyebrow--freedom">
        Hito alcanzado
      </p>
      <p className="milestone__figure">
        <span className="milestone__lead">Quedan</span>
        <PairNumber value={milestone} unit={milestone === 1 ? "día" : "días"} className="milestone__number" />
        <span className="milestone__unit" aria-hidden="true">
          {milestone === 1 ? "día" : "días"}
        </span>
      </p>
      {copy && (
        <p className="milestone__copy">
          <strong>{copy.title}</strong> {copy.line}
        </p>
      )}
    </section>
  );
}
