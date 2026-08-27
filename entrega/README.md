# entrega/ — fuentes de las páginas publicadas

Acá vive el **código fuente** de lo que está publicado como link. Las páginas en sí viven en
claude.ai; esto es lo que permite volver a editarlas.

| Archivo | Publica en | Entregable |
|---|---|---|
| `racha-idilio.html` | [Racha Idilio](https://claude.ai/code/artifact/53850c3b-a2ea-4317-9209-538faa10d8ff) | 5.1 · 5.2 · 5.4 |
| `pen-dev-tarjeta.html` | [La tarjeta en pen.dev](https://claude.ai/code/artifact/85eae30d-c579-4604-81b8-edf21f409900) | 5.3 |
| `canvas/barra-de-racha-idilio.html` | — *ya no se enlaza, ver abajo* | — |

`racha-idilio.html` es la **página de entrega**: el link único que pide el apartado 8 del
reto. Contiene diagnóstico, estrategia y la intervención, y enlaza al diseño en pen.dev,
al POC y al repositorio.

Para actualizar cualquiera de las dos: editar el archivo y republicar sobre la **misma URL**.
El link que ya enviaste no cambia — **pero** si el artefacto tiene fijada una versión en su
panel `Share`, republicar no basta: hay que mover el pin, o quien abre el link sigue viendo
la anterior. Lo más seguro es dejarlo en «Latest».

---

## canvas/ — ya no es entregable

Los 16 artboards de la **primera versión** (la barra de racha), uno por archivo, más el
bundle publicable.

**La página de entrega ya no lo enlaza.** Dos razones, y la segunda es dura:

1. Son pantallas del modelo anterior. El entregable 5.3 es la tarjeta.
2. El artefacto publicado **no se puede hacer público**: ofrece descarga de archivos, y
   claude.ai bloquea el enlace público en ese caso — «This Artifact offers file downloads,
   so it can't be shared publicly». No hay clic que lo arregle.

Se conserva en el repositorio como registro de esa primera versión, que es donde
corresponde. Quien quiera verlo abre los `.dc.html` de esta carpeta.

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

El archivo vive en [`../design/idilio-player-identity-card.pen`](../design/) y sus
exportaciones en [`../design/export/`](../design/export/). Son 14 artboards del modelo
actual —barra colapsada, tarjeta expandida, las cuatro hojas, los dos overlays, el muro y el
flujo— con los tokens de `design-tokens.md` y la paleta `card-` del handoff cargados como
variables del documento.

La página que muestra esos PNG se publica desde `pen-dev-tarjeta.html` (tabla de arriba).

> **Pendiente manual:** ese artefacto está **privado**. Hay que compartirlo desde el menú de
> la página para que el enlace de la sección 03 abra para el evaluador. Y la página de
> entrega tiene una versión anterior **fijada**: hay que soltar el pin para que el evaluador
> vea la última.
