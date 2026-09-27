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
 * @property {string} miembroDesde        Fecha ISO de ingreso al servidor
 *
 * — Rol y presencia (administrado / sistema) —
 * @property {Rol} rol
 * @property {Presencia} presencia
 * @property {boolean} esBooster
 *
 * — Calidad de card (sistema, ver getCalidadEfectiva) —
 * @property {Calidad} calidad
 * @property {CalidadMotivo} calidadMotivo
 *
 * — Autodeclarado (Card Builder, Fase 5) —
 * @property {string} slug                Único, usado en /4lma/[slug] (Fase 7)
 * @property {string} nick                Puede diferir del discordUsername
 * @property {string | null} avatarUrl    Si es null, se usa el fallback con inicial
 * @property {EraKey} era
 * @property {string} moteSuperior        Ej: "Líder Supremo" — junto a la Era
 * @property {string} moteInferior        Ej: "Dictador de Purgatory" — bajo el nick
 * @property {string} fraseIconica
 * @property {string} descripcion         No se muestra en la card chica — vive en /4lma/[slug]
 *
 * — Publicación (sistema) —
 * @property {'borrador' | 'publicada' | 'privada'} estadoPublicacion
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
