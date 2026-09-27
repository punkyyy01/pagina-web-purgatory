/* ═══════════════════════════════════════════════════════════
   PURGATORY — Estado de sesión en el nav
   ───────────────────────────────────────────────────────────
   Todo el sitio sigue pre-renderizado y estático (Fase 1) — esto es la
   única parte dinámica: al cargar, pregunta si hay sesión y si la hay,
   reemplaza "Iniciar sesión con Discord" por el usuario + su menú.
   Sin JS (o mientras esta llamada no respondió) el botón de login ya
   renderizado por el servidor sigue siendo un link real y funcional —
   no hay ningún estado roto en el medio.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  fetch('/api/auth/me', { credentials: 'same-origin' })
    .then(function (res) { return res.ok ? res.json() : { authenticated: false }; })
    .catch(function () { return { authenticated: false }; })
    .then(function (data) {
      if (!data || !data.authenticated) return;

      var displayName = data.globalName || data.username || 'Cuenta';

      // El nombre puede aparecer en más de un lugar (dropdown de escritorio +
      // ítems sueltos del menú mobile) — se puebla en todos antes de mostrar
      // nada, para que no haya un instante con el bloque visible y vacío.
      document.querySelectorAll('.js-nav-user-name').forEach(function (el) { el.textContent = displayName; });

      document.querySelectorAll('.js-nav-user').forEach(function (block) {
        var avatar = block.querySelector('.js-nav-user-avatar');
        if (avatar && data.avatarUrl) avatar.src = data.avatarUrl;
        block.hidden = false;

        var trigger = block.querySelector('.js-nav-user-trigger');
        if (trigger) {
          trigger.addEventListener('click', function () {
            var isOpen = block.classList.toggle('is-open');
            trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          });
        }
      });

      document.querySelectorAll('.js-nav-user-mobile-item').forEach(function (el) { el.hidden = false; });
      document.querySelectorAll('.js-nav-login').forEach(function (el) { el.hidden = true; });
      document.querySelectorAll('.js-nav-login-item').forEach(function (el) { el.hidden = true; });

      document.addEventListener('click', function (e) {
        document.querySelectorAll('.js-nav-user.is-open').forEach(function (block) {
          if (block.contains(e.target)) return;
          block.classList.remove('is-open');
          var trigger = block.querySelector('.js-nav-user-trigger');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      });
    });
})();
