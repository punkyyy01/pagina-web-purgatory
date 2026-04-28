# FASE 3 — REBOOT — Rediseño visual completo

> El intento anterior falló porque solo cambió tokens de color sin tocar la estructura visual. Este documento empieza por la **visión** y termina por el código.
>
> Referencia visual: **Vampire: The Masquerade — Bloodlines** (juego de cartas). El sitio debe sentirse como navegar entre pantallas de ese juego, manteniendo el lore propio del Discord.

---

## Paso 0 — Backup OBLIGATORIO antes de tocar nada

```bash
git checkout -b backup/pre-fase3-reboot
git push origin backup/pre-fase3-reboot
git checkout main
git checkout -b feat/fase3-reboot
```

A partir de aquí trabajas en `feat/fase3-reboot`. Si algo sale catastrófico, Frambuesa recupera con `git checkout backup/pre-fase3-reboot`.

**Verifica también que la rama backup quedó subida a remote.** Si falla el push, NO sigas hasta resolverlo.

---

## Paso 1 — VISIÓN: cómo se ve cada página

Antes de escribir una sola línea de CSS, lee esta sección entera y memorízala. No vas a "interpretar tokens y aplicarlos". Vas a **construir lo que aquí se describe**, y al final el resultado debe parecerse al juego de referencia.

### 1.1 — `index.html`

Cuando alguien abre el sitio:

- **Fondo:** negro casi puro (`#08020a`) con un halo radial carmesí muy difuso en los bordes superior e inferior. Tipo viñeta sangrienta.
- **Header:** barra opaca (NO blur, NO transparencia) con:
  - Logo nuevo a la izquierda: un **emblema heráldico carmesí** (un diamante con cruz interior, o un cáliz, o un símbolo ritual — diséñalo nuevo, NO el triángulo purple-cyan actual).
  - Links del nav en mayúsculas, espaciado generoso, tipografía display blackletter, color `#f0e6e8`. Link activo con borde inferior carmesí.
  - Botón "ENTRAR AL SERVER" como botón sólido carmesí con esquinas levemente redondeadas (radius 6px máximo, NO pill, NO completamente cuadrado).
- **Hero (primera vista):**
  - Banner detrás (la imagen de personajes que ya tienen) con overlay carmesí oscuro al 70% para integrar con la estética.
  - Sobre el banner, **un marco ornamentado completo** que contiene el título: las 4 esquinas con ornamentos diamante, un divisor `◆ PURG4TORY ◆` arriba, título grande blackletter "Bienvenido a Purgatory" en el centro, lead text serif italic abajo.
  - Dos botones bajo el frame: "EXPLORAR EL LORE" (carmesí sólido) y "VER LÍNEA DE TIEMPO" (transparente con borde carmesí).
- **Sección de personajes destacados:** grid de 4 cards de personaje con flip 3D. Cada card muestra DORSO por defecto (patrón de diamantes carmesí + emblema central). Al hover/tap → flip al anverso (portrait + nombre + alias).
- **Sección "Las Cuatro Eras":** timeline horizontal donde cada era es una **carta horizontal** con marco completo, número romano ornamentado, título blackletter, descripción.
- **Sección "Infierno":** grid de "almas condenadas" como cards con borde rojo intenso, cada una con un sello ornamental de "CONDEMNED" estampado.
- **Footer:** divisor `◆ PURG4TORY ◆` arriba, links centrados, fecha de última actualización.

### 1.2 — `lore.html`

Cada capítulo del lore es una **TABLET** independiente:

