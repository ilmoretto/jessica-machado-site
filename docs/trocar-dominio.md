# Trocar de domínio / hospedagem — sem dor de cabeça

O site foi feito para ser **portátil**: todos os links internos e arquivos
(páginas, CSS, JS, imagens, ícones) usam **caminhos relativos**, então funcionam
em qualquer endereço — `github.io`, domínio próprio ou outra hospedagem — sem editar nada.

As tags de SEO de cada página (`canonical`, `og:url`, `og:image`) **se ajustam
sozinhas** ao endereço atual (via `main.js`). Ou seja: ao trocar de domínio,
elas se corrigem automaticamente.

## O que NÃO precisa mexer
- Navegação entre páginas, imagens, CSS, JS → relativos, funcionam em qualquer domínio.
- **Firebase** (captura de leads) → funciona de qualquer domínio, sem configurar nada
  (a segurança é por Regras, não por domínio).
- **Google Analytics** → funciona de qualquer domínio automaticamente.

## O que precisa atualizar (2 arquivos)
Só estes têm o endereço fixo e precisam apontar para o novo domínio:

1. **`src/sitemap.xml`** → troque o domínio dentro das tags `<loc>`.
2. **`src/robots.txt`** → troque o domínio na linha `Sitemap:`.

(É só me chamar quando tiver o domínio que eu faço essa troca em 1 minuto.)

---

## Opção A — Usar o domínio no GitHub Pages (mais simples)
Mantém a hospedagem atual (grátis), só com o seu endereço.

1. **Compre o domínio** (ex.: Registro.br para `.com.br`; Namecheap/GoDaddy para `.com`).
2. No GitHub: repositório **jessica-machado-site** → **Settings → Pages → Custom domain**
   → digite o domínio (ex.: `jessicamachado.com.br`) → **Save**.
   (Isso cria um arquivo `CNAME` no repositório.)
3. No painel de DNS do registrador, crie os registros:
   - **Domínio raiz** (`jessicamachado.com.br`) → 4 registros **A**:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **www** → 1 registro **CNAME** apontando para `ismailepereira.github.io`
4. Aguarde a propagação do DNS (de minutos a algumas horas).
5. Volte em **Settings → Pages** e marque **Enforce HTTPS** (cadeado).
6. Atualize `sitemap.xml` e `robots.txt` com o novo domínio (me chame que eu faço).

## Opção B — Hospedagem própria (Hostinger, cPanel, etc.)
1. No painel da hospedagem, aponte o domínio para o site.
2. Suba **todo o conteúdo da pasta `src/`** para a pasta pública (`public_html` / `www`).
   Como os caminhos são relativos, tudo funciona sem ajustes.
3. Atualize `sitemap.xml` e `robots.txt` com o novo domínio.

---

## Depois de trocar (recomendado)
- No **Google Search Console**, cadastre o novo domínio e reenvie o `sitemap.xml`.
- Se o site já estava no Google pelo endereço antigo, configure um redirecionamento
  (a Opção A no GitHub Pages já cuida disso ao manter o repositório).
