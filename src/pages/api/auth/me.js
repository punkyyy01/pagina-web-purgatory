/* Endpoint para que el cliente sepa si hay que mostrar "Iniciar sesión"
   o el usuario logueado. Antes lo consumía auth-nav.js (UI vieja,
   eliminada) — el contrato de respuesta se mantiene igual para lo que
   lo reemplace. */
import { getSessionUser } from '../../../lib/auth.js';

export const prerender = false;

export async function GET({ cookies }) {
  const session = await getSessionUser(cookies);

  if (!session) {
    return Response.json({ authenticated: false });
  }

  return Response.json({
    authenticated: true,
    discordId: session.discordId,
    isMember: session.member?.isMember ?? false,
    username: session.member?.username ?? null,
    globalName: session.member?.globalName ?? null,
    avatarUrl: session.member?.avatarUrl ?? null,
  });
}
