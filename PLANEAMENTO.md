# Planeamento do site MEAN

Documento de trabalho partilhado. Cada página tem uma ficha: objetivo, referência, secções, conteúdo, decisões.
As referências servem para a **estrutura e o tipo de conteúdo**. Textos, imagens e desenho são da MEAN.

## Mapa do site

| Página | Ficheiro | Estado |
|---|---|---|
| **Home** | `index.html` | **construída** com conteúdo provisório (2026-10-03) |
| **Work** | `work.html` | **construída** com conteúdo provisório (2026-10-03) |
| **About** | `about.html` | **construída** com conteúdo provisório (2026-10-03) |
| **Projeto** | `projeto.html` | **construída** com conteúdo provisório (2026-10-04); é o modelo para todos os projetos |
| Contact | `contact.html` | por planear (mantém a versão anterior) |
| Intro | `arquivo/index-intro.html` | arquivada, fora do menu. Como recuperar: `arquivo/LEIA-ME.md` |
| 404 | não existe | por criar |
| Política de privacidade | não existe | por criar (o formulário recolhe dados) |

**Conteúdo provisório** quer dizer: a estrutura, o desenho e as animações estão feitos. Os textos marcados como provisórios e os blocos cinzentos esperam pelo conteúdo real.

### Como está montado

- `style.css`: a base é a do sócio. A camada nova fica no fim do ficheiro, com classes começadas por `m-`.
- **Referências de proporção e movimento** (2026-10-03): madeinevolve.com para proporções e dinâmicas, twks.ch para o header a meio do ecrã, flabbergast.agency para a abertura do vídeo, esrbespoke.au para o footer. Destas referências vêm só a escala, o espaçamento e o movimento. Ficaram de fora as linhas verticais de fundo, as maiúsculas e a fonte monoespaçada do Evolve. Está tudo nas camadas "MEAN v3" e "FOOTER" no fim do `style.css`.
- **Línguas:** o site está em **inglês por defeito**. O botão `PT` / `EN` no header troca a língua e guarda a escolha no browser. O HTML tem o inglês; o português está todo em `i18n.js`, numa lista "texto em inglês → texto em português". Para mudar um texto em português, muda-se só no `i18n.js`. Para mudar um texto em inglês, muda-se no HTML **e** no lado esquerdo da lista do `i18n.js` (têm de ficar iguais). Para conferir, abrir o site em PT com `?i18ncheck` no endereço: a consola lista o que ficou sem tradução. Os textos das fichas deste documento estão em português; o inglês é tradução minha, por validar.
- **Header** (igual em todas as páginas): tudo em texto, do mesmo tamanho (15 px, logo com 17 px de altura), sem fundo e sem botão vermelho: logo, Home, Work, About à esquerda; "Talk with us" e língua à direita. **O header fica sempre em inglês**, seja qual for a língua do site (atributo `data-i18n-skip`); no resto da página, em PT, "Talk with us" aparece como "Fala connosco". A página continua a ser `contact.html`. Usa "negativo" para se ler sobre qualquer fundo. Sobre o vídeo da Home passa a branco ou preto conforme o brilho do vídeo por baixo. Sai de cena quando o footer chega ao topo.
- **Footer** (igual em todas as páginas): ecrã inteiro no vermelho escuro da MEAN (`#681a1a`, o do ecrã do logo), com texto e logo no vermelho do logótipo (`#d33d3d`), nas proporções de esrbespoke.au (texto a 14 px em maiúsculas, grelha de 12 colunas, logo com 32% da largura a meio da altura, contactos em baixo à direita). Em ecrãs largos fica preso ao ecrã e é revelado pela página a subir. A frase "Vamos construir a tua próxima marca, juntos." do footer antigo saiu; a referência não tem newsletter nem a pusemos.
- **Proporções:** margens estreitas; **todas as frases do site têm o mesmo tamanho, o da frase de abertura da Home** (títulos de página, frases de secção, testemunhos e fechos; no CSS é a variável `--m-phrase`); texto corrido pequeno (13 a 15 px) em colunas estreitas com avanço na primeira linha, listas compactas.
- `motion.js`: todas as animações de entrada e de interação. Liga-se por atributos no HTML (`data-reveal`, `data-blur`, `data-split`, `data-media`, `data-stagger`, `data-cursor`, `data-slider`, `data-focus-list`).
- Sem JavaScript, ou com "reduzir movimento" ligado no sistema, o conteúdo aparece todo, sem animação.
- **Cursor** (`main.js` + `style.css`, todas as páginas): circunferência com um ponto no centro, como a capa do livro do Rick Rubin, em negativo sobre o que está por baixo. Sem rasto. A circunferência cresce sobre ligações. Sobre os projetos estica na horizontal para uma pill só com contorno, sem fundo, com o texto em maiúsculas lá dentro ("VER", vem do atributo `data-cursor`).
- **Mudança de página** (`main.js`, todas as páginas): uma cortina vermelho-escuro cobre a página, a página seguinte abre com o logo animado da abertura e só depois se revela. Num recarregamento o logo não aparece. O bloco do logo (`#preloader`) está no topo do `<body>` de cada página.
- Blocos cinzentos: `m-media m-media--ph` (capas de projeto) e `m-ph` (fotografias). Para pôr a imagem real, troca-se o bloco por `<div class="m-media" data-media><img src="…" alt="…"></div>`.

