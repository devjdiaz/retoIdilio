# design/ — el 5.3, hecho en pen.dev

El reto sugiere Figma. Esto se diseñó en **pen.dev**, que es una herramienta de diseño con
archivo propio, componentes, variables y exportación.

| Archivo | Qué es |
|---|---|
| `idilio-barra-de-racha.pen` | El archivo de diseño. Se abre con Pencil |
| `export/` | PNG exportados del archivo, a 1× |

El `.pen` está encriptado y sólo lo abre Pencil, así que los PNG se versionan a propósito:
son lo que hace el diseño inspeccionable sin instalar nada.

---

## Cómo está construido

La barra existe **una sola vez**, como componente reutilizable en el origen del canvas. Las
pantallas empiezan en `y = 200`. Los diez estados son instancias con overrides de texto y de
visibilidad — editar el componente cambia los diez a la vez.

```
Barra de racha · componente     390×90   vertical
├─ Contenido                    390×56   horizontal · space_between
│  ├─ Saldo                     moneda + cantidad
│  └─ Estado activo             mensaje · indicador · CTA
└─ Safe area                    390×34
```

Los tokens de [`../design-tokens.md`](../design-tokens.md) están cargados como **23
variables del documento**: colores, radios, medidas y la fuente.

**El indicador viene apagado en el componente.** Con mensaje, indicador y CTA encendidos a la
vez el grupo mide 353px, y en la barra hay 358 útiles menos los 52 del saldo. Ningún estado
real lleva los tres: el máximo son dos de tres. La base es mensaje + CTA —la forma de los
estados 6, 7 y 10— y cada instancia enciende o apaga desde ahí.

**El glow no está en el componente.** Va como override sólo en el estado 2. Si aparece en
tres estados deja de significar urgencia.

**El safe area es un frame de 34px, no padding.** Así la anatomía se mide en el canvas.

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
