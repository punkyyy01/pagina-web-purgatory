/* ═══════════════════════════════════════════════════════════
   Cliente de Postgres — SOLO lectura de discord_members, lectura y
   escritura de almas.
   ───────────────────────────────────────────────────────────
   Se conecta con el rol `web_app` (ver purgatory-sync/sql/0002_web_read_role.sql
   y sql/0001_almas.sql), que no tiene permiso de escritura sobre
   discord_members bajo ninguna circunstancia — esa tabla la escribe
   únicamente el bot. Esto no es solo una convención de código: está
   reforzado a nivel de permisos de Postgres, así que ni un bug ni una
   inyección acá podrían falsificar una propiedad verificada de Discord.
   Sobre `almas` sí tiene select+insert+update — es la tabla que la
   propia web usa para el Card Builder.

   Puerto 6543 (el pooler / PgBouncer en modo transacción), no el 5432
   directo: la web corre en funciones serverless de Vercel — muchas
   conexiones cortas y concurrentes, exactamente el caso para el que
   existe el pooler. `prepare: false` es obligatorio con PgBouncer en
   modo transacción (no soporta prepared statements de sesión).
   ═══════════════════════════════════════════════════════════ */
import postgres from 'postgres';

const DATABASE_URL = import.meta.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('Falta DATABASE_URL — revisá las variables de entorno.');
}

export const sql = postgres(DATABASE_URL, {
  prepare: false,
  max: 5,
  idle_timeout: 20,
});

/**
 * @typedef {Object} DiscordMemberStatus
 * @property {string} discordId
 * @property {string} username
 * @property {string | null} globalName
 * @property {string | null} avatarUrl
 * @property {string | null} joinedAt
 * @property {boolean} isMember
 * @property {boolean} isBanned
 * @property {string[]} roles
 * @property {boolean} isBooster
 * @property {string | null} boostingSince
 */

/**
 * @param {string} discordId
 * @returns {Promise<DiscordMemberStatus | null>}
 */
export async function getMemberStatus(discordId) {
  const rows = await sql`
    select
      discord_id, username, global_name, avatar_url, joined_at,
      is_member, is_banned, roles, is_booster, boosting_since
    from discord_members
    where discord_id = ${discordId}::bigint
  `;
  const row = rows[0];
  if (!row) return null;

  return {
    discordId: row.discord_id.toString(),
    username: row.username,
    globalName: row.global_name,
    avatarUrl: row.avatar_url,
    joinedAt: row.joined_at,
    isMember: row.is_member,
    isBanned: row.is_banned,
    roles: (row.roles ?? []).map(String),
    isBooster: row.is_booster,
    boostingSince: row.boosting_since,
  };
}

/**
 * @typedef {Object} AlmaRow
 * @property {string} discordId
 * @property {string} slug
 * @property {string} nick
 * @property {import('./alma.js').EraKey} era
 * @property {string} moteSuperior
 * @property {string} moteInferior
 * @property {string} fraseIconica
 * @property {string} descripcion
 * @property {import('./alma.js').Calidad} calidad
 * @property {import('./alma.js').CalidadMotivo} calidadMotivo
 * @property {'borrador' | 'publicada' | 'privada'} estadoPublicacion
 */

/**
 * @param {string} discordId
 * @returns {Promise<AlmaRow | null>}
 */
export async function getAlma(discordId) {
  const rows = await sql`
    select
      discord_id, slug, nick, era, mote_superior, mote_inferior,
      frase_iconica, descripcion, calidad, calidad_motivo, estado_publicacion
    from almas
    where discord_id = ${discordId}::bigint
  `;
  const row = rows[0];
  if (!row) return null;

  return {
    discordId: row.discord_id.toString(),
    slug: row.slug,
    nick: row.nick,
    era: row.era,
    moteSuperior: row.mote_superior,
    moteInferior: row.mote_inferior,
    fraseIconica: row.frase_iconica,
    descripcion: row.descripcion,
    calidad: row.calidad,
    calidadMotivo: row.calidad_motivo,
    estadoPublicacion: row.estado_publicacion,
  };
}

