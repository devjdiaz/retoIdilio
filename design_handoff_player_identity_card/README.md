# Handoff: Idilio — Player Identity Card (reproductor)

## Overview
Nueva capa de identidad y progreso en la parte inferior del reproductor de microdramas de Idilio. Reemplaza el contador de monedas suelto que hoy vive abajo del player por una **Player Identity Card**: avatar con marco, username, nivel, barra de XP, monedas, racha y recompensa diaria con countdown. Objetivo de producto: hacer visible el loop `ver capítulo → XP → nivel → racha → monedas → desbloquear → volver`.

## About the Design Files
El archivo `Idilio Player Identity Card.dc.html` de este bundle es una **referencia de diseño hecha en HTML** (prototipo funcional que muestra look, estados y comportamiento). **No es código de producción para copiar.** La tarea es **recrear este diseño en el codebase real de Idilio** (React Native / Expo, React web o lo que exista) usando sus patrones, su sistema de estilos y sus componentes ya establecidos.

Para verlo: abrir el `.dc.html` en un navegador (necesita `support.js`, incluido, y conexión para la fuente Poppins). El marco de teléfono, el bloque de "Decisión UX", el loop y el contrato de datos son documentación del prototipo — **no forman parte de la feature**. Lo que se implementa es lo que está dentro del teléfono de 390×844.

Los botones "Simular" (Fin de capítulo, Predicción, Subir de nivel, Expandir/colapsar, Reiniciar) y el toggle "Barra ambiente / Panel acoplado" existen solo para demostrar estados; en producción esos estados los disparan eventos reales del player.

## Fidelity
**Hi-fi.** Colores, tipografía, tamaños, radios, animaciones y copy son finales (copy en español, es-CO). Recrear pixel-perfect con las librerías del codebase. Único placeholder: el avatar (círculo con inicial) y el still de video, que en producción son la foto/avatar del usuario y el frame real del video.

---

## Screens / Views

### 1. Player — tarjeta colapsada ("Barra ambiente") — ESTADO POR DEFECTO
**Purpose:** el usuario ve el capítulo; su identidad y progreso quedan legibles en <2 s sin robarle altura a la escena.

**Layout del contenedor (pantalla del teléfono, 390×844):**
- Columna flex, tres bloques: status bar del sistema (52 px, absoluta sobre el video), **video (`flex:1`, `min-height:0`)**, **zona de tarjeta (`flex:0 0 auto`, `padding: 8px 10px 12px`, fondo `#000`)**.
- Regla estructural: la tarjeta **nunca** está en `position:absolute` sobre el video. El video cede altura; la tarjeta es una segunda capa en flujo. En modo colapsado la zona mide 76 px (56 de barra + padding) → video ≈ 766 px.

**Barra colapsada:**
- Alto 56 px, `margin: 0 2px`, `border-radius: 18px`, `padding: 0 14px`, `background: linear-gradient(180deg,#171020,#0d0a12)`, `border: 1px solid rgba(168,85,247,.30)` (hover `rgba(168,85,247,.6)`), `display:flex; align-items:center; gap:12px`, cursor pointer (toda la barra expande).
- **Avatar** 36×36, circular, `padding:2px` sobre `linear-gradient(135deg,#c084fc,#7c2bff)` (el marco), interior `#1b1424` con la inicial en 14 px / 700 / `#c084fc`.
- **Columna central** (`flex:1; min-width:0; gap:4px; white-space:nowrap`):
  - `@juanesp` — 13 px / 700, elipsis si no cabe. Al lado `Nv 5` — 11 px / 700 / `#c084fc`, `nowrap`, `flex:none`.
  - Hilo de XP: track 3 px `rgba(255,255,255,.14)` r2, fill `#d8f24a` al `11%`, `transition: width .9s cubic-bezier(.22,1,.36,1)`.
- **Derecha** (`gap:10px`): moneda 16 px (`radial-gradient(circle at 32% 28%, #ffe89a, #f5c518 55%, #c99406)` + `inset 0 0 0 1.5px rgba(255,255,255,.35)`) + `115` en 13/700 `#f5c518`, `tabular-nums`; llama (Lucide `flame`, relleno `#ff7a29`) 14 px + `7` en 13/700 `#ff7a29`; si hay recompensa, chip 26×26 r9 `#7c2bff` con icono `gift`, animación `idGlow` 2.4 s infinita (`box-shadow: 0 0 0 6px rgba(168,85,247,.22)` en el 50%).

