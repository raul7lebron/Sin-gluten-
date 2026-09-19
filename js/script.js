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

  pillButtons.forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.dataset.target));
  });

  document.querySelectorAll("[data-scroll-target]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      activateTab(link.dataset.scrollTarget);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Al recargar, vuelve a abrir la última página visitada en este dispositivo en vez de
  // ir siempre a Inicio.
  try {
    const lastTab = localStorage.getItem(ACTIVE_TAB_KEY);
    if (lastTab && pages.some((page) => page.id === lastTab)) activateTab(lastTab);
  } catch (err) {
    // Almacenamiento no disponible: se queda en Inicio, la página por defecto.
  }

  const activeBtn = nav.querySelector(".pill-btn.active") || pillButtons[0];
  moveIndicator(activeBtn);
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

  const recetaSearch = document.getElementById("recetaSearch");
  if (recetaSearch) {
    recetaSearch.addEventListener("input", () => {
      renderRecetas(recetaSearch.value);
      bindRecipeToggles();
    });
  }

  const calorieFilter = document.getElementById("calorieFilter");
  const semanaFilter = document.getElementById("semanaFilter");
  if (calorieFilter && semanaFilter) {
    function currentKcal() {
      const active = calorieFilter.querySelector(".filter-chip.active");
      return active ? active.dataset.kcal : Object.keys(planesCalorias)[0];
    }

    function currentSemana() {
      const active = semanaFilter.querySelector(".filter-chip.active");
      return active ? Number(active.dataset.semana) : 0;
    }

    function refreshPlan() {
      renderPlanMeta(currentKcal());
      renderPlanDias(currentKcal(), currentSemana());
      bindRecipeToggles();
    }

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
      const errorEl = document.getElementById("calcError");
      const resultEl = document.getElementById("calcResult");

      if (!edad || !altura || !peso || edad < 14 || edad > 100 || altura < 120 || altura > 230 || peso < 30 || peso > 250) {
        errorEl.hidden = false;
        resultEl.hidden = true;
        return;
      }
      errorEl.hidden = true;

      const bmr = sexo === "hombre" ? 10 * peso + 6.25 * altura - 5 * edad + 5 : 10 * peso + 6.25 * altura - 5 * edad - 161;
      const tdee = Math.round(bmr * actividad);

      const niveles = Object.keys(planesCalorias).map(Number);
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
