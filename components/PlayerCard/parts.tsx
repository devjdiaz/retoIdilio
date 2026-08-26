import { FRAMES } from "@/lib/player/types";

/**
 * Piezas chicas y compartidas de la Player Identity Card.
 *
 * Los iconos son Lucide dibujados a mano en SVG. `CLAUDE.md` pide no sumar
 * dependencias sin preguntar, y cinco iconos no justifican una librería.
 */

export function Coin({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rounded-pill"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 32% 28%, var(--card-coin-hi), var(--card-coin) 55%, var(--card-coin-lo))",
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.35)",
      }}
    />
  );
}

export function Flame({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path
        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z"
        fill="var(--card-flame)"
      />
    </svg>
  );
}

export function Gift({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

export function Info({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export function ChevronUp({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export function Verified({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <circle cx="12" cy="12" r="11" fill="var(--card-violet)" />
      <path
        d="m7.5 12.4 3 3 6-6.4"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Avatar con marco. El marco ES el degradado: un padding coloreado alrededor
 * del interior. Un invitado no tiene marco —no tiene nivel que lo desbloquee—
 * así que recibe el neutro y sin glow.
 */
export function AvatarFrame({
  initial,
  size,
  frame,
  guest = false,
}: {
  initial: string;
  size: number;
  frame: number;
  guest?: boolean;
}) {
  const f = FRAMES[guest ? 0 : frame] ?? FRAMES[0];
  const pad = size >= 60 ? 3 : 2;
  return (
    <span
      className="grid shrink-0 place-items-center rounded-pill"
      style={{
        width: size,
        height: size,
        padding: pad,
        background: `linear-gradient(135deg, ${f.from}, ${f.to})`,
        boxShadow: guest ? undefined : `0 0 22px rgba(168,85,247,.35)`,
      }}
    >
      <span
        className="grid h-full w-full place-items-center rounded-pill font-sans font-bold"
        style={{
          background: "var(--card-avatar-inner)",
          color: guest ? "var(--card-ink-4)" : "var(--card-lila)",
          fontSize: Math.round(size * 0.37),
        }}
      >
        {initial}
      </span>
    </span>
  );
}

/**
 * Barra de XP. El easing largo del handoff —`cubic-bezier(.22,1,.36,1)` de
 * casi un segundo— es lo que hace que el XP se *vea* crecer en vez de saltar.
 * Es el único lugar de la tarjeta donde la animación es el mensaje.
 */
export function XPBar({
  value,
  max,
  height,
  slow = false,
}: {
  value: number;
  max: number;
  height: number;
  slow?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <span
      className="block w-full overflow-hidden rounded-pill"
      style={{ height, background: "rgba(255,255,255,.13)" }}
    >
      <span
        className="block h-full rounded-pill motion-reduce:transition-none"
        style={{
          width: `${pct}%`,
          background:
            height >= 6
              ? "linear-gradient(90deg, var(--card-xp), var(--card-xp-2))"
              : "var(--card-xp)",
          transition: `width ${slow ? 1100 : 900}ms cubic-bezier(.22,1,.36,1)`,
        }}
      />
    </span>
  );
}
