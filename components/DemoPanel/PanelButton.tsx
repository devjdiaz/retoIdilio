import type { ReactNode } from "react";

export function PanelButton({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 rounded-pill px-3 text-left text-sm font-bold transition-colors duration-150 ease-out ${
        active ? "bg-violet text-white" : "bg-surface-2 text-text"
      }`}
    >
      {children}
    </button>
  );
}
