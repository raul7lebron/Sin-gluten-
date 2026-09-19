function renderTiendas() {
  const list = document.getElementById("tiendasList");
  if (!list) return;

  const tipoIcono = {
    Física: "🏬",
    Online: "💻",
    "Física y online": "🏬💻",
  };

  list.innerHTML = tiendasEspecializadas
    .map((t) => {
      const ratingHtml = t.nota
        ? `<span class="rank-rating">⭐ ${t.aprox ? "≈ " : ""}${t.nota.toFixed(1)}${t.resenas ? ` · ${t.resenas.toLocaleString("es-ES")} reseñas` : ""}</span>`
        : "";
      const linkHtml = t.web
        ? `<a class="rank-link" href="${t.web}" target="_blank" rel="noopener noreferrer">Visitar web ↗</a>`
        : `<span class="shop-noweb">Sin web oficial verificada</span>`;
      return `
        <article class="shop-card" data-title="${t.nombre}">
          <div class="rank-header">
            <h3>${t.nombre}</h3>
            ${ratingHtml}
          </div>
          <p class="rank-meta">${tipoIcono[t.tipo] || ""} ${t.tipo} · ${t.ciudad}</p>
          <p class="rank-desc">${t.desc}</p>
          ${linkHtml}
        </article>
      `;
    })
    .join("");
}

