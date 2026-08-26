import { CURVA_PROPUESTA, nextClaimDay, rewardForDay } from "./curve";
import type { BarState, StreakState } from "./types";

export type BarCopy = {
  message: string;
  /** Presente solo cuando el estado tiene acción de reclamo. */
  cta?: string;
};

/**
 * Fuente de verdad: la tabla "Microcopy" de estados.md, no la sección
 * "Estados" (que arrastra montos de la curva vieja — precedencia declarada
 * ahí mismo). Verbo primero, número siempre visible, tú informal.
 *
 * El monto viaja en el BOTÓN, no en el mensaje. Ver estados.md →
 * "Corrección — el monto vive en el CTA": el mensaje decía "Reclama +20"
 * al lado de un botón que decía "Reclamar", y esa redundancia empujaba el
 * texto fuera de los 390px hasta romperlo ("… nuevo · Reclama +20").
 */
export function copyFor(barState: BarState, state: StreakState): BarCopy {
  /** Monto que se reclamaría ahora mismo, según la curva. */
  const nextReward = () =>
    rewardForDay(nextClaimDay(state.streakDay, state.streakBroken));

  switch (barState) {
    case "loading":
      return { message: "" };

    case 1:
      return { message: "Vuelve mañana y gana monedas" };

    // Sin mensaje: el botón ya dice el verbo y el número. Agregar
    // "Reclama +35" al lado de "Reclamar +35" no informa, solo ocupa.
    case 2:
      return { message: "", cta: `Reclamar +${nextReward()}` };

    case 3:
      return { message: `Día 1 · Mañana +${rewardForDay(2)}` };

    // Día 7 cierra la curva documentada: prometer "Mañana +250" ahí sería
    // falso (rewardForDay satura y repetiría el último valor). estados.md no
    // define qué pasa después del 7 — hasta que lo defina, la barra deja de
    // prometer en vez de prometer de más.
    case 4:
      return {
        message:
          state.streakDay >= CURVA_PROPUESTA.length
            ? `Día ${state.streakDay} · Racha completa`
            : `Día ${state.streakDay} · Mañana +${rewardForDay(state.streakDay + 1)}`,
      };

    case 5:
      return { message: `¡Día 3! · Día 7: +${rewardForDay(7)}` };

    // "Vence en 3h" y no "Tu racha termina en 3h": el sujeto es obvio —
    // es la barra de racha y al lado hay un botón de reclamo— y la versión
    // larga no entra junto al CTA sin truncarse. Verbo primero, número
    // visible, que es lo que piden las reglas de copy.
    case 6:
      return {
        message:
          state.riskWarningHoursLeft != null
            ? `Vence en ${state.riskWarningHoursLeft}h`
            : "Vence pronto",
        cta: `Reclamar +${nextReward()}`,
      };

    // No regaña y no muestra lo perdido. Con el monto en el botón, el
    // mensaje se queda solo con la parte que importa.
    case 7:
      return { message: "Empieza de nuevo", cta: `Reclamar +${rewardForDay(1)}` };

    // Conecta el sumidero con el grifo: lo que falta a la izquierda, la
    // fuente gratuita a la derecha.
    case 10:
      return {
        message: `Te faltan ${state.insufficientAttempt ?? 0}`,
        cta: `Reclamar +${nextReward()}`,
      };
  }
}

/**
 * Segmentos llenos del indicador (0-3), solo para los estados 3/4/5 —
 * mide el tramo hasta el día 3 (estados.md → "Indicador de progreso").
 * Día 2 → 2 llenos; día 4+ (fuera de alcance) reusa el lleno del hito ya
 * superado, la misma extensión mínima que copyFor aplica al mensaje.
 */
export function progressSegments(barState: BarState, streakDay: number): number | null {
  if (barState === 3) return 1;
  if (barState === 4) return streakDay >= 3 ? 3 : 2;
  if (barState === 5) return 3;
  return null;
}
