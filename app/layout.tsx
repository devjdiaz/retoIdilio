import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Tipografía: design-tokens.md declara Poppins como supuesto para el POC
// (la fuente real de la app no se pudo confirmar desde las capturas).
//
// Se cargan los 4 pesos que el handoff especifica y que la tarjeta usa de
// verdad. Con solo 500 y 700 el navegador sintetizaba el 600 y el 800 —
// falso bold, que se nota justo en los números grandes de la fila de stats.
// La regla de craft "máximo 2 pesos dentro de la barra" se sigue cumpliendo:
// la barra colapsada usa 700 y nada más; 600 y 800 viven en la tarjeta
// expandida. Cuatro subsets latinos de Poppins siguen siendo livianos para
// el Android de gama de entrada que describe el contexto del usuario final.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Idilio TV — Player Identity Card (POC)",
  description:
    "Prototipo de evaluación: capa de identidad y progreso en el reproductor — saldo, racha, nivel y recompensa diaria.",
};

// viewportFit: "cover" es lo que habilita env(safe-area-inset-bottom) en el
// dispositivo real; sin esto la tarjeta no puede respetar la safe area
// inferior.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        {children}
      </body>
    </html>
  );
}
