"use client";

import { useState } from "react";
import { SERIES_LENGTH, SERIES_TITLE, SERIES_SYNOPSIS } from "@/lib/streak/economy";
import { ActionRail } from "./ActionRail";
import { CommentsSheet, MoreSheet } from "./PlayerSheets";

/**
 * El marco del reproductor: volver, metadatos del episodio, rail de acciones
 * y scrubber.
 *
 * NO es el reproductor real (fuera de alcance por CLAUDE.md). Es el marco que
 * hace legible la intervención: la tarjeta se defiende como una capa
 * sobre el core loop, y sin nada de ese loop en pantalla la tarjeta se lee como
 * un componente suelto — o peor, como una app más pobre que la real.
 *
 * Replica lo que la app ya muestra en esa zona (`referencias/IMG_9295`):
 * capítulo, título, sinopsis truncada con "ver más", el rail derecho y la
 * línea de progreso. Todo inerte salvo lo que se evalúa.
 *
 * El botón de pausa de la captura no se replica: ahí aparece porque el video
 * estaba pausado. Acá el video corre, y además el toque sobre el video ya
 * tiene dueño — expande y colapsa la tarjeta.
 */
export function EpisodeChrome({ episode }: { episode: number }) {
  const [sheet, setSheet] = useState<"comments" | "more" | null>(null);

  return (
    <>
      {/* Volver — el control que la app pone arriba a la izquierda. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 flex items-start justify-between p-4 pt-12">
        <span className="flex h-9 w-9 items-center justify-center rounded-pill bg-white/15 backdrop-blur-sm">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M11.5 3.5 6 9l5.5 5.5"
              fill="none"
              stroke="var(--text)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Cluster inferior: metadatos a la izquierda, rail a la derecha. */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 pb-3">
        <div className="flex items-end gap-4 px-4">
          <div className="min-w-0 flex-1">
            <p className="font-sans text-sm text-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              Capítulo {episode}
            </p>
            <p className="font-sans text-lg font-bold text-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {SERIES_TITLE}
            </p>
            <p className="mt-1 line-clamp-2 font-sans text-xs leading-relaxed text-text-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              Capítulo {episode} de {SERIES_LENGTH} — {SERIES_SYNOPSIS}
            </p>
            <span className="mt-3 inline-flex h-8 items-center rounded-pill bg-white/15 px-3 font-sans text-xs font-semibold text-text backdrop-blur-sm">
              ver más
            </span>
          </div>

          <ActionRail
            onComments={() => setSheet("comments")}
            onMore={() => setSheet("more")}
          />
        </div>

        {/* Progreso del episodio. Va a sangre, como en la app, y lleva el
            punto de posición — sin él la línea se lee como un separador. */}
        <div className="relative mt-4 h-[2px] w-full bg-white/20">
          <div className="h-full w-1/3 bg-white/80" />
          <span className="absolute top-1/2 left-1/3 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-text" />
        </div>
      </div>

      {sheet === "comments" && <CommentsSheet onClose={() => setSheet(null)} />}
      {sheet === "more" && <MoreSheet onClose={() => setSheet(null)} />}
    </>
  );
}
