document.addEventListener("DOMContentLoaded", () => {
  const cameraBox = document.getElementById("scannerCamera");
  const video = document.getElementById("scannerVideo");
  const startBtn = document.getElementById("scannerStart");
  const stopBtn = document.getElementById("scannerStop");
  const statusEl = document.getElementById("scannerStatus");
  const barcodeInput = document.getElementById("barcodeInput");
  const lookupBtn = document.getElementById("barcodeLookup");
  const resultBox = document.getElementById("scannerResult");

  if (!startBtn) return; // scanner section not on this page

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
    return { tipo: "desconocido", icono: "❓", texto: "Sin información suficiente sobre el gluten" };
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
        <p>No hay datos en Open Food Facts para el código <strong>${code}</strong>. Prueba a leer el etiquetado directamente o busca el producto por nombre en la web del fabricante.</p>
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

  function renderResultado(product, code) {
    const veredicto = veredictoGluten(product);
    const nombre = product.product_name || "Producto sin nombre registrado";
    const marca = product.brands || "";
    const imagen = product.image_front_small_url || product.image_url || "";
    const ingredientes = product.ingredients_text_es || product.ingredients_text || "";

    resultBox.hidden = false;
    resultBox.innerHTML = `
      <div class="scanner-card scanner-verdict-${veredicto.tipo}">
        <div class="scanner-product">
          ${imagen ? `<img class="scanner-thumb" src="${imagen}" alt="" loading="lazy" />` : ""}
          <div>
            <h3>${nombre}</h3>
            ${marca ? `<p class="scanner-brand">${marca}</p>` : ""}
          </div>
        </div>
        <div class="scanner-verdict"><span class="scanner-icon" aria-hidden="true">${veredicto.icono}</span> ${veredicto.texto}</div>
        ${ingredientes ? `<p class="scanner-ingredients"><strong>Ingredientes:</strong> ${ingredientes}</p>` : ""}
        <a class="rank-link" href="https://world.openfoodfacts.org/product/${code}" target="_blank" rel="noopener noreferrer">Ver ficha completa en Open Food Facts ↗</a>
      </div>
    `;
  }

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
});
