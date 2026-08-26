import type { BarState, StreakState } from "./types";

/**
 * Un estado a la vez, el más urgente (estados.md → "Estados y prioridad"):
 * loading › 10 · 6 · 2 · 7 · 5 · 3/4 · 1
 *
 * 8 y 9 no aparecen: son visibilidad, no contenido (ver types.ts).
 * En el flujo normal las condiciones no se solapan (streak viva vs. rota son
 * ramas alternas del flowchart de estados.md), pero 6 y 10 son disparadores
 * transitorios (tiempo, intento de desbloqueo) que sí pueden coincidir con
 * cualquier otro estado — por eso el orden de chequeo importa y se preserva
 * literal, no se infiere de "cuál condición es más específica".
 */
export function selectBarState(state: StreakState): BarState {
  if (!state.hydrated) return "loading";
  if (state.insufficientAttempt !== null) return 10;

  // Restricción de estados.md: la advertencia de riesgo solo aplica con
  // racha ≥2. A un usuario sin racha no se le puede generar urgencia sobre
  // algo que no tiene.
  if (
    state.streakDay >= 2 &&
    !state.claimedToday &&
    !state.streakBroken &&
    state.riskWarningHoursLeft !== null
  ) {
    return 6;
  }

  // Si hay algo que reclamar hoy, gana el estado 2 — incluido el usuario de
  // primera sesión (streakDay 0), que reclama el día 1 de la curva.
  //
  // Antes esta condición exigía `streakDay >= 1`, y eso producía una
  // contradicción: en la barra el recién llegado leía "Vuelve mañana y gana
  // monedas" (sin acción), pero al chocar con el muro el estado 10 le
  // ofrecía "Reclama +20 hoy" con botón. O el día 1 se reclama en la primera
  // sesión o no se reclama. Se resolvió a favor de que sí, que es lo que
  // hace la app real (el modal de racha muestra el día 1 ya reclamado) y lo
  // que exige el diagnóstico: el reclamo a un toque, sin esperar un día.
  if (!state.claimedToday && !state.streakBroken) {
    return 2;
  }

  if (state.streakBroken) return 7;

  if (state.claimedToday) {
    // Ya reclamó y no hay racha que reportar. Va antes que 3/4/5 porque si
    // no cae en el 4 y produce un "Día 0 · Mañana +20" que no significa nada.
    if (state.streakDay === 0) return 1;
    if (state.streakDay === 3) return 5;
    if (state.streakDay === 1) return 3;
    // Días 2, y 4+ (fuera del alcance explícito de estados.md): mismo
    // patrón que el día 2, es la extensión mínima defendible.
    return 4;
  }

  // Fallback: ya reclamó y no hay racha que reportar. Con la corrección de
  // arriba deja de ocurrir en el flujo normal (reclamar siempre deja
  // streakDay ≥ 1); se conserva como default seguro y sigue siendo
  // inspeccionable desde el panel de demo.
  return 1;
}
