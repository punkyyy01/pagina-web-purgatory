/* ═══════════════════════════════════════════════════════════
   PURGATORY — 4LMA: modelo de datos + reglas de derivación
   ───────────────────────────────────────────────────────────
   Un 4LMA es la identidad de un usuario dentro del universo de
   PURG4TORY. Mezcla tres cosas a propósito, sin que ninguna
   sea obligatoria: la persona real (avatar/nick verificados de
   Discord), su alter ego (motes, frase, descripción — libres),
   y el lore (la Era a la que dice pertenecer).

   Procedencia de cada campo — esto es lo que hace que un badge
   "verificado" pueda ser visualmente distinto de uno personalizado
   más adelante (ver brief Fase 2 / sección 19):
     - verificado    → viene de Discord, el usuario no lo edita
     - autodeclarado → lo elige el usuario en el Card Builder (Fase 5)
     - administrado  → solo Staff lo cambia
     - sistema       → lo calcula el backend (Fase 4+), no es input directo
   ═══════════════════════════════════════════════════════════ */

/**
 * @typedef {'fosas' | 'pibes' | 'olympo' | 'purgatory'} EraKey
 * Las cuatro eras del lore (ver lore.astro). 'pibes' (Era II, "Los Pibes
 * Shitposters") es válida pero rara — ni los propios personajes canónicos
 * la usan hoy (ver personajes-data.js): fue una era de mala administración,
 * nadie quiere reclamarla. No es un bug que quede vacía en los datos de
 * ejemplo.
 */

/**
 * @typedef {'normal' | 'moderador'} Rol
 * autodeclarado: no. administrado: sí (solo Staff asigna 'moderador').
 * Deliberadamente separado de `presencia`: un moderador puede estar
 * inactivo, y alguien puede haber sido moderador antes de ser expulsado.
 * Extensible a futuro (semi-moderador, staff, etc.) sin romper el resto.
 */

/**
 * @typedef {'activo' | 'inactivo' | 'expulsado'} Presencia
 * sistema: sí, se deriva de la pertenencia real al servidor de Discord.
 * 'expulsado' fuerza `calidad` a 'void' sin importar lo demás — ver
 * getCalidadEfectiva(). No borra el 4lma: "sus nombres no se borran,
 * el Infierno no olvida" (lore.astro, Códex de las Almas).
 */

/**
 * @typedef {'normal' | 'shiny' | 'void'} Calidad
 * La variante VISUAL de la card. No es lo mismo que `rol` o `presencia`:
 * es la "calidad" que se le agrega a la característica de la persona
 * (moderador, booster, o alguien que se la ganó por otro motivo pueden
 * terminar en 'shiny'; ser 'expulsado' fuerza 'void'). Ver
 * getCalidadEfectiva() para la regla real — el campo `calidad` guardado
 * es la base "elegible", no necesariamente lo que se termina mostrando.
 */

/**
 * @typedef {'moderador' | 'booster' | 'logro' | null} CalidadMotivo
 * Por qué esta alma es elegible para 'shiny'. No cambia el render, es
 * trazabilidad — por ejemplo, para saber si hay que revocar el shiny
 * cuando alguien deja de boostear (Fase 8).
 */

/**
 * @typedef {Object} Alma
 *
 * — Verificado (Discord, no editable por el usuario) —
 * @property {string} discordId
 * @property {string} discordUsername
 * @property {string | null} discordAvatarUrl
 * @property {string | null} avatarUrl     Copia de discordAvatarUrl. Existió una
 *   versión anterior de este campo como autodeclarado (Card Builder); se
 *   descartó — el avatar de la card es siempre el de Discord, sin excepción,
 *   igual que rol/presencia. Si es null, se usa el fallback con inicial.
 * @property {string} miembroDesde        Fecha ISO de ingreso al servidor
 *
 * — Rol y presencia (administrado / sistema) —
 * @property {Rol} rol                    Ver deriveRol() — sale de discordMember.roles
 * @property {Presencia} presencia
 * @property {boolean} esBooster
 *
 * — Calidad de card (sistema, ver getCalidadEfectiva / getCalidadDerivada) —
 * @property {Calidad} calidad
 * @property {CalidadMotivo} calidadMotivo
 *
 * — Autodeclarado (Card Builder, Fase 5) —
 * @property {string} slug                Único, usado en /4lma/[slug] (Fase 7).
 *   Se genera una sola vez al crear el alma — no cambia en ediciones futuras.
 * @property {string} nick                Puede diferir del discordUsername
 * @property {EraKey} era
 * @property {string} moteSuperior        Ej: "Líder Supremo" — junto a la Era
 * @property {string} moteInferior        Ej: "Dictador de Purgatory" — bajo el nick
 * @property {string} fraseIconica
 * @property {string} descripcion         No se muestra en la card chica — vive en /4lma/[slug]
 *
 * — Publicación (sistema, con un toggle simple del lado del usuario) —
 * @property {'borrador' | 'publicada' | 'privada'} estadoPublicacion
 *   El usuario elige entre 'borrador' y 'publicada' desde el Card Builder.
 *   'privada' está reservado — todavía no tiene un mecanismo que la asigne.
 */

