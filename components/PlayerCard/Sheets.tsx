"use client";

import { EPISODE_COST } from "@/lib/streak/economy";
import { formatXP } from "@/lib/player/reducer";
import { FRAMES, XP_PER_LEVEL, type PlayerState } from "@/lib/player/types";
import { Coin } from "./parts";

/**
 * Las cuatro hojas del handoff: wallet, racha, progreso y marcos.
 *
 * Van por encima de todo (z-50). Una hoja tapada por la tarjeta no es una
 * hoja, y la tarjeta ya vive en el borde inferior.
 */

function Sheet({
  kicker,
  title,
  onClose,
  children,
}: {
  kicker: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: "rgba(4,3,6,.62)" }}
      />
      <div
        className="relative flex max-h-[82%] flex-col gap-4 overflow-y-auto px-5 pt-5 pb-7 motion-safe:animate-[idSheet_260ms_cubic-bezier(.22,1,.36,1)]"
        style={{
          background: "var(--card-sheet)",
          borderRadius: "26px 26px 0 0",
          borderTop: "1px solid rgba(168,85,247,.4)",
        }}
      >
        <span
          className="mx-auto h-1 w-11 shrink-0 rounded-[3px]"
          style={{ background: "rgba(255,255,255,.2)" }}
        />
        <div className="flex flex-col gap-1">
          <span className="font-sans text-[11px] font-bold tracking-[.18em] text-card-violet-2 uppercase">
            {kicker}
          </span>
          <span className="font-sans text-[22px] font-bold text-text">{title}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  onClick,
  accent,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  onClick?: () => void;
  accent?: string;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className="flex w-full items-center justify-between gap-3 rounded-[14px] px-[14px] py-[13px] text-left"
      style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.07)" }}
    >
      <span className="min-w-0 font-sans text-sm text-card-ink">{label}</span>
      <span
        className="shrink-0 font-sans text-sm font-bold whitespace-nowrap tabular-nums"
        style={{ color: accent ?? "var(--text)" }}
      >
        {value}
      </span>
    </Tag>
  );
}

/** Paquetes reales de la app (`referencias/IMG_9298`). */
const PACKS = [
  { coins: 180, price: "$ 2.500", tag: "69%" },
  { coins: 375, price: "$ 13.500", tag: "20%" },
  { coins: 725, price: "$ 25.500", tag: "24%" },
];

/**
 * Wallet. El orden lo fija producto: **paquetes primero, camino gratuito
 * como opción secundaria**. La diferencia con lo que hoy hace la app —donde
 * lo gratuito queda tras dos planes y tres paquetes, fuera de pantalla— es
 * que acá los dos caminos están en la misma vista, sin scroll de por medio.
 */
export function WalletSheet({
  coins,
  rewardAmount,
  onClose,
}: {
  coins: number;
  rewardAmount: number;
  onClose: () => void;
}) {
  return (
    <Sheet kicker="Wallet" title={`${coins} monedas`} onClose={onClose}>
      <div className="flex flex-col gap-2">
        {PACKS.map((p) => (
          <button
            key={p.coins}
            type="button"
            className="flex w-full items-center justify-between gap-3 rounded-[14px] px-[14px] py-[13px]"
            style={{
              background: "rgba(168,85,247,.10)",
              border: "1px solid rgba(168,85,247,.34)",
            }}
          >
            <span className="flex items-center gap-2">
              <Coin size={20} />
              <span className="font-sans text-[17px] font-extrabold text-card-coin tabular-nums">
                {p.coins}
              </span>
              <span
                className="rounded-pill px-2 py-[2px] font-sans text-[10px] font-bold text-text"
                style={{ background: "var(--card-violet)" }}
              >
                −{p.tag}
              </span>
            </span>
            <span className="font-sans text-sm font-bold whitespace-nowrap text-text tabular-nums">
              {p.price}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-sans text-[11px] font-bold tracking-[.18em] text-card-ink-5 uppercase">
          O gánalas
        </span>
        <Row
          label="Recompensa diaria"
          value={`+${rewardAmount}`}
          accent="var(--card-coin)"
        />
        <Row label="Por capítulo completado" value="+10" accent="var(--card-coin)" />
        <Row label="Predicción acertada" value="+20" accent="var(--card-coin)" />
        <Row label="Costo de un capítulo" value={String(EPISODE_COST)} />
      </div>
    </Sheet>
  );
}

export function StreakSheet({
  streak,
  episode,
  onClose,
}: {
  streak: number;
  episode: number;
  onClose: () => void;
}) {
  return (
    <Sheet kicker="Racha" title={`${streak} días siguiendo historias`} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <Row label="Última actividad" value={`Capítulo ${episode}`} />
        <Row label="Cuenta ver un capítulo, no abrir la app" value="Hoy ✓" accent="var(--success)" />
        <Row label="Día 30 desbloquea" value="Marco Racha 30" accent="var(--card-flame)" />
      </div>
    </Sheet>
  );
}

export function LevelSheet({ player, onClose }: { player: PlayerState; onClose: () => void }) {
  return (
    <Sheet kicker="Progreso" title={`Nivel ${player.level}`} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <Row
          label="XP actual"
          value={`${formatXP(player.xp)} / ${formatXP(XP_PER_LEVEL)}`}
          accent="var(--card-xp)"
        />
        <Row label="Valentina" value="82%" />
        <Row label="La Herencia" value="44%" />
        <Row label="El Último" value="18%" />
      </div>
    </Sheet>
  );
}

export function FramesSheet({
  player,
  onPick,
  onClose,
}: {
  player: PlayerState;
  onPick: (i: number) => void;
  onClose: () => void;
}) {
  return (
    <Sheet
      kicker={`Marco actual · ${FRAMES[player.frame]?.name ?? FRAMES[0].name}`}
      title="Cambiar marco"
      onClose={onClose}
    >
      <div className="grid grid-cols-3 gap-3">
        {FRAMES.map((f, i) => (
          <button
            key={f.name}
            type="button"
            onClick={() => onPick(i)}
            aria-pressed={i === player.frame}
            className="flex cursor-pointer flex-col items-center gap-[6px]"
          >
            <span
              className="grid h-[52px] w-[52px] place-items-center rounded-pill"
              style={{
                padding: 3,
                background: `linear-gradient(135deg, ${f.from}, ${f.to})`,
                boxShadow: i === player.frame ? "0 0 18px rgba(168,85,247,.45)" : undefined,
              }}
            >
              <span
                className="h-full w-full rounded-pill"
                style={{ background: "var(--card-avatar-inner)" }}
              />
            </span>
            <span
              className="font-sans text-[9px] font-semibold"
              style={{ color: i === player.frame ? "var(--card-lila)" : "var(--card-ink-5)" }}
            >
              {f.name}
            </span>
          </button>
        ))}
      </div>
    </Sheet>
  );
}
