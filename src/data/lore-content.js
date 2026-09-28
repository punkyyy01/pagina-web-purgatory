/* ═══════════════════════════════════════════════════════════
   PURGATORY — Lore (contenido/canon)
   ───────────────────────────────────────────────────────────
   Extraído de la antigua src/pages/lore.astro (markup + contenido
   mezclados), ya eliminada. `eras` es la fuente única — index.astro
   mostraba antes una versión recortada a mano de estos mismos
   textos; ese recorte se descartó junto con el resto del markup
   viejo, el nuevo frontend decide si/cómo resumirlos.
   Solo contenido — el nuevo frontend decide cómo mostrarlo.
   ═══════════════════════════════════════════════════════════ */

/** Capítulo I — El Origen de Artema */
export const origen = {
  quoteApertura: 'El individuo en contra de los dioses.',
  parrafos: [
    'Artema no es una diosa ni un personaje de fantasía. Es un concepto — el núcleo de la razón por la que el admin decidió dejar de depender de administraciones ajenas y construir su propio espacio. Es el alma de la decisión. El impulso que nace cuando ves, una y otra vez, cómo la mala gestión destruye lo que la comunidad construye.',
    'Los "dioses" en esta historia son los admins que abusaron, que acosaron, que dieron poder a quien no debía tenerlo, que cayeron por sus propias manos. Artema es el principio que los desafió — no desde las alturas del Olympo, sino desde abajo, junto a la comunidad que aguantó cada caída y eligió seguir.',
    'Purg4tory es la comunidad hecha para que las personas sean su yo real. Opiniones, actitudes y acciones bienvenidas, siempre y cuando sean en pro de una sociedad que valora la libre opinión y la interacción de individuos de todo tipo de ambiente. Eso es lo que Artema representa: el rechazo a la hipocresía de otras administraciones y la apuesta por algo propio.',
  ],
  quotesCierre: [
    'Así nació Purgatory: no un castigo, sino un refugio construido por alguien que ya había visto suficiente.',
    'Cuando el último bump no sea respondido, cuando el salseo se congele y las voces del canal se apaguen... entonces vendrá la Quinta Era. No llegará con drama. Llegará con el último /bump sin respuesta.',
  ],
};

/** Capítulo II — Las Leyes Sagradas del Purgatorio */
export const leyes = [
  {
    numero: 'I',
    titulo: 'La Ley del Bump',
    texto: 'El comando /bump es un ritual sagrado. No es una sugerencia, es una obligación. Cada bump mantiene vivo el portal entre los mundos. Artema observa cada bump y juzga a los negligentes.',
  },
  {
    numero: 'II',
    titulo: 'La Ley del Salseo',
    texto: 'El chisme es la moneda del Purgatorio. Todo se sabe, todo se comenta. El salseo no es el problema — es la razón por la que nadie se va.',
  },
  {
    numero: 'III',
    titulo: 'La Ley del Staff',
    texto: 'El Staff es la voluntad materializada de Artema en el plano digital. Sus decisiones son finales. Cuestionar al Staff es como cuestionar a la gravedad: puedes hacerlo, pero vas a caer igual.',
  },
  {
    numero: 'IV',
    titulo: 'La Ley del Infierno',
    texto: 'Quien cruce las líneas imperdonables será documentado públicamente. No hay redención, no hay apelación. Tu nombre quedará grabado como advertencia eterna.',
  },
  {
    numero: 'V',
    titulo: 'La Ley del Amorodio',
    texto: 'En el Purgatorio, el amor y el odio son la misma cosa. Los lazos aquí se forjan en el fuego del cringe, la humillación mutua y la confianza dañada. Si no puedes con eso, Instagram te espera.',
  },
  {
    numero: 'VI',
    titulo: 'La Ley de los Menores',
    texto: 'Los menores están bajo protección activa. Quien los comprometa activa, pasiva o indirectamente no espera juicio — va directo al círculo más profundo. Esta ley no negocia.',
  },
];

/** Capítulo III — Las Cuatro Eras (texto completo; index.astro mostraba un recorte de esto) */
export const eras = [
  {
    n: 'I',
    meta: 'Era I · 2024',
    titulo: 'Las Fosas — El Origen',
    texto: 'El servidor original, fundado por Ozy. Aquí nació el concepto que definiría a toda la comunidad: el Amorodio. "Por mucho que se insultaran al entrar, todos entendíamos que era nuestra forma de interactuar y aun así nos queríamos." Un vínculo forjado en el insulto mutuo y la confianza real. La pelea entre Daku y Nelcon en una llamada muy void incomodó a todos y empezó a hundir lo que quedaba. Los audios prohibidos — donde Nelcon aceptaba el amor de Ozymandias — quedaron como reliquia. Cayó por mala administración.',
  },
  {
    n: 'II',
    meta: 'Era II · 2025',
    titulo: 'Los Pibes Shitposters — La Era Oscura',
    texto: 'Onil tomó las riendas y las usó para todo lo contrario de lo que debía. Acosó a Cat. Puso a Filo — un acosador — como administrador. El golpe final: metió al admin de otro servidor como co-admin del grupo en menos de tres horas de que ese tipo hubiera entrado. La comunidad, que ya había sobrevivido la caída de Las Fosas, vio el patrón repetirse. Mala administración, segunda vez.',
  },
  {
    n: 'III',
    meta: 'Era III · 2025',
    titulo: 'OLYMPO — La Edad de los Refugiados',
    texto: 'El Éxodo Blanco llegó cuando el grupo de Doomentio se separó por la voideada de Twoky, y la mayoría de los redimibles terminaron en OLYMPO. El servidor creció. El grupo original de Las Fosas se reintegró. Nacieron momentos legendarios: Ivan, Cat y Matus hablando como doctops — chistes que no requieren explicación si estuviste ahí. Pero Ivan y Cat no supieron administrar lo que tenían. El patrón, tercera vez: mala administración.',
  },
  {
    n: 'IV',
    meta: 'Era IV · Actual — 12 de noviembre',
    titulo: 'PURG4TORY — La Dictadura',
    texto: 'Renas no se autoproclamó — el pueblo lo siguió. "Una decisión en la que me siguió el pueblo por un mejor futuro." Fundado el 12 de noviembre, PURG4TORY es la era más larga y la única construida con la memoria colectiva de todo lo que no debía repetirse. El ritual del /bump sigue vivo: no puede pasar un día sin él, o el tiempo deja de fluir. ~85 miembros. Todo el camino ha sido importante.',
  },
];

/** Códex de las Almas — las cuatro categorías narrativas de pertenencia (distinto del `calidad` de una 4LMA en alma.js) */
export const codex = [
  {
    titulo: 'Almas Penitentes',
    texto: 'Los miembros activos que cumplen con sus rituales. La columna vertebral del servidor.',
  },
  {
    titulo: 'Almas Errantes',
    texto: 'Los inactivos que aparecen de vez en cuando. El limbo del "última vez conectado hace 3 meses".',
  },
  {
    titulo: 'Almas Condenadas',
    texto: 'Los enviados a los Círculos del Infierno. Sus nombres no se borran. El Infierno no olvida.',
  },
  {
    titulo: 'Almas Ascendidas',
    texto: 'El Staff. Elegidos por Artema (o por Renas, que es lo mismo según él).',
  },
];
