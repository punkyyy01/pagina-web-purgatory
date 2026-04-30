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
  var CORNERS =
    '<img src="static/img/ornaments/corner-tl.svg" class="frame-corner frame-corner-tl" alt="">' +
    '<img src="static/img/ornaments/corner-tr.svg" class="frame-corner frame-corner-tr" alt="">' +
    '<img src="static/img/ornaments/corner-bl.svg" class="frame-corner frame-corner-bl" alt="">' +
    '<img src="static/img/ornaments/corner-br.svg" class="frame-corner frame-corner-br" alt="">';

  function getStateInfo(ev) {
    var now   = Date.now();
    var start = new Date(ev.start).getTime();
    var end   = ev.end ? new Date(ev.end).getTime() : null;
    var isActive = ev.status === 'active' || (start <= now && (!end || end > now));
    var isPast   = end ? end < now : false;
    return {
      cls:   isActive ? 'is-activo' : (isPast ? 'is-pasado'  : 'is-proximo'),
      label: isActive ? 'ACTIVO'    : (isPast ? 'PASADO'     : 'PRÓXIMO')
    };
  }

  function getDateParts(ev) {
    var d = new Date(ev.start);
    return {
      day:   d.getDate(),
      month: d.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase().replace('.', ''),
      year:  d.getFullYear()
    };
  }

  function renderCasualCard(ev) {
    var s   = getStateInfo(ev);
    var dp  = getDateParts(ev);
    var url = 'https://discord.com/events/' + ev.guild_id + '/' + ev.id;
    return (
      '<article class="evento-naipe ' + s.cls + '">' +
        CORNERS +
        '<div class="evento-naipe__sello ' + s.cls + '">' +
          '<span class="naipe-sello-diamond">◆</span>' +
          escapeHTML(s.label) +
          '<span class="naipe-sello-diamond">◆</span>' +
        '</div>' +
        '<div class="evento-naipe__fecha">' +
          '<div class="naipe-day">' + dp.day + '</div>' +
          '<div class="naipe-month">' + dp.month + '</div>' +
          '<div class="naipe-year">' + dp.year + '</div>' +
        '</div>' +
        '<div class="evento-naipe__divider"></div>' +
        '<div class="evento-naipe__content">' +
          '<h3 class="naipe-title">' + escapeHTML(ev.name) + '</h3>' +
          (ev.description ? '<p class="naipe-desc">' + escapeHTML(ev.description) + '</p>' : '') +
          (ev.user_count > 0 ? '<div class="naipe-meta">◆ ' + ev.user_count + ' almas convocadas</div>' : '') +
        '</div>' +
        '<div class="evento-naipe__cta">' +
          '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="btn naipe-btn-ritual">VER RITUAL ›</a>' +
        '</div>' +
      '</article>'
    );
  }

  function renderFeaturedCard(ev) {
    var s   = getStateInfo(ev);
    var dp  = getDateParts(ev);
    var url = 'https://discord.com/events/' + ev.guild_id + '/' + ev.id;
    return (
      '<article class="evento-edicto ' + s.cls + '">' +
        CORNERS +
        '<div class="evento-edicto__hero">' +
          '<img class="edicto-portada" src="' + ev.image + '" alt="' + escapeHTML(ev.name) + '"' +
            ' onerror="this.closest(\'article\').classList.add(\'no-image\')">' +
          '<div class="edicto-fecha-medallon">' +
            '<div class="edicto-fecha-medallon-inner">' +
              '<div class="medallon-day">' + dp.day + '</div>' +
              '<div class="medallon-month">' + dp.month + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="evento-edicto__body">' +
          '<div class="edicto-badge ' + s.cls + '">' +
            '<span class="edicto-dot"></span>' +
            'RITUAL ' + escapeHTML(s.label) +
          '</div>' +
          '<h3 class="edicto-title">' + escapeHTML(ev.name) + '</h3>' +
          '<div class="divider"><span class="divider-text"></span></div>' +
          (ev.description ? '<p class="edicto-desc">' + escapeHTML(ev.description) + '</p>' : '') +
          '<div class="edicto-footer">' +
            (ev.user_count > 0 ? '<span class="edicto-almas">' + ev.user_count + ' ALMAS</span>' : '<span></span>') +
            '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="btn naipe-btn-ritual">VER RITUAL ›</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function renderEvents(events) {
    var emptyEl = document.getElementById('events-empty');

    if (!events || events.length === 0) {
      if (emptyEl) emptyEl.style.display = '';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    var html = '';
    events.forEach(function (ev) {
      html += ev.image ? renderFeaturedCard(ev) : renderCasualCard(ev);
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
