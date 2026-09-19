// Sustituye por tu ID de medición real de Google Analytics 4 (formato "G-XXXXXXXXXX"),
// que se obtiene en Google Analytics > Administrar > Flujos de datos > tu flujo web.
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

const COOKIE_CONSENT_KEY = "libreDeTrigoCookieConsent";

function getStoredConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch (err) {
    return null;
  }
}

function setStoredConsent(value) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch (err) {
    // Almacenamiento no disponible (navegación privada, cookies de terceros bloqueadas, etc.):
    // simplemente no se recuerda la elección entre visitas.
  }
}

function loadGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.includes("XXXX")) {
    console.warn("[analytics] GA_MEASUREMENT_ID no configurado todavía: no se carga Google Analytics.");
    return;
  }
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
}

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("cookieAccept");
  const rejectBtn = document.getElementById("cookieReject");
  const prefsLink = document.getElementById("cookiePrefsLink");
  if (!banner || !acceptBtn || !rejectBtn) return;

  function showBanner() {
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  const consent = getStoredConsent();
  if (consent === "accepted") {
    loadGoogleAnalytics();
  } else if (consent !== "rejected") {
    showBanner();
  }

  acceptBtn.addEventListener("click", () => {
    setStoredConsent("accepted");
    loadGoogleAnalytics();
    hideBanner();
  });

  rejectBtn.addEventListener("click", () => {
    setStoredConsent("rejected");
    hideBanner();
  });

  if (prefsLink) {
    prefsLink.addEventListener("click", () => {
      showBanner();
    });
  }
});
