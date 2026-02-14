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
    if (!events || events.length === 0) {
      container.innerHTML =
        '<div class="events-empty">' +
          '<span>🌑</span>' +
          '<p>No hay eventos programados en el Purgatorio por ahora.</p>' +
          '<p style="font-size:13px;margin-top:8px;">El Void está en calma... por ahora. ' +
          'Visita el servidor para estar atento a los próximos rituales.</p>' +
          '<a href="https://discord.gg/aTFMEVzcew" target="_blank" rel="noopener noreferrer" ' +
          'class="btn btn-primary" style="margin-top:20px;">Unirse al servidor</a>' +
        '</div>';
      return;
    }

    var html = '<div class="events-grid">';
    events.forEach(function (ev) {
      var statusClass = ev.status === 'active' ? 'active' : 'scheduled';
      var statusLabel = ev.status === 'active' ? 'En vivo' : 'Programado';

      html += '<article class="event-card reveal-init">';
      if (ev.image) {
        html += '<img src="' + ev.image + '" alt="" ' +
                'style="width:100%;border-radius:10px;margin-bottom:12px;opacity:.85;" loading="lazy" />';
      }
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">';
      html += '<span class="event-status ' + statusClass + '">' + statusLabel + '</span>';
      html += '</div>';
      html += '<h3>' + escapeHTML(ev.name) + '</h3>';
      html += '<div class="event-date">' + formatDate(ev.start) + '</div>';
      if (ev.end) {
        html += '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">Hasta: ' +
                formatDate(ev.end) + '</div>';
      }
      if (ev.location) {
        html += '<div style="font-size:12px;color:var(--muted);margin-bottom:8px;">📍 ' +
                escapeHTML(ev.location) + '</div>';
      }
      if (ev.description) {
        html += '<p class="event-desc">' + escapeHTML(ev.description) + '</p>';
      }
      html += '<div class="event-meta">';
      if (ev.user_count > 0) {
        html += '<span class="event-users">' + ev.user_count + ' interesados</span>';
      }
      html += '<a href="https://discord.com/events/' + ev.guild_id + '/' + ev.id +
              '" target="_blank" rel="noopener noreferrer" class="event-link">Ver en Discord</a>';
      html += '</div>';
      html += '</article>';
    });
    html += '</div>';

    container.innerHTML = html;

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
        '<a href="https://discord.gg/aTFMEVzcew" target="_blank" rel="noopener noreferrer" ' +
        'class="btn btn-ghost" style="margin-top:16px;">Ir al servidor directamente</a>' +
      '</div>';
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
