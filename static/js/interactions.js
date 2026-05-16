/* interactions.js — Cursor trail + 3D tilt
   Non-module IIFE. No GSAP/AnimeJS dependency.
   Disabled on prefers-reduced-motion and pointer:coarse. */
(function () {
  'use strict';

  var reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarse = window.matchMedia('(pointer: coarse)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  /* ── Cursor trail ─────────────────────────────────────────────────────── */
  if (!isCoarse && !reduced) {
    var MAX_NODES = 12;
    var SPAWN_MS  = 80;
    var pool      = [];
    var poolIdx   = 0;
    var lastSpawn = 0;
    var onLink    = false;

    for (var i = 0; i < MAX_NODES; i++) {
      var n = document.createElement('div');
      n.setAttribute('aria-hidden', 'true');
      n.style.cssText = [
        'position:fixed',
        'width:8px',
        'height:8px',
        'border-radius:50%',
        'pointer-events:none',
        'z-index:99999',
        'left:0',
        'top:0',
        'opacity:0',
        'will-change:opacity,transform',
      ].join(';');
      document.documentElement.appendChild(n);
      pool.push(n);
    }

    document.addEventListener('mousemove', function (e) {
      var now = Date.now();
      if (now - lastSpawn < SPAWN_MS) return;
      lastSpawn = now;

      var node = pool[poolIdx % MAX_NODES];
      poolIdx++;

      node.style.left       = e.clientX + 'px';
      node.style.top        = e.clientY + 'px';
      node.style.background = onLink ? '#7c5cff' : '#00e0ff';
      node.style.transition = 'none';
      node.style.opacity    = '0.85';
      node.style.transform  = 'translate(-50%,-50%) scale(1)';

      /* Force reflow so the next transition fires */
      node.offsetWidth; // eslint-disable-line no-unused-expressions

      node.style.transition = 'opacity .45s ease, transform .45s ease';
      node.style.opacity    = '0';
      node.style.transform  = 'translate(-50%,-50%) scale(0)';
    }, { passive: true });

    document.addEventListener('pointerover', function (e) {
      if (e.target.closest('a,button,[role="button"]')) onLink = true;
    }, { passive: true });

    document.addEventListener('pointerout', function (e) {
      if (e.target.closest('a,button,[role="button"]')) onLink = false;
    }, { passive: true });
  }

  /* ── 3D Tilt on .card-naipe ───────────────────────────────────────────── */
  if (canHover && !reduced) {
    function applyTilt(card) {
      if (card._tilt) return;
      card._tilt = true;

      var glare = document.createElement('div');
      glare.setAttribute('aria-hidden', 'true');
      glare.style.cssText = [
        'position:absolute',
        'inset:0',
        'border-radius:inherit',
        'pointer-events:none',
        'opacity:0',
        'transition:opacity .3s',
      ].join(';');
      if (!card.style.position || card.style.position === 'static') {
        card.style.position = 'relative';
      }
      card.appendChild(glare);

      card.addEventListener('mousemove', function (e) {
        var r  = card.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
        var dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
        var rX = (-dy * 15).toFixed(2);
        var rY = ( dx * 15).toFixed(2);
        var gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
        var gy = ((e.clientY - r.top ) / r.height * 100).toFixed(1);

        card.style.transform  = 'perspective(800px) rotateX(' + rX + 'deg) rotateY(' + rY + 'deg)';
        card.style.transition = 'transform .08s linear';
        glare.style.background =
          'radial-gradient(circle at ' + gx + '% ' + gy + '%, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 65%)';
        glare.style.opacity = '1';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        card.style.transition = 'transform .4s ease';
        glare.style.opacity   = '0';
      });
    }

    function attachToAll() {
      var cards = document.querySelectorAll('.card-naipe');
      for (var j = 0; j < cards.length; j++) applyTilt(cards[j]);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachToAll, { once: true });
    } else {
      attachToAll();
    }

    /* Watch for dynamically rendered cards (personajes page) */
    var grid = document.getElementById('char-grid');
    if (grid) {
      var tiltObs = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (node.nodeType === 1 && node.classList && node.classList.contains('card-naipe')) {
              applyTilt(node);
            }
          });
        });
      });
      tiltObs.observe(grid, { childList: true });
    }
  }

})();
