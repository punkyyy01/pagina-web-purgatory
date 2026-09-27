/* Único endpoint que puede escribir calidad_motivo = 'logro'. El rol de
   quien hace la request se deriva server-side desde su propia sesión —
   nunca desde un campo del form — así que no hay forma de otorgarse el
   logro a uno mismo falsificando el POST. */
import { getSessionUser } from '../../../../lib/auth.js';
import { getMemberStatus, updateCalidadMotivo } from '../../../../lib/db.js';
import { deriveRol, getCalidadDerivada } from '../../../../lib/alma.js';

export const prerender = false;

export async function POST({ request, cookies, redirect }) {
  const session = await getSessionUser(cookies);
  const rolSolicitante = deriveRol(session?.member ?? null);
  if (!session || rolSolicitante !== 'moderador') {
    return new Response('No autorizado', { status: 403 });
  }

  const form = await request.formData();
  const targetDiscordId = (form.get('discordId') ?? '').toString();
  const accion = form.get('accion') === 'otorgar' ? 'otorgar' : 'revocar';

  if (!/^\d+$/.test(targetDiscordId)) {
    return new Response('discordId inválido', { status: 400 });
  }

  if (accion === 'otorgar') {
    await updateCalidadMotivo(targetDiscordId, 'shiny', 'logro');
  } else {
    // No lo baja a 'normal' a ciegas: si sigue siendo moderador o
    // booster, eso se recalcula acá mismo contra su estado real, no
    // recién en su próximo guardado del Card Builder.
    const targetMember = await getMemberStatus(targetDiscordId);
    const rolDestino = deriveRol(targetMember);
    const { calidad, calidadMotivo } = getCalidadDerivada(targetMember, rolDestino, null);
    await updateCalidadMotivo(targetDiscordId, calidad, calidadMotivo);
  }

  return redirect(`/staff/almas?q=${encodeURIComponent(targetDiscordId)}`);
}