---

## Home

- **Ficheiro:** `index.html` (página principal)
- **Referência:** https://www.burocratik.com
- **Objetivo:** mostrar o trabalho logo à entrada, dizer numa frase quem é a MEAN, e levar o visitante aos projetos ou ao contacto.
- **De onde se chega:** entrada do site. **Para onde leva:** Projeto (destaques), Work, About (serviços), Contact.

### Secções

Legenda: ✅ feito · ✏️ rascunho, falta validar · ❌ falta conteúdo

| # | Secção | O que a referência tem | Conteúdo MEAN | Estado |
|---|---|---|---|---|
| 0 | **Loading** | (não tem) | Logo MEAN animado sobre vermelho escuro, só na primeira abertura. | ✅ |
| 1 | **Abertura com vídeo** | Vídeo do trabalho em ecrã inteiro. | Vídeo dos projetos (`assets/work-bg.mp4`) em ecrã inteiro, sem som, só com o menu por cima. | ✅ |
| 2 | **Frase de apresentação** | Ao descer, uma frase longa em tipografia grande. | Frase provisória. Falta a frase final: quem é a MEAN, o que faz, o que a distingue. | Secção ✅ · Frase ❌ |
| 3 | **Projetos em destaque (4)** | Grelha de tamanhos mistos. | 4 projetos na grelha do Work (grande + 2 pequenos + largura total). Ligação "Todos os projetos". | Secção ✅ · Projetos ❌ |
| 4 | **O que fazemos (versão curta)** | Disciplinas com listas de serviços. | 5 disciplinas, uma frase cada, cada linha leva à versão completa no About. | Secção ✅ · Frases ✏️ |
| 5 | **Footer** | Frase final, contactos, redes. | Frase "Vamos construir a tua próxima marca, juntos.", menu, serviços, email, Porto, Instagram, LinkedIn. | ✅ |

### Como se comporta

- **Abertura:** o vídeo é o objeto. O ecrã do logo sobe como uma cortina e deixa ver o ecrã em branco, onde o vídeo já está a tocar, pequeno, inteiro e ao centro. Sem chegar a parar, o vídeo cresce num só movimento até ser o fundo da página, e o header entra quando ele acaba de encher o ecrã. Dura cerca de 2 segundos depois do logo. Não há recortes nem máscaras: a miniatura mostra sempre a imagem completa. Num recarregamento (sem logo) a miniatura aparece sobre o branco e cresce da mesma forma.
- **Vídeo:** sem grão nem filtros por cima. Fica preso ao ecrã: quando a página sobe por cima dele, escurece e aproxima-se ligeiramente. Quando fica tapado, pára de tocar.
- **Menu e primeiro scroll:** o menu abre a meio do ecrã, sobre o vídeo. O primeiro scroll move só o menu, até ao topo. Só depois a página começa a subir. Isto acontece só na Home; nas outras páginas o menu está logo no topo.
- **Frase:** acende linha a linha com o scroll.
- **Etiquetas:** as letras aparecem uma a uma, por ordem aleatória.
- **Destaques:** as capas abrem de baixo para cima, em sequência. Ao passar o cursor, a imagem aproxima-se, o cursor estica para uma pill com "VER" e o nome dá lugar à frase curta do projeto.
- **O que fazemos:** ao passar o cursor numa disciplina, a linha inteira inverte (fundo claro, texto escuro), de imediato.

