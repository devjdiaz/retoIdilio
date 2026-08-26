"use client";

import { useCallback, useEffect, useReducer } from "react";
import { playerReducer } from "@/lib/player/reducer";
import { initialPlayerState, type PlayerState } from "@/lib/player/types";
import { CollapsedBar } from "./CollapsedBar";
import { ExpandedCard } from "./ExpandedCard";
import { FramesSheet, LevelSheet, StreakSheet, WalletSheet } from "./Sheets";

export { EndOfEpisodeOverlay, PredictionOverlay, Toast } from "./Overlays";

/**
 * Estado de la tarjeta, con las secuencias temporizadas que pide el handoff.
 *
 * El reducer es puro y no sabe de relojes; los `setTimeout` viven acá. Eso
 * mantiene las dos secuencias del handoff legibles como lo que son: el XP se
 * suma 260 ms **después** de abrir el overlay para que la barra se vea
 * crecer, y el level-up llena primero y recién a los 1200 ms cambia el número.
 * Si el XP se sumara en el mismo tick, la barra ya estaría llena cuando el
 * overlay aparece y la animación no comunicaría nada.
 */
export function usePlayerCard(rewardAvailable: boolean) {
  const [player, dispatch] = useReducer(playerReducer, initialPlayerState);

  // El countdown corre sólo mientras haya algo que reclamar.
  useEffect(() => {
    if (!rewardAvailable) return;
    const id = window.setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => window.clearInterval(id);
  }, [rewardAvailable]);

  useEffect(() => {
    if (!player.toast) return;
    const id = window.setTimeout(() => dispatch({ type: "CLEAR_TOAST" }), 1600);
    return () => window.clearTimeout(id);
  }, [player.toast]);

  return { player, dispatch };
}

/**
 * La zona de tarjeta. Va **en flujo**, no absoluta sobre el video: es la
 * regla estructural del handoff. El video cede altura y la tarjeta es una
 * segunda capa, así nunca tapa los controles de playback.
 */
export function PlayerCardZone({
  player,
  dispatch,
  coins,
  streak,
  episode,
  rewardAvailable,
  rewardAmount,
  onClaim,
}: {
  player: PlayerState;
  dispatch: React.Dispatch<Parameters<typeof playerReducer>[1]>;
  coins: number;
  streak: number;
  episode: number;
  rewardAvailable: boolean;
  rewardAmount: number;
  onClaim: () => void;
}) {
  const claim = useCallback(() => {
    onClaim();
    dispatch({ type: "STOP_COUNTDOWN" });
    dispatch({ type: "TOAST", text: `+${rewardAmount} monedas` });
  }, [onClaim, dispatch, rewardAmount]);

  return (
    <>
      <div className="shrink-0 px-[10px] pt-2 pb-3" style={{ background: "var(--bg)" }}>
        {player.expanded ? (
          <ExpandedCard
            player={player}
            coins={coins}
            streak={streak}
            rewardAvailable={rewardAvailable}
            rewardAmount={rewardAmount}
            onCollapse={() => dispatch({ type: "SET_EXPANDED", value: false })}
            onClaim={claim}
            onOpenSheet={(sheet) => dispatch({ type: "OPEN_SHEET", sheet })}
            onCreateAccount={() => dispatch({ type: "SET_ACCOUNT", account: "member" })}
          />
        ) : (
          <CollapsedBar
            player={player}
            coins={coins}
            streak={streak}
            rewardAvailable={rewardAvailable}
            onExpand={() => dispatch({ type: "SET_EXPANDED", value: true })}
          />
        )}
      </div>

      {player.sheet === "coins" && (
        <WalletSheet
          coins={coins}
          rewardAmount={rewardAmount}
          onClose={() => dispatch({ type: "CLOSE_SHEET" })}
        />
      )}
      {player.sheet === "streak" && (
        <StreakSheet
          streak={streak}
          episode={episode}
          onClose={() => dispatch({ type: "CLOSE_SHEET" })}
        />
      )}
      {player.sheet === "level" && (
        <LevelSheet player={player} onClose={() => dispatch({ type: "CLOSE_SHEET" })} />
      )}
      {player.sheet === "frames" && (
        <FramesSheet
          player={player}
          onPick={(index) => dispatch({ type: "SET_FRAME", index })}
          onClose={() => dispatch({ type: "CLOSE_SHEET" })}
        />
      )}
    </>
  );
}
