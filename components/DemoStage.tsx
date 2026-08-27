"use client";

import { useEffect, useReducer } from "react";
import { loadStreak, saveStreak } from "@/lib/streak/persist";
import { streakReducer } from "@/lib/streak/reducer";
import { initialStreakState } from "@/lib/streak/types";
import type { CSSProperties } from "react";
import { DemoPanel } from "./DemoPanel";
import { usePlayerCard } from "./PlayerCard";
import { PhoneFrame } from "./PhoneFrame";
import { Scene } from "./Scene";

const PHONE_W = 390;
const PHONE_H = 844;

// El marco es 390×844 fijo (CLAUDE.md), pero un navegador móvil real
// muestra menos que eso de alto — Safari en iPhone visible ronda 664px con
// la barra de direcciones puesta. Sin esto, la tarjeta queda fuera
// de pantalla y hay que scrollear para verla, que es justo lo que se está
// evaluando. `min(1, ...)` no hace nada cuando sí entra (desktop): el
// marco nunca crece más allá de su tamaño real, solo se achica si hace
// falta. Es una sola regla, no un caso especial para "mobile".
const stageStyle: CSSProperties = {
  ["--phone-scale" as string]: `min(1, calc((100dvh - 4rem) / ${PHONE_H}px))`,
  width: `calc(${PHONE_W}px * var(--phone-scale))`,
  height: `calc(${PHONE_H}px * var(--phone-scale))`,
};

const phoneStyle: CSSProperties = {
  width: PHONE_W,
  height: PHONE_H,
  transform: "scale(var(--phone-scale))",
  transformOrigin: "top left",
};

// Dueño único del estado: la tarjeta (Scene) y el panel de demo leen y
// despachan sobre la misma racha, para que saltar un estado en el panel se
// vea reflejado de inmediato en el teléfono.
export function DemoStage() {
  const [state, dispatch] = useReducer(streakReducer, initialStreakState);

  // La tarjeta también se lifta acá: el panel de demo dispara sus secuencias
  // (fin de capítulo, predicción, subir de nivel) y el teléfono las muestra.
  const { player, dispatch: playerDispatch } = usePlayerCard(
    !state.claimedToday && !state.streakBroken
  );

  // Las dos secuencias temporizadas del handoff. Viven acá y no en el
  // reducer para que el reducer siga siendo puro.
  const episodeEnd = () => {
    playerDispatch({ type: "OPEN_OVERLAY", overlay: "end" });
    window.setTimeout(() => {
      playerDispatch({ type: "GRANT_XP", xp: 25 });
      dispatch({ type: "GRANT_COINS", amount: 10 });
    }, 260);
  };

  const levelUp = () => {
    playerDispatch({ type: "LEVEL_UP_FILL" });
    window.setTimeout(() => {
      playerDispatch({ type: "LEVEL_UP_SETTLE" });
      dispatch({ type: "GRANT_COINS", amount: 50 });
      playerDispatch({ type: "TOAST", text: `Nivel ${player.level + 1} · +50` });
    }, 1200);
  };

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: loadStreak() });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    saveStreak(state);
  }, [state]);

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-8 bg-surface-2 p-8 lg:flex-row lg:items-start">
      <div className="shrink-0" style={stageStyle}>
        <div style={phoneStyle}>
          <PhoneFrame>
            <Scene
              state={state}
              dispatch={dispatch}
              player={player}
              playerDispatch={playerDispatch}
            />
          </PhoneFrame>
        </div>
      </div>
      <DemoPanel
        state={state}
        dispatch={dispatch}
        player={player}
        playerDispatch={playerDispatch}
        onEpisodeEnd={episodeEnd}
        onLevelUp={levelUp}
      />
    </div>
  );
}