### Frases das disciplinas na Home (rascunho)

- **Branding:** A base que decide como a marca é lembrada.
- **Web:** Sites feitos para funcionar, carregar e converter.
- **Social Media:** Presença com direção, não posts a encher o calendário.
- **Vídeo, Motion e Fotografia:** Imagem pensada para a marca, parada ou em movimento.
- **Estratégia:** A primeira página, não a última.

### Conteúdo em falta

- [ ] Frase de apresentação final
- [ ] Escolher os 4 projetos em destaque
- [ ] Por projeto: nome, frase curta, tipo de trabalho, setor, capa (imagem ou vídeo)
- [ ] Validar as 5 frases das disciplinas

### Decisões fechadas (2026-10-03)

1. Projetos entram como blocos cinzentos provisórios, sem imagens tiradas do vídeo.
2. Nada por cima do vídeo de abertura, só o menu.
3. Vídeo sem som e sem botão de "ver completo".
4. Frase de apresentação fica provisória até haver a final.
5. Vídeo, Motion e Fotografia passam a quinta disciplina.
6. "O que fazemos": versão curta na Home, versão completa no About.
7. A página Intro sai do site e fica guardada em `arquivo/`.
8. A grelha de tamanhos mistos é a do Work. Os 4 destaques da Home usam o mesmo componente.
9. Sem barra flutuante.

### O que a referência tem e ficou de fora

Sequência rápida de imagens do trabalho, lista de todas as pessoas que passaram pelo estúdio, bloco de prémios, frases numeradas sobre o que fazem, barra flutuante. Podem entrar mais tarde.

---

## Work

- **Ficheiro:** `work.html`
- **Referência:** grelha de projetos de https://www.burocratik.com
- **Objetivo:** mostrar todos os projetos com o mesmo peso visual que a referência dá aos seus, e levar a cada página de projeto.
- **De onde se chega:** menu, Home. **Para onde leva:** Projeto, Contact (fecho).

### Secções

| # | Secção | Conteúdo MEAN | Estado |
|---|---|---|---|
| 1 | **Abertura** | Etiqueta "Work", título "Construímos marcas que não passam despercebidas.", uma linha de apoio. | Título ✏️ · Linha ✏️ |
| 2 | **Grelha de projetos** | 8 blocos provisórios no padrão descrito abaixo. | Secção ✅ · Projetos ❌ |
| 3 | **Fecho** | "Queres ser o próximo caso?" e ligação "Fala connosco". | ✏️ |
| 4 | **Footer** | Igual ao resto do site. | ✅ |

### Grelha de projetos

Definida a 2026-10-03 a partir da grelha de projetos da referência. É usada no Work e nos destaques da Home.

```
┌───────────────────────────┐ ┌────────────┐ ┌────────────┐
│                           │ │            │ │            │
│         PROJETO 1         │ │ PROJETO 2  │ │ PROJETO 3  │
│          (grande)         │ │ (pequeno)  │ │ (pequeno)  │
│                           │ └────────────┘ └────────────┘
│                           │ Nome     Tipo  Nome     Tipo
└───────────────────────────┘
Nome         Tipo       Setor

┌─────────────────────────────────────────────────────────┐
│                        PROJETO 4                        │
│                     (largura total)                     │
└─────────────────────────────────────────────────────────┘
Nome                      Tipo                       Setor
```

