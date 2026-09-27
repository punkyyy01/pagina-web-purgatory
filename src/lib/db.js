/* ═══════════════════════════════════════════════════════════
   Cliente de Postgres — SOLO lectura de discord_members.
   ───────────────────────────────────────────────────────────
   Se conecta con el rol `web_app` (ver purgatory-sync/sql/0002_web_read_role.sql),
   que no tiene permiso de escritura sobre discord_members bajo ninguna
   circunstancia — esa tabla la escribe únicamente el bot. Esto no es
   solo una convención de código: está reforzado a nivel de permisos
   de Postgres, así que ni un bug ni una inyección acá podrían
   falsificar una propiedad verificada de Discord.

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
      discord_id, username, global_name, avatar_url,
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
    isMember: row.is_member,
    isBanned: row.is_banned,
    roles: (row.roles ?? []).map(String),
    isBooster: row.is_booster,
    boostingSince: row.boosting_since,
  };
}
