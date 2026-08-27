# CLAUDE.md — POC Idilio TV · Player Identity Card

## Qué es esto

Prototipo interactivo de **una sola funcionalidad**: una capa de identidad y progreso en el
reproductor de una app de microdramas verticales en español. Colapsada es una barra de 56px
con saldo, racha y recompensa; al tocarla se abre en tarjeta con nivel, XP, marco y cuatro
hojas de detalle.

Es un ejercicio de evaluación. No se conecta a nada real.

## Archivos que hay que leer antes de escribir UI

1. `design-tokens.md` — todo color, tipografía, radio y espaciado sale de ahí
2. `design_handoff_player_identity_card/README.md` — el handoff de la tarjeta: pantallas,
   comportamiento, contrato de datos y la paleta `card-`
3. `estados.md` — la máquina de racha que corre debajo: su copy y su lógica de prioridad

**Si un valor no está en `design-tokens.md`, preguntar. No inventar tokens.**

---

## Alcance

### Se construye
- Contenedor mobile 390×844 centrado, con marco de teléfono
- Video simulado (loop corto o gradiente animado en canvas)
- La tarjeta en sus dos alturas: barra colapsada y tarjeta expandida
- Las dos variantes de cuenta: con cuenta e invitado
- Las cuatro hojas (wallet, racha, progreso, marcos) y los dos overlays
- El muro de desbloqueo, donde el sumidero se encuentra con el grifo
- La interacción de reclamo con su animación
- Panel de control de demo para saltar entre días y estados

### No se construye
Login · home · catálogo · reproductor real · pagos · backend · navegación general ·
pantallas de soporte

Si una tarea empieza a expandirse hacia algo de esta lista, parar y avisar.

---

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · deploy en Vercel.
Sin base de datos. Sin librería de estado. Sin librería de UI.

---

## Reglas de código

- **Tokens como CSS variables en `globals.css`** y mapeados en `tailwind.config`.
  Cero hex sueltos en componentes. Cero valores arbitrarios de Tailwind para color.
- **Estado con `useReducer`**, no con varios `useState`. La racha es una máquina de estados
  y se modela como tal. Esto se defiende en entrevista.
- **Persistencia:** `localStorage` opcional para sobrevivir un refresh. Nada más.
- **Componentes chicos**, un archivo por responsabilidad.
- **Sin dependencias nuevas** sin preguntar.

---

## Reglas de craft (esto es el 20% de la nota)

- Escala de espaciado: **4 / 8 / 12 / 16 / 20 / 24 / 32**. Ningún valor fuera de esa lista.
- Margen lateral de pantalla: **16px**.
- Máximo **2 pesos tipográficos** dentro de la barra.
- Área táctil mínima **44×44pt**.
- Contraste **AA sobre fondo negro**. Se verifica, no se asume.
- Altura de la barra: **56px + safe area**, nunca más del 12% de la pantalla.
- **El glow solo va en el estado 2** (recompensa disponible). En ningún otro.
- CTA siempre **pill completo** (`border-radius: 999px`). La app es marcadamente redondeada;
  un borde recto rompe la identidad.
- **Animación con propósito:** reclamo merece un momento; el resto 150–250ms `ease-out`.
  Respetar `prefers-reduced-motion`.
- Antes de dar por cerrado un estado: **quitar un elemento**. Casi siempre sobra algo.

---

## Reglas de copy

- Español neutro LATAM, tú informal, verbo primero.
- El número siempre visible. El usuario nunca pregunta cuánto tiene ni cuánto le falta.
- El nombre de la acción se mantiene en todo el flujo: botón "Reclamar" → resultado
  "Reclamada".
- La racha rota **no regaña** y no muestra lo perdido.
- Los textos exactos están en `estados.md`. No reescribirlos sin avisar.
- Cero lorem ipsum, cero placeholder, cero TODO en lo que se entrega.

---

## Cómo trabajar

Una tarea acotada por vez. Formato preferido:

> Implementá el estado 2 (recompensa disponible) según `estados.md`, usando los tokens de
> `design-tokens.md`. Solo ese estado.

Después de cada estado: mostrar el resultado y esperar revisión antes de seguir.

---

## Contexto del usuario final

Vertical, una mano, **54% de las sesiones entre 11pm y 2am**, mayoría Android de gama de
entrada con conexión inestable. Sesión promedio 22 min ≈ 14 episodios.

Consecuencias: nada pesado, nada que dependa de una animación cara, contraste alto pero sin
brillo agresivo para uso nocturno, y el pulgar llega abajo, no arriba.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
