/* ═══════════════════════════════════════════════════════════
   PURGATORY — Easter Eggs System
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── Soul Counter (localStorage) ─── */
  const SOUL_KEY = 'purgatory_souls';
  let souls = parseInt(localStorage.getItem(SOUL_KEY) || '0', 10) + 1;
  localStorage.setItem(SOUL_KEY, String(souls));

  /* ─── Toast notification system ─── */
  function showToast(icon, message, duration) {
    duration = duration || 3000;
    let toast = document.querySelector('.ee-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'ee-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = '<span class="ee-toast-icon">' + icon + '</span>' + message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('show');
    }, duration);
  }

  /* ─── 1. Konami Code → Void Portal ─── */
  var konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  var konamiIndex = 0;

  document.addEventListener('keydown', function (e) {
    if (e.key === konamiSequence[konamiIndex] || e.key.toLowerCase() === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        activateVoidPortal();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateVoidPortal() {
    var portal = document.querySelector('.ee-void-portal');
    if (!portal) {
      portal = document.createElement('div');
      portal.className = 'ee-void-portal';
      portal.innerHTML = '<div class="void-msg">Has encontrado el Void<small>El vacío entre los mundos te observa... presiona cualquier tecla para volver.</small></div>';
      document.body.appendChild(portal);
    }
    portal.classList.add('show');
    showToast('🌀', 'El Void ha sido desbloqueado');

    function closePortal() {
      portal.classList.remove('show');
      document.removeEventListener('keydown', closePortal);
      portal.removeEventListener('click', closePortal);
    }
    setTimeout(function () {
      document.addEventListener('keydown', closePortal, { once: true });
      portal.addEventListener('click', closePortal, { once: true });
    }, 600);
  }

  /* ─── 2. Typing "mantequilla" → Luigi appears ─── */
  var secretWord = 'mantequilla';
  var typedBuffer = '';

  document.addEventListener('keydown', function (e) {
    /* Skip if user is typing in an input/textarea */
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key.length !== 1) return;
    typedBuffer += e.key.toLowerCase();
    if (typedBuffer.length > secretWord.length) {
      typedBuffer = typedBuffer.slice(-secretWord.length);
    }
    if (typedBuffer === secretWord) {
      typedBuffer = '';
      showToast('🧈', '<strong>MANTEQUILLA NEGRA</strong><br>Luigi te observa desde las sombras...', 4000);
    }
  });

  /* ─── 3. Logo click counter → Soul counter ─── */
  var logoClicks = 0;
  var logoTimer = null;
  var brand = document.querySelector('.brand');

  if (brand) {
    brand.addEventListener('click', function (e) {
      /* Don't prevent navigation if it's an anchor link */
      logoClicks++;
      clearTimeout(logoTimer);
      logoTimer = setTimeout(function () { logoClicks = 0; }, 2000);

      if (logoClicks === 7) {
        logoClicks = 0;
        e.preventDefault();
        showSoulCounter();
      }
    });
  }

  function showSoulCounter() {
    var counter = document.querySelector('.ee-soul-counter');
    if (!counter) {
      counter = document.createElement('div');
      counter.className = 'ee-soul-counter';
      document.body.appendChild(counter);
    }
    counter.innerHTML = '<span class="soul-number">' + souls + '</span>almas han visitado el Purgatorio';
    counter.classList.add('show');
    showToast('👁️', 'El conteo de almas ha sido revelado');
    setTimeout(function () { counter.classList.remove('show'); }, 4000);
  }

  /* ─── 4. Secret "bump" word → Ritual del Bump ─── */
  var bumpWord = 'bump';
  var bumpBuffer = '';

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key.length !== 1) return;
    bumpBuffer += e.key.toLowerCase();
    if (bumpBuffer.length > bumpWord.length) {
      bumpBuffer = bumpBuffer.slice(-bumpWord.length);
    }
    if (bumpBuffer === bumpWord) {
      bumpBuffer = '';
      showToast('🔔', '<strong>/bump</strong><br>Has completado el ritual sagrado. Artema te observa con aprobación.', 4000);
    }
  });

})();
