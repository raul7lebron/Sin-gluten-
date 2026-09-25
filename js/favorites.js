// Recetas favoritas: se guardan solo en este dispositivo (localStorage), igual
// que la lista de la compra o el historial del escáner. En la SPA (pestaña
// Recetas), js/render.js y js/script.js llaman a getFavoritos()/toggleFavorito()
// directamente para pintar y gestionar varios corazones a la vez. En las
// páginas estáticas de receta (build-recetas.js) hay un único botón por
// página, marcado con data-standalone, que este archivo inicializa solo.
// También inicializa ahí el botón "Compartir" de cada receta.
const FAVORITOS_KEY = "libreDeTrigoFavoritos";

function getFavoritos() {
  try {
    const raw = localStorage.getItem(FAVORITOS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveFavoritos(favoritos) {
  try {
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
  } catch (err) {
    // Almacenamiento no disponible (navegación privada, etc.): los favoritos solo duran esta sesión.
  }
}

function esFavorito(slug) {
  return getFavoritos().includes(slug);
}

function toggleFavorito(slug) {
  const favoritos = getFavoritos();
  const idx = favoritos.indexOf(slug);
  if (idx === -1) favoritos.push(slug);
  else favoritos.splice(idx, 1);
  saveFavoritos(favoritos);
  return favoritos.includes(slug);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".recipe-fav-toggle[data-standalone]").forEach((btn) => {
    const slug = btn.dataset.slug;

    function render() {
      const activo = esFavorito(slug);
      btn.textContent = activo ? "❤️ Guardada en favoritas" : "🤍 Guardar en favoritas";
      btn.classList.toggle("active", activo);
      btn.setAttribute("aria-pressed", String(activo));
    }

    render();
    btn.addEventListener("click", () => {
      toggleFavorito(slug);
      render();
    });
  });

  // Botón "Compartir" de cada página de receta: usa el diálogo nativo del
  // sistema si está disponible (móvil, sobre todo) y si no, copia el enlace.
  document.querySelectorAll(".recipe-share-toggle").forEach((btn) => {
    const title = btn.dataset.shareTitle;
    const url = btn.dataset.shareUrl;

    btn.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({ title, url });
        } catch (err) {
          // El usuario cerró el diálogo de compartir sin elegir nada.
        }
        return;
      }
      try {
        await navigator.clipboard.writeText(url);
        const textoOriginal = btn.textContent;
        btn.textContent = "✓ Enlace copiado";
        setTimeout(() => {
          btn.textContent = textoOriginal;
        }, 1500);
      } catch (err) {
        // Portapapeles no disponible: no se puede ofrecer una alternativa mejor.
      }
    });
  });
});
