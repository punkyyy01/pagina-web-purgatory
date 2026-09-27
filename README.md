<div align="center">

```
██████╗ ██╗   ██╗██████╗  ██████╗  █████╗ ████████╗ ██████╗ ██████╗ ██╗   ██╗
██╔══██╗██║   ██║██╔══██╗██╔════╝ ██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝
██████╔╝██║   ██║██████╔╝██║  ███╗███████║   ██║   ██║   ██║██████╔╝ ╚████╔╝ 
██╔═══╝ ██║   ██║██╔══██╗██║   ██║██╔══██║   ██║   ██║   ██║██╔══██╗  ╚██╔╝  
██║     ╚██████╔╝██║  ██║╚██████╔╝██║  ██║   ██║   ╚██████╔╝██║  ██║   ██║   
╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝  
```

**Sitio web oficial del lore del servidor de Discord PURG4TORY**

*Mitos, personajes, historia y eventos — todo en un solo lugar.*

[![Desplegado en Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)
[![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-✓-0d8a80?style=flat)](.)
[![Discord](https://img.shields.io/badge/Discord-PURG4TORY-5865F2?style=flat&logo=discord&logoColor=white)](https://discord.gg/aTFMEVzcew)

</div>

---

## ¿Qué es esto?

**Purgatory** es la página de lore del servidor de Discord **PURG4TORY**: un sitio construido con Astro (páginas pre-renderizadas, sin framework de UI en el cliente) que recoge la mitología, los personajes y los eventos del servidor. Diseñado para proyectar una estética oscura y premium — gradientes teal/cian, tipografía de época, animaciones suaves y secretos escondidos para quienes buscan.

---

## Páginas

| Ruta | Descripción |
|---|---|
| [`/`](src/pages/index.astro) | Inicio — hero con arte del servidor, próximos eventos en directo, galería de personajes condenados |
| [`/lore`](src/pages/lore.astro) | El lore completo — mito de Artema, Las Cuatro Eras, Leyes Sagradas, Códex de las Almas y la Profecía |
| [`/personajes`](src/pages/personajes.astro) | Galería interactiva de personajes con fichas modales detalladas |
| [`/eventos`](src/pages/eventos.astro) | Eventos programados del servidor, actualizados en tiempo real desde Discord |
| [`/condenados`](src/pages/condenados.astro) | Círculos del Infierno — el registro de quienes cruzaron líneas serias |
| [`/404`](src/pages/404.astro) | El Void — página de error personalizada con citas del vacío |

---

## El Lore de PURG4TORY

El universo narrativo del servidor se articula en cinco pilares:

### La Diosa Artema
Arquera celestial, creadora del servidor. Su imagen preside el hero del sitio: corona, arco luminoso, luna llena.

### Las Cuatro Eras *(+ Eras adicionales)*
Cada era tiene su propio icono SVG de 120×120 px y un color representativo:

| Era | Símbolo | Color |
|---|---|---|
| Era Dorada | Templo griego | Dorado / naranja |
| Era del Caos | Espadas cruzadas | Rojo / naranja |
| Era Oscura | Escudo roto | Gris |
| Era de la Caída | Columnas derrumbándose | Rojo |
| Era del Harén | Corazón con figuras | Morado / rojo |
| Era del Amor | Burbuja de chat con corazón | Morado / cian |
| Era del Purgatorio | Ojo en triángulo | Cian / morado |
| Era del Pergamino | Pergamino sellado con calavera | Rojo / naranja |

### Personajes principales
- **Nelcon** — Era I
- **Twoky** — Era III
- **Frambuesa** — Eras III–IV, Moderadora
- **Renas (Renasarenas)** — Era IV, Dictador

### Leyes Sagradas y el Códex de las Almas
Las reglas que gobiernan el servidor elevadas al rango de escritura sagrada. Disponibles en [`/lore`](lore.html).

### Profecía de la Quinta Era
El futuro del servidor, sellado en el Scriptorium.

---

## Arquitectura técnica

```
pagina-web-purgatory/
├── astro.config.mjs         ← Config de Astro (output: server, adapter Vercel)
├── vercel.json               ← Cabeceras de seguridad y caché
├── .env.example               ← Ejemplo de variables de entorno
├── package.json
├── src/
│   ├── layouts/
│   │   └── Layout.astro      ← <head> (meta/OG/CSP/fuentes), navbar+footer, scripts comunes
│   ├── components/
│   │   ├── Navbar.astro      ← Nav compartido, resalta la página activa
│   │   └── Footer.astro
│   └── pages/
│       ├── index.astro       ← Homepage
│       ├── lore.astro        ← Lore completo
│       ├── personajes.astro  ← Galería de personajes
│       ├── eventos.astro     ← Eventos del servidor
│       ├── condenados.astro  ← Círculos del Infierno
│       ├── 404.astro         ← El Void
│       └── api/
│           └── discord-events.js  ← Endpoint (Vercel Function) — eventos de Discord
├── scripts/
│   ├── download-fonts.js     ← Descarga fuentes woff2 desde Google Fonts
│   └── generate-og.js        ← Genera imagen Open Graph (1200×630)
└── public/
    └── static/
        ├── css/
        │   ├── tokens.css      ← Design tokens (paleta, tipografía, espaciado)
        │   ├── styles.css      ← Estilos globales + componentes
        │   ├── fonts.css       ← Reglas @font-face para fuentes autoalojadas
        │   └── lite-mode.css   ← Estilos para modo lite (dispositivos de bajos recursos)
        ├── js/
        │   ├── scripts.js          ← Scroll, fade-in reveal, tema claro/oscuro, contadores
        │   ├── easter-eggs.js      ← Secretos interactivos
        │   ├── eventos-loader.js   ← Renderizado de eventos con ETag polling
        │   ├── countdown.js        ← Cuenta regresiva al próximo evento (home)
        │   ├── lite-mode-detect.js ← Detección automática de modo lite
        │   └── void-quotes.js      ← Citas del 404
        ├── data/
        │   └── personajes-data.js  ← Datos de personajes (PURGATORY_CHARS)
        ├── fonts/
        │   ├── inter-*.woff2          ← Inter (400, 500, 700)
        │   ├── cormorant-*.woff2      ← Cormorant Garamond (500, 500i, 700)
        │   └── jetbrains-mono-*.woff2 ← JetBrains Mono (400, 500) — toda la metadata
        └── img/
            ├── logo.svg
            └── og-image.png    ← Imagen Open Graph
```

Las rutas públicas (`/static/css/...`, `/static/js/...`, etc.) no cambiaron: `public/` en Astro se sirve tal cual en la raíz, así que todo el CSS/JS/fuentes se referencia igual que antes.

### Stack

- **Astro** (SSR, adaptador `@astrojs/vercel`) — cada página se pre-renderiza a HTML estático en build (`export const prerender = true`); el único endpoint dinámico es la API de Discord
- **CSS + JS vanilla** en `public/static/` — el mismo sistema de siempre, sin bundler ni dependencias vendor
- **Fade-in único con `IntersectionObserver`** (`.reveal-init`/`.revealed`)
- **Vercel** — páginas pre-renderizadas servidas desde el edge + Function para la API de Discord
- **Fuentes autoalojadas** — Inter · Cormorant Garamond · JetBrains Mono (woff2)

### Funcionalidades

- Buscador + filtros combinados en Personajes y Eventos
- Cuenta regresiva al próximo evento del servidor (home)
- Modo claro/oscuro persistido en `localStorage`

### Dirección visual

Expediente/registro con lenguaje de tribunal parodiado: un solo acento (teal), tres roles
tipográficos fijos (serif solo para el wordmark y nombres propios, sans para cuerpo/UI, mono
para toda la metadata — fechas, casos, eras, veredictos) y un único elemento decorativo: el
sello del "4" en el wordmark, reutilizado como sello de veredicto en Círculos del Infierno y
estados de evento. Sin glow, sin marcos ornamentales, sin el bloque eyebrow+título+subtítulo
repetido por sección.

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#0a0a0a` | Fondo (pergamino claro en tema claro) |
| `--paper` | `#e8e4da` | Texto principal |
| `--stamp` | `#0d8a80` | El único acento — bordes, sello |
| `--stamp-bright` | `#3de8da` | Variante clara del acento |
| `--rule` | `rgba(232,228,218,.14)` | Divisores — sin glow |

---

## API de eventos Discord

El endpoint `/api/discord-events` es un **endpoint de Astro** (`src/pages/api/discord-events.js`, desplegado como Vercel Function) que obtiene los eventos programados del servidor. Usa una estrategia de caché en cuatro capas para llegar a coste `$0`:

```
┌─────────────────────────────────────────────────────────┐
│  1. In-memory cache (2 min)                             │
│     Sobrevive entre invocaciones calientes de la función│
│                                                         │
│  2. Vercel CDN Edge Cache                               │
│     s-maxage=2min + stale-while-revalidate=5min         │
│     La mayoría de requests nunca invocan la función     │
│                                                         │
│  3. ETag / 304 Not Modified (FNV-1a hash)               │
│     Si los datos no cambiaron → respuesta sin cuerpo    │
│                                                         │
│  4. Client polling cada 60 s con ETag                   │
│     La mayoría de respuestas son 304 (< 1 KB)           │
└─────────────────────────────────────────────────────────┘
```

**Variables de entorno necesarias** (ver `.env.example`):

```
DISCORD_BOT_TOKEN   Token del bot de Discord
DISCORD_GUILD_ID    ID numérico del servidor
```

---

## Easter eggs

El sitio esconde varios secretos para quien los busque:

- **Código Konami** (`↑ ↑ ↓ ↓ ← → ← → B A`) — activa el Void Portal
- Escribir **"mantequilla"** — invoca a Luigi
- **7 clics en el logo** — revela el Soul Counter, persistido en `localStorage`
- Escribir **"bump"** — completa el Ritual del Bump

---

## Seguridad

El sitio implementa cabeceras de seguridad completas tanto en `vercel.json` como en los meta-tags de cada página (vía `Layout.astro`):

- `Content-Security-Policy` — solo recursos propios y fuentes autoalojadas
- `X-Frame-Options: DENY` — sin iframes externos
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — cámara, micrófono y geolocalización desactivados

---

## Modo Lite

El sitio detecta automáticamente dispositivos con bajos recursos o conexiones lentas y activa un "modo lite" que desactiva animaciones complejas y reduce el uso de JS/CSS para una experiencia más fluida.

---

## Scripts de utilidad

| Script | Descripción |
|---|---|
| `scripts/download-fonts.js` | Descarga las fuentes woff2 desde Google Fonts a `static/fonts/` |
| `scripts/generate-og.js` | Genera la imagen Open Graph (`public/static/img/og-image.png`, 1200×630) |

---

<div align="center">

**[Entrar al servidor](https://discord.gg/aTFMEVzcew)**

*La Quinta Era está por comenzar.*

</div>
