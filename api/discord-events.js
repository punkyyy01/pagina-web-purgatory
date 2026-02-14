/* ═══════════════════════════════════════════════════════════
   Vercel Serverless Function — Discord Scheduled Events
   ═══════════════════════════════════════════════════════════
   Variables de entorno requeridas (configurar en Vercel Dashboard):
     DISCORD_BOT_TOKEN  — Token del bot de Discord
     DISCORD_GUILD_ID   — ID numérico del servidor de Discord
   ═══════════════════════════════════════════════════════════ */

module.exports = async function handler(req, res) {
  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !guildId) {
    return res.status(500).json({
      error: 'Configuración incompleta: falta DISCORD_BOT_TOKEN o DISCORD_GUILD_ID en las variables de entorno.'
    });
  }

  try {
    const url = 'https://discord.com/api/v10/guilds/' + guildId + '/scheduled-events?with_user_count=true';
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Bot ' + token
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Error de la API de Discord: ' + errorText
      });
    }

    const events = await response.json();

    /* Filtrar solo eventos futuros o activos, ordenados por fecha de inicio */
    var now = new Date();
    var filtered = events
      .filter(function (e) {
        /* status: 1 = SCHEDULED, 2 = ACTIVE */
        return (e.status === 1 || e.status === 2);
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
          image: e.image ? ('https://cdn.discordapp.com/guild-events/' + e.id + '/' + e.image + '.png?size=512') : null
        };
      });

    /* Cache CDN: 60s fresh + 120s stale-while-revalidate */
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(filtered);

  } catch (err) {
    return res.status(500).json({ error: 'Error interno: ' + err.message });
  }
};
