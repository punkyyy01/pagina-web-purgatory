# AUDIT.md — Purgatory Web · Fase 0

> Generado el 2026-04-28. Solo observación; ningún archivo fue modificado.

---

## 1. Inconsistencias entre páginas

### 1.1 CSP (Content-Security-Policy)

| Página | `script-src` | `img-src` | Notas |
|---|---|---|---|
| `index.html` | `'self' 'unsafe-inline' https://cdnjs.cloudflare.com` | `'self' data: https://cdn.discordapp.com` | GSAP viene de CDN; `unsafe-inline` activado |
| `lore.html` | `'self'` | `'self' data:` | Correcto |
| `personajes.html` | `'self'` | `'self' data:` | Falta `https://cdn.discordapp.com` (no lo necesita, bien) |
| `mapa.html` | `'self'` | `'self' data:` | Correcto |
| `eventos.html` | `'self'` | `'self' data: https://cdn.discordapp.com` | Correcto |
| `404.html` | `'self'` | `'self' data:` | Correcto |

Ninguna página incluye `object-src 'none'` (requerido por la política objetivo).

### 1.2 Nav links

- **`index.html`**: `#timeline`, `lore.html`, `personajes.html`, `mapa.html`, `eventos.html`, `#infierno`. **No hay "Inicio"** (el brand apunta a `href="#"`, los demás lo apuntan a `href="index.html"`).
- **Resto de páginas**: `index.html`, `lore.html`, `personajes.html`, `mapa.html`, `eventos.html`. No tiene `#timeline` ni `#infierno`.
- **Ninguna página** marca el link activo con `aria-current="page"` ni clase `.is-active`.

### 1.3 CSS externo vs. inline

- `index.html` tiene un bloque `<style>` de **~1488 líneas** y **no carga `styles.css` ni `pages.css`**. Es un monolito autónomo.
- El resto de páginas cargan `styles.css` + `pages.css` y no tienen `<style>` inline.
- Consecuencia: hay dos versiones paralelas del CSS que ya han empezado a divergir (ver §2).

### 1.4 Scripts

`index.html` no carga ningún `.js` externo propio del proyecto. Tiene inline:

| Script inline (líneas) | Equivalente externo |
|---|---|
| 2145–2534 (~390 líneas) | `scripts.js` duplicado/modificado |
| 2535–2729 (~194 líneas) | `easter-eggs.js` duplicado |
| 2730–2867 (~138 líneas) | `index-events.js` duplicado |
| 2875–3174 (~300 líneas) | Animaciones GSAP (nuevo código) |

El resto de páginas cargan los archivos externos con `defer`.

**Vercel Analytics** (`/_vercel/insights/script.js`) solo existe en `index.html`; las páginas internas no tienen analíticas.

### 1.5 Meta tags

Todas las páginas tienen el mismo bloque `<head>` base (referrer, viewport, favicon, theme-color) excepto:
- `index.html`: sin `<link rel="canonical">`, sin OG, sin Twitter Card.
- Ninguna página tiene OG / Twitter Card / JSON-LD / manifest / canonical / robots.

---

## 2. Código duplicado

### 2.1 Logo SVG

El mismo SVG (triángulo purple→cyan) aparece **12 veces** como data URI:
- 6 páginas × `<link rel="icon">` = 6 veces
- 6 páginas × `<img src="data:image/svg+xml,...">` en el nav = 6 veces

Ya existe `assets/logo.svg` en el repo y no se usa desde HTML.

Nota: el `opacity` difiere entre el favicon (`.95`) y el logo del nav (`0.95`) — diferencia inofensiva pero prueba de copy-paste.

### 2.2 Header y footer

Bloque idéntico copiado en las 6 páginas. Cualquier cambio en el nav requiere editar 6 archivos a mano.

### 2.3 CSS duplicado entre `index.html` inline y `styles.css`

El `<style>` de `index.html` contiene prácticamente toda la hoja `styles.css` + `pages.css`. Las divergencias encontradas:

