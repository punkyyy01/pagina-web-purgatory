/* Intercambia el code por un access_token de corta vida, pide la
   identidad (`/users/@me`) y listo — el token de Discord se descarta
   en el momento, no se guarda en ningún lado. No hace falta: para
   saber si es miembro, qué roles tiene o si bostea, ya está
   discord_members (lo mantiene sincronizado el bot). Esto es login
   de identidad únicamente, no una integración continua con la API de
   Discord. */
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '../../../lib/session.js';

export const prerender = false;

const TOKEN_URL = 'https://discord.com/api/oauth2/token';
const USER_URL = 'https://discord.com/api/users/@me';

export async function GET({ url, cookies, redirect }) {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies.get('oauth_state')?.value;
  cookies.delete('oauth_state', { path: '/' });

  if (!code || !state || !storedState || state !== storedState) {
    return redirect('/cuenta?error=oauth_state');
  }

  const clientId = import.meta.env.DISCORD_CLIENT_ID;
  const clientSecret = import.meta.env.DISCORD_CLIENT_SECRET;
  const redirectUri = import.meta.env.DISCORD_REDIRECT_URI;

  let tokenRes;
  try {
    tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });
  } catch (err) {
    console.error('discord oauth: token exchange no respondió', err);
    return redirect('/cuenta?error=discord_unreachable');
  }

  if (!tokenRes.ok) {
    console.error('discord oauth: token exchange rechazado', tokenRes.status, await tokenRes.text());
    return redirect('/cuenta?error=oauth_denied');
  }

  const { access_token: accessToken } = await tokenRes.json();

  let userRes;
  try {
    userRes = await fetch(USER_URL, { headers: { Authorization: `Bearer ${accessToken}` } });
  } catch (err) {
    console.error('discord oauth: /users/@me no respondió', err);
    return redirect('/cuenta?error=discord_unreachable');
  }

  if (!userRes.ok) {
    console.error('discord oauth: /users/@me rechazado', userRes.status);
    return redirect('/cuenta?error=oauth_denied');
  }

  const discordUser = await userRes.json();

  cookies.set(SESSION_COOKIE, signSession(discordUser.id), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return redirect('/cuenta');
}
