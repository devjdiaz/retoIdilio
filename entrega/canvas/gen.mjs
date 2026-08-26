// Genera los 10 artboards de estado de la barra de racha.
// Valores tomados literal de components/StreakBar/*.tsx, components/Player/*.tsx,
// lib/streak/copy.ts, lib/streak/economy.ts y app/globals.css.
import { writeFileSync } from "node:fs";

const HEAD = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; background: #000000; font-family: 'Poppins', 'Century Gothic', 'Avenir Next', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: #9B4DFF; } a:hover { color: #7B2FF7; }
    __EXTRA_CSS__
  </style>
</helmet>`;

const FOOT = `</x-dc>
</body>
</html>
`;

// Gradiente del video: valores exactos de components/FakeVideo.tsx.
const VIDEO = `  <div style="position:absolute;inset:0;background:linear-gradient(135deg, hsl(266,70%,12%) 0%, hsl(286,65%,18%) 50%, hsl(190,40%,10%) 100%);"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.74) 100%);"></div>`;

const SHADOW = "filter:drop-shadow(0 1px 3px rgba(0,0,0,0.9));";

// components/Player/EpisodeChrome.tsx — capítulo, serie y línea de progreso.
// Los metadatos se anclan sobre la barra: pb = 56 + safe area (34) + 16.
const chrome = (episode = 13) => `  <div style="position:absolute;top:0;left:0;right:0;z-index:10;padding:48px 16px 0;">
    <span style="display:flex;height:36px;width:36px;align-items:center;justify-content:center;border-radius:999px;background:rgba(255,255,255,0.15);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M11.5 3.5 6 9l5.5 5.5" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    </span>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:0;z-index:10;box-sizing:border-box;padding:0 16px 106px;">
    <p style="margin:0;font-size:14px;font-weight:400;color:#FFFFFF;${SHADOW}">Capítulo ${episode}</p>
    <p style="margin:0;font-size:18px;font-weight:700;color:#FFFFFF;${SHADOW}">Mi Mejor Pasajera</p>
    <p style="margin:4px 0 0;font-size:12px;font-weight:400;color:#9A9A9A;${SHADOW}">Capítulo ${episode} de 56</p>
    <div style="margin-top:12px;height:2px;width:100%;border-radius:999px;background:rgba(255,255,255,0.20);">
      <div style="height:100%;width:33.333%;border-radius:999px;background:rgba(255,255,255,0.70);"></div>
    </div>
  </div>`;

// CoinBalance.tsx: svg 22, r10 --coin, r6.5 stroke --coin-deep 1.25 op .6; número 16px/700 tabular.
const coin = (balance, danger) => `    <div style="display:flex;flex-shrink:0;align-items:center;gap:8px;">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <circle cx="11" cy="11" r="10" fill="#FFD84D"></circle>
        <circle cx="11" cy="11" r="6.5" fill="none" stroke="#E8A317" stroke-width="1.25" opacity="0.6"></circle>
      </svg>
      <span style="font-size:16px;font-weight:700;font-variant-numeric:tabular-nums;color:${danger ? "#FF453A" : "#FFD84D"};">${balance}</span>
    </div>`;

// StreakMessage.tsx: 14px/500. Con el monto movido al botón el texto ya entra;
// el truncado desde el inicio (dir=rtl) se conserva como red de seguridad.
const message = (text) => `      <p dir="rtl" style="margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;font-size:14px;font-weight:500;color:#FFFFFF;"><span dir="ltr">${text}</span></p>`;

// StreakProgress.tsx: 3 segmentos de 20×4, gap 4, lleno --violet / vacío --track.
const progress = (filled) => `      <div style="display:flex;flex-shrink:0;align-items:center;gap:4px;" role="img" aria-label="Racha: ${filled} de 3 días hacia la meta">
${[0, 1, 2].map((i) => `        <span style="height:4px;width:20px;border-radius:999px;background:${i < filled ? "#7B2FF7" : "#2E2E2E"};"></span>`).join("\n")}
      </div>`;

// ClaimButton.tsx: 44px de alto, pill, px-4 (el botón ahora carga el monto),
// 14px/700, --grad-cta. El glow va SOLO en el estado 2.
const button = (label, glow) => `      <button type="button" style="flex-shrink:0;height:44px;border:0;border-radius:999px;padding:0 16px;font-family:inherit;font-size:14px;font-weight:700;color:#FFFFFF;background-image:linear-gradient(90deg, #7B2FF7 0%, #9B4DFF 100%);${glow ? "box-shadow:0 0 20px rgba(123,47,247,0.45);" : ""}">${label}</button>`;

// 56px + safe area (34px) = 90px. Margen lateral 16px. Gap 8px.
const bar = ({ balance, danger, text, filled, cta, glow, cls, groupCls }) => {
  const inner = [];
  if (text) inner.push(message(text));
  if (filled !== undefined) inner.push(progress(filled));
  if (cta) inner.push(button(cta, glow));
  return `  <div${cls ? ` class="${cls}"` : ""} style="position:absolute;left:0;right:0;bottom:0;z-index:30;box-sizing:border-box;height:90px;padding:0 16px 34px;display:flex;align-items:center;gap:8px;background:rgba(0,0,0,0.55);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,0.08);">
${coin(balance, danger)}
    <div${groupCls ? ` class="${groupCls}"` : ""} style="display:flex;min-width:0;flex:1;align-items:center;justify-content:flex-end;gap:8px;">
