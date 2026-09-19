function renderSupermercado() {
  const grid = document.getElementById("supermercadoGrid");
  grid.innerHTML = supermercadoCategories
    .map((cat) => {
      const hasProductos = cat.productos && cat.productos.length > 0;
      const toggleHtml = hasProductos
        ? `
          <button class="info-toggle" type="button" aria-expanded="false">
            <span>Ver ${cat.productos.length} productos</span>
            <span class="chevron">⌄</span>
          </button>
          <div class="info-content">
            <ul class="info-product-list">${cat.productos.map((p) => `<li>${p}</li>`).join("")}</ul>
          </div>
        `
        : "";
      return `
        <article class="info-card" data-title="${cat.title}">
          <span class="info-icon ${cat.iconClass}" aria-hidden="true">${cat.icon}</span>
          <h3>${cat.title}</h3>
          <p>${cat.text}</p>
          ${toggleHtml}
        </article>
      `;
    })
    .join("");
}

function renderSupermercadoFilter() {
  const chips = document.getElementById("supermercadoFilter");
  if (!chips) return;
  const keys = Object.keys(supermercadosCatalogo);
  chips.innerHTML = keys
    .map(
      (key, i) =>
        `<button class="filter-chip${i === 0 ? " active" : ""}" data-super="${key}" type="button">${supermercadosCatalogo[key].label}</button>`
    )
    .join("");
}

function renderCatalogo(superKey) {
  const grid = document.getElementById("catalogoGrid");
  const empty = document.getElementById("catalogoEmpty");
  const cadena = supermercadosCatalogo[superKey];
  if (!grid || !cadena) return;

  const categoryMeta = {};
  supermercadoCategories.forEach((c) => {
    categoryMeta[c.title] = c;
  });

  const catTitles = Object.keys(cadena.categorias);

  grid.innerHTML = catTitles
    .map((catTitle) => {
      const meta = categoryMeta[catTitle] || { icon: "🛒", iconClass: "icon-1" };
      const productos = cadena.categorias[catTitle];
      return `
        <article class="info-card" data-title="${catTitle}">
          <span class="info-icon ${meta.iconClass}" aria-hidden="true">${meta.icon}</span>
          <h3>${catTitle}</h3>
          <p>${productos.length} producto${productos.length === 1 ? "" : "s"} sin gluten verificados</p>
          <button class="info-toggle" type="button" aria-expanded="false">
            <span>Ver productos</span>
            <span class="chevron">⌄</span>
          </button>
          <div class="info-content">
            <ul class="info-product-list">${productos.map((p) => `<li>${p}</li>`).join("")}</ul>
          </div>
        </article>
      `;
    })
    .join("");

  empty.hidden = catTitles.length > 0;
}

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

function renderRecipeCard(item, extraClass, listHtml) {
  return `
    <div class="recipe-card ${extraClass}" data-title="${item.title}">
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

renderSupermercado();
renderSupermercadoFilter();
renderCatalogo(Object.keys(supermercadosCatalogo)[0]);
renderTiendas();
renderRecetas();
renderDietas();
renderMusculo();
renderMantenimiento();
renderDigestion();
renderCiudadChips();
renderRestaurantes(Object.keys(restaurantesPorCiudad)[0]);
