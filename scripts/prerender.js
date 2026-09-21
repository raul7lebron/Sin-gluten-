// Genera index.html a partir de index.template.html "horneando" dentro del HTML el
// contenido real que normalmente construye JavaScript en el navegador (recetas,
// categorías de supermercado, restaurantes, tiendas, planes de dieta y noticias).
//
// Por qué: sin esto, cualquier buscador o herramienta que no ejecute JavaScript ve
// el HTML crudo con los contenedores vacíos (<div id="newsGrid"></div>, etc.) y solo
// los textos de "no hay datos" que existen como plantilla — la web entera es
// invisible para ese tipo de lectores. Este script ejecuta el mismo código que corre
// en el navegador (data.js, render.js, news.js, script.js, search.js) dentro de un
// DOM simulado (jsdom) y guarda el resultado ya "revelado" como index.html.
//
// El sitio sigue siendo 100% estático: index.html generado carga los mismos <script>
// que antes, así que en un navegador real todo se vuelve a renderizar con JS
// exactamente igual (y queda interactivo) — este paso solo mejora lo que ve un
// lector sin JS o la primera pintura antes de que cargue el JS.
//
// index.html se genera siempre a partir de index.template.html: no lo edites a mano,
// edita la plantilla y vuelve a ejecutar "npm run prerender".
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const TEMPLATE_PATH = path.join(ROOT, 'index.template.html');
const OUTPUT_PATH = path.join(ROOT, 'index.html');
const NEWS_PATH = path.join(ROOT, 'data', 'news.json');
const SITE_URL = 'https://www.libredetrigo.com';

// URLs indexables reales del sitio. Se amplía a mano según se crean páginas
// estáticas nuevas (ver scripts/build-guias.js para las páginas de guías).
const SITEMAP_PAGES = [{ path: '/', changefreq: 'daily', priority: '1.0' }];

// Orden exacto en el que se cargan en el navegador real (ver index.template.html).
const CONTENT_SCRIPTS = ['js/data.js', 'js/render.js', 'js/news.js', 'js/script.js', 'js/search.js'];

async function main() {
  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  const dom = new JSDOM(templateHtml, {
    url: 'https://www.libredetrigo.com/',
    // "outside-only": no ejecuta automáticamente los <script src="..."> del HTML
    // (evita que jsdom intente descargar Google Fonts, el CDN de ZXing, etc.);
    // solo permite ejecutar código explícitamente vía window.eval(), que es lo que
    // hacemos abajo con el código ya leído del disco.
    runScripts: 'outside-only',
  });
  const { window } = dom;

  // news.js usa fetch("data/news.json"); en el navegador es una petición HTTP real,
  // aquí simplemente leemos el archivo del disco.
  window.fetch = async (url) => {
    if (String(url).includes('news.json')) {
      const raw = fs.readFileSync(NEWS_PATH, 'utf8');
      return { ok: true, status: 200, json: async () => JSON.parse(raw) };
    }
    throw new Error(`[prerender] fetch no soportado para "${url}"`);
  };

  // Se concatenan y se ejecutan en una sola llamada a eval: cada archivo declara sus
  // funciones/datos con "const"/"function" de nivel superior, y jsdom no comparte ese
  // ámbito léxico entre llamadas a window.eval() independientes (aunque el spec de
  // eval indirecto sí lo permitiría en un navegador real) — juntarlo todo en un único
  // eval evita el problema sin cambiar el código real de cada script.
  const combinedCode = CONTENT_SCRIPTS.map((rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8')).join('\n;\n');
  window.eval(combinedCode);

  // script.js y search.js registran su lógica en el evento DOMContentLoaded, que ya
  // se disparó (sin oyentes) al analizar el HTML inicial, antes de que estos scripts
  // existieran — lo volvemos a disparar a mano para que se ejecuten ahora.
  window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true, cancelable: true }));

  // loadNews() es async (hace el fetch simulado arriba); esperamos a que termine
  // para que las tarjetas de noticias queden en el HTML final.
  if (window.__newsRenderPromise) {
    await window.__newsRenderPromise;
  }

  // Cache-busting: a cada <link>/<script> que apunte a un archivo local (css/js
  // propios, no CDNs externos) se le añade "?v=<hash del contenido>". Sin esto, un
  // navegador que ya tenga cacheado un styles.css o script antiguo puede seguir
  // usándolo aunque el HTML nuevo (con markup que depende de esos cambios) ya esté
  // desplegado, dando lugar a una mezcla incoherente de HTML nuevo + CSS/JS viejo.
  function fileHash(relPath) {
    const content = fs.readFileSync(path.join(ROOT, relPath));
    return crypto.createHash('md5').update(content).digest('hex').slice(0, 10);
  }

  function addCacheBusting(selector, attr) {
    window.document.querySelectorAll(selector).forEach((el) => {
      const value = el.getAttribute(attr);
      if (!value || /^https?:\/\//.test(value)) return;
      const relPath = value.split('?')[0];
      if (!fs.existsSync(path.join(ROOT, relPath))) return;
      el.setAttribute(attr, `${relPath}?v=${fileHash(relPath)}`);
    });
  }

  addCacheBusting('link[rel="stylesheet"]', 'href');
  addCacheBusting('script[src]', 'src');

  const generatedNotice = `<!-- Generado automáticamente por scripts/prerender.js a partir de index.template.html. No edites este archivo a mano: los cambios se perderán en la próxima ejecución de "npm run prerender". -->\n`;
  const html = generatedNotice + dom.serialize();
  fs.writeFileSync(OUTPUT_PATH, `${html}\n`);
  console.log(`[prerender] index.html generado (${(html.length / 1024).toFixed(0)} KB) a partir de index.template.html`);

  writeSitemap();

  window.close();
}

// sitemap.xml con fecha de build real, para que lastmod no quede desactualizado.
function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urlsXml = SITEMAP_PAGES.map(
    (p) => `  <url>\n    <loc>${SITE_URL}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  ).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
  console.log(`[prerender] sitemap.xml generado con ${SITEMAP_PAGES.length} URL(s)`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[prerender] error:', err);
    process.exit(1);
  });
