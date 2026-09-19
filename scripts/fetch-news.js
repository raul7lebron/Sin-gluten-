const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');

const parser = new Parser({
  timeout: 20000,
  customFields: {
    item: [
      ['source', 'sourceName'],
      ['media:content', 'mediaContent', { keepArray: false }],
    ],
  },
});

// Feeds de noticias sobre gluten/celiaquía en español. Las búsquedas de
// Google News son la fuente principal (URL pública y estable para cualquier
// consulta); los feeds de asociaciones son un plus si existen, pero cada uno
// se trata de forma independiente: si uno falla, no tira abajo el resto.
const FEEDS = [
  {
    name: 'Google Noticias — celiaquía',
    url: 'https://news.google.com/rss/search?q=celiaqu%C3%ADa&hl=es-ES&gl=ES&ceid=ES:es',
  },
  {
    name: 'Google Noticias — sin gluten',
    url: 'https://news.google.com/rss/search?q=%22sin+gluten%22&hl=es-ES&gl=ES&ceid=ES:es',
  },
  {
    name: 'Google Noticias — enfermedad celíaca',
    url: 'https://news.google.com/rss/search?q=%22enfermedad+cel%C3%ADaca%22&hl=es-ES&gl=ES&ceid=ES:es',
  },
  {
    name: 'Asociación de Celiacos y Sensibles al Gluten',
    url: 'https://www.asociaciondeceliacos.org/noticias/feed/',
  },
];

const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'news.json');
const MAX_ITEMS = 24;

// Google Noticias mete el medio de origen al final del título ("Titular - El País");
// si rss-parser no capturó <source>, lo sacamos de ahí como último recurso.
function extractSource(item, feedName) {
  if (item.sourceName && typeof item.sourceName === 'string') return item.sourceName.trim();
  if (item.creator) return item.creator;
  const match = (item.title || '').match(/ - ([^-]+)$/);
  if (match && feedName.startsWith('Google Noticias')) return match[1].trim();
  return feedName;
}

function cleanTitle(item, feedName) {
  if (!feedName.startsWith('Google Noticias')) return item.title;
  return (item.title || '').replace(/ - [^-]+$/, '').trim();
}

// Cada feed trae la foto de portada de una forma distinta: media:content
// (WordPress con Yoast/RSS extendido), enclosure de tipo imagen, o el primer
// <img> incrustado en el contenido/resumen HTML. Google Noticias normalmente
// no incluye ninguna, así que esos artículos se quedan sin imagen.
function extractImage(item) {
  if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
    return item.mediaContent.$.url;
  }
  if (item.enclosure && item.enclosure.url && /^image\//.test(item.enclosure.type || '')) {
    return item.enclosure.url;
  }
  const html = item.content || item.summary || item.description || '';
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

async function fetchFeed(feed, retries = 1) {
  try {
    const parsed = await parser.parseURL(feed.url);
    return (parsed.items || [])
      .filter((item) => item.title && item.link)
      .map((item) => ({
        title: cleanTitle(item, feed.name),
        link: item.link,
        source: extractSource(item, feed.name),
        pubDate: item.pubDate || item.isoDate || null,
        summary: (item.contentSnippet || item.summary || '').slice(0, 240),
        image: extractImage(item),
        // Los artículos de Google Noticias nunca pueden conseguir una foto real (ver
        // fetchOgImage): se usa para reservar hueco a fuentes directas en la selección.
        viaGoogleNews: feed.name.startsWith('Google Noticias'),
      }));
  } catch (err) {
    if (retries > 0) return fetchFeed(feed, retries - 1);
    console.error(`[news] fallo al leer feed "${feed.name}": ${err.message}`);
    return [];
  }
}

function isGlutenRelated(item) {
  const haystack = `${item.title} ${item.summary}`.toLowerCase();
  return /(gluten|cel[ií]ac|trigo)/.test(haystack);
}