- **Padrão do Work (8 blocos):** grande, pequeno, pequeno, largura total, pequeno, pequeno, grande, largura total. Para mais projetos, repete-se o padrão.
- **Classes:** `m-tile--lg` (grande, metade da largura), `m-tile--sm` (pequeno, um quarto), `m-tile--full` (largura total).
- **Legenda por baixo de cada imagem:** nome do projeto à esquerda, tipo de trabalho à direita, setor a cinzento (só nos blocos grande e de largura total).
- **Ao passar o cursor:** a imagem aproxima-se, o cursor estica para uma pill com "VER" e o nome dá lugar a uma seta e à frase curta do projeto.
- **Imagens:** sem cantos arredondados, margens e intervalos estreitos. Cada bloco leva à página do projeto.
- **Telemóvel:** os blocos empilham numa coluna, pela mesma ordem.

Por projeto precisamos de: nome, frase curta, tipo de trabalho, setor e capa.
Proporções das capas: blocos grande e pequeno 16:10 (ex.: 1920×1200), bloco de largura total 2:1 (ex.: 2400×1200). Podem ser imagem ou vídeo curto.

### Conteúdo em falta

- [ ] Lista de projetos a mostrar e a ordem
- [ ] Por projeto: nome, frase curta, tipo de trabalho, setor, capa
- [ ] Validar o título e a linha de apoio

### Decisões em aberto

1. **Filtros por disciplina:** a galeria leva filtros (Branding, Web…) ou fica uma lista única?
2. **Ligação a cada projeto:** hoje todos os blocos apontam para `projeto.html`. Liga-se a sério quando a página Projeto estiver planeada.

---

## Projeto

- **Ficheiro:** `projeto.html` (modelo; hoje todos os blocos do Work e da Home apontam para aqui)
- **Referência:** https://www.burocratik.com/work/clear-street
- **Objetivo:** contar um projeto do princípio ao fim: o que era, o que a MEAN fez em cada disciplina e o que ficou, com as imagens a mandar.
- **De onde se chega:** Work, destaques da Home, projeto anterior. **Para onde leva:** projeto seguinte, Work, website do cliente, footer.

### Secções, pela ordem da referência

Legenda: ✅ feito · ❌ falta conteúdo

| # | Secção | O que a referência tem | Conteúdo MEAN | Estado |
|---|---|---|---|---|
| 1 | **Barra do projeto** | "Back", nome do projeto, "Open Website", com linha de progresso. | "← Work", nome do projeto, "Visit website". A linha de progresso da leitura fica no topo do ecrã. O header do site mantém-se por cima, igual ao resto. | Secção ✅ · Nome e link ❌ |
| 2 | **Abertura** | Frase grande à esquerda; ficha técnica à direita (ano, setor, local, entregáveis, prémios). | Frase de abertura do projeto. Ficha: ano, setor, local, entregáveis. | Secção ✅ · Conteúdo ❌ |
| 3 | **Capa** | Imagem ou vídeo a toda a largura. | Capa do projeto (16:8). | Secção ✅ · Imagem ❌ |
| 4 | **Resumo** | Segunda frase à esquerda; texto pequeno em duas colunas à direita. | Segunda frase (contexto ou resultado) e 2 parágrafos. | Secção ✅ · Conteúdo ❌ |
| 5 | **Imagem de margem a margem** | Imagem grande sem margens. | Imagem 16:9. | Secção ✅ · Imagem ❌ |
| 6 | **Capítulo 1** | Título pequeno e texto presos à esquerda; pilha de imagens de larguras variadas à direita. | Um capítulo por disciplina (ex.: Branding): 2 a 4 parágrafos e 3 a 6 imagens. | Secção ✅ · Conteúdo ❌ |
| 7 | **Frase** | Frase a toda a largura. | Uma frase que resume a ideia. | Secção ✅ · Frase ❌ |
| 8 | **Imagem de margem a margem** | Idem. | Idem. | Secção ✅ · Imagem ❌ |
| 9 | **Capítulo 2** | Igual ao 1, espelhado: imagens à esquerda, texto preso à direita. | Segunda disciplina (ex.: Web). | Secção ✅ · Conteúdo ❌ |
| 10 | **Frase de fecho + imagem** | Frase e imagem de margem a margem. | Frase de fecho e imagem final. | Secção ✅ · Conteúdo ❌ |
| 11 | **Projeto seguinte** | (não captado na referência) | Etiqueta, nome do projeto seguinte e a capa dele. | Secção ✅ · Ligação ❌ |
| 12 | **Footer** | Igual ao resto do site. | Igual ao resto do site. | ✅ |

