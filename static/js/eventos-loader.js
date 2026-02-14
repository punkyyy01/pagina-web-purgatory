/* ═══════════════════════════════════════════════════════════
   PURGATORY — Eventos Loader (fetches from /api/discord-events)
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var container = document.getElementById('events-container');
  var loading = document.getElementById('events-loading');
  if (!container) return;

  function formatDate(dateStr) {
    try {
      var d = new Date(dateStr);
      var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      };
      return d.toLocaleDateString('es-ES', options);
    } catch (e) {
      return dateStr;
    }
  }

  function renderEvents(events) {
    if (!events || events.length === 0) {
      container.innerHTML =
        '<div class="events-empty">' +
          '<span>🌑</span>' +
          '<p>No hay eventos programados en el Purgatorio por ahora.</p>' +
          '<p style="font-size:13px;margin-top:8px;">El Void está en calma... por ahora. Visita el servidor para estar atento a los próximos rituales.</p>' +
          '<a href="https://discord.gg/aTFMEVzcew" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="margin-top:20px;">Unirse al servidor</a>' +
        '</div>';
      return;
    }

    var html = '<div class="events-grid">';
    events.forEach(function (ev) {
      var statusClass = ev.status === 'active' ? 'active' : 'scheduled';
      var statusLabel = ev.status === 'active' ? 'En vivo' : 'Programado';

      html += '<article class="event-card reveal-init">';
      if (ev.image) {
        html += '<img src="' + ev.image + '" alt="" style="width:100%;border-radius:10px;margin-bottom:12px;opacity:.85;" loading="lazy" />';
      }
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">';
      html += '<span class="event-status ' + statusClass + '">' + statusLabel + '</span>';
      html += '</div>';
      html += '<h3>' + escapeHTML(ev.name) + '</h3>';
      html += '<div class="event-date">' + formatDate(ev.start) + '</div>';
      if (ev.end) {
        html += '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">Hasta: ' + formatDate(ev.end) + '</div>';
      }
      if (ev.location) {
        html += '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">📍 ' + escapeHTML(ev.location) + '</div>';
      }
      if (ev.description) {
        html += '<p class="event-desc">' + escapeHTML(ev.description) + '</p>';
      }
      html += '<div class="event-meta">';
      if (ev.user_count > 0) {
        html += '<span class="event-users">' + ev.user_count + ' interesados</span>';
      }
      html += '<a href="https://discord.com/events/' + ev.guild_id + '/' + ev.id + '" target="_blank" rel="noopener noreferrer" class="event-link">Ver en Discord</a>';
      html += '</div>';
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

  function renderError(msg) {
    container.innerHTML =
      '<div class="events-empty">' +
        '<span>⚠️</span>' +
        '<p>' + msg + '</p>' +
        '<a href="https://discord.gg/aTFMEVzcew" target="_blank" rel="noopener noreferrer" class="btn btn-ghost" style="margin-top:16px;">Ir al servidor directamente</a>' +
      '</div>';
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ─── Cache en sessionStorage para evitar invocaciones redundantes ─── */
  var CACHE_KEY = 'purgatory_events_cache';
  var CACHE_TTL = 5 * 60 * 1000; // 5 minutos (sincronizado con s-maxage del servidor)

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
    } catch (e) { /* quota exceeded — silencioso */ }
  }

  /* Fetch events — usa cache local primero, luego API */
  var cached = getCachedEvents();
  if (cached) {
    if (loading) loading.style.display = 'none';
    if (cached.error) {
      renderError('No se pudieron cargar los eventos: ' + cached.error);
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
        if (loading) loading.style.display = 'none';
        setCachedEvents(data);
        if (data.error) {
          renderError('No se pudieron cargar los eventos: ' + data.error);
        } else {
          renderEvents(data);
        }
      })
      .catch(function (err) {
        if (loading) loading.style.display = 'none';
        renderError('No se pudieron invocar los eventos del Void. Puede que la API no esté configurada aún.');
      });
  }

})();
