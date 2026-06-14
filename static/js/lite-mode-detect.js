/* Detección de equipo débil — corre antes que todo lo demás.
   Si el equipo es limitado, agrega .lite-mode al <html> para que
   el CSS desactive efectos pesados y los scripts salten animaciones.

   UMBRALES CONSERVADORES (no afecta a equipos normales):
   - cores: solo flagea 1-2 núcleos lógicos (un Ryzen 5 tiene 12, no le toca)
   - memory: solo flagea ≤2 GB reportados por el browser (potencias de 2, tapa en 8)
   - slowNet: solo si el usuario activó "ahorro de datos" o la red es 2G/slow-2G
   - reduced: si el usuario lo eligió explícitamente en Accesibilidad del SO */
(function () {
  try {
    var cores   = navigator.hardwareConcurrency || 4;
    var memory  = navigator.deviceMemory;        // undefined en Firefox (se ignora)
    var conn    = navigator.connection || {};
    var slowNet = conn.saveData === true ||
                  (conn.effectiveType && /(^|-)(2g|slow-2g)$/.test(conn.effectiveType));
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var weakCPU = cores <= 2;
    var weakRAM = (memory !== undefined && memory !== null) && memory <= 2;

    if (weakCPU || weakRAM || slowNet || reduced) {
      document.documentElement.classList.add('lite-mode');
    }
  } catch (e) {
    /* Si algo falla, no activar lite-mode (asumir equipo capaz) */
  }
})();
