document.addEventListener("DOMContentLoaded", () => {
  const cameraBox = document.getElementById("scannerCamera");
  const video = document.getElementById("scannerVideo");
  const startBtn = document.getElementById("scannerStart");
  const stopBtn = document.getElementById("scannerStop");
  const statusEl = document.getElementById("scannerStatus");
  const barcodeInput = document.getElementById("barcodeInput");
  const lookupBtn = document.getElementById("barcodeLookup");
  const resultBox = document.getElementById("scannerResult");
  const productNameInput = document.getElementById("productNameInput");
  const productNameSearchBtn = document.getElementById("productNameSearchBtn");
  const nameResultsBox = document.getElementById("scannerNameResults");
  const historyBox = document.getElementById("scannerHistory");
  const historyList = document.getElementById("scannerHistoryList");

  if (!startBtn) return; // scanner section not on this page

  // Los nombres, marcas e ingredientes vienen de Open Food Facts, una base de
  // datos abierta que cualquiera puede editar: se escapan antes de insertarlos
  // como HTML para no confiar en ese texto libre.
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  let reader = null;
  let scanning = false;

  function setStatus(text) {
    statusEl.textContent = text || "";
  }

  function stopScanner() {
    if (reader) {
      reader.reset();
    }
    scanning = false;
    cameraBox.hidden = true;
    startBtn.hidden = false;
    stopBtn.hidden = true;
  }

  async function startScanner() {
    if (typeof ZXing === "undefined") {
      setStatus("No se pudo cargar el lector de cámara. Usa la búsqueda manual.");
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("Este navegador no permite acceder a la cámara. Usa la búsqueda manual.");
      return;
    }

    reader = reader || new ZXing.BrowserMultiFormatReader();
    cameraBox.hidden = false;
    startBtn.hidden = true;
    stopBtn.hidden = false;
    scanning = true;
    setStatus("Apunta la cámara al código de barras…");

    try {
      await reader.decodeFromVideoDevice(null, video, (result, err) => {
        if (result && scanning) {
          const code = result.getText();
          setStatus(`Código detectado: ${code}`);
          stopScanner();
          handleBarcode(code);
        }
      });
    } catch (err) {
      setStatus("No se pudo acceder a la cámara (permiso denegado o no disponible). Usa la búsqueda manual.");
      stopScanner();
    }
  }

  startBtn.addEventListener("click", startScanner);
  stopBtn.addEventListener("click", stopScanner);

  lookupBtn.addEventListener("click", () => {
    const code = barcodeInput.value.trim();
    if (!/^\d{6,14}$/.test(code)) {
      setStatus("Introduce un código de barras válido (solo números, 6 a 14 dígitos).");
      return;
    }
    setStatus("");
    handleBarcode(code);
  });

  barcodeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") lookupBtn.click();
  });

  function veredictoGluten(product) {
    const labels = product.labels_tags || [];
    const allergens = product.allergens_tags || [];
    const traces = product.traces_tags || [];

    if (labels.includes("en:gluten-free") || labels.includes("en:no-gluten")) {
      return { tipo: "sin-gluten", icono: "✅", texto: "Etiquetado como \"sin gluten\"" };
    }
    if (allergens.includes("en:gluten")) {
      return { tipo: "con-gluten", icono: "⛔", texto: "Contiene gluten" };
    }
    if (traces.includes("en:gluten")) {
      return { tipo: "trazas", icono: "⚠️", texto: "Puede contener trazas de gluten" };
    }
    // El fabricante ha declarado alérgenos (obligatorio por ley si los hay) y
    // el gluten no está entre ellos: no es una certificación "sin gluten",
    // pero es un dato más fiable que la ausencia total de información.
    if (allergens.length > 0) {
      return {
        tipo: "probable-sin-gluten",
        icono: "🟡",
        texto: "El gluten no figura entre los alérgenos declarados (no es una certificación \"sin gluten\")",
      };
    }
    return { tipo: "desconocido", icono: "❓", texto: "El fabricante no ha declarado alérgenos en Open Food Facts: sin información suficiente sobre el gluten" };
  }

  function renderLoading() {
    resultBox.hidden = false;
    resultBox.innerHTML = `<div class="scanner-card scanner-card-loading">Buscando producto…</div>`;
  }

  function renderNotFound(code) {
    resultBox.hidden = false;
    resultBox.innerHTML = `
      <div class="scanner-card scanner-verdict-desconocido">
        <div class="scanner-verdict"><span class="scanner-icon" aria-hidden="true">❓</span> Producto no encontrado</div>
        <p>No hay datos en Open Food Facts para el código <strong>${escapeHtml(code)}</strong>. Prueba a leer el etiquetado directamente o busca el producto por nombre en la web del fabricante.</p>
        <p>Si es una marca española pequeña o artesana, es habitual que todavía no esté en la base de datos. <button type="button" class="scanner-inline-link scanner-goto-contacto">Dinos qué producto es</button> y lo añadimos a Open Food Facts para que aparezca aquí en el futuro.</p>
      </div>
    `;
  }

  function renderError() {
    resultBox.hidden = false;
    resultBox.innerHTML = `
      <div class="scanner-card scanner-verdict-desconocido">
        <div class="scanner-verdict"><span class="scanner-icon" aria-hidden="true">⚠️</span> No se pudo consultar la base de datos</div>
        <p>Revisa tu conexión e inténtalo de nuevo en unos segundos.</p>
      </div>
    `;
  }

  const SCORE_GRADE_COLORS = { a: "#1e8f4e", b: "#77b52c", c: "#eec300", d: "#ee8100", e: "#e63e11" };

  function normalizeGrade(grade) {
    const g = String(grade || "").toLowerCase();
    return ["a", "b", "c", "d", "e"].includes(g) ? g : null;
  }

  function renderScoreBadge(label, icon, grade, extra) {
    const g = normalizeGrade(grade);
    if (!g) return "";
    return `
      <div class="score-badge" style="--score-color: ${SCORE_GRADE_COLORS[g]}">
        <span class="score-badge-grade" aria-hidden="true">${g.toUpperCase()}</span>
        <div class="score-badge-info">
          <span class="score-badge-label"><span aria-hidden="true">${icon}</span> ${label}</span>
          ${extra ? `<span class="score-badge-extra">${extra}</span>` : ""}
        </div>
      </div>
    `;
  }

  const NOVA_INFO = {
    1: { icono: "🌿", texto: "Sin procesar o mínimamente procesado", color: "#1e8f4e" },
    2: { icono: "🧂", texto: "Ingrediente culinario procesado", color: "#77b52c" },
    3: { icono: "🥫", texto: "Alimento procesado", color: "#ee8100" },
    4: { icono: "🏭", texto: "Ultraprocesado", color: "#e63e11" },
  };

  function renderNovaBadge(novaGroup) {
    const info = NOVA_INFO[Number(novaGroup)];
    if (!info) return "";
    return `
      <div class="score-badge" style="--score-color: ${info.color}">
        <span class="score-badge-grade" aria-hidden="true">${novaGroup}</span>
        <div class="score-badge-info">
          <span class="score-badge-label"><span aria-hidden="true">${info.icono}</span> Grado NOVA</span>
          <span class="score-badge-extra">${info.texto}</span>
        </div>
      </div>
    `;
  }

  // Traducción de los 14 alérgenos de declaración obligatoria en la UE (a
  // partir de las etiquetas canónicas "en:..." de Open Food Facts, estables
  // desde hace años). Se usa en vez del campo de texto libre "allergens"/
  // "traces" porque ese no siempre viene traducido al español.
  const ALLERGEN_LABELS = {
    "en:gluten": "Gluten",
    "en:milk": "Leche",
    "en:eggs": "Huevo",
    "en:fish": "Pescado",
    "en:crustaceans": "Crustáceos",
    "en:molluscs": "Moluscos",
    "en:peanuts": "Cacahuetes",
    "en:soybeans": "Soja",
    "en:nuts": "Frutos de cáscara",
    "en:celery": "Apio",
    "en:mustard": "Mostaza",
    "en:sesame-seeds": "Sésamo",
    "en:sulphur-dioxide-and-sulphites": "Sulfitos",
    "en:lupin": "Altramuces",
  };

  function translateAllergenTag(tag) {
    if (ALLERGEN_LABELS[tag]) return ALLERGEN_LABELS[tag];
    const sinPrefijo = tag.replace(/^\w+:/, "").replace(/-/g, " ");
    return sinPrefijo.charAt(0).toUpperCase() + sinPrefijo.slice(1);
  }

  // El gluten ya tiene su propia línea de veredicto más arriba: se excluye
  // aquí para no repetirlo.
  function otrosAlergenos(tags) {
    return (tags || []).filter((t) => t !== "en:gluten").map(translateAllergenTag).join(", ");
  }

  function renderResultado(product, code) {
    const veredicto = veredictoGluten(product);
    const nombre = product.product_name || "Producto sin nombre registrado";
    const marca = product.brands || "";
    const imagen = product.image_front_small_url || product.image_url || "";
    const ingredientes = product.ingredients_text_es || product.ingredients_text || "";

    const nutriscoreGrade = product.nutriscore_grade || product.nutrition_grades;
    const ecoscoreGrade = product.ecoscore_grade;
    const ecoscoreValor = Number.isFinite(product.ecoscore_score) ? `${product.ecoscore_score}/100` : "";

    const scoresHtml = `${renderScoreBadge("Nutri-Score", "🍎", nutriscoreGrade)}${renderScoreBadge("Green-Score", "🌱", ecoscoreGrade, ecoscoreValor)}${renderNovaBadge(product.nova_group)}`;

    const metaPartes = [product.quantity, product.categories ? product.categories.split(",")[0].trim() : ""].filter(Boolean);
    const metaHtml = metaPartes.length ? `<p class="scanner-brand">${escapeHtml(metaPartes.join(" · "))}</p>` : "";

    const alergenos = otrosAlergenos(product.allergens_tags);
    const trazas = otrosAlergenos(product.traces_tags);

    resultBox.hidden = false;
    resultBox.innerHTML = `
      <div class="scanner-card scanner-verdict-${veredicto.tipo}">
        <div class="scanner-product">
          ${imagen ? `<img class="scanner-thumb" src="${escapeHtml(imagen)}" alt="${escapeHtml(nombre)}" loading="lazy" />` : ""}
          <div>
            <h3>${escapeHtml(nombre)}</h3>
            ${marca ? `<p class="scanner-brand">${escapeHtml(marca)}</p>` : ""}
            ${metaHtml}
          </div>
        </div>
        <div class="scanner-verdict"><span class="scanner-icon" aria-hidden="true">${veredicto.icono}</span> ${veredicto.texto}</div>
        ${scoresHtml ? `<div class="scanner-scores">${scoresHtml}</div>` : ""}
        ${ingredientes ? `<p class="scanner-ingredients"><strong>Ingredientes:</strong> ${escapeHtml(ingredientes)}</p>` : ""}
        ${alergenos ? `<p class="scanner-ingredients"><strong>Alérgenos declarados:</strong> ${alergenos}</p>` : ""}
        ${trazas ? `<p class="scanner-ingredients"><strong>Puede contener trazas de:</strong> ${trazas}</p>` : ""}
        <div class="scanner-actions">
          <button type="button" class="btn-secondary scanner-add-shopping" data-shop-label="${escapeHtml(nombre)}">🛒 Añadir a la lista de la compra</button>
          <a class="rank-link" href="https://world.openfoodfacts.org/product/${encodeURIComponent(code)}" target="_blank" rel="noopener noreferrer">Ver ficha completa en Open Food Facts ↗</a>
        </div>
      </div>
    `;

    addToHistory(product, code, veredicto);
  }

  resultBox.addEventListener("click", (event) => {
    const shopBtn = event.target.closest(".scanner-add-shopping");
    if (shopBtn && !shopBtn.disabled) {
      if (typeof addOrIncrementShoppingItem !== "function") return;
      addOrIncrementShoppingItem(shopBtn.dataset.shopLabel);
      const textoOriginal = shopBtn.textContent;
      shopBtn.textContent = "✓ Añadido a la lista";
      shopBtn.disabled = true;
      setTimeout(() => {
        shopBtn.textContent = textoOriginal;
        shopBtn.disabled = false;
      }, 1500);
      return;
    }

    const contactoBtn = event.target.closest(".scanner-goto-contacto");
    if (contactoBtn && window.libreDeTrigo) {
      window.libreDeTrigo.activateTab("sobre-libredetrigo");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  async function handleBarcode(code) {
    renderLoading();
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
      if (!res.ok) throw new Error("network");
      const data = await res.json();
      if (data.status !== 1 || !data.product) {
        renderNotFound(code);
        return;
      }
      renderResultado(data.product, code);
    } catch (err) {
      renderError();
    }
  }

  /* ---------- Historial de escaneos recientes (solo en este dispositivo) ---------- */

  const HISTORY_KEY = "libreDeTrigoScannerHistory";
  const HISTORY_MAX = 8;

  function loadScannerHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveScannerHistory() {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(scannerHistory));
    } catch (err) {
      // Almacenamiento no disponible (navegación privada, etc.): el historial solo dura esta sesión.
    }
  }

  let scannerHistory = loadScannerHistory();

  function addToHistory(product, code, veredicto) {
    if (!historyBox) return;
    scannerHistory = scannerHistory.filter((item) => item.code !== code);
    scannerHistory.unshift({
      code,
      nombre: product.product_name || "Producto sin nombre registrado",
      imagen: product.image_front_small_url || product.image_url || "",
      tipo: veredicto.tipo,
      icono: veredicto.icono,
    });
    scannerHistory = scannerHistory.slice(0, HISTORY_MAX);
    saveScannerHistory();
    renderHistory();
  }

  function renderHistory() {
    if (!historyBox || !historyList) return;
    if (scannerHistory.length === 0) {
      historyBox.hidden = true;
      return;
    }
    historyBox.hidden = false;
    historyList.innerHTML = scannerHistory
      .map(
        (item) => `
        <button type="button" class="scanner-history-item scanner-verdict-${item.tipo}" data-code="${escapeHtml(item.code)}" title="${escapeHtml(item.nombre)}">
          ${item.imagen ? `<img src="${escapeHtml(item.imagen)}" alt="" loading="lazy" />` : `<span class="scanner-history-icon" aria-hidden="true">${item.icono}</span>`}
          <span class="scanner-history-name">${escapeHtml(item.nombre)}</span>
        </button>
      `
      )
      .join("");
  }

  if (historyList) {
    historyList.addEventListener("click", (event) => {
      const btn = event.target.closest(".scanner-history-item");
      if (!btn) return;
      handleBarcode(btn.dataset.code);
      resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  renderHistory();

  /* ---------- Búsqueda por nombre o marca ---------- */

  async function searchByName(query) {
    if (!nameResultsBox) return;
    nameResultsBox.hidden = false;
    nameResultsBox.innerHTML = `<p class="scanner-status">Buscando…</p>`;
    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=8&fields=code,product_name,brands,image_front_small_url`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("network");
      const data = await res.json();
      const productos = (Array.isArray(data.products) ? data.products : []).filter((p) => p.code);
      if (productos.length === 0) {
        nameResultsBox.innerHTML = `<p class="scanner-status">No se encontraron productos con ese nombre. Prueba con otra búsqueda o usa el código de barras.</p>`;
        return;
      }
      nameResultsBox.innerHTML = productos
        .map(
          (p) => `
          <button type="button" class="scanner-name-result" data-code="${escapeHtml(p.code)}">
            ${p.image_front_small_url ? `<img src="${escapeHtml(p.image_front_small_url)}" alt="" loading="lazy" />` : `<span class="scanner-name-result-noimg" aria-hidden="true">📦</span>`}
            <span>
              <strong>${escapeHtml(p.product_name || "Producto sin nombre")}</strong>
              ${p.brands ? `<span class="scanner-name-result-brand">${escapeHtml(p.brands)}</span>` : ""}
            </span>
          </button>
        `
        )
        .join("");
    } catch (err) {
      nameResultsBox.innerHTML = `<p class="scanner-status">No se pudo buscar. Revisa tu conexión e inténtalo de nuevo.</p>`;
    }
  }

  if (productNameSearchBtn && productNameInput) {
    function runNameSearch() {
      const query = productNameInput.value.trim();
      if (!query) return;
      searchByName(query);
    }
    productNameSearchBtn.addEventListener("click", runNameSearch);
    productNameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runNameSearch();
    });
  }

  if (nameResultsBox) {
    nameResultsBox.addEventListener("click", (event) => {
      const btn = event.target.closest(".scanner-name-result");
      if (!btn) return;
      nameResultsBox.hidden = true;
      nameResultsBox.innerHTML = "";
      productNameInput.value = "";
      setStatus("");
      handleBarcode(btn.dataset.code);
    });
  }
});
