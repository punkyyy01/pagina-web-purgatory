/* ═══════════════════════════════════════════════════════════
   PURGATORY — Carrusel de 4LMA (home)
   ───────────────────────────────────────────────────────────
   El HTML ya trae TODAS las cards renderizadas por Astro (CardAlma) —
   este script no genera markup, solo:
     1. Elige un subconjunto justo (shuffle-bag en localStorage: no
        repetir mientras queden almas sin mostrar, y una vez que todas
        aparecieron, se vuelve a barajar el mazo completo).
     2. Reordena/oculta el DOM ya existente según esa elección.
     3. Si sobra ancho para recorrer, engancha el desplazamiento
        horizontal del track al scroll vertical de la página (nunca al
        revés — nunca se llama preventDefault ni se intercepta rueda o
        touch; solo se LEE la posición de scroll).

   Se apaga solo si el usuario pidió menos movimiento o el dispositivo
   es débil — en esos casos el fallback de scroll horizontal nativo de
   styles.css (.alma-carousel__viewport) ya es completamente funcional
   sin esto.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var SEEN_KEY = 'purgatory:4lma:seen';
  var FEATURED_COUNT = 7;
  // Cuánto scroll vertical (relativo al alto del viewport) hace falta para
  // recorrer el barrido horizontal completo. No depende del ancho del mazo
  // ni de la pantalla — es autónomo, así el "tiempo" del efecto es siempre
  // parecido sin importar cuántas cards haya.
  var RUNWAY_HEIGHT_FACTOR = 1.4;

  var root = document.getElementById('alma-carousel');
  if (!root) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isLite = document.documentElement.classList.contains('lite-mode');

  var items = Array.prototype.slice.call(root.querySelectorAll('.alma-carousel__item'));
  if (items.length < 2) return;

  /* ─── 1. Selección justa (shuffle-bag) ─── */
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function readSeen(validSlugs) {
    var seen;
    try { seen = JSON.parse(localStorage.getItem(SEEN_KEY)) || []; } catch (e) { seen = []; }
    if (!Array.isArray(seen)) seen = [];
    // Descarta slugs que ya no existen (datos de ejemplo que cambiaron)
    return seen.filter(function (s) { return validSlugs.indexOf(s) !== -1; });
  }

  function writeSeen(seen) {
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) { /* localStorage no disponible — no rompe nada, solo no persiste */ }
  }

  function pickFeatured(allSlugs, count) {
    count = Math.min(count, allSlugs.length);
    var seen = readSeen(allSlugs);
    var unseen = shuffle(allSlugs.filter(function (s) { return seen.indexOf(s) === -1; }));
    var picked = unseen.slice(0, count);

    if (picked.length < count) {
      // Se agotó el mazo a mitad de la elección: se reinicia y se completa
      // con lo que falte, sin repetir lo ya elegido en esta misma vuelta.
      var refill = shuffle(allSlugs.filter(function (s) { return picked.indexOf(s) === -1; }));
      picked = picked.concat(refill.slice(0, count - picked.length));
      seen = [];
    }

    var newSeen = seen.concat(picked);
    // Mazo completo: la próxima visita vuelve a empezar de cero.
    if (newSeen.length >= allSlugs.length) newSeen = [];
    writeSeen(newSeen);

    return picked;
  }

  var allSlugs = items.map(function (el) { return el.dataset.slug; });
  var picked = pickFeatured(allSlugs, FEATURED_COUNT);
  var pickedSet = {};
  picked.forEach(function (slug) { pickedSet[slug] = true; });

  var byslug = {};
  items.forEach(function (el) { byslug[el.dataset.slug] = el; });

  var track = document.getElementById('alma-carousel-track');
  picked.forEach(function (slug) {
    var el = byslug[slug];
    if (!el) return;
    el.hidden = false;
    track.appendChild(el); // mueve el nodo existente — no clona, no recrea
  });
  items.forEach(function (el) {
    if (!pickedSet[el.dataset.slug]) el.hidden = true;
  });

  /* ─── 2. Fan visual — se admite salvo que el usuario pida lo contrario ─── */
  if (prefersReducedMotion || isLite) return; // se queda en el fallback de scroll nativo
  root.classList.add('is-fanned');
  root.classList.add('is-scroll-linked');

  /* ─── 3. Scroll-link: el mazo entra por la derecha y sale por la
     izquierda, cruzando TODA la pantalla — no es un desplazamiento
     chico dentro del ancho visible. Por eso el recorrido se mide
     contra el viewport (siempre > 0), nunca contra "cuánto se pasa
     el mazo del viewport" (eso dependía del ancho de la pantalla del
     visitante y en monitores anchos daba 0 — el bug de la vez
     pasada). ─── */
  var runway = document.getElementById('alma-carousel-runway');
  var viewport = document.getElementById('alma-carousel-viewport');
  if (!runway || !viewport) return;

  var travelDistance = 0; // viewport + mazo: de "todo afuera a la derecha" a "todo afuera a la izquierda"

  function measure() {
    travelDistance = viewport.clientWidth + track.scrollWidth;
    runway.style.height = (viewport.clientHeight + viewport.clientHeight * RUNWAY_HEIGHT_FACTOR) + 'px';
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var extra = viewport.clientHeight * RUNWAY_HEIGHT_FACTOR;
      var rect = runway.getBoundingClientRect();
      var progress = extra > 0 ? Math.min(1, Math.max(0, -rect.top / extra)) : 0;
      // progress 0 → todo el mazo esperando afuera a la derecha.
      // progress 1 → todo el mazo ya salió por la izquierda.
      var x = viewport.clientWidth - progress * travelDistance;
      track.style.transform = 'translateX(' + x + 'px)';
      ticking = false;
    });
  }

  measure();
  onScroll();
  window.addEventListener('resize', function () { measure(); onScroll(); }, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
})();
