"use client";

import type { Dispatch, ReactNode } from "react";
import { cumulativeBalance } from "@/lib/streak/curve";
import { EPISODE_COST, FREE_THROUGH, START_EPISODE } from "@/lib/streak/economy";
import { selectBarState } from "@/lib/streak/select";
import type { StreakAction, StreakState } from "@/lib/streak/types";
import type { PlayerAction, PlayerState } from "@/lib/player/types";
import { CurveComparison } from "./CurveComparison";
import { PanelButton } from "./PanelButton";

const DAYS = [1, 2, 3, 4, 5, 6, 7];

// Deja hydrated intacto a propósito: reiniciar la racha no debe re-disparar
// el parpadeo de carga.
const RESET_FIELDS: Partial<StreakState> = {
  balance: 0,
  streakDay: 0,
  claimedToday: false,
  streakBroken: false,
  celebrating: false,
  insufficientAttempt: null,
  riskWarningHoursLeft: null,
  visibility: "visible",
  episode: START_EPISODE,
  unlockedThrough: FREE_THROUGH,
};

export function DemoPanel({
  state,
  dispatch,
  player,
  playerDispatch,
  onEpisodeEnd,
  onLevelUp,
}: {
  state: StreakState;
  dispatch: Dispatch<StreakAction>;
  player: PlayerState;
  playerDispatch: Dispatch<PlayerAction>;
  onEpisodeEnd: () => void;
  onLevelUp: () => void;
}) {
  const barState = selectBarState(state);
  const set = (patch: Partial<StreakState>) => dispatch({ type: "DEMO_SET", patch });
  const locked = state.episode > state.unlockedThrough;

  const showClaimedDay = (day: number) =>
    set({
      streakDay: day,
      claimedToday: true,
      streakBroken: false,
      celebrating: false,
      insufficientAttempt: null,
      riskWarningHoursLeft: null,
      balance: cumulativeBalance(day),
    });

  // Estado 1 — fallback: ya reclamó y no hay racha que reportar. Ver la nota
  // en select.ts sobre por qué dejó de ocurrir en el flujo normal.
  const showFirstTime = () =>
    set({
      streakDay: 0,
      claimedToday: true,
      streakBroken: false,
      celebrating: false,
      insufficientAttempt: null,
      riskWarningHoursLeft: null,
      balance: 0,
    });

  const showAvailable = () =>
    set({
      claimedToday: false,
      streakBroken: false,
      insufficientAttempt: null,
      riskWarningHoursLeft: null,
      balance: cumulativeBalance(state.streakDay),
    });

  const showBroken = () =>
    set({
      streakDay: 0,
      claimedToday: false,
      streakBroken: true,
      insufficientAttempt: null,
      riskWarningHoursLeft: null,
    });

  const showAtRisk = () =>
    set({
      streakDay: Math.max(state.streakDay, 2),
      claimedToday: false,
      streakBroken: false,
      insufficientAttempt: null,
      riskWarningHoursLeft: 3,
      balance: cumulativeBalance(Math.max(state.streakDay, 2)),
    });

  // Reconstruye el escenario completo del muro, no solo el mensaje: episodio
  // bloqueado y saldo corto. Así el estado 10 se ve con su causa en pantalla.
  const showInsufficient = () =>
    set({
      balance: 5,
      unlockedThrough: state.episode - 1,
      insufficientAttempt: EPISODE_COST - 5,
      visibility: "visible",
    });

  return (
    <div className="w-full max-w-sm shrink-0 rounded-card-lg bg-surface p-5 text-text">
      <p className="text-xs font-bold tracking-wide text-text-2 uppercase">
        Panel de demo — herramienta de evaluación
      </p>
      <p className="mt-1 text-xs text-text-2">
        No es parte de la barra. Sirve para recorrer el flujo y saltar entre estados
        durante la revisión.
      </p>

      {/* El recorrido va primero: es el orden en que conviene ver la demo. */}
      <Section title="Recorrido — el loop real">
        <div className="grid grid-cols-2 gap-2">
          <PanelButton onClick={() => dispatch({ type: "CLAIM" })}>
            Reclamar hoy
          </PanelButton>
          <PanelButton onClick={() => dispatch({ type: "ADVANCE_DAY", broke: false })}>
            Día siguiente
          </PanelButton>
          <PanelButton onClick={() => dispatch({ type: "NEXT_EPISODE" })}>
            Siguiente episodio
          </PanelButton>
          <PanelButton onClick={() => dispatch({ type: "ADVANCE_DAY", broke: true })}>
            Faltar un día
          </PanelButton>
        </div>
        <p className="mt-2 text-xs text-text-3">
          Episodio {state.episode} · {locked ? "bloqueado" : "desbloqueado"} · saldo{" "}
          {state.balance} · racha día {state.streakDay}
        </p>
      </Section>

      {/* Los "Simular" del handoff: en producción estos estados los disparan
          eventos reales del player, acá se necesitan botones para poder verlos. */}
      <Section title="Tarjeta de perfil — simular">
        <div className="grid grid-cols-2 gap-2">
          <PanelButton onClick={onEpisodeEnd}>Fin de capítulo</PanelButton>
          <PanelButton
            onClick={() => playerDispatch({ type: "OPEN_OVERLAY", overlay: "pred" })}
          >
            Predicción
          </PanelButton>
          <PanelButton onClick={onLevelUp}>Subir de nivel</PanelButton>
          <PanelButton onClick={() => playerDispatch({ type: "TOGGLE_EXPANDED" })}>
            {player.expanded ? "Colapsar" : "Expandir"}
          </PanelButton>
        </div>
      </Section>

      <Section title="Cuenta — las dos variantes">
        <div className="grid grid-cols-2 gap-2">
          <PanelButton
            active={player.account === "guest"}
            onClick={() => playerDispatch({ type: "SET_ACCOUNT", account: "guest" })}
          >
            Invitado
          </PanelButton>
          <PanelButton
            active={player.account === "member"}
            onClick={() => playerDispatch({ type: "SET_ACCOUNT", account: "member" })}
          >
            Con cuenta
          </PanelButton>
        </div>
        <p className="mt-2 text-xs text-text-3">
          El 88% de Idilio consume como invitado. Sin cuenta no hay nivel, XP ni marco —
          la tarjeta ofrece crearla cuando ya hay racha que perder.
        </p>
      </Section>

      <Section title="Racha reclamada — saltar al día">
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <PanelButton
              key={day}
              onClick={() => showClaimedDay(day)}
              active={state.streakDay === day && state.claimedToday && !state.streakBroken}
            >
              {day}
            </PanelButton>
          ))}
        </div>
      </Section>

      <Section title="Situación de la racha">
        <div className="grid grid-cols-2 gap-2">
          <PanelButton onClick={showFirstTime} active={barState === 1}>
            Sin racha
          </PanelButton>
          <PanelButton onClick={showAvailable} active={barState === 2}>
            Con recompensa
          </PanelButton>
          <PanelButton onClick={showAtRisk} active={barState === 6}>
            Por vencer
          </PanelButton>
          <PanelButton onClick={showBroken} active={barState === 7}>
            Rota
          </PanelButton>
          <PanelButton onClick={showInsufficient} active={barState === 10}>
            Sin saldo
          </PanelButton>
        </div>
        <p className="mt-2 text-xs text-text-3">
          Es la máquina que corre por debajo de la tarjeta: decide si hay algo que reclamar,
          qué día de racha va y cuánto paga mañana.
        </p>
      </Section>

      <button
        type="button"
        onClick={() => set(RESET_FIELDS)}
        className="mt-4 h-11 w-full rounded-pill border border-white/20 text-sm font-bold text-text-2"
      >
        Reiniciar demo
      </button>

      <CurveComparison />
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-bold text-text-2">{title}</p>
      {children}
    </div>
  );
}
