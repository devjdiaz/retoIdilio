import type { ReactNode } from "react";

/**
 * Marco de teléfono 390×844. Alcance de CLAUDE.md: "Contenedor mobile
 * 390×844 centrado, con marco de teléfono". No es una pantalla del
 * producto — es el escenario de la demo. El centrado en la pantalla vive
 * un nivel arriba (DemoStage), porque ahí también entra el DemoPanel.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[844px] w-[390px] shrink-0 overflow-hidden rounded-[48px] border-[10px] border-black bg-bg shadow-[0_0_0_2px_rgba(255,255,255,0.08)]">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 z-20 h-[24px] w-[120px] -translate-x-1/2 rounded-b-2xl bg-black" />
      <div className="relative h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}