${inner.join("\n")}
    </div>
  </div>`;
};

// components/Player/LockGate.tsx — el muro. Dispara el estado 10.
const chip = (label, value, danger) => `        <span style="display:flex;align-items:center;gap:8px;border-radius:999px;background:#1E1E1E;padding:8px 12px;">
          <span style="font-size:12px;font-weight:400;color:#9A9A9A;">${label}</span>
          <svg width="16" height="16" viewBox="0 0 22 22" aria-hidden="true">
            <circle cx="11" cy="11" r="10" fill="#FFD84D"></circle>
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="#E8A317" stroke-width="1.25" opacity="0.6"></circle>
          </svg>
          <span style="font-size:14px;font-weight:700;font-variant-numeric:tabular-nums;color:${danger ? "#FF453A" : "#FFD84D"};">${value}</span>
        </span>`;

const lockGate = (balance) => `  <div style="position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:0 16px;background:rgba(0,0,0,0.70);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);">
    <div style="width:100%;box-sizing:border-box;border-radius:20px;background:#141414;padding:24px;">
      <span style="display:flex;height:48px;width:48px;align-items:center;justify-content:center;border-radius:12px;background:#1E1E1E;">
        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
          <rect x="4.5" y="9.5" width="13" height="9" rx="2.5" fill="none" stroke="#7B2FF7" stroke-width="2"></rect>
          <path d="M7.5 9.5V7a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="#7B2FF7" stroke-width="2" stroke-linecap="round"></path>
        </svg>
      </span>
      <p style="margin:16px 0 0;font-size:18px;font-weight:700;color:#FFFFFF;">Desbloquea este episodio</p>
      <div style="margin-top:16px;display:flex;align-items:center;gap:8px;">
${chip("Costo", 15, false)}
${chip("Tu saldo", balance, balance < 15)}
      </div>
      <button type="button" style="margin-top:20px;height:48px;width:100%;border:0;border-radius:999px;font-family:inherit;font-size:16px;font-weight:700;color:#FFFFFF;background-image:linear-gradient(90deg, #7B2FF7 0%, #9B4DFF 100%);">Desbloquear</button>
      <button type="button" style="margin-top:12px;height:44px;width:100%;border:0;border-radius:999px;background:transparent;font-family:inherit;font-size:14px;font-weight:700;color:#9A9A9A;">Ver paquetes</button>
    </div>
  </div>`;

const screen = (body, extraCss = "") =>
  HEAD.replace("__EXTRA_CSS__", extraCss) +
  `\n<div style="position:relative;width:390px;height:844px;overflow:hidden;background:#000000;">\n${VIDEO}\n${chrome()}\n${body}\n</div>\n` +
  FOOT;

// Microcopy vigente: el monto viaja en el BOTÓN, no en el mensaje.
const states = [
  {
    // Fallback: ya reclamó y no hay racha que reportar. Con la corrección de
    // la contradicción, deja de ocurrir en el flujo normal.
    file: "Estado01.dc.html",
    bar: { balance: 20, text: "Vuelve mañana y gana monedas" },
  },
  {
    // Estado 2 es la corrección central y ahora también la primera sesión.
    // Sin mensaje: el botón ya dice el verbo y el número.
    file: "Main.dc.html",
    bar: { balance: 20, cta: "Reclamar +35", glow: true },
  },
  {
    file: "Estado03.dc.html",
    bar: { balance: 20, text: "Día 1 · Mañana +35", filled: 1 },
  },
  {
    file: "Estado04.dc.html",
    bar: { balance: 55, text: "Día 2 · Mañana +60", filled: 2 },
  },
  {
    file: "Estado05.dc.html",
    bar: { balance: 115, text: "¡Día 3! · Día 7: +250", filled: 3, groupCls: "celebra" },
    css: `.celebra { animation: pop-in 0.4s ease-out; animation-delay: 0.15s; animation-iteration-count: 1; }
    @keyframes pop-in { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
    @media (prefers-reduced-motion: reduce) { .celebra { animation: none; } }`,
  },
  {
    file: "Estado06.dc.html",
    bar: { balance: 190, text: "Vence en 3h", cta: "Reclamar +90" },
  },
  {
    file: "Estado07.dc.html",
    bar: { balance: 0, text: "Empieza de nuevo", cta: "Reclamar +20" },
  },
  {
    // 200ms ease-out, fade + translate Y. El ciclo largo deja ver la salida.
    file: "Estado08.dc.html",
    bar: { balance: 55, text: "Día 2 · Mañana +60", filled: 2, cls: "sale" },
    css: `.sale { animation: ocultar 3.2s ease-out infinite; }
    @keyframes ocultar { 0%, 20% { transform: translateY(0); opacity: 1; } 26.25%, 100% { transform: translateY(100%); opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .sale { animation: none; transform: translateY(100%); opacity: 0; } }`,
  },
  {
    // 250ms ease-out.
    file: "Estado09.dc.html",
    bar: { balance: 55, text: "Día 2 · Mañana +60", filled: 2, cls: "entra" },
    css: `.entra { animation: reaparecer 3.2s ease-out infinite; }
    @keyframes reaparecer { 0%, 20% { transform: translateY(100%); opacity: 0; } 27.8%, 100% { transform: translateY(0); opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .entra { animation: none; } }`,
  },
  {
    // El muro está arriba: el estado 10 se dispara desde ahí, no desde un toggle.
    file: "Estado10.dc.html",
    bar: { balance: 0, danger: true, text: "Te faltan 15", cta: "Reclamar +35" },
    gate: 0,
  },
];

for (const s of states) {
  const body = (s.gate !== undefined ? lockGate(s.gate) + "\n" : "") + bar(s.bar);
  writeFileSync(new URL(s.file, import.meta.url), screen(body, s.css ?? ""));
  console.log("escrito", s.file);
}
