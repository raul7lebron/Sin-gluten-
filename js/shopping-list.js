// Lista de la compra: se guarda solo en este dispositivo (localStorage), nunca en un
// servidor. No incluye precio ni cantidad en gramos/litros porque no disponemos de esos
// datos verificados por producto — el campo "cantidad" lo rellena la propia persona al
// añadir el producto.
const SHOPPING_LIST_KEY = "libreDeTrigoShoppingList";

function loadShoppingList() {
  try {
    const raw = localStorage.getItem(SHOPPING_LIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveShoppingList() {
  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(shoppingList));
  } catch (err) {
    // Almacenamiento no disponible (navegación privada, etc.): la lista solo dura esta sesión.
  }
}

let shoppingList = loadShoppingList();

/* ---------- Búsqueda de productos a partir de un ingrediente/comida ---------- */

const SHOP_STOPWORDS = new Set([
  "de", "del", "la", "el", "los", "las", "y", "con", "sin", "a", "al", "en", "una", "un",
  "unas", "unos", "para", "por", "su", "sus", "tu", "tus", "o", "u", "e", "kcal", "aceite",
  "oliva", "extra", "gramos", "gr", "g", "ml", "ración", "raciones", "pieza", "piezas",
  "puñado", "trozos", "trozo", "cucharada", "cucharadas", "cucharadita",
]);

function stripAccents(str) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function extractKeywords(text) {
  const cleaned = text.replace(/\(~?\d+[^)]*\)/g, ""); // quita "(~450 kcal)" etc.
  const words = stripAccents(cleaned.toLowerCase())
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !SHOP_STOPWORDS.has(w));
  return [...new Set(words)];
}

function searchProducts(text) {
  const keywords = extractKeywords(text);
  if (keywords.length === 0 || typeof supermercadosCatalogo === "undefined") return [];

  const results = [];
  Object.values(supermercadosCatalogo).forEach((cadena) => {
    Object.entries(cadena.categorias).forEach(([catTitle, productos]) => {
      productos.forEach((producto) => {
        const normalized = stripAccents(producto.toLowerCase());
        const hits = keywords.filter((kw) => normalized.includes(kw)).length;
        if (hits > 0) {
          results.push({ supermercado: cadena.label, categoria: catTitle, producto, hits });
        }
      });
    });
  });

  results.sort((a, b) => b.hits - a.hits);
  return results.slice(0, 24);
}

/* ---------- Estado: añadir / quitar / marcar ---------- */

function addToShoppingList({ label, supermercado, categoria }) {
  shoppingList.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    supermercado: supermercado || "Sin especificar",
    categoria: categoria || "",
    cantidad: "",
    checked: false,
  });
  saveShoppingList();
  renderShoppingList();
  updateShoppingBadge();
}

function removeFromShoppingList(id) {
  shoppingList = shoppingList.filter((item) => item.id !== id);
  saveShoppingList();
  renderShoppingList();
  updateShoppingBadge();
}

function toggleShoppingItem(id) {
  const item = shoppingList.find((i) => i.id === id);
  if (item) item.checked = !item.checked;
  saveShoppingList();
  renderShoppingList();
}

function updateShoppingItemQty(id, cantidad) {
  const item = shoppingList.find((i) => i.id === id);
  if (item) item.cantidad = cantidad;
  saveShoppingList();
}

function clearShoppingList() {
  shoppingList = [];
  saveShoppingList();
  renderShoppingList();
  updateShoppingBadge();
}

/* ---------- Render: página "Lista de la compra" ---------- */

