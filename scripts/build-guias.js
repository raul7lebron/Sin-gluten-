// Genera páginas estáticas reales (una URL propia por guía) a partir de las
// guías que ya existen como contenido en la pestaña "Guías" de index.html.
// Por qué: en una SPA de una sola página, Google solo puede indexar
// "https://www.libredetrigo.com/" — ninguna guía tiene URL propia, así que
// no puede aparecer en resultados de búsqueda específicos (p. ej. "contaminación
// cruzada celiaquía"). Este script "publica" cada guía como su propia página
// HTML real, agrupadas en clusters temáticos (/celiaquia/, /vivir-sin-gluten/,
// /etiquetado-sin-gluten/, /restaurantes-sin-gluten/), cada una con su
// title/description/canonical propios, breadcrumbs, JSON-LD Article y
// contenidos relacionados.
//
// No edites los .html generados a mano: vuelve a ejecutar "npm run build-guias"
// después de cambiar los datos de este archivo.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const SITE_URL = "https://www.libredetrigo.com";
const TODAY = new Date().toISOString().slice(0, 10);
const UPDATED_LABEL = "21 de septiembre de 2026";

const CLUSTERS = {
  celiaquia: { label: "Celiaquía", path: "/celiaquia/" },
  "vivir-sin-gluten": { label: "Vivir sin gluten", path: "/vivir-sin-gluten/" },
  "etiquetado-sin-gluten": { label: "Etiquetado sin gluten", path: "/etiquetado-sin-gluten/" },
  "restaurantes-sin-gluten": { label: "Comer fuera", path: "/" },
};

