/* Imagen OG — replica el wordmark de sello completo (hero/nav):
   serif "PURG" + "4" en --stamp-bright con anillo --stamp + "TORY".
   Misma paleta y mismas reglas de rol que el sitio: sin glow, sin ornamentos. */
const { createCanvas } = require('canvas');
const fs = require('fs');

const W = 1200, H = 630;

// Paleta — espejo de tokens.css
const INK          = '#0a0a0a';
const PAPER        = '#e8e4da';
const DIM          = 'rgba(232, 228, 218, 0.55)';
const RULE         = 'rgba(232, 228, 218, 0.14)';
const STAMP        = '#0d8a80';
const STAMP_BRIGHT = '#3de8da';

const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

ctx.fillStyle = INK;
ctx.fillRect(0, 0, W, H);

// Regla de encuadre, el mismo 1px de --rule que separa secciones en el sitio
ctx.strokeStyle = RULE;
ctx.lineWidth = 1;
ctx.strokeRect(40.5, 40.5, W - 81, H - 81);

/* Wordmark de sello completo.
   El anillo replica `.seal::after`: caja del glifo expandida (inset -10px -16px
   sobre un font-size de 76px → 21% horizontal, 13% vertical), círculo, -8deg. */
const FS = 132;
const BASE_Y = 350;
ctx.font = `600 ${FS}px serif`;
ctx.textAlign = 'left';
ctx.textBaseline = 'alphabetic';

const [pre, four, post] = ['PURG', '4', 'TORY'];
const wPre  = ctx.measureText(pre).width;
const wFour = ctx.measureText(four).width;
const wPost = ctx.measureText(post).width;

let x = W / 2 - (wPre + wFour + wPost) / 2;
ctx.fillStyle = PAPER;
ctx.fillText(pre, x, BASE_Y);
x += wPre;

const m = ctx.measureText(four);
const capH = m.actualBoundingBoxAscent;
ctx.fillStyle = STAMP_BRIGHT;
ctx.fillText(four, x, BASE_Y);

ctx.save();
ctx.translate(x + wFour / 2, BASE_Y - capH / 2);
ctx.rotate(-8 * Math.PI / 180);
ctx.strokeStyle = STAMP;
ctx.lineWidth = 2.5;
ctx.beginPath();
ctx.ellipse(0, 0, wFour / 2 + FS * 0.21, capH / 2 + FS * 0.13, 0, 0, Math.PI * 2);
ctx.stroke();
ctx.restore();

x += wFour;
ctx.fillStyle = PAPER;
ctx.fillText(post, x, BASE_Y);

// Tagline — sans, rol de cuerpo
ctx.textAlign = 'center';
ctx.textBaseline = 'top';
ctx.fillStyle = DIM;
ctx.font = '26px sans-serif';
ctx.fillText('Donde las historias no mueren, solo arden.', W / 2, 400);

// URL — mono, rol de metadata
ctx.fillStyle = DIM;
ctx.font = '18px monospace';
ctx.fillText('PURG4T0RY.COM', W / 2, 520);

fs.mkdirSync('static/img', { recursive: true });
fs.writeFileSync('static/img/og-image.png', canvas.toBuffer('image/png'));
console.log('og-image.png generada (1200x630)');
