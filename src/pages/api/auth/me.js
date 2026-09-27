/* Lo consume auth-nav.js del lado del cliente para saber si hay que
   mostrar "Iniciar sesión" o el usuario logueado — el resto del sitio
   sigue pre-renderizado y estático, esto es la única parte dinámica. */
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
