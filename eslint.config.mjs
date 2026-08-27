import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // El handoff es material de diseño, no código del POC: el prototipo y su
    // runtime vienen tal cual de la herramienta y no se editan acá.
    "design_handoff_player_identity_card/**",
  ]),
]);

export default eslintConfig;
