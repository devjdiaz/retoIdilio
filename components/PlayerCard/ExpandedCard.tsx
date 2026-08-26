"use client";

import { formatWindow, formatXP } from "@/lib/player/reducer";
import { FRAMES, XP_PER_LEVEL, type PlayerState } from "@/lib/player/types";
import { AvatarFrame, ChevronUp, Coin, Flame, Gift, Info, Verified, XPBar } from "./parts";

/**
 * Tarjeta expandida. Se abre al tocar la barra, al pausar y al terminar
 * capítulo; cierra con el chevron o al reanudar.
 *
 * La variante de invitado no muestra nivel, XP ni marco —ninguno existe sin
 * cuenta— y el pie deja de ser "Ver perfil" para ser la invitación a crearla.
 * El resto es idéntico: monedas, racha y recompensa son de todos, y ese es
 * justamente el argumento de la entrega. La cuenta se pide cuando ya hay algo
 * que perder, no como peaje de entrada.
 */
export function ExpandedCard({
  player,
  coins,
  streak,
  rewardAvailable,
  rewardAmount,
  onCollapse,
  onClaim,
  onOpenSheet,
  onCreateAccount,
}: {
  player: PlayerState;
  coins: number;
  streak: number;
  rewardAvailable: boolean;
  rewardAmount: number;
  onCollapse: () => void;
  onClaim: () => void;
  onOpenSheet: (s: "coins" | "streak" | "level" | "frames") => void;
  onCreateAccount: () => void;
}) {
  const guest = player.account === "guest";
  const frameName = FRAMES[guest ? 0 : player.frame]?.name ?? FRAMES[0].name;

  return (
    <div
      className="mx-[2px] flex flex-col gap-[14px] rounded-[22px] px-4 pt-4 pb-[14px] motion-safe:animate-[idRise_280ms_ease]"
      style={{
        background: "linear-gradient(180deg, var(--card-top), var(--card-bottom))",
        border: "1px solid rgba(168,85,247,.34)",
      }}
    >
      {/* ── Identidad ───────────────────────────────────────────────── */}
      <div className="flex items-start gap-[14px]">
        <button
          type="button"
          onClick={() => !guest && onOpenSheet("frames")}
          aria-label={guest ? "Avatar de invitado" : "Cambiar marco"}
          className="relative shrink-0"
          disabled={guest}
        >
          <AvatarFrame
            initial={guest ? "?" : player.username[0]!.toUpperCase()}
            size={76}
            frame={player.frame}
            guest={guest}
          />
          {!guest && (
            <span
              className="absolute -bottom-2 left-1/2 grid h-6 min-w-[30px] -translate-x-1/2 place-items-center rounded-lg px-1 font-sans text-[13px] font-extrabold text-text tabular-nums"
              style={{ background: "var(--card-bottom)", border: "2px solid var(--card-violet-2)" }}
            >
              {player.level}
            </span>
          )}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
          <div className="flex min-w-0 items-center gap-[6px]">
            <span className="truncate font-sans text-[19px] font-bold tracking-[-0.01em] text-text">
              {guest ? "Invitado" : player.username}
            </span>
            {!guest && <Verified size={15} />}
          </div>

          {guest ? (
            <p className="font-sans text-[13px] text-card-ink-3">
              Tu racha vive en este teléfono
            </p>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onOpenSheet("level")}
                className="flex w-fit cursor-pointer items-center gap-[6px] font-sans text-[13px] text-card-ink-3"
              >
                Nivel {player.level}
                <span className="text-card-ink-5">
                  <Info size={13} />
                </span>
              </button>
              <XPBar value={player.xp} max={XP_PER_LEVEL} height={7} slow />
              <span className="font-sans text-[11px] text-card-ink-5 tabular-nums">
                {formatXP(player.xp)} / {formatXP(XP_PER_LEVEL)} XP
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onCollapse}
          aria-label="Colapsar"
          className="-m-[8px] grid h-11 w-11 shrink-0 cursor-pointer place-items-center text-card-ink-2"
        >
          <span
            className="grid h-7 w-7 place-items-center rounded-[9px] transition-colors duration-150"
            style={{ background: "rgba(255,255,255,.07)" }}
          >
            <ChevronUp size={16} />
          </span>
        </button>
      </div>

      <div className="h-px w-full" style={{ background: "rgba(255,255,255,.09)" }} />

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-[1fr_1fr_1.35fr] gap-3">
        <button
          type="button"
          onClick={() => onOpenSheet("coins")}
          className="flex cursor-pointer flex-col items-start gap-1 text-left"
        >
          <span className="flex items-center gap-[6px]">
            <Coin size={20} />
            <span className="font-sans text-[20px] font-extrabold text-card-coin tabular-nums">
              {coins}
            </span>
          </span>
          <span className="font-sans text-[11px] text-card-ink-5">Monedas</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenSheet("streak")}
          className="flex cursor-pointer flex-col items-start gap-1 pl-3 text-left"
          style={{ borderLeft: "1px solid rgba(255,255,255,.09)" }}
        >
          <span className="flex items-center gap-[6px]">
            <Flame size={18} />
            <span className="font-sans text-[20px] font-extrabold text-card-flame tabular-nums">
              {streak}
            </span>
          </span>
          <span className="font-sans text-[11px] whitespace-nowrap text-card-ink-5">Racha</span>
        </button>

        <div
          className="flex flex-col items-end gap-[6px] pl-3"
          style={{ borderLeft: "1px solid rgba(255,255,255,.09)" }}
        >
          <span className="font-sans text-[11px] whitespace-nowrap text-card-ink-5 tabular-nums">
            {rewardAvailable ? formatWindow(player.secs) : `Próxima: +${rewardAmount}`}
          </span>
          {rewardAvailable ? (
            <button
              type="button"
              onClick={onClaim}
              className="flex cursor-pointer items-center gap-[6px] rounded-pill px-3 py-[10px] font-sans text-[13px] font-bold whitespace-nowrap text-text"
              style={{ background: "var(--card-violet)", border: "1px solid var(--card-violet)" }}
            >
              <Gift size={15} />
              Reclamar +{rewardAmount}
            </button>
          ) : (
            <span
              className="rounded-pill px-3 py-[10px] font-sans text-[13px] font-bold whitespace-nowrap text-card-ink-5"
              style={{
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.14)",
              }}
            >
              Reclamada
            </span>
          )}
        </div>
      </div>

      {/* ── Pie ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <span className="font-sans text-[12px] text-card-ink-4">
          {guest ? "Sin cuenta" : `Marco · ${frameName}`}
        </span>
        <button
          type="button"
          onClick={guest ? onCreateAccount : () => onOpenSheet("level")}
          className="cursor-pointer font-sans text-[12px] font-semibold text-card-lila"
        >
          {guest ? "Crear cuenta" : "Ver perfil"}
        </button>
      </div>
    </div>
  );
}
