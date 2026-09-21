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
    alimento: "Valor nutricional",
    tienda: "Tienda especializada",
    restaurante: "Restaurante",
    noticia: "Noticia",
    guia: "Guía",
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
      const toggleBtn = el.querySelector(".recipe-toggle");
      if (toggleBtn && !el.classList.contains("open")) toggleBtn.click();
      flashHighlight(el);
    }, 200);
  }

  function openPlanDia(objetivo, kcal, weekIdx, dayKey) {
    if (window.libreDeTrigo) window.libreDeTrigo.activateTab("dietas");
    closeModal();
    setTimeout(() => {
      const objetivoChip = document.querySelector(`#objetivoFilter [data-objetivo="${objetivo}"]`);
      if (objetivoChip) objetivoChip.click();
      setTimeout(() => {
        const kcalChip = document.querySelector(`#calorieFilter [data-kcal="${kcal}"]`);
        if (kcalChip) kcalChip.click();
        setTimeout(() => {
          const semanaChip = document.querySelector(`#semanaFilter [data-semana="${weekIdx}"]`);
          if (semanaChip) semanaChip.click();
          setTimeout(() => {
            const cards = Array.from(document.querySelectorAll("#planDiasList .recipe-card"));
            const card = cards.find((c) => c.dataset.title === dayKey);
            if (!card) return;
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            const toggleBtn = card.querySelector(".recipe-toggle");
            if (toggleBtn && !card.classList.contains("open")) toggleBtn.click();
            flashHighlight(card);
          }, 150);
        }, 150);
      }, 150);
    }, 200);
  }

  function buildIndex() {
    const items = [];

    Array.from(document.querySelectorAll("#guiaList .guide-card")).forEach((card) => {
      const title = card.querySelector("h3")?.textContent || "";
      const category = card.querySelector(".guide-category")?.textContent || "";
      const summary = card.querySelector("p")?.textContent || "";
      items.push({
        type: "guia",
        title,
        snippet: category,
        haystack: [title, category, summary].join(" ").toLowerCase(),
        action: () => {
          window.location.href = card.href;
        },
      });
    });

    (typeof recetas !== "undefined" ? recetas : []).forEach((r) => {
      items.push({
        type: "receta",
        title: r.title,
        snippet: r.meta,
        haystack: [r.title, r.meta, ...(r.ingredientes || [])].join(" ").toLowerCase(),
        action: () => openCard("recetas", ".recipe-card", r.title),
      });
    });

    Object.entries(typeof planesPorObjetivo !== "undefined" ? planesPorObjetivo : {}).forEach(([objetivoKey, objetivo]) => {
      Object.entries(objetivo.planes).forEach(([kcal, plan]) => {
        plan.semanas.forEach((semana, weekIdx) => {
          semana.dias.forEach((d) => {
            const resumenComidas = d.comidas.map((c) => c.text).join(" ");
            items.push({
              type: "dieta",
              title: `${d.dia} · ${semana.titulo} · ${objetivo.label} · ${plan.label}`,
              snippet: d.comidas[2] ? d.comidas[2].text : "",
              haystack: [d.dia, semana.titulo, objetivo.label, plan.label, resumenComidas].join(" ").toLowerCase(),
              action: () => openPlanDia(objetivoKey, kcal, weekIdx, d.dayKey),
            });
          });
        });
      });
    });

    (typeof alimentosNutricion !== "undefined" ? alimentosNutricion : []).forEach((item) => {
      items.push({
        type: "alimento",
        title: item.nombre,
        snippet: `${item.kcal} kcal · ${item.proteinas} g proteínas por 100 g`,
        haystack: [item.nombre, item.categoria].join(" ").toLowerCase(),
        action: () => {
          if (window.libreDeTrigo) window.libreDeTrigo.activateTab("nutricion");
          closeModal();
          setTimeout(() => {
            const todosChip = document.querySelector('#nutriFilter [data-categoria="todos"]');
            if (todosChip) todosChip.click();
            setTimeout(() => {
              const rows = Array.from(document.querySelectorAll("#nutriTableBody tr"));
              const row = rows.find((r) => {
                const shoppable = r.querySelector(".shoppable");
                return shoppable && shoppable.dataset.shopText === item.nombre;
              });
              if (!row) return;
              row.scrollIntoView({ behavior: "smooth", block: "center" });
              flashHighlight(row);
            }, 150);
          }, 200);
        },
      });
    });

    (typeof tiendasEspecializadas !== "undefined" ? tiendasEspecializadas : []).forEach((t) => {
      items.push({
        type: "tienda",
        title: t.nombre,
        snippet: `${t.ciudad} · ${t.tipo}`,
        haystack: [t.nombre, t.ciudad, t.tipo, t.desc].join(" ").toLowerCase(),
        action: () => openCard("tiendas", ".shop-card", t.nombre),
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
