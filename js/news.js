let newsItems = [];

function formatNewsDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

function renderNewsCard(item) {
  const dateHtml = formatNewsDate(item.pubDate) ? `<span class="news-date">${formatNewsDate(item.pubDate)}</span>` : "";
  const imageHtml = item.image
    ? `<div class="news-image"><img src="${item.image}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('.news-image').remove()" /></div>`
    : "";
  return `
    <article class="news-card">
      ${imageHtml}
      <div class="news-body">
        <div class="news-meta">
          <span class="news-source">${item.source}</span>
          ${dateHtml}
        </div>
        <h3 class="news-title"><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
        ${item.summary ? `<p class="news-summary">${item.summary}</p>` : ""}
        <a class="news-link" href="${item.link}" target="_blank" rel="noopener noreferrer">Leer noticia completa ↗</a>
      </div>
    </article>
  `;
}

async function loadNews() {
  const grid = document.getElementById("newsGrid");
  const empty = document.getElementById("newsEmpty");
  if (!grid) return;

  try {
    const res = await fetch("data/news.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];

    if (items.length === 0) {
      grid.innerHTML = "";
      empty.hidden = false;
      return;
    }

    grid.innerHTML = items.map(renderNewsCard).join("");
    empty.hidden = true;
    newsItems = items;
  } catch (err) {
    grid.innerHTML = "";
    empty.hidden = false;
  }
}

window.__newsRenderPromise = loadNews();