- Fondo del capítulo: panel opaco `#0a0306` con marco completo de 4 esquinas ornamentadas + bordes laterales con líneas decorativas SVG.
- Header del capítulo: `CAPÍTULO I` arriba en pequeño con espaciado letter-spacing `0.4em`, debajo el título grande blackletter.
- Cita destacada: `<blockquote>` con comillas SVG grandes flanqueando, fondo sutil más oscuro.
- Drop cap en la primera letra del primer párrafo (5em, blackletter, color carmesí).
- Subsecciones separadas por divisores `◆` (flor central de 4 pétalos + líneas a los lados).
- Las "leyes sagradas" como cards individuales con marco carmesí + número romano arriba (`I.`, `II.`, `III.`...) en blackletter grande.
- Entre capítulos: divisor full-width muy decorativo (no un `<hr>` simple).

### 1.3 — `personajes.html`

- Hero con frame ornamentado igual que el index.
- Grid de cards-naipe (proporción 2:3, dorso/anverso con flip).
- Filtros (Las Fosas / Olympo / Purgatory) como **pestañas con divisor diamante** entre ellas: `◆ LAS FOSAS ◆ OLYMPO ◆ PURGATORY ◆`.
- Cuando se hace click en una card flippeada al anverso → abre modal grande con la ficha completa del personaje.
- **Ficha de personaje (modal):**
  - Marco ornamentado completo con 4 corners.
  - Header: nombre grande blackletter centrado + alias en serif italic abajo.
  - Body: portrait grande a la izquierda, datos en grid a la derecha (Era, Estado, Alianzas, Pecados).
  - Sección "Bio" en serif legible.
  - Sección "Momentos icónicos" como mini-cards horizontales.
  - Footer: tags + botón CERRAR carmesí sólido.

### 1.4 — `mapa.html`

- Cada servidor del mapa es una **CARTA inline** con marco ornamentado, NO un círculo SVG.
- Las cartas están dispuestas en el espacio con líneas dashed carmesí conectándolas.
- Hover sobre una carta → glow carmesí intenso + sus conexiones se iluminan.
- Click → abre tooltip-modal con el lore del servidor (mismo estilo que la ficha de personaje pero más compacto).
- Pan + zoom mantenido (es funcional).

### 1.5 — `eventos.html`

- Cada evento del Discord es una **CARTA horizontal ancha**:
  - Borde carmesí.
  - Estado "EN CURSO" → glow pulsante + sello "ACTIVO" estampado en la esquina.
  - Estado "PRÓXIMO" → borde estático + contador "EMPIEZA EN: X DÍAS".
  - Estado "PASADO" → desaturado.
- Loading state: 3 diamantes carmesí rotando con desfase + texto "INVOCANDO RITUALES..."
- Empty state: ilustración SVG de un **altar vacío** + texto "Las llamas duermen. Vuelve más tarde."

---

## Paso 2 — DEMOLICIÓN (borrar lo viejo)

```bash
# Borrar TODO el CSS actual
rm static/css/styles.css
rm static/css/pages.css
rm static/css/animations.css
rm static/css/tokens.css

# Borrar JS de animaciones que ya no aplica
rm static/js/animations-home.js

# El logo viejo también va
rm assets/logo.svg
```

Mantener intactos: `static/data/personajes-data.js`, `static/data/mapa-data.js`, `static/js/scripts.js` (refactor profundo después), `static/js/easter-eggs.js`, `static/js/eventos-loader.js`, `api/`.

---

## Paso 3 — RECONSTRUCCIÓN

### 3.1 — Logo nuevo (esto va PRIMERO porque está en todas las páginas)

Diseña un nuevo `static/img/logo.svg` siguiendo estos parámetros:

- ViewBox `0 0 120 120`.
- Forma: **emblema heráldico carmesí**. Opciones (elige UNA):
  - Diamante grande carmesí con un símbolo ritual en el centro (cruz, runa, ojo).
  - Cáliz estilizado con líneas blackletter alrededor.
  - Escudo gótico con dos diamantes flanqueándolo.
- Colores: usa `currentColor` para que herede `var(--blood-bright)`. Sin gradientes purple/cyan.
- Estilo: líneas geométricas firmes, NO orgánicas. Estética heráldica.

