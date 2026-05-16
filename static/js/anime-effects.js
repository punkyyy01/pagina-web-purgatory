/**
 * AnimeJS v4 micro-animations — Purgatory
 * Role: text scramble/split, SVG stroke draw-in, spring modals, stagger grids
 * NOT for scroll animations — that's GSAP + ScrollTrigger in scripts.js
 * All scroll-triggered effects use IntersectionObserver { once: true }
 * Respects prefers-reduced-motion: all effects are skipped when enabled
 */

import {
  animate,
  stagger,
  spring,
  createDrawable,
  splitText,
  scrambleText,
} from './vendor/anime.esm.min.js';

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init, { once: true })
    : init();
}

// ── SVG fetch + inline ────────────────────────────────────────────────────────
// Corner ornaments are <img> tags, so we fetch + inline them as <svg> before
// animating. createDrawable() requires live DOM SVGGeometryElement instances.

const svgCache = new Map();
const svgParser = new DOMParser();

async function fetchSVGText(src) {
  const url = src.split('?')[0];
  if (svgCache.has(url)) return svgCache.get(url);
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    svgCache.set(url, text);
    return text;
  } catch {
    return null;
  }
}

async function inlineAndAnimateCorners(container, opts = {}) {
  const duration  = opts.duration  ?? 900;
  const ease      = opts.ease      ?? 'inOutQuad';
  const staggerMs = opts.stagger   ?? 60;

  const imgs = container.querySelectorAll('img.frame-corner[src*=".svg"]');
  if (!imgs.length) return;

  const strokeEls = [];
  const fillEls   = [];

  for (const img of imgs) {
    const svgText = await fetchSVGText(img.src);
    if (!svgText) continue;

    const parsed = svgParser.parseFromString(svgText, 'image/svg+xml');
    const svgEl  = parsed.querySelector('svg');
    if (!svgEl) continue;

    // Carry over class and inline styles so positioning CSS still applies
    svgEl.setAttribute('class', img.className);
    if (img.style.cssText) svgEl.style.cssText = img.style.cssText;
    svgEl.setAttribute('aria-hidden', 'true');

    img.replaceWith(svgEl);

    // Stroke-only paths: no explicit fill attr → inherit fill:none from SVG root
    svgEl.querySelectorAll('path:not([fill]), line:not([fill])').forEach(el => strokeEls.push(el));
    // Fill-only elements: circles, polygons, paths with fill="currentColor"
    svgEl.querySelectorAll('[fill="currentColor"]').forEach(el => fillEls.push(el));
  }

  if (strokeEls.length) {
    const drawables = createDrawable(strokeEls, 0, 0);
    animate(drawables, {
      draw: ['0 0', '0 1'],
      duration,
      ease,
      delay: stagger(staggerMs),
    });
  }

  if (fillEls.length) {
    fillEls.forEach(el => { el.style.opacity = '0'; });
    animate(fillEls, {
      opacity: [0, 1],
      duration: 350,
      delay: stagger(50, { start: Math.round(duration * 0.55) }),
    });
  }
}

// ── Main dispatcher ───────────────────────────────────────────────────────────

function init() {
  if (document.querySelector('.chapter-tablet'))  initLore();
  if (document.querySelector('.void-title'))       init404();
  if (document.getElementById('char-grid'))        initPersonajes();
  if (document.querySelector('.hero-frame'))       initHeroCorners();
}

// ── Lore page ─────────────────────────────────────────────────────────────────

function initLore() {
  // 1. Hero H1 scramble — fires when scripts.js adds 'revealed' class
  const heroTitle = document.querySelector('.page-hero .section-title');
  if (heroTitle) {
    const titleObs = new MutationObserver(() => {
      if (!heroTitle.classList.contains('revealed')) return;
      titleObs.disconnect();
      animate(heroTitle, {
        textContent: scrambleText({ chars: '†∞⚔☽░▓', duration: 1200 }),
      });
    });
    titleObs.observe(heroTitle, { attributes: true, attributeFilter: ['class'] });
  }

  // 2. Section lead — word split + stagger reveal
  const sectionLead = document.querySelector('.page-hero .section-lead');
  if (sectionLead) {
    const splitter = splitText(sectionLead, { words: {} });
    splitter.words.forEach(w => { w.style.opacity = '0'; });
    animate(splitter.words, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 480,
      ease: 'outQuad',
      delay: stagger(35, { from: 'first' }),
    });
  }

  // 3. Chapter titles — dramatic char split with spring on viewport entry
  const chapterTitles = document.querySelectorAll('.chapter-title');
  if (chapterTitles.length) {
    const chObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        chObs.unobserve(entry.target);
        const sp = splitText(entry.target, { chars: {} });
        sp.chars.forEach(c => {
          c.style.opacity = '0';
          c.style.display = 'inline-block';
        });
        animate(sp.chars, {
          opacity:    [0, 1],
          translateY: [30, 0],
          ease: spring({ stiffness: 200, damping: 15 }),
          delay: stagger(20, { from: 'first' }),
        });
      });
    }, { threshold: 0.3 });
    chapterTitles.forEach(el => chObs.observe(el));
  }

  // 4. Frame corners — SVG stroke draw-in on scroll
  const frames = document.querySelectorAll('.chapter-tablet .frame');
  if (frames.length) {
    const frameObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        frameObs.unobserve(entry.target);
        inlineAndAnimateCorners(entry.target);
      });
    }, { threshold: 0.1 });
    frames.forEach(el => frameObs.observe(el));
  }
}

