// Genera páginas estáticas reales (una URL propia por receta) a partir de las
// recetas que ya existen como datos en js/data.js (la misma información que
// alimenta la pestaña "Recetas" de la SPA). Por qué: igual que las guías
// (ver build-guias.js), una receta sin URL propia no puede posicionar en
// búsquedas concretas ("receta tortilla de patatas sin gluten"). Cada receta
// se publica en /recetas/<slug>/, con su propio title/description/canonical,
// breadcrumbs y JSON-LD Recipe (solo con los datos reales que ya existen:
// nunca se inventan tiempos, raciones ni valoraciones).
//
// No genera su propia copia de los datos: recibe el array `recetas` ya
// cargado (ver prerender.js, que lo obtiene ejecutando js/data.js) para que
// los 39 platos sigan viviendo en un único sitio.
//
// No edites los .html generados a mano: vuelve a ejecutar "npm run prerender"
// después de cambiar js/data.js.
const { SITE_URL, escapeHtml, fileHash, headerHtml, footerHtml, adsenseHeadHtml, writeFile } = require("./site-layout.js");

const TODAY = new Date().toISOString().slice(0, 10);
const RECETAS_PATH = "/recetas/";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
function formatDateEs(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}
const UPDATED_LABEL = formatDateEs(TODAY);

function urlFor(receta) {
  return `${RECETAS_PATH}${receta.slug}/`;
}

// Extrae de "meta" (p. ej. "~320 kcal · 35 min · Para 4 personas") los campos
// estructurados que sí podemos afirmar con datos reales, para el JSON-LD.
// Si algún patrón no encaja, ese campo simplemente se omite (nunca se rellena
// con un valor inventado).
function parseMeta(meta) {
  const kcalMatch = meta.match(/~?(\d+)\s*kcal/i);
  const minMatch = meta.match(/(\d+)\s*min/i);
  const yieldMatch = meta.match(/Para\s+(\d+)\s+([a-záéíóúñ]+)/i);
  return {
    calories: kcalMatch ? `${kcalMatch[1]} kcal` : null,
    totalTimeIso: minMatch ? `PT${minMatch[1]}M` : null,
    recipeYield: yieldMatch ? `${yieldMatch[1]} ${yieldMatch[2]}` : null,
  };
}

function descriptionFor(receta) {
  return `Receta sin gluten de ${receta.title.toLowerCase()}, explicada paso a paso con ingredientes y tiempo de preparación. ${receta.meta}.`;
}

function breadcrumbsHtml(receta) {
  const items = [
    { label: "Inicio", url: `${SITE_URL}/` },
    { label: "Recetas", url: `${SITE_URL}${RECETAS_PATH}` },
    { label: receta.title, url: null },
  ];
  const linksHtml = items
    .map((item, i) => {
      const isLast = i === items.length - 1;
      const crumb = isLast
        ? `<span aria-current="page">${escapeHtml(item.label)}</span>`
        : `<a href="${item.url}">${escapeHtml(item.label)}</a>`;
      return i === 0 ? crumb : `<span class="breadcrumb-sep" aria-hidden="true">/</span>${crumb}`;
    })
    .join(" ");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.url || `${SITE_URL}${urlFor(receta)}`,
    })),
  };

  return { linksHtml, breadcrumbJsonLd };
}

// "También puede interesarte": las 3 recetas siguientes en la lista (circular).
// No hay categorías en los datos, así que se usa el orden de la lista en vez
// de inventar una relación temática entre platos.
function relatedHtml(receta, recetas) {
  const idx = recetas.findIndex((r) => r.slug === receta.slug);
  const related = [1, 2, 3].map((offset) => recetas[(idx + offset) % recetas.length]);
  const cards = related
    .map(
      (r) => `
        <a class="guide-card" href="${SITE_URL}${urlFor(r)}">
          <span class="guide-category">${r.icon} Receta</span>
          <h3>${escapeHtml(r.title)}</h3>
          <p>${escapeHtml(r.meta)}</p>
        </a>`
    )
    .join("");
  return `
    <div class="related-section">
      <h2>También puede interesarte</h2>
      <div class="guide-grid">${cards}</div>
    </div>`;
}

