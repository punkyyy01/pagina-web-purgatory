const { createCanvas } = require('canvas');
const fs = require('fs');

const W = 1200, H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Fondo
ctx.fillStyle = '#050b0b';
ctx.fillRect(0, 0, W, H);

// Glow radial
const glow = ctx.createRadialGradient(W/2, H/2, 60, W/2, H/2, 520);
glow.addColorStop(0, 'rgba(13,138,128,0.30)');
glow.addColorStop(1, 'rgba(13,138,128,0)');
ctx.fillStyle = glow;
ctx.fillRect(0, 0, W, H);

// Borde
ctx.strokeStyle = 'rgba(61,232,218,0.30)';
ctx.lineWidth = 2;
ctx.strokeRect(24, 24, W - 48, H - 48);

function diamond(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-size/2, -size/2, size, size);
  ctx.restore();
}

// Esquinas
const d = '#3de8da', ds = 8;
diamond(36 + ds, 36 + ds, ds * 2, d);
diamond(W - 36 - ds, 36 + ds, ds * 2, d);
diamond(36 + ds, H - 36 - ds, ds * 2, d);
diamond(W - 36 - ds, H - 36 - ds, ds * 2, d);

// Diamante central grande
diamond(W/2, 180, 28, '#3de8da');

// Título
ctx.fillStyle = '#deeeed';
ctx.font = 'bold 88px serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'top';
ctx.fillText('PURG4TORY', W/2, 248);

// Línea separadora
ctx.strokeStyle = 'rgba(61,232,218,0.5)';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(W/2 - 60, 356);
ctx.lineTo(W/2 + 60, 356);
ctx.stroke();

// Tagline
ctx.fillStyle = 'rgba(222,238,237,0.65)';
ctx.font = '26px sans-serif';
ctx.fillText('Donde las historias no mueren, solo arden.', W/2, 376);

// URL
ctx.fillStyle = '#3de8da';
ctx.font = '18px sans-serif';
ctx.fillText('purg4t0ry.com', W/2, 556);

fs.mkdirSync('static/img', { recursive: true });
fs.writeFileSync('static/img/og-image.png', canvas.toBuffer('image/png'));
console.log('og-image.png generada (1200x630)');
