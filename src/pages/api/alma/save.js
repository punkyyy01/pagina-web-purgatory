/* Guardado de autoservicio del Card Builder. calidad/calidadMotivo NUNCA
   salen del form — se recalculan acá mismo a partir de datos verificados
   (getCalidadDerivada), así que no hay forma de que alguien se autoasigne
   shiny editando el HTML del formulario. */
import { getSessionUser } from '../../../lib/auth.js';
import { getAlma, upsertAlma } from '../../../lib/db.js';
import { deriveRol, getCalidadDerivada, ERA_LABELS } from '../../../lib/alma.js';

export const prerender = false;

const MAX = { nick: 40, mote: 60, frase: 140, descripcion: 600 };

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function readField(form, name, maxLength) {
  return (form.get(name) ?? '').toString().trim().slice(0, maxLength);
}

export async function POST({ request, cookies, redirect }) {
  const session = await getSessionUser(cookies);
  if (!session || !session.member?.isMember) {
    return redirect('/cuenta?error=oauth_denied');
  }

  const form = await request.formData();
  const nick = readField(form, 'nick', MAX.nick);
  const eraInput = (form.get('era') ?? '').toString();
  const era = eraInput in ERA_LABELS ? eraInput : 'purgatory';
  const moteSuperior = readField(form, 'moteSuperior', MAX.mote);
  const moteInferior = readField(form, 'moteInferior', MAX.mote);
  const fraseIconica = readField(form, 'fraseIconica', MAX.frase);
  const descripcion = readField(form, 'descripcion', MAX.descripcion);
  // 'privada' es un estado administrado — nunca llega elegible desde el form.
  const estadoPublicacion = form.get('estadoPublicacion') === 'publicada' ? 'publicada' : 'borrador';

  if (!nick) {
    return redirect('/cuenta/editar?error=nick_requerido');
  }

  const existing = await getAlma(session.discordId);
  const rol = deriveRol(session.member);
  const { calidad, calidadMotivo } = getCalidadDerivada(session.member, rol, existing?.calidadMotivo ?? null);

  const fields = {
    nick, era, moteSuperior, moteInferior, fraseIconica, descripcion,
    estadoPublicacion, calidad, calidadMotivo,
  };

  if (existing) {
    // El slug ya está fijado — se reenvía tal cual, nunca se recalcula.
    await upsertAlma(session.discordId, { ...fields, slug: existing.slug });
  } else {
    const base = slugify(nick) || `alma-${session.discordId}`;
    let attempt = 0;
    for (;;) {
      const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
      try {
        await upsertAlma(session.discordId, { ...fields, slug: candidate });
        break;
      } catch (err) {
        // 23505 = unique_violation. El único índice único además de la PK
        // (discord_id, ya cubierta por el ON CONFLICT) es slug.
        if (err?.code === '23505' && attempt < 20) {
          attempt += 1;
          continue;
        }
        throw err;
      }
    }
  }

  return redirect('/cuenta/editar?guardado=1');
}