function buildRecetaPage(receta, recetas) {
  const urlPath = urlFor(receta);
  const canonicalUrl = `${SITE_URL}${urlPath}`;
  const cssHash = fileHash("css/styles.css");
  const jsHash = fileHash("js/static-page.js");
  const { linksHtml, breadcrumbJsonLd } = breadcrumbsHtml(receta);
  const description = descriptionFor(receta);
  const { calories, totalTimeIso, recipeYield } = parseMeta(receta.meta);
  const pageTitle = /gluten/i.test(receta.title) ? `${receta.title} | Libre de Trigo` : `${receta.title} (receta sin gluten) | Libre de Trigo`;

  const recipeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: receta.title,
    description,
    url: canonicalUrl,
    inLanguage: "es-ES",
    author: { "@type": "Organization", name: "Libre de Trigo", url: `${SITE_URL}/` },
    recipeIngredient: receta.ingredientes,
    recipeInstructions: receta.pasos.map((paso) => ({ "@type": "HowToStep", text: paso })),
    ...(totalTimeIso ? { totalTime: totalTimeIso } : {}),
    ...(recipeYield ? { recipeYield } : {}),
    ...(calories ? { nutrition: { "@type": "NutritionInformation", calories } } : {}),
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="#1f4a43" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Libre de Trigo" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" type="image/png" href="${SITE_URL}/img/favicon.png" />
  <script type="application/ld+json">
${JSON.stringify(recipeJsonLd, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbJsonLd, null, 2)}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${SITE_URL}/css/styles.css?v=${cssHash}" />
  ${adsenseHeadHtml()}
</head>
<body>${headerHtml()}
  <main class="container article-page">
    <nav class="breadcrumbs" aria-label="Migas de pan">${linksHtml}</nav>

    <span class="eyebrow">${receta.icon} Receta</span>
    <h1 class="section-title">${escapeHtml(receta.title)}</h1>
    <p class="article-lead">${escapeHtml(receta.meta)}</p>
    <p class="article-meta">Actualizado: ${UPDATED_LABEL}</p>

    <div class="article-body legal-content">
      <h2>Ingredientes</h2>
      <ul>${receta.ingredientes.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
      <h2>Preparación</h2>
      <ol>${receta.pasos.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ol>
    </div>

    ${relatedHtml(receta, recetas)}
  </main>${footerHtml()}
  <script src="${SITE_URL}/js/analytics.js?v=${fileHash("js/analytics.js")}"></script>
  <script src="${SITE_URL}/js/static-page.js?v=${jsHash}"></script>
</body>
</html>
`;
}

function buildHubPage(recetas) {
  const canonicalUrl = `${SITE_URL}${RECETAS_PATH}`;
  const cssHash = fileHash("css/styles.css");
  const jsHash = fileHash("js/static-page.js");
  const description = `${recetas.length} recetas sin gluten explicadas paso a paso, con ingredientes y tiempo de preparación.`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Recetas", item: canonicalUrl },
    ],
  };

  const cards = recetas
    .map(
      (r) => `
        <a class="guide-card" href="${SITE_URL}${urlFor(r)}">
          <span class="guide-category">${r.icon} Receta</span>
          <h3>${escapeHtml(r.title)}</h3>
          <p>${escapeHtml(r.meta)}</p>
        </a>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recetas sin gluten | Libre de Trigo</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="#1f4a43" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Libre de Trigo" />
  <meta property="og:title" content="Recetas sin gluten | Libre de Trigo" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" type="image/png" href="${SITE_URL}/img/favicon.png" />
  <script type="application/ld+json">
${JSON.stringify(breadcrumbJsonLd, null, 2)}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${SITE_URL}/css/styles.css?v=${cssHash}" />
  ${adsenseHeadHtml()}
</head>
<body>${headerHtml()}
  <main class="container article-page">
    <nav class="breadcrumbs" aria-label="Migas de pan">
      <a href="${SITE_URL}/">Inicio</a> <span class="breadcrumb-sep" aria-hidden="true">/</span> <span aria-current="page">Recetas</span>
    </nav>

    <span class="eyebrow">Recetas</span>
    <h1 class="section-title">Recetas sin gluten</h1>
    <p class="article-lead">${escapeHtml(description)}</p>

    <div class="guide-grid hub-grid">${cards}</div>
  </main>${footerHtml()}
  <script src="${SITE_URL}/js/analytics.js?v=${fileHash("js/analytics.js")}"></script>
  <script src="${SITE_URL}/js/static-page.js?v=${jsHash}"></script>
</body>
</html>
`;
}

function main(recetas) {
  if (!Array.isArray(recetas) || recetas.length === 0) {
    throw new Error("[build-recetas] no se recibió el array de recetas (revisa prerender.js).");
  }
  const withoutSlug = recetas.filter((r) => !r.slug);
  if (withoutSlug.length > 0) {
    throw new Error(`[build-recetas] ${withoutSlug.length} receta(s) sin "slug" en js/data.js: ${withoutSlug.map((r) => r.title).join(", ")}`);
  }

  recetas.forEach((receta) => {
    writeFile(urlFor(receta), buildRecetaPage(receta, recetas));
  });
  writeFile(RECETAS_PATH, buildHubPage(recetas));

  const allUrls = recetas.map(urlFor).concat([RECETAS_PATH]);
  console.log(`[build-recetas] ${recetas.length} páginas de receta + 1 página-índice generadas (${allUrls.length} URLs).`);
  return allUrls;
}

module.exports = { main, urlFor };