function escapeHtmlRender(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function stripAccentsRender(str) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Envuelve en <strong class="shoppable"> las palabras/frases de ingrediente reconocidas
// dentro de un texto libre (ingrediente de receta o comida de un plan de dieta), dejando
// el resto del texto tal cual. Solo esas palabras quedan en negrita y son tocables.
function highlightShoppable(text) {
  if (typeof SHOPPABLE_KEYWORDS === "undefined") return escapeHtmlRender(text);
  const normalizedText = stripAccentsRender(text).toLowerCase();
  const isWordChar = (ch) => !!ch && /[a-z0-9]/i.test(stripAccentsRender(ch));
  const matches = [];

  SHOPPABLE_KEYWORDS.forEach((kw) => {
    const normalizedKw = stripAccentsRender(kw).toLowerCase();
    let fromIndex = 0;
    for (;;) {
      const pos = normalizedText.indexOf(normalizedKw, fromIndex);
      if (pos === -1) break;
      const end = pos + normalizedKw.length;
      fromIndex = pos + 1;
      if (isWordChar(normalizedText[pos - 1]) || isWordChar(normalizedText[end])) continue;
      const overlaps = matches.some((m) => pos < m.end && end > m.start);
      if (!overlaps) matches.push({ start: pos, end });
    }
  });

  if (matches.length === 0) return escapeHtmlRender(text);

  matches.sort((a, b) => a.start - b.start);
  let html = "";
  let cursor = 0;
  matches.forEach((m) => {
    html += escapeHtmlRender(text.slice(cursor, m.start));
    const original = text.slice(m.start, m.end);
    html += `<strong class="shoppable" data-shop-text="${escapeHtmlRender(original)}">${escapeHtmlRender(original)}</strong>`;
    cursor = m.end;
  });
  html += escapeHtmlRender(text.slice(cursor));
  return html;
}

function renderRecipeCard(item, extraClass, listHtml, dataKey) {
  return `
    <div class="recipe-card ${extraClass}" data-title="${dataKey || item.title}">
      <button class="recipe-toggle" type="button" aria-expanded="false">
        <span class="recipe-icon" aria-hidden="true">${item.icon}</span>
        <span class="recipe-title">
          <strong>${item.title}</strong>
          <small>${item.meta}</small>
        </span>
        <span class="chevron">⌄</span>
      </button>
      <div class="recipe-content">
        ${listHtml}
      </div>
    </div>
  `;
}

function recetaMatches(receta, query) {
  if (!query) return true;
  const haystack = [receta.title, ...receta.ingredientes].join(" ").toLowerCase();
  return haystack.includes(query);
}

function renderRecetas(query = "") {
  const list = document.getElementById("recetasList");
  const empty = document.getElementById("recetasEmpty");
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = recetas.filter((receta) => recetaMatches(receta, normalizedQuery));

  list.innerHTML = filtered
    .map((receta) => {
      const content = `
        <h4>Ingredientes</h4>
        <ul>${receta.ingredientes.map((i) => `<li>${highlightShoppable(i)}</li>`).join("")}</ul>
        <h4>Preparación</h4>
        <ol>${receta.pasos.map((p) => `<li>${p}</li>`).join("")}</ol>
      `;
      return renderRecipeCard(receta, "", content);
    })
    .join("");

  empty.hidden = filtered.length > 0;
}

function renderCalorieFilter() {
  const chips = document.getElementById("calorieFilter");
  if (!chips) return;
  chips.innerHTML = Object.keys(planesCalorias)
    .map(
      (key, i) =>
        `<button class="filter-chip${i === 0 ? " active" : ""}" data-kcal="${key}" type="button">${planesCalorias[key].label}</button>`
    )
    .join("");
}

function renderSemanaFilter() {
  const chips = document.getElementById("semanaFilter");
  if (!chips) return;
  chips.innerHTML = [0, 1, 2, 3]
    .map((i) => `<button class="filter-chip${i === 0 ? " active" : ""}" data-semana="${i}" type="button">Semana ${i + 1}</button>`)
    .join("");
}

function renderPlanMeta(kcalKey) {
  const metaEl = document.getElementById("planMeta");
  const plan = planesCalorias[kcalKey];
  if (!metaEl || !plan) return;
  metaEl.textContent = plan.meta;
}

function renderPlanDias(kcalKey, semanaIdx) {
  const list = document.getElementById("planDiasList");
  const plan = planesCalorias[kcalKey];
  if (!list || !plan) return;
  const semana = plan.semanas[semanaIdx];
  if (!semana) return;

  list.innerHTML = semana.dias
    .map((d) => {
      const content = `
        <ul class="meal-list">
          ${d.comidas
            .map((c) => `<li><strong>${c.label}:</strong> ${highlightShoppable(c.text)}</li>`)
            .join("")}
        </ul>
      `;
      const item = { icon: "🍽️", title: d.dia, meta: `${semana.titulo} · ${plan.label}` };
      return renderRecipeCard(item, "diet-card", content, d.dayKey);
    })
    .join("");
}

function renderCiudadChips() {
  const chips = document.getElementById("ciudadFilter");
  const cityKeys = Object.keys(restaurantesPorCiudad);
  chips.innerHTML = cityKeys
    .map(
      (key, i) =>
        `<button class="filter-chip${i === 0 ? " active" : ""}" data-ciudad="${key}" type="button">${restaurantesPorCiudad[key].label}</button>`
    )
    .join("");
}

function renderRestaurantes(ciudadKey) {
  const list = document.getElementById("restaurantesList");
  const ciudad = restaurantesPorCiudad[ciudadKey];
  if (!ciudad) return;

  list.innerHTML = ciudad.restaurantes
    .map((r, i) => {
      const notaTexto = `${r.aprox ? "≈ " : ""}${r.nota.toFixed(1)}`;
      const resenasTexto = r.resenas ? `${r.resenas.toLocaleString("es-ES")} reseñas` : "nº de reseñas no confirmado";
      const mapsQuery = encodeURIComponent(`${r.nombre} ${ciudad.label}`);
      const topClass = i < 3 ? ` rank-top-${i + 1}` : "";
      return `
        <article class="rank-card" data-title="${r.nombre}">
          <span class="rank-number${topClass}">${i + 1}</span>
          <div class="rank-info">
            <div class="rank-header">
              <h3>${r.nombre}</h3>
              <span class="rank-rating">⭐ ${notaTexto}</span>
            </div>
            <p class="rank-meta">${r.zona} · ${resenasTexto}</p>
            <p class="rank-desc">${r.desc}</p>
            <a class="rank-link" href="https://www.google.com/maps/search/?api=1&query=${mapsQuery}" target="_blank" rel="noopener noreferrer">Ver en Google Maps ↗</a>
          </div>
        </article>
      `;
    })
    .join("");
}

renderTiendas();
renderRecetas();
renderCalorieFilter();
renderSemanaFilter();
renderPlanMeta(Object.keys(planesCalorias)[0]);
renderPlanDias(Object.keys(planesCalorias)[0], 0);
renderCiudadChips();
renderRestaurantes(Object.keys(restaurantesPorCiudad)[0]);
