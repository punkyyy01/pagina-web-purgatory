/* ═══════════════════════════════════════════════════════════
   PURGATORY — Deck de 4LMA (home)
   ───────────────────────────────────────────────────────────
   Controla la navegación horizontal interactiva del carrusel/deck
   de cartas 4LMA:
     1. Botones previo/siguiente con scroll fluido.
     2. Arrastre con mouse (drag-to-scroll) y soporte táctil fluido.
     3. Shuffle aleatorio suave en la selección si hay muchas cartas.
     4. Actualización del estado de los botones de navegación.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var deck = document.getElementById('alma-deck');
  if (!deck) return;

  var prevBtn = document.getElementById('alma-nav-prev');
  var nextBtn = document.getElementById('alma-nav-next');
  var items = Array.prototype.slice.call(deck.querySelectorAll('.alma-deck__item'));
  if (items.length === 0) return;

  // Actualizar visibilidad/deshabilitación de botones
  function updateNavButtons() {
    if (!prevBtn || !nextBtn) return;
    var maxScroll = deck.scrollWidth - deck.clientWidth;
    prevBtn.style.opacity = deck.scrollLeft <= 5 ? '0.4' : '1';
    prevBtn.style.pointerEvents = deck.scrollLeft <= 5 ? 'none' : 'auto';
    nextBtn.style.opacity = deck.scrollLeft >= maxScroll - 5 ? '0.4' : '1';
    nextBtn.style.pointerEvents = deck.scrollLeft >= maxScroll - 5 ? 'none' : 'auto';
  }

  // Scroll con botones
  var SCROLL_STEP = 280; // aprox ancho de una carta + gap

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      deck.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      deck.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
    });
  }

  deck.addEventListener('scroll', updateNavButtons, { passive: true });
  window.addEventListener('resize', updateNavButtons, { passive: true });
  updateNavButtons();

  // Arrastre con mouse (drag to scroll)
  var isDown = false;
  var startX = 0;
  var scrollLeftStart = 0;
  var hasDragged = false;

  deck.addEventListener('mousedown', function (e) {
    // Si hace click en un enlace, permitimos click normal si no arrastra
    isDown = true;
    hasDragged = false;
    startX = e.pageX - deck.offsetLeft;
    scrollLeftStart = deck.scrollLeft;
    deck.style.cursor = 'grabbing';
    deck.style.userSelect = 'none';
  });

  window.addEventListener('mouseup', function () {
    if (!isDown) return;
    isDown = false;
    deck.style.cursor = '';
    deck.style.removeProperty('user-select');
  });

  deck.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    var x = e.pageX - deck.offsetLeft;
    var walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      hasDragged = true;
    }
    deck.scrollLeft = scrollLeftStart - walk;
  });

  // Prevenir navegación accidental al soltar tras arrastrar
  deck.addEventListener('click', function (e) {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged = false;
    }
  }, true);
})();
