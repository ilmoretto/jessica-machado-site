/* =========================================================
   Jéssica Machado — interações do site
   ========================================================= */
(function () {
  "use strict";

  /* --- Menu mobile --- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav-menu");

  function closeMenu() {
    nav.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    // fecha ao clicar num link
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    // fecha com ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* --- Reveal ao rolar --- */
  const revealEls = document.querySelectorAll(
    ".pillar, .card, .about-text, .about-photo, .split-text, .emergency, .book, .section-head, .hero-text, .hero-art"
  );
  revealEls.forEach(function (el) { el.setAttribute("data-reveal", ""); });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* --- Ano atual no rodapé --- */
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
