"use client";

import { useState } from "react";
import { CURVA_ACTUAL, CURVA_PROPUESTA } from "@/lib/streak/curve";

type View = "both" | "actual" | "propuesta";

const VIEWS: { key: View; label: string }[] = [
  { key: "both", label: "Ambas" },
  { key: "actual", label: "Actual" },
  { key: "propuesta", label: "Propuesta" },
];

// Escala común a ambas filas para que la comparación sea honesta.
const MAX = Math.max(...CURVA_ACTUAL, ...CURVA_PROPUESTA);

// Días donde la curva actual retrocede (60 → 50 → 40) — el hallazgo que
// estados.md pide destacar, justo donde el 94% de los usuarios se cae.
const REGRESSION_DAYS = new Set([4, 5]);

function CurveRow({
  label,
  values,
  dangerDays,
}: {
  label: string;
  values: readonly number[];
  dangerDays?: Set<number>;
}) {
  return (
    <div className="flex items-end gap-2">
      <span className="w-16 shrink-0 pb-1 text-xs font-bold text-text-2">{label}</span>
      <div className="flex h-14 flex-1 items-end gap-1">
        {values.map((value, i) => {
          const day = i + 1;
          const danger = dangerDays?.has(day) ?? false;
          const heightPct = Math.max(Math.round((value / MAX) * 100), 8);
          return (
            <div key={day} className="flex flex-1 flex-col items-center gap-0.5">
              <span className={`text-[10px] leading-none ${danger ? "text-danger" : "text-transparent"}`}>
                ↓
              </span>
              <div
                className={`w-full rounded-t-md ${danger ? "bg-danger" : "bg-coin"}`}
                style={{ height: `${heightPct}%` }}
              />
              <span
                className={`text-[10px] tabular-nums ${danger ? "text-danger" : "text-text-2"}`}
              >
                +{value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * No es funcionalidad de la tarjeta: es material para la sesión con Idilio.
 * estados.md → "Corrección de la curva de racha".
 */
export function CurveComparison() {
  const [view, setView] = useState<View>("both");

  return (
    <div className="mt-5 border-t border-white/8 pt-4">
      <p className="text-xs font-bold uppercase tracking-wide text-text-2">
        Comparación — para la sesión
      </p>
      <p className="mt-1 text-xs text-text-2">
        No es parte de la tarjeta: material para mostrar el hallazgo en la reunión.
      </p>

      <div className="mt-3 flex gap-2">
        {VIEWS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key)}
            className={`h-8 rounded-pill px-3 text-xs font-bold ${
              view === key ? "bg-violet text-white" : "bg-surface-2 text-text-2"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {(view === "both" || view === "actual") && (
          <CurveRow label="Actual" values={CURVA_ACTUAL} dangerDays={REGRESSION_DAYS} />
        )}
        {(view === "both" || view === "propuesta") && (
          <CurveRow label="Propuesta" values={CURVA_PROPUESTA} />
        )}
      </div>

      <p className="mt-3 text-xs text-text-2">
        Días 4 y 5 de la curva actual retroceden (60 → 50 → 40) — justo donde el 94% de los
        usuarios se cae. La propuesta nunca baja.
      </p>
    </div>
  );
}
