# Idilio TV — Player Identity Card

POC de la intervención elegida para el reto de diseño de Product Designer (UX/UI) de
Idilio TV: una **capa de identidad y progreso en el reproductor** que reemplaza el contador
de monedas suelto. Colapsada es una barra de 56px con saldo, racha y recompensa; al tocarla
se abre en tarjeta con nivel, XP, marco y las cuatro hojas de detalle.

La tesis: nadie entra al perfil. El perfil sale a buscarlos.

**POC en vivo:** https://idilio-poc.vercel.app

---

## Los cuatro entregables del reto

| # | Entregable | Dónde está |
|---|---|---|
| 5.1 | Diagnóstico | [`diagnostico.md`](./diagnostico.md) |
| 5.2 | Estrategia | [`estrategia.md`](./estrategia.md) |
| 5.3 | Intervención en profundidad | [`design/`](./design/) · [`design_handoff_player_identity_card/`](./design_handoff_player_identity_card/) · [`design-tokens.md`](./design-tokens.md) |
| 5.4 | POC funcional | Este repositorio · [demo](https://idilio-poc.vercel.app) |

La **página de entrega** reúne los cuatro en un solo link. Su fuente está en
[`entrega/`](./entrega/); las páginas publicadas viven en claude.ai.

Para el 5.3 el reto sugiere Figma. El diseño se hizo en **pen.dev**: el archivo está en
[`design/idilio-player-identity-card.pen`](./design/) y sus exportaciones en
[`design/export/`](./design/export/). Son **14 artboards** del modelo actual —la barra
colapsada, la tarjeta expandida, las cuatro hojas, los dos overlays, el muro y el flujo—
con los tokens cargados como variables del documento.

Hubo una vía anterior —un plugin que generaba el archivo nativo de Figma desde la Plugin
API, porque la REST es de solo lectura para contenido— que se descartó al quedar Figma
fuera. No sobrevive en el repositorio.

### Una versión anterior, y por qué sigue documentada

La primera intervención fue una **barra de racha de diez estados**. La tarjeta la contiene:
la barra colapsada es ese mismo objeto, y la máquina de racha que decide si hay algo que
reclamar sigue corriendo debajo. Por eso [`estados.md`](./estados.md) sigue en el
repositorio —la lógica de prioridad y la corrección de la curva vienen de ahí— y el
[canvas de 16 artboards](./entrega/canvas/) queda como registro de esa primera versión. No
es un entregable: la página de entrega no lo enlaza.

---

## Qué probar en el POC

1. Arranca en el **episodio 13 — el muro**, con saldo 0. Es donde el usuario real llega en su
   primera noche: 14 episodios por sesión, 12 gratis.
2. **Desbloquear** sin saldo → el saldo se pone en rojo y la tarjeta ofrece la salida
   gratuita en vez de mandar a la tienda.
3. **Reclamar +20** → el botón confirma «Reclamada», el saldo sube y el desbloqueo procede.
   El monto lo pone la curva corregida, no un número fijo.
4. **Tocar el video** expande y colapsa la tarjeta. Es el gesto real de un reproductor, no
   un atajo de demo. En el muro se desactiva a propósito.
5. **Tocar monedas, racha, nivel o avatar** abre las cuatro hojas: wallet, racha, progreso
   y marcos. En el wallet, el camino gratuito y los paquetes pagos están en la misma vista.
6. **Invitado / Con cuenta** en el panel: sin cuenta no hay nivel, XP ni marco, y el pie
   invita a crearla. El 88% de Idilio consume como invitado.
7. **Fin de capítulo** y **Predicción** son los overlays. Mientras uno está arriba la
   tarjeta se colapsa — nunca compiten por los mismos píxeles.
8. **Día siguiente → Reclamar** para avanzar la racha; **Faltar un día** para ver que no
   regaña.

El panel de la derecha está etiquetado como herramienta de evaluación y no es parte de la
tarjeta. Sin él, una racha de siete días es imposible de evaluar en una sesión de revisión.

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
lib/streak/     La economía: racha, saldo y qué se puede reclamar
  types.ts      Estado, acciones y estado inicial
  reducer.ts    Las transiciones. La racha es una máquina de estados
  select.ts     Pila de prioridad: qué estado gana cuando varios aplican
  copy.ts       Microcopy, derivado de la tabla de estados.md
  curve.ts      Curva actual vs. propuesta
  economy.ts    Constantes observadas en la app real
  persist.ts    localStorage, solo para sobrevivir un refresh

lib/player/     La tarjeta: identidad, nivel, XP y presentación
  types.ts      Estado, acciones y estado inicial
  reducer.ts    Expansión, hojas, overlays, XP y level-up

components/
  DemoStage       Dueño de los dos estados; monta el teléfono y el panel
  Scene           Video + chrome del reproductor + muro + zona de tarjeta
  PlayerCard/     La tarjeta: barra colapsada, expandida, hojas, overlays
  Player/         Contexto de episodio y el muro de desbloqueo
  DemoPanel/      Herramienta de evaluación
```

**Decisiones que se defienden en la sesión:**

- **`useReducer`, no varios `useState`.** Tanto la racha como la tarjeta son máquinas de
  estados y se modelan como tal. La pila de prioridad vive en una función pura
  (`select.ts`) separada de las transiciones (`reducer.ts`).
- **Dos reducers, no uno.** La economía (`lib/streak`) y la presentación (`lib/player`) son
  ortogonales: cuánto saldo hay no depende de si la tarjeta está abierta. El saldo tiene
  un solo dueño —`lib/streak`— y la tarjeta lo lee.
- **Los reducers no saben de temporizadores.** Las secuencias con tiempo del handoff —el XP
  que se suma 260ms después de abrir el overlay, el level-up que llena la barra antes de
  cambiar el número— se parten en dos acciones. El reducer sigue siendo puro.
- **La tarjeta va en flujo, no absoluta sobre el video.** La pantalla es una columna de dos
  bloques y el video cede la altura que la tarjeta necesita. Por eso los controles de
  playback nunca quedan tapados.
- **Cero hex sueltos.** Todo color es una variable CSS, mapeada al namespace de Tailwind v4
  en `globals.css`. La paleta del handoff va bajo el prefijo `card-`.
- **El muro es una interacción real**, no un botón del panel. Es el punto donde el sumidero
  se encuentra con el grifo.

---

## Documentación

- [`CLAUDE.md`](./CLAUDE.md) — alcance, reglas de código, de craft y de copy
- [`design_handoff_player_identity_card/README.md`](./design_handoff_player_identity_card/) —
  el handoff de la tarjeta: pantallas, comportamiento, contrato de datos y tokens
- [`design-tokens.md`](./design-tokens.md) — color, tipografía, espaciado, y la economía
  observada en la app real
- [`estados.md`](./estados.md) — la máquina de racha que corre debajo: los estados, su copy,
  su lógica de prioridad y las dos correcciones de diseño que surgieron al construir
- `referencias/` — capturas de Idilio TV en producción (iOS) que sustentan el diagnóstico

---

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · deploy en Vercel.
Sin base de datos, sin librería de estado, sin librería de UI, sin dependencias añadidas.
