/* ═══════════════════════════════════════════════════════════
  PURGATORY — JavaScript optimizado (sin operaciones pesadas por frame)
  ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── Referencias DOM en caché ─── */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const header   = $('#site-header');
  const btnTop   = $('#back-to-top');
  const navToggle = $('#nav-toggle');
  const navLinks  = $('#nav-links');

    /* ═══════════════════════════════════════════════════════
      2. MANEJO DE SCROLL (un único listener `passive`)
      ═══════════════════════════════════════════════════════ */
  let scrollTick = false;

  window.addEventListener('scroll', () => {
    if (!scrollTick) {
      scrollTick = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  function onScroll() {
    const y = window.scrollY;

    /* header shadow */
    if (header) header.classList.toggle('scrolled', y > 40);

    /* back-to-top */
    if (btnTop) btnTop.classList.toggle('visible', y > 500);

    scrollTick = false;
  }

    /* ═══════════════════════════════════════════════════════
      3. BOTÓN "VOLVER ARRIBA"
      ═══════════════════════════════════════════════════════ */
  if (btnTop) {
    btnTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

    /* ═══════════════════════════════════════════════════════
      4. ENLACES ANCLA SUAVES (scroll suave en anclas internas)
      ═══════════════════════════════════════════════════════ */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      /* Close mobile nav if open */
      if (navLinks) navLinks.classList.remove('is-open');
    }
  });

    /* ═══════════════════════════════════════════════════════
      5. MENÚ HAMBURGUESA (abrir/cerrar en pantallas pequeñas)
      ═══════════════════════════════════════════════════════ */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('is-open'));
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('is-open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('is-open');
      }
    });
  }

    /* ═══════════════════════════════════════════════════════
      6. INTERSECTION OBSERVER — revelar elementos al hacer scroll
      Único sistema de fade-in del sitio (.reveal-init/.revealed,
      definido en styles.css). Se dispara una sola vez por elemento.
      ═══════════════════════════════════════════════════════ */
  const REVEAL_SELECTOR = '.condemned-card, .section-title, .hero-content, .card-naipe, .era-card, .chapter-title, .void-title';

  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target); // una sola vez — no volver a observar
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  function initReveal(root) {
    root.querySelectorAll(REVEAL_SELECTOR).forEach(el => {
      if (el.classList.contains('reveal-init')) return; // ya registrado
      el.classList.add('reveal-init');
      revealObs.observe(el);
    });
  }

  initReveal(document);

  /* Personajes: las cartas se re-renderizan por completo en cada
     filtro/búsqueda — observar el grid para revelar los nodos nuevos. */
  const charGrid = document.getElementById('char-grid');
  if (charGrid) {
    new MutationObserver(() => initReveal(charGrid)).observe(charGrid, { childList: true });
  }

    /* ═══════════════════════════════════════════════════════
      7. MODAL DE PERSONAJES — apertura/cierre en personajes-data.js.
      Fade + translateY simple en el panel, disparado una sola vez.
      ═══════════════════════════════════════════════════════ */
  const charModal      = document.getElementById('char-detail-modal');
  const charModalPanel = charModal && charModal.querySelector('.modal-panel');
  if (charModal && charModalPanel) {
    charModalPanel.classList.add('reveal-init');
    new MutationObserver(() => {
      if (charModal.classList.contains('is-open')) charModalPanel.classList.add('revealed');
    }).observe(charModal, { attributes: true, attributeFilter: ['class'] });
  }

    /* ═══════════════════════════════════════════════════════
      8. CONTADORES ANIMADOS (una sola ejecución vía IntersectionObserver)
      ═══════════════════════════════════════════════════════ */
  const counters = $$('.stat-number[data-target]');

  function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
      el.textContent = Math.round(ease * target);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => counterObs.observe(c));

    /* ═══════════════════════════════════════════════════════
      9. FILTRO DE SEVERIDAD (mostrar/ocultar cartas condenadas)
      ═══════════════════════════════════════════════════════ */
  const filterBtns = $$('.filter-btn[data-filter]');
  const condemnedCards = $$('.condemned-card[data-severity]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      condemnedCards.forEach(c => {
        c.classList.toggle('hidden', f !== 'all' && c.dataset.severity !== f);
      });
    });
  });

    /* ═══════════════════════════════════════════════════════
      10. REINTENTO DE IMÁGENES — reintenta UNA vez con delay corto
       - Reducido a 1 solo reintento para no desperdiciar ancho de banda
       - En producción (Vercel), las imágenes se sirven desde CDN y rara vez fallan
     ═══════════════════════════════════════════════════════ */
    (function retryBrokenImages() {
    var retried = new WeakSet();

    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function handler() {
        if (retried.has(img)) return; // solo 1 reintento
        retried.add(img);
        setTimeout(function () {
          var src = img.getAttribute('src');
          if (src) {
            var separator = src.includes('?') ? '&' : '?';
            img.src = src.split('?')[0] + separator + '_r=' + Date.now();
          }
        }, 1200);
      });
      // Si la imagen ya falló antes de que cargara el JS
      if (img.complete && img.naturalWidth === 0 && img.src && !retried.has(img)) {
        retried.add(img);
        setTimeout(function () {
          var src = img.getAttribute('src');
          if (src) {
            var separator = src.includes('?') ? '&' : '?';
            img.src = src.split('?')[0] + separator + '_r=' + Date.now();
          }
        }, 1200);
      }
    });
  })();

})();

/* ===== Header height helper: ensure banner sits below fixed header ===== */
(function setHeaderCSSVar(){
  try{
    const hdr = document.getElementById('site-header');
    function apply(){
      const h = hdr ? Math.ceil(hdr.getBoundingClientRect().height) + 'px' : '64px';
      document.documentElement.style.setProperty('--site-header-height', h);
    }
    apply();
    window.addEventListener('resize', apply, { passive: true });
  }catch(e){/* silent */}
})();

