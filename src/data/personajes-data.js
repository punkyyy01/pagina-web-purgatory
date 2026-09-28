/* ═══════════════════════════════════════════════════════════
   PURGATORY — Personajes canónicos (contenido/canon)
   ───────────────────────────────────────────────────────────
   Extraído de la antigua public/static/js/personajes-data.js (que
   mezclaba estos datos con el render del grid/modal de la UI vieja,
   ya eliminada). Esto es solo el contenido — el nuevo frontend decide
   cómo mostrarlo.
   ═══════════════════════════════════════════════════════════ */

/**
 * @typedef {Object} Personaje
 * @property {string} id
 * @property {string} name
 * @property {string} alias
 * @property {import('../lib/alma.js').EraKey} era
 * @property {string} eraLabel
 * @property {string} desc          Descripción corta (para listados)
 * @property {string} quote         Frase icónica — puede ser ''
 * @property {string} fullBio       Biografía completa
 * @property {string[]} relations
 * @property {string} role
 */

/** @type {Personaje[]} */
export const personajes = [
  {
    id: 'nelcon',
    name: 'Nelcon',
    alias: 'Arquitecto del Caos',
    era: 'fosas',
    eraLabel: 'Las Fosas',
    desc: 'La que peleó con Daku y después le dijo "Te amo miamor" a Ozy sin que nadie lo pidiera. Nelcon no pide permiso.',
    quote: 'cashateee',
    fullBio: 'Nelcon es la leyenda fundacional de Purgatory. Su pelea con Daku en Las Fosas fracturó la comunidad original y marcó el fin de la primera era. Famoso por el icónico "Te amo miamor" dirigido a Ozy, un momento que nadie pidió pero que define perfectamente el espíritu del servidor: aquí el afecto llega sin aviso y sin filtro.',
    relations: ['Ozy — Destinatario del "Te amo"', 'Daku — Rival histórico', 'Renas — Alianza incómoda'],
    role: 'Leyenda Fundacional',
  },
  {
    id: 'renas',
    name: 'Renas',
    alias: 'Dictador de Purgatory',
    era: 'purgatory',
    eraLabel: 'Purgatory',
    desc: 'Autoproclamado líder supremo. Administra el caos con mano firme y recuerda que aquí la democracia es un mito.',
    quote: 'Literalmente.',
    fullBio: 'Renasarenas, conocido simplemente como Renas, es el autoproclamado dictador del servidor Purgatory. Bajo su mandato, el servidor ha vivido su era más larga y estable. Ritualiza el /bump como ceremonia sagrada, mantiene al Staff como extensión de su voluntad, y ha creado los Círculos del Infierno como sistema de justicia permanente.',
    relations: ['Staff — Extensión de su voluntad', 'Artema — "Somos lo mismo, según yo"', 'Todos — Súbditos'],
    role: 'Líder Supremo',
  },
  {
    id: 'luigi',
    name: 'Luigi',
    alias: 'El Poeta de lo Absurdo',
    era: 'olympo',
    eraLabel: 'Olympo',
    desc: 'Su frase "mantequilla negra" no tiene origen claro, pero se convirtió en el grito de guerra más memorable de la comunidad.',
    quote: '',
    fullBio: 'Luigi es el personaje que demuestra que en Purgatory, lo absurdo se convierte en sagrado. Su frase "mantequilla negra" no tiene origen conocido, no tiene significado lógico, y aún así se convirtió en el grito de guerra más estúpido y memorable de toda la comunidad.',
    relations: ['La comunidad — Inventor de jerga', 'Mantequilla Negra — Su legado eterno'],
    role: 'Poeta del Absurdo',
  },
  {
    id: 'frambuesa',
    name: 'Frambuesa',
    alias: 'Co-pilar del Harem de Cyber',
    era: 'olympo',
    eraLabel: 'Olympo',
    desc: 'La contraparte de Emi en el Harem: moderadora con poder real, celos legendarios y radar de dramas.',
    quote: '',
    fullBio: 'Frambuesa es la otra mitad del Harem de Cyber y una moderadora con poder real en el servidor. Su combinación de celos legendarios y un radar que detecta dramas antes de que estallen la convierte en una de las figuras más temidas y respetadas.',
    relations: ['Cyber — Centro del Harem', 'Emi — Rival y cómplice', 'Staff — Moderadora implacable'],
    role: 'Moderadora / Harem',
  },
  {
    id: 'twoky',
    name: 'Twoky',
    alias: 'Titán de los Videos',
    era: 'olympo',
    eraLabel: 'Olympo',
    desc: 'Editor incansable y figura influyente. Sus montajes mantienen viva la mitología del servidor.',
    quote: 'Matate.',
    fullBio: 'Twoky llegó durante el Éxodo Blanco que marcó la Edad de Oro del Olympo y rápidamente se estableció como el cronista visual del servidor. Editor incansable, sus montajes y compilaciones mantienen viva la mitología del servidor. Es pareja del Inquisidor.',
    relations: ['Inquisidor — Pareja', 'La comunidad — Cronista visual', 'Éxodo Blanco — Llegó con él'],
    role: 'Cronista / Editor',
  },
  {
    id: 'ozy',
    name: 'Ozy',
    alias: 'El Objetivo del "Te amo"',
    era: 'fosas',
    eraLabel: 'Las Fosas',
    desc: 'Destinatario del icónico "Te amo miamor" de Nelcon. Prueba viviente de que aquí el afecto llega sin aviso.',
    quote: '',
    fullBio: 'Ozy fundó Las Fosas — el servidor que empezó todo. Sin eso, no existe nada de lo que vino después. Es recordado eternamente como el destinatario del momento más icónico del servidor: el sincero "Te amo miamor" que Nelcon le soltó sin previo aviso. Nadie lo pidió, nadie lo esperaba, pero Purgatory nunca pide permiso.',
    relations: ['Nelcon — "Te amo miamor"', 'Los logs — Donde quedó grabado para siempre'],
    role: 'Leyenda Involuntaria',
  },
  {
    id: 'batido',
    name: 'Batido',
    alias: 'Lolcow',
    era: 'purgatory',
    eraLabel: 'Purgatory',
    desc: 'Dueño de una voz que parece programa nocturno de radio pirata. Empuja los límites en llamada.',
    quote: '',
    fullBio: 'Batido es el ítalo-venezolano cuya voz parece sacada de un programa nocturno de radio pirata. Cada aparición suya en el canal de voz es una apuesta: puede ser hilarante o puede hacer que todos quieran colgar. Generalmente es ambas cosas.',
    relations: ['Canal de voz — Su hábitat natural', 'El cringe — Su arma principal'],
    role: 'Comediante Extremo',
  },
  {
    id: 'sting',
    name: 'Sting',
    alias: 'Provocador Colombiano',
    era: 'purgatory',
    eraLabel: 'Purgatory',
    desc: 'Lenguaje irreverente, actitud incendiaria y cero paciencia. Convierte el chat en campo minado.',
    quote: 'Yeah, no, pues chad no.',
    fullBio: 'Sting es el colombiano cuya misión en la vida parece ser incomodar a todos en el servidor. Con lenguaje irreverente, actitud incendiaria y cero paciencia para la diplomacia, es el catalizador de discusiones que nadie pidió pero que todos disfrutan secretamente.',
    relations: ['Canal general — Su campo de batalla', 'La paciencia ajena — Su víctima favorita'],
    role: 'Provocador Profesional',
  },
  {
    id: 'inquisidor',
    name: 'Inquisidor',
    alias: 'Espía Sigiloso',
    era: 'purgatory',
    eraLabel: 'Purgatory',
    desc: 'Pareja de Twoky y agente encubierto del salseo. Lo ves poco, pero ya tiene todo recopilado.',
    quote: '',
    fullBio: 'El Inquisidor opera en las sombras del servidor. Pareja de Twoky y agente encubierto del salseo. Lo ves poco en el chat, pero cuando aparece ya tiene recopilado absolutamente todo lo que dijeron de ti, sobre ti, y contra ti.',
    relations: ['Twoky — Pareja y aliado', 'El salseo — Su materia prima', 'Las sombras — Su hogar'],
    role: 'Agente de Inteligencia',
  },
  {
    id: 'guacamayo',
    name: 'Guacamayo',
    alias: 'Cronista de Guacamayadas',
    era: 'purgatory',
    eraLabel: 'Purgatory',
    desc: 'Creador de guacamayadas.com y archivo viviente de frases célebres. Si no lo documenta, no pasó.',
    quote: 'Todos tenemos un club penguin dentro.',
    fullBio: 'Guacamayo es el cronista oficial de las estupideces del servidor. Creador de guacamayadas.com, se ha dedicado a documentar cada frase célebre, cada momento vergonzoso y cada guacamayada memorable de Purgatory.',
    relations: ['guacamayadas.com — Su legado', 'Todos los miembros — Sus víctimas/fuentes'],
    role: 'Cronista Oficial',
  },
  {
    id: 'gmorning',
    name: 'gmorning',
    alias: 'Terapeuta del servidor',
    era: 'purgatory',
    eraLabel: 'Purgatory',
    desc: 'Se cree psicólogo y anda por ahí dando consejos; su única característica destacable es que es argentino.',
    quote: 'Che wacho, ¿qué tiraba?',
    fullBio: 'gmorning es el terapeuta autoproclamado del servidor: se pasea por los canales dando consejos, opinando sobre relaciones y comportamientos. Su sello distintivo es su acento y costumbres argentinas.',
    relations: [],
    role: 'Terapeuta autoproclamado',
  },
];