**Overlays del video que conviven con la barra** (todos dentro de la caja de video): chevron atrás 36 px `rgba(20,20,24,.7)` arriba-izquierda; `Capítulo 18 / Mi Mejor Pasajera` (12 px `#c9c9d1` / 19 px 700) abajo-izquierda; rail de like/comentario a la derecha; fila de playback abajo (pause 20 px, track 3 px `rgba(255,255,255,.25)` con fill `#a855f7` 38 %, `01:24 / 03:42` 11 px `#d4d4dc` tabular). Degradado sobre el video: `linear-gradient(180deg, rgba(0,0,0,.55) 0%, transparent 26%, transparent 52%, rgba(0,0,0,.82) 100%)`.

### 2. Player — tarjeta expandida
Se abre al tocar la barra, al pausar, y automáticamente al terminar capítulo. Cierra con el chevron ↑ (28×28, r9, `rgba(255,255,255,.07)`, hover `.14`) o al reanudar.

- Contenedor: `margin:0 2px`, `border-radius:22px`, `padding:16px 16px 14px`, `background: linear-gradient(180deg,#1a1024,#0c0910)`, `border:1px solid rgba(168,85,247,.34)`, `gap:14px`, entrada `idRise .28s ease` (opacity 0→1, translateY 14→0).
- **Fila superior** (`gap:14px`):
  - Avatar 76×76 con `padding:3px` del degradado del marco activo + `box-shadow: 0 0 22px rgba(168,85,247,.35)`; interior con borde 2 px del fondo de la tarjeta; inicial 28 px. Tap → sheet de marcos.
  - Badge de nivel: pastilla centrada bajo el avatar (`bottom:-8px`), min 30×24, r8, fondo `#0c0910`, borde 2 px `#a855f7`, número 13 px / 800.
  - Identidad: `juanesp` 19 px / 700 / `-.01em` + check verificado 15 px `#7c2bff`; debajo `Nivel 5` 13 px `#b9b9c3` con icono `info` 13 px `#8e8e98` (tap → sheet de progreso); debajo barra de XP 7 px r5, track `rgba(255,255,255,.12)`, fill `linear-gradient(90deg,#d8f24a,#a3e635)`, `transition: width 1.1s cubic-bezier(.22,1,.36,1)`, y `2.230 / 19.450 XP` 11 px `#8e8e98` tabular.
- **Divisor** 1 px `rgba(255,255,255,.09)`.
- **Fila de stats**: `display:grid; grid-template-columns: 1fr 1fr 1.35fr; gap:12px`. Columnas 2 y 3 con `border-left:1px solid rgba(255,255,255,.09); padding-left:12px`.
  - Monedas: moneda 20 px + `115` en 20 px / 800 / `#f5c518`; label `Monedas` 11 px `#8e8e98`. Tap → wallet.
  - Racha: llama 18 px + `7` en 20 px / 800 / `#ff7a29`; label `Racha` 11 px, `nowrap`. Tap → detalle de racha.
  - Recompensa: hint alineado a la derecha 11 px `#8e8e98` (`Vence en 2h 59m`, countdown vivo) + botón pill `padding:10px 12px`, `nowrap`, icono `gift` 15 px + `Reclamar +75`, 13 px / 700, fondo y borde `#7c2bff`, texto `#fff`.
- **Pie**: `Marco · Neón Idilio` 12 px `#9a9aa4` a la izquierda, `Ver perfil` 12 px / 600 `#c084fc` a la derecha.

En modo expandido la zona de tarjeta mide ~250 px y el video se reduce a ~540 px (nunca se tapa la fila de playback).

### 3. Variante "Panel acoplado"
Misma tarjeta expandida, permanente (no colapsa). Pensada para landscape ancho y desktop, donde sobra alto. En móvil portrait el default es la barra colapsada.

### 4. Overlay — Fin de capítulo
Reemplaza la tarjeta mientras está visible (la tarjeta se oculta; el overlay ya reimprime nivel y XP). Cubre la caja de video: `linear-gradient(180deg, rgba(8,6,12,.55), rgba(8,6,12,.94) 45%)` + `backdrop-filter: blur(2px)`, contenido anclado abajo, `padding:24px 22px 26px`, `gap:16px`, entrada `idRise .34s`.
- Kicker `EPISODIO COMPLETADO` 11 px / 700 / `.2em` / uppercase / `#a855f7`.
- Tres tiles iguales (r14, `padding:12px 14px`): `+25 XP` (`rgba(168,85,247,.12)` / borde `rgba(168,85,247,.34)` / número `#d8f24a`), `+10 Monedas` (`rgba(245,197,24,.10)` / `.30` / `#f5c518`), `7 Racha mantenida` (`rgba(255,122,41,.10)` / `.30` / `#ff7a29`). Números 22 px / 800, labels 11 px `#b9b9c3`.
- Fila `Nivel 5` / `2.255 / 19.450 XP` (12 px `#c9c9d1`) + barra 8 px r6 que **anima 260 ms después de abrir** (el XP se suma con delay para que la barra se vea crecer).
- Acciones: `Siguiente capítulo` pill `#7c2bff` (hover `#8f47ff`) 15 px / 700 `flex:1`; `Predecir` pill outline `rgba(255,255,255,.24)` (hover borde `#a855f7`).