// ── 404 page ──────────────────────────────────────────────────────────────────

function init404() {
  // 1. Void title — char split + spring
  const voidTitle = document.querySelector('.void-title');
  if (voidTitle) {
    const splitter = splitText(voidTitle, { chars: {} });
    splitter.chars.forEach(c => {
      c.style.opacity = '0';
      c.style.display = 'inline-block';
    });
    animate(splitter.chars, {
      opacity:    [0, 1],
      translateY: [20, 0],
      ease: spring({ stiffness: 200, damping: 14 }),
      delay: stagger(30, { from: 'first' }),
    });
  }

  // 2. Glitch chromatic aberration on .void-number
  const voidNum = document.querySelector('.void-number');
  if (voidNum) {
    // Wrap in a relative container so absolute clones stay in place
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;display:block';
    voidNum.parentNode.insertBefore(wrapper, voidNum);
    wrapper.appendChild(voidNum);

    const makeClone = (color) => {
      const c = voidNum.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      Object.assign(c.style, {
        position:     'absolute',
        top:          '0',
        left:         '0',
        width:        '100%',
        pointerEvents:'none',
        userSelect:   'none',
        color,
        textShadow:   'none',
        mixBlendMode: 'screen',
      });
      wrapper.insertBefore(c, voidNum);
      return c;
    };

    const redClone  = makeClone('rgba(255,0,80,0.6)');
    const cyanClone = makeClone('rgba(0,230,220,0.6)');

    animate(redClone,  { translateX: [-3, 3], loop: true, alternate: true, duration: 110, ease: 'steps(2)' });
    animate(cyanClone, { translateX: [3, -3], loop: true, alternate: true, duration: 140, ease: 'steps(2)' });
  }

  // 3. Void-quote float loop
  const voidQuote = document.getElementById('void-quote');
  if (voidQuote) {
    animate(voidQuote, {
      translateY: [-6, 6],
      loop:      true,
      alternate: true,
      duration:  3000,
      ease:      'inOutSine',
    });
  }

  // 4. SVG corner draw-in + pulsing glow overlay
  const frame = document.querySelector('.void-content .frame');
  if (frame) {
    inlineAndAnimateCorners(frame);

    const pulse = document.createElement('div');
    pulse.setAttribute('aria-hidden', 'true');
    pulse.style.cssText = [
      'position:absolute',
      'inset:0',
      'border-radius:inherit',
      'pointer-events:none',
      'background:radial-gradient(ellipse at center,rgba(168,0,31,0.25) 0%,transparent 70%)',
      'opacity:0.12',
    ].join(';');
    if (getComputedStyle(frame).position === 'static') frame.style.position = 'relative';
    frame.appendChild(pulse);

    animate(pulse, {
      opacity:   [0.08, 0.55],
      loop:      true,
      alternate: true,
      duration:  2500,
      ease:      'inOutSine',
    });
  }
}

// ── Personajes page ───────────────────────────────────────────────────────────

function initPersonajes() {
  // Card stagger — spring overshoot entry + filter re-renders via MutationObserver
  const grid = document.getElementById('char-grid');
  if (grid) {
    const animateCards = (cards) => {
      if (!cards.length) return;
      const arr = [...cards];
      arr.forEach(c => {
        c.style.opacity   = '0';
        c.style.transform = 'translateY(60px) scale(0.85)';
      });
      animate(arr, {
        opacity:    [0, 1],
        translateY: [60, 0],
        scale:      [0.85, 1],
        ease:       spring({ stiffness: 150, damping: 12 }),
        delay:      stagger(80),
      });
    };

    const gridObs = new MutationObserver((mutations) => {
      const added = [];
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1 && node.classList?.contains('card-naipe')) added.push(node);
        }
      }
      if (added.length) animateCards(added);
    });
    gridObs.observe(grid, { childList: true });

    // Cards already in DOM (initial renderCards() call from personajes-data.js)
    const existing = grid.querySelectorAll('.card-naipe');
    if (existing.length) animateCards(existing);
  }

  // Modal spring — fires when 'is-open' class is added to the modal
  const modal      = document.getElementById('char-detail-modal');
  const modalPanel = modal?.querySelector('.modal-panel');
  if (modal && modalPanel) {
    const modalObs = new MutationObserver(() => {
      if (!modal.classList.contains('is-open')) return;
      // Set initial state synchronously before paint to prevent flash
      modalPanel.style.opacity   = '0';
      modalPanel.style.transform = 'translateY(40px)';
      animate(modalPanel, {
        opacity:    [0, 1],
        translateY: [40, 0],
        ease: spring({ stiffness: 180, damping: 14 }),
      });
    });
    modalObs.observe(modal, { attributes: true, attributeFilter: ['class'] });
  }
}

// ── Index hero frame ──────────────────────────────────────────────────────────

function initHeroCorners() {
  const heroFrame = document.querySelector('.hero-frame');
  if (heroFrame) inlineAndAnimateCorners(heroFrame, { duration: 2000, ease: 'inOutSine', stagger: 200 });
}
