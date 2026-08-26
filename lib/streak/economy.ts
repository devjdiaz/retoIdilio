/**
 * Economía observada en la app real (design-tokens.md → "Economía observada").
 * No son números inventados para la demo: salen de usar Idilio TV.
 */

/** Costo de desbloquear un episodio. */
export const EPISODE_COST = 15;

/** Último episodio gratuito. El bloqueo cae en el 13. */
export const FREE_THROUGH = 12;

/** Episodios de la serie de la demo. */
export const SERIES_LENGTH = 56;

export const SERIES_TITLE = "Mi Mejor Pasajera";

/** Sinopsis literal de la app (`referencias/IMG_9295`). Va truncada a dos líneas. */
export const SERIES_SYNOPSIS =
  "Jimena, una asistente de aeropuerto que sueña con ser piloto sin haber volado jamás, encuentra el amor en un piloto que cambiará su destino.";

/**
 * La demo arranca en el episodio 13 — el muro — y no en el 1. Es deliberado:
 * el reto acota el POC a "la pantalla o el momento donde ocurre la mecánica",
 * y el momento donde el sumidero se encuentra con el grifo es exactamente
 * este. Con una sesión promedio de 14 episodios y 12 gratis, además, es el
 * punto al que el usuario real llega en su primera noche.
 */
export const START_EPISODE = 13;