Guarda en `static/img/logo.svg` y referencia con `<img src="static/img/logo.svg" style="color: var(--blood-bright);">` en los headers.

**Después de este paso, abre cualquier página y verifica que el logo del header NO sea el triángulo purple-cyan.** Si lo es, el SVG quedó mal o el HTML sigue apuntando al data URI viejo.

### 3.2 — Fonts

Cargar Google Fonts en cada `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&family=UnifrakturMaguntia&display=swap"
  onload="this.onload=null;this.rel='stylesheet'">
```

### 3.3 — `static/css/tokens.css` (reescrito desde cero)

```css
:root {
  /* ── Sangre ── */
  --blood: #a8001f;
  --blood-bright: #ff1a3c;
  --blood-dark: #6b0014;
  --blood-deep: #2a0008;

  /* ── Fondos ── */
  --bg: #08020a;
  --bg-1: #0d0408;
  --bg-2: #15060c;
  --panel: #0a0306;
  --panel-hover: #14070d;

  /* ── Texto ── */
  --text: #f0e6e8;
  --text-muted: rgba(240, 230, 232, 0.7);
  --text-dim: rgba(240, 230, 232, 0.45);
  --text-blood: #ff5560;

  /* ── Bordes ── */
  --border: rgba(168, 0, 31, 0.3);
  --border-strong: rgba(255, 26, 60, 0.55);
  --border-active: var(--blood-bright);

  /* ── Glow ── */
  --glow-blood: 0 0 24px rgba(255, 26, 60, 0.45),
                0 0 60px rgba(168, 0, 31, 0.35),
                0 0 120px rgba(168, 0, 31, 0.15);
  --glow-blood-strong: 0 0 32px rgba(255, 26, 60, 0.7),
                       0 0 80px rgba(168, 0, 31, 0.5),
                       0 0 160px rgba(168, 0, 31, 0.25);

  /* ── Sombras ── */
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.7);

  /* ── Tipografía ── */
  --font-body: 'Inter', system-ui, sans-serif;
  --font-serif: 'Cormorant Garamond', 'Cinzel', serif;
  --font-display: 'UnifrakturMaguntia', 'Cormorant Garamond', serif;

  /* ── Tamaños tipográficos ── */
  --fs-xs: 0.75rem;
  --fs-sm: 0.875rem;
  --fs-base: 1rem;
  --fs-md: 1.125rem;
  --fs-lg: 1.375rem;
  --fs-xl: 1.75rem;
  --fs-2xl: clamp(1.75rem, 1.2rem + 2vw, 2.5rem);
  --fs-3xl: clamp(2.25rem, 1.5rem + 3vw, 3.5rem);
  --fs-hero: clamp(2.5rem, 1.8rem + 3.5vw, 4rem);
  --fs-dropcap: 5em;

  /* ── Espaciado ── */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --space-9: 6rem;

  /* ── Radii ── */
  --r-xs: 2px;
  --r-sm: 4px;
  --r-md: 6px;
  --r-lg: 10px;
  --r-pill: 999px;

  /* ── Layout ── */
  --container: 1100px;
  --header-h: 72px;

  /* ── Z-index ── */
  --z-base: 1;
  --z-banner: 5;
  --z-header: 100;
  --z-modal: 1000;

  /* ── Motion ── */
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-fast: 150ms;
  --dur-base: 300ms;
  --dur-slow: 500ms;

  color-scheme: dark;
}

html { font-size: 18px; }

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: var(--fs-base);
  line-height: 1.6;
  min-height: 100vh;
  background-image:
    radial-gradient(ellipse at 50% 0%, rgba(168, 0, 31, 0.12), transparent 60%),
    radial-gradient(ellipse at 50% 100%, rgba(168, 0, 31, 0.08), transparent 60%);
  background-attachment: fixed;
}
```

### 3.4 — Sistema de marcos ornamentados (CRÍTICO)

Crea `static/img/ornaments/`:

