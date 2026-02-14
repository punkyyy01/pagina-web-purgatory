/* ═══════════════════════════════════════════════════════════
   PURGATORY — Index Events Preview (mini feed from Discord API)
   Shows up to 3 upcoming events on the main page
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var container = document.getElementById('index-events-container');
  if (!container) return;

  function formatDate(dateStr) {
    try {
      var d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderEvents(events) {
    if (!events || events.length === 0) {
      container.innerHTML =
        '<div class="index-events-empty">' +
          '<span>🌑</span>' +
          '<p>No hay eventos programados en el Purgatorio por ahora.</p>' +
          '<p style="font-size:12px;margin-top:6px;color:var(--muted);">El Void está en calma... visita el servidor para estar atento a los próximos rituales.</p>' +
        '</div>';
      return;
    }

    /* Show max 3 events */
    var shown = events.slice(0, 3);
    var html = '<div class="index-events-grid">';

    shown.forEach(function (ev) {
      var statusClass = ev.status === 'active' ? 'active' : 'scheduled';
      var statusLabel = ev.status === 'active' ? 'En vivo' : 'Programado';

      html += '<article class="index-event-card reveal-init">';
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">';
      html += '<span class="event-status ' + statusClass + '">' + statusLabel + '</span>';
      if (ev.user_count > 0) {
        html += '<span style="font-size:11px;color:var(--muted)">👥 ' + ev.user_count + ' interesados</span>';
      }
      html += '</div>';
      html += '<h4>' + escapeHTML(ev.name) + '</h4>';
      html += '<div class="index-event-date">' + formatDate(ev.start) + '</div>';
      if (ev.description) {
        var desc = ev.description.length > 120 ? ev.description.substring(0, 120) + '...' : ev.description;
        html += '<p class="index-event-desc">' + escapeHTML(desc) + '</p>';
      }
      html += '</article>';
    });

    html += '</div>';
    container.innerHTML = html;

    /* Trigger reveal animation */
    requestAnimationFrame(function () {
      container.querySelectorAll('.reveal-init').forEach(function (el) {
        el.classList.add('revealed');
      });
    });
  }

  function renderError() {
    container.innerHTML =
      '<div class="index-events-empty">' +
        '<span>🌑</span>' +
        '<p>No se pudieron invocar los eventos. Visita el servidor directamente.</p>' +
      '</div>';
  }

  /* ─── Cache compartido con eventos-loader (misma key) ─── */
  var CACHE_KEY = 'purgatory_events_cache';
  var CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  function getCachedEvents() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var cached = JSON.parse(raw);
      if (Date.now() - cached.ts > CACHE_TTL) {
        sessionStorage.removeItem(CACHE_KEY);
        return null;
      }
      return cached.data;
    } catch (e) { return null; }
  }

  function setCachedEvents(data) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data }));
    } catch (e) { /* silencioso */ }
  }

  /* Fetch events — usa cache local primero */
  var cached = getCachedEvents();
  if (cached) {
    if (cached.error) {
      renderEvents([]);
    } else {
      renderEvents(cached);
    }
  } else {
    fetch('/api/discord-events')
      .then(function (res) {
        if (!res.ok) throw new Error('Error ' + res.status);
        return res.json();
      })
      .then(function (data) {
        setCachedEvents(data);
        if (data.error) {
          renderEvents([]);
        } else {
          renderEvents(data);
        }
      })
      .catch(function () {
        renderError();
      });
  }

})();
