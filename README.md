# Idilio TV — Barra de racha

POC de la intervención elegida para el reto de diseño de Product Designer (UX/UI) de
Idilio TV: una barra de estado persistente, anclada al borde inferior del reproductor, que
comunica saldo de monedas y estado de racha diaria.

**POC en vivo:** https://idilio-poc.vercel.app

---

## Los cuatro entregables del reto

| # | Entregable | Dónde está |
|---|---|---|
| 5.1 | Diagnóstico | [`diagnostico.md`](./diagnostico.md) |
| 5.2 | Estrategia | [`estrategia.md`](./estrategia.md) |
| 5.3 | Intervención en profundidad | [`estados.md`](./estados.md) · [`design-tokens.md`](./design-tokens.md) · [`design/`](./design/) |
| 5.4 | POC funcional | Este repositorio · [demo](https://idilio-poc.vercel.app) |

La **página de entrega** reúne los cuatro en un solo link. Su fuente está en
[`entrega/`](./entrega/); las páginas publicadas viven en claude.ai.

Para el 5.3 el reto sugiere Figma. El diseño se hizo en **pen.dev**: el archivo está en
[`design/idilio-barra-de-racha.pen`](./design/) y sus exportaciones en
[`design/export/`](./design/export/). La barra existe una sola vez como componente
reutilizable; los diez estados son instancias con overrides, y los tokens de
`design-tokens.md` están cargados como 23 variables del documento.

Hubo una vía anterior —un plugin que generaba el archivo nativo de Figma desde la Plugin
API, porque la REST es de solo lectura para contenido— que se descartó al quedar Figma
fuera. No sobrevive en el repositorio.

---

## Qué probar en el POC

1. Arranca en el **episodio 13 — el muro**, con saldo 0. Es donde el usuario real llega en su
   primera noche: 14 episodios por sesión, 12 gratis.
2. **Desbloquear** sin saldo → la barra pasa al **estado 10** y el saldo se pone en rojo.
3. **Reclamar +20** → el botón confirma «Reclamado», el saldo sube y el desbloqueo procede.
4. **Día siguiente → Reclamar**, dos veces, para llegar al **día 3** y ver la celebración.
5. **Tocar el video** oculta y muestra la barra — estados 8 y 9. Es el gesto real de un
   reproductor, no un atajo de demo.
6. **Faltar un día** → estado 7, que no regaña.

El panel de la derecha está etiquetado como herramienta de evaluación y no es parte de la
barra. Sin él, una racha de siete días es imposible de evaluar en una sesión de revisión.

---

## Correr en local

```bash
npm install
npm run dev
```

http://localhost:3000

---

## Arquitectura

```
lib/streak/
  types.ts      Estado, acciones y estado inicial
  reducer.ts    Las transiciones. La racha es una máquina de estados
  select.ts     Pila de prioridad: qué estado gana cuando varios aplican
  copy.ts       Microcopy, derivado de la tabla de estados.md
  curve.ts      Curva actual vs. propuesta
  economy.ts    Constantes observadas en la app real
  persist.ts    localStorage, solo para sobrevivir un refresh

components/
  DemoStage     Dueño del estado; monta el teléfono y el panel
  Scene         Video + chrome del reproductor + muro + barra
  StreakBar/    La barra: saldo, mensaje, indicador, CTA
  Player/       Contexto de episodio y el muro de desbloqueo
  DemoPanel/    Herramienta de evaluación
```

**Decisiones que se defienden en la sesión:**

- **`useReducer`, no varios `useState`.** La racha es una máquina de estados y se modela
  como tal. La pila de prioridad vive en una función pura (`select.ts`) separada de las
  transiciones (`reducer.ts`).
- **Los estados 8 y 9 no son estados de contenido.** Son visibilidad, ortogonal a qué
  mensaje se muestra. Por eso viven en `visibility` y no en el `BarState`.
- **Cero hex sueltos.** Todo color es una variable CSS de `design-tokens.md`, mapeada al
  namespace de Tailwind v4 en `globals.css`.
- **El muro es una interacción real**, no un botón del panel. Es el punto donde el sumidero
  se encuentra con el grifo, y donde se dispara el estado 10.

---

## Documentación

- [`CLAUDE.md`](./CLAUDE.md) — alcance, reglas de código, de craft y de copy
- [`design-tokens.md`](./design-tokens.md) — color, tipografía, espaciado, y la economía
  observada en la app real
- [`estados.md`](./estados.md) — los 10 estados, su copy, su lógica de prioridad y las dos
  correcciones de diseño que surgieron al construir
- `referencias/` — capturas de Idilio TV en producción (iOS) que sustentan el diagnóstico

---

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · deploy en Vercel.
Sin base de datos, sin librería de estado, sin librería de UI, sin dependencias añadidas.