- `corner-tl.svg` — esquina superior izquierda. Diseño: dos líneas perpendiculares que forman una L de 32×32px, con un diamante pequeño en el vértice exterior y otro en cada extremo. Color: `currentColor`.
- `corner-tr.svg`, `corner-bl.svg`, `corner-br.svg` — espejos del anterior (puedes generarlos con `transform: scaleX/Y` en CSS, o duplicar el SVG con paths reflejados).
- `divider-flower.svg` — flor de 4 pétalos pequeña, 16×16px, con dos líneas finas que se extienden a izquierda y derecha. Color: `currentColor`.
- `diamond.svg` — diamante simple 8×8px, `currentColor`.
- `frame-edge-h.svg` — línea decorativa horizontal con un nodo central (para los lados horizontales del frame).
- `frame-edge-v.svg` — versión vertical.

Crea un componente CSS reutilizable:

```css
.frame {
  position: relative;
  background: var(--panel);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-md);
  padding: var(--space-7) var(--space-6);
  box-shadow: var(--shadow-md);
}

.frame::before,
.frame::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

/* Las 4 esquinas como pseudo-elementos via background-image */
.frame > .frame-corner {
  position: absolute;
  width: 32px; height: 32px;
  color: var(--blood-bright);
  pointer-events: none;
}
.frame > .frame-corner-tl { top: 6px; left: 6px; }
.frame > .frame-corner-tr { top: 6px; right: 6px; transform: scaleX(-1); }
.frame > .frame-corner-bl { bottom: 6px; left: 6px; transform: scaleY(-1); }
.frame > .frame-corner-br { bottom: 6px; right: 6px; transform: scale(-1, -1); }

/* Frame "destacado" (modales, hero) tiene corners más grandes y glow */
.frame--highlight {
  border-color: var(--blood);
  box-shadow: var(--glow-blood);
}
.frame--highlight > .frame-corner {
  width: 40px; height: 40px;
}

/* Divisor universal */
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  font-family: var(--font-display);
  font-size: var(--fs-sm);
  letter-spacing: 0.4em;
  color: var(--blood-bright);
  text-transform: uppercase;
  margin: var(--space-5) 0;
}
.divider::before, .divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--blood) 50%, transparent);
}
.divider-text { white-space: nowrap; }
.divider-text::before { content: "◆ "; }
.divider-text::after { content: " ◆"; }
```

Helper HTML para los 4 corners (usar en cada `.frame`):

```html
<div class="frame frame--highlight">
  <img src="static/img/ornaments/corner-tl.svg" class="frame-corner frame-corner-tl" alt="">
  <img src="static/img/ornaments/corner-tr.svg" class="frame-corner frame-corner-tr" alt="">
  <img src="static/img/ornaments/corner-bl.svg" class="frame-corner frame-corner-bl" alt="">
  <img src="static/img/ornaments/corner-br.svg" class="frame-corner frame-corner-br" alt="">

  <div class="divider"><span class="divider-text">Capítulo I</span></div>
  <h2>El Mito de Artema</h2>
  ...
</div>
```

(Si los SVG son inline + usan `currentColor`, mejor hacer un partial JS que los inyecte para no repetir 4 `<img>` en cada frame. Decide qué prefieres.)

### 3.5 — Cards naipe con flip 3D

