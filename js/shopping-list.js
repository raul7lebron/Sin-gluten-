// Lista de la compra: se guarda solo en este dispositivo (localStorage), nunca en un
// servidor. Es una lista genérica ("espinacas", "pan sin gluten"...), no productos de una
// marca o supermercado concreto, para poder comprarla en cualquier sitio. Al tocar un
// ingrediente en negrita en Recetas, Dietas o la Tabla nutricional se añade directamente (o se suma 1 si ya
// estaba); la cantidad se ajusta luego con los botones +/- en la propia lista.
const SHOPPING_LIST_KEY = "libreDeTrigoShoppingList";

function loadShoppingList() {
  try {
    const raw = localStorage.getItem(SHOPPING_LIST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && item.label)
      .map((item) => ({
        id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        label: String(item.label),
        cantidad: Number.isFinite(item.cantidad) && item.cantidad > 0 ? Math.round(item.cantidad) : 1,
        checked: !!item.checked,
      }));
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

function normalizeLabel(str) {
  return str.trim().toLowerCase();
}

/* ---------- Estado: añadir / quitar / marcar / cantidad ---------- */

function addOrIncrementShoppingItem(label) {
  const key = normalizeLabel(label);
  const existing = shoppingList.find((item) => normalizeLabel(item.label) === key);
  if (existing) {
    existing.cantidad += 1;
  } else {
    shoppingList.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label,
      cantidad: 1,
      checked: false,
    });
  }
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

function incrementShoppingItem(id) {
  const item = shoppingList.find((i) => i.id === id);
  if (!item) return;
  item.cantidad += 1;
  saveShoppingList();
  renderShoppingList();
}

function decrementShoppingItem(id) {
  const item = shoppingList.find((i) => i.id === id);
  if (!item) return;
  if (item.cantidad <= 1) {
    removeFromShoppingList(id);
    return;
  }
  item.cantidad -= 1;
  saveShoppingList();
  renderShoppingList();
}

function clearShoppingList() {
  shoppingList = [];
  saveShoppingList();
  renderShoppingList();
  updateShoppingBadge();
}

/* ---------- Render: página "Lista de la compra" ---------- */

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

  container.innerHTML = `
    <ul class="shopping-items">
      ${shoppingList
        .map(
          (item) => `
        <li class="shopping-item${item.checked ? " checked" : ""}" data-id="${item.id}">
          <button class="shopping-check" type="button" aria-label="Marcar en el carrito" aria-pressed="${item.checked}"></button>
          <span class="shopping-item-label">${escapeHtmlShop(item.label)}</span>
          <div class="shopping-qty" role="group" aria-label="Cantidad">
            <button class="qty-btn qty-minus" type="button" aria-label="Quitar una unidad">−</button>
            <span class="qty-value">${item.cantidad}</span>
            <button class="qty-btn qty-plus" type="button" aria-label="Añadir una unidad">+</button>
          </div>
          <button class="shopping-remove" type="button" aria-label="Quitar de la lista">✕</button>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}

function updateShoppingBadge() {
  const badge = document.getElementById("shoppingBadge");
  if (!badge) return;
  const count = shoppingList.length;
  badge.textContent = String(count);
  badge.hidden = count === 0;
}

/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderShoppingList();
  updateShoppingBadge();

  const groupsContainer = document.getElementById("shoppingListGroups");
  if (groupsContainer) {
    groupsContainer.addEventListener("click", (event) => {
      const li = event.target.closest(".shopping-item");
      if (!li) return;
      const id = li.dataset.id;

      if (event.target.closest(".shopping-check")) {
        toggleShoppingItem(id);
      } else if (event.target.closest(".shopping-remove")) {
        removeFromShoppingList(id);
      } else if (event.target.closest(".qty-plus")) {
        incrementShoppingItem(id);
      } else if (event.target.closest(".qty-minus")) {
        decrementShoppingItem(id);
      }
    });
  }

  const addInput = document.getElementById("shoppingAddInput");
  const addBtn = document.getElementById("shoppingAddBtn");
  if (addInput && addBtn) {
    function addFromInput() {
      const value = addInput.value.trim();
      if (!value) return;
      addOrIncrementShoppingItem(value);
      addInput.value = "";
      addInput.focus();
    }
    addBtn.addEventListener("click", addFromInput);
    addInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") addFromInput();
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
    addOrIncrementShoppingItem(text);
    shoppable.classList.add("shoppable-added");
    setTimeout(() => shoppable.classList.remove("shoppable-added"), 500);
  });
});
