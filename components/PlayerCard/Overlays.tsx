"use client";

import { formatXP } from "@/lib/player/reducer";
import { XP_PER_LEVEL, type PlayerState } from "@/lib/player/types";
import { XPBar } from "./parts";

/**
 * Los dos overlays del handoff: fin de capítulo y predicción.
 *
 * Regla dura: mientras uno está arriba, la tarjeta y la barra se ocultan.
 * Nunca compiten por los mismos píxeles — lo resuelve el reducer, que al
 * abrir un overlay pone `expanded:false` y cierra cualquier hoja.
 *
 * Cubren la caja de video, no la pantalla: la zona de tarjeta queda debajo y
 * los controles de playback nunca se tapan.
 */

function Scrim({ children, ms }: { children: React.ReactNode; ms: number }) {
  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end px-[22px] pt-6 pb-[26px] backdrop-blur-[2px]"
      style={{
        background: "linear-gradient(180deg, rgba(8,6,12,.55), rgba(8,6,12,.94) 45%)",
        animation: `idRise ${ms}ms ease`,
      }}
    >
      {children}
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-[11px] font-bold tracking-[.2em] text-card-violet-2 uppercase">
      {children}
    </span>
  );
}

const TILES = [
  { n: "+25", label: "XP", rgb: "168,85,247", color: "var(--card-xp)" },
  { n: "+10", label: "Monedas", rgb: "245,197,24", color: "var(--card-coin)" },
  { n: null, label: "Racha mantenida", rgb: "255,122,41", color: "var(--card-flame)" },
];

export function EndOfEpisodeOverlay({
  player,
  streak,
  onNext,
  onPredict,
}: {
  player: PlayerState;
  streak: number;
  onNext: () => void;
  onPredict: () => void;
}) {
  return (
    <Scrim ms={340}>
      <div className="flex flex-col gap-4">
        <Kicker>Episodio completado</Kicker>

        <div className="grid grid-cols-3 gap-2">
          {TILES.map((t) => (
            <div
              key={t.label}
              className="flex flex-col gap-1 rounded-[14px] px-[14px] py-3"
              style={{
                background: `rgba(${t.rgb},.11)`,
                border: `1px solid rgba(${t.rgb},.32)`,
              }}
            >
              <span
                className="font-sans text-[22px] font-extrabold tabular-nums"
                style={{ color: t.color }}
              >
                {t.n ?? streak}
              </span>
              <span className="font-sans text-[11px] leading-tight text-card-ink-3">
                {t.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="font-sans text-xs text-card-ink-2">Nivel {player.level}</span>
            <span className="font-sans text-xs text-card-ink-2 tabular-nums">
              {formatXP(player.xp)} / {formatXP(XP_PER_LEVEL)} XP
            </span>
          </div>
          <XPBar value={player.xp} max={XP_PER_LEVEL} height={8} slow />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onNext}
            className="h-12 flex-1 cursor-pointer rounded-pill font-sans text-[15px] font-bold text-text transition-colors duration-150"
            style={{ background: "var(--card-violet)" }}
          >
            Siguiente capítulo
          </button>
          <button
            type="button"
            onClick={onPredict}
            className="h-12 cursor-pointer rounded-pill px-5 font-sans text-[15px] font-bold text-text"
            style={{ border: "1px solid rgba(255,255,255,.24)" }}
          >
            Predecir
          </button>
        </div>
      </div>
    </Scrim>
  );
}

const OPTIONS = [
  { key: "A" as const, text: "Le dice la verdad al capitán" },
  { key: "B" as const, text: "Se baja del avión sin explicar nada" },
  { key: "C" as const, text: "Finge que no lo conoce" },
];
/** La correcta, como fija el handoff. */
const RIGHT = "B";

export function PredictionOverlay({
  picked,
  onPick,
  onClose,
}: {
  picked: PlayerState["picked"];
  onPick: (k: "A" | "B" | "C", right: boolean) => void;
  onClose: () => void;
}) {
  return (
    <Scrim ms={300}>
      <div className="flex flex-col gap-4">
        <Kicker>Predice lo que pasará</Kicker>
        <p className="font-sans text-[20px] font-bold text-text">¿Qué hará Valentina?</p>

        <div className="flex flex-col gap-2">
          {OPTIONS.map((o) => {
            const on = picked === o.key;
            return (
              <button
                key={o.key}
                type="button"
                disabled={!!picked}
                onClick={() => onPick(o.key, o.key === RIGHT)}
                className="flex items-center gap-3 rounded-[14px] px-4 py-[14px] text-left"
                style={{
                  background: on ? "rgba(168,85,247,.16)" : "rgba(255,255,255,.05)",
                  border: `1px solid ${on ? "var(--card-violet-2)" : "rgba(255,255,255,.14)"}`,
                  cursor: picked ? "default" : "pointer",
                }}
              >
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-[7px] font-sans text-[11px] font-bold text-text"
                  style={{ background: "rgba(255,255,255,.10)" }}
                >
                  {o.key}
                </span>
                <span className="font-sans text-sm text-card-ink">{o.text}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="font-sans text-xs text-card-ink-5">
            {picked ? "Ya respondiste este capítulo." : "Acertar da +20 XP y +10 monedas."}
          </span>
          {picked && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 cursor-pointer rounded-pill px-4 py-2 font-sans text-[13px] font-bold text-text"
              style={{ background: "var(--card-violet)" }}
            >
              Seguir
            </button>
          )}
        </div>
      </div>
    </Scrim>
  );
}

/** Pill flotante sobre el borde inferior del video. Se limpia sola. */
export function Toast({ text }: { text: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[70px] z-50 flex justify-center">
      <span
        className="rounded-pill px-4 py-2 font-sans text-sm font-bold motion-safe:animate-[idFloat_1600ms_ease-out]"
        style={{
          background: "rgba(12,10,16,.86)",
          border: "1px solid rgba(168,85,247,.5)",
          color: "var(--card-xp)",
        }}
      >
        {text}
      </span>
    </div>
  );
}