```css
.card-naipe {
  perspective: 1200px;
  aspect-ratio: 2 / 3;
  cursor: pointer;
  background: transparent;
  border: none;
}

.card-naipe-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 600ms var(--ease-out-expo);
}

.card-naipe.is-flipped .card-naipe-inner,
.card-naipe:hover .card-naipe-inner {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border: 1px solid var(--blood);
  border-radius: var(--r-md);
  background: var(--panel);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.card-face-front { transform: rotateY(180deg); }

/* Dorso: patrón de diamantes + emblema central */
.card-face-back {
  display: grid;
  place-items: center;
  background:
    repeating-linear-gradient(
      45deg,
      transparent, transparent 14px,
      rgba(168, 0, 31, 0.08) 14px, rgba(168, 0, 31, 0.08) 16px
    ),
    var(--panel);
}
.card-back-emblem {
  width: 60%;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border: 2px solid var(--blood-bright);
  border-radius: 50%;
  background: rgba(168, 0, 31, 0.1);
  box-shadow: var(--glow-blood);
}
.card-back-emblem img {
  width: 50%;
  height: 50%;
  filter: drop-shadow(0 0 8px var(--blood-bright));
}

/* Anverso: portrait + info */
.card-face-front {
  display: flex;
  flex-direction: column;
}
.card-portrait {
  flex: 1;
  background: var(--bg-2);
  position: relative;
  overflow: hidden;
}
.card-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-info {
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--border);
  background: var(--panel);
}
.card-name {
  font-family: var(--font-display);
  font-size: var(--fs-md);
  color: var(--text);
}
.card-alias {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: var(--fs-sm);
  color: var(--text-muted);
}
```

### 3.6 — Botones

```css
.btn {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: var(--fs-sm);
  padding: 14px 32px;
  border-radius: var(--r-sm);
  border: 1px solid var(--blood);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: all var(--dur-base) var(--ease-out-expo);
  display: inline-block;
  text-decoration: none;
}

.btn:hover {
  border-color: var(--blood-bright);
  color: var(--blood-bright);
  box-shadow: var(--glow-blood);
}

.btn-blood {
  background: var(--blood);
  border-color: var(--blood-bright);
  box-shadow: var(--glow-blood);
}
.btn-blood:hover {
  background: var(--blood-bright);
  color: var(--text);
  box-shadow: var(--glow-blood-strong);
  transform: translateY(-1px);
}
```

### 3.7 — Header

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--z-header);
  background: rgba(8, 2, 10, 0.96);
  border-bottom: 1px solid var(--border-strong);
  height: var(--header-h);
  display: flex;
  align-items: center;
}

