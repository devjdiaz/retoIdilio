# estrategia.md — Idilio TV · Intervenciones, secuencia y prioridad

**Entregable 5.2 del reto.** El conjunto de intervenciones que aborda el diagnóstico, con
hipótesis, métrica y criterio de priorización. Este entregable se evalúa a nivel de
razonamiento; no requiere diseño.

Diagnóstico de origen: `diagnostico.md` (D1–D4).

---

## Criterio de priorización

Dos filtros y tres ejes. Los filtros son binarios: si una intervención no los pasa, no entra
al backlog, sin importar qué tan buena parezca.

**Filtros (del apartado 4 del reto):**

| Filtro | Origen |
|---|---|
| ¿Funciona para un usuario invitado? | "La propuesta debe funcionar para un usuario invitado" |
| ¿Sostiene la economía y la conversión a pagador? | "Cualquier fuente nueva de moneda debe equilibrarse…" |

**Ejes de orden:**

1. **Apalancamiento sobre el embudo** — ¿ataca la fuga más grande? (81% no reclama > 13% se
   cae del 19% al 6%)
2. **Carga para el usuario** — el reto pide integrar el metajuego "con la menor carga
   posible". Una intervención que agrega una pantalla, un paso o una decisión pierde contra
   una que no agrega nada.
3. **Viabilidad en un trimestre** — el reto pide señalar explícitamente lo atractivo pero
   difícil de construir.

Cuando dos intervenciones empatan, gana la que **corrige algo existente** sobre la que
**construye algo nuevo**. Corregir es más barato, más rápido y más fácil de atribuir.

---

## Las intervenciones

### I1 · Barra de racha persistente ★ elegida para profundidad

**Ataca:** D1 (el metajuego vive fuera del loop).

**Hipótesis.** Si el estado de la racha y la acción de reclamo viven en el reproductor —la
única superficie que el usuario efectivamente visita— el reclamo deja de depender de que
navegue a una pestaña lateral, y el 19% sube.

**Qué se espera que mueva.** % de DAU que reclama la recompensa diaria: **19% → 45%**.
Por arrastre, el % que alcanza el día 3.

**Cómo se sabría si funcionó.**
- Primaria: reclamos / DAU semanal.
- Atribución: reclamos originados en la barra vs. en el modal de Recompensas.
- Guardarraíl: watch-time por sesión y episodios por sesión no deben bajar. Si la barra
  distrae del consumo, el remedio es peor que la enfermedad.

**Esfuerzo:** bajo. **No se crea una superficie: se activa una que ya existe** y hoy solo
muestra un número mudo.

**Riesgo y mitigación.** Ocupar píxel permanente sobre video vertical a pantalla completa
contradice el producto. Se mitiga con los estados 8 y 9: la barra se oculta con los controles
del reproductor y reaparece en el momento de decisión (fin de episodio, pausa, salida).

---

### I2 · Corrección de la curva de racha

**Ataca:** D2 (la progresión retrocede y no acumula).

**Hipótesis.** Una curva que nunca retrocede y que deja excedente el primer día crea
acumulación de saldo; la acumulación crea la tensión ahorro/gasto que hoy no existe, y esa
tensión es lo que convierte la moneda en algo que el usuario entiende y quiere.

```
actual      +15  +40  +60  +50↓ +40↓ +45  +200      total ~450
propuesta   +20  +35  +60  +75  +90  +110 +250      total ~640
```

- **Día 1 sube de 15 a 20** para que sobre saldo después de desbloquear un episodio.
- **Nunca retrocede.** Es la condición mínima de un sistema de progresión.
- **Día 3 mantiene 60**, el salto perceptible al único umbral con evidencia dura.

**Qué se espera que mueva.** % que alcanza el día 3: **6% → 15%**. Días activos por semana:
**2.3 → 2.8**.

**Cómo se sabría.** Distribución de días de racha alcanzados (no el promedio: la mediana y
el percentil del día 3 y del día 7). Del lado económico: conversión a pagador y ARPPU como
guardarraíles duros.