function groupBySupermercado(list) {
  const groups = {};
  list.forEach((item) => {
    const key = item.supermercado || "Sin especificar";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}

function escapeHtmlShop(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderShoppingList() {
  const container = document.getElementById("shoppingListGroups");
  const empty = document.getElementById("shoppingListEmpty");
  const countEl = document.getElementById("shoppingListCount");
  if (!container) return;

  if (shoppingList.length === 0) {
    container.innerHTML = "";
    if (empty) empty.hidden = false;
    if (countEl) countEl.textContent = "";
    return;
  }
  if (empty) empty.hidden = true;

  if (countEl) {
    const checkedCount = shoppingList.filter((i) => i.checked).length;
    countEl.textContent = `${checkedCount} de ${shoppingList.length} en el carrito`;
  }

  const groups = groupBySupermercado(shoppingList);
  container.innerHTML = Object.entries(groups)
    .map(
      ([supermercado, items]) => `
      <div class="shopping-group">
        <h3 class="shopping-group-title">${escapeHtmlShop(supermercado)}</h3>
        <ul class="shopping-items">
          ${items
            .map(
              (item) => `
            <li class="shopping-item${item.checked ? " checked" : ""}" data-id="${item.id}">
              <button class="shopping-check" type="button" aria-label="Marcar en el carrito" aria-pressed="${item.checked}"></button>
              <div class="shopping-item-info">
                <span class="shopping-item-label">${escapeHtmlShop(item.label)}</span>
                ${item.categoria ? `<span class="shopping-item-meta">${escapeHtmlShop(item.categoria)}</span>` : ""}
              </div>
              <input type="text" class="shopping-item-qty" placeholder="Cantidad" value="${escapeHtmlShop(item.cantidad || "")}" aria-label="Cantidad" />
              <button class="shopping-remove" type="button" aria-label="Quitar de la lista">✕</button>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `
    )
    .join("");
}

function updateShoppingBadge() {
  const badge = document.getElementById("shoppingBadge");
  if (!badge) return;
  const count = shoppingList.length;
  badge.textContent = String(count);
  badge.hidden = count === 0;
}

/* ---------- Modal: "¿qué necesitas para X?" ---------- */

function openIngredientPicker(text) {
  const modal = document.getElementById("ingredientModal");
  const title = document.getElementById("ingredientModalTitle");
  const resultsEl = document.getElementById("ingredientModalResults");
  const genericBtn = document.getElementById("ingredientModalGeneric");
  if (!modal || !title || !resultsEl || !genericBtn) return;

  title.textContent = text;
  const results = searchProducts(text);

  if (results.length === 0) {
    resultsEl.innerHTML = `<p class="ingredient-modal-empty">No encontramos productos verificados que coincidan con este ingrediente.</p>`;
  } else {
    resultsEl.innerHTML = results
      .map(
        (r, i) => `
        <button class="ingredient-result" type="button" data-index="${i}">
          <span class="ingredient-result-super">${escapeHtmlShop(r.supermercado)}</span>
          <span class="ingredient-result-name">${escapeHtmlShop(r.producto)}</span>
          <span class="ingredient-result-add" aria-hidden="true">+ Añadir</span>
        </button>
      `
      )
      .join("");

    Array.from(resultsEl.querySelectorAll(".ingredient-result")).forEach((btn) => {
      btn.addEventListener("click", () => {
        const r = results[Number(btn.dataset.index)];
        addToShoppingList({ label: r.producto, supermercado: r.supermercado, categoria: r.categoria });
        closeIngredientPicker();
      });
    });
  }

  const shortText = text.length > 44 ? `${text.slice(0, 44)}…` : text;
  genericBtn.textContent = `Añadir "${shortText}" tal cual`;
  genericBtn.onclick = () => {
    addToShoppingList({ label: text, supermercado: "Sin especificar", categoria: "" });
    closeIngredientPicker();
  };

  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add("open"));
  document.body.style.overflow = "hidden";
}

function closeIngredientPicker() {
  const modal = document.getElementById("ingredientModal");
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
  setTimeout(() => {
    modal.hidden = true;
  }, 200);
}

/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderShoppingList();
  updateShoppingBadge();

  const groupsContainer = document.getElementById("shoppingListGroups");
  if (groupsContainer) {
    groupsContainer.addEventListener("click", (event) => {
      const checkBtn = event.target.closest(".shopping-check");
      if (checkBtn) {
        toggleShoppingItem(checkBtn.closest(".shopping-item").dataset.id);
        return;
      }
      const removeBtn = event.target.closest(".shopping-remove");
      if (removeBtn) {
        removeFromShoppingList(removeBtn.closest(".shopping-item").dataset.id);
      }
    });

    groupsContainer.addEventListener("input", (event) => {
      if (event.target.classList.contains("shopping-item-qty")) {
        updateShoppingItemQty(event.target.closest(".shopping-item").dataset.id, event.target.value);
      }
    });
  }

  const clearBtn = document.getElementById("shoppingListClear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (shoppingList.length === 0) return;
      if (window.confirm("¿Vaciar toda la lista de la compra?")) clearShoppingList();
    });
  }

  document.addEventListener("click", (event) => {
    const shoppable = event.target.closest(".shoppable");
    if (!shoppable) return;
    const text = shoppable.dataset.shopText || shoppable.textContent.trim();
    openIngredientPicker(text);
  });

  const closeBtn = document.getElementById("ingredientModalClose");
  if (closeBtn) closeBtn.addEventListener("click", closeIngredientPicker);

  const overlay = document.getElementById("ingredientModal");
  if (overlay) {
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeIngredientPicker();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const modal = document.getElementById("ingredientModal");
    if (modal && !modal.hidden) closeIngredientPicker();
  });
});
