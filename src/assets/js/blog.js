/* =========================================================
   Blog — consumo da API do psi-landing-page (headless CMS)
   v2: cache, JSON-LD, categoria/imagem, CTA, bio, relacionados,
       tempo de leitura, analytics, fallback gracioso de campos
   ========================================================= */
(function () {
  "use strict";

  /* ────────────────── CONFIG ────────────────── */
  var API_BASE   = "https://psi-landing-blog.vercel.app";
  var POSTS_URL  = API_BASE + "/api/postagens";
  var SLUG_URL   = API_BASE + "/api/postagens/slug/";

  var CACHE_KEY  = "blogPostsCache";
  var CACHE_TTL  = 5 * 60 * 1000;  // 5 min
  var SITE_URL   = location.origin + location.pathname.replace(/[^/]*$/, "");

  /* Categorias conhecidas + cor (fallback se a API não devolver) */
  var CATEGORIES = {
    "neuropsicologia": { label: "Neuropsicologia", cls: "tag--neuro" },
    "relacionamentos": { label: "Relacionamentos", cls: "tag--relac" },
    "infantil":        { label: "Infância",        cls: "tag--neuro" },
    "saude-mental":    { label: "Saúde Mental",    cls: "tag--saude" },
    "bem-estar":       { label: "Bem-estar",       cls: "tag--saude" },
    "autora":          { label: "Da autora",       cls: "tag--relac" }
  };
  function categoryInfo(raw) {
    if (!raw) return { label: "Bem-estar", cls: "tag--saude" };
    var key = String(raw).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    return CATEGORIES[key] || { label: String(raw), cls: "tag--saude" };
  }

  /* ────────────────── ELEMENTOS ────────────────── */
  var blogGrid       = document.getElementById("blog-grid");
  var blogLoading    = document.getElementById("blog-loading");
  var postArticle    = document.getElementById("post-article");
  var postLoading    = document.getElementById("post-loading");
  var relatedSection = document.getElementById("post-related");
  var relatedGrid    = document.getElementById("post-related-grid");

  /* ────────────────── HELPERS ────────────────── */
  function show(el) { if (el) el.style.display = ""; }
  function hide(el) { if (el) el.style.display = "none"; }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("pt-BR", { day:"2-digit", month:"long", year:"numeric" });
    } catch (e) { return ""; }
  }

  function getSlugFromURL() {
    return new URLSearchParams(location.search).get("slug");
  }

  /* Calcula o tempo de leitura em minutos (200 wpm) a partir do HTML/texto */
  function readingTime(html) {
    if (!html) return 1;
    var text = String(html).replace(/<[^>]+>/g, " ");
    var words = (text.match(/\S+/g) || []).length;
    return Math.max(1, Math.round(words / 200));
  }

  /* Sanitização defensiva — usa DOMPurify se disponível */
  function sanitizeHTML(html) {
    if (typeof DOMPurify !== "undefined") {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["p","br","strong","em","b","i","u","s",
          "h1","h2","h3","h4","h5","h6","ul","ol","li","blockquote",
          "a","img","span","div","sub","sup","hr","pre","code","figure","figcaption"],
        ALLOWED_ATTR: ["href","src","alt","title","target","rel","class","loading"],
        ADD_ATTR: ["target"],
        FORBID_TAGS: ["script","style","iframe"],
        FORBID_ATTR: ["onerror","onload","onclick","style"]
      });
    }
    var tmp = document.createElement("div");
    tmp.textContent = html;
    return "<p>" + tmp.innerHTML + "</p>";
  }

  function escapeHTML(s) {
    if (!s) return "";
    var d = document.createElement("span"); d.textContent = s; return d.innerHTML;
  }

  /* ────────────────── CACHE (listagem) ────────────────── */
  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (Date.now() - obj.t > CACHE_TTL) return null;
      return obj.data;
    } catch (e) { return null; }
  }
  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data: data })); } catch (e) {}
  }

  /* ────────────────── ANALYTICS ────────────────── */
  function trackPostView(post) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", "ler_post", {
          post_titulo: post.title,
          post_slug:   post.slug,
          categoria:   categoryInfo(post.category || post.categoria).label,
          tempo_leitura_min: readingTime(post.content)
        });
      }
      if (typeof window.fbq === "function") {
        window.fbq("track", "ViewContent", { content_name: post.title, content_category: categoryInfo(post.category).label });
      }
    } catch (e) {}
  }

  /* ────────────────── JSON-LD (Article) ────────────────── */
  function injectArticleSchema(post) {
    var url = SITE_URL + "blog-post.html?slug=" + encodeURIComponent(post.slug);
    var schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt || "",
      "image": post.coverImage || post.image || (location.origin + "/jessica-machado-site/assets/logo/logo-jessica.png"),
      "datePublished": post.createdAt,
      "dateModified": post.updatedAt || post.createdAt,
      "author": {
        "@type": "Person",
        "name": "Jéssica Machado Pereira",
        "jobTitle": "Neuropsicóloga",
        "identifier": "CRP 24/04453",
        "url": SITE_URL + "index.html"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Jéssica Machado",
        "logo": { "@type": "ImageObject", "url": SITE_URL + "assets/logo/logo-jessica.png" }
      },
      "mainEntityOfPage": { "@type": "WebPage", "@id": url }
    };
    var existing = document.getElementById("ld-article");
    if (existing) existing.remove();
    var tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = "ld-article";
    tag.textContent = JSON.stringify(schema);
    document.head.appendChild(tag);
  }

  /* ────────────────── COMPONENTES: card, cover, CTA, bio ────────────────── */
  function postCover(post) {
    var img = post.coverImage || post.image;
    if (img) {
      return '<div class="blog-card__cover"><img loading="lazy" src="' + escapeHTML(img) + '" alt="' + escapeHTML(post.title) + '" /></div>';
    }
    // fallback: cover decorativo com gradiente da marca + ícone (sem imagem)
    return '<div class="blog-card__cover blog-card__cover--decor"><svg viewBox="0 0 24 24" class="icon"><use href="assets/icons/sprite.svg#i-feather"/></svg></div>';
  }

  function cardTag(post) {
    var info = categoryInfo(post.category || post.categoria);
    return '<span class="blog-tag ' + info.cls + '">' + escapeHTML(info.label) + '</span>';
  }

  function postCardHTML(post) {
    var slug = encodeURIComponent(post.slug);
    var rt = readingTime(post.content);
    return ''
      + '<a class="blog-card" href="blog-post.html?slug=' + slug + '">'
      +   postCover(post)
      +   '<div class="blog-card__body">'
      +     '<div class="blog-card__top">' + cardTag(post)
      +       '<span class="blog-card__meta">'
      +         '<svg class="icon"><use href="assets/icons/sprite.svg#i-clock"/></svg>'
      +         '<time datetime="' + escapeHTML(post.createdAt) + '">' + formatDate(post.createdAt) + '</time>'
      +         ' · ' + rt + ' min'
      +       '</span>'
      +     '</div>'
      +     '<h2 class="blog-card__title">' + escapeHTML(post.title) + '</h2>'
      +     (post.excerpt ? '<p class="blog-card__excerpt">' + escapeHTML(post.excerpt) + '</p>' : '')
      +     '<span class="blog-card__read">Ler artigo <svg class="icon"><use href="assets/icons/sprite.svg#i-arrow-right"/></svg></span>'
      +   '</div>'
      + '</a>';
  }

  function authorBioHTML() {
    return ''
      + '<aside class="post-author">'
      +   '<div class="post-author__avatar">'
      +     '<img src="assets/img/jessica-1.jpg" alt="Jéssica Machado" loading="lazy" onerror="this.style.display=\'none\'"/>'
      +   '</div>'
      +   '<div class="post-author__body">'
      +     '<p class="eyebrow"><svg class="icon"><use href="assets/icons/sprite.svg#i-flower"/></svg> Sobre a autora</p>'
      +     '<h3>Jéssica Machado</h3>'
      +     '<p>Neuropsicóloga (CRP 24/04453) e autora de "O Despertar de Amélia". Quase uma década dedicada ao cuidado emocional com escuta, ciência e afeto.</p>'
      +     '<a href="index.html" class="link-arrow">Conhecer minha história <svg class="icon"><use href="assets/icons/sprite.svg#i-arrow-right"/></svg></a>'
      +   '</div>'
      + '</aside>';
  }

  function postCtaHTML(post) {
    var cat = (post.category || "").toLowerCase();
    var isNeuro = /neuro|infantil|tea|autismo|tdah/.test(cat) || /neuropsic|crian|tdah|autism/i.test(post.title || "");
    var btn = isNeuro
      ? { href: "neuropsicologia.html#agendar", icon: "i-puzzle",     label: "Agendar avaliação" }
      : { href: "relacionamentos.html#agendar", icon: "i-heart-hand", label: "Quero conversar" };
    var msg = "Olá Jéssica! Vim pelo blog (artigo: " + (post.title || "") + ") e gostaria de conversar.";
    var wa = "https://wa.me/5569999844141?text=" + encodeURIComponent(msg);
    return ''
      + '<section class="post-cta">'
      +   '<div class="post-cta__inner">'
      +     '<p class="eyebrow eyebrow--light"><svg class="icon"><use href="assets/icons/sprite.svg#i-flower"/></svg> Vamos conversar?</p>'
      +     '<h3>Se este texto fez sentido para você, posso te acompanhar.</h3>'
      +     '<p class="post-cta__sub">Atendimento humano, científico e sigiloso — online para todo o Brasil e presencial em Rondônia.</p>'
      +     '<div class="post-cta__actions">'
      +       '<a href="' + wa + '" target="_blank" rel="noopener" class="btn btn-light"><svg class="icon"><use href="assets/icons/sprite.svg#i-message"/></svg> Falar no WhatsApp</a>'
      +       '<a href="' + btn.href + '" class="btn btn-ghost-light"><svg class="icon"><use href="assets/icons/sprite.svg#' + btn.icon + '"/></svg> ' + btn.label + '</a>'
      +     '</div>'
      +   '</div>'
      + '</section>';
  }

  /* ────────────────── LISTAGEM ────────────────── */
  function renderPostList(posts) {
    if (!blogGrid) return;
    hide(blogLoading); show(blogGrid);

    if (!posts || posts.length === 0) {
      blogGrid.innerHTML =
        '<div class="blog-empty">'
        + '<div class="blog-empty__icon"><svg class="icon"><use href="assets/icons/sprite.svg#i-feather"/></svg></div>'
        + '<h2>Em breve, novos conteúdos</h2>'
        + '<p>Estamos preparando artigos sobre neuropsicologia, relacionamentos e bem-estar.</p>'
        + '</div>';
      return;
    }

    blogGrid.innerHTML = posts.map(postCardHTML).join("");
    blogGrid.querySelectorAll(".blog-card").forEach(function (el) {
      el.setAttribute("data-reveal", "");
      requestAnimationFrame(function () { el.classList.add("is-visible"); });
    });
  }

  function fetchPosts() {
    if (!blogGrid) return;
    var cached = readCache();
    if (cached) renderPostList(cached);

    fetch(POSTS_URL)
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (data) { writeCache(data); renderPostList(data); })
      .catch(function (err) {
        console.warn("[Blog] erro:", err);
        if (!cached) renderError(blogGrid, blogLoading);
      });
  }

  /* ────────────────── POST INDIVIDUAL ────────────────── */
  function renderPost(post) {
    if (!postArticle) return;
    hide(postLoading); show(postArticle);

    document.title = post.title + " | Blog · Jéssica Machado";
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && post.excerpt) metaDesc.setAttribute("content", post.excerpt);
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", post.title);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && post.excerpt) ogDesc.setAttribute("content", post.excerpt);
    var ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg && (post.coverImage || post.image)) ogImg.setAttribute("content", post.coverImage || post.image);

    injectArticleSchema(post);
    trackPostView(post);

    var rt = readingTime(post.content);
    var info = categoryInfo(post.category || post.categoria);
    var cover = (post.coverImage || post.image)
      ? '<div class="post-cover"><img src="' + escapeHTML(post.coverImage || post.image) + '" alt="' + escapeHTML(post.title) + '" /></div>'
      : "";

    postArticle.innerHTML =
        '<div class="blog-breadcrumb">'
      +   '<a href="index.html">Início</a>'
      +   '<span class="sep">›</span>'
      +   '<a href="blog.html">Blog</a>'
      +   '<span class="sep">›</span>'
      +   '<span>' + escapeHTML(post.title) + '</span>'
      + '</div>'
      + '<div class="post-header">'
      +   '<span class="blog-tag ' + info.cls + '">' + escapeHTML(info.label) + '</span>'
      +   '<h1>' + escapeHTML(post.title) + '</h1>'
      +   '<p class="post-date">'
      +     '<svg class="icon"><use href="assets/icons/sprite.svg#i-clock"/></svg>'
      +     '<time datetime="' + escapeHTML(post.createdAt) + '">' + formatDate(post.createdAt) + '</time>'
      +     ' · ' + rt + ' min de leitura'
      +   '</p>'
      + '</div>'
      + cover
      + '<div class="post-content">' + sanitizeHTML(post.content) + '</div>'
      + authorBioHTML()
      + postCtaHTML(post)
      + '<a href="blog.html" class="post-back">'
      +   '<svg class="icon" style="transform:rotate(180deg)"><use href="assets/icons/sprite.svg#i-arrow-right"/></svg>'
      +   'Voltar ao blog'
      + '</a>';

    loadRelated(post);
  }

  function loadRelated(currentPost) {
    if (!relatedSection || !relatedGrid) return;
    var cached = readCache();
    var render = function (data) {
      if (!data || data.length === 0) return;
      var currentCat = (currentPost.category || "").toLowerCase();
      var others = data.filter(function (p) { return p.slug !== currentPost.slug; });
      // tenta priorizar mesma categoria
      var same = others.filter(function (p) { return (p.category || "").toLowerCase() === currentCat; });
      var pick = (same.length >= 2 ? same : others).slice(0, 3);
      if (pick.length === 0) return;
      relatedGrid.innerHTML = pick.map(postCardHTML).join("");
      show(relatedSection);
    };
    if (cached) render(cached);
    else {
      fetch(POSTS_URL).then(function (r) { return r.ok ? r.json() : []; })
        .then(function (data) { writeCache(data); render(data); })
        .catch(function () {});
    }
  }

  function fetchPost(slug) {
    if (!postArticle) return;
    fetch(SLUG_URL + encodeURIComponent(slug))
      .then(function (r) {
        if (r.status === 404) { renderNotFound(); return null; }
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) { if (data) renderPost(data); })
      .catch(function (err) {
        console.warn("[Blog] erro post:", err);
        renderError(postArticle, postLoading);
      });
  }

  /* ────────────────── ESTADOS ────────────────── */
  function renderError(container, loadingEl) {
    if (loadingEl) hide(loadingEl);
    if (!container) return;
    show(container);
    container.innerHTML =
      '<div class="blog-error">'
      + '<h2>Ops, algo deu errado</h2>'
      + '<p>Não foi possível carregar o conteúdo. Tente novamente em alguns instantes.</p>'
      + '<a href="blog.html" class="btn btn-primary">Voltar ao blog</a>'
      + '</div>';
  }

  function renderNotFound() {
    if (postLoading) hide(postLoading);
    if (!postArticle) return;
    show(postArticle);
    postArticle.innerHTML =
      '<div class="blog-error">'
      + '<h2>Artigo não encontrado</h2>'
      + '<p>O artigo que você procura não existe ou foi removido.</p>'
      + '<a href="blog.html" class="btn btn-primary">Voltar ao blog</a>'
      + '</div>';
  }

  /* ────────────────── INIT ────────────────── */
  var slug = getSlugFromURL();
  if (slug && postArticle) fetchPost(slug);
  else if (blogGrid)       fetchPosts();
})();
