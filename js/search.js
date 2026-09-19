document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("searchToggle");
  const overlay = document.getElementById("searchOverlay");
  const input = document.getElementById("searchModalInput");
  const resultsEl = document.getElementById("searchModalResults");
  const closeBtn = document.getElementById("searchModalClose");
  if (!toggle || !overlay || !input || !resultsEl || !closeBtn) return;

  const TYPE_LABELS = {
    receta: "Receta",
    dieta: "Plan de dieta",
    categoria: "Supermercado",
    producto: "Producto",
    tienda: "Tienda especializada",
    restaurante: "Restaurante",
    noticia: "Noticia",
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function flashHighlight(el) {
    if (!el) return;
    el.classList.add("search-flash");
    setTimeout(() => el.classList.remove("search-flash"), 1600);
  }

  function openCard(tabId, selector, title) {
    if (window.libreDeTrigo) window.libreDeTrigo.activateTab(tabId);
    closeModal();
    setTimeout(() => {
      const candidates = Array.from(document.querySelectorAll(selector));
      const el = title ? candidates.find((c) => c.dataset.title === title) : candidates[0];
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const toggleBtn = el.querySelector(".recipe-toggle, .info-toggle");
      if (toggleBtn && !el.classList.contains("open")) toggleBtn.click();
      flashHighlight(el);
    }, 200);
  }

  function openProduct(chainKey, catTitle, productText) {
    if (window.libreDeTrigo) window.libreDeTrigo.activateTab("supermercado");
    closeModal();
    setTimeout(() => {
      const chip = document.querySelector(`#supermercadoFilter [data-super="${chainKey}"]`);
      if (chip) chip.click();
      setTimeout(() => {
        const cards = Array.from(document.querySelectorAll("#catalogoGrid .info-card"));
        const card = cards.find((c) => c.dataset.title === catTitle);
        if (!card) return;
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        const toggleBtn = card.querySelector(".info-toggle");
        if (toggleBtn && !card.classList.contains("open")) toggleBtn.click();
        setTimeout(() => {
          const lis = Array.from(card.querySelectorAll(".info-product-list li"));
          const li = lis.find((x) => x.textContent === productText);
          flashHighlight(li || card);
          if (li) li.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 400);
      }, 150);
    }, 200);
  }

  function buildIndex() {
    const items = [];

    (typeof recetas !== "undefined" ? recetas : []).forEach((r) => {
      items.push({
        type: "receta",
        title: r.title,
        snippet: r.meta,
        haystack: [r.title, r.meta, ...(r.ingredientes || [])].join(" ").toLowerCase(),
        action: () => openCard("recetas", ".recipe-card", r.title),
      });
    });

    [
      typeof dietas !== "undefined" ? dietas : [],
      typeof dietasMusculo !== "undefined" ? dietasMusculo : [],
      typeof dietasMantenimiento !== "undefined" ? dietasMantenimiento : [],
      typeof dietasDigestion !== "undefined" ? dietasDigestion : [],
    ].forEach((list) => {
      list.forEach((d) => {
        items.push({
          type: "dieta",
          title: d.title,
          snippet: d.meta,
          haystack: [d.title, d.meta].join(" ").toLowerCase(),
          action: () => {
            const todos = document.querySelector('#dietGoalFilter [data-goal="todos"]');
            if (todos) todos.click();
            openCard("dietas", ".recipe-card.diet-card", d.title);
          },
        });
      });
    });

    (typeof supermercadoCategories !== "undefined" ? supermercadoCategories : []).forEach((cat) => {
      items.push({
        type: "categoria",
        title: cat.title,
        snippet: cat.text,
        haystack: [cat.title, cat.text, ...(cat.productos || [])].join(" ").toLowerCase(),
        action: () => openCard("supermercado", "#supermercadoGrid .info-card", cat.title),
      });
    });

    Object.entries(typeof supermercadosCatalogo !== "undefined" ? supermercadosCatalogo : {}).forEach(([key, cadena]) => {
      Object.entries(cadena.categorias).forEach(([catTitle, productos]) => {
        productos.forEach((p) => {
          items.push({
            type: "producto",
            title: p,
            snippet: `${cadena.label} · ${catTitle}`,
            haystack: `${p} ${cadena.label} ${catTitle}`.toLowerCase(),
            action: () => openProduct(key, catTitle, p),
          });
        });
      });
    });

    (typeof tiendasEspecializadas !== "undefined" ? tiendasEspecializadas : []).forEach((t) => {
      items.push({
        type: "tienda",
        title: t.nombre,
        snippet: `${t.ciudad} · ${t.tipo}`,
        haystack: [t.nombre, t.ciudad, t.tipo, t.desc].join(" ").toLowerCase(),
        action: () => openCard("supermercado", ".shop-card", t.nombre),
      });
    });

    Object.entries(typeof restaurantesPorCiudad !== "undefined" ? restaurantesPorCiudad : {}).forEach(([key, ciudad]) => {
      ciudad.restaurantes.forEach((r) => {
        items.push({
          type: "restaurante",
          title: r.nombre,
          snippet: `${ciudad.label} · ${r.zona}`,
          haystack: [r.nombre, ciudad.label, r.zona, r.desc].join(" ").toLowerCase(),
          action: () => {
            const chip = document.querySelector(`#ciudadFilter [data-ciudad="${key}"]`);
            if (chip) chip.click();
            openCard("restaurantes", ".rank-card", r.nombre);
          },
        });
      });
    });

    (typeof newsItems !== "undefined" ? newsItems : []).forEach((n) => {
      items.push({
        type: "noticia",
        title: n.title,
        snippet: n.source,
        haystack: [n.title, n.summary, n.source].join(" ").toLowerCase(),
        action: () => window.open(n.link, "_blank", "noopener,noreferrer"),
      });
    });

    return items;
  }

  function renderResults(matches, query) {
    if (matches.length === 0) {
      resultsEl.innerHTML = `<p class="search-empty">Sin resultados para «${escapeHtml(query)}».</p>`;
      return;
    }
    resultsEl.innerHTML = matches
      .map(
        (m, i) => `
        <button class="search-result" type="button" data-index="${i}">
          <span class="search-result-type">${TYPE_LABELS[m.type] || m.type}</span>
          <span class="search-result-title">${escapeHtml(m.title)}</span>
          ${m.snippet ? `<span class="search-result-snippet">${escapeHtml(m.snippet)}</span>` : ""}
        </button>
      `
      )
      .join("");

    Array.from(resultsEl.querySelectorAll(".search-result")).forEach((btn) => {
      btn.addEventListener("click", () => {
        const match = matches[Number(btn.dataset.index)];
        if (match && match.action) match.action();
      });
    });
  }

  let debounceTimer;
  function runSearch() {
    const query = input.value.trim().toLowerCase();
    if (query.length < 2) {
      resultsEl.innerHTML = query.length === 0 ? "" : `<p class="search-hint">Escribe al menos 2 caracteres…</p>`;
      return;
    }
    const index = buildIndex();
    const matches = index.filter((item) => item.haystack.includes(query)).slice(0, 30);
    renderResults(matches, input.value.trim());
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
