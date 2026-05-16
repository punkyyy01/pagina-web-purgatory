## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- ALWAYS read graphify-out/GRAPH_REPORT.md before reading any source files, running grep/glob searches, or answering codebase questions. The graph is your primary map of the codebase.
- IF graphify-out/wiki/index.md EXISTS, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## AnimeJS v4 — Integración

- **Bundle**: `static/js/vendor/anime.esm.min.js` (v4.4.1, self-contained, sin imports externos)
- **Módulo principal**: `static/js/anime-effects.js` (cargado como `type="module"`)
- **Rol**: micro-animaciones de texto (scramble, split+stagger), SVG stroke draw-in en esquinas ornamentales, spring en modal de personajes, stagger en grids de cards
- **NO usar para scroll animations** — eso es GSAP + ScrollTrigger (`static/js/vendor/gsap.min.js`)
- **Disparadores**: IntersectionObserver con `{ once: true }` para todo lo que reacciona al scroll; MutationObserver para hooks en eventos de otros scripts (modal is-open, filter re-render)
- **Respetar `prefers-reduced-motion`** — todo el módulo se salta si el usuario tiene reducción de movimiento activada
- **SVG draw-in**: Los ornamentos (`corner-tl/tr/bl/br`) son `<img>` tags, no inline SVG. Se fetchean y se reemplazan en el DOM con `<svg>` inline antes de usar `createDrawable()`. El caché de fetch evita requests duplicados por el mismo archivo.
- **Páginas activas**: `lore.html`, `404.html`, `personajes.html`, `index.html`
- **Draggable en mapa.html**: OMITIDO. La lógica de pan/zoom en `static/data/mapa-data.js` (`applyTransform`, `centerMap`, `zoom`) usa sus propios event listeners (`mousedown/mousemove/wheel/touch*`) que conflictan directamente con AnimeJS Draggable. No integrar sin reescribir el sistema completo de transforms del mapa.
