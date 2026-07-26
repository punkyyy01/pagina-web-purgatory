/* Chequeo de solapamiento de las cards del mapa.
   Las cards miden 150px de ancho (styles.css: .mapa-card) y se dibujan
   centradas en el nodo (translate(-50%,-50%)). La altura depende de cuántas
   líneas ocupe el título; se asume el peor caso de 2 líneas.

   Correr: node scripts/check-mapa-overlap.js   → sale != 0 si hay solape. */
'use strict';
const fs = require('fs');
const path = require('path');

const CARD_W = 150;
const CARD_H = 90;  // peor caso: título en 2 líneas + subtítulo + padding

const src = fs.readFileSync(path.join(__dirname, '../static/data/mapa-data.js'), 'utf8');

// Extrae { id, x, y } de cada entrada del array de nodos.
const nodes = [...src.matchAll(/\{\s*id:\s*'([^']+)',\s*x:\s*(-?\d+),\s*y:\s*(-?\d+)/g)]
  .map(m => ({ id: m[1], x: +m[2], y: +m[3] }));

if (nodes.length === 0) throw new Error('no se parsearon nodos — cambió el formato de mapa-data.js');

const clashes = [];
for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    const a = nodes[i], b = nodes[j];
    const dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y);
    if (dx < CARD_W && dy < CARD_H) clashes.push(`${a.id} ↔ ${b.id} (dx=${dx}, dy=${dy})`);
  }
}

console.log(`${nodes.length} nodos, card ${CARD_W}x${CARD_H}`);
if (clashes.length) {
  console.error('SOLAPAN:\n  ' + clashes.join('\n  '));
  process.exit(1);
}
console.log('OK — ninguna card se solapa');
