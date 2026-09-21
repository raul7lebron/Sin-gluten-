// Buscador para las páginas estáticas de guía y receta (fuera de la SPA de
// index.html). A diferencia de js/search.js, no busca en todo el sitio (eso
// exigiría cargar aquí los ~200 KB de js/data.js con dietas, tabla
// nutricional, tiendas, restaurantes y noticias, solo para poder buscar
// desde una página de artículo). En su lugar consulta data/search-index.json,
// un índice ligero con solo guías y recetas, generado por prerender.js.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("searchToggle");
  const overlay = document.getElementById("searchOverlay");
  const input = document.getElementById("searchModalInput");
  const resultsEl = document.getElementById("searchModalResults");
  const closeBtn = document.getElementById("searchModalClose");
  if (!toggle || !overlay || !input || !resultsEl || !closeBtn) return;

  const TYPE_LABELS = { guia: "Guía", receta: "Receta" };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  let index = null;
  let indexPromise = null;
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch("https://www.libredetrigo.com/data/search-index.json")
        .then((res) => res.json())
        .then((data) => {
          index = data;
          return data;
        })
        .catch(() => {
          index = [];
          return index;
        });
    }
    return indexPromise;
  }

  function renderResults(matches, query) {
    if (matches.length === 0) {
      resultsEl.innerHTML = `<p class="search-empty">Sin resultados para «${escapeHtml(query)}».</p>`;
      return;
    }
    resultsEl.innerHTML = matches
      .map(
        (m) => `
        <a class="search-result" href="${m.url}">
          <span class="search-result-type">${TYPE_LABELS[m.type] || m.type}</span>
          <span class="search-result-title">${escapeHtml(m.title)}</span>
          ${m.snippet ? `<span class="search-result-snippet">${escapeHtml(m.snippet)}</span>` : ""}
        </a>
      `
      )
      .join("");
  }

  let debounceTimer;
  function runSearch() {
    const query = input.value.trim().toLowerCase();
    if (query.length < 2) {
      resultsEl.innerHTML = query.length === 0 ? "" : `<p class="search-hint">Escribe al menos 2 caracteres…</p>`;
      return;
    }
    loadIndex().then((items) => {
      const matches = items.filter((item) => item.haystack.includes(query)).slice(0, 30);
      renderResults(matches, input.value.trim());
    });
  }

  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 150);
  });

  function onKeydown(event) {
    if (event.key === "Escape") closeModal();
  }

  function openModal() {
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("open"));
    input.value = "";
    resultsEl.innerHTML = "";
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeydown);
    setTimeout(() => input.focus(), 50);
    loadIndex();
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    setTimeout(() => {
      overlay.hidden = true;
    }, 200);
  }

  toggle.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });
});
