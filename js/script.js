document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("pillNav");
  const indicator = document.getElementById("pillIndicator");
  const pillButtons = Array.from(nav.querySelectorAll(".pill-btn"));
  const pages = Array.from(document.querySelectorAll(".page"));

  function moveIndicator(btn) {
    indicator.style.width = `${btn.offsetWidth}px`;
    indicator.style.transform = `translateX(${btn.offsetLeft - 4}px)`;
  }

  function setActivePage(target) {
    pages.forEach((page) => page.classList.toggle("active", page.id === target));
  }

  const ACTIVE_TAB_KEY = "libreDeTrigoActiveTab";

  function activateTab(target) {
    const btn = pillButtons.find((b) => b.dataset.target === target);
    pillButtons.forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
    if (btn) {
      moveIndicator(btn);
    } else {
      indicator.style.width = "0px";
    }
    setActivePage(target);
    try {
      localStorage.setItem(ACTIVE_TAB_KEY, target);
    } catch (err) {
      // Almacenamiento no disponible (navegación privada, etc.): no se recuerda la página.
    }
  }

  // Menú desplegable en móvil: en pantallas estrechas el menú de pestañas se convierte
  // en un desplegable que se abre/cierra con este botón, a la altura del logo y la lupa.
  const menuToggle = document.getElementById("menuToggle");

  function closeMobileMenu() {
    nav.classList.remove("nav-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.querySelector("span").textContent = "☰";
    }
  }

  function openMobileMenu() {
    nav.classList.add("nav-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.querySelector("span").textContent = "✕";
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (nav.classList.contains("nav-open")) closeMobileMenu();
      else openMobileMenu();
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("nav-open")) return;
      if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
      closeMobileMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("nav-open")) closeMobileMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 640) closeMobileMenu();
    });
  }

  // Menú "Herramientas" del header: Dietas, Calculadora, Tabla nutricional,
  // Escáner y Lista de la compra, como acceso secundario frente a las 5
  // secciones principales del pill-nav.
  const toolsToggle = document.getElementById("toolsToggle");
  const toolsMenu = document.getElementById("toolsMenu");

  function closeToolsMenu() {
    if (!toolsMenu) return;
    toolsMenu.hidden = true;
    if (toolsToggle) toolsToggle.setAttribute("aria-expanded", "false");
  }

  function openToolsMenu() {
    if (!toolsMenu) return;
    toolsMenu.hidden = false;
    if (toolsToggle) toolsToggle.setAttribute("aria-expanded", "true");
  }

  if (toolsToggle && toolsMenu) {
    toolsToggle.addEventListener("click", () => {
      if (toolsMenu.hidden) openToolsMenu();
      else closeToolsMenu();
    });

    toolsMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeToolsMenu);
    });

    document.addEventListener("click", (event) => {
      if (toolsMenu.hidden) return;
      if (toolsMenu.contains(event.target) || toolsToggle.contains(event.target)) return;
      closeToolsMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !toolsMenu.hidden) closeToolsMenu();
    });
  }

  pillButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activateTab(btn.dataset.target);
      closeMobileMenu();
    });
  });

  document.querySelectorAll("[data-scroll-target]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      activateTab(link.dataset.scrollTarget);
      closeMobileMenu();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Al recargar, vuelve a abrir la última página visitada en este dispositivo en vez de
  // ir siempre a la portada.
  try {
    const lastTab = localStorage.getItem(ACTIVE_TAB_KEY);
    if (lastTab && pages.some((page) => page.id === lastTab)) activateTab(lastTab);
  } catch (err) {
    // Almacenamiento no disponible: se queda en la portada, la página por defecto.
  }

  const activeBtn = nav.querySelector(".pill-btn.active");
  if (activeBtn) moveIndicator(activeBtn);
  else indicator.style.width = "0px";
  window.addEventListener("resize", () => {
    const active = nav.querySelector(".pill-btn.active");
    if (active) moveIndicator(active);
  });

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  });

  function bindRecipeToggles() {
    document.querySelectorAll(".recipe-toggle").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const card = toggle.closest(".recipe-card");
        const isOpen = card.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    });
  }

  bindRecipeToggles();

  const objetivoFilter = document.getElementById("objetivoFilter");
  const calorieFilter = document.getElementById("calorieFilter");
  const semanaFilter = document.getElementById("semanaFilter");
  if (objetivoFilter && calorieFilter && semanaFilter) {
    function currentObjetivo() {
      const active = objetivoFilter.querySelector(".filter-chip.active");
      return active ? active.dataset.objetivo : Object.keys(planesPorObjetivo)[0];
    }

    function currentKcal() {
      const active = calorieFilter.querySelector(".filter-chip.active");
      return active ? active.dataset.kcal : Object.keys(planesPorObjetivo[currentObjetivo()].planes)[0];
    }

    function currentSemana() {
      const active = semanaFilter.querySelector(".filter-chip.active");
      return active ? Number(active.dataset.semana) : 0;
    }

    function refreshPlan() {
      renderPlanMeta(currentObjetivo(), currentKcal());
      renderPlanDias(currentObjetivo(), currentKcal(), currentSemana());
      bindRecipeToggles();
    }

    objetivoFilter.addEventListener("click", (event) => {
      const chip = event.target.closest(".filter-chip");
      if (!chip) return;
      objetivoFilter.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderCalorieFilter(currentObjetivo());
      semanaFilter.querySelectorAll(".filter-chip").forEach((c, i) => c.classList.toggle("active", i === 0));
      refreshPlan();
    });

    calorieFilter.addEventListener("click", (event) => {
      const chip = event.target.closest(".filter-chip");
      if (!chip) return;
      calorieFilter.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      refreshPlan();
    });

    semanaFilter.addEventListener("click", (event) => {
      const chip = event.target.closest(".filter-chip");
      if (!chip) return;
      semanaFilter.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      refreshPlan();
    });
  }

  const calcSubmit = document.getElementById("calcSubmit");
  if (calcSubmit) {
    calcSubmit.addEventListener("click", () => {
      const sexo = document.getElementById("calcSexo").value;
      const edad = Number(document.getElementById("calcEdad").value);
      const altura = Number(document.getElementById("calcAltura").value);
      const peso = Number(document.getElementById("calcPeso").value);
      const actividad = Number(document.getElementById("calcActividad").value);
      const metabolismo = Number(document.getElementById("calcMetabolismo").value);
      const errorEl = document.getElementById("calcError");
      const resultEl = document.getElementById("calcResult");

      if (!edad || !altura || !peso || edad < 14 || edad > 100 || altura < 120 || altura > 230 || peso < 30 || peso > 250) {
        errorEl.hidden = false;
        resultEl.hidden = true;
        return;
      }
      errorEl.hidden = true;

      const bmr = sexo === "hombre" ? 10 * peso + 6.25 * altura - 5 * edad + 5 : 10 * peso + 6.25 * altura - 5 * edad - 161;
      const tdee = Math.round(bmr * actividad * metabolismo);

      const niveles = Object.keys(planesPorObjetivo["perder-peso"].planes).map(Number);
      const recomendado = niveles.reduce((prev, curr) => (Math.abs(curr - tdee) < Math.abs(prev - tdee) ? curr : prev));

      resultEl.innerHTML = `
        <p class="calc-tdee">Mantenimiento estimado: <strong>~${tdee.toLocaleString("es-ES")} kcal/día</strong></p>
        <p>Plan de 4 semanas recomendado según tu resultado:</p>
        <button class="btn-primary calc-goto" type="button" data-kcal="${recomendado}">Ver plan de ${recomendado} kcal</button>
      `;
      resultEl.hidden = false;

      const gotoBtn = resultEl.querySelector(".calc-goto");
      gotoBtn.addEventListener("click", () => {
        const chip = calorieFilter && calorieFilter.querySelector(`[data-kcal="${recomendado}"]`);
        if (chip) chip.click();
        activateTab("dietas");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  const nutriFilter = document.getElementById("nutriFilter");
  const nutriCategoriaToggle = document.getElementById("nutriCategoriaToggle");
  const nutriCategoriaPanel = document.getElementById("nutriCategoriaPanel");
  const nutriCategoriaLabel = document.getElementById("nutriCategoriaLabel");
  if (nutriFilter && nutriCategoriaToggle && nutriCategoriaPanel) {
    function currentNutriCategoria() {
      const active = nutriFilter.querySelector(".filter-chip.active");
      return active ? active.dataset.categoria : "todos";
    }

    function refreshNutri() {
      renderNutricion(currentNutriCategoria());
    }

    function closeNutriCategoria() {
      nutriCategoriaPanel.classList.remove("open");
      nutriCategoriaToggle.setAttribute("aria-expanded", "false");
    }

    function openNutriCategoria() {
      nutriCategoriaPanel.classList.add("open");
      nutriCategoriaToggle.setAttribute("aria-expanded", "true");
    }

    nutriCategoriaToggle.addEventListener("click", () => {
      if (nutriCategoriaPanel.classList.contains("open")) closeNutriCategoria();
      else openNutriCategoria();
    });

    document.addEventListener("click", (event) => {
      if (!nutriCategoriaPanel.classList.contains("open")) return;
      if (nutriCategoriaPanel.contains(event.target) || nutriCategoriaToggle.contains(event.target)) return;
      closeNutriCategoria();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nutriCategoriaPanel.classList.contains("open")) closeNutriCategoria();
    });

    nutriFilter.addEventListener("click", (event) => {
      const chip = event.target.closest(".filter-chip");
      if (!chip) return;
      nutriFilter.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      if (nutriCategoriaLabel) nutriCategoriaLabel.textContent = chip.textContent;
      closeNutriCategoria();
      refreshNutri();
    });
  }

  const ciudadFilter = document.getElementById("ciudadFilter");
  if (ciudadFilter) {
    ciudadFilter.addEventListener("click", (event) => {
      const chip = event.target.closest(".filter-chip");
      if (!chip) return;

      ciudadFilter.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      renderRestaurantes(chip.dataset.ciudad);
    });
  }

  window.libreDeTrigo = { activateTab, bindRecipeToggles };
});
