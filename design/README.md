# design/ — el 5.3, hecho en pen.dev

El reto sugiere Figma. Esto se diseñó en **pen.dev**, que es una herramienta de diseño con
archivo propio, componentes, variables y exportación.

| Archivo | Qué es |
|---|---|
| `idilio-player-identity-card.pen` | El archivo de diseño. Se abre con Pencil |
| `export/` | PNG exportados del archivo, a 1× |

El `.pen` está encriptado y sólo lo abre Pencil, así que los PNG se versionan a propósito:
son lo que hace el diseño inspeccionable sin instalar nada.

---

## Los catorce artboards

```
01–03  Barra colapsada      con recompensa · reclamada · invitado
04–06  Tarjeta expandida    con cuenta · invitado · reclamada
07–10  Hojas                wallet · racha · progreso · marcos
11–12  Overlays             fin de capítulo · predicción
13     Muro                 saldo insuficiente
14     Flujo de la tarjeta
```

Los tres primeros y los tres siguientes son el mismo objeto en sus dos alturas: la barra de
56px que se ve por defecto, y la tarjeta que se abre al tocarla. Las dos variantes de cuenta
—con cuenta e invitado— están en ambas, porque el 88% de Idilio consume como invitado y esa
es la variante que más gente vería.

El artboard 14 es el flujo: las dos ramas de la decisión, las cuatro superficies y el
retorno al video.

---

## Cómo está construido

Los tokens de [`../design-tokens.md`](../design-tokens.md) están cargados como **variables
del documento**, más la paleta `card-` del handoff. Editar una variable cambia los catorce
artboards a la vez.

**Dos defectos salieron de medir cajas, sin necesitar el render:** el subtítulo de la barra
de invitado medía 185px en un contenedor de 172, y «Racha mantenida» medía 100px en un tile
con 82 útiles. Los dos se recortaban. Corregidos en el archivo.

### La versión anterior

El archivo tuvo once pantallas de una **barra de racha de diez estados**, la primera
intervención. Se borraron de pen.dev cuando la tarjeta pasó a ser el modelo: pen.dev es el
modelo actual, y el registro de esa primera versión vive en el canvas de 16 artboards
([`../entrega/canvas/`](../entrega/canvas/)) y en el historial de git.

Aquella barra existía una sola vez como componente reutilizable y los diez estados eran
instancias con overrides. Dos decisiones de ese armado siguen valiendo en la tarjeta: el
**glow va sólo donde hay recompensa disponible** —si aparece en tres lugares deja de
significar urgencia— y el **safe area es un frame de 34px, no padding**, para que la
anatomía se mida en el canvas.

---

## Tres cosas de la API de Pencil que cuestan de encontrar

- **`width` y `height` no aceptan variables.** Un string se lee como `SizingBehavior`
  (`fit_content`, `fill_container`) antes que como referencia, así que `"$safe-area"` cae en
  `fit_content` y colapsa a 0 en silencio. Los tokens de color y `cornerRadius` sí resuelven.
  Las medidas van literales.
- **`descendants` en el `Insert` de un `ref` se descarta.** Los overrides de una instancia van
  por `Update("instancia/hijo", {...})`.
- **`Export` y `TakeScreenshot` van una llamada atrás.** Hay que exportar en una llamada
  aparte, si no se verifica contra un render viejo.