// Cada guía: slug real, cluster, título, descripción para meta/OG, entradilla,
// icono (coherente con la tarjeta equivalente de la SPA) y el cuerpo en HTML
// (encabezados ya promovidos a H2, para que cuelguen directamente del H1 de
// la página en vez del H4 que usaban dentro del acordeón).
const GUIAS = [
  {
    slug: "que-es-el-gluten",
    cluster: "celiaquia",
    icon: "🌾",
    title: "¿Qué es el gluten y quién debe evitarlo?",
    description: "Qué es el gluten, en qué alimentos está y quién necesita evitarlo: celiaquía, sensibilidad al gluten no celíaca, alergia al trigo y dermatitis herpetiforme.",
    lead: "Lo básico antes de empezar: qué es el gluten y por qué hay distintas condiciones médicas que obligan a evitarlo.",
    body: `
      <p>El gluten es un conjunto de proteínas presentes en el trigo, la cebada, el centeno y sus variedades o derivados (espelta, kamut, triticale). Da elasticidad a las masas de pan y pasta, por eso está tan extendido en la alimentación.</p>
      <h2>¿Quién necesita evitarlo?</h2>
      <ul>
        <li><strong>Enfermedad celíaca:</strong> una enfermedad autoinmune crónica, no una alergia ni una intolerancia alimentaria. El gluten daña el intestino delgado incluso en cantidades mínimas.</li>
        <li><strong>Sensibilidad al gluten no celíaca:</strong> produce síntomas similares (digestivos, cansancio, dolor de cabeza) pero sin el daño intestinal ni los anticuerpos propios de la celiaquía.</li>
        <li><strong>Alergia al trigo:</strong> una reacción del sistema inmunitario distinta, que puede incluir síntomas respiratorios o cutáneos.</li>
        <li><strong>Dermatitis herpetiforme:</strong> una manifestación cutánea de la celiaquía.</li>
      </ul>
      <div class="editorial-callout">
        <strong>Atención.</strong> Si sospechas que puedes ser celíaco, no elimines el gluten de tu dieta antes de hacerte las pruebas médicas, porque puede alterar el resultado del diagnóstico. Consulta siempre con un profesional sanitario.
      </div>
    `,
    related: ["alimentos-con-y-sin-gluten", "ingesta-accidental", "glosario"],
  },
  {
    slug: "alimentos-con-y-sin-gluten",
    cluster: "vivir-sin-gluten",
    icon: "🥗",
    title: "Alimentos con gluten y alimentos sin gluten",
    description: "Qué alimentos son naturalmente sin gluten, cuáles lo llevan siempre y los casos especiales (avena, gluten oculto en embutidos, salsas y cereales de desayuno).",
    lead: "Qué evitar y qué es seguro por naturaleza, incluidos los casos donde el gluten se esconde donde no lo esperas.",
    body: `
      <h2>Naturalmente sin gluten</h2>
      <p>Arroz, maíz, quinoa, trigo sarraceno (a pesar del nombre, no lleva gluten), mijo, sorgo, teff, tapioca, legumbres, carne y pescado frescos, huevos, lácteos naturales, frutas, verduras y frutos secos. Puedes ver los valores nutricionales de muchos de ellos en nuestra <a href="${SITE_URL}/#nutricion">tabla nutricional</a>.</p>
      <h2>Llevan gluten</h2>
      <p>El trigo, la cebada, el centeno, la espelta y el triticale, y todo lo elaborado con ellos: pan, pasta y bollería tradicionales, la mayoría de la cerveza, los rebozados y empanados, el seitán y buena parte de la salsa de soja.</p>
      <h2>Casos especiales</h2>
      <ul>
        <li><strong>Avena:</strong> el grano en sí no lleva gluten, pero suele contaminarse con trigo durante el cultivo o el procesado. Solo es segura si está certificada "sin gluten".</li>
        <li><strong>Gluten oculto:</strong> embutidos, salsas, caldos concentrados, helados y cereales de desayuno pueden llevar gluten como espesante o saborizante (a veces en forma de malta de cebada) aunque no lo esperes. Revisa siempre la etiqueta.</li>
      </ul>
    `,
    related: ["que-es-el-gluten", "20-ppm", "hacer-la-compra"],
  },
  {
    slug: "20-ppm",
    cluster: "etiquetado-sin-gluten",
    icon: "🏷️",
    title: "Cómo leer las etiquetas",
    description: "Cómo interpretar una etiqueta sin gluten: alérgenos en negrita, el aviso «puede contener trazas», la espiga barrada y el límite legal de 20 ppm.",
    lead: "Lo que dice (y lo que no dice) un envase: alérgenos, trazas, espiga barrada y declaraciones «sin gluten».",
    body: `
      <ul>
        <li><strong>Alérgenos en negrita:</strong> en la Unión Europea es obligatorio resaltar en la lista de ingredientes los alérgenos, incluidos los cereales con gluten. Es lo primero que debes mirar.</li>
        <li><strong>«Puede contener trazas de...»:</strong> es un aviso voluntario del fabricante sobre riesgo de contaminación cruzada en la fábrica. Cada persona, según su sensibilidad, decide si lo asume o no.</li>
        <li><strong>Símbolo de la espiga barrada:</strong> es un sello de licencia (no obligatorio) que certifica un control más estricto. Su ausencia no significa que el producto lleve gluten, igual que su presencia no es la única garantía válida.</li>
        <li><strong>Límite legal «sin gluten»:</strong> un producto solo puede etiquetarse como «sin gluten» si contiene menos de 20 mg/kg (20 ppm), según el Codex Alimentarius.</li>
      </ul>
    `,
    related: ["alimentos-con-y-sin-gluten", "contaminacion-cruzada", "hacer-la-compra"],
  },
  {
    slug: "contaminacion-cruzada",
    cluster: "vivir-sin-gluten",
    icon: "🍞",
    title: "Contaminación cruzada en casa",
    description: "Cómo evitar la contaminación cruzada en la cocina de casa: tostadora, aceite de freír, almacenamiento de alimentos y limpieza de superficies.",
    lead: "Qué riesgos importan realmente en casa y cómo reducirlos de forma práctica, sin volverse loco.",
    body: `
      <ul>
        <li>Usa una tostadora, tabla de cortar y utensilios distintos para productos con y sin gluten, o límpialos a fondo entre usos.</li>
        <li>No reutilices el aceite de freír de un alimento con gluten (por ejemplo, empanado) para freír algo sin gluten.</li>
        <li>Guarda los productos sin gluten en un estante propio, por encima de los demás, para evitar que caigan migas o harina sobre ellos.</li>
        <li>Lava bien las superficies y las manos después de manipular harina de trigo, antes de preparar algo sin gluten.</li>
        <li>Si vives en un hogar donde no todos comen sin gluten, etiqueta claramente los productos para evitar confusiones.</li>
      </ul>
    `,
    related: ["ingesta-accidental", "20-ppm", "hacer-la-compra"],
  },
  {
    slug: "ingesta-accidental",
    cluster: "celiaquia",
    icon: "⚠️",
    title: "Qué hacer ante una ingesta accidental",
    description: "Qué síntomas son habituales tras comer gluten sin saberlo, qué hacer mientras el intestino se recupera y cuándo conviene consultar al médico.",
    lead: "Si has comido algo con gluten sin saberlo: qué esperar y qué puedes hacer mientras el cuerpo se recupera.",
    body: `
      <p>Antes o después, casi todo el mundo con celiaquía sufre alguna ingesta accidental. No es un fracaso: pasa incluso llevando todas las precauciones.</p>
      <h2>Qué esperar</h2>
      <ul>
        <li>Los síntomas más habituales son dolor abdominal, hinchazón, diarrea o estreñimiento y fatiga. Pueden aparecer a los pocos minutos, varias horas después o incluso al día siguiente.</li>
        <li>No existe nada que «revierta» la ingesta: el intestino necesita tiempo (de días a semanas) para recuperarse por sí solo.</li>
      </ul>
      <h2>Qué puedes hacer mientras tanto</h2>
      <ul>
        <li>Hidrátate bien y opta temporalmente por una dieta blanda y fácil de digerir.</li>
        <li>Algunas personas notan una intolerancia transitoria a la lactosa mientras el intestino se recupera; si es tu caso, reduce los lácteos unos días.</li>
        <li>Anotar qué has comido y cuándo empezaron los síntomas ayuda a identificar el origen y evitarlo la próxima vez.</li>
      </ul>
      <div class="editorial-callout">
        <strong>Atención.</strong> Si los síntomas son intensos, persistentes o te preocupan, consulta con tu médico.
      </div>
    `,
    related: ["que-es-el-gluten", "contaminacion-cruzada", "glosario"],
  },
  {
    slug: "comer-fuera-con-celiaquia",
    cluster: "restaurantes-sin-gluten",
    icon: "🍽️",
    title: "Comer fuera de casa",
    description: "Cómo preparar y afrontar con seguridad las comidas fuera de casa cuando tienes celiaquía o sensibilidad al gluten: qué preguntar y cómo elegir restaurante.",
    lead: "Restaurantes, viajes y comidas con amigos: cómo reducir el riesgo sin dejar de disfrutar de comer fuera.",
    body: `
      <ul>
        <li>Avisa siempre al personal de que es una necesidad médica, no una preferencia: influye en cómo se toman las precauciones en cocina.</li>
        <li>Pregunta por el proceso de cocinado (si usan la misma freidora o plancha para productos con gluten) además de por los ingredientes.</li>
        <li>Consulta el <a href="${SITE_URL}/#restaurantes">ranking de restaurantes</a> de esta web antes de elegir dónde ir.</li>
        <li>Lleva contigo algún snack seguro para imprevistos, sobre todo en viajes o desplazamientos largos.</li>
        <li>Las asociaciones de celíacos locales suelen publicar listados de establecimientos verificados.</li>
      </ul>
    `,
    related: ["viajar", "contaminacion-cruzada", "asociaciones-y-recursos"],
  },
  {
    slug: "viajar",
    cluster: "vivir-sin-gluten",
    icon: "✈️",
    title: "Viajar sin gluten",
    description: "Cómo preparar un viaje sin gluten: tarjeta de celíaco traducida, menú sin gluten en avión, snacks de trayecto y alojamiento con cocina propia.",
    lead: "Preparar el viaje con margen: lo que marca la diferencia entre pasarlo mal y controlar la situación.",
    body: `
      <ul>
        <li>Investiga antes de salir qué supermercados, restaurantes y farmacias del destino tienen opciones sin gluten.</li>
        <li>Lleva una «tarjeta de celíaco» traducida al idioma local (hay plantillas gratuitas online) que explique tu condición y qué debes evitar; facilita mucho pedir en restaurantes donde no hablas el idioma.</li>
        <li>En avión, la mayoría de aerolíneas ofrecen menú sin gluten si lo solicitas con antelación (normalmente 24-48 horas antes del vuelo) al reservar o por su web.</li>
        <li>Lleva snacks seguros para el trayecto: aeropuertos, estaciones y áreas de servicio no siempre tienen opciones fiables.</li>
        <li>Si te alojas en un apartamento con cocina, tendrás mucho más control que dependiendo solo de restaurantes.</li>
        <li>Lleva tus propios medicamentos y suplementos: en otro país puede ser difícil encontrar equivalentes sin gluten o certificados.</li>
      </ul>
    `,
    related: ["comer-fuera-con-celiaquia", "hacer-la-compra", "asociaciones-y-recursos"],
  },
  {
    slug: "hacer-la-compra",
    cluster: "vivir-sin-gluten",
    icon: "🛒",
    title: "Primeros pasos para hacer la compra",
    description: "Qué mirar en el supermercado al hacer la compra sin gluten: sellos de certificación, dónde suele esconderse el gluten y cómo resolver dudas con un producto.",
    lead: "Qué mirar en el supermercado la primera vez, y dónde suele esconderse el gluten cuando menos te lo esperas.",
    body: `
      <ul>
        <li>Busca un sello o certificación «sin gluten» reconocida, y en su ausencia, revisa siempre la lista de ingredientes.</li>
        <li>Echa un vistazo a nuestras <a href="${SITE_URL}/#tiendas">tiendas especializadas</a>, con más variedad y personal habituado a resolver dudas.</li>
        <li>Ten especial cuidado con los productos donde el gluten se esconde más a menudo: embutidos, salsas y especias mezcladas, caldos concentrados, helados, patatas fritas de bolsa saborizadas, chocolates con galleta o barquillo, cerveza y algunos medicamentos o suplementos (por los excipientes).</li>
        <li>Ante la duda con un producto envasado, usa el <a href="${SITE_URL}/#escaner">escáner de códigos de barras</a> de esta web.</li>
      </ul>
    `,
    related: ["alimentos-con-y-sin-gluten", "20-ppm", "que-es-el-gluten"],
  },
  {
    slug: "celiaquia-en-ninos",
    cluster: "celiaquia",
    icon: "🧒",
    title: "Celiaquía en niños",
    description: "Cómo afrontar la celiaquía en niños: síntomas habituales, gestión del menú sin gluten en el colegio y cómo vivir cumpleaños y celebraciones sin exclusión.",
    lead: "Diagnóstico, colegio y celebraciones: cómo ayudar a que lo viva con normalidad.",
    body: `
      <p>En los niños, la celiaquía puede dar síntomas digestivos claros (diarrea, dolor abdominal, hinchazón) pero también señales menos evidentes, como retraso del crecimiento, irritabilidad o falta de apetito. Muchos casos son incluso asintomáticos y se detectan por otras vías. El diagnóstico siempre lo hace un pediatra o digestivo infantil.</p>
      <h2>En el colegio</h2>
      <ul>
        <li>Informa por escrito a tutores, profesorado y comedor escolar, y confirma cómo gestionan el menú sin gluten y la contaminación cruzada en la cocina del centro.</li>
        <li>Prepara con el colegio un protocolo para excursiones, talleres de cocina o fiestas donde pueda haber alimentos no controlados.</li>
      </ul>
      <h2>Cumpleaños y celebraciones</h2>
      <ul>
        <li>Lleva su propia porción de tarta o snack a cumpleaños y celebraciones para que pueda participar sin quedar excluido.</li>
        <li>Habla con otras familias del entorno para que sepan qué puede o no puede comer, sin que resulte incómodo para el niño.</li>
      </ul>
      <p>Según su edad, ve implicando al niño en reconocer qué alimentos son seguros: ayuda a que gane autonomía y lo viva con normalidad, no como una restricción constante.</p>
    `,
    related: ["que-es-el-gluten", "ingesta-accidental", "asociaciones-y-recursos"],
  },
  {
    slug: "glosario",
    cluster: "celiaquia",
    icon: "📖",
    title: "Glosario rápido",
    description: "Glosario de términos habituales sobre celiaquía y gluten: celiaquía, sensibilidad al gluten no celíaca, alergia al trigo, contaminación cruzada, ppm y espiga barrada.",
    lead: "Términos que verás a menudo en esta web y en cualquier producto o consulta relacionada con el gluten.",
    body: `
      <ul>
        <li><strong>Celiaquía:</strong> enfermedad autoinmune crónica en la que el gluten daña el intestino delgado.</li>
        <li><strong>Sensibilidad al gluten no celíaca (SGNC):</strong> síntomas similares a la celiaquía pero sin el daño intestinal ni los marcadores propios de esta.</li>
        <li><strong>Alergia al trigo:</strong> reacción del sistema inmunitario al trigo, distinta de la celiaquía.</li>
        <li><strong>Contaminación cruzada:</strong> contacto accidental de un alimento sin gluten con restos de otro que sí lo contiene.</li>
        <li><strong>ppm (partes por millón):</strong> unidad usada para medir la cantidad de gluten en un alimento; el límite legal para «sin gluten» es 20 ppm.</li>
        <li><strong>Espiga barrada:</strong> símbolo internacional de licencia que certifica controles adicionales sobre un producto sin gluten.</li>
      </ul>
    `,
    related: ["que-es-el-gluten", "20-ppm", "asociaciones-y-recursos"],
  },
  {
    slug: "asociaciones-y-recursos",
    cluster: "celiaquia",
    icon: "🤝",
    title: "Asociaciones y recursos en España",
    description: "Dónde encontrar más apoyo si tienes celiaquía en España: FACE, asociaciones autonómicas y qué puede resolver tu centro de salud.",
    lead: "Dónde encontrar más apoyo, más allá de lo que puede ofrecer un solo sitio web.",
    body: `
      <ul>
        <li><strong>FACE (Federación de Asociaciones de Celíacos de España):</strong> agrupa a las asociaciones autonómicas y publica listados de establecimientos y marcas de confianza.</li>
        <li><strong>Asociación de celíacos de tu comunidad autónoma:</strong> cada una suele mantener su propio listado local de restaurantes, tiendas y eventos, más detallado que el nacional.</li>
        <li><strong>Tu centro de salud:</strong> el pediatra, digestivo o dietista-nutricionista pueden derivarte a asociaciones y recursos de tu zona, y resolver dudas médicas que esta guía no cubre.</li>
        <li>Esta web complementa esos recursos con <a href="${SITE_URL}/#tiendas">tiendas especializadas</a>, un <a href="${SITE_URL}/#restaurantes">ranking de restaurantes</a>, una <a href="${SITE_URL}/#nutricion">tabla nutricional</a> y un <a href="${SITE_URL}/#escaner">escáner de productos</a>.</li>
      </ul>
    `,
    related: ["celiaquia-en-ninos", "comer-fuera-con-celiaquia", "glosario"],
  },
];

