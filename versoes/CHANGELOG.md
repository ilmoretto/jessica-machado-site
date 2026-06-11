# Versões do pacote de deploy — Jéssica Machado

Cada `jessica-site-vN-AAAA-MM-DD.zip` (nesta pasta) é um pacote pronto para subir
na hospedagem. **As versões antigas são sempre mantidas.** A mais recente também
fica como `../jessica-site.zip`.

Para gerar uma versão nova: `python build-zip.py` (na raiz do projeto).

---

## v1 — 2026-06-11
- Site completo: perfil (index), neuropsicologia, relacionamentos + página 404.
- Identidade visual da marca (logo Ψ floral, paleta bordô/rosa), fotos reais e livro 3D.
- Captação de leads no **Firebase** (neuro → projeto dashboard-jessica;
  clínica → projeto dashboard-psicoterapia) + abertura do WhatsApp.
- **Google Analytics** unificado (G-NT1BGG5GSH) + rastreio de cliques (`clique_link`).
- **Meta Pixel** (620526163029028) com PageView.
- Aviso de **cookies (LGPD)**.
- SEO (sitemap, robots, OG, canonical) e portabilidade de domínio (URLs auto-ajustáveis).
- Botão "Comprar na Amazon" do livro.
