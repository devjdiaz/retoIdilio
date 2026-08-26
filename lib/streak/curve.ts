// Curva actual (producción) — se usa solo para alimentar la vista comparativa
// del DemoPanel. La barra nunca lee este arreglo.
export const CURVA_ACTUAL = [15, 40, 60, 50, 40, 45, 200] as const;

// Curva corregida (estados.md → "Corrección de la curva de racha"). Es la que
// corre en la barra real. Nunca retrocede — condición mínima de progresión.
export const CURVA_PROPUESTA = [20, 35, 60, 75, 90, 110, 250] as const;

/**
 * Recompensa del día `day` (1-indexado). Más allá del día 7 (fuera del
 * alcance documentado) se sostiene el último valor en vez de fallar: es
 * preferible a un `undefined` silencioso si el demo empuja la racha más allá.
 */
export function rewardForDay(day: number): number {
  const idx = Math.min(Math.max(day, 1), CURVA_PROPUESTA.length) - 1;
  return CURVA_PROPUESTA[idx];
}

/** Día que se reclamaría a continuación, dado el estado actual de la racha. */
export function nextClaimDay(streakDay: number, streakBroken: boolean): number {
  return streakBroken || streakDay === 0 ? 1 : streakDay + 1;
}

/**
 * Suma acumulada de recompensas hasta `streakDay`. La usa el DemoPanel para
 * mostrar un saldo coherente con la curva al saltar a un día, en vez de un
 * número inventado.
 */
export function cumulativeBalance(streakDay: number): number {
  let total = 0;
  for (let day = 1; day <= streakDay; day++) total += rewardForDay(day);
  return total;
}