const BY_SLUG = Object.fromEntries(GUIAS.map((g) => [g.slug, g]));

function urlFor(guia) {
  const cluster = CLUSTERS[guia.cluster];
  // El único artículo del cluster de etiquetado vive en la raíz del propio
  // cluster (no hace falta una página-índice separada para un solo artículo).
  if (guia.cluster === "etiquetado-sin-gluten") return cluster.path;
  if (guia.cluster === "restaurantes-sin-gluten") return `/restaurantes-sin-gluten/${guia.slug}/`;
  return `${cluster.path}${guia.slug}/`;
}

function fileFor(urlPath) {
  return path.join(ROOT, urlPath.replace(/^\//, ""), "index.html");
}

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
        <button class="header-search-btn menu-toggle" id="menuToggle" type="button" aria-label="Abrir menú" aria-haspopup="true" aria-expanded="false" aria-controls="pillNav">
          <span aria-hidden="true">☰</span>
        </button>
      </div>
      <nav class="pill-nav" id="pillNav" aria-label="Secciones">
        <a class="pill-btn" href="${SITE_URL}/#guia"><span class="pill-icon" aria-hidden="true">🔰</span>Guías</a>
        <a class="pill-btn" href="${SITE_URL}/#tiendas"><span class="pill-icon" aria-hidden="true">🏬</span>Productos</a>
        <a class="pill-btn" href="${SITE_URL}/#restaurantes"><span class="pill-icon" aria-hidden="true">📍</span>Comer fuera</a>
        <a class="pill-btn" href="${SITE_URL}/#recetas"><span class="pill-icon" aria-hidden="true">🍳</span>Recetas</a>
        <a class="pill-btn" href="${SITE_URL}/#actualidad"><span class="pill-icon" aria-hidden="true">📰</span>Actualidad</a>
      </nav>
    </div>
  </header>`;
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
        <a href="${SITE_URL}/#tiendas">Productos</a>
        <a href="${SITE_URL}/#restaurantes">Restaurantes</a>
        <a href="${SITE_URL}/#recetas">Recetas</a>
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

function breadcrumbsHtml(guia) {
  const cluster = CLUSTERS[guia.cluster];
  const items = [{ label: "Inicio", url: `${SITE_URL}/` }];
  if (guia.cluster !== "etiquetado-sin-gluten") {
    items.push({ label: cluster.label, url: `${SITE_URL}${cluster.path}` });
  }
  items.push({ label: guia.title, url: null });

  const linksHtml = items
    .map((item, i) => {
      const isLast = i === items.length - 1;
      const crumb = isLast
        ? `<span aria-current="page">${escapeHtml(item.label)}</span>`
        : `<a href="${item.url}">${escapeHtml(item.label)}</a>`;
      return i === 0 ? crumb : `<span class="breadcrumb-sep" aria-hidden="true">/</span>${crumb}`;
    })
    .join(" ");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.url || `${SITE_URL}${urlFor(guia)}`,
    })),
  };

  return { linksHtml, breadcrumbJsonLd };
}

function relatedHtml(guia) {
  const related = guia.related.map((slug) => BY_SLUG[slug]).filter(Boolean);
  if (related.length === 0) return "";
  const cards = related
    .map(
      (r) => `
        <a class="guide-card" href="${SITE_URL}${urlFor(r)}">
          <span class="guide-category">${escapeHtml(CLUSTERS[r.cluster].label)}</span>
          <h3>${escapeHtml(r.title)}</h3>
          <p>${escapeHtml(r.lead)}</p>
        </a>`
    )
    .join("");
  return `
    <div class="related-section">
      <h2>También puede interesarte</h2>
      <div class="guide-grid">${cards}</div>
    </div>`;
}

function buildArticlePage(guia) {
  const urlPath = urlFor(guia);
  const canonicalUrl = `${SITE_URL}${urlPath}`;
  const cssHash = fileHash("css/styles.css");
  const jsHash = fileHash("js/static-page.js");
  const { linksHtml, breadcrumbJsonLd } = breadcrumbsHtml(guia);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guia.title,
    description: guia.description,
    url: canonicalUrl,
    datePublished: TODAY,
    dateModified: TODAY,
    inLanguage: "es-ES",
    author: { "@type": "Organization", name: "Libre de Trigo", url: `${SITE_URL}/` },
    publisher: {
      "@type": "Organization",
      name: "Libre de Trigo",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(guia.title)} | Libre de Trigo</title>
  <meta name="description" content="${escapeHtml(guia.description)}" />
  <meta name="theme-color" content="#1f4a43" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Libre de Trigo" />
  <meta property="og:title" content="${escapeHtml(guia.title)} | Libre de Trigo" />
  <meta property="og:description" content="${escapeHtml(guia.description)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" type="image/png" href="${SITE_URL}/img/favicon.png" />
  <script type="application/ld+json">
${JSON.stringify(articleJsonLd, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(breadcrumbJsonLd, null, 2)}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${SITE_URL}/css/styles.css?v=${cssHash}" />
</head>
<body>${headerHtml()}
  <main class="container article-page">
    <nav class="breadcrumbs" aria-label="Migas de pan">${linksHtml}</nav>

    <span class="eyebrow">${escapeHtml(CLUSTERS[guia.cluster].label)}</span>
    <h1 class="section-title">${escapeHtml(guia.title)}</h1>
    <p class="article-lead">${escapeHtml(guia.lead)}</p>
    <p class="article-meta">Actualizado: ${UPDATED_LABEL}</p>

    <div class="article-body legal-content">
      ${guia.body}
    </div>

    ${relatedHtml(guia)}
  </main>${footerHtml()}
  <script src="${SITE_URL}/js/analytics.js?v=${fileHash("js/analytics.js")}"></script>
  <script src="${SITE_URL}/js/static-page.js?v=${jsHash}"></script>
</body>
</html>
`;
}

function buildHubPage(clusterKey) {
  const cluster = CLUSTERS[clusterKey];
  const guiasInCluster = GUIAS.filter((g) => g.cluster === clusterKey);
  const canonicalUrl = `${SITE_URL}${cluster.path}`;
  const cssHash = fileHash("css/styles.css");
  const jsHash = fileHash("js/static-page.js");
  const description = `Guías sobre ${cluster.label.toLowerCase()}: ${guiasInCluster.map((g) => g.title.toLowerCase()).join(", ")}.`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: cluster.label, item: canonicalUrl },
    ],
  };

  const cards = guiasInCluster
    .map(
      (g) => `
        <a class="guide-card" href="${SITE_URL}${urlFor(g)}">
          <span class="guide-category">${escapeHtml(cluster.label)}</span>
          <h3>${escapeHtml(g.title)}</h3>
          <p>${escapeHtml(g.lead)}</p>
        </a>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(cluster.label)} | Guías | Libre de Trigo</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="#1f4a43" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Libre de Trigo" />
  <meta property="og:title" content="${escapeHtml(cluster.label)} | Guías | Libre de Trigo" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" type="image/png" href="${SITE_URL}/img/favicon.png" />
  <script type="application/ld+json">
${JSON.stringify(breadcrumbJsonLd, null, 2)}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${SITE_URL}/css/styles.css?v=${cssHash}" />
</head>
<body>${headerHtml()}
  <main class="container article-page">
    <nav class="breadcrumbs" aria-label="Migas de pan">
      <a href="${SITE_URL}/">Inicio</a> <span class="breadcrumb-sep" aria-hidden="true">/</span> <span aria-current="page">${escapeHtml(cluster.label)}</span>
    </nav>

    <span class="eyebrow">Guías</span>
    <h1 class="section-title">${escapeHtml(cluster.label)}</h1>
    <p class="article-lead">${escapeHtml(description)}</p>

    <div class="guide-grid hub-grid">${cards}</div>
  </main>${footerHtml()}
  <script src="${SITE_URL}/js/analytics.js?v=${fileHash("js/analytics.js")}"></script>
  <script src="${SITE_URL}/js/static-page.js?v=${jsHash}"></script>
</body>
</html>
`;
}

function writeFile(urlPath, html) {
  const filePath = fileFor(urlPath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

function main() {
  GUIAS.forEach((guia) => {
    writeFile(urlFor(guia), buildArticlePage(guia));
  });

  ["celiaquia", "vivir-sin-gluten"].forEach((clusterKey) => {
    writeFile(CLUSTERS[clusterKey].path, buildHubPage(clusterKey));
  });

  const allUrls = GUIAS.map(urlFor).concat(["/celiaquia/", "/vivir-sin-gluten/"]);
  console.log(`[build-guias] ${GUIAS.length} páginas de guía + 2 páginas-índice generadas (${allUrls.length} URLs).`);

  // Devuelve la lista de rutas para que prerender.js las añada al sitemap.
  return allUrls;
}

if (require.main === module) {
  main();
}

module.exports = { main, GUIAS, urlFor, CLUSTERS };
