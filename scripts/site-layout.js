// Piezas de maquetación compartidas por los generadores de páginas estáticas
// (build-guias.js, build-recetas.js): cabecera, pie y utilidades comunes.
// Por qué en un módulo aparte: antes cada generador tenía su propia copia del
// header/footer, así que cambiar un enlace del menú (p. ej. renombrar
// "Productos" a "Tiendas especializadas") obligaba a tocar el mismo HTML en
// varios sitios a la vez, con riesgo de que alguno se quedara desactualizado.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const SITE_URL = "https://www.libredetrigo.com";

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fileHash(relPath) {
  const content = fs.readFileSync(path.join(ROOT, relPath));
  return crypto.createHash("md5").update(content).digest("hex").slice(0, 10);
}

function headerHtml() {
  return `
  <header class="site-header" id="siteHeader">
    <div class="header-inner container">
      <a href="${SITE_URL}/" class="logo">
        <img src="${SITE_URL}/img/logo.png" alt="Libre de Trigo" class="logo-img" />
        <span class="logo-tagline">Guía práctica para vivir sin gluten</span>
      </a>
      <div class="header-actions">
        <button class="header-search-btn" id="searchToggle" type="button" aria-label="Buscar guías y recetas" aria-haspopup="dialog">
          <span aria-hidden="true">🔍</span>
        </button>
        <div class="tools-menu-wrap">
          <button class="header-search-btn tools-toggle" id="toolsToggle" type="button" aria-label="Más herramientas" aria-haspopup="true" aria-expanded="false" aria-controls="toolsMenu">
            <span aria-hidden="true">⚙️</span>
          </button>
          <div class="tools-menu" id="toolsMenu" hidden>
            <a href="${SITE_URL}/#dietas"><span aria-hidden="true">🍽️</span> Dietas</a>
            <a href="${SITE_URL}/#calculadora"><span aria-hidden="true">🧮</span> Calculadora calórica</a>
            <a href="${SITE_URL}/#recetas"><span aria-hidden="true">🍳</span> Recetas</a>
            <a href="${SITE_URL}/#escaner"><span aria-hidden="true">📷</span> Escáner</a>
            <a href="${SITE_URL}/#lista-compra"><span aria-hidden="true">🛍️</span> Lista de la compra</a>
            <a href="${SITE_URL}/vivir-sin-gluten/productos-recomendados/"><span aria-hidden="true">🔪</span> Productos recomendados</a>
          </div>
        </div>
        <button class="header-search-btn menu-toggle" id="menuToggle" type="button" aria-label="Abrir menú" aria-haspopup="true" aria-expanded="false" aria-controls="pillNav">
          <span aria-hidden="true">☰</span>
        </button>
      </div>
      <nav class="pill-nav" id="pillNav" aria-label="Secciones">
        <a class="pill-btn" href="${SITE_URL}/#guia"><span class="pill-icon" aria-hidden="true">🔰</span>Guías</a>
        <a class="pill-btn" href="${SITE_URL}/#tiendas"><span class="pill-icon" aria-hidden="true">🏬</span>Tiendas especializadas</a>
        <a class="pill-btn" href="${SITE_URL}/#restaurantes"><span class="pill-icon" aria-hidden="true">📍</span>Comer fuera</a>
        <a class="pill-btn" href="${SITE_URL}/#nutricion"><span class="pill-icon" aria-hidden="true">🥗</span>Tabla nutricional</a>
        <a class="pill-btn" href="${SITE_URL}/#actualidad"><span class="pill-icon" aria-hidden="true">📰</span>Actualidad</a>
      </nav>
    </div>
  </header>`;
}

// Modal de búsqueda para las páginas estáticas: solo busca en guías y
// recetas (js/static-search.js), no en todo el contenido de la SPA — ver esa
// nota en prerender.js, función writeSearchIndex.
function searchOverlayHtml() {
  return `
  <div class="search-overlay" id="searchOverlay" hidden>
    <div class="search-modal" role="dialog" aria-modal="true" aria-label="Buscar guías y recetas">
      <div class="search-modal-input-row">
        <span class="search-modal-icon" aria-hidden="true">🔍</span>
        <input type="search" id="searchModalInput" placeholder="Buscar guías y recetas…" aria-label="Buscar guías y recetas" autocomplete="off" />
        <button class="search-modal-close" id="searchModalClose" type="button" aria-label="Cerrar búsqueda">✕</button>
      </div>
      <div class="search-modal-results" id="searchModalResults"></div>
    </div>
  </div>`;
}

