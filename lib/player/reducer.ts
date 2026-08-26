import {
  XP_PER_LEVEL,
  type PlayerAction,
  type PlayerState,
} from "./types";

/**
 * Reducer de la tarjeta. Mismo criterio que `lib/streak/reducer.ts`: una
 * máquina de estados se lee mejor en un reducer que repartida en banderas.
 *
 * Las secuencias con tiempo del handoff —el XP que se suma 260 ms después de
 * abrir el overlay, el level-up que llena la barra y recién a los 1200 ms
 * cambia el número— se parten en dos acciones cada una. El reducer no sabe
 * de temporizadores; los dispara quien los necesita. Así sigue siendo puro y
 * se puede razonar sobre él sin simular el reloj.
 */
export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "TOGGLE_EXPANDED":
      return { ...state, expanded: !state.expanded };

    case "SET_EXPANDED":
      return { ...state, expanded: action.value };

    case "OPEN_SHEET":
      return { ...state, sheet: action.sheet };

    case "CLOSE_SHEET":
      return { ...state, sheet: null };

    // Regla dura del handoff: mientras hay un overlay, la tarjeta se oculta.
    // Nunca compiten por los mismos píxeles.
    case "OPEN_OVERLAY":
      return { ...state, overlay: action.overlay, expanded: false, sheet: null };

    case "CLOSE_OVERLAY":
      return { ...state, overlay: null };

    case "GRANT_XP":
      return { ...state, xp: Math.min(state.xp + action.xp, XP_PER_LEVEL) };

    /** Primer tiempo del level-up: la barra se llena hasta el tope. */
    case "LEVEL_UP_FILL":
      return { ...state, xp: XP_PER_LEVEL };

    /** Segundo tiempo: sube el nivel y queda el XP residual. */
    case "LEVEL_UP_SETTLE":
      return { ...state, level: state.level + 1, xp: 340 };

    case "PICK":
      return state.picked ? state : { ...state, picked: action.value };

    case "SET_FRAME":
      return { ...state, frame: action.index, sheet: null };

    // El marco NO se toca al cambiar de cuenta. `AvatarFrame` ya fuerza el
    // neutro mientras la cuenta sea de invitado; resetearlo acá hacía que
    // volver a "con cuenta" perdiera el marco elegido, que es un dato del
    // usuario y no del modo de presentación.
    case "SET_ACCOUNT":
      return { ...state, account: action.account, sheet: null };

    case "TICK":
      return state.secs <= 0 ? state : { ...state, secs: state.secs - 1 };

    case "STOP_COUNTDOWN":
      return { ...state, secs: 0 };

    case "TOAST":
      return { ...state, toast: action.text };

    case "CLEAR_TOAST":
      return { ...state, toast: null };

    default:
      return state;
  }
}

/** `Vence en 2h 59m`, el formato que fija el handoff. */
export function formatWindow(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return `Vence en ${h}h ${String(m).padStart(2, "0")}m`;
}

/** Miles con punto, como el resto del copy en es-CO. */
export function formatXP(n: number): string {
  return n.toLocaleString("es-CO");
}
