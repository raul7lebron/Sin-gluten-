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

  pillButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      pillButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      moveIndicator(btn);
      setActivePage(btn.dataset.target);
    });
  });

  const activeBtn = nav.querySelector(".pill-btn.active") || pillButtons[0];
  moveIndicator(activeBtn);
  window.addEventListener("resize", () => moveIndicator(nav.querySelector(".pill-btn.active")));

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  });

  document.querySelectorAll(".recipe-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const card = toggle.closest(".recipe-card");
      const isOpen = card.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });
});
