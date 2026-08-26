/**
 * Rail de acciones del reproductor: me gusta, comentarios, más.
 *
 * Es la firma visual de la categoría —ReelShort, DramaBox, TikTok y el propio
 * Idilio la tienen— y sin ella el POC se lee como un componente sobre un
 * fondo, no como una app de microdramas. Valores tomados de la captura de
 * producción (`referencias/IMG_9295`): 267 me gusta, 0 comentarios.
 *
 * El me gusta responde de verdad: nada en el prototipo debería verse tocable
 * y no hacer nada. Su estado vive en un `useState` local y no en el reducer de
 * la racha — un me gusta no es estado de la máquina de racha, y meterlo ahí
 * ensuciaría lo único que este POC quiere demostrar.
 */

"use client";

import { useState } from "react";

const ICON = 28;

function Heart({ on }: { on: boolean }) {
  return (
    <svg
      width={ICON}
      height={ICON}
      viewBox="0 0 28 28"
      aria-hidden="true"
      className={on ? "scale-110 transition-transform duration-150 ease-out" : "transition-transform duration-150 ease-out"}
    >
      <path
        d="M14 24S3.5 17.6 3.5 10.9A5.9 5.9 0 0 1 14 7.3a5.9 5.9 0 0 1 10.5 3.6C24.5 17.6 14 24 14 24Z"
        fill={on ? "var(--violet-logo)" : "none"}
        stroke={on ? "var(--violet-logo)" : "var(--text)"}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Comment() {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 28 28" aria-hidden="true">
      <path
        d="M24 13.4c0 4.9-4.5 8.9-10 8.9a11.6 11.6 0 0 1-3.2-.4L5 24l1.8-4.2a8.4 8.4 0 0 1-2.8-6.4c0-4.9 4.5-8.9 10-8.9s10 4 10 8.9Z"
        fill="none"
        stroke="var(--text)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function More() {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 28 28" aria-hidden="true">
      {[7, 14, 21].map((cx) => (
        <circle key={cx} cx={cx} cy="14" r="1.75" fill="var(--text)" />
      ))}
    </svg>
  );
}

/** Icono con su contador pegado debajo, como en la app. El bloque ocupa 44pt de ancho. */
function Action({
  children,
  count,
  label,
  pressed,
  onClick,
}: {
  children: React.ReactNode;
  count?: string;
  label: string;
  pressed?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className="flex w-11 cursor-pointer flex-col items-center"
    >
      <span className="flex h-8 w-11 items-center justify-center drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
        {children}
      </span>
      {count !== undefined && (
        <span className="font-sans text-xs font-medium text-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          {count}
        </span>
      )}
    </button>
  );
}

/** Valor de la captura de producción (`referencias/IMG_9295`). */
const LIKES = 267;

export function ActionRail({ onComments, onMore }: { onComments: () => void; onMore: () => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="pointer-events-auto flex shrink-0 flex-col items-center gap-5">
      <Action
        count={String(LIKES + (liked ? 1 : 0))}
        label={liked ? "Quitar me gusta" : "Me gusta"}
        pressed={liked}
        onClick={() => setLiked((v) => !v)}
      >
        <Heart on={liked} />
      </Action>
      <Action count="0" label="Comentarios" onClick={onComments}>
        <Comment />
      </Action>
      <Action label="Más opciones" onClick={onMore}>
        <More />
      </Action>
    </div>
  );
}
