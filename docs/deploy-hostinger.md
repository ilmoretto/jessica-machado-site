# Deploy automático → Hostinger (FTPS via GitHub Actions)

A cada `git push` na branch `main`, o GitHub conecta na Hostinger via FTPS e
sincroniza o conteúdo da pasta `src/` com a `public_html`. Você não precisa
mais subir zip manualmente.

> ⚠️ **Nunca cole senha de FTP no chat / no código / em commits.** As 4
> credenciais entram como **Secrets do GitHub** (criptografados; nem eu nem o
> repositório veem o valor depois de salvar).

---

## Passo 1 — Pegar os dados de FTP na Hostinger
1. **hPanel** → **Hospedagem** → o site da Jéssica → **Avançado → Contas FTP**.
2. Anote (ou crie uma conta nova só pro deploy):
   - **Host FTP / Servidor:** algo como `ftp.seudominio.com.br` ou `files.000webhost.com`
   - **Usuário FTP:** ex.: `u123456789.deploy`
   - **Senha:** a que você definiu
   - **Pasta:** geralmente `/public_html/` (a raiz do site)

> 💡 Recomendado: criar uma **conta FTP dedicada** ao deploy, apontando para
> `public_html/`. Se um dia precisar revogar, basta apagar essa conta sem
> mexer na principal.

## Passo 2 — Cadastrar os Secrets no GitHub
1. Acesse o repositório no GitHub:
   https://github.com/ismailepereira/jessica-machado-site
2. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
3. Crie estes **4 secrets** (um por um):

| Nome (exato) | Valor |
|--------------|-------|
| `HOSTINGER_FTP_HOST`     | host FTP (ex.: `ftp.jessicamachado.com.br`) |
| `HOSTINGER_FTP_USER`     | usuário FTP |
| `HOSTINGER_FTP_PASSWORD` | senha FTP |
| `HOSTINGER_REMOTE_DIR`   | pasta de destino, **com barras** (ex.: `/public_html/`) |

## Passo 3 — Rodar o primeiro deploy
Você tem duas formas:

**Opção A — Manual (recomendado pra primeira vez):**
1. No GitHub: aba **Actions** → workflow **"Deploy → Hostinger"** → **Run workflow** → `main` → **Run**.
2. Acompanha o log. Quando ficar verde, abre seu domínio — está no ar.

**Opção B — Automático:**
A cada `git push` na `main` que toque em arquivos da pasta `src/`, o deploy roda sozinho.

---

## Como saber se deu certo
- Aba **Actions** do repositório: linha verde ✓ = deploy ok.
- Se ficar vermelho ✗, o log mostra exatamente o erro (geralmente: credencial errada ou pasta inexistente).

## Segurança & boas práticas
- O workflow usa **FTPS** (criptografado), não FTP simples.
- A flag `dangerous-clean-slate: false` **não apaga** arquivos que você subiu manualmente no servidor.
- A pasta `.github` (workflows) e arquivos `.zip` não são enviados.
- Se desconfiar que vazou a senha: gere uma nova FTP na Hostinger e atualize o Secret no GitHub.

## E o GitHub Pages?
Continua rodando em paralelo, como ambiente de **preview/staging** gratuito em
`ismailepereira.github.io/jessica-machado-site/`. Útil pra ver mudanças
antes de servirem ao público no domínio próprio (quando ele estiver na Hostinger).
Se quiser desligar o Pages no futuro, é só desativar nas Settings do repo.
