// Menú desplegable en móvil para las páginas estáticas de guías (fuera de la
// SPA de index.html): mismo comportamiento que el menú de index.template.html,
// pero sin nada de lógica de pestañas, porque aquí no hay pestañas que cambiar.
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("pillNav");
  const menuToggle = document.getElementById("menuToggle");
  if (!nav || !menuToggle) return;

  function closeMenu() {
    nav.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector("span").textContent = "☰";
  }

  function openMenu() {
    nav.classList.add("nav-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.querySelector("span").textContent = "✕";
  }

  menuToggle.addEventListener("click", () => {
    if (nav.classList.contains("nav-open")) closeMenu();
    else openMenu();
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("nav-open")) return;
    if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("nav-open")) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) closeMenu();
  });
});