// Google Noticias casi nunca trae imagen en el propio feed RSS, así que para esos
// artículos (y cualquier otro sin imagen) intentamos sacar la foto de portada real
// visitando el enlace del artículo y leyendo su etiqueta og:image/twitter:image.
// Si falla (timeout, artículo sin esa etiqueta, bloqueo del medio, etc.) se deja sin
// imagen sin más — nunca hace fallar el resto del proceso.
//
// Ojo: los enlaces de Google Noticias (news.google.com/rss/articles/...) NO
// redirigen al medio real con una petición HTTP simple — devuelven una página de
// Google que salta al artículo real mediante JavaScript. Un fetch() normal se queda
// en esa página intermedia, cuya og:image es la MISMA genérica de Google para
// cualquier artículo. Por eso, si tras seguir redirecciones seguimos en un dominio
// de Google, descartamos la imagen en vez de aceptar ese resultado falso.
const BLOCKED_IMAGE_HOST_PATTERNS = [/(^|\.)google\.com$/i, /(^|\.)googleusercontent\.com$/i, /(^|\.)gstatic\.com$/i];

function isBlockedHost(hostname) {
  return BLOCKED_IMAGE_HOST_PATTERNS.some((re) => re.test(hostname));
}

async function fetchOgImage(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LibreDeTrigoBot/1.0; +https://www.libredetrigo.com)',
      },
    });
    if (!res.ok) return null;

    const finalUrl = new URL(res.url);
    if (isBlockedHost(finalUrl.hostname)) {
      // No se salió de Google (o similar): no llegamos al artículo real, así que
      // cualquier og:image que encontremos aquí sería la genérica, no la del medio.
      return null;
    }

    const html = await res.text();
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
    if (!match) return null;
    try {
      const imageUrl = new URL(match[1], res.url);
      if (isBlockedHost(imageUrl.hostname)) return null;
      return imageUrl.href;
    } catch (err) {
      return null;
    }
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next;
      next += 1;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function enrichMissingImages(items) {
  const enriched = await mapWithConcurrency(items, 6, async (item) => {
    if (item.image) return item;
    const image = await fetchOgImage(item.link);
    return { ...item, image };
  });

  // Red de seguridad adicional: si la misma URL de imagen aparece en 3 o más
  // artículos distintos, casi seguro es una imagen genérica (de una página
  // intermedia, un logo por defecto, etc.) y no la foto real de cada uno — se
  // descarta en vez de mostrar la misma foto en varias noticias distintas.
  const counts = new Map();
  enriched.forEach((item) => {
    if (!item.image) return;
    counts.set(item.image, (counts.get(item.image) || 0) + 1);
  });

  return enriched.map((item) => (item.image && counts.get(item.image) >= 3 ? { ...item, image: null } : item));
}

async function fetchAllNews() {
  const results = await Promise.all(FEEDS.map((feed) => fetchFeed(feed)));
  const merged = results.flat().filter(isGlutenRelated);

  const seen = new Set();
  const deduped = merged.filter((item) => {
    const key = item.link || item.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  deduped.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));

  // Los artículos de Google Noticias son mucho más numerosos y recientes que los del
  // feed directo de la Asociación de Celiacos, así que un simple "top N por fecha"
  // los deja siempre fuera — y son la única fuente que puede llevar foto real (ver
  // fetchOgImage). Se reserva un hueco mínimo para artículos de fuentes directas.
  const MIN_DIRECT_SOURCE_ITEMS = 6;
  const direct = deduped.filter((item) => !item.viaGoogleNews).slice(0, MIN_DIRECT_SOURCE_ITEMS);
  const directLinks = new Set(direct.map((item) => item.link));
  const rest = deduped.filter((item) => !directLinks.has(item.link));
  const combined = [...direct, ...rest].slice(0, MAX_ITEMS);
  combined.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));

  return combined.map(({ viaGoogleNews, ...item }) => item);
}

async function main() {
  const items = await fetchAllNews();

  if (items.length === 0) {
    console.error('[news] no se obtuvo ningún artículo válido de ningún feed; no se sobrescribe data/news.json.');
    process.exit(1);
  }

  const enriched = await enrichMissingImages(items);
  const withImage = enriched.filter((item) => item.image).length;
  console.log(`[news] ${withImage}/${enriched.length} artículos con imagen de portada`);

  const payload = {
    updatedAt: new Date().toISOString(),
    items: enriched,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2) + '\n');
  console.log(`[news] escritos ${items.length} artículos en ${OUTPUT_PATH}`);
}

main()
  .then(() => process.exit(0)) // las conexiones fetch() con keep-alive pueden dejar el
  // proceso colgado varios minutos si no se fuerza la salida al terminar bien.
  .catch((err) => {
    console.error('[news] error inesperado:', err);
    process.exit(1);
  });
