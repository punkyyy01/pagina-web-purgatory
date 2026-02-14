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
  const modal     = $('#character-modal');
  const modalTitle = $('#modal-title');
  const modalBody  = $('#modal-body');

    /* ZOOM: aplica un zoom por defecto al cargar, guardado en localStorage.
      Usa la propiedad no estándar `zoom` por simplicidad; si no está soportada, hace un fallback silencioso. */
  const ZOOM_KEY = 'purgatory_zoom';
  let zoomFactor = parseFloat(localStorage.getItem(ZOOM_KEY)) || 1.15;
  function applyZoom(factor) {
    try {
      document.body.style.zoom = factor; // ampliamente soportado en navegadores de escritorio
      localStorage.setItem(ZOOM_KEY, String(factor));
    } catch (e) {
      // fallback silencioso
    }
  }
  // Apply on initial load
  applyZoom(zoomFactor);

  /* ─── Datos de personajes ─── */
  const characterData = {
    Luigi: {
      title: 'Luigi — El poeta de lo absurdo',
      body: 'Su frase "mantequilla negra" no tiene origen claro, pero se convirtió en el grito de guerra más estúpido y memorable de la comunidad. Luigi representa esa zona de Purgatory donde el sinsentido es sagrado.'
    },
    Emi: {
      title: 'Emi — Mitad del Harem de Cyber',
      body: 'Junto a Frambuesa sostiene el equilibrio imposible del Harem de Cyber; mezcla celos con lealtad y convierte cualquier sala de voz en telenovela premium.'
    },
    Twoky: {
      title: 'Twoky — Titán de los videos',
      body: 'Editor incansable y figura influyente. Sus montajes mantienen viva la mitología del servidor y recuerdan que el drama también se exporta en formato MP4.'
    },
    Ozy: {
      title: 'Ozy — El objetivo del "Te amo"',
      body: 'Destinatario del icónico "Te amo miamor" de Nelcon que quedó grabado en los logs para siempre. Nadie lo pidió, pero Purgatory nunca pide permiso. Ozy es prueba viviente de que aquí el afecto llega sin aviso.'
    },
    Nelcon: {
      title: 'Nelcon — Arquitecto del caos',
      body: 'Desde Las Fosas hasta la era actual, Nelcon ha sido catalizador de los momentos más turbulentos y memorables. Su pelea con Daku fracturó la comunidad original y dio pie a todo lo que vino después.'
    },
    Batido: {
      title: 'Batido — Bufón ítalo-venezolano',
      body: 'Dueño de una voz que parece programa nocturno de radio pirata. Empuja los límites de lo permitido en llamada y hace que el cringe sea patrimonio cultural.'
    },
    Sting: {
      title: 'Sting — Provocador colombiano',
      body: 'Lenguaje irreverente, actitud incendiaria y cero paciencia. Su misión es incomodar hasta que el canal general se convierta en campo minado.'
    },
    Renas: {
      title: 'Renas — Dictador de Purgatory',
      body: 'Autoproclamado líder supremo. Administra el caos con mano firme, ritualiza el /bump y recuerda que en Purgatory la democracia es un mito.'
    },
    Frambuesa: {
      title: 'Frambuesa — Co-pilar del Harem de Cyber',
      body: 'La contraparte de Emi en el Harem: moderadora con poder real, celos legendarios y un radar que detecta dramas antes de que estallen.'
    },
    Inquisidor: {
      title: 'Inquisidor — Espía sigiloso',
      body: 'Pareja de Twoky y agente encubierto del salseo. Lo ves poco, pero cuando aparece ya tiene recopilado todo lo que dijeron de ti.'
    },
    Guacamayo: {
      title: 'Guacamayo — Cronista de guacamayadas',
      body: 'Creador de guacamayadas.com y archivo viviente de frases célebres. Si no documenta algo, oficialmente no pasó.'
    }
  };
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
    const z = parseFloat(document.body.style.zoom) || 1;
    cursor.style.transform = `translate3d(${cx / z}px,${cy / z}px,0)`;
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
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== navToggle) {
        navLinks.classList.remove('open');
      }
    });
  }

    /* ═══════════════════════════════════════════════════════
      6. INTERSECTION OBSERVER — revelar elementos al hacer scroll
      ═══════════════════════════════════════════════════════ */
  const revealEls = $$('.card, .condemned-card, .genesis-chapter, .genesis-epigraph, .genesis-footer, .section-title, .infierno-intro, .infierno-footer, .stat, #conclusion p, .hero-content, .hero-visual, .timeline-item, .timeline-subtitle');

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
      7. MODAL DE PERSONAJES
      ═══════════════════════════════════════════════════════ */
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-character]');
    if (card && modal) {
      const key = card.dataset.character;
      const data = characterData[key];
      if (data) {
        modalTitle.textContent = data.title;
        modalBody.textContent = data.body;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
      }
    }
  });

  /* Close modal */
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        modal.classList.remove('open');
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
        ctx.fillStyle = `rgba(124,92,255,${p.a})`;
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
      11. REINTENTO DE IMÁGENES — reintenta imágenes rotas en túneles (ngrok)
      ═══════════════════════════════════════════════════════
      Al servir por túneles como ngrok (plan gratuito), algunas
      peticiones de imágenes pueden fallar aleatoriamente por límites.
      Este bloque reintenta imágenes rotas con backoff exponencial hasta 3 veces. */
    (function retryBrokenImages() {
    const MAX_RETRIES = 3;
    const BASE_DELAY  = 800; // ms

    function retryImage(img, attempt) {
      if (attempt > MAX_RETRIES) return;
      const delay = BASE_DELAY * Math.pow(2, attempt - 1); // 800, 1600, 3200
      setTimeout(() => {
        const src = img.getAttribute('src');
        if (src) {
          // Bust cache by appending a unique query param
          // Forzar recarga añadiendo un parámetro único
          const separator = src.includes('?') ? '&' : '?';
          img.src = src.split('?')[0] + separator + '_r=' + Date.now();
        }
      }, delay);
    }

    // Añadir manejadores de error a todas las imágenes ya existentes
    document.querySelectorAll('img').forEach(img => {
      let attempts = 0;
      img.addEventListener('error', function handler() {
        attempts++;
        if (attempts <= MAX_RETRIES) {
          retryImage(img, attempts);
        }
      });
      // If image already failed before JS loaded
      // Si la imagen ya falló antes de que cargara el JS
      if (img.complete && img.naturalWidth === 0 && img.src) {
        attempts++;
        retryImage(img, attempts);
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
