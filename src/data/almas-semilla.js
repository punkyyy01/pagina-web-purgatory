/* ═══════════════════════════════════════════════════════════
   PURGATORY — 4LMA: relleno de arranque
   ───────────────────────────────────────────────────────────
   Personas ficticias que rellenan la home y la galería mientras los
   miembros reales todavía no crearon su propia carta con el Card
   Builder. Se muestran solo hasta completar este mismo tamaño de
   lista (ver getGalleryAlmas en src/lib/alma.js) — cuantas más cartas
   reales y publicadas haya, menos de estas aparecen, sin que haga
   falta borrar nada acá ni tocar la base de datos: el relleno se
   retira solo, calculado en cada carga de página.

   No reutiliza nombres de personajes-data.js ni de condenados.astro:
   son personas reales del servidor, un 4lma de relleno no puede
   parecer que les pertenece.
   ═══════════════════════════════════════════════════════════ */

/** SVG de relleno como data URI (mismo patrón que el grano de fondo en
    tokens.css: URL-encoded, no base64). Cada uno tiene un tamaño
    intrínseco distinto a propósito — la card tiene que absorber
    proporciones distintas sin romperse (brief Fase 2, sección 7). */
function placeholderAvatar(w, h, from, to) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/>` +
    `</linearGradient></defs>` +
    `<rect width='100%' height='100%' fill='url(#g)'/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}`;
}

export const almasSemilla = [
  {
    discordId: '100000000000000001',
    discordUsername: 'centinela.bump',
    discordAvatarUrl: null,
    miembroDesde: '2025-11-14',
    rol: 'normal',
    presencia: 'activo',
    esBooster: false,
    calidad: 'normal',
    calidadMotivo: null,
    slug: 'centinela-del-bump',
    nick: 'Centinela del Bump',
    avatarUrl: placeholderAvatar(400, 400, '#1a3a37', '#0d8a80'),
    era: 'purgatory',
    moteSuperior: 'Guardián del Ritual',
    moteInferior: 'Nunca dejó pasar un día sin /bump',
    fraseIconica: 'El portal no se cierra en mi turno.',
    descripcion: 'Lleva la cuenta de cada bump desde que empezó la Era IV. Nadie le pidió el puesto, nadie se lo va a sacar.',
    estadoPublicacion: 'publicada',
  },
  {
    discordId: '100000000000000002',
    discordUsername: 'voidwalker_99',
    discordAvatarUrl: null,
    miembroDesde: '2024-03-02',
    rol: 'normal',
    presencia: 'activo',
    esBooster: false,
    calidad: 'normal',
    calidadMotivo: null,
    slug: 'voidwalker-99',
    nick: 'voidwalker_99',
    avatarUrl: null,
    era: 'fosas',
    moteSuperior: 'Sobreviviente de Las Fosas',
    moteInferior: '',
    fraseIconica: '',
    descripcion: 'Todavía cuenta la pelea de Daku y Nelcon como si hubiera pasado ayer.',
    estadoPublicacion: 'publicada',
  },
  {
    discordId: '100000000000000003',
    discordUsername: 'renas.oficial',
    discordAvatarUrl: null,
    miembroDesde: '2025-11-12',
    rol: 'moderador',
    presencia: 'activo',
    esBooster: false,
    calidad: 'shiny',
    calidadMotivo: 'moderador',
    slug: 'dictador-de-bolsillo',
    nick: 'Dictador de Bolsillo',
    avatarUrl: placeholderAvatar(500, 300, '#2b2b2b', '#0d8a80'),
    era: 'purgatory',
    moteSuperior: 'Líder Supremo',
    moteInferior: 'Dictador de Purgatory (autoproclamado)',
    fraseIconica: 'Literalmente.',
    descripcion: 'Administra el caos con mano firme y recuerda que acá la democracia es un mito.',
    estadoPublicacion: 'publicada',
  },
  {
    discordId: '100000000000000004',
    discordUsername: 'alma.en.oferta',
    discordAvatarUrl: null,
    miembroDesde: '2025-06-20',
    rol: 'normal',
    presencia: 'activo',
    esBooster: true,
    calidad: 'shiny',
    calidadMotivo: 'booster',
    slug: 'alma-en-oferta',
    nick: 'Alma en Oferta',
    avatarUrl: null,
    era: 'olympo',
    moteSuperior: 'Refugiada de Olympo',
    moteInferior: 'Boosteó el server dos veces seguidas',
    fraseIconica: 'Boosteo, luego brillo.',
    descripcion: 'Llegó en el Éxodo Blanco y se quedó a boostear.',
    estadoPublicacion: 'publicada',
  },
  {
    discordId: '100000000000000005',
    discordUsername: 'cronista.eterno',
    discordAvatarUrl: null,
    miembroDesde: '2024-01-30',
    rol: 'normal',
    presencia: 'activo',
    esBooster: false,
    calidad: 'shiny',
    calidadMotivo: 'logro',
    slug: 'cronista-eterno',
    nick: 'Cronista Eterno',
    avatarUrl: placeholderAvatar(400, 550, '#3a2a1a', '#3de8da'),
    era: 'fosas',
    moteSuperior: 'Memoria del Servidor',
    moteInferior: 'Ganó el Evento del Aniversario',
    fraseIconica: 'Yo estuve ahí para todo esto.',
    descripcion: 'Documentó las cuatro eras sin que nadie se lo pidiera. Ahora es el archivo vivo del servidor.',
    estadoPublicacion: 'publicada',
  },
  {
    discordId: '100000000000000006',
    discordUsername: 'nombre.tachado',
    discordAvatarUrl: null,
    miembroDesde: '2025-01-10',
    rol: 'normal',
    presencia: 'expulsado',
    esBooster: false,
    calidad: 'normal',
    calidadMotivo: null,
    slug: 'nombre-tachado',
    nick: 'Nombre Tachado',
    avatarUrl: null,
    era: 'pibes',
    moteSuperior: 'Ex Miembro',
    moteInferior: '',
    fraseIconica: '',
    descripcion: 'Cruzó una línea. El registro no opina, solo constata.',
    estadoPublicacion: 'publicada',
  },
  {
    discordId: '100000000000000007',
    discordUsername: 'mensaje.en.un.canal',
    discordAvatarUrl: null,
    miembroDesde: '2025-04-18',
    rol: 'normal',
    presencia: 'inactivo',
    esBooster: false,
    calidad: 'normal',
    calidadMotivo: null,
    slug: 'mensaje-en-un-canal',
    nick: 'Mensaje en un Canal Muerto',
    avatarUrl: placeholderAvatar(700, 400, '#1a1a2e', '#0d8a80'),
    era: 'olympo',
    moteSuperior: 'Fantasma de Olympo',
    moteInferior: 'Última vez conectado hace tres meses, según dicen',
    fraseIconica: 'Alguien va a leer esto en el 2030 y se va a preguntar quién era yo. Buena suerte, viajero — yo tampoco me acuerdo del todo.',
    descripcion: 'Desapareció sin aviso, como casi todos acá. El limbo del "última vez conectado" lo reclamó.',
    estadoPublicacion: 'publicada',
  },
  {
    discordId: '100000000000000008',
    discordUsername: 'alma.numero.ocho',
    discordAvatarUrl: null,
    miembroDesde: '2026-01-05',
    rol: 'normal',
    presencia: 'activo',
    esBooster: false,
    calidad: 'normal',
    calidadMotivo: null,
    slug: 'sin-titulo-todavia',
    nick: 'Alma Nº 8',
    avatarUrl: null,
    era: 'purgatory',
    moteSuperior: '',
    moteInferior: '',
    fraseIconica: '',
    descripcion: '',
    estadoPublicacion: 'publicada',
  },
];
