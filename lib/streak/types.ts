import { FREE_THROUGH, START_EPISODE } from "./economy";

/**
 * Estado del contenido de la barra (qué mensaje gana). 8 y 9 (ocultamiento y
 * reaparición) NO están acá: son una transición de visibilidad ortogonal al
 * contenido, controlada por `StreakState.visibility` — así lo modela
 * estados.md, cuya tabla de prioridad tampoco los incluye.
 * 'loading' antecede a toda prioridad: es el estado antes de resolver
 * localStorage, para no parpadear el estado equivocado.
 */
export type BarState = "loading" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10;

export type Visibility = "visible" | "hidden";

export type StreakState = {
  hydrated: boolean;
  balance: number;
  /** Días consecutivos ya reclamados. 0 = sin racha (nunca reclamó, o rota). */
  streakDay: number;
  claimedToday: boolean;
  streakBroken: boolean;
  /** true durante los ~2s de celebración del día 3, antes de asentarse. */
  celebrating: boolean;
  /** Monedas que faltan para el desbloqueo intentado; null si no aplica. */
  insufficientAttempt: number | null;
  /** Horas restantes para el estado 6; null si no hay advertencia activa. */
  riskWarningHoursLeft: number | null;
  visibility: Visibility;
  /** Episodio que el usuario está viendo o intentando ver. */
  episode: number;
  /** Último episodio desbloqueado. Arranca en los 12 gratis de la app real. */
  unlockedThrough: number;
};

export const initialStreakState: StreakState = {
  hydrated: false,
  balance: 0,
  streakDay: 0,
  claimedToday: false,
  streakBroken: false,
  celebrating: false,
  insufficientAttempt: null,
  riskWarningHoursLeft: null,
  visibility: "visible",
  episode: START_EPISODE,
  unlockedThrough: FREE_THROUGH,
};

export type StreakAction =
  | { type: "HYDRATE"; payload: Partial<StreakState> | null }
  | { type: "CLAIM" }
  | { type: "GRANT_COINS"; amount: number }
  | { type: "ADVANCE_DAY"; broke: boolean }
  | { type: "ENTER_PLAYER" }
  | { type: "HIDE_BAR" }
  | { type: "SHOW_BAR" }
  | { type: "ATTEMPT_UNLOCK"; cost: number }
  | { type: "NEXT_EPISODE" }
  | { type: "DISMISS_UNLOCK" }
  | { type: "CELEBRATION_DONE" }
  | { type: "DEMO_SET"; patch: Partial<StreakState> };
