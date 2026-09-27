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
  var RUNWAY_FACTOR = 0.85; // no hace falta scrollear el 100% del overflow para recorrerlo entero

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

  /* ─── 3. Scroll-link, solo si de verdad hay algo que recorrer ─── */
  var runway = document.getElementById('alma-carousel-runway');
  var viewport = document.getElementById('alma-carousel-viewport');
  if (!runway || !viewport) return;

  var maxOffset = 0;

  function measure() {
    maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (maxOffset < 40) {
      // Todo entra en el viewport (pantallas muy anchas) — no hace
      // falta la mecánica de scroll, el fan ya se ve completo tal cual.
      root.classList.remove('is-scroll-linked');
      runway.style.height = '';
      track.style.transform = '';
      return;
    }
    root.classList.add('is-scroll-linked');
    runway.style.height = (viewport.clientHeight + maxOffset * RUNWAY_FACTOR) + 'px';
  }

  var ticking = false;
  function onScroll() {
    if (!root.classList.contains('is-scroll-linked')) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var extra = maxOffset * RUNWAY_FACTOR;
      var rect = runway.getBoundingClientRect();
      var progress = extra > 0 ? Math.min(1, Math.max(0, -rect.top / extra)) : 0;
      track.style.transform = 'translateX(' + (-progress * maxOffset) + 'px)';
      ticking = false;
    });
  }

  measure();
  onScroll();
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
})();
