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
    │   ├── scripts.js          ← Cursor, scroll, partículas, contadores
    │   ├── easter-eggs.js      ← Secretos interactivos
    │   ├── eventos-loader.js   ← Renderizado de eventos con ETag polling
    │   ├── interactions.js     ← Interacciones UI
    │   ├── anime-effects.js    ← Efectos de animación (Anime.js)
    │   ├── lite-mode-detect.js ← Detección automática de modo lite
    │   ├── void-quotes.js      ← Citas del 404
    │   └── vendor/
    │       ├── gsap.min.js
    │       ├── ScrollTrigger.min.js
    │       └── anime.esm.min.js
    ├── data/
    │   ├── personajes-data.js  ← Datos de personajes (PURGATORY_CHARS)
    │   └── mapa-data.js        ← Nodos y conexiones del mapa histórico
    ├── fonts/
    │   ├── inter-*.woff2       ← Inter (400, 500, 700)
    │   ├── cormorant-*.woff2   ← Cormorant Garamond (500, 500i, 700)
    │   └── unifraktur-400.woff2
    └── img/
        ├── logo.svg
        ├── og-image.png        ← Imagen Open Graph
        └── ornaments/          ← Sistema de marcos decorativos (×8 SVGs)
```

### Stack

- **HTML + CSS + JS vanilla** — sin bundler, sin frameworks de aplicación
- **GSAP + ScrollTrigger** — animaciones de scroll y transiciones
- **Anime.js** — efectos de animación complementarios
- **Vercel** — despliegue estático + serverless function para la API de Discord
- **Fuentes autoalojadas** — Inter · Cormorant Garamond · UnifrakturMaguntia (woff2)

### Paleta de diseño

| Token | Valor | Uso |
|---|---|---|
| Fantasma | `#0d8a80` | Color primario, bordes, glow |
| Fantasma bright | `#3de8da` | Highlights, acentos, texto |
| Fondo base | `#050b0b` | Oscuridad profunda |
| Texto | `#deeeed` | Texto principal |

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

El sitio esconde tres secretos para quien los busque:

- **Código Konami** (`↑ ↑ ↓ ↓ ← → ← → B A`) — activa el Void Portal
- **Void Whispers** — susurros del vacío que aparecen de forma aleatoria
- **Soul Counter** — contador de almas persistido en `localStorage`

---

## Seguridad

El sitio implementa cabeceras de seguridad completas tanto en `vercel.json` como en el archivo `_headers` (para Netlify / Cloudflare Pages) y en los meta-tags HTML de cada página:

- `Content-Security-Policy` — solo recursos propios y fuentes autoalojadas
- `X-Frame-Options: DENY` — sin iframes externos
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — cámara, micrófono y geolocalización desactivados

---

## Despliegue

### Vercel (recomendado)

El proyecto se despliega automáticamente al hacer push a `main`.

```bash
# Primera vez
vercel

# Producción
vercel --prod
```

### Netlify / Cloudflare Pages

El archivo `_headers` contiene las cabeceras de seguridad y caché necesarias para despliegues en estos plataformas.

### Local

```bash
npm install
npm run dev        # Servidor local en http://localhost:3000
```

Para probar la API de Discord localmente:

```bash
# Copiar variables de entorno
cp .env.example .env
# Rellena DISCORD_BOT_TOKEN y DISCORD_GUILD_ID en .env

npm run test:api
```

---

## Scripts de utilidad

| Script | Descripción |
|---|---|
| `scripts/download-fonts.js` | Descarga las fuentes woff2 desde Google Fonts a `static/fonts/` |
| `scripts/generate-og.js` | Genera la imagen Open Graph (`static/img/og-image.png`, 1200×630) |

---

## Sistema de ornamentos

Los marcos decorativos que aparecen en el sitio están formados por **8 SVGs modulares** que funcionan como un sistema:

```
corner-tl.svg ─────────── edge-h.svg ─────────── corner-tr.svg
     │                                                  │
     │              frame-full.svg                      │
     │                                                  │
corner-bl.svg ─────────── edge-h.svg ─────────── corner-br.svg

diamond.svg          → acento/bullet
divider-flower.svg   → separador horizontal con flor central
```

---

<div align="center">

**[Entrar al servidor](https://discord.gg/aTFMEVzcew)**

*La Quinta Era está por comenzar.*

</div>
