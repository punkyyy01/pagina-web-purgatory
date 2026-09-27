/* Redirige a Discord para autorizar. Scope únicamente `identify` — no
   pedimos guilds ni guilds.members.read: la membresía/roles ya los
   tiene el bot en discord_members, no hace falta que la web se los
   vuelva a pedir a Discord por su cuenta. */
import crypto from 'node:crypto';

export const prerender = false;

const DISCORD_AUTHORIZE_URL = 'https://discord.com/api/oauth2/authorize';

export async function GET({ cookies, redirect }) {
  const clientId = import.meta.env.DISCORD_CLIENT_ID;
  const redirectUri = import.meta.env.DISCORD_REDIRECT_URI;

  const state = crypto.randomBytes(16).toString('hex');
  cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 300, // 5 min — solo lo que tarda el ida y vuelta a Discord
  });

  const url = new URL(DISCORD_AUTHORIZE_URL);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'identify');
  url.searchParams.set('state', state);

  return redirect(url.toString());
}
