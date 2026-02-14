/* ═══════════════════════════════════════════════════════════
   Vercel Serverless Function — Discord Scheduled Events
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

/* ─── In-memory cache (persiste entre invocaciones en caliente) ─── */
var _cache = { data: null, json: null, etag: null, ts: 0 };
var CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutos

/** Genera un ETag simple a partir de un string JSON */
function makeEtag(jsonStr) {
  // FNV-1a 32-bit — rápido y suficiente para comparaciones de igualdad
  var hash = 0x811c9dc5;
  for (var i = 0; i < jsonStr.length; i++) {
    hash ^= jsonStr.charCodeAt(i);
    hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) +
            (hash << 8) + (hash << 24)) >>> 0;
  }
  return '"ev-' + hash.toString(36) + '"';
}

/** Filtra y mapea los eventos crudos de Discord al formato limpio */
function transformEvents(raw) {
  return raw
    .filter(function (e) {
      /* status: 1 = SCHEDULED, 2 = ACTIVE */
      return e.status === 1 || e.status === 2;
    })
    .sort(function (a, b) {
      return new Date(a.scheduled_start_time) - new Date(b.scheduled_start_time);
    })
    .map(function (e) {
      return {
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
          : null
      };
    });
}

module.exports = async function handler(req, res) {
  var token = process.env.DISCORD_BOT_TOKEN;
  var guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !guildId) {
    console.error('ENV MISSING', { hasToken: !!token, hasGuildId: !!guildId });
    return res.status(500).json({
      error: 'Configuración incompleta: falta DISCORD_BOT_TOKEN o DISCORD_GUILD_ID en las variables de entorno.'
    });
  }

  /* Asegurar que fetch exista en entornos Node < 18 */
  if (!globalThis.fetch) {
    try {
      var nodeFetch = await import('node-fetch');
      globalThis.fetch = nodeFetch.default;
    } catch (_) { /* Node 18+ ya lo tiene */ }
  }

  try {
    var now = Date.now();

    /* ─── 1. ¿Caché in-memory fresco? ─── */
    if (_cache.data && (now - _cache.ts) < CACHE_TTL_MS) {
      return sendResponse(req, res, _cache);
    }

    /* ─── 2. Fetch desde Discord API ─── */
    var url = 'https://discord.com/api/v10/guilds/' + guildId +
              '/scheduled-events?with_user_count=true';

    var response = await fetch(url, {
      headers: {
        'Authorization': 'Bot ' + token,
        'Accept': 'application/json',
        'User-Agent': 'pagina-web-purgatory/1.0 (+https://github.com)'
      }
    });

    if (!response.ok) {
      var errorText = await response.text();
      /* Si hay caché viejo, mejor devolver datos stale que un error */
      if (_cache.data) {
        console.warn('Discord API error, returning stale cache:', errorText);
        return sendResponse(req, res, _cache);
      }
      return res.status(response.status).json({
        error: 'Error de la API de Discord: ' + errorText
      });
    }

    var raw = await response.json();
    var filtered = transformEvents(raw);
    var jsonStr = JSON.stringify(filtered);

    /* ─── 3. Actualizar caché in-memory ─── */
    _cache = {
      data: filtered,
      json: jsonStr,
      etag: makeEtag(jsonStr),
      ts: Date.now()
    };

    return sendResponse(req, res, _cache);

  } catch (err) {
    console.error('Discord events fetch error', err);
    /* Fallback a caché stale si existe */
    if (_cache.data) {
      return sendResponse(req, res, _cache);
    }
    return res.status(500).json({
      error: 'Error interno: ' + (err && err.message ? err.message : String(err))
    });
  }
};

/**
 * Envía la respuesta con headers óptimos.
 * Si el cliente envía If-None-Match y coincide → 304 sin cuerpo.
 */
function sendResponse(req, res, cache) {
  /* Headers comunes */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Vary', 'Accept, If-None-Match');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('ETag', cache.etag);
  /* CDN: 2 min fresco + 5 min stale-while-revalidate + 1 h stale-if-error.
     Esto significa que Vercel Edge sirve la mayoría de requests sin
     invocar la función en absoluto. */
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300, stale-if-error=3600');

  /* ¿El cliente ya tiene esta versión? → 304 */
  var clientEtag = req.headers['if-none-match'];
  if (clientEtag && clientEtag === cache.etag) {
    return res.status(304).end();
  }

  return res.status(200).end(cache.json);
}
