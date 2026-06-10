/* =========================================================
   Jéssica Machado — interações do site
   ========================================================= */
(function () {
  "use strict";

  /* --- Menu mobile --- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav-menu");
  let backdrop = null;

  function openMenu() {
    nav.classList.add("open");
    toggle.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    if (backdrop) backdrop.classList.add("show");
  }
  function closeMenu() {
    nav.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    if (backdrop) backdrop.classList.remove("show");
  }

  if (toggle && nav) {
    // backdrop para fechar ao tocar fora
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);
    backdrop.addEventListener("click", closeMenu);

    toggle.addEventListener("click", function () {
      if (nav.classList.contains("open")) closeMenu();
      else openMenu();
    });
    // fecha ao clicar num link
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    // fecha com ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    // fecha ao voltar para desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* --- Reveal ao rolar --- */
  const revealEls = document.querySelectorAll(
    ".pillar, .card, .about-text, .about-photo, .split-text, .emergency, .book, .section-head, .hero-text, .hero-art, .lp-hero-text, .capture-card, .area-card, .tl-item, .step, .faq-item"
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

  /* --- Formulário de captura → WhatsApp (sem backend/API) --- */
  document.querySelectorAll(".capture-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const phone = form.dataset.phone || "5569999844141";
      const intro = form.dataset.intro || "Olá Jéssica! Vim pelo site.";
      let msg = intro + "\n";
      new FormData(form).forEach(function (value, key) {
        const v = String(value).trim();
        if (v) msg += "\n*" + key + ":* " + v;
      });
      const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(msg);
      window.open(url, "_blank", "noopener");
    });
  });

  /* --- Ano atual no rodapé --- */
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
