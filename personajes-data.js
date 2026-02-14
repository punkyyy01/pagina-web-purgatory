/* ═══════════════════════════════════════════════════════════
   PURGATORY — Personajes Data + Render
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var avatarSVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Cdefs%3E%3ClinearGradient id='cg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c5cff'/%3E%3Cstop offset='1' stop-color='%2300e0ff'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg transform='translate(60,60)'%3E%3Cpath d='M-20,-40 C-30,-30 -35,-10 -35,5 L35,5 C35,-10 30,-30 20,-40 C10,-50 -10,-50 -20,-40Z' fill='url(%23cg)' fill-opacity='0.15' stroke='url(%23cg)' stroke-width='1.2' stroke-opacity='0.5'/%3E%3Cellipse cx='0' cy='-15' rx='12' ry='14' fill='%2305060a' opacity='0.6'/%3E%3Ccircle cx='-5' cy='-18' r='2' fill='%2300e0ff' opacity='0.7'/%3E%3Ccircle cx='5' cy='-18' r='2' fill='%2300e0ff' opacity='0.7'/%3E%3Cpath d='M-35,5 C-40,25 -42,45 -40,55 L40,55 C42,45 40,25 35,5Z' fill='url(%23cg)' opacity='0.08'/%3E%3Ccircle cx='0' cy='-10' r='35' fill='none' stroke='url(%23cg)' stroke-width='0.5' opacity='0.2'/%3E%3C/g%3E%3C/svg%3E";

  var characters = [
    {
      id: 'nelcon',
      name: 'Nelcon',
      alias: 'Arquitecto del Caos',
      era: 'fosas',
      eraLabel: 'Las Fosas',
      eraClass: 'era-fosas',
      desc: 'Desde Las Fosas hasta la era actual, Nelcon ha sido catalizador de los momentos más turbulentos y memorables del servidor.',
      quote: '"Te amo miamor" — dirigido a Ozy, grabado en los logs para siempre.',
      fullBio: 'Nelcon es la leyenda fundacional de Purgatory. Su pelea con Daku en Las Fosas fracturó la comunidad original y marcó el fin de la primera era. Famoso por el icónico "Te amo miamor" dirigido a Ozy, un momento que nadie pidió pero que define perfectamente el espíritu del servidor: aquí el afecto llega sin aviso y sin filtro. Ha sobrevivido a todas las eras y sigue siendo una fuerza de caos puro en cada canal donde aparece.',
      relations: ['Ozy — Destinatario del "Te amo"', 'Daku — Rival histórico', 'Renas — Alianza incómoda'],
      role: 'Leyenda Fundacional'
    },
    {
      id: 'renas',
      name: 'Renas',
      alias: 'Dictador de Purgatory',
      era: 'purgatory',
      eraLabel: 'Purgatory',
      eraClass: 'era-purgatory',
      desc: 'Autoproclamado líder supremo. Administra el caos con mano firme y recuerda que aquí la democracia es un mito.',
      quote: '"La dictadura no es negociable."',
      fullBio: 'Renasarenas, conocido simplemente como Renas, es el autoproclamado dictador del servidor Purgatory. Bajo su mandato, el servidor ha vivido su era más larga y estable — aunque "estable" en Purgatory es un término muy relativo. Ritualiza el /bump como ceremonia sagrada, mantiene al Staff como extensión de su voluntad, y ha creado los Círculos del Infierno como sistema de justicia permanente. Su filosofía es simple: orden a través del caos controlado.',
      relations: ['Staff — Extensión de su voluntad', 'Artema — "Somos lo mismo, según yo"', 'Todos — Súbditos'],
      role: 'Líder Supremo'
    },
    {
      id: 'luigi',
      name: 'Luigi',
      alias: 'El Poeta de lo Absurdo',
      era: 'olympo',
      eraLabel: 'Olympo',
      eraClass: 'era-olympo',
      desc: 'Su frase "mantequilla negra" no tiene origen claro, pero se convirtió en el grito de guerra más memorable de la comunidad.',
      quote: '"Mantequilla negra."',
      fullBio: 'Luigi es el personaje que demuestra que en Purgatory, lo absurdo se convierte en sagrado. Su frase "mantequilla negra" no tiene origen conocido, no tiene significado lógico, y aún así se convirtió en el grito de guerra más estúpido y memorable de toda la comunidad. Luigi representa esa zona del servidor donde el sinsentido es ley y donde repetir algo suficientes veces lo convierte en lore canónico.',
      relations: ['La comunidad — Inventor de jerga', 'Mantequilla Negra — Su legado eterno'],
      role: 'Poeta del Absurdo'
    },
    {
      id: 'emi',
      name: 'Emi',
      alias: 'Mitad del Harem de Cyber',
      era: 'olympo',
      eraLabel: 'Olympo',
      eraClass: 'era-olympo',
      desc: 'Junto a Frambuesa sostiene el equilibrio imposible del Harem de Cyber; mezcla celos con lealtad.',
      quote: '"El drama no me busca, yo lo convoco."',
      fullBio: 'Emi es una de las dos figuras centrales del fenómeno conocido como "El Harem de Cyber". Junto con Frambuesa, orbita(ba) alrededor de Cyber en un triángulo de lealtad, celos y caos emocional que se convirtió en lore canónico del servidor. Tiene la capacidad de convertir cualquier sala de voz en telenovela premium y su presencia garantiza que el nivel de drama nunca baje del máximo.',
      relations: ['Cyber — Centro del Harem', 'Frambuesa — Rival y aliada', 'Canal de voz — Su escenario'],
      role: 'Miembro del Harem'
    },
    {
      id: 'frambuesa',
      name: 'Frambuesa',
      alias: 'Co-pilar del Harem de Cyber',
      era: 'olympo',
      eraLabel: 'Olympo',
      eraClass: 'era-olympo',
      desc: 'La contraparte de Emi en el Harem: moderadora con poder real, celos legendarios y radar de dramas.',
      quote: '"Ya sé lo que dijiste. Siempre lo sé."',
      fullBio: 'Frambuesa es la otra mitad del Harem de Cyber y una moderadora con poder real en el servidor. Su combinación de celos legendarios y un radar que detecta dramas antes de que estallen la convierte en una de las figuras más temidas y respetadas. Si dijiste algo en un canal que creías privado, Frambuesa ya lo sabe. Si pensaste algo inapropiado, Frambuesa ya lo sospecha.',
      relations: ['Cyber — Centro del Harem', 'Emi — Rival y cómplice', 'Staff — Moderadora implacable'],
      role: 'Moderadora / Harem'
    },
    {
      id: 'twoky',
      name: 'Twoky',
      alias: 'Titán de los Videos',
      era: 'olympo',
      eraLabel: 'Olympo',
      eraClass: 'era-olympo',
      desc: 'Editor incansable y figura influyente. Sus montajes mantienen viva la mitología del servidor.',
      quote: '"Si no hay video, no pasó. Y yo tengo todos los videos."',
      fullBio: 'Twoky llegó durante el Éxodo Blanco que marcó la Edad de Oro del Olympo y rápidamente se estableció como el cronista visual del servidor. Editor incansable, sus montajes y compilaciones mantienen viva la mitología del servidor y recuerdan que el drama también se exporta en formato MP4. Es pareja del Inquisidor y juntos forman el dúo de inteligencia más eficiente del Purgatorio.',
      relations: ['Inquisidor — Pareja', 'La comunidad — Cronista visual', 'Éxodo Blanco — Llegó con él'],
      role: 'Cronista / Editor'
    },
    {
      id: 'ozy',
      name: 'Ozy',
      alias: 'El Objetivo del "Te amo"',
      era: 'fosas',
      eraLabel: 'Las Fosas',
      eraClass: 'era-fosas',
      desc: 'Destinatario del icónico "Te amo miamor" de Nelcon. Prueba viviente de que aquí el afecto llega sin aviso.',
      quote: '"...¿Qué?"',
      fullBio: 'Ozy es recordado eternamente como el destinatario del momento más icónico del servidor: el sincero "Te amo miamor" que Nelcon le soltó sin previo aviso y sin contexto alguno. Nadie lo pidió, nadie lo esperaba, pero Purgatory nunca pide permiso. Ozy es la prueba viviente de que en este servidor, el afecto puede emboscarte en cualquier momento.',
      relations: ['Nelcon — "Te amo miamor"', 'Los logs — Donde quedó grabado para siempre'],
      role: 'Leyenda Involuntaria'
    },
    {
      id: 'batido',
      name: 'Batido',
      alias: 'Bufón Ítalo-venezolano',
      era: 'purgatory',
      eraLabel: 'Purgatory',
      eraClass: 'era-purgatory',
      desc: 'Dueño de una voz que parece programa nocturno de radio pirata. Empuja los límites en llamada.',
      quote: '"¿Eso fue raro? Espérate que apenas empiezo."',
      fullBio: 'Batido es el ítalo-venezolano cuya voz parece sacada de un programa nocturno de radio pirata. Su talento principal es empujar los límites de lo permitido en llamada hasta que el cringe se convierte en patrimonio cultural del servidor. Cada aparición suya en el canal de voz es una apuesta: puede ser hilarante o puede hacer que todos quieran colgar. Generalmente es ambas cosas.',
      relations: ['Canal de voz — Su hábitat natural', 'El cringe — Su arma principal'],
      role: 'Comediante Extremo'
    },
    {
      id: 'sting',
      name: 'Sting',
      alias: 'Provocador Colombiano',
      era: 'purgatory',
      eraLabel: 'Purgatory',
      eraClass: 'era-purgatory',
      desc: 'Lenguaje irreverente, actitud incendiaria y cero paciencia. Convierte el chat en campo minado.',
      quote: '"¿Ofendido? Perfecto, ese era el objetivo."',
      fullBio: 'Sting es el colombiano cuya misión en la vida parece ser incomodar a todos en el servidor hasta que el canal general se convierta en un campo minado. Con lenguaje irreverente, actitud incendiaria y cero paciencia para la diplomacia, Sting es el catalizador de discusiones que nadie pidió pero que todos disfrutan secretamente. Es la prueba de que en Purgatory, la provocación es un arte.',
      relations: ['Canal general — Su campo de batalla', 'La paciencia ajena — Su víctima favorita'],
      role: 'Provocador Profesional'
    },
    {
      id: 'inquisidor',
      name: 'Inquisidor',
      alias: 'Espía Sigiloso',
      era: 'purgatory',
      eraLabel: 'Purgatory',
      eraClass: 'era-purgatory',
      desc: 'Pareja de Twoky y agente encubierto del salseo. Lo ves poco, pero ya tiene todo recopilado.',
      quote: '"..."',
      fullBio: 'El Inquisidor opera en las sombras del servidor. Pareja de Twoky y agente encubierto del salseo, su presencia es tan discreta como efectiva. Lo ves poco en el chat, pero cuando aparece ya tiene recopilado absolutamente todo lo que dijeron de ti, sobre ti, y contra ti. Es el servicio de inteligencia de Purgatory: silencioso, omnipresente e implacable.',
      relations: ['Twoky — Pareja y aliado', 'El salseo — Su materia prima', 'Las sombras — Su hogar'],
      role: 'Agente de Inteligencia'
    },
    {
      id: 'guacamayo',
      name: 'Guacamayo',
      alias: 'Cronista de Guacamayadas',
      era: 'purgatory',
      eraLabel: 'Purgatory',
      eraClass: 'era-purgatory',
      desc: 'Creador de guacamayadas.com y archivo viviente de frases célebres. Si no lo documenta, no pasó.',
      quote: '"Esto va para la web."',
      fullBio: 'Guacamayo es el cronista oficial de las estupideces del servidor. Creador de guacamayadas.com, se ha dedicado a documentar y archivar cada frase célebre, cada momento vergonzoso y cada guacamayada memorable que se ha dicho en Purgatory. Si algo no aparece en su archivo, oficialmente no pasó. Es el historiador que nadie pidió pero que todos necesitan.',
      relations: ['guacamayadas.com — Su legado', 'Todos los miembros — Sus víctimas/fuentes'],
      role: 'Cronista Oficial'
    }
  ];

  /* ─── Render cards ─── */
  var grid = document.getElementById('char-grid');
  var modal = document.getElementById('char-detail-modal');
  var modalContent = document.getElementById('char-modal-content');
  var searchInput = document.getElementById('char-search');
  var filtersContainer = document.getElementById('char-filters');

  if (!grid) return;

  function renderCards(list) {
    grid.innerHTML = '';
    if (list.length === 0) {
      grid.innerHTML = '<p style="color:var(--muted);text-align:center;grid-column:1/-1;padding:40px 0;">No se encontraron personajes con ese criterio.</p>';
      return;
    }
    list.forEach(function (c) {
      var card = document.createElement('article');
      card.className = 'char-card reveal-init';
      card.setAttribute('data-era', c.era);
      card.setAttribute('data-id', c.id);
      card.setAttribute('role', 'button');
      card.innerHTML =
        '<div class="char-card-header">' +
          '<img src="' + avatarSVG + '" alt="" class="char-card-avatar" />' +
          '<div>' +
            '<h3 class="char-card-name">' + c.name + '</h3>' +
            '<span class="char-card-alias">' + c.alias + '</span>' +
            '<span class="char-card-era ' + c.eraClass + '">' + c.eraLabel + '</span>' +
          '</div>' +
        '</div>' +
        '<p class="char-card-desc">' + c.desc + '</p>' +
        '<p class="char-card-quote">"' + c.quote.replace(/^"|"$/g, '') + '"</p>';
      grid.appendChild(card);

      /* animate reveal */
      requestAnimationFrame(function () {
        card.classList.add('revealed');
      });
    });
  }

  renderCards(characters);

  /* ─── Search ─── */
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      applyFilters();
    });
  }

  /* ─── Era filter ─── */
  var activeFilter = 'all';
  if (filtersContainer) {
    filtersContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.char-filter-btn');
      if (!btn) return;
      filtersContainer.querySelectorAll('.char-filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      applyFilters();
    });
  }

  function applyFilters() {
    var query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    var filtered = characters.filter(function (c) {
      var matchesEra = activeFilter === 'all' || c.era === activeFilter;
      var matchesSearch = !query ||
        c.name.toLowerCase().indexOf(query) !== -1 ||
        c.alias.toLowerCase().indexOf(query) !== -1 ||
        c.desc.toLowerCase().indexOf(query) !== -1;
      return matchesEra && matchesSearch;
    });
    renderCards(filtered);
  }

  /* ─── Modal click ─── */
  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.char-card');
    if (!card || !modal) return;
    var id = card.getAttribute('data-id');
    var c = characters.find(function (ch) { return ch.id === id; });
    if (!c) return;

    var relationsHTML = c.relations.map(function (r) {
      return '<span class="char-relation-tag">' + r + '</span>';
    }).join('');

    modalContent.innerHTML =
      '<h3>' + c.name + '</h3>' +
      '<span class="char-modal-alias">' + c.alias + ' — ' + c.role + '</span>' +
      '<p>' + c.fullBio + '</p>' +
      '<div class="char-modal-section">' +
        '<h4>Relaciones</h4>' +
        '<div class="char-relations">' + relationsHTML + '</div>' +
      '</div>' +
      '<div class="char-modal-section">' +
        '<h4>Cita Icónica</h4>' +
        '<p style="font-style:italic;color:rgba(180,200,255,.55)">' + c.quote + '</p>' +
      '</div>';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });

  /* ─── Close modal ─── */
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

})();
