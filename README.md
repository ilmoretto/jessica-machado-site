# Site — Jéssica Machado (Neuropsicóloga · CRP 24/04453)

Site multi-página da neuropsicóloga e autora **Jéssica Machado**, pronto para lançamento
e para campanhas de tráfego pago.

🔗 **No ar:** https://ismailepereira.github.io/jessica-machado-site/

## Páginas
| Arquivo | Página | Uso |
|---------|--------|-----|
| `index.html` | Perfil / história da Jéssica | Institucional |
| `neuropsicologia.html` | Landing de Neuropsicologia | Tráfego pago (captação) |
| `relacionamentos.html` | Landing de Psicoterapia de Relacionamentos | Tráfego pago (captação) |
| `404.html` | Página de erro | — |

## Stack
HTML + CSS + JavaScript puro (sem build). Hospedado no GitHub Pages com deploy automático
(GitHub Actions) a cada push na `main`.

## Estrutura
```
jessica-machado/
├── docs/briefing.md
├── src/
│   ├── index.html · neuropsicologia.html · relacionamentos.html · 404.html
│   ├── robots.txt · sitemap.xml
│   └── assets/
│       ├── css/styles.css        # design system + componentes
│       ├── js/main.js            # menu, reveal, formulário→WhatsApp
│       ├── icons/sprite.svg      # ícones lineares (externo, compartilhado)
│       ├── logo/                 # logo oficial (PNG transparente + versão sm)
│       └── img/                  # fotos da Jéssica + capa do livro
└── README.md
```

## Captura de leads
Os formulários das landings montam uma mensagem formatada (nome, WhatsApp, motivo) e abrem
o **WhatsApp da Jéssica** — funcional sem backend/API. Para plugar um CRM/planilha depois,
basta tratar o `submit` da classe `.capture-form` em `assets/js/main.js`.

## Identidade visual
- Bordô `#9E1B32` · Rosa antigo `#C27B83` · Creme `#FBF7F4`
- Títulos: *Cormorant Garamond* · Texto/UI: *Jost*

## Pendências (opcionais)
- [ ] Confirmar registro do título de especialista no CRP
- [ ] Endereços dos consultórios · link de compra do livro
- [ ] Domínio próprio (atualizar URLs canônicas/OG ao migrar)

---
Desenvolvido por [ismailepereira](https://ismailepereira.github.io/)
