/**
 * Estado de la Player Identity Card.
 *
 * Modela sólo lo que la tarjeta agrega: identidad, nivel, XP, marco, y las
 * capas que abre (expansión, overlays, hojas, toast). **Monedas, racha y
 * recompensa NO viven acá**: siguen viniendo de `lib/streak`, que es la
 * máquina que el POC ya tenía y la que el panel de demo maneja. Duplicarlas
 * habría dado dos fuentes de verdad para el mismo número.
 *
 * Las dos variantes de cuenta son el eje del reto: el 88% de Idilio consume
 * como invitado. Un invitado tiene monedas, racha y recompensa; lo que no
 * tiene es identidad ni nada que sobreviva a perder el teléfono. Por eso su
 * tarjeta no muestra nivel ni XP y termina en la invitación a crear cuenta
 * — que es la intervención I5 de la estrategia, puesta donde corresponde:
 * cuando ya hay una racha que perder.
 */

export type Account = "guest" | "member";
export type Overlay = null | "end" | "pred";
export type SheetKind = null | "coins" | "streak" | "level" | "frames";
export type Pick = "A" | "B" | "C" | null;

/** Los seis marcos del handoff. El degradado es el marco. */
export const FRAMES = [
  { name: "Básico", from: "#4b4b55", to: "#2a2a31" },
  { name: "Neón Idilio", from: "#c084fc", to: "#7c2bff" },
  { name: "Racha 30", from: "#ffb347", to: "#ff5f29" },
  { name: "Estreno", from: "#f5c518", to: "#c99406" },
  { name: "Valentina", from: "#ff6f91", to: "#a1207d" },
  { name: "Detective", from: "#7dd3fc", to: "#1e40af" },
] as const;

export const XP_PER_LEVEL = 19450;
/** Segundos de la ventana de recompensa: 3 h, como fija el handoff. */
export const REWARD_WINDOW = 10800;

export type PlayerState = {
  account: Account;
  username: string;
  expanded: boolean;
  overlay: Overlay;
  sheet: SheetKind;
  level: number;
  xp: number;
  frame: number;
  /** Segundos restantes de la recompensa. Corre sólo si está disponible. */
  secs: number;
  picked: Pick;
  /** Copy del toast, o null. Se limpia solo a los 1600 ms. */
  toast: string | null;
};

export const initialPlayerState: PlayerState = {
  account: "member",
  username: "juanesp",
  expanded: false,
  overlay: null,
  sheet: null,
  level: 5,
  xp: 2230,
  frame: 1,
  secs: REWARD_WINDOW,
  picked: null,
  toast: null,
};

export type PlayerAction =
  | { type: "TOGGLE_EXPANDED" }
  | { type: "SET_EXPANDED"; value: boolean }
  | { type: "OPEN_SHEET"; sheet: Exclude<SheetKind, null> }
  | { type: "CLOSE_SHEET" }
  | { type: "OPEN_OVERLAY"; overlay: Exclude<Overlay, null> }
  | { type: "CLOSE_OVERLAY" }
  | { type: "GRANT_XP"; xp: number }
  | { type: "LEVEL_UP_FILL" }
  | { type: "LEVEL_UP_SETTLE" }
  | { type: "PICK"; value: Exclude<Pick, null> }
  | { type: "SET_FRAME"; index: number }
  | { type: "SET_ACCOUNT"; account: Account }
  | { type: "TICK" }
  | { type: "STOP_COUNTDOWN" }
  | { type: "TOAST"; text: string }
  | { type: "CLEAR_TOAST" };