### Como se comporta

- **Linha de progresso:** uma linha fina no topo do ecrã enche à medida que se lê a página.
- **Capítulos:** o texto fica preso ao ecrã enquanto as imagens desse capítulo passam ao lado. Os capítulos alternam de lado.
- **Imagens:** abrem de baixo para cima ao entrar no ecrã. Dentro de cada pilha há três larguras: inteira, estreita e pequena, encostadas ao lado de fora.
- **Frases:** todas no tamanho único do site. A de abertura entra desfocada; as dos interlúdios acendem linha a linha com o scroll.
- **Projeto seguinte:** ao passar o cursor, a pill do cursor mostra "VIEW" e a seta avança.
- **Telemóvel:** tudo numa coluna; o texto de cada capítulo vem antes das imagens e deixa de ficar preso.

### Como se monta um projeto real

- Um capítulo é um bloco `m-pj-chapter` (texto à esquerda) ou `m-pj-chapter m-pj-chapter--flip` (texto à direita). Podem ser 1, 2, 3 ou mais; convém alternar.
- Cada imagem da pilha é um `<div>` com um bloco `m-media` lá dentro. Largura: sem classe = inteira, `is-narrow` = estreita, `is-small` = pequena. Proporção: `r-169` (16:9), `r-32` (3:2), `r-45` (4:5), `r-11` (1:1).
- Para pôr a imagem real, troca-se o bloco cinzento por `<div class="m-media r-169" data-media><img src="…" alt="…"></div>` (ou `<video muted loop playsinline autoplay>`).
- Os textos entram em inglês no HTML e em português no `i18n.js`.

### Por projeto precisamos de

- [ ] Nome, ano, setor, local, entregáveis, link do website (se houver)
- [ ] Frase de abertura e segunda frase
- [ ] 2 parágrafos de resumo
- [ ] Por capítulo (disciplina): 2 a 4 parágrafos e 3 a 6 imagens ou vídeos
- [ ] 1 ou 2 frases de interlúdio
- [ ] Capa (16:8) e 2 ou 3 imagens de margem a margem (16:9)

### Decisões em aberto

1. **Um ficheiro por projeto, ou um modelo com dados?** Hoje há só o modelo. Proposta: uma página por projeto, copiada deste modelo (`projeto-nome-do-cliente.html`), porque cada projeto tem capítulos e imagens diferentes. A alternativa é manter o sistema antigo de pastas e ficheiro de dados (`EDITAR-PROJETOS.js`, `imagens.js`, `Projetos/`), que continua no repositório mas já não é usado por esta página.
2. **Ficha técnica:** entra uma linha de prémios ou reconhecimento, como na referência?
3. **Créditos:** a referência não mostra equipa nem parceiros. Queremos uma linha de créditos no fim?
4. **Ordem do "projeto seguinte":** a ordem do Work, ou escolhida à mão?

---

## About

- **Ficheiro:** `about.html`
- **Referência:** https://www.burocratik.com/studios
- **Objetivo:** mostrar quem é a MEAN e como pensa, para que o cliente certo se reconheça e avance para o contacto.
- **De onde se chega:** menu, Home (serviços). **Para onde leva:** Contact (fecho da página), Work.

### Secções, pela ordem da referência

Legenda: ✅ feito · ✏️ rascunho, falta validar · ❌ falta conteúdo

