"use client";

import { AvatarFrame, Coin, Flame, Gift, XPBar } from "./parts";
import { XP_PER_LEVEL, type PlayerState } from "@/lib/player/types";

/**
 * Barra colapsada — el estado por defecto en portrait.
 *
 * 56 px de alto: el usuario ve el capítulo y su identidad queda legible sin
 * robarle altura a la escena. Toda la barra es el disparador de expansión,
 * así que el área táctil son los 56 px completos y sobra sobre los 44 pt.
 *
 * La variante de invitado cambia dos cosas: no hay nivel ni XP —no existen
 * sin cuenta— y la segunda línea pasa a ser la invitación a crear una. Es el
 * mismo espacio, diciendo lo que aplica a cada quien.
 */
export function CollapsedBar({
  player,
  coins,
  streak,
  rewardAvailable,
  onExpand,
}: {
  player: PlayerState;
  coins: number;
  streak: number;
  rewardAvailable: boolean;
  onExpand: () => void;
}) {
  const guest = player.account === "guest";

  return (
    <button
      type="button"
      onClick={onExpand}
      aria-expanded={false}
      aria-label="Abrir tu perfil"
      className="mx-[2px] flex h-14 w-full cursor-pointer items-center gap-3 rounded-[18px] px-[14px] text-left transition-colors duration-200 hover:border-card-violet-2/60"
      style={{
        background: "linear-gradient(180deg, var(--card-bar-top), var(--card-bar-bottom))",
        border: "1px solid rgba(168,85,247,.30)",
      }}
    >
      <AvatarFrame
        initial={guest ? "?" : player.username[0]!.toUpperCase()}
        size={36}
        frame={player.frame}
        guest={guest}
      />

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="truncate font-sans text-[13px] font-bold text-text">
            {guest ? "Invitado" : `@${player.username}`}
          </span>
          {!guest && (
            <span className="shrink-0 font-sans text-[11px] font-bold whitespace-nowrap text-card-lila">
              Nv {player.level}
            </span>
          )}
        </span>

        {guest ? (
          <span className="truncate font-sans text-[10px] text-card-ink-5">
            Crea tu cuenta y no pierdas tu racha
          </span>
        ) : (
          <XPBar value={player.xp} max={XP_PER_LEVEL} height={3} />
        )}
      </span>

      <span className="flex shrink-0 items-center gap-[10px]">
        <span className="flex items-center gap-1">
          <Coin size={16} />
          <span className="font-sans text-[13px] font-bold text-card-coin tabular-nums">
            {coins}
          </span>
        </span>

        <span className="flex items-center gap-1">
          <Flame size={14} />
          <span className="font-sans text-[13px] font-bold text-card-flame tabular-nums">
            {streak}
          </span>
        </span>

        {rewardAvailable && (
          <span
            aria-label="Recompensa disponible"
            className="grid h-[26px] w-[26px] place-items-center rounded-[9px] text-text motion-safe:animate-[idGlow_2.4s_ease-in-out_infinite]"
            style={{ background: "var(--card-violet)" }}
          >
            <Gift size={14} />
          </span>
        )}
      </span>
    </button>
  );
}
