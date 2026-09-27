import { DateTime } from "luxon";
import { APP_CONFIG } from "../config/app";

/**
 * Editorial message system. Every fragment is a complete sentence so any
 * combination stays grammatical. Fragments share a `theme` so the same idea
 * never appears twice in one message, and some are limited to weekdays
 * where they make sense ("Otro lunes quedó atrás" only after a Monday).
 */

type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface Fragment {
  text: string;
  theme: string;
  weekdays?: readonly Weekday[];
}

const name = APP_CONFIG.personName;

export const OPENINGS: readonly Fragment[] = [
  { text: "Otro día menos.", theme: "day" },
  { text: "Babylon perdió otro día.", theme: "babylon" },
  { text: "El contador sigue corriendo.", theme: "clock" },
  { text: "Hoy también avanzamos.", theme: "progress" },
  { text: "Una vuelta menos.", theme: "wheel" },
  { text: `Buenos días, ${name}.`, theme: "greeting" },
  { text: "Parte de guerra: Babylon retrocede.", theme: "babylon" },
  { text: "Nuevo día, misma misión.", theme: "mission" },
  { text: "Tachamos otro casillero.", theme: "calendar" },
  { text: "Reporte diario de la fuga.", theme: "escape" },
  { text: "Amaneció, y eso ya suma.", theme: "sunrise" },
  { text: "La operación sigue en curso.", theme: "mission" },
  { text: "Otra hoja arrancada al calendario.", theme: "calendar" },
  { text: "Paso a paso, sin volver atrás.", theme: "progress" },
  { text: "Babylon amaneció más pequeña.", theme: "babylon" },
  { text: "Hoy el reloj trabaja para ti.", theme: "clock" },
  { text: "Seguimos cavando el túnel.", theme: "escape" },
  { text: `${name}, informe del día.`, theme: "greeting" },
  { text: "La fuga avanza según lo previsto.", theme: "escape" },
  { text: "Un día más cerca de la salida.", theme: "day" },
  { text: "El plan sigue intacto.", theme: "mission" },
  { text: "Otro amanecer conquistado.", theme: "sunrise" },
  { text: "Hoy la rueda gira un poco más lento.", theme: "wheel" }
];

export const IMAGES: readonly Fragment[] = [
  { text: "La rueda de hámster tiene una vuelta menos.", theme: "wheel" },
  { text: "El horizonte está más cerca.", theme: "horizon" },
  { text: "Otro lunes quedó atrás.", theme: "monday", weekdays: [2] },
  { text: "Otro lunes eliminado de la ecuación.", theme: "monday", weekdays: [2, 3] },
  { text: "El calendario juega a favor.", theme: "calendar" },
  { text: "La salida sigue acercándose.", theme: "escape" },
  { text: "Un día menos de venderle horas al sistema.", theme: "day" },
  { text: "La libertad todavía está al fondo. Pero ya se alcanza a ver.", theme: "horizon" },
  { text: "Babylon: tiempo restante limitado.", theme: "babylon" },
  { text: "Un amanecer menos entre tú y la salida.", theme: "sunrise" },
  { text: "Algún día este lunes será simplemente un lunes.", theme: "monday", weekdays: [1] },
  { text: "Otro día tachado del calendario imperial.", theme: "calendar" },
  { text: "El sistema puede quedarse con este martes. Diciembre de 2027 no.", theme: "babylon", weekdays: [2] },
  { text: "El sistema puede quedarse con este miércoles. Diciembre de 2027 no.", theme: "babylon", weekdays: [3] },
  { text: "Mitad de semana. Mitad de nada: la cuenta es otra.", theme: "week", weekdays: [3] },
  { text: "Ya es jueves, y diciembre de 2027 no se mueve de su lugar.", theme: "week", weekdays: [4] },
  { text: "Viernes: el día que Babylon usa para que olvides el lunes.", theme: "friday", weekdays: [5] },
  { text: "Pronto no habrá que esperar el viernes para respirar.", theme: "friday", weekdays: [4, 5] },
  { text: "Fin de semana: un adelanto de lo que viene.", theme: "weekend", weekdays: [6, 7] },
  { text: "Hoy Babylon no tiene jurisdicción.", theme: "weekend", weekdays: [6, 7] },
  { text: "El domingo en la noche también tiene fecha de término.", theme: "weekend", weekdays: [7] },
  { text: "Las mañanas propias están cada vez más cerca.", theme: "morning" },
  { text: "Cada hora de hoy también cuenta a favor.", theme: "clock" },
  { text: "Hoy tampoco escapamos. Pero estamos 24 horas más cerca.", theme: "day" },
  { text: "La frontera no se mueve. Nosotros sí.", theme: "horizon" },
  { text: "Las reuniones de hoy ya son historia antigua en diciembre de 2027.", theme: "meetings", weekdays: [1, 2, 3, 4, 5] },
  { text: "El despertador tiene los días contados.", theme: "morning", weekdays: [1, 2, 3, 4, 5] },
  { text: "Babylon ya no tiene tiempo infinito.", theme: "babylon" },
  { text: "La cuenta regresiva no se toma vacaciones.", theme: "clock" },
  { text: "El último tramo se construye con días como este.", theme: "progress" },
  { text: "Hasta la rueda más grande termina deteniéndose.", theme: "wheel" }
];