| Selector | `styles.css` | `index.html` inline |
|---|---|---|
| `.revealed` | `opacity:1!important; transform:translateY(0)!important` | Sin `!important` |
| `body.gsap-ready .reveal-init` | Ausente | `transition:none` (para que GSAP controle) |
| `.hero-visual img` | `animation:floaty … ; will-change:transform` | `animation:floaty …` (falta `will-change`) |

### 2.4 JS duplicado

`scripts.js`, `easter-eggs.js` e `index-events.js` existen como archivos externos **y** están copiados inline en `index.html`. Cambiar los archivos externos no afecta a la home; hay que cambiar dos lugares.

---

## 3. Estilos inline en `index.html` (que deberían estar en CSS externo)

### 3.1 Bloque `<style>` en el `<head>` (1488 líneas)

Toda la hoja de estilos está inline. El desglose:

- **Tokens / reset / base** (líneas 27–58): duplica `:root`, reset, `html`, `body`.
- **Componentes compartidos** (líneas 59–597): `container`, progress bar, canvas, header, nav, banner, hero, sections, cards, stats, modal, footer, cursor, responsive.
- **Secciones de la home** (líneas 270–596): `.genesis-*`, `.infierno-*`, `.timeline-*`, `.stat-*`, `.condemned-*`, `.conclusion-*`, `.mapa-preview-*`, `.eventos-preview-*`.
- **`pages.css` completo copiado** (líneas 689–1411): page-hero, back-link, lore, personajes, eventos, mapa, 404, easter eggs.
- **GSAP-only CSS** (líneas 1412–1488): `.section-orb`, `.grid-bg`, `.circuit-svg`, `.card-mouse-glow`, `.tl-dot-ring`, `.site-banner__img` will-change.

### 3.2 Inline styles en HTML

| Archivo | Localización | Ejemplo |
|---|---|---|
| `lore.html` | Div wrapper CTA (línea 165) | `style="text-align:center;margin-top:40px;"` |
| `lore.html` | Botón "Ver Personajes" (línea 168) | `style="margin-left:12px;"` |
| `404.html` | Botón ghost (línea 31) | `style="margin-left:12px;"` |
| `personajes.html` | `.modal-panel` (línea 67) | `style="max-width:650px"` |
| `eventos-loader.js` | HTML generado | `style="width:100%;border-radius:10px;..."` |
| `index-events.js` | HTML generado | Múltiples estilos en spans |
| `mapa.html` | Texto SVG `<text>` | `style="font-size:13px;font-weight:700"` (en varios nodos) |

---

## 4. Selectores CSS muertos o sin uso en páginas actuales

| Selector | Archivo | Motivo |
|---|---|---|
| `.char-card-quote` | `pages.css` | `personajes-data.js` no renderiza el elemento `.char-card-quote` (solo `char-card-desc`) |
| `#lore-avanzado .card` | `scripts.js` (revealEls) | No existe `#lore-avanzado` en ningún HTML |
| `.logo.small` | `styles.css` | No hay ningún elemento con `class="logo small"` |
| `.character-card` / `.character-avatar` | `styles.css` | Estilo para el mini-preview de personajes en index.html; pero el HTML inline del index usa `.char-card` en personajes-data y `.character-card` solo en la sección "personajes" del home. Verificar si realmente se usa. |
| `#conclusion p` | `scripts.js` (revealEls) | `#conclusion` solo existe en `index.html`; safe en otras páginas (no rompe, pero es ruido) |
| `[data-character]` | `styles.css` | El atributo `data-character` existe en `index.html` (mini tarjetas de la home), pero el modal `#character-modal` es un sistema paralelo al `#char-detail-modal` de `personajes.html`. Revisar si ambos están activos. |

---

## 5. Animaciones GSAP del `index.html` no replicadas en otras páginas

Todas las siguientes animaciones **solo existen en `index.html`** dentro del inline script GSAP:

