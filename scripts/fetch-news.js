const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');

const parser = new Parser({
  timeout: 20000,
  customFields: {
    item: [['source', 'sourceName']],
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
  return deduped.slice(0, MAX_ITEMS);
}

async function main() {
  const items = await fetchAllNews();

  if (items.length === 0) {
    console.error('[news] no se obtuvo ningún artículo válido de ningún feed; no se sobrescribe data/news.json.');
    process.exit(1);
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    items,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2) + '\n');
  console.log(`[news] escritos ${items.length} artículos en ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('[news] error inesperado:', err);
  process.exit(1);
});
