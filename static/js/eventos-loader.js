/* ═══════════════════════════════════════════════════════════
   PURGATORY — Eventos Loader
   ─────────────────────────────────────────────────────────
   • Carga eventos desde /api/discord-events
   • Polling automático cada 60 s (solo cuando la pestaña
     está visible) para mantener los datos siempre frescos.
   • Usa ETag / If-None-Match: si los eventos no cambiaron,
     el servidor responde 304 (< 1 KB) y no se re-renderiza.
   • Sin dependencias externas. Costo Vercel ≈ 0.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var container = document.getElementById('events-container');
  var loading   = document.getElementById('events-loading');
  if (!container) return;

  /* ─── Estado ─── */
  var POLL_INTERVAL = 60 * 1000; // 60 s entre polls
  var currentEtag  = null;       // ETag del último fetch exitoso
  var pollTimer    = null;       // referencia al setInterval

  /* ─── Helpers ─── */
  function formatDate(dateStr) {
    try {
      var d = new Date(dateStr);
      return d.toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long',
        day: 'numeric', hour: '2-digit', minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch (_) { return dateStr; }
  }

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ─── Render ─── */
  function renderEvents(events) {
    var emptyEl = document.getElementById('events-empty');

    if (!events || events.length === 0) {
      if (emptyEl) emptyEl.style.display = '';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    var html = '';
    events.forEach(function (ev) {
      var now = Date.now();
      var start = new Date(ev.start).getTime();
      var end   = ev.end ? new Date(ev.end).getTime() : null;
      var isActive   = ev.status === 'active' || (start <= now && (!end || end > now));
      var isPast     = end ? end < now : false;
      var isUpcoming = !isActive && !isPast;

      var cardClass = 'evento-card';
      if (isActive)   cardClass += ' evento-card--active';
      if (isPast)     cardClass += ' evento-card--past';

      var statusClass = isActive ? 'evento-status--active' : (isUpcoming ? 'evento-status--upcoming' : 'evento-status--past');
      var statusLabel = isActive ? 'En Curso' : (isUpcoming ? 'Próximo' : 'Pasado');

      var d = new Date(ev.start);
      var day   = d.getDate();
      var month = d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.','');

      html += '<article class="' + cardClass + '">';
      html +=   '<div class="evento-date-col"><div class="evento-day">' + day + '</div><div class="evento-month">' + month + '</div></div>';
      html +=   '<div>';
      html +=     '<div class="evento-title">' + escapeHTML(ev.name) + '</div>';
      if (ev.description) {
        html +=   '<div class="evento-desc">' + escapeHTML(ev.description) + '</div>';
      }
      if (ev.location) {
        html +=   '<div style="font-size:var(--fs-xs);color:var(--text-dim);margin-top:var(--space-2);letter-spacing:0.1em">' + escapeHTML(ev.location) + '</div>';
      }
      html +=   '</div>';
      html +=   '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:var(--space-2)">';
      html +=     '<span class="evento-status ' + statusClass + '">' + statusLabel + '</span>';
      if (ev.user_count > 0) {
        html += '<span style="font-size:var(--fs-xs);color:var(--text-dim);font-family:var(--font-display);letter-spacing:0.15em">' + ev.user_count + ' almas</span>';
      }
      html +=     '<a href="https://discord.com/events/' + ev.guild_id + '/' + ev.id + '" target="_blank" rel="noopener noreferrer" class="btn" style="padding:8px 16px;font-size:var(--fs-xs)">Ver ritual</a>';
      html +=   '</div>';
      html += '</article>';
    });

    container.innerHTML = html;
  }

  function renderError(msg) {
    var emptyEl = document.getElementById('events-empty');
    if (emptyEl) {
      emptyEl.style.display = '';
      emptyEl.innerHTML = '<p>Error al invocar los rituales: ' + msg + '</p>' +
        '<a href="https://discord.gg/aTFMEVzcew" target="_blank" rel="noopener noreferrer" class="btn btn-blood" style="margin-top:var(--space-4);display:inline-block">Ir al servidor</a>';
    }
  }

  /* ─── Fetch con soporte ETag ─── */
  function fetchEvents(isFirstLoad) {
    var headers = {};
    if (currentEtag) {
      headers['If-None-Match'] = currentEtag;
    }

    fetch('/api/discord-events', { headers: headers })
      .then(function (res) {
        /* 304 = no cambió nada, no re-renderizar */
        if (res.status === 304) return null;

        if (!res.ok) {
          /* Leer el body del error antes de lanzar, para mostrar el
             mensaje real de la API en vez de un genérico. */
          return res.json().catch(function () {
            return { error: 'HTTP ' + res.status };
          }).then(function (body) {
            var msg = (body && body.error) ? body.error : 'HTTP ' + res.status;
            var err = new Error(msg);
            err.apiMessage = msg;
            throw err;
          });
        }

        /* Guardar el ETag para la próxima vez */
        var etag = res.headers.get('etag');
        if (etag) currentEtag = etag;

        return res.json();
      })
      .then(function (data) {
        if (data === null) return; // 304 — sin cambios

        if (loading) loading.style.display = 'none';

        if (data.error) {
          renderError('No se pudieron cargar los eventos: ' + data.error);
        } else {
          renderEvents(data);
        }
      })
      .catch(function (err) {
        if (isFirstLoad) {
          if (loading) loading.style.display = 'none';
          var detail = (err && err.apiMessage) ? err.apiMessage
                     : 'No se pudo conectar con la API.';
          renderError('Error al invocar los eventos del Void: ' + detail);
        }
        /* En polls posteriores, si falla simplemente se mantiene
           lo que ya está renderizado — sin molestar al usuario. */
      });
  }

  /* ─── Polling inteligente (solo con pestaña visible) ─── */
  function startPolling() {
    if (pollTimer) return; // ya corriendo
    pollTimer = setInterval(function () {
      fetchEvents(false);
    }, POLL_INTERVAL);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  /* Pausar/reanudar cuando la pestaña se oculta/muestra */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopPolling();
    } else {
      /* Al volver a la pestaña, hacer un fetch inmediato y reanudar */
      fetchEvents(false);
      startPolling();
    }
  });

  /* ─── Arranque ─── */
  fetchEvents(true);
  startPolling();

})();