/** Texto del sello por cada calidad. 'normal' no lleva sello — es el
    estado por defecto, no necesita defenderse de nada (mismo principio
    que ".stamp" en Condenados: la marca aparece solo cuando hay algo
    que señalar). */
export const CALIDAD_LABELS = {
  shiny: 'Shiny',
  void: 'Void',
};

export const ERA_LABELS = {
  fosas: 'Las Fosas',
  pibes: 'Los Pibes Shitposters',
  olympo: 'Olympo',
  purgatory: 'Purgatory',
};

/**
 * La calidad que realmente se debe renderizar. `alma.calidad` es la base
 * elegible (ver CalidadMotivo); `presencia === 'expulsado'` la pisa
 * siempre, sin excepción — un moderador shiny que es expulsado pasa a
 * void igual que cualquiera.
 * @param {Alma} alma
 * @returns {Calidad}
 */
export function getCalidadEfectiva(alma) {
  if (alma.presencia === 'expulsado') return 'void';
  return alma.calidad;
}

/** IDs de rol de Discord (uno o más, separados por coma en la env var)
    que cuentan como 'moderador' para efectos de una card. Es la web la
    que decide qué significa un rol crudo de Discord — el bot solo
    sincroniza los IDs tal cual (ver purgatory-sync/sql/0001_init.sql). */
const MODERATOR_ROLE_IDS = (import.meta.env.DISCORD_MODERATOR_ROLE_ID ?? '')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

/**
 * @param {import('./db.js').DiscordMemberStatus | null} discordMember
 * @returns {Rol}
 */
export function deriveRol(discordMember) {
  if (!discordMember) return 'normal';
  const esModerador = discordMember.roles.some((id) => MODERATOR_ROLE_IDS.includes(id));
  return esModerador ? 'moderador' : 'normal';
}

/**
 * Recalcula calidad/calidadMotivo a partir de datos verificados. Se llama
 * en cada guardado del Card Builder (nunca confía en lo que mande el
 * cliente para estos dos campos). 'logro' es la única excepción: una vez
 * otorgado por Staff (vía /staff/almas), persiste aunque la persona deje
 * de ser moderadora o booster — solo Staff lo revoca a mano. La
 * revocación automática de 'booster' cuando alguien deja de boostear
 * queda para más adelante (ver CalidadMotivo).
 * @param {import('./db.js').DiscordMemberStatus | null} discordMember
 * @param {Rol} rol
 * @param {CalidadMotivo} calidadMotivoActual El valor ya guardado en almas, si existe
 * @returns {{ calidad: Calidad, calidadMotivo: CalidadMotivo }}
 */
export function getCalidadDerivada(discordMember, rol, calidadMotivoActual) {
  if (calidadMotivoActual === 'logro') {
    return { calidad: 'shiny', calidadMotivo: 'logro' };
  }
  if (rol === 'moderador') {
    return { calidad: 'shiny', calidadMotivo: 'moderador' };
  }
  if (discordMember?.isBooster) {
    return { calidad: 'shiny', calidadMotivo: 'booster' };
  }
  return { calidad: 'normal', calidadMotivo: null };
}

/**
 * Combina lo verificado de Discord con lo autodeclarado/administrado en
 * `almas` en el objeto Alma que consume CardAlma.astro. Si `almaRow` es
 * null (el usuario nunca guardó su Card Builder), se arma un Alma "vacío"
 * con los defaults del schema — así una página puede previsualizar la
 * card de un miembro que todavía no la creó.
 * @param {import('./db.js').DiscordMemberStatus} discordMember
 * @param {object | null} almaRow Fila cruda de la tabla `almas`, o null
 * @returns {Alma}
 */
export function mergeAlma(discordMember, almaRow) {
  const rol = deriveRol(discordMember);
  const { calidad, calidadMotivo } = getCalidadDerivada(discordMember, rol, almaRow?.calidadMotivo ?? null);

  return {
    discordId: discordMember.discordId,
    discordUsername: discordMember.username,
    discordAvatarUrl: discordMember.avatarUrl,
    avatarUrl: discordMember.avatarUrl,
    miembroDesde: discordMember.joinedAt ?? null,

    rol,
    presencia: discordMember.isBanned ? 'expulsado' : discordMember.isMember ? 'activo' : 'inactivo',
    esBooster: discordMember.isBooster,

    calidad,
    calidadMotivo,

    slug: almaRow?.slug ?? '',
    nick: almaRow?.nick || discordMember.globalName || discordMember.username,
    era: almaRow?.era ?? 'purgatory',
    moteSuperior: almaRow?.moteSuperior ?? '',
    moteInferior: almaRow?.moteInferior ?? '',
    fraseIconica: almaRow?.fraseIconica ?? '',
    descripcion: almaRow?.descripcion ?? '',

    estadoPublicacion: almaRow?.estadoPublicacion ?? 'borrador',
  };
}
