# diagnostico.md — Idilio TV · Dónde está fallando el metajuego

**Entregable 5.1 del reto.** Qué está fallando hoy, a partir del uso de la app y de la
lectura de los datos. Incluye qué señales pesaron más y qué se descartó.

Fuente: uso directo de la app (iOS, agosto 2026, usuario invitado) + la tabla de señales
del reto. Las capturas que sustentan cada hallazgo están en `referencias/`.

---

## El embudo, en una línea

Las nueve señales del reto no son nueve problemas. Son un embudo con dos fugas y un premio
al final:

```
100%  usuarios activos diarios
 ↓    −81 pts
 19%  reclama la recompensa diaria
 ↓    −13 pts
  6%  alcanza el día 3
 ↓
      quien llega retiene 2.4× a D30
```

Leído así, el diagnóstico se ordena solo:

- El premio existe y está medido: **2.4× de retención D30 en el día 3**. No hay que
  inventar por qué la racha importa. Ya importa.
- La fuga grande no es la racha rota. Es que **81 de cada 100 usuarios activos nunca
  llegan a reclamar**. Se caen antes de empezar.
- La segunda fuga —del 19% al 6%— es la curva y la falta de reloj.

**La señal que más pesó es el par `6% al día 3` + `2.4× D30`.** Ese par dice a la vez dónde
está el valor y qué tan poca gente lo alcanza. Todo lo demás se ordena alrededor.

---

## D1 · El metajuego vive fuera del loop

**Señales:** 19% reclama · 82% nunca abrió Perfil · sesión de 22 min ≈ 14 episodios.

El core loop del producto ocurre en el reproductor. Ahí el usuario pasa sus 22 minutos.
La racha, en cambio, vive **dentro de un modal, dentro de la pestaña Recompensas**, a la que
solo se llega por la tab bar.

El 82% que nunca abrió Perfil no es un problema de Perfil. Es la evidencia de que **las
superficies fuera del reproductor no reciben tráfico**. Si Perfil no se visita, Recompensas
tampoco. El 19% de reclamo no mide desinterés por la moneda: mide cuánta gente navega a una
pestaña lateral.

Y mientras tanto, el reproductor **ya tiene una franja inferior** con el icono de moneda y
el saldo. Está ahí, ocupando píxel, y no dice nada más que un número (`referencias/IMG_9295`).
Es la superficie de mayor tráfico de la app, y hoy es muda.

> El metajuego no falla por diseño de la mecánica. Falla por ubicación.

---

## D2 · La progresión retrocede justo donde el usuario se cae

**Señales:** 6% alcanza el día 3 · curva observada en producción.

La curva de racha, leída en pantalla (`referencias/IMG_9300`):

```
Día 1   +15      ← igual al costo exacto de un episodio
Día 2   +40
Día 3   +60
Día 4   +50      ← RETROCEDE
Día 5   +40      ← RETROCEDE
Día 6   +45
Día 7   +200
```

Dos fallas, no una:

**No es monotónica.** Los días 4 y 5 valen menos que el día 3. El sistema le pide al usuario
su mayor esfuerzo —sostener cuatro y cinco días seguidos— a cambio de su menor recompensa.
Eso no es una curva de progresión; es una curva de castigo. Y se rompe exactamente en el
tramo donde el 94% ya se cayó.

**El día 1 no deja excedente.** 15 monedas = 15 monedas de un episodio. El usuario reclama,
desbloquea, y vuelve a cero. Sin acumulación no hay saldo, sin saldo no hay tensión entre
ahorrar y gastar, y sin esa tensión la moneda no significa nada. Es la razón más simple por
la que la economía no se entiende: **nunca hay economía, hay trueque**.

### El matiz económico que cambia la lectura

El reto describe la moneda como mixta con dos fuentes: compra y racha. En la app hay más.
El anuncio recompensado da **15 monedas con límite de 10 por día** (`referencias/IMG_9297`),
es decir hasta **150 monedas diarias** — casi cuatro veces el mejor día de la racha antes
del día 7.

Consecuencia: **la racha no es, ni de lejos, el grifo principal.** Compite con un grifo mucho
más grande. Corregir la curva pensando en igualarlo sería mover el número equivocado.

El valor de la racha no es económico, es temporal: **el anuncio da moneda hoy; la racha da
una razón para volver mañana.** Es el único mecanismo del sistema que produce un motivo para
la sesión siguiente. Eso es lo que hay que arreglar, y por eso la corrección de la curva
apunta a que la progresión no retroceda, no a que la racha pague más que los anuncios.

---

## D3 · El sistema no tiene reloj

**Señales:** 88% consume como invitado · 54% de sesiones entre 11pm y 2am.

