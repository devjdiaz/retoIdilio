# entrega/ — fuentes de las páginas publicadas

Acá vive el **código fuente** de lo que está publicado como link. Las páginas en sí viven en
claude.ai; esto es lo que permite volver a editarlas.

| Archivo | Publica en | Entregable |
|---|---|---|
| `racha-idilio.html` | [Racha Idilio](https://claude.ai/code/artifact/53850c3b-a2ea-4317-9209-538faa10d8ff) | 5.1 · 5.2 · 5.4 |
| `canvas/barra-de-racha-idilio.html` | [Canvas de diseño](https://claude.ai/code/artifact/894e64be-8c13-4a61-9b65-ed7a28ef9808) | 5.3 |

`racha-idilio.html` es la **página de entrega**: el link único que pide el apartado 8 del
reto. Contiene diagnóstico, estrategia y la intervención, y enlaza al canvas y al POC.

Para actualizar cualquiera de las dos: editar el archivo y republicar sobre la **misma URL**.
El link que ya enviaste no cambia.

---

## canvas/

Los 16 artboards del canvas, uno por archivo, más el bundle publicable.

**Ojo con el nombre:** el artboard del **estado 02** se llama `Main.dc.html`, no
`Estado02.dc.html` — el canvas nombra así su artboard principal. No falta ninguno.

```
canvas/
  barra-de-racha-idilio.html   ← el bundle que se publica (2.5 MB)
  canvas.json                  ← posiciones, páginas y títulos
  Main.dc.html                 ← estado 02 · Recompensa disponible ★
  Estado01 · 03 … 10           ← el resto de los estados
  Anatomia · Tokens · Curva · AntesDespues
  Flujo · Prioridad
```

---

## Y la herramienta de diseño

El reto sugiere Figma para el 5.3. El diseño se hizo en **pen.dev**, que es una herramienta
de diseño con archivo propio, componentes, variables y exportación.

El archivo vive en [`../design/idilio-barra-de-racha.pen`](../design/) y sus exportaciones
en [`../design/export/`](../design/export/). La barra existe una sola vez como componente
reutilizable: los diez estados son instancias con overrides de texto y visibilidad, y los
tokens de `design-tokens.md` están cargados como 23 variables del documento.

| Archivo | Publica en | Entregable |
|---|---|---|
| `../design/export/` | [Los diez estados en pen.dev](https://claude.ai/code/artifact/85eae30d-c579-4604-81b8-edf21f409900) | 5.3 |

> Ese artefacto está **privado**. Hay que compartirlo desde el menú de la página para que el
> enlace de la sección 03 abra para el evaluador.
