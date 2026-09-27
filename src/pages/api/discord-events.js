/* ═══════════════════════════════════════════════════════════
   Endpoint de Astro (Vercel Function) — Discord Scheduled Events
   ═══════════════════════════════════════════════════════════
   Variables de entorno requeridas (configurar en Vercel Dashboard):
     DISCORD_BOT_TOKEN  — Token del bot de Discord
     DISCORD_GUILD_ID   — ID numérico del servidor de Discord

   Estrategia de caché (costo $0):
     1. In-memory cache (2 min) — sobrevive mientras la instancia
        serverless esté "caliente". Evita llamadas redundantes a Discord.
     2. Vercel CDN edge cache (s-maxage 2 min + stale-while-revalidate
        5 min). La mayoría de requests ni siquiera invocan la función.
     3. ETag / 304 Not Modified — si los datos no cambiaron, el cliente
        recibe un 304 sin cuerpo (ahorra ancho de banda).
     4. El cliente hace polling cada 60 s con ETag → la mayoría de
        respuestas son 304 (< 1 KB). Resultado: eventos siempre frescos
        sin gastar invocaciones.
   ═══════════════════════════════════════════════════════════ */

export const prerender = false;

/* ─── In-memory cache (persiste entre invocaciones en caliente) ─── */
let _cache = { data: null, json: null, etag: null, ts: 0 };
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutos

/** Genera un ETag simple a partir de un string JSON */
function makeEtag(jsonStr) {
  // FNV-1a 32-bit — rápido y suficiente para comparaciones de igualdad
  let hash = 0x811c9dc5;
  for (let i = 0; i < jsonStr.length; i++) {
    hash ^= jsonStr.charCodeAt(i);
    hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) +
            (hash << 8) + (hash << 24)) >>> 0;
  }
  return '"ev-' + hash.toString(36) + '"';
}

/** Filtra y mapea los eventos crudos de Discord al formato limpio */
function transformEvents(raw) {
  return raw
    .filter((e) => e.status === 1 || e.status === 2) // 1=SCHEDULED, 2=ACTIVE
    .sort((a, b) => new Date(a.scheduled_start_time) - new Date(b.scheduled_start_time))
    .map((e) => ({
      id: e.id,
      guild_id: e.guild_id,
      name: e.name,
      description: e.description || '',
      start: e.scheduled_start_time,
      end: e.scheduled_end_time || null,
      status: e.status === 2 ? 'active' : 'scheduled',
      user_count: e.user_count || 0,
      location: (e.entity_metadata && e.entity_metadata.location) || null,
      image: e.image
        ? 'https://cdn.discordapp.com/guild-events/' + e.id + '/' + e.image + '.png?size=512'
        : null,
    }));
}

/** Quita espacios y comillas envolventes de una variable de entorno */
function normalizeEnvValue(value) {
  if (value == null) return '';
  let clean = String(value).trim();
  if (hasWrappingQuotes(clean)) clean = clean.slice(1, -1).trim();
  return clean;
}

/** Discord requiere `Authorization: Bot <token>`, aquí guardamos solo `<token>`. */
function normalizeDiscordToken(value) {
  return normalizeEnvValue(value).replace(/^bot\s+/i, '').trim();
}

function hasWrappingQuotes(value) {
  return (
    value.length >= 2 &&
    ((value[0] === '"' && value[value.length - 1] === '"') ||
      (value[0] === "'" && value[value.length - 1] === "'"))
  );
}

/** Construye la Response con headers óptimos; 304 sin cuerpo si el ETag coincide. */
function buildResponse(request, cache) {
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    Vary: 'Accept, If-None-Match',
    'Content-Type': 'application/json',
    ETag: cache.etag,
    /* CDN: 2 min fresco + 5 min stale-while-revalidate + 1 h stale-if-error. */
    'Cache-Control': 's-maxage=120, stale-while-revalidate=300, stale-if-error=3600',
  });

  const clientEtag = request.headers.get('if-none-match');
  if (clientEtag && clientEtag === cache.etag) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(cache.json, { status: 200, headers });
}

export async function GET({ request }) {
  const rawToken = import.meta.env.DISCORD_BOT_TOKEN;
  const token = normalizeDiscordToken(rawToken);
  const guildId = normalizeEnvValue(import.meta.env.DISCORD_GUILD_ID);

  if (!token || !guildId) {
    console.error('ENV MISSING', { hasToken: !!token, hasGuildId: !!guildId });
    return Response.json(
      { error: 'Configuración incompleta: falta DISCORD_BOT_TOKEN o DISCORD_GUILD_ID en las variables de entorno.' },
      { status: 500 }
    );
  }

  if (!/^\d+$/.test(guildId)) {
    return Response.json(
      { error: 'Configuración inválida: DISCORD_GUILD_ID debe ser un ID numérico (sin comillas).' },
      { status: 500 }
    );
  }

  try {
    const now = Date.now();

    /* ─── 1. ¿Caché in-memory fresco? ─── */
    if (_cache.data && now - _cache.ts < CACHE_TTL_MS) {
      return buildResponse(request, _cache);
    }

    /* ─── 2. Fetch desde Discord API ─── */
    const url = `https://discord.com/api/v10/guilds/${guildId}/scheduled-events?with_user_count=true`;

    const response = await fetch(url, {
      headers: {
        Authorization: 'Bot ' + token,
        Accept: 'application/json',
        'User-Agent': 'pagina-web-purgatory/1.0 (+https://github.com)',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 401) {
        console.error('DISCORD AUTH ERROR', {
          tokenLength: token.length,
          tokenHadBotPrefix: /^\s*bot\s+/i.test(String(rawToken || '')),
          tokenHadQuotes: hasWrappingQuotes(String(rawToken || '')),
        });
      }

      /* Si hay caché viejo, mejor devolver datos stale que un error */
      if (_cache.data) {
        console.warn('Discord API error, returning stale cache:', errorText);
        return buildResponse(request, _cache);
      }

      let message = 'Error de la API de Discord: ' + errorText;
      if (response.status === 401) {
        message += ' | Revisa DISCORD_BOT_TOKEN: usa solo el token (sin prefijo "Bot ", sin comillas) y vuelve a desplegar.';
      }

      return Response.json({ error: message }, { status: response.status });
    }

    const raw = await response.json();
    const filtered = transformEvents(raw);
    const jsonStr = JSON.stringify(filtered);

    /* ─── 3. Actualizar caché in-memory ─── */
    _cache = { data: filtered, json: jsonStr, etag: makeEtag(jsonStr), ts: Date.now() };

    return buildResponse(request, _cache);
  } catch (err) {
    console.error('Discord events fetch error', err);
    /* Fallback a caché stale si existe */
    if (_cache.data) {
      return buildResponse(request, _cache);
    }
    return Response.json(
      { error: 'Error interno: ' + (err && err.message ? err.message : String(err)) },
      { status: 500 }
    );
  }
}