**Tradeoff declarado.** Es **+42% de moneda regalada** por usuario que complete la semana. Se
declara, no se esconde. Se compensa con volumen de desbloqueos y se acota con techo diario.
El techo exacto es decisión de negocio con datos de ARPU reales, no una decisión de diseño.
Contexto que lo hace menos grave de lo que parece: el grifo de anuncios ya entrega hasta
150 monedas diarias (D2), así que la racha corregida sigue siendo la fuente menor.

**Esfuerzo:** mínimo. Es una tabla de valores. Es la mejor relación apalancamiento/costo de
todo el conjunto.

> **I2 no va después de I1: va en el mismo release.** La barra promete "Mañana +35" y esa
> promesa tiene que ser verdadera. Enviar I1 sobre la curva actual haría que la barra
> comunique con más claridad un sistema que castiga — empeoraría el problema al hacerlo
> visible. Se envían juntas o no se envían.

---

### I3 · Reloj de racha

**Ataca:** D3 (el sistema no tiene reloj).

**Hipótesis.** Una racha sin vencimiento visible no genera retorno. Como el 88% es invitado y
no puede recibir push, el recordatorio tiene que ser in-app y anticipado.

**Dos piezas:**

1. **Estado "en riesgo"** en la barra (estado 6): `Tu racha termina en 3h` + reclamo directo.
   Solo aparece con racha ≥ 2 — a un usuario sin racha no se le puede generar urgencia sobre
   algo que no tiene.
2. **El día de racha corre de 4am a 4am, no de medianoche a medianoche.** Con el 54% de las
   sesiones entre 11pm y 2am, el corte a medianoche mata rachas de gente que está usando la
   app en ese preciso momento. Cambiar la ventana es puro backend, cero UI, y probablemente
   la corrección de mejor relación impacto/costo de toda la estrategia.

**Qué se espera que mueva.** Rachas rotas evitadas; reclamos dentro de la ventana de riesgo.

**Cómo se sabría.** Tasa de ruptura de racha por franja horaria, antes y después. La pieza 2
se valida sola: si el corte a medianoche estaba matando rachas, la distribución horaria de
rupturas lo muestra concentrado justo después de las 12.

**Esfuerzo:** bajo-medio. El estado 6 ya está diseñado y construido en el POC; lo que falta
es la lógica real de zona horaria y disparo.

---

### I4 · Primer contacto con la economía en el muro

**Ataca:** D4 (el muro llega antes que el entendimiento).

**Hipótesis.** El muro es el único momento en que el usuario tiene una razón real para
prestar atención a la economía. Si en ese momento ve su saldo, el costo del episodio y el
camino gratuito sin scrollear, el muro pasa de ser el momento de venta a ser el momento de
enseñanza — y la venta no baja, porque quien iba a pagar sigue teniendo el botón intacto.

El estado 10 de la barra ya es la mitad de esto: conecta el sumidero (desbloqueo) con el
grifo (racha) en el punto exacto de fricción, con el número de lo que falta siempre visible.
La otra mitad es reordenar el paywall.

**Qué se espera que mueva.** Comprensión de la economía, medida por conducta: % que reclama
la recompensa dentro de los 5 minutos posteriores a chocar con el muro.

**Cómo se sabría.** A/B obligatorio. Guardarraíl duro: conversión a pagador y ARPPU no bajan.

**Esfuerzo:** medio. **Riesgo:** el más alto del conjunto — toca superficie de ingresos
directos. Por eso va en T2 y por experimento, nunca por cambio directo.

---

### I5 · La cuenta como protección de la racha

**Ataca:** la señal del 12%, reubicada (ver `diagnostico.md` → "Qué se descartó").

**Hipótesis.** Pedir cuenta cuando el usuario ya tiene día 3 —cuando por primera vez hay algo
que perder— convierte el registro en un servicio ("guarda tu racha") en lugar de un peaje.
Y habilita push, que a su vez extiende I3 fuera de la app.

**Qué se espera que mueva.** Cuentas creadas: 12% → 25%. Habilita el canal de retorno para la
base que hoy no lo tiene.

**Cómo se sabría.** Tasa de registro en el prompt del día 3 vs. la tasa base actual; opt-in
de notificaciones entre los registrados nuevos.

**Esfuerzo:** medio. **Va cuarta por dependencia, no por importancia:** pedir cuenta para
proteger una racha que el 94% nunca alcanza no tiene sentido. Requiere que I1+I2+I3 hayan
hecho el día 3 alcanzable primero.

