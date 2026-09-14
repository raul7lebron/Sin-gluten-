function renderSupermercado() {
  const grid = document.getElementById("supermercadoGrid");
  grid.innerHTML = supermercadoCategories
    .map(
      (cat) => `
        <article class="info-card">
          <span class="info-icon ${cat.iconClass}">${cat.icon}</span>
          <h3>${cat.title}</h3>
          <p>${cat.text}</p>
        </article>
      `
    )
    .join("");
}

function renderRecipeCard(item, extraClass, listHtml) {
  return `
    <div class="recipe-card ${extraClass}">
      <button class="recipe-toggle" type="button" aria-expanded="false">
        <span class="recipe-icon">${item.icon}</span>
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
        <ul>${receta.ingredientes.map((i) => `<li>${i}</li>`).join("")}</ul>
        <h4>Preparación</h4>
        <ol>${receta.pasos.map((p) => `<li>${p}</li>`).join("")}</ol>
      `;
      return renderRecipeCard(receta, "", content);
    })
    .join("");

  empty.hidden = filtered.length > 0;
}

function renderDietaList(containerId, items) {
  const list = document.getElementById(containerId);
  list.innerHTML = items
    .map((dieta) => {
      const content = `
        <ul class="meal-list">
          ${dieta.comidas.map((c) => `<li><strong>${c.label}:</strong> ${c.text}</li>`).join("")}
        </ul>
      `;
      return renderRecipeCard(dieta, "diet-card", content);
    })
    .join("");
}

function renderDietas() {
  renderDietaList("dietasList", dietas);
}

function renderMusculo() {
  renderDietaList("musculoList", dietasMusculo);
}

function renderMantenimiento() {
  renderDietaList("mantenimientoList", dietasMantenimiento);
}

function renderDigestion() {
  renderDietaList("digestionList", dietasDigestion);
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
      return `
        <article class="rank-card">
          <span class="rank-number">${i + 1}</span>
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

renderSupermercado();
renderRecetas();
renderDietas();
renderMusculo();
renderMantenimiento();
renderDigestion();
renderCiudadChips();
renderRestaurantes(Object.keys(restaurantesPorCiudad)[0]);
