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
        '<span class="stamp evento-naipe__sello">' + escapeHTML(s.label) + '</span>' +
        '<div class="evento-naipe__fecha">' +
          '<span class="naipe-day">' + dp.day + '</span>' +
          '<span class="naipe-month">' + dp.month + '</span>' +
          '<span class="naipe-year">' + dp.year + '</span>' +
        '</div>' +
        '<div class="evento-naipe__content">' +
          '<h3 class="naipe-title">' + escapeHTML(ev.name) + '</h3>' +
          (ev.description ? '<p class="naipe-desc">' + escapeHTML(ev.description) + '</p>' : '') +
          (ev.user_count > 0 ? '<div class="naipe-meta">' + ev.user_count + ' almas convocadas</div>' : '') +
        '</div>' +
        '<div class="evento-naipe__cta">' +
          '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="btn naipe-btn-ritual">Ver ritual ›</a>' +
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
        '<div class="evento-edicto__hero">' +
          '<img class="edicto-portada" src="' + escapeHTML(ev.image) + '" alt="' + escapeHTML(ev.name) + '">' +
        '</div>' +
        '<div class="evento-edicto__body">' +
          '<span class="stamp edicto-badge">' + escapeHTML(s.label) + '</span>' +
          '<h3 class="edicto-title">' + escapeHTML(ev.name) + '</h3>' +
          '<div class="record-meta">' + dp.day + ' ' + dp.month + ' ' + dp.year + '</div>' +
          (ev.description ? '<p class="edicto-desc">' + escapeHTML(ev.description) + '</p>' : '') +
          '<div class="edicto-footer">' +
            (ev.user_count > 0 ? '<span class="edicto-almas">' + ev.user_count + ' almas convocadas</span>' : '<span></span>') +
            '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="btn naipe-btn-ritual">Ver ritual ›</a>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  /* ─── Estado + filtro por tab ─── */
  var lastEvents = [];
  var activeTab  = 'all'; // all | proximo | activo | pasado
  var TAB_CLASS  = { proximo: 'is-proximo', activo: 'is-activo', pasado: 'is-pasado' };

  function filterByTab(events) {
    if (activeTab === 'all') return events;
    var cls = TAB_CLASS[activeTab];
    return events.filter(function (ev) { return getStateInfo(ev).cls === cls; });
  }

  function buildGrid(events) {
    var emptyEl = document.getElementById('events-empty');

    if (!events || events.length === 0) {
      if (emptyEl) emptyEl.style.display = '';
      container.innerHTML = '';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    var html = '<div class="eventos-grid">';
    events.forEach(function (ev) {
      html += ev.image ? renderFeaturedCard(ev) : renderCasualCard(ev);
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderEvents(events) {
    lastEvents = events || [];
    buildGrid(filterByTab(lastEvents));
  }

  var tabsEl = document.getElementById('events-filters');
  if (tabsEl) {
    tabsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-tab[data-tab]');
      if (!btn) return;
      tabsEl.querySelectorAll('.filter-tab').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeTab = btn.getAttribute('data-tab');
      buildGrid(filterByTab(lastEvents));
    });
  }

  container.addEventListener('error', function (e) {
    if (e.target.classList && e.target.classList.contains('edicto-portada')) {
      var article = e.target.closest('article');
      if (article) article.classList.add('no-image');
    }
  }, true);

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
