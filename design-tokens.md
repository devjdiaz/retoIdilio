# design-tokens.md — Idilio TV

Extraído de capturas de la app en producción (iOS, agosto 2026). Los valores marcados
`~aprox` son estimaciones desde pixel; se ajustan si se consigue el valor exacto.

**Regla:** ningún color, tamaño o radio entra al código si no está en este archivo.

---

## Color

### Fondo y superficie
| Token | Valor `~aprox` | Uso |
|---|---|---|
| `--bg` | `#000000` | Fondo global. Negro puro, no gris oscuro. |
| `--surface` | `#141414` | Cards de listado (recompensas, ajustes) |
| `--surface-2` | `#1E1E1E` | Chips y pills ("Tu balance", "Costo del episodio") |
| `--surface-violet` | `#2A0E4A` | Card destacada / plan recomendado |
| `--overlay` | `rgba(0,0,0,0.55)` | Capa sobre video |

### Marca
| Token | Valor `~aprox` | Uso |
|---|---|---|
| `--violet` | `#7B2FF7` | **Acento primario.** Botones, iconos, activo |
| `--violet-bright` | `#9B4DFF` | Gradiente de botón (extremo claro) |
| `--violet-logo` | `#C44BF0` | Magenta del isotipo |
| `--cyan-logo` | `#5CC9C9` | Segundo elemento del isotipo |
| `--amber-logo` | `#F0A93B` | Tercer elemento del isotipo |

El logotipo es tres formas —magenta, cian, ámbar— que leen como una onda de audio.
El cian y el ámbar **solo existen en el logo**; no son colores de UI.

### Economía (crítico — es el sistema que se interviene)
| Token | Valor `~aprox` | Uso |
|---|---|---|
| `--coin` | `#FFD84D` | Número de monedas, precios. **Amarillo = valor.** |
| `--coin-deep` | `#E8A317` | Borde/sombra de la moneda, badge de oferta |
| `--coin-locked` | `#B9A8CC` | Moneda de día futuro, desaturada |
| `--price` | `#FFD84D` | Precios de suscripción |

### Semántica
| Token | Valor `~aprox` | Uso |
|---|---|---|
| `--success` | `#3ED07A` | Checks de features, "Completa la serie" |
| `--danger` | `#FF453A` | Saldo en cero dentro del modal de racha |
| `--text` | `#FFFFFF` | Texto primario |
| `--text-2` | `#9A9A9A` | Descripciones, labels de tab inactivo |
| `--text-3` | `#6B6B6B` | Legales, "Cancela cuando quieras" |

### Progreso de racha
| Token | Valor | Uso |
|---|---|---|
| `--track` | `#2E2E2E` | Segmento vacío del indicador de racha. `--surface-2` aclarado ~1.5×. |

El segmento lleno usa `--violet`. No lleva token propio: es el acento primario ya definido.

Contraste verificado sobre `--bg`:

| Par | Ratio | Veredicto |
|---|---|---|
| `--violet` sobre negro | **3.6:1** | Pasa AA no-textual (≥3:1). Es el elemento informativo. |
| `--track` sobre negro | **1.6:1** | Se lee como riel sin competir con el lleno. |

`--surface-2` puro se evaluó y se descartó: **1.26:1**, invisible sobre negro. El segmento
vacío desaparecía y el indicador perdía lo único que aporta — cuánto falta.

Aclarar más el riel tampoco sirve: lo acerca en luminancia a `--violet` y el borde entre
lleno y vacío se lee *peor*, no mejor.

### Gradientes
```css
--grad-cta: linear-gradient(90deg, #7B2FF7 0%, #9B4DFF 100%);
--grad-modal-racha: linear-gradient(160deg, #4A1A7A 0%, #2A0E4A 100%);
```

#### Hallazgo de contraste — el extremo claro del CTA no pasa AA

Blanco sobre el gradiente, medido a lo largo del recorrido del texto:

| Punto del gradiente | Color | Contraste con blanco | Veredicto |
|---|---|---|---|
| 0% | `#7B2FF7` | **5.85:1** | Pasa |
| 50% | `#8B3EFB` | **5.02:1** | Pasa |
| 82% | `#9548FE` | **4.53:1** | Límite |
| 100% | `#9B4DFF` | **4.29:1** | **No pasa** |

El texto del CTA es de **14px bold**, que no califica como "texto grande" (requiere 18.66px
bold o 24px normal), así que el umbral es 4.5:1 y no 3:1. El último ~15% del gradiente queda
por debajo — y es justo donde termina un label largo como `Reclamar +250`.

**Corrección aplicada en el POC:** la parada del extremo claro se estira al **130%**, de modo
que el botón solo recorre hasta el 77% del gradiente y el peor punto queda en **4.61:1**. Los
dos colores siguen siendo los de esta tabla y el gradiente se lee igual; lo único que cambia
es que su extremo más claro queda fuera del área de texto.

Es un hallazgo sobre el sistema real de Idilio, no sobre el POC: el gradiente de producción
tiene el mismo problema en cualquier botón con texto de 14px.

### Glow — firma visual de Idilio
Las ofertas usan **borde de 1–2px + glow externo del mismo color**. No sombra difusa.
```css
--glow-amber:  0 0 20px rgba(255,216,77,0.45);
--glow-violet: 0 0 20px rgba(123,47,247,0.45);
```
Es el recurso más distintivo de la app. **Usarlo con disciplina: solo para lo que urge.**

