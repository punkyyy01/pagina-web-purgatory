'use strict';
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'static', 'fonts');
if (!fs.existsSync(FONTS_DIR)) fs.mkdirSync(FONTS_DIR, { recursive: true });

function get(url, headers) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(get(res.headers.location, headers));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const REQUESTS = [
  {
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
    prefix: 'inter'
  },
  {
    url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&display=swap',
    prefix: 'cormorant'
  },
  {
    url: 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap',
    prefix: 'unifraktur'
  },
  {
    url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap',
    prefix: 'jetbrains-mono'
  }
];

function parseFontFaces(css) {
  const blocks = css.match(/@font-face\s*\{[^}]+\}/g) || [];
  return blocks.map(block => {
    const src     = (block.match(/src:\s*url\(([^)]+)\)/) || [])[1] || '';
    const family  = (block.match(/font-family:\s*['"]?([^;'"]+)['"]?/) || [])[1] || '';
    const style   = (block.match(/font-style:\s*(\w+)/)   || [])[1] || 'normal';
    const weight  = (block.match(/font-weight:\s*(\d+)/)  || [])[1] || '400';
    return { src, family, style, weight };
  }).filter(f => f.src.startsWith('https://'));
}

async function main() {
  const fontFaceCss = [];

  for (const req of REQUESTS) {
    console.log(`\nFetching CSS for ${req.prefix}…`);
    const css    = (await get(req.url, { 'User-Agent': UA })).toString();
    const faces  = parseFontFaces(css);
    console.log(`  → ${faces.length} font-face(s) encontradas`);

    for (const face of faces) {
      const safeName = `${req.prefix}-${face.weight}${face.style === 'italic' ? '-italic' : ''}.woff2`;
      const outPath  = path.join(FONTS_DIR, safeName);

      console.log(`  Descargando ${safeName}…`);
      const buf = await get(face.src, { 'User-Agent': UA });
      fs.writeFileSync(outPath, buf);
      console.log(`  ✓ ${safeName} (${(buf.length / 1024).toFixed(1)} KB)`);

      fontFaceCss.push(
`@font-face {
  font-family: '${face.family}';
  font-style: ${face.style};
  font-weight: ${face.weight};
  font-display: swap;
  src: url('../fonts/${safeName}') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
                 U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}`
      );
    }
  }

  const cssOut = path.join(__dirname, '..', 'static', 'css', 'fonts.css');
  fs.writeFileSync(cssOut, fontFaceCss.join('\n\n') + '\n');
  console.log(`\n✓ fonts.css generado con ${fontFaceCss.length} @font-face rules`);
  console.log('✓ Listo. Ahora actualizar los HTML para usar static/css/fonts.css');
}

main().catch(err => { console.error(err); process.exit(1); });
