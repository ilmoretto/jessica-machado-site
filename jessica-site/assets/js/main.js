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

  /* --- Portabilidade de domínio: ajusta canonical/OG ao endereço atual,
         para que trocar de domínio/hospedagem não exija editar cada página. --- */
  (function () {
    var clean = location.href.split("#")[0].split("?")[0];
    var canon = document.querySelector('link[rel="canonical"]');
    if (canon) canon.setAttribute("href", clean);
    var ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", clean);
    var mark = document.querySelector(".brand-mark");
    var ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg && mark && mark.src) {
      ogImg.setAttribute("content", mark.src.replace("logo-jessica-sm", "logo-jessica"));
    }
  })();

  /* --- Rastreio de cliques (Google Analytics): registra qual link/botão
         foi clicado, com texto, destino e página de origem. --- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("a, button");
    if (!el || typeof window.gtag !== "function") return;
    var texto = (el.textContent || el.getAttribute("aria-label") || "")
      .replace(/\s+/g, " ").trim().slice(0, 100);
    var url = el.getAttribute("href") || "";
    var tipo = "link";
    if (/wa\.me|whatsapp/i.test(url)) tipo = "whatsapp";
    else if (/mailto:/i.test(url)) tipo = "email";
    else if (/amazon\./i.test(url)) tipo = "livro_amazon";
    else if (el.tagName === "BUTTON") tipo = "botao";
    window.gtag("event", "clique_link", {
      link_texto: texto,
      link_url: url,
      tipo_link: tipo,
      pagina: location.pathname
    });
  }, true);

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

  /* --- Formulário de captura → WhatsApp (forms sem banco; os com
         [data-collection] são tratados por lead.js: Firestore + WhatsApp) --- */
  document.querySelectorAll(".capture-form:not([data-collection])").forEach(function (form) {
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

  /* --- Aviso de cookies (LGPD) --- */
  (function () {
    try { if (localStorage.getItem("cookieConsent") === "ok") return; } catch (e) {}
    var bar = document.createElement("div");
    bar.className = "cookie-bar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Aviso de cookies");
    bar.innerHTML =
      '<p>Usamos cookies para entender como você usa o site e melhorar sua ' +
      'experiência. Ao continuar navegando, você concorda com o uso de cookies de análise.</p>' +
      '<div class="cookie-actions"><button type="button" class="btn btn-primary" id="cookie-ok">Aceitar</button></div>';
    document.body.appendChild(bar);
    document.body.classList.add("cookies-pending");
    bar.querySelector("#cookie-ok").addEventListener("click", function () {
      try { localStorage.setItem("cookieConsent", "ok"); } catch (e) {}
      bar.remove();
      document.body.classList.remove("cookies-pending");
    });
  })();

  /* --- Ano atual no rodapé --- */
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
