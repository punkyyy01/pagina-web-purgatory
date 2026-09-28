/* ═══════════════════════════════════════════════════════════
   PURGATORY — Círculos del Infierno (contenido/canon)
   ───────────────────────────────────────────────────────────
   Extraído de la antigua src/pages/condenados.astro (markup +
   contenido mezclados), ya eliminada. Solo el contenido — el nuevo
   frontend decide cómo mostrarlo.
   ═══════════════════════════════════════════════════════════ */

/**
 * @typedef {'critical' | 'high' | 'medium' | 'low'} Severidad
 * @typedef {Object} Condenado
 * @property {number} numero      Caso Nº
 * @property {string} nombre
 * @property {string | null} alias
 * @property {string} descripcion
 * @property {Severidad} severidad
 * @property {string} sello       Texto del sello visual (ej. "Imperdonable")
 */

/** @type {Condenado[]} */
export const condenados = [
  {
    numero: 1,
    nombre: 'Onil',
    alias: null,
    descripcion: 'Actitudes de acoso repetidas, presuntas actitudes indebidas con menores de edad, envio lacayos a trollear con cuentas alternativas.',
    severidad: 'critical',
    sello: 'Imperdonable',
  },
  {
    numero: 2,
    nombre: 'Cloudde',
    alias: null,
    descripcion: 'Comprometió activamente a menores, acoso constante, múltiples intentos de sobrepasar límites establecidos, mintió sobre su edad.',
    severidad: 'critical',
    sello: 'Imperdonable',
  },
  {
    numero: 3,
    nombre: 'Vahn',
    alias: 'giopengiun',
    descripcion: 'Abiertamente racista y negacionista del holocausto. Normalizaba el abuso y tenía presunto interés indebido en una ex-usuario menor de edad.',
    severidad: 'critical',
    sello: 'Imperdonable',
  },
  {
    numero: 4,
    nombre: 'SrtaMystia',
    alias: null,
    descripcion: 'Acusaciones de grooming por su propia comunidad, estafadora serial y autopromovía comisiones falsas múltiples veces.',
    severidad: 'critical',
    sello: 'Imperdonable',
  },
  {
    numero: 5,
    nombre: 'Toro',
    alias: 'AnthonyRose',
    descripcion: 'Solicitó dinero en el servidor, actitudes machistas y acosadoras con mujeres. En general, un gigafracasado.',
    severidad: 'high',
    sello: 'Grave',
  },
  {
    numero: 6,
    nombre: 'VonKitami',
    alias: null,
    descripcion: 'Incomodó activamente a las mujeres del servidor, fuckboy de closet, tibio de mierda y un playo.',
    severidad: 'high',
    sello: 'Grave',
  },
  {
    numero: 7,
    nombre: 'Onyx',
    alias: null,
    descripcion: 'Artista fracasado con delirios de grandeza. Se creía mejor que todos porque "está estudiando algo en el futuro".',
    severidad: 'medium',
    sello: 'Condenado',
  },
  {
    numero: 8,
    nombre: 'Frankklinton765',
    alias: null,
    descripcion: '"Holaa, estoy aqui por que con un grupo de amigos tenemos un circulo de play station y queriamos saber si es que hay algunas chicas que se quieran unir..." — Sí, fue real.',
    severidad: 'low',
    sello: 'Meme eterno',
  },
];
