/* ============================================================
   CAPTURA DE LEADS → Firestore + WhatsApp
   Atua apenas em formulários com [data-collection] (Neuropsicologia).
   - Sempre abre o WhatsApp (funciona mesmo sem Firebase configurado).
   - Se o Firebase estiver configurado, grava o lead no Firestore em
     paralelo (fire-and-forget, sem travar a abertura do WhatsApp).
   ============================================================ */
(function () {
  "use strict";

  var forms = document.querySelectorAll(".capture-form[data-collection]");
  if (!forms.length) return;

  var saveLead = null; // definido quando o Firebase carregar

  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // 1) grava no banco em segundo plano (não bloqueia o WhatsApp)
      if (saveLead) {
        try { saveLead(form); } catch (err) { console.warn("[lead] falha ao gravar:", err); }
      }
      // 2) abre o WhatsApp dentro do gesto do usuário (evita bloqueio de popup)
      openWhatsApp(form);
    });
  });

  /* ---- helpers ---- */
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

  /* ---- inicializa Firebase só se o config estiver preenchido ---- */
  var cfg = window.FIREBASE_CONFIG || {};
  var configured = cfg.apiKey && !/COLE_AQUI/i.test(cfg.apiKey);
  if (!configured) return; // sem config → segue só com WhatsApp

  Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")
  ]).then(function (mods) {
    var appMod = mods[0], fsMod = mods[1];
    var app = appMod.initializeApp(cfg);
    var db = fsMod.getFirestore(app);
    saveLead = function (form) {
      var data = collectData(form);
      data.origem = form.dataset.collection;
      data.criadoEm = fsMod.serverTimestamp();
      data.userAgent = navigator.userAgent;
      return fsMod.addDoc(fsMod.collection(db, form.dataset.collection), data)
        .catch(function (err) { console.warn("[lead] Firestore recusou:", err); });
    };
  }).catch(function (err) {
    console.warn("[lead] Firebase indisponível, capturando só via WhatsApp:", err);
  });
})();