| Animación | Descripción |
|---|---|
| **Hero entrance** | `h1`, `.lead`, `.hero-actions`, `.hero-visual` animados desde opacity/y al cargar |
| **Grid overlay** | `.grid-bg` fade-in en 3s (motif de "encendido") |
| **Floating orbs** | 10 orbes (violet/cyan/fire) con yoyo infinito vía GSAP |
| **Circuit pulses** | 5 puntos viajando por líneas SVG con `attr:{cx,cy}` |
| **Timeline dot rings** | Anillos de pulso expansivo en cada `.timeline-dot` |
| **Banner parallax** | `ScrollTrigger` scrub en `.site-banner__img` |
| **Orb parallax con scroll** | 6 orbes con efecto de profundidad en scroll |
| **Scroll reveals** | `.section-title`, `.timeline-item`, `.cards`, `.condemned-card`, etc. animados desde posición al entrar al viewport |
| **Card mouse glow** | Gradiente radial que sigue el cursor en cada `.card` |
| **Magnetic buttons** | `.btn` se desplazan levemente hacia el cursor |
| **Press effect** | Escala elástica en `pointerdown/pointerup` en `.btn` |
| **Nav link hover** | `y:-2` en hover con GSAP (otras páginas no tienen esto) |
| **Genesis chapter hover** | `x:6` al hacer hover |

En las otras 4 páginas, los reveals son solo CSS (`reveal-init`/`revealed` via IntersectionObserver). No hay orbes, no hay glow en cards, no hay press effect en botones.

---

## 6. Accesibilidad

