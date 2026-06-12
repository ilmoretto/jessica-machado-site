/* ============================================================
   CAPTURA DE LEADS → Firestore (multi-projeto) + WhatsApp
   Atua em formulários com [data-collection].
   - data-fb        → qual projeto Firebase usar (neuro | clinica)
   - data-collection→ coleção onde grava o lead
   - Sempre abre o WhatsApp (funciona mesmo sem Firebase).
   - Grava no Firestore em paralelo, se o projeto estiver configurado.
   ============================================================ */
(function () {
  "use strict";

  var forms = document.querySelectorAll(".capture-form[data-collection]");
  if (!forms.length) return;

  var CONFIGS = window.FIREBASE_CONFIGS || {};
  var fbLib = null;   // promise de [appMod, fsMod]
  var apps = {};      // nome → promise de { db, fs }

  function loadFirebase() {
    if (!fbLib) {
      fbLib = Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")
      ]);
    }
    return fbLib;
  }

  function getProject(name) {
    var cfg = CONFIGS[name];
    if (!cfg || !cfg.apiKey || /COLE_AQUI/i.test(cfg.apiKey)) {
      return Promise.resolve(null); // projeto não configurado → só WhatsApp
    }
    if (apps[name]) return apps[name];
    apps[name] = loadFirebase().then(function (mods) {
      var appMod = mods[0], fsMod = mods[1];
      var app = appMod.initializeApp(cfg, name); // app nomeado (1 por projeto)
      return { db: fsMod.getFirestore(app), fs: fsMod };
    }).catch(function (err) {
      console.warn("[lead] Firebase indisponível (" + name + "):", err);
      return null;
    });
    return apps[name];
  }

  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var project = form.dataset.fb;
      var coll = form.dataset.collection;
      // 0) eventos de conversão (Meta Pixel + Google Analytics)
      trackLead(coll);
      // 1) grava no banco em segundo plano (não bloqueia o WhatsApp)
      if (project) {
        getProject(project).then(function (ctx) {
          if (!ctx) return;
          var data = collectData(form);
          data.origem = coll;
          data.criadoEm = ctx.fs.serverTimestamp();
          data.userAgent = navigator.userAgent;
          return ctx.fs.addDoc(ctx.fs.collection(ctx.db, coll), data);
        }).catch(function (err) { console.warn("[lead] gravação falhou:", err); });
      }
      // 2) abre o WhatsApp dentro do gesto do usuário
      openWhatsApp(form);
    });
  });

  /* ---- helpers ---- */
  function trackLead(area) {
    try { if (typeof window.fbq === "function") window.fbq("track", "Lead", { content_name: area }); } catch (e) {}
    try { if (typeof window.gtag === "function") window.gtag("event", "gerar_lead", { area: area, pagina: location.pathname }); } catch (e) {}
  }
  function slug(k) {
    return k.normalize("NFD").replace(/[̀-ͯ]/g, "")
            .toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  }
  function collectData(form) {
    var out = {};
    new FormData(form).forEach(function (v, k) {
      var val = String(v).trim();
      if (val) out[slug(k)] = val;
    });
    return out;
  }
  function openWhatsApp(form) {
    var phone = form.dataset.phone || "5569999844141";
    var intro = form.dataset.intro || "Olá Jéssica! Vim pelo site.";
    var msg = intro + "\n";
    new FormData(form).forEach(function (v, k) {
      var val = String(v).trim();
      if (val) msg += "\n*" + k + ":* " + val;
    });
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  }
})();
