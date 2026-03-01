/* ═══════════════════════════════════════════════════════════
   PURGATORY — Map Data + Interaction
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var regions = {
    /* ─── SERVIDORES (nodos de color) ─── */
    serverFosas: {
      title: 'Las Fosas — Servidor Origen',
      desc: 'El salvaje oeste de Discord: sin reglas, puro caos y los audios prohibidos. Aquí nació la leyenda de Nelcon y el Amorodio que moldeó a toda la comunidad.',
      tag: 'Servidor I'
    },
    serverPibes: {
      title: 'Los Pibes — El Bache',
      desc: 'Servidor provisional tras el cierre de Las Fosas. Shitposters sin rumbo, mala administración y riesgo de desintegración total.',
      tag: 'Servidor II'
    },
    serverOlympo: {
      title: 'Olympo — Edad de Oro',
      desc: 'El templo dorado de la comunidad. El Éxodo Blanco trajo a Ivan, Matiti, Twoky y consolidó el lore. También aquí empezó la caída.',
      tag: 'Servidor III'
    },
    serverPurgatory: {
      title: 'Purg4tory — Refugio Actual',
      desc: 'El servidor vigente, forjado en la oscuridad por Artema. Bajo la dictadura de Renasarenas conviven el salseo, el bump y la vigilancia del Staff.',
      tag: 'Servidor IV'
    },

    /* ─── EVENTOS (nodos grises conectados a su servidor) ─── */
    eventAudios: {
      title: 'Audios Prohibidos',
      desc: 'Los clips caóticos y legendarios que definieron el tono de Las Fosas. Mitología oral convertida en arma.',
      tag: 'Evento — Fosas'
    },
    eventPelea: {
      title: 'Daku vs Nelcon',
      desc: 'La pelea que fracturó el servidor original y empujó a la comunidad al éxodo. Punto de no retorno.',
      tag: 'Evento — Fosas'
    },
    eventBache: {
      title: 'Migración al Bache',
      desc: 'El salto improvisado a Los Pibes Shitposters. Caos administrativo y falta de rumbo que casi rompe todo.',
      tag: 'Evento — Pibes'
    },
    eventDrift: {
      title: 'Comunidad al Límite',
      desc: 'Dispersión y desgaste: las almas se desconectan, algunos se pierden en el Void, otros esperan un nuevo hogar.',
      tag: 'Evento — Pibes'
    },
    eventExodo: {
      title: 'Éxodo Blanco',
      desc: 'Llegada masiva de miembros clave (Ivan, Matiti, Twoky). El servidor alcanza su pico creativo y de salseo.',
      tag: 'Evento — Olympo'
    },
    eventCaida: {
      title: 'Caída del Olympo',
      desc: 'Conflictos internos, dramas irreconciliables y malas decisiones cierran la Edad de Oro. Las almas vuelven a migrar.',
      tag: 'Evento — Olympo'
    },
    eventDictadura: {
      title: 'Dictadura de Renasarenas',
      desc: 'Renas asume el mando absoluto. Ritual del /bump, control estricto y chisme vigilado mantienen unido al refugio.',
      tag: 'Evento — Purgatory'
    },
    eventPurga: {
      title: 'Purga de los Menores',
      desc: 'Exilio “misericordioso” a Instagram para salvar la paz mental. Marca la limpieza del servidor actual.',
      tag: 'Evento — Purgatory'
    }
  };

  var wrapper = document.getElementById('map-wrapper');
  var tooltip = document.getElementById('map-tooltip');
  var tooltipTitle = document.getElementById('tooltip-title');
  var tooltipDesc = document.getElementById('tooltip-desc');
  var tooltipTag = document.getElementById('tooltip-tag');

  if (!wrapper || !tooltip) return;

  var nodes = wrapper.querySelectorAll('.map-node');

  nodes.forEach(function (node) {
    var regionId = node.getAttribute('data-region');
    var data = regions[regionId];
    if (!data) return;

    node.addEventListener('mouseenter', function (e) {
      showTooltip(e, data);
    });

    node.addEventListener('mousemove', function (e) {
      positionTooltip(e);
    });

    node.addEventListener('mouseleave', function () {
      tooltip.classList.remove('visible');
    });

    node.addEventListener('click', function (e) {
      showTooltip(e, data);
      /* Toggle visibility on click for mobile */
      if (tooltip.classList.contains('visible')) {
        tooltip.classList.remove('visible');
      } else {
        tooltip.classList.add('visible');
      }
    });
  });

  function showTooltip(e, data) {
    tooltipTitle.textContent = data.title;
    tooltipDesc.textContent = data.desc;
    tooltipTag.textContent = data.tag;
    tooltip.classList.add('visible');
    positionTooltip(e);
  }

  function positionTooltip(e) {
    var rect = wrapper.getBoundingClientRect();
    var x = e.clientX - rect.left + 16;
    var y = e.clientY - rect.top - 10;

    /* Keep tooltip inside wrapper */
    if (x + 310 > rect.width) x = rect.width - 320;
    if (x < 0) x = 10;
    if (y + 120 > rect.height) y = y - 120;
    if (y < 0) y = 10;

    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }

  /* Close tooltip on outside click */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.map-node') && !e.target.closest('.map-tooltip')) {
      tooltip.classList.remove('visible');
    }
  });

})();
