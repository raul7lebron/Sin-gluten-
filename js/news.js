let newsItems = [];

// El título, la fuente, el resumen, el enlace y la imagen de cada noticia
// vienen tal cual de feeds RSS externos (Google Noticias, la Asociación de
// Celiacos) que no controlamos: un titular con "<", "&" o comillas rompía el
// HTML de la tarjeta (y a veces el de las siguientes) al insertarse sin
// escapar. Se escapa todo antes de montar la plantilla.
function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function formatNewsDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

function renderNewsCard(item) {
  const dateHtml = formatNewsDate(item.pubDate) ? `<span class="news-date">${escapeHtml(formatNewsDate(item.pubDate))}</span>` : "";
  const link = escapeHtml(item.link);
  const imageHtml = item.image
    ? `<div class="news-image"><img src="${escapeHtml(item.image)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('.news-image').remove()" /></div>`
    : "";
  return `
    <article class="news-card">
      ${imageHtml}
      <div class="news-body">
        <div class="news-meta">
          <span class="news-source">${escapeHtml(item.source)}</span>
          ${dateHtml}
        </div>
        <h3 class="news-title"><a href="${link}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a></h3>
        ${item.summary ? `<p class="news-summary">${escapeHtml(item.summary)}</p>` : ""}
        <a class="news-link" href="${link}" target="_blank" rel="noopener noreferrer">Leer noticia completa ↗</a>
      </div>
    </article>
  `;
}


async function loadNews() {
  const grid = document.getElementById("newsGrid");
  const empty = document.getElementById("newsEmpty");
  const gridHome = document.getElementById("newsGridHome");
  const emptyHome = document.getElementById("newsEmptyHome");
  if (!grid) return;

  try {
    const res = await fetch("data/news.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];

    if (items.length === 0) {
      grid.innerHTML = "";
      empty.hidden = false;
      if (gridHome) gridHome.innerHTML = "";
      if (emptyHome) emptyHome.hidden = false;
      return;
    }

    grid.innerHTML = items.map(renderNewsCard).join("");
    empty.hidden = true;
    newsItems = items;

    // Extracto de portada: solo las 3 noticias más recientes.
    if (gridHome) {
      gridHome.innerHTML = items.slice(0, 3).map(renderNewsCard).join("");
      if (emptyHome) emptyHome.hidden = true;
    }
  } catch (err) {
    grid.innerHTML = "";
    empty.hidden = false;
    if (gridHome) gridHome.innerHTML = "";
    if (emptyHome) emptyHome.hidden = false;
  }
}

window.__newsRenderPromise = loadNews();