| # | Secção | O que a referência tem | Conteúdo MEAN | Estado |
|---|---|---|---|---|
| 1 | **Abertura** | Uma frase a dizer quem são, em tipografia gigante. | Frase: "Somos uma agência criativa baseada no Porto." | ✅ |
| 2 | **Clientes** | Título, um parágrafo, 8 logótipos. | "Marcas com quem já trabalhámos." Parágrafo curto. 8 espaços para logótipos. | Título ✏️ · Parágrafo ❌ · Logótipos ❌ |
| 3 | **Número em destaque** | Uma etiqueta e um número enorme (prémios). | Fora da página até haver um número verdadeiro. | por decidir |
| 4 | **Manifesto** | Título, parágrafos de introdução, princípios numerados. | "Chamamo-nos MEAN porque temos opinião…", 2 parágrafos, 8 princípios (título + texto). | ✅ |
| 5 | **O que fazemos (versão completa)** | Disciplinas numeradas: nome, uma frase, lista de serviços. | 5 disciplinas, uma frase cada, listas de 7 a 12 serviços. | Secção ✅ · Listas ✏️ |
| 6 | **Testemunhos** | Carrossel (citação, nome, cargo), contador e setas. | Carrossel com 3 citações provisórias. | Secção ✅ · Citações ❌ |
| 7 | **Fecho e footer** | Frase final a convidar ao contacto, contactos, redes. | "Não somos para todos. Talvez sejamos para ti." e ligação "Trabalha connosco". Footer igual ao resto do site. | ✅ |

**Retirado da página a 2026-10-03, por decisão do Marco:** a fila de círculos M·E·A·N e a fotografia da equipa na abertura, a secção Equipa, a secção Onde estamos (dados do estúdio, localização e fotografias), e o resto da frase de abertura ("Fazemos branding, web, social media e estratégia. Sem dividir o que devia nascer junto."). Tudo isto está no histórico do git (commit 72f91f3) se for para recuperar.

### Como se comporta

- **Abertura:** o título entra desfocado e ganha foco. No Work é igual.
- **Manifesto:** a etiqueta e o contador ficam fixos à esquerda. O princípio que está a meio do ecrã fica aceso, os outros apagam-se, e o contador acompanha (01 a 08).
- **O que fazemos:** os serviços de cada disciplina entram em cascata.
- **Testemunhos:** setas, contador e teclas de seta do teclado.

### "O que fazemos": listas completas (rascunho)

Riscar o que a MEAN não faz e acrescentar o que falta.

- **Branding** · Nome, identidade visual, tom de voz. A base que decide como a marca é lembrada, ou esquecida.
  Estratégia de marca · Posicionamento · Naming · Identidade visual · Logótipo · Tom de voz · Manual de marca · Rebranding · Embalagem · Materiais impressos · Sinalética · Ilustração
- **Web** · Sites que não são só bonitos. São feitos para funcionar, carregar e converter.
  UX/UI · Web design · Desenvolvimento · Landing pages · E-commerce · Portfólios · SEO · Otimização e performance · Textos para web · Manutenção
- **Social Media** · Presença com direção, não posts a preencher o calendário.
  Estratégia de conteúdo · Direção de arte · Gestão de redes · Calendário editorial · Design de publicações · Campanhas pagas · Relatórios
- **Vídeo, Motion e Fotografia** · Imagem pensada para a marca, parada ou em movimento.
  Vídeo de marca · Reels e conteúdo curto · Motion design · Animação de logótipo · Fotografia de produto · Fotografia de espaço e equipa · Edição e pós-produção
- **Estratégia** · A primeira página, não a última. Direção antes de decoração.
  Diagnóstico de marca · Research · Posicionamento · Arquitetura de marca · Plano de comunicação · Campanhas · Consultoria

### Conteúdo em falta (o que precisamos de reunir)

- [ ] Lista de clientes e respetivos logótipos (com autorização para os mostrar)
- [ ] Parágrafo da secção de clientes
- [ ] Validar as listas de serviços por disciplina
- [ ] 2 a 3 testemunhos reais (citação, nome, cargo, empresa)

### Decisões em aberto

1. **"A vida na MEAN":** a versão anterior tinha esta secção (3 blocos). Saiu da página porque a referência não a tem. Confirmar se volta.
2. **Número em destaque:** que número usar, ou não ter a secção.
3. **Testemunhos e clientes:** se não houver conteúdo real a tempo, estas secções saem até haver.
4. **Newsletter no footer:** entra? Obriga a ter política de privacidade.
5. **Idioma:** só português, ou também inglês?
