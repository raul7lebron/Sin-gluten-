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

function renderDietas() {
  const list = document.getElementById("dietasList");
  list.innerHTML = dietas
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

renderSupermercado();
renderRecetas();
renderDietas();