export const CLOSINGS: readonly Fragment[] = [
  { text: "Falta menos.", theme: "less" },
  { text: "Y eso ya cuenta.", theme: "count" },
  { text: "El tiempo está de nuestro lado.", theme: "time" },
  { text: "El reloj no negocia.", theme: "clock" },
  { text: "La libertad sigue acercándose.", theme: "freedom" },
  { text: `Tranquila, ${name}. Hasta Babylon tiene fecha de término.`, theme: "babylon" },
  { text: "Siguiente parada: el horizonte.", theme: "horizon" },
  { text: "Todo según el plan.", theme: "mission" },
  { text: "El calendario no retrocede.", theme: "calendar" },
  { text: "Diciembre de 2027 ya está en camino.", theme: "target" },
  { text: "Falta menos que ayer.", theme: "less" },
  { text: "Cada segundo cuenta.", theme: "clock" },
  { text: "El tiempo propio vuelve pronto.", theme: "time" },
  { text: "Seguimos.", theme: "progress" },
  { text: "La salida tiene fecha.", theme: "escape" },
  { text: "Y mañana, un poco menos.", theme: "less" }
];

/** Hand-written messages that appear on their own, roughly one day in five. */
export const STANDALONE: readonly string[] = [
  "Babylon perdió otro día. Y no tiene cómo recuperarlo.",
  "Una vuelta menos en la rueda de hámster. La rueda todavía no se entera.",
  `Tranquila, ${name}. Hasta Babylon tiene fecha de término.`,
  "El reloj no negocia. Sigue avanzando, lo mires o no.",
  "La libertad todavía está al fondo. Pero ya se alcanza a ver.",
  "Hoy no escapamos. Pero Babylon tampoco nos recuperó ni un minuto.",
  "Un día menos de venderle horas al sistema. Uno más de guardarlas para ti.",
  "Imagina un martes cualquiera sin alarma. Eso. Hacia allá vamos.",
  "Babylon tiene horarios. Tú tienes una fecha.",
  "Cada correo de hoy es uno menos en el inventario total.",
  "Los imperios también se terminan. Este tiene fecha: 31 de diciembre de 2027.",
  "Nota mental: dentro de poco, el lunes volverá a ser solo un día de la semana.",
  "La rueda gira, pero ya sabemos dónde está la puerta.",
  "Recuperar mañanas: un proyecto de largo plazo con fecha de entrega fija.",
  "El sistema cuenta horas trabajadas. Nosotros contamos las que faltan.",
  "Hoy también se cumple la regla de oro: falta menos que ayer.",
  "Hay un amanecer en diciembre de 2027 que ya tiene tu nombre.",
  "La salida no aparece de golpe. Se acerca un día a la vez, como hoy.",
  "Babylon: capacidad de retención en declive.",
  "El calendario imperial perdió otra casilla. Nadie la va a extrañar.",
  "Algún día esto será una anécdota. Cada día falta menos para ese día.",
  "Pequeño recordatorio: tu tiempo es tuyo. Solo lo tienen prestado un rato más.",
  "El horizonte no se ve más grande. Pero está más cerca.",
  "Hoy el contador bajó sin que tuvieras que hacer nada. Buen trato.",
  "Operación Libertad: sin retrasos reportados.",
  "No es impaciencia. Es contabilidad.",
  "Dejaremos de esperar el viernes. Por ahora, esperamos diciembre de 2027.",
  "El tiempo que falta es finito. El que viene después, bastante menos.",
  "Si la rueda se siente pesada hoy: recuerda que ya tiene fecha de jubilación.",
  "Otro día de Babylon convertido en pasado. Es el único destino que merece.",
  "Quedan menos lunes de los que había ayer. Siempre será así.",
  "El plan es simple: seguir contando hasta que no quede nada que contar."
];

