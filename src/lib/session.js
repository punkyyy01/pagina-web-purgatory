/* ═══════════════════════════════════════════════════════════
   Sesión — token firmado a mano con HMAC-SHA256 (node:crypto), sin
   ninguna librería de JWT. Lo único que certifica es "este discord_id
   inició sesión con Discord" — nunca guarda roles, membresía ni
   ninguna otra propiedad de Discord adentro del token. La membresía
   se vuelve a verificar contra discord_members en cada request que la
   necesite (ver auth.js) — así nunca se confía en un dato de
   autorización que pueda haber quedado viejo.
   ═══════════════════════════════════════════════════════════ */
import crypto from 'node:crypto';

const SECRET = import.meta.env.SESSION_SECRET;

if (!SECRET) {
  throw new Error('Falta SESSION_SECRET — generar con `openssl rand -hex 32`.');
}

export const SESSION_COOKIE = 'purg4tory_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

function sign(payloadB64) {
  return crypto.createHmac('sha256', SECRET).update(payloadB64).digest();
}

/** @param {string} discordId */
export function signSession(discordId) {
  const payloadB64 = Buffer.from(JSON.stringify({ sub: discordId, iat: Math.floor(Date.now() / 1000) })).toString(
    'base64url'
  );
  const signature = sign(payloadB64).toString('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * @param {string | undefined} token
 * @returns {{ discordId: string } | null}
 */
export function verifySession(token) {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, signatureB64] = parts;

  let providedSig;
  try {
    providedSig = Buffer.from(signatureB64, 'base64url');
  } catch {
    return null;
  }
  const expectedSig = sign(payloadB64);
  if (providedSig.length !== expectedSig.length || !crypto.timingSafeEqual(providedSig, expectedSig)) {
    return null; // firma inválida o token adulterado
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (typeof payload.sub !== 'string' || typeof payload.iat !== 'number') return null;

  const ageSeconds = Math.floor(Date.now() / 1000) - payload.iat;
  if (ageSeconds < 0 || ageSeconds > SESSION_MAX_AGE) return null; // expirado (o con fecha del futuro — también inválido)

  return { discordId: payload.sub };
}
