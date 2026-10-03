# Planeamento do site MEAN

Documento de trabalho partilhado. Cada página tem uma ficha: objetivo, referência, secções, conteúdo, decisões.
As referências servem para a **estrutura e o tipo de conteúdo**. Textos, imagens e desenho são da MEAN.

## Mapa do site

| Página | Ficheiro | Estado |
|---|---|---|
| **Home** | `index.html` | **construída** com conteúdo provisório (2026-10-03) |
| **Work** | `work.html` | **construída** com conteúdo provisório (2026-10-03) |
| **About** | `about.html` | **construída** com conteúdo provisório (2026-10-03) |
| Projeto | `projeto.html` | por planear (mantém a versão anterior) |
| Contact | `contact.html` | por planear (mantém a versão anterior) |
| Intro | `arquivo/index-intro.html` | arquivada, fora do menu. Como recuperar: `arquivo/LEIA-ME.md` |
| 404 | não existe | por criar |
| Política de privacidade | não existe | por criar (o formulário recolhe dados) |

**Conteúdo provisório** quer dizer: a estrutura, o desenho e as animações estão feitos. Os textos marcados como provisórios e os blocos cinzentos esperam pelo conteúdo real.

### Como está montado

- `style.css`: a base é a do sócio. A camada nova fica no fim do ficheiro, com classes começadas por `m-`.
- `motion.js`: todas as animações de entrada e de interação. Liga-se por atributos no HTML (`data-reveal`, `data-split`, `data-media`, `data-stagger`, `data-cursor`, `data-slider`, `data-focus-list`).
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

- **Abertura:** o vídeo fica preso ao ecrã. Ao descer, o resto da página sobe por cima dele como uma folha, e o vídeo escurece e aproxima-se ligeiramente. Quando fica tapado, pára de tocar.
- **Menu:** transparente sobre o vídeo. Esconde-se ao descer e volta ao subir.
- **Frase:** acende palavra a palavra com o scroll.
- **Destaques:** as capas abrem de baixo para cima, em sequência. Ao passar o cursor, a imagem aproxima-se, o cursor estica para uma pill com "VER" e o nome dá lugar à frase curta do projeto.
- **O que fazemos:** ao passar o cursor numa disciplina, as outras apagam-se e a seta avança.

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

## About

- **Ficheiro:** `about.html`
- **Referência:** https://www.burocratik.com/studios
- **Objetivo:** mostrar quem é a MEAN e como pensa, para que o cliente certo se reconheça e avance para o contacto.
- **De onde se chega:** menu, Home (serviços). **Para onde leva:** Contact (fecho da página), Work.

### Secções, pela ordem da referência

Legenda: ✅ feito · ✏️ rascunho, falta validar · ❌ falta conteúdo

| # | Secção | O que a referência tem | Conteúdo MEAN | Estado |
|---|---|---|---|---|
| 1 | **Abertura** | Uma frase a dizer quem são, em tipografia gigante. Fila do símbolo da marca repetido. Fotografia grande da equipa. | Frase: "Somos uma agência criativa baseada no Porto. Fazemos branding, web, social media e estratégia. Sem dividir o que devia nascer junto." Fila de círculos M·E·A·N. Fotografia da equipa. | Frase ✅ · Símbolo ✅ · Fotografia ❌ |
| 2 | **Equipa** | Título, duas linhas sobre as pessoas, grelha de pessoas (retrato, nome, função). | "Falas diretamente com quem faz." Texto de apoio. 2 fundadores. | Texto ✅ · Nomes ❌ · Funções ❌ · Retratos ❌ |
| 3 | **Clientes** | Título, um parágrafo, 8 logótipos. | "Marcas com quem já trabalhámos." Parágrafo curto. 8 espaços para logótipos. | Título ✏️ · Parágrafo ❌ · Logótipos ❌ |
| 4 | **Número em destaque** | Uma etiqueta e um número enorme (prémios). | Fora da página até haver um número verdadeiro. | por decidir |
| 5 | **Manifesto** | Título, parágrafos de introdução, princípios numerados. | "Chamamo-nos MEAN porque temos opinião…", 2 parágrafos, 8 princípios (título + texto). | ✅ |
| 6 | **O que fazemos (versão completa)** | Disciplinas numeradas: nome, uma frase, lista de serviços. | 5 disciplinas, uma frase cada, listas de 7 a 12 serviços. | Secção ✅ · Listas ✏️ |
| 7 | **Testemunhos** | Carrossel (citação, nome, cargo), contador e setas. | Carrossel com 3 citações provisórias. | Secção ✅ · Citações ❌ |
| 8 | **Onde estamos** | Cidade, fotografias do espaço, morada com ligação ao mapa, email. | Porto, morada provisória, email, 3 espaços para fotografias. | Cidade ✅ · Email ✅ · Morada ❌ · Fotografias ❌ |
| 9 | **Fecho e footer** | Frase final a convidar ao contacto, contactos, redes. | "Não somos para todos. Talvez sejamos para ti." e ligação "Trabalha connosco". Footer igual ao resto do site. | ✅ |

### Como se comporta

- **Abertura:** a frase sobe palavra a palavra. Os círculos M·E·A·N aparecem em sequência. A fotografia abre de baixo para cima.
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

- [ ] Fotografia da equipa para a abertura
- [ ] Nomes, funções e retratos dos 2 fundadores
- [ ] Lista de clientes e respetivos logótipos (com autorização para os mostrar)
- [ ] Parágrafo da secção de clientes
- [ ] Validar as listas de serviços por disciplina
- [ ] 2 a 3 testemunhos reais (citação, nome, cargo, empresa)
- [ ] Morada do estúdio e 3 a 4 fotografias do espaço

### Decisões em aberto

1. **Frase de abertura:** está a do texto original ("Somos uma agência criativa baseada no Porto…"). A versão anterior da página tinha "Onde pessoas com opinião se juntam pelo amor ao ofício.". Confirmar qual fica.
2. **"A vida na MEAN":** a versão anterior tinha esta secção (3 blocos). Saiu da página porque a referência não a tem. Confirmar se volta.
3. **Número em destaque:** que número usar, ou não ter a secção.
4. **Testemunhos e clientes:** se não houver conteúdo real a tempo, estas secções saem até haver.
5. **Newsletter no footer:** entra? Obriga a ter política de privacidade.
6. **Idioma:** só português, ou também inglês?