### 5. Overlay — Predicción narrativa
Mismo tratamiento, `idRise .3s`. Kicker `PREDICE LO QUE PASARÁ`, pregunta `¿Qué hará Valentina?` 20 px / 700, tres opciones (r14, `padding:14px 16px`, borde `rgba(255,255,255,.14)`, fondo `rgba(255,255,255,.05)`; seleccionada borde `#a855f7` y fondo `rgba(168,85,247,.16)`) con chip de letra 24×24 r7 `rgba(255,255,255,.10)`. Nota inferior 12 px `#8e8e98`: `Acertar da +20 XP y +10 monedas.` → tras responder `Ya respondiste este capítulo.`
Acierto (B) = `+20 XP` y `+10` monedas + toast `¡Acertaste! +20 XP · +10`. Fallo = `+5 XP` + toast `Fallaste · +5 XP`.

### 6. Bottom sheets (4)
Fondo `rgba(4,3,6,.62)`; panel `#120d19`, `border-radius:26px 26px 0 0`, borde superior `1px rgba(168,85,247,.4)`, `padding:20px 20px 28px`, `gap:16px`, entrada `idSheet .26s cubic-bezier(.22,1,.36,1)` (translateY 100%→0); handle 44×4 r3 `rgba(255,255,255,.2)`. Kicker 11 px `#a855f7` + título 22 px / 700. Filas: `padding:13px 14px`, r14, `rgba(255,255,255,.05)`, borde `rgba(255,255,255,.07)`, label 14 px `#e5e5ea`, valor 14 px / 700. CTA pill `#7c2bff` full width.

| Sheet | Trigger | Kicker / título | Filas |
|---|---|---|---|
| Wallet | monedas | `WALLET` / `115 monedas` | Recompensa diaria disponible +75 · Por capítulo completado +10 · Predicción acertada +20 · Costo de un capítulo 15 |
| Racha | racha | `RACHA` / `7 días siguiendo historias` | Última actividad: Capítulo 18 · Cuenta ver un capítulo, no abrir la app: Hoy ✓ · Día 30 desbloquea: Marco Racha 30 |
| Progreso | nivel / "Ver perfil" | `PROGRESO` / `Nivel 5` | XP actual 2.230 / 19.450 · Valentina 82% · La Herencia 44% · El Último 18% |
| Marcos | avatar | `MARCO ACTUAL · Neón Idilio` / `Cambiar marco` | grid de 6 swatches 52 px con nombre 9 px (activo `#c084fc`, resto `#8e8e98`) |

### 7. Toast de feedback
Pill centrada 70 px sobre el borde inferior del video: `rgba(12,10,16,.86)`, borde `rgba(168,85,247,.5)`, texto 14 px / 700 `#d8f24a`, animación `idFloat 1.6s` (sube 34 px y se desvanece), se limpia a los 1600 ms. Usada en reclamar (`+75 monedas`), acierto/fallo de predicción y subida de nivel (`Nivel 6 · +50`).

---

## Interactions & Behavior
1. Tap avatar → sheet de marcos. 2. Tap nivel / "Ver perfil" → sheet de progreso. 3. Tap monedas → wallet. 4. Tap racha → detalle. 5. Tap recompensa → reclamar (+75, estado `claimed`, toast). 6. Tap barra → expandir; chevron → colapsar. 7. Fin de capítulo → overlay con XP animado. 8. Predicción → +XP/+monedas según acierto. 9. Level-up → XP llena, luego `level+1`, XP residual, +50 monedas y toast.
- **Regla dura:** mientras un overlay (fin de capítulo / predicción) está arriba, la tarjeta y la barra se ocultan — nunca compiten por los mismos píxeles.
- **Regla dura:** la tarjeta no se superpone al video ni a los controles de playback en ningún estado.
- Countdown de la recompensa: `setInterval` de 1 s mientras el estado sea `available` (arranca en 10.800 s = 3 h), formato `Vence en {h}h {mm}m`; al reclamar pasa a `Próxima: +100`.
- Estados de recompensa: `available` (pill violeta), `claimed` (`Reclamada`, fondo `rgba(255,255,255,.06)`, borde `rgba(255,255,255,.14)`, texto `#8e8e98`). Falta por definir con producto: `next` con countdown a la siguiente.
- Responsive: portrait = barra colapsada; landscape/desktop = panel acoplado, la fila de stats puede pasar a una sola línea horizontal con el avatar a la izquierda.
- Accesibilidad: hit targets ≥44 px (la barra de 56 px cumple; el chevron de colapsar debe ampliarse a 44 con área táctil transparente en producción).

