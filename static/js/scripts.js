/* ═══════════════════════════════════════════════════════════
  PURGATORY — JavaScript optimizado (sin operaciones pesadas por frame)
  ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── Referencias DOM en caché ─── */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const cursor   = $('#cursor');
  const progBar  = $('#progress-bar');
  const header   = $('#site-header');
  const btnTop   = $('#back-to-top');
  const navToggle = $('#nav-toggle');
  const navLinks  = $('#nav-links');
  const modal        = $('#char-detail-modal');
  const modalContent = $('#char-modal-content');
  let cx = -100, cy = -100, cursorReq = 0, cursorActive = false;
  const isTouchDevice = matchMedia('(hover: none)').matches;

  if (!isTouchDevice && cursor) {
    document.addEventListener('mousemove', (e) => {
      cx = e.clientX; cy = e.clientY;
      if (!cursorActive) { cursor.classList.add('active'); cursorActive = true; }
      if (!cursorReq) cursorReq = requestAnimationFrame(moveCursor);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('active'); cursorActive = false;
    }, { passive: true });

    /* Estado hover en elementos interactivos */
    document.addEventListener('pointerover', (e) => {
      if (e.target.closest('a,button,[role="button"]')) cursor.classList.add('hover');
    }, { passive: true });
    document.addEventListener('pointerout', (e) => {
      if (e.target.closest('a,button,[role="button"]')) cursor.classList.remove('hover');
    }, { passive: true });
  }

  function moveCursor() {
    cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`;
    cursorReq = 0;
  }

    /* ═══════════════════════════════════════════════════════
      2. MANEJO DE SCROLL (un único listener `passive`)
      ═══════════════════════════════════════════════════════ */
  let scrollTick = false;
  const docEl = document.documentElement;

  window.addEventListener('scroll', () => {
    if (!scrollTick) {
      scrollTick = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  function onScroll() {
    const y = window.scrollY;
    const max = docEl.scrollHeight - docEl.clientHeight;

      /* barra de progreso — se ajusta el ancho para aprovechar composición GPU */
    if (progBar) progBar.style.width = ((y / max) * 100) + '%';

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
      if (navLinks) navLinks.classList.remove('open');
    }
  });

    /* ═══════════════════════════════════════════════════════
      5. MENÚ HAMBURGUESA (abrir/cerrar en pantallas pequeñas)
      ═══════════════════════════════════════════════════════ */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('is-open'));
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('is-open') && !navLinks.contains(e.target) && e.target !== navToggle) {
        navLinks.classList.remove('is-open');
      }
    });
  }

    /* ═══════════════════════════════════════════════════════
      6. INTERSECTION OBSERVER — revelar elementos al hacer scroll
      ═══════════════════════════════════════════════════════ */
  const revealEls = $$('.card, .condemned-card, .genesis-chapter, .genesis-epigraph, .genesis-footer, .section-title, .infierno-intro, .infierno-footer, .stat, #conclusion p, .hero-content, .hero-visual, .timeline-item, .timeline-subtitle, .mapa-mini-wrapper, .index-event-card, #lore-avanzado .card');

  revealEls.forEach(el => el.classList.add('reveal-init'));

  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target); // una sola vez — no volver a observar
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

    /* ═══════════════════════════════════════════════════════
      7. MODAL DE PERSONAJES — usa PURGATORY_CHARS (fuente única)
      ═══════════════════════════════════════════════════════ */
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-character]');
    if (!card || !modal || !modalContent) return;
    const id = card.dataset.character.toLowerCase();
    const chars = window.PURGATORY_CHARS || [];
    const c = chars.find(ch => ch.id === id);
    if (!c) return;
    const relationsHTML = c.relations
      .map(r => `<span class="char-relation-tag">${r}</span>`)
      .join('');
    modalContent.innerHTML =
      `<h3>${c.name}</h3>` +
      `<span class="char-modal-alias">${c.alias} — ${c.role}</span>` +
      `<p>${c.fullBio}</p>` +
      `<div class="char-modal-section"><h4>Relaciones</h4>` +
      `<div class="char-relations">${relationsHTML}</div></div>`;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
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
     10. SISTEMA DE PARTÍCULAS LIGERO
       - Máx. 14 partículas, SIN líneas de conexión
       - Pausa cuando la pestaña está oculta
       - Puntos simples con movimiento suave
     ═══════════════════════════════════════════════════════ */
  const canvas = $('#particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], animId = 0, paused = false;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();

    /* Resize con debounce */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    }, { passive: true });

    /* Generador de partículas */
    function spawn() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.4 + 0.1
      };
    }

    const COUNT = 14;
    for (let i = 0; i < COUNT; i++) particles.push(spawn());

    function draw() {
      if (paused) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = `rgba(168,0,31,${p.a})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);

    /* Pausar cuando la pestaña está oculta */
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        paused = true;
        cancelAnimationFrame(animId);
      } else {
        paused = false;
        animId = requestAnimationFrame(draw);
      }
    });
  }

    /* ═══════════════════════════════════════════════════════
      11. REINTENTO DE IMÁGENES — reintenta UNA vez con delay corto
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
