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

/*
 * Tone: motivational, irreverent, a bit acid — and always talking to her.
 * Every IMAGE is written in second person, so any combination addresses
 * Belén directly even when the opening or closing does not name her.
 */

export const OPENINGS: readonly Fragment[] = [
  { text: `${name}, reporte del día.`, theme: "greeting" },
  { text: "Babylon perdió otro día.", theme: "babylon" },
  { text: `Buenos días, ${name}.`, theme: "greeting" },
  { text: "Otro día menos. De nada.", theme: "day" },
  { text: "Parte de guerra: Babylon retrocede.", theme: "babylon" },
  { text: `Atención, ${name}.`, theme: "greeting" },
  { text: "La fuga sigue según lo previsto.", theme: "escape" },
  { text: "Amaneció, que no es poco.", theme: "sunrise" },
  { text: "Tachamos otro casillero.", theme: "calendar" },
  { text: `Tranquila, ${name}.`, theme: "calendar-calm" },
  { text: "Nuevo día, misma misión.", theme: "mission" },
  { text: "Noticia de última hora: falta menos.", theme: "news" },
  { text: `${name}, respira.`, theme: "breathe" },
  { text: "El imperio amaneció más chico.", theme: "babylon" },
  { text: "Otra hoja arrancada al calendario.", theme: "calendar" },
  { text: "Seguimos cavando el túnel.", theme: "escape" },
  { text: `Ojo, ${name}.`, theme: "greeting" },
  { text: "Hoy la rueda gira un poco más lento.", theme: "wheel" },
  { text: "El reloj sigue de tu lado.", theme: "clock" },
  { text: "La operación sigue en curso.", theme: "mission" },
  { text: `${name}, dato duro.`, theme: "news" },
  { text: "Otro amanecer conquistado.", theme: "sunrise" },
  { text: "Informe confidencial de la fuga.", theme: "escape" }
];

export const IMAGES: readonly Fragment[] = [
  { text: "Tu rueda de hámster tiene una vuelta menos, y ni siquiera tuviste que correr más rápido.", theme: "wheel" },
  { text: "El horizonte está más cerca de ti que tu próxima reunión inútil.", theme: "horizon" },
  { text: "Sobreviviste a otro lunes. Tú ya mereces medalla.", theme: "monday", weekdays: [2] },
  { text: "Ya te sacaste el lunes de encima. Que lo archive otro.", theme: "monday", weekdays: [2, 3] },
  { text: "Hoy es lunes, sí. Pero es uno de los últimos que te van a cobrar.", theme: "monday", weekdays: [1] },
  { text: "Tu calendario juega a favor, aunque tu jefe no se haya enterado.", theme: "calendar" },
  { text: "Hoy le vendes horas al sistema, pero tú ya tienes fecha para cerrar la tienda.", theme: "day" },
  { text: "La libertad todavía está al fondo, pero tú ya la alcanzas a ver sin anteojos.", theme: "horizon" },
  { text: "Babylon te tiene con contrato a plazo fijo. Y el plazo se acaba.", theme: "babylon" },
  { text: "Te queda un amanecer menos antes de que las mañanas vuelvan a ser tuyas.", theme: "sunrise" },
  { text: "El sistema puede quedarse con tu martes. Diciembre de 2027 no se lo prestas.", theme: "babylon", weekdays: [2] },
  { text: "Mitad de semana: si te preguntan cómo vas, di que de salida.", theme: "week", weekdays: [3] },
  { text: "Es jueves. Tú ya casi eres leyenda y Babylon, un mal recuerdo.", theme: "week", weekdays: [4] },
  { text: "Viernes: el soborno semanal de Babylon. Tú ya no te vendes por tan poco.", theme: "friday", weekdays: [5] },
  { text: "Pronto tú no vas a necesitar un viernes para acordarte de respirar.", theme: "friday", weekdays: [4, 5] },
  { text: "Hoy Babylon no tiene jurisdicción sobre ti. Disfrútalo con descaro.", theme: "weekend", weekdays: [6, 7] },
  { text: "Tu fin de semana es solo el tráiler. La película completa se estrena en diciembre de 2027.", theme: "weekend", weekdays: [6] },
  { text: "Esa angustia de domingo en la noche también tiene fecha de vencimiento. Y tú la sabes.", theme: "weekend", weekdays: [7] },
  { text: "Tus mañanas propias vienen en camino. Sin alarma y sin correos con «urgente».", theme: "morning" },
  { text: "Cada reunión que te toca aguantar hoy es una menos en el inventario total.", theme: "meetings", weekdays: [1, 2, 3, 4, 5] },
  { text: "Tu despertador tiene los días contados. Que vaya haciendo las maletas.", theme: "morning", weekdays: [1, 2, 3, 4, 5] },
  { text: "No es impaciencia lo tuyo: es contabilidad de precisión.", theme: "clock" },
  { text: "Hoy tampoco te escapas, pero estás 24 horas más cerca que ayer.", theme: "day" },
  { text: "La frontera no se mueve. Tú sí.", theme: "horizon" },
  { text: "Babylon ya no tiene tiempo infinito contigo. Tiene fecha y hora.", theme: "babylon" },
  { text: "Tu último tramo se construye con días como este. Aburridos, pero útiles.", theme: "progress" },
  { text: "Hasta la rueda más grande se detiene. La tuya ya está frenando.", theme: "wheel" },
  { text: "Tú no estás atrasada: estás en cuenta regresiva.", theme: "progress" },
  { text: "Si hoy te toca sonreír por compromiso, recuerda que el compromiso tiene fecha de término.", theme: "smile" },
  { text: "Cada correo que respondes hoy es uno menos en tu bandeja para siempre. O sea, ninguno.", theme: "mail", weekdays: [1, 2, 3, 4, 5] },
  { text: "Ya puedes ir ensayando tu cara de «ya no trabajo aquí».", theme: "rehearse" }
];