## State Management
```
mode: 'rail' | 'dock'        // presentación (device/orientación)
expanded: boolean            // tarjeta abierta
overlay: null | 'end' | 'pred'
sheet: null | 'coins' | 'streak' | 'level' | 'frames'
xp, level, coins, streak
reward: 'available' | 'claimed'
secs: number                 // countdown
frame: index                 // marco activo
picked: 'A' | 'B' | 'C' | null
toast: string | null
```
Transiciones: `episodeEnd()` → `overlay:'end'`, `expanded:true`, y a los 260 ms `xp+25, coins+10`. `claim()` → `coins+75`, `reward:'claimed'`, toast. `levelUp()` → xp al tope, a los 1200 ms `level+1`, `xp:340`, `coins+50`, toast.
Data fetching: perfil + wallet + racha + recompensa al montar el player; mutaciones al completar capítulo, al reclamar y al responder predicción (idealmente optimistas, con la animación local ya corriendo).

## Contrato de datos (no hardcodear nada en la UI)
```ts
{
  username, avatar, avatarFrame,
  level, currentXP, nextLevelXP,
  coins,
  streak: { days, lastEpisode },
  reward: { state, amount, expiresAt },
  stories: [{ id, title, progress }]
}
```
Componentes conceptuales: `<PlayerIdentityCard>` (contenedor y estado de expansión) → `<AvatarFrame>` + `<ProfileAvatar>`, `<UserLevel>`, `<XPProgress>`, `<CoinBalance>`, `<StreakCounter>`, `<RewardClaim>`, `<StoryProgress>`. Callbacks expuestos: `onClaim`, `onOpenWallet`, `onOpenStreak`, `onOpenProfile`, `onChangeFrame`, `onToggleExpanded`.

## Design Tokens
**Color** — fondo app `#0a0a0c`; superficie tarjeta `linear-gradient(180deg,#1a1024,#0c0910)`; barra `linear-gradient(180deg,#171020,#0d0a12)`; sheet `#120d19`; avatar interior `#1b1424`.
Violeta primario `#7c2bff` (hover `#8f47ff`), violeta claro `#a855f7`, lila texto `#c084fc`.
XP lima `#d8f24a` → `#a3e635`. Moneda `#f5c518` (degradado `#ffe89a`/`#f5c518`/`#c99406`). Racha `#ff7a29`.
Texto: `#ffffff`, `#e5e5ea`, `#c9c9d1`, `#b9b9c3`, `#9a9aa4`, `#8e8e98`, `#6f6f7a`.
Bordes: `rgba(168,85,247,.30/.34/.4)`, `rgba(255,255,255,.07/.09/.14/.24)`.
**Radios** — 999 (pills), 26 (sheet), 22 (tarjeta), 18 (barra), 14 (tiles/filas), 9 (chips), 8 (badge nivel).
**Tipografía** — Poppins 400/500/600/700/800. Escala: 22/20/19/15/14/13/12/11/9. Kickers 11 px, `letter-spacing .18–.2em`, uppercase. Números siempre `font-variant-numeric: tabular-nums`.
**Espaciado** — 2, 4, 6, 8, 10, 12, 14, 16, 20, 22, 24, 26.
**Sombras/glow** — avatar `0 0 22px rgba(168,85,247,.35)`; regalo pendiente `0 0 0 6px rgba(168,85,247,.22)` pulsando.
**Easing** — barras `cubic-bezier(.22,1,.36,1)` (.9–1.1 s); overlays `ease` .28–.34 s; sheet .26 s.

## Assets
- Marco del avatar, monedas, llama, regalo, check: dibujados en CSS/SVG en el prototipo. En producción usar los assets de Idilio ya existentes (la moneda dorada de la app) e iconos Lucide (`flame`, `gift`, `info`, `chevron-up`, `chevron-left`).
- Avatar: placeholder con inicial. Sustituir por foto / avatar / personaje del usuario.
- Still de video: `uploads/IMG_9295.PNG`, captura del propio player de Idilio, solo para ambientar el prototipo. **No usar en producción.**
- Los 6 marcos son degradados: Básico `#4b4b55→#2a2a31`, Neón Idilio `#c084fc→#7c2bff`, Racha 30 `#ffb347→#ff5f29`, Estreno `#f5c518→#c99406`, Valentina `#ff6f91→#a1207d`, Detective `#7dd3fc→#1e40af`.

## Files
- `Idilio Player Identity Card.dc.html` — prototipo (marcado + clase de lógica con todos los estados y handlers).
- `support.js` — runtime necesario para abrir el prototipo en el navegador.
