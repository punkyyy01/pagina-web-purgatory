/* Combina session.js (¿quién dice ser?) con db.js (¿qué dice Discord de
   verdad sobre esa persona, ahora mismo?) — el punto único que
   cualquier página/endpoint protegido debería usar. */
import { verifySession, SESSION_COOKIE } from './session.js';
import { getMemberStatus } from './db.js';

/**
 * @param {import('astro').AstroCookies} cookies
 * @returns {Promise<{ discordId: string, member: import('./db.js').DiscordMemberStatus | null } | null>}
 */
export async function getSessionUser(cookies) {
  const token = cookies.get(SESSION_COOKIE)?.value;
  const session = verifySession(token);
  if (!session) return null;

  // Siempre fresco desde la base — nunca se confía en nada que el
  // token pueda haber afirmado sobre membresía o roles.
  const member = await getMemberStatus(session.discordId);
  return { discordId: session.discordId, member };
}
