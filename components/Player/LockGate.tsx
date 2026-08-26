"use client";

import { useState } from "react";
import { EPISODE_COST } from "@/lib/streak/economy";

/**
 * El muro. Es el momento donde el sumidero (desbloquear) se encuentra con el
 * grifo (la racha) — el disparador real del estado 10 de estados.md, y el
 * único punto del flujo donde el usuario tiene una razón para mirar la
 * economía. Por eso está construido como interacción real y no como un
 * botón del panel de demo.
 *
 * Restricción de estados.md: "el camino de pago sigue presente y sin
 * degradar. La barra añade la alternativa gratuita, no la reemplaza."
 * De ahí que "Ver paquetes" ocupe el lugar de acción secundaria y no
 * desaparezca cuando el saldo alcanza.
 */
export function LockGate({
  balance,
  onUnlock,
}: {
  balance: number;
  onUnlock: () => void;
}) {
  const [showPayNote, setShowPayNote] = useState(false);
  const afford = balance >= EPISODE_COST;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full rounded-card-lg bg-surface p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-icon bg-surface-2">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <rect
              x="4.5"
              y="9.5"
              width="13"
              height="9"
              rx="2.5"
              fill="none"
              stroke="var(--violet)"
              strokeWidth="2"
            />
            <path
              d="M7.5 9.5V7a3.5 3.5 0 0 1 7 0v2.5"
              fill="none"
              stroke="var(--violet)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <p className="mt-4 font-sans text-lg font-bold text-text">
          Desbloquea este episodio
        </p>

        {/* El número siempre visible, de los dos lados: lo que cuesta y lo
            que hay. Es la regla de copy del proyecto aplicada al muro. */}
        <div className="mt-4 flex items-center gap-2">
          <Chip label="Costo" value={EPISODE_COST} />
          <Chip label="Tu saldo" value={balance} danger={!afford} />
        </div>

        <button
          type="button"
          onClick={onUnlock}
          className="grad-cta mt-5 h-12 w-full rounded-pill font-sans text-base font-bold text-white transition-transform duration-200 ease-out active:scale-[0.98]"
        >
          Desbloquear
        </button>

        <button
          type="button"
          onClick={() => setShowPayNote(true)}
          className="mt-3 h-11 w-full rounded-pill font-sans text-sm font-bold text-text-2"
        >
          Ver paquetes
        </button>

        {showPayNote && (
          <p className="mt-2 text-center font-sans text-xs text-text-3">
            El camino de pago se mantiene sin cambios. Fuera del alcance del POC.
          </p>
        )}
      </div>
    </div>
  );
}

function Chip({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <span className="flex items-center gap-2 rounded-pill bg-surface-2 px-3 py-2">
      <span className="font-sans text-xs text-text-2">{label}</span>
      <svg width="16" height="16" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="10" fill="var(--coin)" />
        <circle
          cx="11"
          cy="11"
          r="6.5"
          fill="none"
          stroke="var(--coin-deep)"
          strokeWidth="1.25"
          opacity="0.6"
        />
      </svg>
      <span
        className={`font-sans text-sm font-bold tabular-nums ${
          danger ? "text-danger" : "text-coin"
        }`}
      >
        {value}
      </span>
    </span>
  );
}