const STANDALONE_EVERY = 5;
// Strides coprime with each pool size so consecutive days never repeat a fragment.
const OPENING_STRIDE = 7;
const IMAGE_STRIDE = 11;
const CLOSING_STRIDE = 5;
const STANDALONE_STRIDE = 13;

/** Days since 1970-01-01 for a Chilean calendar date. Independent of the device timezone. */
export function dayOrdinal(dayKey: string): number {
  const date = DateTime.fromISO(dayKey, { zone: "utc" });
  return Math.floor(date.toMillis() / 86_400_000);
}

function weekdayOf(dayKey: string): Weekday {
  return DateTime.fromISO(dayKey, { zone: "utc" }).weekday as Weekday;
}

function pick<T>(pool: readonly T[], index: number, stride: number): T {
  const item = pool[(((index * stride) % pool.length) + pool.length) % pool.length];
  if (item === undefined) throw new Error("Empty message pool");
  return item;
}

function allowedOn(fragment: Fragment, weekday: Weekday): boolean {
  return !fragment.weekdays || fragment.weekdays.includes(weekday);
}

function pickCompatible(
  pool: readonly Fragment[],
  index: number,
  stride: number,
  weekday: Weekday,
  usedThemes: ReadonlySet<string>
): Fragment {
  const candidates = pool.filter((f) => allowedOn(f, weekday));
  for (let offset = 0; offset < candidates.length; offset += 1) {
    const candidate = pick(candidates, index + offset, stride);
    if (!usedThemes.has(candidate.theme)) return candidate;
  }
  return pick(candidates, index, stride);
}

/**
 * Deterministic message for a Chilean calendar date (yyyy-MM-dd).
 * Same date → same message, on any device, across reloads.
 */
export function messageForDay(dayKey: string): string {
  const ordinal = dayOrdinal(dayKey);
  const weekday = weekdayOf(dayKey);

  if (ordinal % STANDALONE_EVERY === 0) {
    return pick(STANDALONE, Math.floor(ordinal / STANDALONE_EVERY), STANDALONE_STRIDE);
  }

  const used = new Set<string>();
  const opening = pickCompatible(OPENINGS, ordinal, OPENING_STRIDE, weekday, used);
  used.add(opening.theme);
  const image = pickCompatible(IMAGES, ordinal, IMAGE_STRIDE, weekday, used);
  used.add(image.theme);
  const closing = pickCompatible(CLOSINGS, ordinal, CLOSING_STRIDE, weekday, used);

  return `${opening.text} ${image.text} ${closing.text}`;
}

/** Number of distinct natural combinations the system can produce. */
export function combinationCount(): number {
  return OPENINGS.length * IMAGES.length * CLOSINGS.length + STANDALONE.length;
}
