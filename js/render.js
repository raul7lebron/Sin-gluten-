function renderTiendas() {
  const listOnline = document.getElementById("tiendasListOnline");
  const listFisica = document.getElementById("tiendasListFisica");
  if (!listOnline || !listFisica) return;

  const tipoIcono = {
    Física: "🏬",
    Online: "💻",
    "Física y online": "🏬💻",
  };

  function shopCardHtml(t) {
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
  }

  // Las tiendas "Física y online" aparecen en ambas listas: es la realidad
  // de cómo operan, no hace falta forzarlas a elegir un único grupo.
  listOnline.innerHTML = tiendasEspecializadas
    .filter((t) => t.tipo === "Online" || t.tipo === "Física y online")
    .map(shopCardHtml)
    .join("");
  listFisica.innerHTML = tiendasEspecializadas
    .filter((t) => t.tipo === "Física" || t.tipo === "Física y online")
    .map(shopCardHtml)
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

// Cada receta tiene su propia página real en /recetas/<slug>/ (ver
// scripts/build-recetas.js), así que aquí solo se muestra un directorio de
// enlaces hacia ellas, igual que la pestaña "Guías" enlaza a sus páginas.
const RECETA_CATEGORIA_LABEL = {
  todas: "Todas",
  principal: "Principal",
  entrante: "Entrante",
  postre: "Postre",
};

function recetaMatchesIngrediente(receta, query) {
  if (!query) return true;
  const haystack = receta.ingredientes.join(" ").toLowerCase();
  return haystack.includes(query);
}

// Cada receta tiene su propia página real en /recetas/<slug>/ (ver
// scripts/build-recetas.js), así que aquí solo se muestra un directorio de
// enlaces hacia ellas, filtrable por tipo de plato y por ingrediente.
function renderRecetasDirectory(categoria = "todas", query = "") {
  const list = document.getElementById("recetasList");
  const empty = document.getElementById("recetasEmpty");
  if (!list) return;
  const normalizedQuery = query.trim().toLowerCase();
  const filtradas = recetas.filter(
    (r) => (categoria === "todas" || r.categoria === categoria) && recetaMatchesIngrediente(r, normalizedQuery)
  );

  list.innerHTML = filtradas
    .map(
      (receta) => `
        <a class="guide-card" href="https://www.libredetrigo.com/recetas/${receta.slug}/">
          <span class="guide-category">${receta.icon} ${RECETA_CATEGORIA_LABEL[receta.categoria] || "Receta"}</span>
          <h3>${receta.title}</h3>
          <p>${receta.meta}</p>
        </a>`
    )
    .join("");

  if (empty) empty.hidden = filtradas.length > 0;
}

function renderRecetaCategoriaFilter() {
  const chips = document.getElementById("recetaCategoriaFilter");
  if (!chips) return;
  chips.innerHTML = Object.entries(RECETA_CATEGORIA_LABEL)
    .map(([key, label], i) => `<button class="filter-chip${i === 0 ? " active" : ""}" data-categoria="${key}" type="button">${label}</button>`)
    .join("");
}

function renderObjetivoFilter() {
  const chips = document.getElementById("objetivoFilter");
  if (!chips) return;
  chips.innerHTML = Object.keys(planesPorObjetivo)
    .map((key, i) => {
      const obj = planesPorObjetivo[key];
      return `<button class="filter-chip${i === 0 ? " active" : ""}" data-objetivo="${key}" type="button">${obj.icon} ${obj.label}</button>`;
    })
    .join("");
}

function renderCalorieFilter(objetivoKey) {
  const chips = document.getElementById("calorieFilter");
  if (!chips) return;
  const planes = planesPorObjetivo[objetivoKey].planes;
  chips.innerHTML = Object.keys(planes)
    .map(
      (key, i) =>
        `<button class="filter-chip${i === 0 ? " active" : ""}" data-kcal="${key}" type="button">${planes[key].label}</button>`
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

function renderPlanMeta(objetivoKey, kcalKey) {
  const metaEl = document.getElementById("planMeta");
  const plan = planesPorObjetivo[objetivoKey].planes[kcalKey];
  if (!metaEl || !plan) return;
  metaEl.textContent = plan.meta;
}

function renderPlanDias(objetivoKey, kcalKey, semanaIdx) {
  const list = document.getElementById("planDiasList");
  const plan = planesPorObjetivo[objetivoKey].planes[kcalKey];
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

function renderNutriFilter() {
  const chips = document.getElementById("nutriFilter");
  if (!chips) return;
  const categorias = [...new Set(alimentosNutricion.map((item) => item.categoria))];
  chips.innerHTML = [`<button class="filter-chip active" data-categoria="todos" type="button">Todos</button>`]
    .concat(categorias.map((c) => `<button class="filter-chip" data-categoria="${c}" type="button">${c}</button>`))
    .join("");
}

function nutriMatches(item, categoria) {
  if (categoria && categoria !== "todos" && item.categoria !== categoria) return false;
  return true;
}

function renderNutricion(categoria = "todos") {
  const body = document.getElementById("nutriTableBody");
  const table = document.getElementById("nutriTable");
  const empty = document.getElementById("nutriEmpty");
  if (!body) return;

  const filtered = alimentosNutricion.filter((item) => nutriMatches(item, categoria));

  body.innerHTML = filtered
    .map(
      (item) => `
      <tr>
        <td class="nutri-food-col"><strong class="shoppable" data-shop-text="${item.nombre}">${item.nombre}</strong></td>
        <td>${item.kcal}</td>
        <td>${item.proteinas}</td>
        <td>${item.carbohidratos}</td>
        <td class="nutri-sub">${item.azucares}</td>
        <td>${item.grasas}</td>
        <td class="nutri-sub">${item.monoinsaturadas}</td>
        <td class="nutri-sub">${item.poliinsaturadas}</td>
      </tr>
    `
    )
    .join("");

  if (table) table.hidden = filtered.length === 0;
  if (empty) empty.hidden = filtered.length > 0;
}

renderTiendas();
renderRecetaCategoriaFilter();
renderRecetasDirectory();
renderObjetivoFilter();
const primerObjetivo = Object.keys(planesPorObjetivo)[0];
const primerKcal = Object.keys(planesPorObjetivo[primerObjetivo].planes)[0];
renderCalorieFilter(primerObjetivo);
renderSemanaFilter();
renderPlanMeta(primerObjetivo, primerKcal);
renderPlanDias(primerObjetivo, primerKcal, 0);
renderCiudadChips();
renderRestaurantes(Object.keys(restaurantesPorCiudad)[0]);
renderNutriFilter();
renderNutricion();
