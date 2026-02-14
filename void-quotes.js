/* ═══════════════════════════════════════════════════════════
   PURGATORY — 404 Void Quotes
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var quotes = [
    '"Las sombras susurran tu nombre, pero esta página no existe." — Artema',
    '"Te amo miamor... pero esta URL no." — Nelcon',
    '"Mantequilla negra." — Luigi, sin contexto, como siempre.',
    '"Ni siquiera el Staff puede encontrar lo que buscas." — Renas',
    '"Esto va para la web... ah no, esto no existe." — Guacamayo',
    '"..." — Inquisidor, porque ni él tiene datos sobre esta página.',
    '"¿Ofendido por el 404? Perfecto." — Sting',
    '"El Void no perdona. Y tampoco los enlaces rotos." — Artema',
    '"Esta página fue enviada a los Círculos del Infierno." — Staff',
    '"El Bache era más estable que este enlace." — Veterano del servidor',
    '"Cada 404 es un alma más que se pierde en el Void." — El Códex',
    '"Si buscabas salseo, está en otro lado. Esto es el vacío." — La Plaza'
  ];

  var el = document.getElementById('void-quote');
  if (el) {
    el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
  }
})();