---

### I6 · Progresión por serie / colección — señalada y descartada para este trimestre

El reto pide señalar lo atractivo pero difícil. Esto lo es.

Un sistema de progresión por serie (completar series, colección, badges) es la respuesta
gamificada más obvia y probablemente la más vistosa. Se descarta para este trimestre:

- Es **sistema nuevo**, no corrección. Rompe el criterio de desempate.
- No ataca la fuga del 81%. Un usuario que no reclama la recompensa diaria tampoco va a
  perseguir una colección.
- Requiere modelo de datos de progreso por serie, arte por serie y una superficie propia.
  No cabe en un trimestre junto con el resto.

Se deja en backlog explícito para cuando el embudo esté corregido y haya base retenida a la
que valga la pena darle profundidad.

---

## Secuencia

```
T1 · release 1     I1 + I2        juntas, obligatoriamente
                   ├─ Barra de racha persistente
                   └─ Corrección de la curva

T1 · release 2     I3             una vez que hay rachas vivas que salvar
                   ├─ Estado en riesgo
                   └─ Ventana 4am–4am

T2                 I4             con A/B, guardarraíl de ingresos
                   I5             detrás de I4, depende de que el día 3 sea alcanzable

Backlog            I6             señalada, fuera de alcance trimestral
```

**Por qué este orden.** T1 corrige el embudo en su punto más ancho al menor costo y sin
tocar superficie de ingresos. T2 entra a lo que sí toca ingresos, ya con datos de T1 para
sustentar el experimento. I6 espera a que haya a quién darle profundidad.

---

## Árbol de métricas

```
NORTH STAR      Stickiness DAU/MAU          0.33  →  0.40
                                                │
        ┌───────────────────────────────────────┼───────────────────────────┐
        │                                       │                           │
  % DAU que reclama              % que alcanza día 3            Días activos/semana
     19% → 45%                        6% → 15%                     2.3 → 2.8
        │                                       │                           │
       I1                                   I2 · I3                   I1 · I2 · I3

GUARDARRAÍLES (ninguno debe empeorar)
  Watch-time por sesión · Episodios por sesión · Conversión a pagador
  ARPPU · Monedas regaladas por DAU (con techo)
```

---

## Por qué I1 es la intervención que se lleva a profundidad

El reto evalúa la elección y su justificación. Cinco razones, en orden de peso:

**1. Ataca la fuga más grande.** 81 puntos de caída entre "usuario activo" y "reclama",
contra 13 puntos en el tramo siguiente. Empezar por el otro lado sería optimizar el paso al
que casi nadie llega.

**2. Funciona para invitado sin pedir nada.** Cumple el filtro no negociable del reto sin
condiciones, sin registro y sin permisos.

**3. Es la de menor carga.** No agrega pantalla, ni paso, ni decisión, ni notificación. El
metajuego se integra al core loop apareciendo *dentro* de él. Es la lectura más literal
posible de "con la menor carga posible para el usuario".

**4. Es la más viable.** La superficie ya existe en producción y hoy está muda. No hay que
convencer a nadie de ceder píxel: el píxel ya está cedido, mal usado.

**5. Es la única que además cumple el objetivo de experiencia completo.** En 56 píxeles, sin
abrir una pantalla explicativa, la barra comunica las cuatro cosas que el reto pide que el
usuario entienda:

| Lo que el reto pide que se comprenda | Dónde lo resuelve la barra |
|---|---|
| El valor de la moneda | El saldo, siempre visible, en `--coin` |
| Las fuentes por las que la obtiene | El reclamo diario, ahí mismo, a un toque |
| Los sumideros en los que la gasta | Estado 10: `Te faltan 15` en el momento del muro |
| Su posición en la progresión | `Día 2 · Mañana +60` + indicador de tres segmentos |

Un sistema de progresión rara vez se resuelve con una sola pantalla, y ésta no pretende
resolverlo. Pretende ser **la capa que hace visible el sistema entero desde donde el usuario
ya está mirando** — y por eso es por donde se empieza.

El diseño y el POC de esta intervención están en `estados.md` y en el prototipo.
