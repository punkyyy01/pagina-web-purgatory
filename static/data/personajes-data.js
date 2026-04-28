/* ═══════════════════════════════════════════════════════════
   PURGATORY — Personajes Data + Render (naipe cards)
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var characters = [
    {
      id: 'nelcon',
      name: 'Nelcon',
      alias: 'Arquitecto del Caos',
      era: 'fosas',
      eraLabel: 'Las Fosas',
      desc: 'Desde Las Fosas hasta la era actual, Nelcon ha sido catalizador de los momentos más turbulentos y memorables del servidor.',
      quote: '"Te amo miamor" — dirigido a Ozy, grabado en los logs para siempre.',
      fullBio: 'Nelcon es la leyenda fundacional de Purgatory. Su pelea con Daku en Las Fosas fracturó la comunidad original y marcó el fin de la primera era. Famoso por el icónico "Te amo miamor" dirigido a Ozy, un momento que nadie pidió pero que define perfectamente el espíritu del servidor: aquí el afecto llega sin aviso y sin filtro.',
      relations: ['Ozy — Destinatario del "Te amo"', 'Daku — Rival histórico', 'Renas — Alianza incómoda'],
      role: 'Leyenda Fundacional'
    },
    {
      id: 'renas',
      name: 'Renas',
      alias: 'Dictador de Purgatory',
      era: 'purgatory',
      eraLabel: 'Purgatory',
      desc: 'Autoproclamado líder supremo. Administra el caos con mano firme y recuerda que aquí la democracia es un mito.',
      quote: '"La dictadura no es negociable."',
      fullBio: 'Renasarenas, conocido simplemente como Renas, es el autoproclamado dictador del servidor Purgatory. Bajo su mandato, el servidor ha vivido su era más larga y estable. Ritualiza el /bump como ceremonia sagrada, mantiene al Staff como extensión de su voluntad, y ha creado los Círculos del Infierno como sistema de justicia permanente.',
      relations: ['Staff — Extensión de su voluntad', 'Artema — "Somos lo mismo, según yo"', 'Todos — Súbditos'],
      role: 'Líder Supremo'
    },
    {
      id: 'luigi',
      name: 'Luigi',
      alias: 'El Poeta de lo Absurdo',
      era: 'olympo',
      eraLabel: 'Olympo',
      desc: 'Su frase "mantequilla negra" no tiene origen claro, pero se convirtió en el grito de guerra más memorable de la comunidad.',
      quote: '"Mantequilla negra."',
      fullBio: 'Luigi es el personaje que demuestra que en Purgatory, lo absurdo se convierte en sagrado. Su frase "mantequilla negra" no tiene origen conocido, no tiene significado lógico, y aún así se convirtió en el grito de guerra más estúpido y memorable de toda la comunidad.',
      relations: ['La comunidad — Inventor de jerga', 'Mantequilla Negra — Su legado eterno'],
      role: 'Poeta del Absurdo'
    },
    {
      id: 'frambuesa',
      name: 'Frambuesa',
      alias: 'Co-pilar del Harem de Cyber',
      era: 'olympo',
      eraLabel: 'Olympo',
      desc: 'La contraparte de Emi en el Harem: moderadora con poder real, celos legendarios y radar de dramas.',
      quote: '"renas explicale"',
      fullBio: 'Frambuesa es la otra mitad del Harem de Cyber y una moderadora con poder real en el servidor. Su combinación de celos legendarios y un radar que detecta dramas antes de que estallen la convierte en una de las figuras más temidas y respetadas.',
      relations: ['Cyber — Centro del Harem', 'Emi — Rival y cómplice', 'Staff — Moderadora implacable'],
      role: 'Moderadora / Harem'
    },
    {
      id: 'twoky',
      name: 'Twoky',
      alias: 'Titán de los Videos',
      era: 'olympo',
      eraLabel: 'Olympo',
      desc: 'Editor incansable y figura influyente. Sus montajes mantienen viva la mitología del servidor.',
      quote: '"Si no hay video, no pasó. Y yo tengo todos los videos."',
      fullBio: 'Twoky llegó durante el Éxodo Blanco que marcó la Edad de Oro del Olympo y rápidamente se estableció como el cronista visual del servidor. Editor incansable, sus montajes y compilaciones mantienen viva la mitología del servidor. Es pareja del Inquisidor.',
      relations: ['Inquisidor — Pareja', 'La comunidad — Cronista visual', 'Éxodo Blanco — Llegó con él'],
      role: 'Cronista / Editor'
    },
    {
      id: 'ozy',
      name: 'Ozy',
      alias: 'El Objetivo del "Te amo"',
      era: 'fosas',
      eraLabel: 'Las Fosas',
      desc: 'Destinatario del icónico "Te amo miamor" de Nelcon. Prueba viviente de que aquí el afecto llega sin aviso.',
      quote: '"...¿Qué?"',
      fullBio: 'Ozy es recordado eternamente como el destinatario del momento más icónico del servidor: el sincero "Te amo miamor" que Nelcon le soltó sin previo aviso. Nadie lo pidió, nadie lo esperaba, pero Purgatory nunca pide permiso.',
      relations: ['Nelcon — "Te amo miamor"', 'Los logs — Donde quedó grabado para siempre'],
      role: 'Leyenda Involuntaria'
    },
    {
      id: 'batido',
      name: 'Batido',
      alias: 'Bufón Ítalo-venezolano',
      era: 'purgatory',
      eraLabel: 'Purgatory',
      desc: 'Dueño de una voz que parece programa nocturno de radio pirata. Empuja los límites en llamada.',
      quote: '"¿Eso fue raro? Espérate que apenas empiezo."',
      fullBio: 'Batido es el ítalo-venezolano cuya voz parece sacada de un programa nocturno de radio pirata. Cada aparición suya en el canal de voz es una apuesta: puede ser hilarante o puede hacer que todos quieran colgar. Generalmente es ambas cosas.',
      relations: ['Canal de voz — Su hábitat natural', 'El cringe — Su arma principal'],
      role: 'Comediante Extremo'
    },
    {
      id: 'sting',
      name: 'Sting',
      alias: 'Provocador Colombiano',
      era: 'purgatory',
      eraLabel: 'Purgatory',
      desc: 'Lenguaje irreverente, actitud incendiaria y cero paciencia. Convierte el chat en campo minado.',
      quote: '"si"',
      fullBio: 'Sting es el colombiano cuya misión en la vida parece ser incomodar a todos en el servidor. Con lenguaje irreverente, actitud incendiaria y cero paciencia para la diplomacia, es el catalizador de discusiones que nadie pidió pero que todos disfrutan secretamente.',
      relations: ['Canal general — Su campo de batalla', 'La paciencia ajena — Su víctima favorita'],
      role: 'Provocador Profesional'
    },
    {
      id: 'inquisidor',
      name: 'Inquisidor',
      alias: 'Espía Sigiloso',
      era: 'purgatory',
      eraLabel: 'Purgatory',
      desc: 'Pareja de Twoky y agente encubierto del salseo. Lo ves poco, pero ya tiene todo recopilado.',
      quote: '"..."',
      fullBio: 'El Inquisidor opera en las sombras del servidor. Pareja de Twoky y agente encubierto del salseo. Lo ves poco en el chat, pero cuando aparece ya tiene recopilado absolutamente todo lo que dijeron de ti, sobre ti, y contra ti.',
      relations: ['Twoky — Pareja y aliado', 'El salseo — Su materia prima', 'Las sombras — Su hogar'],
      role: 'Agente de Inteligencia'
    },
    {
      id: 'guacamayo',
      name: 'Guacamayo',
      alias: 'Cronista de Guacamayadas',
      era: 'purgatory',
      eraLabel: 'Purgatory',
      desc: 'Creador de guacamayadas.com y archivo viviente de frases célebres. Si no lo documenta, no pasó.',
      quote: '"Esto va para la web."',
      fullBio: 'Guacamayo es el cronista oficial de las estupideces del servidor. Creador de guacamayadas.com, se ha dedicado a documentar cada frase célebre, cada momento vergonzoso y cada guacamayada memorable de Purgatory.',
      relations: ['guacamayadas.com — Su legado', 'Todos los miembros — Sus víctimas/fuentes'],
      role: 'Cronista Oficial'
    },
    {
      id: 'gmorning',
      name: 'gmorning',
      alias: 'Terapeuta del servidor',
      era: 'purgatory',
      eraLabel: 'Purgatory',
      desc: 'Se cree psicólogo y anda por ahí dando consejos; su única característica destacable es que es argentino.',
      quote: '"Estoy para escucharte."',
      fullBio: 'gmorning es el terapeuta autoproclamado del servidor: se pasea por los canales dando consejos, opinando sobre relaciones y comportamientos. Su sello distintivo es su acento y costumbres argentinas.',
      relations: [],
      role: 'Terapeuta autoproclamado'
    }
  ];

  window.PURGATORY_CHARS = characters;

  var grid      = document.getElementById('char-grid');
  var modal     = document.getElementById('char-detail-modal');
  var modalContent = document.getElementById('char-modal-content');
  var filtersContainer = document.getElementById('char-filters');

  if (!grid) return;

  /* ── Render naipe cards ── */
  function renderCards(list) {
    grid.innerHTML = '';
    if (list.length === 0) {
      grid.innerHTML = '<p style="color:var(--text-dim);text-align:center;grid-column:1/-1;padding:40px 0;font-family:var(--font-serif);font-style:italic">No hay almas con ese criterio.</p>';
      return;
    }
    list.forEach(function (c) {
      var card = document.createElement('div');
      card.className = 'card-naipe';
      card.setAttribute('data-id', c.id);
      card.setAttribute('data-era', c.era);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', c.name);
      card.innerHTML =
        '<div class="card-naipe-inner">' +
          '<div class="card-face card-face-back">' +
            '<div class="card-back-emblem">' +
              '<img src="static/img/logo.svg" alt="">' +
            '</div>' +
          '</div>' +
          '<div class="card-face card-face-front">' +
            '<div class="card-portrait">' +
              '<img src="static/img/ornaments/diamond.svg" class="card-portrait-placeholder" alt="">' +
            '</div>' +
            '<div class="card-info">' +
              '<div class="card-name">' + c.name + '</div>' +
              '<div class="card-alias">' + c.alias + '</div>' +
              '<div class="card-era">' + c.eraLabel + '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  renderCards(characters);

  /* ── Era filter tabs ── */
  var activeFilter = 'all';
  if (filtersContainer) {
    filtersContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-tab[data-filter]');
      if (!btn) return;
      filtersContainer.querySelectorAll('.filter-tab').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      var filtered = activeFilter === 'all'
        ? characters
        : characters.filter(function (c) { return c.era === activeFilter; });
      renderCards(filtered);
    });
  }

  /* ── Click naipe → open modal ── */
  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.card-naipe[data-id]');
    if (!card || !modal) return;
    var id = card.getAttribute('data-id');
    var c = characters.find(function (ch) { return ch.id === id; });
    if (!c) return;
    openModal(c);
  });

  grid.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var card = e.target.closest('.card-naipe[data-id]');
      if (!card || !modal) return;
      var id = card.getAttribute('data-id');
      var c = characters.find(function (ch) { return ch.id === id; });
      if (c) openModal(c);
    }
  });

  function openModal(c) {
    var relationsHTML = c.relations.length
      ? c.relations.map(function (r) { return '<li>' + r + '</li>'; }).join('')
      : '<li style="color:var(--text-dim)">Sin relaciones registradas.</li>';

    modalContent.innerHTML =
      '<div class="divider" style="margin-top:0"><span class="divider-text">' + c.eraLabel + '</span></div>' +
      '<h2 class="modal-title" id="modal-char-name">' + c.name + '</h2>' +
      '<p class="modal-alias">' + c.alias + ' · ' + c.role + '</p>' +
      '<div class="char-modal-grid">' +
        '<div class="char-modal-portrait">' +
          '<img src="static/img/ornaments/diamond.svg" style="width:40%;opacity:0.3" alt="">' +
        '</div>' +
        '<div>' +
          '<div class="char-detail-field">' +
            '<span class="char-detail-label">Era</span>' +
            '<span class="char-detail-value">' + c.eraLabel + '</span>' +
          '</div>' +
          '<div class="char-detail-field">' +
            '<span class="char-detail-label">Rol</span>' +
            '<span class="char-detail-value">' + c.role + '</span>' +
          '</div>' +
          '<blockquote class="char-quote">' + c.quote + '</blockquote>' +
        '</div>' +
      '</div>' +
      '<p class="char-bio">' + c.fullBio + '</p>' +
      '<div class="char-relations" style="margin-top:var(--space-4)">' +
        '<span class="char-detail-label">Relaciones</span>' +
        '<ul style="margin-top:var(--space-2)">' + relationsHTML + '</ul>' +
      '</div>' +
      '<div style="text-align:center;margin-top:var(--space-5)">' +
        '<button class="btn btn-blood modal-close-btn" onclick="(function(){var m=document.getElementById(\'char-detail-modal\');if(m){m.classList.remove(\'is-open\');m.setAttribute(\'aria-hidden\',\'true\');}})()">Cerrar</button>' +
      '</div>';

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.classList.contains('modal-close') || e.target.classList.contains('modal-close-btn')) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

})();
