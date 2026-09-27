# Escape de Babylon

PWA de una sola página que cuenta, para Belén, cuánto falta para **escapar de Babylon**:
**31 de diciembre de 2027 a las 00:00, hora de Chile continental** (`America/Santiago`).

Cuenta regresiva calendárica (meses reales, no de 30 días), progreso del viaje como un
sol que recorre el horizonte, un mensaje distinto por cada día chileno, un explorador
de escalas de tiempo, equivalencias lúdicas, hitos con celebración y un estado final.
Funciona offline después de la primera carga.

## Stack

Vite · React · TypeScript (estricto) · Luxon · CSS moderno · vite-plugin-pwa (Workbox) ·
Vitest + Testing Library. Tipografía Space Grotesk empaquetada localmente (sin CDN).

## Requisitos

Node.js 20 o superior y npm.

## Uso

```bash
npm install
npm run dev        # servidor de desarrollo
npm run test       # tests unitarios
npm run build      # typecheck + build de producción en dist/
npm run preview    # sirve dist/ (incluye el service worker)
```

## Números

Valores bajo 100 se muestran siempre con dos dígitos (`07`, `15`). Desde 100 se usa la
notación chilena con punto de miles (`460`, `22.000`, `39.830.400`), para que ninguna
cifra se lea como si tuviera ceros de más. `≈` marca las equivalencias aproximadas.

## Amanecer

`src/lib/dawn.ts` define la curva noche → hora azul → alba → brasa → sol, que el
progreso del viaje recorre (ligeramente adelantada para que el cambio se note desde
las primeras semanas). Las estrellas se apagan, el sol asoma y sus rayos giran
lento a medida que avanza. Hasta el último día el texto blanco mantiene contraste
AA (tests en `dawn.test.ts`); al llegar la fecha la interfaz pasa a plena luz con
texto oscuro.

## Configuración

Todo lo crítico vive en [`src/config/app.ts`](src/config/app.ts):

```ts
export const APP_CONFIG = {
  personName: "Belén",
  timeZone: "America/Santiago",
  targetDate: "2027-12-31T00:00:00",       // hora de pared en timeZone
  journeyStartDate: "2026-09-28T08:00:00", // inicio del viaje (progreso 0 %)
  milestoneDays: [365, 300, /* … */ 1],
  …
};
```

Cambiar la fecha objetivo solo requiere editar `targetDate`.

## Zona horaria y precisión

- Todas las fechas se interpretan y calculan con Luxon en `America/Santiago`: fecha
  visible, día de la semana, mensajes, hitos, lunes, fines de semana, progreso y
  cuenta regresiva. La zona del dispositivo no influye; el horario de verano chileno
  lo resuelve Luxon (tests en `src/lib/time.test.ts`).
- El reloj (`src/lib/clock.ts`) no descuenta segundos: en cada tick relee `Date.now()`
  y recalcula la diferencia con el objetivo. Los ticks se alinean al inicio de cada
  segundo y se resincronizan en `visibilitychange`, `focus` y `pageshow`.
- Los segundos restantes se redondean hacia arriba: el contador marca `00` exactamente
  en el instante objetivo y nunca muestra negativos.

**Herramienta de QA:** `?simular=2027-12-30T23:59:50` fija la hora chilena indicada al
cargar la página y sigue avanzando en tiempo real (útil para revisar hitos y el estado final).

## Estructura

```
src/
├── config/app.ts          configuración central
├── lib/                   lógica pura y testeada
│   ├── time.ts            motor temporal (Luxon, America/Santiago)
│   ├── clock.ts           fuente única de "ahora", sin drift
│   ├── numberFormat.ts    formatPair · formatGrouped · formatApproximate
│   ├── conversions.ts     lunas, Mercurio, soles marcianos, latidos…
│   ├── messages.ts        mensajes diarios deterministas, siempre dirigidos a Belén
│   ├── dawn.ts            curva de color del amanecer
│   ├── milestones.ts      hitos, fases y persistencia defensiva
│   └── dates.ts           etiquetas de fecha en español
├── hooks/                 suscripciones por segundo / minuto / día
├── components/            una sección por componente
└── styles/                tokens.css · globals.css · animations.css
```

Solo los componentes que muestran segundos se re-renderizan cada segundo; `App`
se renderiza una vez por día chileno.

## Iconos

Los PNG de `public/` se generan desde `scripts/icon-source.svg` con
`node scripts/generate-icons.mjs` (requiere Playwright). No hace falta regenerarlos
para desplegar.

## Despliegue en Vercel

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new).
2. Vercel detecta Vite; `vercel.json` ya fija `npm run build` y `dist/`.
3. Deploy. No se necesitan variables de entorno.

Alternativa por CLI: `npx vercel --prod` desde la raíz del proyecto.
