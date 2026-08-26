import Image from "next/image";

/**
 * El fotograma del episodio.
 *
 * Antes era un gradiente animado en canvas, y por más que se le agregara luz
 * y grano seguía leyéndose como un fondo de UI: el POC parecía más pobre que
 * la app que dice mejorar. Ahora es un cuadro real de "Mi Mejor Pasajera",
 * recortado de una captura de producción — sin la barra de estado de iOS, sin
 * el rail quemado y sin la franja de monedas, para que no se dupliquen con
 * las de este prototipo.
 *
 * Es más barato que lo que reemplaza, no más caro: 68 KB de JPEG contra un
 * `requestAnimationFrame` permanente. Eso importa con 54% de las sesiones de
 * noche en Android de gama de entrada. `priority` porque es lo primero que se
 * ve; sin él la primera pintura es un rectángulo negro.
 *
 * Encima van dos capas que no son decoración:
 *
 * - **Viñeta**, que cierra el cuadro y evita que el fotograma se derrame
 *   contra el marco del teléfono.
 * - **Degradado inferior**, que es lo que hace legible el texto blanco: sin
 *   él, "Capítulo 13" sobre una camisa blanca no pasa AA.
 */
export function VideoFrame() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      <Image
        src="/episodio-13-cap.jpg"
        alt=""
        fill
        priority
        sizes="390px"
        className="object-cover"
      />

      {/* Viñeta. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />

      {/* Piso oscuro para el texto y la barra. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
    </div>
  );
}
