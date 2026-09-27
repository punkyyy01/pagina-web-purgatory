/* Tabs de la vista previa de Lore en la home — sin dependencias, cada
   tab muestra su panel y oculta el resto. */
(function () {
  'use strict';

  var tabs = document.getElementById('lore-tabs');
  if (!tabs) return;

  var buttons = Array.prototype.slice.call(tabs.querySelectorAll('.lore-tab'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-era-panel]'));

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var era = btn.dataset.eraTab;

      buttons.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      panels.forEach(function (panel) {
        panel.hidden = panel.dataset.eraPanel !== era;
      });
    });
  });
})();
