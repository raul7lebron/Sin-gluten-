// Script de un solo uso para inspeccionar la estructura real de una página (p. ej. la
// categoría "sin gluten" de un supermercado) antes de escribir un parser de verdad.
// Uso: node scripts/debug-fetch.js "<url>"
// Se ejecuta vía GitHub Actions (workflow_dispatch) porque este entorno de desarrollo no
// tiene salida a internet a dominios arbitrarios (mismo motivo por el que fetch-news.js
// solo se pudo depurar viendo los logs de Actions, no en local).
const url = process.argv[2];
if (!url) {
  console.error('Uso: node scripts/debug-fetch.js "<url>"');
  process.exit(1);
}

async function main() {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
    redirect: 'follow',
  });
  console.log('STATUS:', res.status, res.statusText);
  console.log('FINAL URL:', res.url);
  console.log('CONTENT-TYPE:', res.headers.get('content-type'));

  const html = await res.text();
  console.log('LONGITUD HTML:', html.length);

  // Busca bloques de datos embebidos habituales en tiendas online modernas (Next.js,
  // Nuxt, JSON-LD de producto) que suelen llevar precio y nombre en JSON, más fácil de
  // parsear que HTML suelto.
  const markers = ['__NEXT_DATA__', '__NUXT__', 'application/ld+json', 'window.__INITIAL_STATE__', 'window.dataLayer'];
  markers.forEach((m) => {
    const idx = html.indexOf(m);
    console.log(`Contiene "${m}":`, idx !== -1, idx !== -1 ? `(pos ${idx})` : '');
  });

  console.log('--- PRIMEROS 3000 CARACTERES ---');
  console.log(html.slice(0, 3000));

  console.log('--- BLOQUE ALREDEDOR DE __NEXT_DATA__ (si existe) ---');
  const nextIdx = html.indexOf('__NEXT_DATA__');
  if (nextIdx !== -1) {
    console.log(html.slice(nextIdx, nextIdx + 4000));
  }

  console.log('--- BLOQUE ALREDEDOR DE ld+json (si existe) ---');
  const ldIdx = html.indexOf('application/ld+json');
  if (ldIdx !== -1) {
    console.log(html.slice(Math.max(0, ldIdx - 100), ldIdx + 3000));
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('ERROR:', err);
    process.exit(1);
  });
