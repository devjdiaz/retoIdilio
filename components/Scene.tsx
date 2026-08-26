"use client";

import type { Dispatch } from "react";
import { nextClaimDay, rewardForDay } from "@/lib/streak/curve";
import { EPISODE_COST } from "@/lib/streak/economy";
import type { StreakAction, StreakState } from "@/lib/streak/types";
import type { playerReducer } from "@/lib/player/reducer";
import type { PlayerState } from "@/lib/player/types";
import { VideoFrame } from "./VideoFrame";
import { EpisodeChrome } from "./Player/EpisodeChrome";
import { LockGate } from "./Player/LockGate";
import {
  EndOfEpisodeOverlay,
  PlayerCardZone,
  PredictionOverlay,
  Toast,
} from "./PlayerCard";

/**
 * La escena del reproductor.
 *
 * Cambio estructural que trae el handoff: **la tarjeta ya no flota sobre el
 * video**. La pantalla es una columna de dos bloques —caja de video con
 * `flex-1 min-h-0`, zona de tarjeta con `flex-none`— y el video cede la
 * altura que la tarjeta necesita. Colapsada son 76 px y al video le quedan
 * ~766; expandida la zona crece y el video se achica, pero los controles de
 * playback nunca quedan tapados porque viven dentro de la caja de video.
 *
 * Los overlays cubren sólo la caja de video, no la pantalla entera, y por
 * eso la tarjeta sigue existiendo debajo — aunque el reducer la colapse
 * mientras hay uno arriba, que es la regla dura del handoff.
 */
export function Scene({
  state,
  dispatch,
  player,
  playerDispatch,
}: {
  state: StreakState;
  dispatch: Dispatch<StreakAction>;
  player: PlayerState;
  playerDispatch: Dispatch<Parameters<typeof playerReducer>[1]>;
}) {
  const locked = state.episode > state.unlockedThrough;
  const rewardAvailable = !state.claimedToday && !state.streakBroken;
  const rewardAmount = rewardForDay(nextClaimDay(state.streakDay, state.streakBroken));

  const pick = (key: "A" | "B" | "C", right: boolean) => {
    playerDispatch({ type: "PICK", value: key });
    playerDispatch({ type: "GRANT_XP", xp: right ? 20 : 5 });
    if (right) dispatch({ type: "GRANT_COINS", amount: 10 });
    playerDispatch({
      type: "TOAST",
      text: right ? "¡Acertaste! +20 XP · +10" : "Fallaste · +5 XP",
    });
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* ── Caja de video ─────────────────────────────────────────────── */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Tocar el video alterna la expansión de la tarjeta: es el gesto real
            de un reproductor. En el muro se desactiva — ocultar ahí escondería
            la única alternativa gratuita justo cuando el usuario la necesita. */}
        <div
          className="absolute inset-0"
          onClick={locked ? undefined : () => playerDispatch({ type: "TOGGLE_EXPANDED" })}
        >
          <VideoFrame />
        </div>

        {!locked && !player.overlay && <EpisodeChrome episode={state.episode} />}

        {locked && (
          <LockGate
            balance={state.balance}
            onUnlock={() => dispatch({ type: "ATTEMPT_UNLOCK", cost: EPISODE_COST })}
          />
        )}

        {player.overlay === "end" && (
          <EndOfEpisodeOverlay
            player={player}
            streak={state.streakDay}
            onNext={() => {
              playerDispatch({ type: "CLOSE_OVERLAY" });
              dispatch({ type: "NEXT_EPISODE" });
            }}
            onPredict={() => playerDispatch({ type: "OPEN_OVERLAY", overlay: "pred" })}
          />
        )}

        {player.overlay === "pred" && (
          <PredictionOverlay
            picked={player.picked}
            onPick={pick}
            onClose={() => playerDispatch({ type: "CLOSE_OVERLAY" })}
          />
        )}

        {player.toast && <Toast text={player.toast} />}
      </div>

      {/* ── Zona de tarjeta ───────────────────────────────────────────── */}
      <PlayerCardZone
        player={player}
        dispatch={playerDispatch}
        coins={state.balance}
        streak={state.streakDay}
        episode={state.episode}
        rewardAvailable={rewardAvailable}
        rewardAmount={rewardAmount}
        onClaim={() => dispatch({ type: "CLAIM" })}
      />
    </div>
  );
}
