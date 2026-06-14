/* =========================================================
   Blog — consumo da API do psi-landing-page (headless CMS)
   ========================================================= */
(function () {
  "use strict";

  // ┌──────────────────────────────────────────────┐
  // │  ⚠️  CONFIGURAÇÃO: altere a URL base abaixo │
  // │     para o domínio de produção do CMS        │
  // └──────────────────────────────────────────────┘
  var API_BASE = "https://psi-landing-blog.vercel.app";
  // Para testes locais, descomente:
  // var API_BASE = "http://localhost:3000";

  var POSTS_ENDPOINT = API_BASE + "/api/postagens";
  var SLUG_ENDPOINT  = API_BASE + "/api/postagens/slug/";

  // ── Elementos da página ──
  var blogGrid      = document.getElementById("blog-grid");
  var blogLoading   = document.getElementById("blog-loading");
  var postArticle   = document.getElementById("post-article");
  var postLoading   = document.getElementById("post-loading");

  // ── Helpers ──
  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "long", year: "numeric"
      });
    } catch (e) {
      return "";
    }
  }

  function getSlugFromURL() {
    var params = new URLSearchParams(window.location.search);
    return params.get("slug");
  }

  function showElement(el) { if (el) el.style.display = ""; }
  function hideElement(el) { if (el) el.style.display = "none"; }

  // ── Sanitização simples de HTML (fallback se DOMPurify não carregar) ──
  function sanitizeHTML(html) {
    if (typeof DOMPurify !== "undefined") {
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          "p", "br", "strong", "em", "b", "i", "u", "s",
          "h1", "h2", "h3", "h4", "h5", "h6",
          "ul", "ol", "li", "blockquote", "a", "img",
          "span", "div", "sub", "sup", "hr", "pre", "code"
        ],
        ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "class"]
      });
    }
    // Fallback mínimo: usar textContent para sanitizar e colocar em <p>
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.innerHTML;
  }

  // ── Renderizar listagem de posts ──
  function renderPostList(posts) {
    if (!blogGrid) return;
    hideElement(blogLoading);
    showElement(blogGrid);

    if (!posts || posts.length === 0) {
      blogGrid.innerHTML =
        '<div class="blog-empty">' +
          '<div class="blog-empty__icon"><svg class="icon"><use href="assets/icons/sprite.svg#i-feather"/></svg></div>' +
          '<h2>Nenhuma publicação ainda</h2>' +
          '<p>Em breve, novos conteúdos serão publicados aqui.</p>' +
        '</div>';
      return;
    }

    var html = "";
    posts.forEach(function (post) {
      html +=
        '<a class="blog-card" href="blog-post.html?slug=' + encodeURIComponent(post.slug) + '" id="post-' + post.id + '">' +
          '<h2 class="blog-card__title">' + escapeHTML(post.title) + '</h2>' +
          (post.excerpt
            ? '<p class="blog-card__excerpt">' + escapeHTML(post.excerpt) + '</p>'
            : '') +
          '<div class="blog-card__meta">' +
            '<svg class="icon"><use href="assets/icons/sprite.svg#i-clock"/></svg>' +
            '<time datetime="' + post.createdAt + '">' + formatDate(post.createdAt) + '</time>' +
          '</div>' +
          '<span class="blog-card__read">Ler artigo <svg class="icon"><use href="assets/icons/sprite.svg#i-arrow-right"/></svg></span>' +
        '</a>';
    });
    blogGrid.innerHTML = html;

    // Ativar reveal nos novos cards
    blogGrid.querySelectorAll(".blog-card").forEach(function (el) {
      el.setAttribute("data-reveal", "");
      // Usar requestAnimationFrame para que o reveal funcione
      requestAnimationFrame(function () {
        el.classList.add("is-visible");
      });
    });
  }

  // ── Renderizar post individual ──
  function renderPost(post) {
    if (!postArticle) return;
    hideElement(postLoading);
    showElement(postArticle);

    // Atualizar title da página
    document.title = post.title + " | Blog · Jéssica Machado";

    // Atualizar meta description
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && post.excerpt) {
      metaDesc.setAttribute("content", post.excerpt);
    }

    postArticle.innerHTML =
      '<div class="blog-breadcrumb">' +
        '<a href="index.html">Início</a>' +
        '<span class="sep">›</span>' +
        '<a href="blog.html">Blog</a>' +
        '<span class="sep">›</span>' +
        '<span>' + escapeHTML(post.title) + '</span>' +
      '</div>' +
      '<div class="post-header">' +
        '<h1>' + escapeHTML(post.title) + '</h1>' +
        '<p class="post-date">' +
          '<svg class="icon"><use href="assets/icons/sprite.svg#i-clock"/></svg>' +
          '<time datetime="' + post.createdAt + '">' + formatDate(post.createdAt) + '</time>' +
        '</p>' +
      '</div>' +
      '<div class="post-content">' + sanitizeHTML(post.content) + '</div>' +
      '<a href="blog.html" class="post-back">' +
        '<svg class="icon" style="transform:rotate(180deg)"><use href="assets/icons/sprite.svg#i-arrow-right"/></svg>' +
        'Voltar ao blog' +
      '</a>';
  }

  // ── Renderizar erro ──
  function renderError(container, loadingEl) {
    if (loadingEl) hideElement(loadingEl);
    if (!container) return;
    showElement(container);
    container.innerHTML =
      '<div class="blog-error">' +
        '<h2>Ops, algo deu errado</h2>' +
        '<p>Não foi possível carregar o conteúdo. Tente novamente em alguns instantes.</p>' +
        '<a href="blog.html" class="btn btn-primary">Voltar ao blog</a>' +
      '</div>';
  }

  function renderNotFound() {
    if (postLoading) hideElement(postLoading);
    if (!postArticle) return;
    showElement(postArticle);
    postArticle.innerHTML =
      '<div class="blog-error">' +
        '<h2>Artigo não encontrado</h2>' +
        '<p>O artigo que você procura não existe ou foi removido.</p>' +
        '<a href="blog.html" class="btn btn-primary">Voltar ao blog</a>' +
      '</div>';
  }

  // ── Escape HTML (para título/excerpt — evitar XSS) ──
  function escapeHTML(str) {
    if (!str) return "";
    var el = document.createElement("span");
    el.textContent = str;
    return el.innerHTML;
  }

  // ── Fetch da listagem ──
  function fetchPosts() {
    if (!blogGrid) return;

    fetch(POSTS_ENDPOINT)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        renderPostList(data);
      })
      .catch(function (err) {
        console.error("[Blog] Erro ao carregar posts:", err);
        renderError(blogGrid, blogLoading);
      });
  }

  // ── Fetch de post individual ──
  function fetchPost(slug) {
    if (!postArticle) return;

    fetch(SLUG_ENDPOINT + encodeURIComponent(slug))
      .then(function (res) {
        if (res.status === 404) {
          renderNotFound();
          return null;
        }
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data) renderPost(data);
      })
      .catch(function (err) {
        console.error("[Blog] Erro ao carregar post:", err);
        renderError(postArticle, postLoading);
      });
  }

  // ── Inicialização ──
  // Detecta se estamos na página de listagem ou de post
  var slug = getSlugFromURL();

  if (slug && postArticle) {
    // Página de post individual
    fetchPost(slug);
  } else if (blogGrid) {
    // Página de listagem
    fetchPosts();
  }
})();