Una racha es una promesa con vencimiento. Idilio no comunica el vencimiento en ninguna
parte: no hay cuenta regresiva, no hay estado "en riesgo", no hay aviso. Cuando el usuario
ya reclamó, el modal muestra un botón desactivado que dice `VUELVE MAÑANA`
(`referencias/IMG_9300`) — que es exactamente la información que no sirve: dice *cuándo*,
no *hasta cuándo*.

Esto se agrava con dos señales que se refuerzan entre sí:

**El 88% es invitado.** Sin cuenta no hay push notification. El recordatorio externo, que es
como todas las apps de racha resuelven esto, **no está disponible para la mayoría de la base**.
El único recordatorio posible es in-app, y la app no lo da.

**El 54% de las sesiones ocurre entre 11pm y 2am.** Si el día de racha corre de medianoche a
medianoche, hay una franja enorme de usuarios cuya racha muere **mientras están usando la
app**. Están viendo Idilio a la 1am y su día ya cambió, sin que nada se los haya dicho.

---

## D4 · El muro llega antes que el entendimiento

**Señales:** sesión de 22 min ≈ 14 episodios · 12 episodios gratis · bloqueo en el 13 de 56.

El muro cae **dentro de la primera sesión**, casi exactamente donde esa sesión termina. En
ese momento el usuario todavía no sabe qué es una moneda, cuánto cuesta un episodio, ni que
existe un camino gratuito.

Y lo que se le ofrece primero, en ese orden (`referencias/IMG_9297`):

1. dos planes de suscripción,
2. tres paquetes de monedas,
3. y al final, en link subrayado pequeño: `¿Más opciones? Ir a Recompensas`.

El camino gratuito —el que conecta con la racha— está al final de un scroll, en la
tipografía más chica de la pantalla. **El primer contacto del usuario con la economía virtual
es una petición de dinero, no una explicación del sistema.**

El objetivo de experiencia del reto —que el usuario comprenda el valor de la moneda, sus
fuentes, sus sumideros y su posición en la progresión— falla precisamente en el momento en
que más importaría: el único momento en que el usuario tiene una razón real para prestar
atención a la economía.

---

## Qué se descartó, y por qué

Tan importante como qué se atacó.

### 23% revé episodios de series ya terminadas — descartada como palanca

Es la señal más tentadora para convertir en mecánica (recompensar el rewatch, coleccionables
por serie completada). Se descarta por dos razones: regalaría moneda por consumo ya
monetizado, lo que choca de frente con la consideración de sostenibilidad del reto; y no
toca ninguna de las dos fugas del embudo.

**Pero se retiene como evidencia de encuadre, y es importante:** si casi un cuarto de la base
vuelve a ver lo que ya vio, el contenido retiene. **Lo que no retiene es el sistema.** Eso
descarta de entrada cualquier diagnóstico centrado en catálogo o en calidad de contenido, y
concentra el problema donde efectivamente está: en el metajuego.

### 12% con cuenta — descartada como intervención de arranque

La lectura fácil es "hay que subir el registro". Se descarta por ahora:

- El reto exige explícitamente que la propuesta funcione para un usuario invitado.
- Pedir cuenta antes de que el usuario entienda el valor agrega fricción en el peor momento
  posible — el mismo momento del muro, que ya está saturado (D4).

La señal no se abandona, se **reubica**: la cuenta se pide cuando el usuario ya tiene una
racha que perder. Ahí el registro deja de ser un peaje y pasa a ser un servicio ("guarda tu
racha"). Es la intervención I5 de la estrategia, y va cuarta a propósito: pedir cuenta para
proteger una racha que el 94% nunca alcanza no tiene sentido.

### 82% nunca abrió Perfil — no se trata como problema de Perfil

No se propone rediseñar Perfil. La señal se usa como **prueba de que el problema es de
ubicación, no de diseño de pantalla**. Lo que cambia es dónde vive la mecánica, no cómo se
ve una sección que nadie visita. Rediseñar Perfil sería optimizar una superficie muerta.

### Stickiness 0.33 — no es una señal diagnosticable

Es el resultado que se quiere mover, no una causa. Se usa como métrica objetivo, no como
insumo del diagnóstico.

---

## Resumen

| # | Falla | Señal principal | Se ataca con |
|---|---|---|---|
| D1 | El metajuego vive fuera del loop | 19% reclama · 82% no abre Perfil | I1 |
| D2 | La progresión retrocede y no acumula | 6% al día 3 · curva observada | I2 |
| D3 | El sistema no tiene reloj | 88% invitado · 54% 11pm–2am | I3 |
| D4 | El muro llega antes que el entendimiento | 14 episodios/sesión vs 12 gratis | I4 |

Las intervenciones, su secuencia y su criterio de priorización están en `estrategia.md`.
