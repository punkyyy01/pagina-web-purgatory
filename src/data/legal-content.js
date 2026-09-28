/* ═══════════════════════════════════════════════════════════
   PURGATORY — Textos legales (contenido/canon)
   ───────────────────────────────────────────────────────────
   Extraído de las antiguas src/pages/privacidad.astro y
   src/pages/terminos.astro (markup + contenido mezclados), ya
   eliminadas. Solo el texto — el nuevo frontend decide el layout.
   ═══════════════════════════════════════════════════════════ */

export const privacidad = {
  titulo: 'Privacidad',
  lead: 'Lo mínimo necesario para que el login y las cartas 4LMA funcionen.',
  texto:
    'Al iniciar sesión con Discord guardamos tu ID de Discord y una cookie de sesión firmada — nada más se lee ' +
    'de tu cuenta. Tu nombre, avatar, rol y estado de membresía se sincronizan directo desde Discord y nunca ' +
    'los edita esta web. El contenido de tu 4LMA (nick, frase, motes) lo escribís vos mismo desde el Card ' +
    'Builder y podés borrarlo o dejarlo en borrador en cualquier momento.',
};

export const terminos = {
  titulo: 'Términos',
  lead: 'Este es un proyecto de fans hecho por y para la comunidad de PURG4TORY — no representa a Discord Inc.',
  texto:
    'El contenido de este sitio (lore, personajes, cartas 4LMA) es ficción o material aportado por la propia ' +
    'comunidad del servidor. El acceso a funciones que requieren inicio de sesión está condicionado a ser ' +
    'miembro verificado del servidor de Discord. Nos reservamos el derecho de moderar o retirar contenido que ' +
    'viole las normas del servidor.',
};
