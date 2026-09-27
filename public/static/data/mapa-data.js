/* ═══════════════════════════════════════════════════════════
   PURGATORY — Mapa Data + Render (card nodes + pan/zoom)
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Node data ── */
  var nodes = [
    /* Servidores */
    { id: 'fosas',     x: 130,  y: 100, type: 'server', title: 'Las Fosas', subtitle: 'Servidor I',
      desc: 'El salvaje oeste de Discord: sin reglas, puro caos y los audios prohibidos. Aquí nació la leyenda de Nelcon y el Amorodio que moldeó a toda la comunidad.', tag: 'Era I' },
    { id: 'pibes',     x: 380,  y: 360, type: 'server', title: 'Los Pibes', subtitle: 'Servidor II',
      desc: 'Servidor provisional tras el cierre de Las Fosas. Shitposters sin rumbo, mala administración y riesgo de desintegración total.', tag: 'Era II' },
    { id: 'olympo',    x: 700,  y: 100, type: 'server', title: 'Olympo', subtitle: 'Servidor III',
      desc: 'La Edad de Oro. El grupo original de Las Fosas se reintegró, llegó el Éxodo Blanco, y por un tiempo fue lo que todos esperaban. El Éxodo Blanco trajo a Ivan, Matiti, Twoky y consolidó el lore. También aquí empezó la caída.', tag: 'Era III' },
    { id: 'purgatory', x: 960,  y: 360, type: 'server', title: 'PURG4TORY', subtitle: 'Servidor IV',
      desc: 'El servidor construido con la memoria de todo lo que no debía repetirse. Fundado el 12 de noviembre. 85 miembros. El bump no falla. Bajo la dictadura de Renasarenas conviven el salseo, el bump y la vigilancia del Staff.', tag: 'Era IV — Actual' },

    /* Eventos */
    { id: 'audios',    x: 50,   y: 270, type: 'event',  title: 'Audios Prohibidos', subtitle: 'Evento · Fosas',
      desc: 'Los clips caóticos y legendarios que definieron el tono de Las Fosas. Mitología oral convertida en arma.', tag: 'Evento' },
    { id: 'pelea',     x: 260,  y: 200, type: 'event',  title: 'Daku vs Nelcon', subtitle: 'Evento · Fosas',
      desc: 'La pelea que fracturó el servidor original y empujó a la comunidad al éxodo. Punto de no retorno.', tag: 'Evento' },
    { id: 'bache',     x: 200,  y: 470, type: 'event',  title: 'Migración al Bache', subtitle: 'Evento · Pibes',
      desc: 'El salto improvisado a Los Pibes Shitposters. Caos administrativo y falta de rumbo que casi rompe todo.', tag: 'Evento' },
    { id: 'drift',     x: 500,  y: 490, type: 'event',  title: 'Comunidad al Límite', subtitle: 'Evento · Pibes',
      desc: 'Dispersión y desgaste: las almas se desconectan, algunos se pierden en el Void, otros esperan que alguien cree algo que valga la pena.', tag: 'Evento' },
    /* x=520 y no 580: a 580 la card se solapaba con la de Olympo (ver scripts/check-mapa-overlap.js) */
    { id: 'exodo',     x: 520,  y: 50,  type: 'event',  title: 'Éxodo Blanco', subtitle: 'Evento · Olympo',
      desc: 'El grupo de Doomentio implosionó por una voideada de Twoky. Los que valían la pena terminaron en OLYMPO. Así llegaron Ivan, Matiti, y el resto. El server nunca fue lo mismo.', tag: 'Evento' },
    { id: 'caida',     x: 870,  y: 220, type: 'event',  title: 'Caída del Olympo', subtitle: 'Evento · Olympo',
      desc: 'Ivan y Cat no supieron administrar lo que el Éxodo les dio. El patrón, tercera vez: mala administración. La Edad de Oro terminó exactamente como las anteriores.', tag: 'Evento' },
    { id: 'dictadura', x: 850,  y: 490, type: 'event',  title: 'Dictadura de Renas', subtitle: 'Evento · Purgatory',
      desc: 'Renas asume el mando absoluto. Ritual del /bump, control estricto y chisme vigilado mantienen unido al refugio.', tag: 'Evento' },
    { id: 'purga',     x: 1100, y: 260, type: 'event',  title: 'Purga de los Menores', subtitle: 'Evento · Purgatory',
      desc: 'Exilio "misericordioso" a Instagram para salvar la paz mental. Marca la limpieza del servidor actual.', tag: 'Evento' }
  ];

  /* ── Connection pairs (by node id) ── */
  var connections = [
    ['fosas', 'pibes'], ['pibes', 'olympo'], ['olympo', 'purgatory'],
    ['fosas', 'audios'], ['fosas', 'pelea'],
    ['pibes', 'bache'], ['pibes', 'drift'],
    ['olympo', 'exodo'], ['olympo', 'caida'],
    ['purgatory', 'dictadura'], ['purgatory', 'purga']
  ];

  /* ── DOM refs ── */
  var container = document.getElementById('mapa-container');
  var canvas    = document.getElementById('mapa-canvas');
  var tooltip   = document.getElementById('mapa-tooltip');
  var tooltipContent = document.getElementById('mapa-tooltip-content');
  var tooltipClose   = document.getElementById('mapa-tooltip-close');
  var btnZoomIn  = document.getElementById('mapa-zoom-in');
  var btnZoomOut = document.getElementById('mapa-zoom-out');
  var btnReset   = document.getElementById('mapa-reset');

  if (!container || !canvas) return;

  /* ── Canvas virtual dimensions ── */
  var CANVAS_W = 1250;
  var CANVAS_H = 580;
  canvas.style.width  = CANVAS_W + 'px';
  canvas.style.height = CANVAS_H + 'px';
  canvas.style.position = 'relative';

  /* ── SVG connection layer ── */
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 ' + CANVAS_W + ' ' + CANVAS_H);
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none';
  canvas.appendChild(svg);

  /* Helper: get node by id */
  function getNode(id) {
    return nodes.find(function (n) { return n.id === id; });
  }

  /* Draw connection lines */
  connections.forEach(function (pair) {
    var a = getNode(pair[0]);
    var b = getNode(pair[1]);
    if (!a || !b) return;
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
    line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
    line.style.stroke = 'var(--dim)';
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);
  });

  /* ── Render card nodes ── */
  nodes.forEach(function (n) {
    var nodeEl = document.createElement('div');
    nodeEl.className = 'mapa-node' + (n.type === 'server' ? ' mapa-node--server' : '');
    nodeEl.setAttribute('data-node', n.id);
    nodeEl.style.left = n.x + 'px';
    nodeEl.style.top  = n.y + 'px';

    var card = document.createElement('div');
    card.className = 'mapa-card';
    card.innerHTML =
      '<div class="mapa-card-name">' + n.title + '</div>' +
      '<div class="mapa-card-type">' + n.subtitle + '</div>';

    nodeEl.appendChild(card);
    canvas.appendChild(nodeEl);

    /* Click → open tooltip modal */
    nodeEl.addEventListener('click', function (e) {
      e.stopPropagation();
      openTooltip(n);
      /* Highlight active */
      canvas.querySelectorAll('.mapa-node').forEach(function (el) { el.classList.remove('active'); });
      nodeEl.classList.add('active');
    });
  });

  /* ── Tooltip modal ── */
  function openTooltip(n) {
    if (!tooltip || !tooltipContent) return;
    tooltipContent.innerHTML =
      '<div class="record-meta">' + n.tag + '</div>' +
      '<h3 id="mapa-tooltip-title" style="font-family:var(--font-serif);font-weight:600;font-size:var(--fs-xl);color:var(--paper);margin-bottom:var(--space-3)">' + n.title + '</h3>' +
      '<p style="font-size:var(--fs-md);color:var(--paper);opacity:0.85;line-height:1.65">' + n.desc + '</p>' +
      '<p class="record-meta" style="margin-top:var(--space-4);margin-bottom:0">' + n.subtitle + '</p>';
    tooltip.classList.add('is-open');
    tooltip.setAttribute('aria-hidden', 'false');
  }

  if (tooltipClose) {
    tooltipClose.addEventListener('click', closeTooltip);
  }
  if (tooltip) {
    tooltip.addEventListener('click', function (e) {
      if (e.target === tooltip) closeTooltip();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeTooltip();
  });

  function closeTooltip() {
    if (!tooltip) return;
    tooltip.classList.remove('is-open');
    tooltip.setAttribute('aria-hidden', 'true');
    canvas.querySelectorAll('.mapa-node').forEach(function (el) { el.classList.remove('active'); });
  }

  /* ── Pan + Zoom ── */
  var tx = 0, ty = 0, scale = 1;
  var MIN_SCALE = 0.4, MAX_SCALE = 2;
  /* Las cards se dibujan centradas en el nodo (150px de ancho), así que
     sobresalen del canvas virtual: hay que reservarles lugar en el fit. */
  var CARD_PAD = 170;
  var dragging = false, startX, startY, startTx, startTy;

  function applyTransform() {
    canvas.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
  }

  /* Centra el mapa en el contenedor con la escala actual */
  function centerMap() {
    var cw = container.offsetWidth;
    var ch = container.offsetHeight;
    tx = Math.round((cw - CANVAS_W * scale) / 2);
    ty = Math.round((ch - CANVAS_H * scale) / 2);
    applyTransform();
  }

  /* Escala inicial: entra todo el mapa en el contenedor. Nunca amplía por
     encima de 1 (en pantallas grandes se ve a tamaño real) ni baja de
     MIN_SCALE (más chico el texto es ilegible — ahí se arrastra). */
  function fitMap() {
    scale = Math.max(MIN_SCALE, Math.min(
      1,
      container.offsetWidth  / (CANVAS_W + CARD_PAD),
      container.offsetHeight / (CANVAS_H + CARD_PAD)
    ));
    centerMap();
  }

  /* ponytail: no re-ajusta en resize — en móvil la barra del navegador
     dispara resize al scrollear y le tiraría abajo el pan al usuario. */
  setTimeout(fitMap, 50);

  /* Zoom buttons */
  if (btnZoomIn)  btnZoomIn.addEventListener('click',  function () { zoom(0.2); });
  if (btnZoomOut) btnZoomOut.addEventListener('click', function () { zoom(-0.2); });
  if (btnReset)   btnReset.addEventListener('click',   fitMap);

  function zoom(delta) {
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));
    centerMap();
  }

  /* Wheel zoom */
  container.addEventListener('wheel', function (e) {
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.1 : -0.1);
  }, { passive: false });

  /* Mouse drag */
  container.addEventListener('mousedown', function (e) {
    if (e.target.closest('.mapa-node')) return;
    dragging = true;
    startX = e.clientX; startY = e.clientY;
    startTx = tx; startTy = ty;
    container.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    tx = startTx + (e.clientX - startX);
    ty = startTy + (e.clientY - startY);
    applyTransform();
  });
  window.addEventListener('mouseup', function () {
    if (dragging) { dragging = false; container.style.cursor = 'grab'; }
  });

  /* Touch drag */
  var touchStart = null;
  container.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, tx: tx, ty: ty };
    }
  }, { passive: true });
  container.addEventListener('touchmove', function (e) {
    if (!touchStart || e.touches.length !== 1) return;
    tx = touchStart.tx + (e.touches[0].clientX - touchStart.x);
    ty = touchStart.ty + (e.touches[0].clientY - touchStart.y);
    applyTransform();
  }, { passive: true });
  container.addEventListener('touchend', function () { touchStart = null; }, { passive: true });

})();
