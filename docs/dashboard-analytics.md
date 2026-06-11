# Dashboard de visitas e cliques (Google Analytics + Looker Studio)

O site já está medindo tudo. Os dados de **todas as páginas** ficam unificados na
propriedade do Analytics **G-NT1BGG5GSH** (projeto *Dashboard Jessica*).

O que é capturado automaticamente:
- **Visitantes / visitas** e de onde vêm (Google, Instagram, anúncios…).
- **Páginas mais vistas**.
- **Cliques em links e botões** → evento `clique_link`, com:
  `link_texto` (o que estava escrito), `link_url` (destino), `tipo_link`
  (whatsapp / email / livro_amazon / botao / link) e `pagina`.

---

## 1) Ver agora, sem configurar nada (Google Analytics)
Acesse <https://analytics.google.com> → propriedade da Jéssica.
- **Tempo real:** menu *Relatórios → Tempo real* — mostra quem está no site agora.
- **Visitantes/páginas:** *Relatórios → Engajamento → Páginas e telas*.
- **Cliques:** *Relatórios → Engajamento → Eventos* → procure **`clique_link`**
  (mostra quantos cliques aconteceram).

> ⏱️ Os relatórios normais levam até 24–48h para popular. O *Tempo real* é imediato.

## 2) Ver QUAL link foi clicado (registrar 1 vez no GA4)
Para o GA mostrar o texto/URL de cada clique, registre as dimensões personalizadas:

GA4 → **Administrador** (engrenagem) → **Definições personalizadas** →
**Criar dimensão personalizada** (repita para cada uma):

| Nome da dimensão | Escopo | Parâmetro do evento |
|------------------|--------|---------------------|
| Texto do link    | Evento | `link_texto` |
| URL do link      | Evento | `link_url` |
| Tipo do link     | Evento | `tipo_link` |
| Página           | Evento | `pagina` |

(Depois disso, novos cliques aparecem detalhados nos relatórios e no Looker.)

## 3) Montar o dashboard bonito (Looker Studio)
1. Acesse <https://lookerstudio.google.com> → **Criar → Relatório**.
2. **Adicionar dados → Google Analytics** → escolha a propriedade da Jéssica
   (a do ID **G-NT1BGG5GSH**) → **Adicionar**.
3. Monte os blocos (botão *Adicionar gráfico*):
   - **Scorecards:** *Usuários ativos*, *Sessões*, *Visualizações*.
   - **Série temporal:** Usuários por dia (vê o efeito dos anúncios no tempo).
   - **Tabela — Páginas mais vistas:** dimensão *Caminho da página*; métrica *Visualizações*.
   - **Tabela — Cliques por link:** adicione um **filtro** `Nome do evento = clique_link`;
     dimensão *Texto do link* (e/ou *URL do link*); métrica *Contagem de eventos*.
   - **Tabela — De onde vêm:** dimensão *Origem/mídia da sessão*; métrica *Usuários*.
4. **Compartilhar** → pegue o link do relatório. Pronto: é só abrir esse link
   sempre que quiser ver o painel (pelo celular também).

## 4) (Opcional) Marcar cliques importantes como conversão
Para o Google/Meta Ads otimizarem por quem clica em "Falar no WhatsApp":
GA4 → *Administrador → Eventos* → marque `clique_link` como **conversão**
(ou crie um evento específico filtrando `tipo_link = whatsapp`).

---

### Resumo técnico
- Página unificada de analytics: **G-NT1BGG5GSH** (todas as 3 páginas reportam nela;
  a de relacionamentos também envia para G-DPBGX2LBGV do projeto Psicoterapia).
- Rastreio de cliques: `assets/js/main.js` (evento `clique_link`).
- Precisa de ajuda montando o Looker? É só me chamar que eu te guio campo a campo.