.nav {
  width: 100%;
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: var(--text);
}
.brand img {
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 0 6px var(--blood));
}
.brand-name {
  font-family: var(--font-display);
  font-size: var(--fs-md);
  letter-spacing: 0.1em;
  color: var(--blood-bright);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  list-style: none;
}
.nav-links a {
  font-family: var(--font-display);
  font-size: var(--fs-sm);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
  text-decoration: none;
  padding: var(--space-2) 0;
  border-bottom: 2px solid transparent;
  transition: all var(--dur-base);
}
.nav-links a:hover { color: var(--text); }
.nav-links a[aria-current="page"] {
  color: var(--blood-bright);
  border-bottom-color: var(--blood-bright);
}
```

### 3.8 — Reescribir cada HTML

NO uses search-and-replace. **Abre cada HTML y reescribe el `<body>` desde cero** con la nueva estructura visual descrita en el Paso 1. Mantén solo:

- El `<head>` con los meta tags + CSP correcta + las nuevas fonts.
- Los `<script>` al final que se mantienen.
- Las clases nuevas (`frame`, `divider`, `card-naipe`, `btn-blood`, etc.) NO las viejas.

**Esto es trabajo manual. No automatices con regex.** El sitio anterior tenía estructura purple/cyan/glassmorphism — esa estructura no sirve para la nueva estética.

---

## Paso 4 — VERIFICACIÓN OBLIGATORIA después de cada commit

Después de **cada** commit de esta fase, ejecuta este checklist visualmente. Si alguno falla, deshaz el commit y reintenta.

### Checklist post-commit (no opcional)

1. **¿El logo del header es el nuevo emblema heráldico carmesí?**
   - Si ves el triángulo purple-cyan → FALLO. El logo viejo sigue en el data URI o en `<img>`.

2. **¿Hay marcos ornamentados visibles con esquinas decoradas?**
   - Abre `index.html`. Si el hero solo tiene texto sin marco, sin corners, sin divisor `◆ ... ◆` → FALLO.

3. **¿Las cards de personajes se ven como naipes con dorso?**
   - Ve a `personajes.html`. Si las cards muestran info de frente desde el inicio, sin dorso ornamentado, sin animación de flip → FALLO.

4. **¿La tipografía display es blackletter/gótica?**
   - Si los títulos siguen siendo Cinzel sans-decorative o Inter bold → FALLO. Verifica que UnifrakturMaguntia o Cormorant Garamond estén cargando.

5. **¿No hay NADA purple ni cyan en pantalla?**
   - Revisa el SVG de Artema en el hero (la ilustración con halos cyan). Si sigue ahí con esos colores, hay que reemplazarla por una ilustración carmesí o eliminarla.

6. **¿El divisor `◆ TEXTO ◆` aparece al menos en 5 lugares del sitio?**
   - Header del hero, separador de secciones, modal title, footer. Si solo está en uno, falta aplicarlo.

7. **¿El sitio se siente como una pantalla de juego, no como una web genérica con paleta roja?**
   - Test subjetivo. Si Frambuesa lo abre y dice "se ve igual que antes pero rojo", el commit FALLÓ y hay que rehacer.

---

## Paso 5 — Orden de commits

1. **`backup`** — crear rama backup, no se cuenta como commit en feat.
2. **`chore: demolish legacy css and assets`** — borrar lo viejo.
3. **`feat(brand): new heraldic crimson logo`** — nuevo logo SVG en uso en todas las páginas.
4. **`feat(design): tokens, fonts, base styles`** — `tokens.css` reescrito + fonts cargadas.
5. **`feat(components): frame and divider system`** — frames ornamentados + ornaments SVGs + divider universal. **Verifica con un HTML de prueba que un frame se renderiza con sus 4 corners.**
6. **`feat(components): card naipe with 3d flip`** — card flip funcional. **Verifica que hace flip al hover.**
7. **`feat(components): buttons, header, footer`** — header con logo nuevo + nav blackletter + footer con divider.
8. **`feat(pages): redesign index.html`** — `<body>` del index reescrito. Hero con frame, cards de personajes destacados, eras horizontales, infierno.
9. **`feat(pages): redesign personajes.html`** — grid de cards naipe + filtros con divisores + modal con frame ornamentado.
10. **`feat(pages): redesign lore.html`** — capítulos como tablets con frame + drop caps + leyes sagradas.
11. **`feat(pages): redesign mapa.html`** — nodos como cards + líneas dashed.
12. **`feat(pages): redesign eventos.html`** — cards horizontales + estados visuales + empty/loading state.
13. **`chore: cleanup unused assets and scripts`** — eliminar lo que quedó suelto.
14. **`docs: update CHANGELOG with fase3 reboot`**.

---

## Paso 6 — Después de TODOS los commits

Antes de mergear a `main`:

1. Ejecuta el checklist completo del Paso 4 en las 5 páginas.
2. Toma 5 capturas (una por página) y pásaselas a Frambuesa para revisión.
3. Espera su luz verde antes de mergear.

Si Frambuesa dice "se ve igual de pedorro que antes", **NO mergees**. Identifica qué falla del checklist y rehazlo.

---

## Reglas firmes

- **El criterio de éxito NO es "el código ejecuta sin errores".** Es "el sitio se ve como una pantalla del juego de cartas vampírico".
- **Si tienes dudas sobre cómo se ve algo, pregunta a Frambuesa antes de implementar.** No improvises con la estética.
- **No reuses ningún snippet visual del diseño anterior.** Empieza limpio.
- **Las animaciones mínimas:** flip de cards, modal entrance con stagger de corners, hover states. Nada más complejo en esta fase.
- **No introduzcas frameworks ni librerías.** Vanilla JS + CSS puro. El backup ya está, así que si rompes algo, recuperamos.
