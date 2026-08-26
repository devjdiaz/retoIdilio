"use client";

import { useState } from "react";

/**
 * Las hojas del reproductor: comentarios y más opciones.
 *
 * Existen por una razón simple: nada en el prototipo debería verse tocable y
 * no hacer nada. El rail de la app real abre estas dos superficies, así que
 * acá también.
 *
 * Deliberadamente chicas. No son el entregable —la barra lo es— y crecerlas
 * competiría con lo que hay que mirar. Comentarios arranca vacío porque el
 * contador de la captura de producción dice 0: inventar comentarios sería
 * poner contenido falso en un prototipo que en todo lo demás usa datos reales.
 */

function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    // z-40: por encima de la barra (z-30). Una hoja que se abre y queda tapada
    // por la barra no es una hoja. Además es lo que hace la app real: los
    // comentarios cubren la franja inferior mientras están abiertos.
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60"
      />
      <div className="relative max-h-[70%] overflow-y-auto rounded-t-card-lg bg-surface pb-[var(--safe-bottom)] motion-safe:animate-[sheet_220ms_ease-out]">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <p className="font-sans text-base font-bold text-text">{title}</p>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="m4 4 10 10M14 4 4 14"
                fill="none"
                stroke="var(--text-2)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function CommentsSheet({ onClose }: { onClose: () => void }) {
  const [draft, setDraft] = useState("");
  const [mine, setMine] = useState<string[]>([]);

  const post = () => {
    const t = draft.trim();
    if (!t) return;
    setMine((prev) => [t, ...prev]);
    setDraft("");
  };

  return (
    <Sheet title={`Comentarios · ${mine.length}`} onClose={onClose}>
      <div className="px-4 pb-4">
        {mine.length === 0 ? (
          <p className="py-8 text-center font-sans text-sm text-text-2">
            Sé el primero en comentar.
          </p>
        ) : (
          <ul className="flex flex-col gap-3 py-2">
            {mine.map((c, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-[2px] h-8 w-8 shrink-0 rounded-pill bg-surface-violet" />
                <span className="min-w-0">
                  <span className="block font-sans text-xs font-semibold text-text-2">Tú</span>
                  <span className="block font-sans text-sm break-words text-text">{c}</span>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && post()}
            placeholder="Escribe un comentario"
            aria-label="Escribe un comentario"
            className="h-11 min-w-0 flex-1 rounded-pill bg-surface-2 px-4 font-sans text-sm text-text outline-none placeholder:text-text-3 focus-visible:ring-2 focus-visible:ring-violet-bright"
          />
          <button
            type="button"
            onClick={post}
            disabled={!draft.trim()}
            className="h-11 shrink-0 rounded-pill px-4 font-sans text-sm font-bold text-text disabled:text-text-3"
            style={{ background: draft.trim() ? "var(--violet)" : "var(--surface-2)" }}
          >
            Enviar
          </button>
        </div>
      </div>
    </Sheet>
  );
}

export function MoreSheet({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(true);
    }
  };

  return (
    <Sheet title="Más opciones" onClose={onClose}>
      <ul className="flex flex-col pb-2">
        <li>
          <button
            type="button"
            onClick={share}
            className="flex h-14 w-full items-center justify-between px-4 font-sans text-sm text-text"
          >
            Compartir episodio
            <span className="font-sans text-xs text-text-2">
              {copied ? "Link copiado" : ""}
            </span>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onClose}
            className="flex h-14 w-full items-center px-4 font-sans text-sm text-text"
          >
            Guardar para después
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={onClose}
            className="flex h-14 w-full items-center px-4 font-sans text-sm text-danger"
          >
            Reportar
          </button>
        </li>
      </ul>
    </Sheet>
  );
}
