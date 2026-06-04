# Site — Jéssica Machado (Psicóloga · CRP 24/04453)

Site institucional one-page da psicóloga e neuropsicóloga infantil **Jéssica Machado**.
Foco principal em **neuropsicologia infantil** (presencial em RO) e eixo secundário de
**apoio a mulheres / relacionamentos abusivos** (psicoterapia online + o livro *"O Despertar de Amélia"*).

## Stack
HTML + CSS + JavaScript puro (sem build). Hospedável direto no GitHub Pages.

## Estrutura
```
jessica-machado/
├── docs/
│   └── briefing.md          # planejamento, copy, paleta, pendências
├── src/
│   ├── index.html           # página única (seções)
│   └── assets/
│       ├── css/styles.css   # estilos + paleta da marca
│       ├── js/main.js        # menu mobile, reveal, ano
│       └── logo/
│           └── logo-simbolo.svg   # PLACEHOLDER (trocar pelo logo oficial)
└── README.md
```

## Como rodar localmente
Abra `src/index.html` no navegador, ou sirva a pasta:
```bash
# dentro de src/
python -m http.server 8000
# acesse http://localhost:8000
```

## Identidade visual
- Bordô/vinho `#9E1B32` · Rosa antigo `#C27B83` · Rosa nude `#E7C9CC` · Creme `#FBF7F4`
- Títulos: *Cormorant Garamond* · Texto/UI: *Jost*

## Pendências (ver `docs/briefing.md`)
- [ ] Trocar **logo placeholder** pelos arquivos oficiais em alta (PNG/SVG)
- [ ] Confirmar registro do **título de especialista** em neuropsicologia
- [ ] Fotos profissionais + capa do livro
- [ ] Link de compra do livro · endereços dos consultórios · domínio/e-mail
- [ ] Valores / forma de agendamento

---
Desenvolvido por [ismailepereira](https://ismailepereira.github.io/)
