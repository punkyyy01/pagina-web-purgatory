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
      ═══════════════════════════════════════════════════════ */
  const revealEls = $$('.condemned-card, .section-title, .hero-content');

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
      7. MODAL DE PERSONAJES — handlers en personajes-data.js
      ═══════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════
  12. GSAP + SCROLLTRIGGER
  Requires gsap.min.js + ScrollTrigger.min.js loaded before this file.
  Guards: typeof check, prefers-reduced-motion.
  ═══════════════════════════════════════════════════════ */
(function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.documentElement.classList.contains('lite-mode')) return;

  gsap.registerPlugin(ScrollTrigger);

  var isMobile = window.matchMedia('(max-width: 768px)').matches;
  var pScale   = isMobile ? 0.5 : 1;

  /* ── Hero parallax layers (index.html) ───────────────────────────────── */
  const heroBannerImg = document.querySelector('.hero-banner img');
  if (heroBannerImg) {
    // Background image — img is 120%/top:-10% in CSS, so yPercent:-8 stays inside the hero clip
    gsap.to(heroBannerImg, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Overlay: very subtle upward drift for extra depth layer
    const heroOverlay = document.querySelector('.hero-banner-overlay');
    if (heroOverlay) {
      gsap.to(heroOverlay, {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }

    // Lead: moves up slowly — starts from top of scroll so the whole hero exit is animated
    const heroLead = document.querySelector('.hero-lead');
    if (heroLead) {
      gsap.to(heroLead, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }
  }

  /* ── Hero title floats up faster than lead on exit ──────────────────── */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    gsap.to(heroTitle, {
      yPercent: -35,
      opacity: 0,
      filter: 'blur(6px)',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  }

  /* ── Clip-path section reveals (all pages) ──────────────────────────── */
  const sections = document.querySelectorAll('.section');
  sections.forEach(function (section) {
    gsap.fromTo(section,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 92%',
          once: true,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  /* ── Era cards alternating entry (index + lore) ─────────────────────── */
  const eraCards = document.querySelectorAll('.timeline .era-card');
  eraCards.forEach(function (card, i) {
    gsap.fromTo(card,
      { x: i % 2 === 0 ? -120 : 120, rotation: i % 2 === 0 ? -5 : 5, opacity: 0 },
      {
        x: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 87%',
          once: true,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  /* ── Mapa canvas zoom-in + controls stagger (mapa.html) ─────────────── */
  const mapaContainer = document.getElementById('mapa-container');
  if (mapaContainer) {
    gsap.fromTo(mapaContainer,
      { scale: 1.4, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: mapaContainer,
          start: 'top 82%',
          once: true,
          invalidateOnRefresh: true,
        },
      }
    );

    const mapaBtns = document.querySelectorAll('.mapa-btn');
    if (mapaBtns.length) {
      gsap.fromTo(mapaBtns,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.55,
          ease: 'power2.out',
          delay: 0.65,
          scrollTrigger: {
            trigger: mapaContainer,
            start: 'top 82%',
            once: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }
  }

  /* ══════════════════════════════════════════════════════
     SCROLL-SCRUB PARALLAX — se mueven CON el scroll
     ══════════════════════════════════════════════════════ */

  /* ── .divider expand de ancho mientras entra en viewport ────────────── */
  document.querySelectorAll('.divider').forEach(function (div) {
    div.style.willChange = 'transform, opacity';
    gsap.fromTo(div,
      { scaleX: 0.12, opacity: 0 },
      {
        scaleX: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: div,
          start: 'top 92%',
          end: 'top 45%',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  /* ── .chapter-title skewX scrub (lore.html) ─────────────────────────── */
  document.querySelectorAll('.chapter-title').forEach(function (title) {
    title.style.willChange = 'transform';
    gsap.fromTo(title,
      { skewX: -6 },
      {
        skewX: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
          end: 'top 40%',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  /* ── .chapter-body p staggered yPercent scrub (lore.html) ───────────── */
  document.querySelectorAll('.chapter-body p').forEach(function (p, i) {
    p.style.willChange = 'transform';
    gsap.to(p, {
      yPercent: -(5 + (i % 6) * 2) * pScale,
      ease: 'none',
      scrollTrigger: {
        trigger: p,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  });

  /* ── .chapter-quote subtle yPercent scrub (lore.html) ───────────────── */
  document.querySelectorAll('.chapter-quote').forEach(function (quote) {
    quote.style.willChange = 'transform';
    gsap.to(quote, {
      yPercent: -15 * pScale,
      ease: 'none',
      scrollTrigger: {
        trigger: quote,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  });

  /* ── .sacred-law staggered yPercent scrub (lore.html) ───────────────── */
  document.querySelectorAll('.sacred-law').forEach(function (law, i) {
    law.style.willChange = 'transform';
    gsap.to(law, {
      yPercent: -(8 + (i % 4) * 4) * pScale,
      ease: 'none',
      scrollTrigger: {
        trigger: law,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  });

  /* ── .era-card yPercent scrub — pares más rápidos que impares ───────── */
  document.querySelectorAll('.timeline .era-card').forEach(function (card, i) {
    card.style.willChange = 'transform';
    var speed = (i % 2 === 0 ? -28 : -12) * pScale;
    gsap.to(card, {
      yPercent: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  });

  /* ── .condemned-card: entrada X alternada con scrub ─────────────────── */
  document.querySelectorAll('.condemned-card').forEach(function (card, i) {
    card.style.willChange = 'transform';
    var fromX = (i % 2 === 0 ? -90 : 90) * pScale;
    gsap.fromTo(card,
      { x: fromX },
      {
        x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'center center',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  /* ── .card-naipe: cada card a velocidad diferente (index.html) ──────── */
  var naipeSpeeds = [-10, -20, -7, -16];
  document.querySelectorAll('.card-naipe').forEach(function (card, i) {
    card.style.willChange = 'transform';
    gsap.to(card, {
      yPercent: (naipeSpeeds[i] !== undefined ? naipeSpeeds[i] : -12) * pScale,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  });

  /* ── .era-numeral: sube más rápido que su era-card (parallax interno) ─ */
  document.querySelectorAll('.timeline .era-card').forEach(function (card) {
    var numeral = card.querySelector('.era-numeral');
    var desc    = card.querySelector('.era-card-desc');
    if (numeral) {
      numeral.style.willChange = 'transform';
      gsap.to(numeral, {
        yPercent: -55 * pScale,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }
    if (desc) {
      desc.style.willChange = 'transform';
      gsap.to(desc, {
        yPercent: 8 * pScale,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }
  });

  /* ── X parallax en .section .container (index.html, solo desktop) ───── */
  if (!isMobile && document.querySelector('.hero-banner')) {
    document.querySelectorAll('.section .container').forEach(function (cnt, i) {
      cnt.style.willChange = 'transform';
      gsap.to(cnt, {
        x: i % 2 === 0 ? 18 : -18,
        ease: 'none',
        scrollTrigger: {
          trigger: cnt,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
          invalidateOnRefresh: true,
        },
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     AMBIENT LOOPS — corren siempre, sin scroll
     ══════════════════════════════════════════════════════ */

  /* ── .divider-text float suave ───────────────────────────────────────── */
  document.querySelectorAll('.divider-text').forEach(function (el, i) {
    gsap.to(el, {
      y: -4,
      duration: 2.2 + i * 0.12,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      force3D: true,
    });
  });

  /* ── .card-back-emblem breathing scale ───────────────────────────────── */
  document.querySelectorAll('.card-back-emblem').forEach(function (el, i) {
    gsap.to(el, {
      scale: 1.07,
      duration: 2.8 + i * 0.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      force3D: true,
    });
  });

  /* .era-numeral: scroll scrub gestionado en el bloque de parallax arriba */

  /* ── .era-tag glow pulse ─────────────────────────────────────────────── */
  document.querySelectorAll('.era-tag').forEach(function (el, i) {
    el.style.willChange = 'filter';
    gsap.to(el, {
      filter: 'drop-shadow(0 0 10px rgba(168,0,31,0.75))',
      duration: 2.2 + i * 0.3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      force3D: true,
    });
  });

  /* ── .condemned-icon float ───────────────────────────────────────────── */
  document.querySelectorAll('.condemned-icon').forEach(function (el, i) {
    gsap.to(el, {
      y: -5,
      duration: 2.5 + i * 0.18,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      force3D: true,
    });
  });

  /* ── .chapter-label float (lore.html) ───────────────────────────────── */
  document.querySelectorAll('.chapter-label').forEach(function (el, i) {
    gsap.to(el, {
      y: -5,
      duration: 3.0 + i * 0.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      force3D: true,
    });
  });

})();