| Problema | Páginas afectadas | Severidad |
|---|---|---|
| Sin link "saltar al contenido" (`<a href="#main">Skip to main content</a>`) | Todas | Alta |
| `nav-toggle` sin `aria-expanded` | Todas | Alta |
| Ningún nav link activo tiene `aria-current="page"` | Todas | Alta |
| `.char-card` tiene `role="button"` pero sin `tabindex="0"` → no es enfocable por teclado | `personajes.html` | Alta |
| `.char-card` no tiene handler `keydown` para Enter/Space → modal no abre con teclado | `personajes.html` | Alta |
| Modal `#char-detail-modal` y `#character-modal` no tienen focus trap | `personajes.html`, `index.html` | Alta |
| Al cerrar modal no se devuelve el foco al trigger element | `personajes.html`, `index.html` | Media |
| `--muted` (`rgba(255,255,255,.55)` = ~#878787) sobre `--bg` (`#05060a`): contraste ≈ 4.5:1 → pasa AA general pero falla en `font-size < 14px` | Todas | Media |
| Texto de `.char-card-alias` (12px, `var(--accent)` = #7c5cff): contraste ~3.9:1 sobre `--card` (`#0d1225`) → falla AA para texto pequeño | `personajes.html` | Media |
| `.map-node` del mapa no tiene `tabindex` ni `aria-label` → inaccesible por teclado | `mapa.html` | Media |
| Contenido generado por JS sin `role` apropiado en algunos casos (ej. `.event-card` en events-loader) | `eventos.html` | Baja |
| `<canvas id="particles">` tiene `aria-hidden="true"` ✓ pero no en `404.html` | `404.html` | Baja |
| `<div id="cursor">` tiene `aria-hidden="true"` ✓ en todos ✓ | — | OK |
| `<img>` del banner (`f8b3e41c...png`) tiene `alt=""` ✓ (decorativo) | `index.html` | OK |

---

## 7. Performance

| Problema | Páginas afectadas | Impacto |
|---|---|---|
| **BOM (U+FEFF)** al inicio de `index.html` (`EF BB BF` detectado) | `index.html` | Bajo (algunos parsers añaden ruido) |
| **GSAP cargado de CDN sin `defer`** (`<script src="https://cdnjs.cloudflare.com/...">`) bloquea render | `index.html` | Alto |
| GSAP no existe localmente; todos los demás scripts son `'self'` | `index.html` | Alto (CSP inconsistente) |
| `assets/f8b3e41c77033386d67c4461ede34fcc.png` (banner) sin `width`/`height` → potencial layout shift | `index.html` | Medio |
| Sin `<link rel="preload">` para el banner (imagen above-the-fold, crítica para LCP) | `index.html` | Medio |
| Logo en nav: data URI (~500 chars) repetida por página en lugar de archivo externo → no cacheable | Todas | Medio |
| `font-display: swap` está presente en la URL de Google Fonts ✓ | — | OK |
| Fonts cargadas via `onload` trick (non-render-blocking) ✓ | Todas | OK |
| `loading="eager"` en banner image (above-the-fold) ✓ | `index.html` | OK |
| `loading="lazy"` en imágenes del timeline ✓ | `index.html` | OK |
| Canvas de partículas no tiene throttle a 30fps en mobile | Todas | Medio |
| No hay `<link rel="manifest">` → sin soporte PWA / add to home screen | Todas | Bajo |
| Vercel Analytics solo en `index.html`; otras páginas sin tracking | Páginas internas | Bajo |
| Sin `sitemap.xml` ni `robots.txt` | — | SEO |

---

## 8. Deuda técnica adicional

### 8.1 `scripts.js` tiene código muerto para todas las páginas excepto `index.html`

- Objeto `characterData` (líneas 36–78): datos de personajes para el modal `#character-modal` de index. En el resto de páginas se cargan sin usarse.
- `.filter-btn`/`.condemned-card` listener: solo funcional en index.html.
- `.stat-number[data-target]` counter: solo existe en index.html.
- El modal referenciado (`#character-modal`) usa un sistema distinto al de `personajes.html` (`#char-detail-modal`). Son dos sistemas paralelos.

### 8.2 Zoom global en `scripts.js`

`document.body.style.zoom = 1.15` en `scripts.js` (líneas 23–33): aplica un zoom del 115% a todas las páginas por defecto y lo persiste en localStorage. Esto:
- Es un hack con propiedad CSS no estándar (`zoom`).
- Causa que las coordenadas del cursor y botones magnéticos deban compensarse manualmente (`var z = parseFloat(... zoom) || 1`).
- Puede causar problemas en Firefox (no soporta `zoom` CSS en el body).
- No hay un control de UI para cambiarlo; el usuario no sabe que ocurre.

### 8.3 CSS de GSAP mezclado con CSS base

Los estilos de orbes, grid, circuit y card-glow (índice de líneas 1412–1488 del inline style) deberían estar en un archivo separado (ej. `static/css/animations.css`) para poder cargarlos solo donde haya GSAP.

### 8.4 `index-events.js` duplicado inline e ignorado

El archivo `static/js/index-events.js` existe pero `index.html` tiene la misma lógica duplicada en el tercer inline script (líneas 2730–2867). El archivo externo no se carga nunca desde index.html.

### 8.5 Divergencia revelada / not revealed

- `styles.css`: `.revealed{opacity:1!important;transform:translateY(0)!important}`
- `index.html` inline: `.revealed{opacity:1;transform:translateY(0)}` (sin `!important`, para que GSAP pueda sobreescribir con inline styles)
- Este comportamiento intencional solo funciona en `index.html` y es invisible para quien edite `styles.css`.

### 8.6 Emoji en CSS (`::before { content: '📅' }`)

`pages.css` y `styles.css` usan emojis en pseudo-elementos (`::before { content: '📅' }`, `::before { content: '👥 ' }`). Los emojis en CSS `content` tienen soporte irregular en lectores de pantalla y deben ser gestionados con `aria-label` en el HTML o reemplazados por SVG.

---

## Resumen ejecutivo

| Categoría | # problemas | Prioridad |
|---|---|---|
| Monolito index.html (inline CSS + JS duplicado) | 1 bloque crítico | 🔴 Crítico |
| CSP inconsistente (`unsafe-inline` + CDN en index) | 5 variantes distintas | 🔴 Crítico |
| Accesibilidad (skip link, aria-current, focus trap, teclado) | 10 issues | 🟠 Alto |
| Logo/header/footer duplicados (mantenibilidad) | 3 bloques × 6 páginas | 🟠 Alto |
| GSAP en CDN sin defer (bloquea render, viola CSP propia) | 1 | 🟠 Alto |
| Selectores CSS muertos | ~6 | 🟡 Medio |
| Animaciones GSAP no replicadas en páginas internas | 12 animaciones | 🟡 Medio |
| Zoom hack global no estándar (`body.style.zoom`) | 1 | 🟡 Medio |
| Performance (BOM, layout shift, sin preload, sin manifest) | 6 | 🟡 Medio |
| Inline styles en HTML | ~7 lugares | 🟢 Bajo |
| SEO/meta ausente (OG, canonical, sitemap, robots) | 5 ausencias | 🟢 Bajo |
