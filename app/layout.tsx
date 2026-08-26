import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Tipografía: design-tokens.md declara Poppins como supuesto para el POC
// (la fuente real de la app no se pudo confirmar desde las capturas).
// Solo se cargan los 2 pesos que usa la barra (500 y 700) — regla de craft
// "máximo 2 pesos tipográficos dentro de la barra" y nada pesado para el
// Android de gama de entrada que describe el contexto del usuario final.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Idilio TV — Barra de racha (POC)",
  description: "Prototipo de evaluación: barra persistente de saldo y racha diaria.",
};

// viewportFit: "cover" es lo que habilita env(safe-area-inset-bottom) en el
// dispositivo real; sin esto la barra no puede respetar la safe area inferior.
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
