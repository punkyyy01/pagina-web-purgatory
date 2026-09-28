<div align="center">

```
██████╗ ██╗   ██╗██████╗  ██████╗  █████╗ ████████╗ ██████╗ ██████╗ ██╗   ██╗
██╔══██╗██║   ██║██╔══██╗██╔════╝ ██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝
██████╔╝██║   ██║██████╔╝██║  ███╗███████║   ██║   ██║   ██║██████╔╝ ╚████╔╝ 
██╔═══╝ ██║   ██║██╔══██╗██║   ██║██╔══██║   ██║   ██║   ██║██╔══██╗  ╚██╔╝  
██║     ╚██████╔╝██║  ██║╚██████╔╝██║  ██║   ██║   ╚██████╔╝██║  ██║   ██║   
╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝  
```

**Sitio web oficial de la comunidad del servidor de Discord PURG4TORY**

[![Desplegado en Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)
[![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Discord](https://img.shields.io/badge/Discord-PURG4TORY-5865F2?style=flat&logo=discord&logoColor=white)](https://discord.gg/aTFMEVzcew)

</div>

---

## Estado actual del proyecto

**El frontend visual está en reconstrucción desde cero.** El sistema visual anterior (CSS,
componentes, carrusel de 4LMA, navbar/footer, animaciones) se eliminó por completo a propósito
— no es un bug ni un estado a medias. El **backend, la base de datos, la autenticación y los
endpoints/API siguen funcionando normalmente**. Las páginas que dependen de lógica de servidor
(`/`, `/4lma`, `/cuenta`, `/cuenta/editar`, `/staff/almas`) hoy renderizan HTML sin estilo,
únicamente para probar que esa lógica sigue viva mientras se diseña el nuevo frontend a partir
de los bocetos de Excalidraw del proyecto.

Las páginas puramente de contenido que no tenían lógica de servidor (`/lore`, `/personajes`,
`/condenados`, `/eventos`, `/privacidad`, `/terminos`, `/404`) se eliminaron enteras — su
contenido/canon se conservó en `src/data/` (ver más abajo) y esas rutas no existen hasta que el
nuevo frontend las reconstruya.

---

## ¿Qué es PURG4TORY?

**PURG4TORY** es la comunidad de un servidor de Discord. El concepto central del sitio es la
**4LMA**: una carta coleccionable que representa a cada miembro del servidor, personalizable por
el propio usuario y vinculada a su cuenta de Discord vía OAuth2. El lore/mitología del servidor
también existe como contenido, pero es secundario frente a las 4LMA.

---

## Arquitectura

```
pagina-web-purgatory/
├── astro.config.mjs          ← Config de Astro (output: server, adapter Vercel)
├── vercel.json                ← Cabeceras de seguridad (CSP) y caché
├── .env.example                ← Variables de entorno requeridas
├── package.json
├── sql/
│   └── 0001_almas.sql         ← Schema de la tabla `almas` (contenido del 4LMA)
├── src/
│   ├── layouts/
│   │   └── Layout.astro       ← <head> mínimo (meta/CSP) — sin sistema visual
│   ├── lib/                    ← Lógica de negocio y acceso a datos (backend)
│   │   ├── db.js               ← Cliente Postgres — único punto de acceso a la DB
│   │   ├── auth.js             ← Resuelve sesión + estado real de Discord
│   │   ├── session.js          ← Firma/verifica la cookie de sesión (HMAC)
│   │   └── alma.js             ← Modelo de dominio de la 4LMA (calidad, era, roles...)
│   ├── data/                   ← Contenido/canon, independiente del diseño
│   │   ├── personajes-data.js  ← Personajes canónicos del lore
│   │   ├── condenados-data.js  ← Círculos del Infierno
│   │   ├── lore-content.js     ← Capítulos del lore (Origen, Leyes, Eras, Códex)
│   │   └── legal-content.js    ← Textos de privacidad/términos
│   └── pages/
│       ├── index.astro         ← Home (lógica real, sin diseño — WIP)
│       ├── 4lma.astro          ← Galería de 4LMA (lógica real, sin diseño — WIP)
│       ├── cuenta.astro        ← Login/estado de cuenta (lógica real, sin diseño — WIP)
│       ├── cuenta/editar.astro ← Card Builder (lógica real, sin diseño — WIP)
│       ├── staff/almas.astro   ← Panel de moderación (lógica real, sin diseño — WIP)
│       └── api/
│           ├── auth/           ← login, callback, logout, me (OAuth2 con Discord)
│           ├── alma/           ← save.js (Card Builder), admin/logro.js (staff)
│           └── discord-events.js ← Eventos programados del servidor (cacheado)
├── scripts/
│   └── download-fonts.js       ← Descarga fuentes woff2 desde Google Fonts (a demanda)
└── public/
    └── static/img/logo.svg     ← Único asset visual que sobrevivió a la limpieza
```

---

## Backend / contratos que el nuevo frontend debe respetar

- **Sesión**: cookie `purg4tory_session`, firmada con HMAC — nunca se confía en membresía/roles
  del token, se re-verifica contra `discord_members` en cada request (`getSessionUser`).
- **`GET /api/auth/me`** → `{ authenticated, discordId, isMember, username, globalName, avatarUrl }`.
- **`POST /api/alma/save`** (form-data) → campos `nick`, `era`, `moteSuperior`, `moteInferior`,
  `fraseIconica`, `descripcion`, `estadoPublicacion`. `calidad`/`calidadMotivo` siempre se derivan
  server-side, nunca los manda el cliente.
- **`POST /api/alma/admin/logro`** (form-data, solo moderadores) → `discordId`, `accion`
  (`otorgar` | `revocar`).
- **El objeto `Alma`** que arma `mergeAlma()` en `src/lib/alma.js` es lo que cualquier componente
  de carta nuevo recibe como dato.
- **`GET /api/discord-events`** → eventos programados de Discord, cacheado con ETag/304.

## Variables de entorno

Ver `.env.example` — Discord OAuth2 (login), Discord Bot Token (eventos), `DATABASE_URL`
(Postgres, rol `web_app`), `SESSION_SECRET`, `DISCORD_MODERATOR_ROLE_ID`.

---

<div align="center">

**[Entrar al servidor](https://discord.gg/aTFMEVzcew)**

</div>
