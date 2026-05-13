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
[![Sin frameworks](https://img.shields.io/badge/Sin%20frameworks-✓-7c5cff?style=flat)](.)
[![Discord](https://img.shields.io/badge/Discord-PURG4TORY-5865F2?style=flat&logo=discord&logoColor=white)](https://discord.gg/aTFMEVzcew)

</div>

---

## ¿Qué es esto?

**Purgatory** es la página de lore del servidor de Discord **PURG4TORY**: un sitio estático de alto impacto visual que recoge la mitología, los personajes, el mapa histórico y los eventos del servidor. Diseñado para proyectar una estética oscura y premium — gradientes morado/cian, tipografía de época, animaciones suaves y secretos escondidos para quienes buscan.

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
├── api/
│   └── discord-events.js   ← Serverless function (Vercel)
├── assets/
│   ├── artema-hero.svg     ← Arte principal de Artema
│   ├── era-*.svg           ← Iconos de eras (×8)
│   ├── icon-*.svg          ← Iconos de canales Discord
│   └── ...                 ← Más SVGs temáticos
├── static/
│   ├── css/
│   │   ├── tokens.css      ← Design tokens (paleta, tipografía, espaciado)
│   │   └── styles.css      ← Estilos globales + componentes
│   ├── js/
│   │   ├── scripts.js          ← Cursor, scroll, partículas, contadores
│   │   ├── easter-eggs.js      ← Secretos interactivos
│   │   ├── eventos-loader.js   ← Renderizado de eventos con ETag polling
│   │   ├── index-events.js     ← Preview de eventos en homepage
│   │   ├── void-quotes.js      ← Citas del 404
│   │   └── vendor/
│   │       ├── gsap.min.js
│   │       └── ScrollTrigger.min.js
│   ├── data/
│   │   ├── personajes-data.js  ← Datos de personajes (PURGATORY_CHARS)
│   │   └── mapa-data.js        ← Nodos y conexiones del mapa histórico
│   └── img/
│       ├── logo.svg
│       └── ornaments/          ← Sistema de marcos decorativos (×8 SVGs)
├── vercel.json             ← Configuración de despliegue y cabeceras
└── package.json
```

### Stack

- **HTML + CSS + JS vanilla** — sin frameworks, sin bundler, sin dependencias de producción
- **GSAP + ScrollTrigger** — animaciones de scroll y transiciones
- **Vercel** — despliegue estático + serverless function para la API de Discord
- **Google Fonts** — Inter · Cormorant Garamond · UnifrakturMaguntia

### Paleta de diseño

| Token | Valor | Uso |
|---|---|---|
| Morado principal | `#7c5cff` | Acentos, glow |
| Cian | `#00e0ff` | Detalles, highlights |
| Rojo marca | `#a8001f` | Logo, elementos de condena |
| Fondo base | `#08020a` | Oscuridad profunda |

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

**Variables de entorno necesarias** (configurar en Vercel Dashboard):

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

El sitio implementa cabeceras de seguridad completas tanto en `vercel.json` como en los meta-tags HTML de cada página:

- `Content-Security-Policy` — solo recursos propios y fuentes de Google
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

### Local

```bash
npm install
npm run dev        # Servidor local en http://localhost:3000
```

Para probar la API de Discord localmente:

```bash
# Configurar variables de entorno
export DISCORD_BOT_TOKEN="tu_token"
export DISCORD_GUILD_ID="tu_guild_id"

npm run test:api
```

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