---

## Tipografía

Sans geométrica redondeada, terminales limpias, `a` de un piso, contraste bajo.
`~aprox` — no se pudo confirmar el nombre. Alternativas en orden de cercanía:
**Poppins**, **Gilroy**, **Greycliff CF**.

**Decisión para el POC:** Poppins (Google Fonts, gratis). Declararlo como supuesto.

| Rol | Tamaño `~aprox` | Peso | Ejemplo en la app |
|---|---|---|---|
| Display | 32–34px | 700 | "¡La historia continúa!" |
| Title | 22–24px | 700 | "Recompensas", "Perfil" |
| Section | 19–20px | 700 | "Estrenos", "Tú decides" |
| Body-strong | 17–18px | 600 | "Invita a tus amigos" |
| Body | 15–16px | 400 | Descripciones |
| Caption | 13px | 400 | "COP / mes" |
| Label | 11–12px | 600, tracking amplio | "SEMANAL", "RECOMENDADO" |
| Tab | 11px | 500 | "Inicio", "Perfil" |
| Coin | 17–20px | 700 | El número de monedas, siempre `--coin` |

Los labels de categoría van en **mayúsculas con tracking amplio**. Es un patrón consistente.

---

## Espaciado y forma

Escala: **4 / 8 / 12 / 16 / 20 / 24 / 32**. Margen lateral de pantalla: **16px**.

| Token | Valor `~aprox` |
|---|---|
| `--r-pill` | `999px` — botones CTA, chips, badges |
| `--r-card` | `16px` — cards de recompensa |
| `--r-card-lg` | `20px` — planes, modales |
| `--r-icon` | `12px` — contenedor de icono |

**La app es marcadamente redondeada.** Los CTA son pills completos. Un borde recto rompe
la identidad de inmediato.

---

## Iconografía

- **Estilo:** outline, grosor `~2px`, esquinas redondeadas. Tamaño 24px, 28px en tab bar.
- **Color:** `--violet` en listados; blanco en tab activo, `--text-2` en inactivo.
- **La moneda es la excepción:** ilustración dorada con volumen, no outline. Tiene tres
  variantes según cantidad: una moneda / pila pequeña / pila grande.
- Iconos de marcas externas (Facebook, TikTok, YouTube) se tiñen de violeta, no van en su
  color original.

---

## Estructura de navegación

Tab bar de **3 destinos**, fondo `--bg` con separador `1px rgba(255,255,255,0.08)`:
`Inicio` · `Recompensas` · `Perfil`

**Activo:** icono blanco + label blanco. **Inactivo:** ambos `--text-2`. Sin píldora de
fondo, sin indicador. Altura `~56px` + safe area.

### La superficie clave — barra del reproductor
En el reproductor existe hoy una franja inferior con **solo el icono de moneda y el saldo**,
alineada a la izquierda, sobre el fondo del video. Sin racha, sin progreso, sin acción.

**Esa es la superficie que se interviene.** No se crea nada nuevo: se activa lo que ya está.

---

## Tono de voz

Ejemplos literales de la app:
- "¡La historia continúa!"
- "Desbloquea los siguientes episodios"
- "Termina tus series favoritas completando tu racha. ¡Vuelve todos los días y reclama cada vez más!"
- "Reclama tu recompensa diaria"
- "Vuelve mañana y reclama +40 monedas"
- "No tienes una cuenta registrada. Puedes registrarte en cualquier momento."

**Patrón:** segunda persona informal (tú), imperativo directo, exclamación en momentos de
recompensa, emoji ocasional (🔥 en "RACHA IDILIO", ✅ en confirmación). Español neutro
LATAM. Los botones dicen el verbo: "Elegir", "Ver anuncio", "Reclamar".

**Regla derivada para el POC:** mantener el registro entusiasta sin caer en publicidad. El
número siempre visible; el usuario nunca pregunta cuánto tiene o cuánto le falta.

---

## Economía observada — datos reales de la app

| Dato | Valor |
|---|---|
| Costo de un episodio | **15 monedas** |
| Saldo inicial de invitado | 0 |
| Episodios gratis | hasta el 12 (bloqueo en el 13 de 56) |
| Recompensa por anuncio | 15 monedas · límite 10/día |
| Paquetes | 180/$2.500 · 375/$13.500 · 725/$25.500 COP |
| Suscripción | $12.500/sem · $24.500/mes COP |
| Bono por crear cuenta | hasta +30 |

### Curva de racha actual (7 días)
```
Día 1   +15   ✅ reclamado
Día 2   +40
Día 3   +60
Día 4   +50   ← RETROCEDE
Día 5   +40   ← RETROCEDE
Día 6   +45
Día 7   +200
```

⚠️ **Hallazgo del uso de la app.** La curva no es monotónica: el día 4 y el día 5 valen
menos que el día 3. La progresión se rompe exactamente en el tramo donde el reto reporta
que el 94% de los usuarios se cae. Además el día 1 entrega 15 = el costo exacto de un
episodio, así que no hay acumulación posible y por tanto no hay tensión ahorro/gasto.

Esto no es un supuesto: está en pantalla. **Va en el diagnóstico.**

---

## Supuestos declarados

1. Tipografía no confirmada → Poppins como sustituto.
2. Hex desde captura, sin acceso a los tokens reales.
3. Capturas de iOS; en Android puede variar el detalle.
4. Solo se observó el estado de usuario invitado con saldo 0.
