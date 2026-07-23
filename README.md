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
[![HTML estático](https://img.shields.io/badge/HTML-E34F26?style=flat&logo=html5&logoColor=white)](.)
[![Vanilla JS](https://img.shields.io/badge/Vanilla%20JS-✓-0d8a80?style=flat)](.)
[![Discord](https://img.shields.io/badge/Discord-PURG4TORY-5865F2?style=flat&logo=discord&logoColor=white)](https://discord.gg/aTFMEVzcew)

</div>

---

## ¿Qué es esto?

**Purgatory** es la página de lore del servidor de Discord **PURG4TORY**: un sitio estático de alto impacto visual que recoge la mitología, los personajes, el mapa histórico y los eventos del servidor. Diseñado para proyectar una estética oscura y premium — gradientes teal/cian, tipografía de época, animaciones suaves y secretos escondidos para quienes buscan.

---

## Páginas

| Ruta | Descripción |
|---|---|
| [`/`](index.html) | Inicio — hero con arte del servidor, próximos eventos en directo, galería de personajes condenados |
| [`/lore`](lore.html) | El lore completo — mito de Artema, Las Cuatro Eras, Leyes Sagradas, Códex de las Almas y la Profecía |
| [`/personajes`](personajes.html) | Galería interactiva de personajes con fichas modales detalladas |
| [`/mapa`](mapa.html) | Mapa histórico interactivo con pan, zoom y tooltips por nodo |
| [`/eventos`](eventos.html) | Eventos programados del servidor, actualizados en tiempo real desde Discord |
| [`/404`](404.html) | El Void — página de error personalizada con citas del vacío |

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
├── index.html              ← Homepage
├── lore.html               ← Lore completo
├── personajes.html         ← Galería de personajes
├── mapa.html               ← Mapa histórico interactivo
├── eventos.html            ← Eventos del servidor
├── 404.html                ← El Void
├── _headers                ← Cabeceras para Netlify / Cloudflare Pages
├── .env.example            ← Ejemplo de variables de entorno
├── vercel.json             ← Configuración de despliegue y cabeceras
├── package.json
├── api/
│   └── discord-events.js   ← Serverless function (Vercel)
├── scripts/
│   ├── download-fonts.js   ← Descarga fuentes woff2 desde Google Fonts
│   └── generate-og.js      ← Genera imagen Open Graph (1200×630)
├── assets/
│   ├── artema-hero.svg     ← Arte principal de Artema
│   ├── era-*.svg           ← Iconos de eras (×8)
│   ├── icon-*.svg          ← Iconos de canales Discord
│   └── ...                 ← Más SVGs temáticos
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
    │   ├── personajes-data.js  ← Datos de personajes (PURGATORY_CHARS)
    │   └── mapa-data.js        ← Nodos y conexiones del mapa histórico
    ├── fonts/
    │   ├── inter-*.woff2       ← Inter (400, 500, 700)
    │   ├── cormorant-*.woff2   ← Cormorant Garamond (500, 500i, 700)
    │   ├── jetbrains-mono-*.woff2 ← JetBrains Mono (400, 500) — toda la metadata
    │   └── unifraktur-400.woff2
    └── img/
        ├── logo.svg
        ├── og-image.png        ← Imagen Open Graph
        └── ornaments/          ← Marcos decorativos heredados (sin usar en el diseño actual)
```

### Stack

- **HTML + CSS + JS vanilla** — sin bundler, sin dependencias vendor
- **Fade-in único con `IntersectionObserver`** (`.reveal-init`/`.revealed`)
- **Vercel** — despliegue estático + serverless function para la API de Discord
- **Fuentes autoalojadas** — Inter · Cormorant Garamond · JetBrains Mono · UnifrakturMaguntia (woff2)

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

El endpoint `/api/discord-events` es una **Vercel Serverless Function** que obtiene los eventos programados del servidor. Usa una estrategia de caché en cuatro capas para llegar a coste `$0`:

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

El sitio implementa cabeceras de seguridad completas tanto en `vercel.json` como en el archivo `_headers` (para Netlify / Cloudflare Pages) y en los meta-tags HTML de cada página:

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
| `scripts/generate-og.js` | Genera la imagen Open Graph (`static/img/og-image.png`, 1200×630) |

---

## Ornamentos heredados

`static/img/ornaments/` conserva los 8 SVGs del sistema de marcos decorativos de una dirección
visual anterior (esquinas, bordes, diamantes). Ya no se usan — el único elemento decorativo
del diseño actual es el sello del "4" (ver [Dirección visual](#dirección-visual)) — pero se
mantienen en el repo por si sirven para algo puntual más adelante.

---

<div align="center">

**[Entrar al servidor](https://discord.gg/aTFMEVzcew)**

*La Quinta Era está por comenzar.*

</div>