export const CLOSINGS: readonly Fragment[] = [
  { text: "Falta menos.", theme: "less" },
  { text: "Y eso ya cuenta.", theme: "count" },
  { text: "El reloj no negocia.", theme: "clock" },
  { text: "La libertad sigue acercándose.", theme: "freedom" },
  { text: "Hasta Babylon tiene fecha de término.", theme: "babylon" },
  { text: "Siguiente parada: el horizonte.", theme: "horizon" },
  { text: "Todo según el plan.", theme: "mission" },
  { text: "El calendario no retrocede.", theme: "calendar" },
  { text: "Diciembre de 2027 ya viene en camino.", theme: "target" },
  { text: "Falta menos que ayer.", theme: "less" },
  { text: "Cada segundo cuenta.", theme: "clock" },
  { text: "Seguimos.", theme: "progress" },
  { text: "La salida tiene fecha.", theme: "escape" },
  { text: "Y mañana, un poco menos.", theme: "less" },
  { text: "Aguanta, que ya se ve la puerta.", theme: "escape" },
  { text: "El sol ya viene subiendo.", theme: "sunrise" }
];

/** Hand-written messages that appear on their own, roughly one day in five. */
export const STANDALONE: readonly string[] = [
  `${name}, Babylon perdió otro día y no tiene cómo recuperarlo. Tú tampoco lo vas a extrañar.`,
  `Tranquila, ${name}. Hasta Babylon tiene fecha de término. Y la tuya está marcada con plumón.`,
  "El reloj no negocia, pero trabaja para ti. Es el único colega que no te pide nada.",
  "Hoy no escapas. Pero Babylon tampoco te recuperó ni un minuto. Empate técnico a tu favor.",
  `${name}: imagina un martes cualquiera sin alarma. Eso. Hacia allá vas.`,
  "Babylon tiene horarios. Tú tienes una fecha. Adivina quién gana.",
  `Nota para ${name}: dentro de poco, el lunes volverá a ser solo un día de la semana.`,
  "La rueda sigue girando, pero tú ya sabes dónde está la puerta.",
  "Recuperar tus mañanas: un proyecto de largo plazo con fecha de entrega fija. El único que vas a entregar feliz.",
  "El sistema cuenta tus horas trabajadas. Tú cuentas las que faltan. Tu matemática es mejor.",
  `${name}, hay un amanecer en diciembre de 2027 que ya tiene tu nombre. Literal.`,
  "Operación Libertad: sin retrasos reportados. Tu paciencia, en cambio, merece un aumento.",
  "Tú vas a dejar de esperar el viernes. Por ahora, espera diciembre de 2027 con elegancia.",
  `Si la rueda se siente pesada hoy, ${name}, recuerda que ya tiene fecha de jubilación. Antes que tú.`,
  "Te quedan menos lunes de los que tenías ayer. Siempre será así. Es la mejor noticia de la semana.",
  `El plan es simple, ${name}: seguir contando hasta que no quede nada que contar.`,
  "Babylon cree que eres recurso humano. Tú sabes que eres fuga en progreso.",
  `${name}, hoy puedes quejarte con total tranquilidad: la queja también tiene fecha de vencimiento.`,
  "Tu tiempo es tuyo. Solo lo tienen prestado un rato más, y sin intereses.",
  "Sonríe en la próxima reunión. Tú sabes algo que ellos no.",
  `${name}, el horizonte no se ve más grande, pero está más cerca. Como las vacaciones eternas.`,
  "Hoy el contador bajó sin que movieras un dedo. Por fin un trato justo en tu vida laboral.",
  "No te estás rindiendo: estás haciendo tiempo con estilo.",
  `Ánimo, ${name}. Hasta el café de la oficina sabe que no te va a ver para siempre.`,
  "Babylon: capacidad para retenerte, en franco declive. Tú, en franco ascenso.",
  "Si alguien te pregunta por tus planes a largo plazo, di «diciembre de 2027» y sonríe con misterio.",
  `${name}, otro día de Babylon convertido en pasado. Es el único destino que se merece.`,
  "Tu paciencia debería cotizar en bolsa. Pero ya falta poco para no necesitarla.",
  "Hoy no hace falta ser valiente. Basta con dejar que pase el día. El calendario hace el resto por ti.",
  `${name}, el sol ya empezó a subir. Tú solo tienes que seguir mirando al horizonte.`,
  "Algún día contarás esto como anécdota. Cada día que pasa, te falta menos para ese día.",
  "La salida no aparece de golpe: se te acerca un día a la vez. Como hoy."
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
