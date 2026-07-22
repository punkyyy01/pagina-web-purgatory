/* ═══════════════════════════════════════════════════════════
   PURGATORY — Cuenta regresiva al próximo evento del servidor
   Un solo fetch a /api/discord-events + refresh puntual al llegar
   a cero. Sin dependencias, sin animación (solo texto).
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var el = document.getElementById('countdown-widget');
  if (!el) return;

  var DISCORD_URL = 'https://discord.gg/aTFMEVzcew';
  var timer  = null;
  var target = null;

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function renderEvent(name, url) {
    el.innerHTML =
      '<div class="frame countdown-frame">' +
        '<p class="countdown-label">Próximo Ritual</p>' +
        '<h3 class="countdown-name">' + escapeHTML(name) + '</h3>' +
        '<div class="countdown-clock" id="countdown-clock">--:--:--:--</div>' +
        '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="btn btn-blood countdown-cta">Ver en Discord</a>' +
      '</div>';
  }

  function renderFallback() {
    el.innerHTML =
      '<div class="frame countdown-frame">' +
        '<p class="countdown-label">Próximo Ritual</p>' +
        '<p class="countdown-empty">No hay rituales programados por ahora.</p>' +
        '<a href="' + DISCORD_URL + '" target="_blank" rel="noopener noreferrer" class="btn btn-blood countdown-cta">Entrar al Discord</a>' +
      '</div>';
  }

  function tick() {
    var clock = document.getElementById('countdown-clock');
    var diff  = target - Date.now();
    if (diff <= 0) {
      clearInterval(timer);
      load(); // refetch para tomar el siguiente evento
      return;
    }
    if (!clock) return;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    clock.textContent = pad(d) + ':' + pad(h) + ':' + pad(m) + ':' + pad(s);
  }

  function load() {
    fetch('/api/discord-events')
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        clearInterval(timer);

        var now  = Date.now();
        var next = Array.isArray(data) && data.find(function (ev) {
          return ev.status !== 'active' && new Date(ev.start).getTime() > now;
        });

        if (!next) { renderFallback(); return; }

        target = new Date(next.start).getTime();
        renderEvent(next.name, 'https://discord.com/events/' + next.guild_id + '/' + next.id);
        tick();
        timer = setInterval(tick, 1000);
      })
      .catch(renderFallback);
  }

  load();
})();