/**
 * Upsert de autoservicio — lo usa /api/alma/save.js. `calidad`/`calidadMotivo`
 * ya vienen derivados por getCalidadDerivada() antes de llegar acá; esta
 * función no decide esos valores, solo los persiste. `slug` queda afuera
 * del SET del ON CONFLICT a propósito: se fija en la fila una sola vez,
 * al crearla, y no se toca en ediciones posteriores.
 * @param {string} discordId
 * @param {Omit<AlmaRow, 'discordId'>} fields
 */
export async function upsertAlma(discordId, fields) {
  const {
    slug, nick, era, moteSuperior, moteInferior, fraseIconica, descripcion,
    estadoPublicacion, calidad, calidadMotivo,
  } = fields;

  const rows = await sql`
    insert into almas (
      discord_id, slug, nick, era, mote_superior, mote_inferior, frase_iconica,
      descripcion, calidad, calidad_motivo, estado_publicacion, updated_at
    ) values (
      ${discordId}::bigint, ${slug}, ${nick}, ${era}, ${moteSuperior}, ${moteInferior},
      ${fraseIconica}, ${descripcion}, ${calidad}, ${calidadMotivo}, ${estadoPublicacion}, now()
    )
    on conflict (discord_id) do update set
      nick               = excluded.nick,
      era                = excluded.era,
      mote_superior      = excluded.mote_superior,
      mote_inferior      = excluded.mote_inferior,
      frase_iconica      = excluded.frase_iconica,
      descripcion        = excluded.descripcion,
      calidad            = excluded.calidad,
      calidad_motivo     = excluded.calidad_motivo,
      estado_publicacion = excluded.estado_publicacion,
      updated_at         = now()
    returning discord_id, slug
  `;
  return rows[0];
}

/**
 * Único punto de escritura para calidad_motivo = 'logro'. Lo llama
 * exclusivamente /api/alma/admin/logro.js, después de verificar del lado
 * del servidor que quien hace la request es 'moderador' — nunca a partir
 * de un campo que mande el propio cliente. Hace upsert (no solo update)
 * porque un mod puede otorgar el logro antes de que la persona haya
 * usado el Card Builder ni una vez; el resto de columnas cae en sus
 * defaults del schema en ese caso.
 * @param {string} discordId
 * @param {import('./alma.js').Calidad} calidad
 * @param {import('./alma.js').CalidadMotivo} calidadMotivo
 */
export async function updateCalidadMotivo(discordId, calidad, calidadMotivo) {
  const rows = await sql`
    insert into almas (discord_id, calidad, calidad_motivo, updated_at)
    values (${discordId}::bigint, ${calidad}, ${calidadMotivo}, now())
    on conflict (discord_id) do update set
      calidad        = excluded.calidad,
      calidad_motivo = excluded.calidad_motivo,
      updated_at     = now()
    returning discord_id, calidad, calidad_motivo
  `;
  return rows[0];
}

/**
 * Búsqueda para el panel /staff/almas — por nombre de Discord o por ID
 * exacto. Sin `query` no devuelve nada: el panel no lista a todo el
 * mundo por defecto, solo lo que un mod busca puntualmente.
 * @param {string} query
 */
export async function searchMembersForAdmin(query) {
  const like = `%${query}%`;
  const rows = await sql`
    select
      m.discord_id, m.username, m.global_name, m.roles, m.is_booster,
      m.is_member, m.is_banned,
      a.nick, a.calidad, a.calidad_motivo, a.estado_publicacion
    from discord_members m
    left join almas a on a.discord_id = m.discord_id
    where m.username ilike ${like} or m.global_name ilike ${like} or m.discord_id::text = ${query}
    order by m.username
    limit 25
  `;
  return rows.map((row) => ({
    discordId: row.discord_id.toString(),
    username: row.username,
    globalName: row.global_name,
    roles: (row.roles ?? []).map(String),
    isBooster: row.is_booster,
    isMember: row.is_member,
    isBanned: row.is_banned,
    nick: row.nick,
    calidad: row.calidad ?? 'normal',
    calidadMotivo: row.calidad_motivo ?? null,
    estadoPublicacion: row.estado_publicacion ?? 'borrador',
  }));
}
