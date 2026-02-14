/* ═══════════════════════════════════════════════════════════
   PURGATORY — Map Data + Interaction
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var regions = {
    olympo: {
      title: 'Olympo — La Ciudad Dorada (Caída)',
      desc: 'Las cumbres donde los dioses vivían en templos de mármol. Fue la era más gloriosa del servidor, donde el Éxodo Blanco trajo las mejores almas. Ahora yace en ruinas, recuerdo de que todo Olympo tiene su ocaso.',
      tag: 'Era III — Edad de Oro'
    },
    eden: {
      title: 'El Edén — Jardín de la Inocencia',
      desc: 'Un lugar mítico donde las almas llegaban antes de ser corrompidas por el salseo. Nadie ha vuelto al Edén desde que el primer chisme fue creado. Algunos dicen que nunca existió realmente.',
      tag: 'Mítico'
    },
    portal: {
      title: 'El Void — El Vacío Entre Mundos',
      desc: 'El espacio oscuro que separa los reinos. Aquí las almas errantes vagan sin rumbo, desconectadas hace meses. El Void no es un castigo — es indiferencia. Es peor.',
      tag: 'Limbo'
    },
    purgatorio: {
      title: 'PURG4TORY — El Refugio Actual',
      desc: 'El corazón del servidor actual. No un castigo, sino un refugio forjado en la oscuridad por Artema. Bajo la Dictadura de Renasarenas, aquí convergen el salseo, los rituales del bump y el caos cotidiano que nos mantiene vivos.',
      tag: 'Era IV — Actual'
    },
    bache: {
      title: 'El Bache — Tierra de Nadie',
      desc: 'La zona de transición entre eras. Un desierto digital sin estructura ni dirección, donde la comunidad casi se desintegra. Nadie quiere volver aquí. Nadie debería.',
      tag: 'Era II — Transición'
    },
    fosas: {
      title: 'Las Fosas — El Big Bang',
      desc: 'El salvaje oeste de Discord. Sin reglas, puro caos y el origen de los audios prohibidos. Aquí nació la leyenda de Nelcon, se forjó el Amorodio y todo comenzó. Terreno hostil, pero sagrado.',
      tag: 'Era I — Origen'
    },
    salseo: {
      title: 'La Plaza del Salseo',
      desc: 'El corazón social del Purgatorio. Aquí el chisme es moneda de cambio, los rumores se convierten en ley, y si no hay drama fresco, se fabrica. Es el canal general convertido en punto de encuentro cósmico.',
      tag: 'Zona Social'
    },
    trono: {
      title: 'La Sala del Trono',
      desc: 'Desde aquí, Renasarenas gobierna con mano firme. El Staff ejecuta sus decretos, los bumps son monitoreados, y las sentencias del Infierno se dictan. Todo poder emana de esta sala.',
      tag: 'Centro de Poder'
    },
    infierno: {
      title: 'Los Círculos del Infierno',
      desc: 'El destino final de los condenados. Sus nombres están grabados en los muros como advertencia eterna. No hay redención, no hay apelación. Cada círculo desciende más profundo: desde los memes eternos hasta los imperdonables.',
      tag: 'Castigo Eterno'
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