function footerHtml() {
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-col footer-col-brand">
        <a href="${SITE_URL}/" class="footer-logo">
          <img src="${SITE_URL}/img/logo.png" alt="Libre de Trigo" />
        </a>
        <p>Tu guía práctica para vivir sin gluten.</p>
      </div>
      <div class="footer-col">
        <span class="footer-links-title">Explora</span>
        <a href="${SITE_URL}/#guia">Guías</a>
        <a href="${SITE_URL}/#tiendas">Tiendas especializadas</a>
        <a href="${SITE_URL}/#restaurantes">Restaurantes</a>
        <a href="${SITE_URL}/#nutricion">Tabla nutricional</a>
        <a href="${SITE_URL}/#actualidad">Actualidad</a>
      </div>
      <div class="footer-col">
        <span class="footer-links-title">Libre de Trigo</span>
        <a href="${SITE_URL}/sobre-libredetrigo/">Sobre nosotros</a>
        <a href="${SITE_URL}/sobre-libredetrigo/">Cómo verificamos la información</a>
        <a href="${SITE_URL}/sobre-libredetrigo/">Contacto</a>
        <a href="${SITE_URL}/sobre-libredetrigo/">Colabora con nosotros</a>
      </div>
      <div class="footer-col">
        <span class="footer-links-title">Legal</span>
        <a href="${SITE_URL}/#aviso-legal">Aviso legal</a>
        <a href="${SITE_URL}/#privacidad">Política de privacidad</a>
        <a href="${SITE_URL}/#cookies">Política de cookies</a>
      </div>
    </div>
    <div class="container footer-disclaimer">
      <p>La información de este sitio es orientativa y no sustituye el consejo médico ni el etiquetado oficial de los productos.</p>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Libre de Trigo — Guía práctica para vivir sin gluten</p>
      <nav class="footer-legal-links" aria-label="Legal">
        <a href="${SITE_URL}/#aviso-legal">Aviso legal</a>
        <a href="${SITE_URL}/#privacidad">Política de privacidad</a>
        <a href="${SITE_URL}/#cookies">Política de cookies</a>
      </nav>
    </div>
  </footer>

  <div class="cookie-banner" id="cookieBanner" hidden>
    <p>Usamos únicamente cookies esenciales y, si lo aceptas, analítica anónima para entender el uso del sitio. Más información en nuestra <a href="${SITE_URL}/#cookies">Política de cookies</a>.</p>
    <div class="cookie-banner-actions">
      <button type="button" id="cookieReject" class="btn-secondary">Rechazar</button>
      <button type="button" id="cookieAccept" class="btn-primary">Aceptar</button>
    </div>
  </div>`;
}

// Google AdSense: de momento el sitio no tiene cuenta de editor (falta el ID
// "ca-pub-XXXXXXXXXXXXXXXX", que solo puede generar el titular al darse de
// alta en https://www.google.com/adsense/). En cuanto exista, sustituye la
// cadena vacía de abajo por el meta tag de verificación y el script de
// Auto ads, y ejecuta "npm run prerender": al estar centralizado aquí, se
// añade de golpe a todas las páginas (home, guías y recetas) sin tocarlas
// una por una. No se genera ads.txt con un ID inventado: ver el ads.txt real
// del repo, que solo lleva un comentario recordando este mismo paso.
//
// <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" />
// <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
function adsenseHeadHtml() {
  return "";
}

function fileFor(urlPath) {
  return path.join(ROOT, urlPath.replace(/^\//, ""), "index.html");
}

function writeFile(urlPath, html) {
  const filePath = fileFor(urlPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

module.exports = { ROOT, SITE_URL, escapeHtml, fileHash, headerHtml, searchOverlayHtml, footerHtml, adsenseHeadHtml, writeFile };
