import type { StreakState } from "./types";

const STORAGE_KEY = "idilio-poc-streak";

// Solo lo que define la racha en sí. Lo transitorio (celebración, intento de
// desbloqueo, advertencia de tiempo, visibilidad) es de la sesión actual y
// no debe sobrevivir un refresh — CLAUDE.md: "localStorage opcional para
// sobrevivir un refresh. Nada más."
// El progreso de episodios entra también: sin él, un refresh devolvería el
// saldo ya gastado en un desbloqueo pero volvería a bloquear el episodio.
export type PersistedStreak = Pick<
  StreakState,
  "balance" | "streakDay" | "claimedToday" | "streakBroken" | "episode" | "unlockedThrough"
>;

function isPersistedStreak(value: unknown): value is PersistedStreak {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.balance === "number" &&
    typeof v.streakDay === "number" &&
    typeof v.claimedToday === "boolean" &&
    typeof v.streakBroken === "boolean" &&
    typeof v.episode === "number" &&
    typeof v.unlockedThrough === "number"
  );
}

export function loadStreak(): PersistedStreak | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPersistedStreak(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveStreak(state: StreakState): void {
  const toSave: PersistedStreak = {
    balance: state.balance,
    streakDay: state.streakDay,
    claimedToday: state.claimedToday,
    streakBroken: state.streakBroken,
    episode: state.episode,
    unlockedThrough: state.unlockedThrough,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // Cuota excedida o localStorage inaccesible (navegación privada): la
    // demo sigue funcionando en memoria, solo no sobrevive un refresh.
  }
}
