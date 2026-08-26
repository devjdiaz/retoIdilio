import { nextClaimDay, rewardForDay } from "./curve";
import type { StreakAction, StreakState } from "./types";

export function streakReducer(
  state: StreakState,
  action: StreakAction
): StreakState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...(action.payload ?? {}), hydrated: true };

    // Fuentes que introduce la Player Identity Card: completar capítulo y
    // acertar una predicción. Son moneda nueva y hay que declararlo — el reto
    // exige equilibrar toda fuente nueva contra la conversión a pagador.
    case "GRANT_COINS":
      return { ...state, balance: state.balance + action.amount };

    case "CLAIM": {
      const day = nextClaimDay(state.streakDay, state.streakBroken);
      return {
        ...state,
        balance: state.balance + rewardForDay(day),
        streakDay: day,
        claimedToday: true,
        streakBroken: false,
        // Día 3 es el único hito con evidencia dura (estados.md) — merece
        // el momento de celebración antes de asentarse en el mensaje fijo.
        celebrating: day === 3,
        insufficientAttempt: null,
      };
    }

    case "ADVANCE_DAY":
      return {
        ...state,
        claimedToday: false,
        celebrating: false,
        insufficientAttempt: null,
        riskWarningHoursLeft: null,
        ...(action.broke
          ? { streakBroken: true, streakDay: 0 }
          : null),
      };

    case "CELEBRATION_DONE":
      return { ...state, celebrating: false };

    // El sumidero. Si alcanza, se cobra y el episodio queda desbloqueado; si
    // no, la barra pasa al estado 10 y conecta el sumidero con el grifo en el
    // punto exacto de fricción, en vez de ofrecer solo pagar.
    case "ATTEMPT_UNLOCK":
      return state.balance >= action.cost
        ? {
            ...state,
            balance: state.balance - action.cost,
            unlockedThrough: Math.max(state.unlockedThrough, state.episode),
            insufficientAttempt: null,
          }
        : { ...state, insufficientAttempt: action.cost - state.balance };

    // Estado 9 de estados.md: la transición entre episodios es el momento de
    // decisión (seguir, salir, desbloquear), así que la barra reaparece —
    // aunque el usuario la hubiera ocultado durante el episodio anterior.
    case "NEXT_EPISODE":
      return {
        ...state,
        episode: state.episode + 1,
        insufficientAttempt: null,
        visibility: "visible",
      };

    case "DISMISS_UNLOCK":
      return { ...state, insufficientAttempt: null };

    case "HIDE_BAR":
      return { ...state, visibility: "hidden" };

    case "SHOW_BAR":
    case "ENTER_PLAYER":
      return { ...state, visibility: "visible" };

    case "DEMO_SET":
      return { ...state, ...action.patch };

    default:
      return state;
  }
}
