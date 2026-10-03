# Planeamento do site MEAN

Documento de trabalho partilhado. Cada página tem uma ficha: objetivo, referência, secções, conteúdo, decisões.
As referências servem para a **estrutura e o tipo de conteúdo**. Textos, imagens e desenho são da MEAN.

## Mapa do site

| Página | Ficheiro | Estado |
|---|---|---|
| **Home** | `index.html` | **conteúdos planeados** (página principal do site) |
| Intro | `index-intro.html` | por decidir (fica como página à parte ou sai) |
| Work | `work.html` | por planear |
| Projeto | `projeto.html` | por planear |
| **About** | `about.html` | **conteúdos planeados** (esta ficha) |
| Contact | `contact.html` | por planear |
| 404 | não existe | por criar |
| Política de privacidade | não existe | por criar (o formulário recolhe dados) |

---

## Home

- **Ficheiro:** `index.html` (página principal)
- **Referência:** https://www.burocratik.com
- **Objetivo (proposta):** mostrar o trabalho logo à entrada, dizer numa frase quem é a MEAN, e levar o visitante aos projetos ou ao contacto.
- **De onde se chega:** entrada do site. **Para onde leva:** Projeto (destaques), Work, Contact.

### Secções

Legenda: ✅ temos · ✏️ temos rascunho, falta validar · ❌ falta

| # | Secção | O que a referência tem | Conteúdo MEAN | Estado |
|---|---|---|---|---|
| 0 | **Loading** | (não tem) | Logo MEAN animado sobre vermelho escuro, só na primeira abertura. | ✅ feito |
| 1 | **Abertura com vídeo** | Vídeo do trabalho em ecrã inteiro, com botão para o ver completo. | Vídeo dos projetos (`assets/work-bg.mp4`, 31 s) em ecrã inteiro, com o menu por cima. | Vídeo ✅ (hoje a home usa outro vídeo, trocar) · O que fica por cima ❌ decidir |
| 2 | **Frase de apresentação** | Ao descer, uma frase longa em tipografia grande: o que são e porque confiar neles. | Uma frase: quem é a MEAN, o que faz, o que a distingue. Rascunho: "Somos uma agência criativa do Porto, com opinião. Fazemos branding, web, social media e estratégia, sem dividir o que devia nascer junto." | ✏️ |
| 3 | **Projetos em destaque (4)** | Grelha de tamanhos mistos: um bloco grande, dois pequenos ao lado, um a toda a largura. Por baixo de cada imagem: nome, tipo de trabalho, setor. | 4 projetos nessa grelha (ver "Projetos em destaque: grelha" abaixo). Ligação para o Work. | Grelha ✅ definida · Projetos ❌ (o site ainda não tem nenhum carregado) |
| 4 | **O que fazemos (ramificações)** | Uma linha de introdução e 4 disciplinas, cada uma a abrir numa lista longa de serviços (8 a 14). | As disciplinas da MEAN, cada uma com todos os serviços que oferece. Rascunho abaixo. | Disciplinas ✅ · Listas ✏️ |
| 5 | **Footer** | Frase final a convidar ao contacto, emails, redes sociais, moradas, newsletter. | Frase "Vamos construir a tua próxima marca, juntos.", menu, email, Porto, Instagram, LinkedIn. | ✅ |

### Projetos em destaque: grelha

Definido a 2026-10-03 a partir da grelha de projetos da homepage da referência.

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

- **Linha 1:** um bloco grande à esquerda (metade da largura) e dois pequenos à direita, alinhados pelo topo.
- **Linha 2:** um bloco a toda a largura.
- **Legenda por baixo de cada imagem:** nome do projeto à esquerda, tipo de trabalho ao centro ou à direita, setor a cinzento (só nos blocos grande e de largura total).
- **Ao passar o cursor:** o nome dá lugar a uma seta e à frase curta do projeto.
- **Imagens:** sem cantos arredondados, margens e intervalos estreitos. Cada bloco leva à página do projeto.
- **Telemóvel:** os blocos empilham numa coluna, pela mesma ordem.

Por projeto precisamos de: nome, frase curta, tipo de trabalho, setor e capa.
Proporções das capas: bloco grande e pequenos 3:2 (ex.: 1800×1200), bloco de largura total 2:1 (ex.: 2400×1200). Podem ser imagem ou vídeo curto.

### "O que fazemos": rascunho das ramificações

Riscar o que a MEAN não faz e acrescentar o que falta.

- **Branding:** estratégia de marca · posicionamento · naming · identidade visual · logótipo · tom de voz · manual de marca · rebranding · embalagem · materiais impressos · sinalética · ilustração
- **Web:** UX/UI · web design · desenvolvimento · landing pages · e-commerce · portfólios · SEO · otimização e performance · textos para web · manutenção
- **Social Media:** estratégia de conteúdo · direção de arte · gestão de redes · calendário editorial · design de publicações · vídeo e reels · fotografia · campanhas pagas · relatórios
- **Estratégia:** diagnóstico de marca · research · posicionamento · arquitetura de marca · plano de comunicação · campanhas · consultoria

### O que a referência tem e ficou de fora desta versão

Sequência rápida de imagens do trabalho, lista de todas as pessoas que passaram pelo estúdio, bloco de prémios, frases numeradas sobre o que fazem, testemunhos. Podem entrar mais tarde.

### Conteúdo em falta

- [ ] Escolher os 4 projetos em destaque
- [ ] Por projeto: nome, frase curta, tipo de trabalho, setor, capa (imagem ou vídeo)
- [ ] Validar a frase de apresentação
- [ ] Validar as listas de serviços

### Decisões em aberto

1. **Por cima do vídeo de abertura:** nada, só o logo, ou uma frase curta? Hoje a home tem "Marcas com opinião, feitas por quem as constrói." sobre o vídeo.
2. **Vídeo com som:** botão para ver o vídeo completo com som, como a referência, ou só fundo em silêncio?
3. **Frase de apresentação:** a do rascunho repete a abertura do About. Qual das duas páginas fica com ela?
4. **Quinta disciplina:** vídeo, motion e fotografia ficam dentro de Social Media ou passam a disciplina própria?
5. **"O que fazemos" em duas páginas:** a Home fica com a versão completa (ramificações) e o About com a curta, ou o About deixa de a ter?
6. **Página Intro:** continua no menu, ou sai agora que a Home é a principal?
7. **Mesma grelha na página Work:** a grelha de tamanhos mistos repete-se no Work para todos os projetos, ou o Work mantém a lista em linhas?
8. **Barra flutuante:** a referência tem uma barra fixa no fundo do ecrã com uma frase e um botão para o Work. Entra?

---

## About

- **Referência:** https://www.burocratik.com/studios
- **Objetivo (proposta):** mostrar quem é a MEAN e como pensa, para que o cliente certo se reconheça e avance para o contacto.
- **De onde se chega:** menu, Home. **Para onde leva:** Contact (fecho da página), Work.

### Secções, pela ordem da referência

Legenda: ✅ temos · ✏️ temos rascunho, falta validar · ❌ falta

| # | Secção | O que a referência tem | Conteúdo MEAN | Estado |
|---|---|---|---|---|
| 1 | **Abertura** | Uma frase a dizer quem são, em tipografia gigante. Fila do símbolo da marca repetido. Fotografia grande da equipa. | Frase: "Somos uma agência criativa baseada no Porto. Fazemos branding, web, social media e estratégia. Sem dividir o que devia nascer junto." Símbolo: círculos M·E·A·N. Fotografia da equipa. | Frase ✅ · Símbolo ✅ · Fotografia ❌ |
| 2 | **Equipa** | Título, duas linhas sobre as pessoas, grelha de 9 pessoas (retrato, primeiro nome, função). | Título "Quem faz". Texto: "Falas diretamente com quem faz. Não escondemos ninguém atrás de um cargo bonito…". Os 2 fundadores. | Título ✅ · Texto ✅ · Nomes ❌ · Funções ✏️ · Retratos ❌ |
| 3 | **Clientes** | Título, um parágrafo com humor, 8 logótipos. | Título, parágrafo curto, logótipos dos clientes. | Título ✏️ · Parágrafo ❌ · Lista e logótipos ❌ |
| 4 | **Número em destaque** | Uma etiqueta e um número enorme (prémios). | Um número verdadeiro da MEAN (projetos entregues, marcas, anos). | ❌ (decidir se entra) |
| 5 | **Manifesto** | Título, 3 parágrafos de introdução, 9 princípios numerados de uma frase. | Título "No que acreditamos". Introdução: "Chamamo-nos MEAN porque temos opinião…" e "A estratégia entra desde o primeiro dia…". 8 princípios (título + texto). | ✅ completo |
| 6 | **O que fazemos** | 4 disciplinas numeradas: nome, uma frase, lista de 7 a 14 serviços cada. | Branding, Web, Social Media, Estratégia. Uma frase cada. Listas de serviços. | Disciplinas ✅ · Frases ✏️ · Listas ✏️ (só 3 a 4 serviços cada, completar) |
| 7 | **Testemunhos** | Título, uma linha de introdução, carrossel de 3 (logótipo do cliente, citação, nome, cargo), contador e setas. | 2 a 3 citações reais de clientes. | ❌ |
| 8 | **Onde estamos** | Por estúdio: cidade, 3 a 4 fotografias do espaço, morada com ligação ao mapa, email. | Porto: fotografias, morada, email. | Cidade ✅ · Email ✅ · Morada ❌ · Fotografias ❌ |
| 9 | **Fecho e footer** | Frase final a convidar ao contacto, email geral, ligação para novos projetos, redes sociais, moradas com GPS, subscrição de newsletter com nota de privacidade. | Frase "Não somos para todos. Talvez sejamos para ti." Email, Instagram, LinkedIn, ligação ao Contact. | Frase ✅ · Email ✅ · Redes ✅ · Newsletter ❌ (decidir) |

### Conteúdo em falta (o que precisamos de reunir)

- [ ] Fotografia da equipa para a abertura
- [ ] Nomes, funções e retratos dos 2 fundadores
- [ ] Lista de clientes e respetivos logótipos (com autorização para os mostrar)
- [ ] Parágrafo da secção de clientes
- [ ] Um número verdadeiro para o destaque
- [ ] Listas completas de serviços por disciplina
- [ ] 2 a 3 testemunhos reais (citação, nome, cargo, empresa)
- [ ] Morada do estúdio e 3 a 4 fotografias do espaço

### Decisões em aberto

1. **Frase de abertura:** a do texto original ("Somos uma agência criativa baseada no Porto…") ou a da versão atual da página ("Onde pessoas com opinião se juntam pelo amor ao ofício.")?
2. **Número em destaque:** que número usar, ou retirar a secção.
3. **Testemunhos e clientes:** entram já com conteúdo real, ou a página lança sem estas secções e ganham-nas depois?
4. **"A vida na MEAN":** a página atual tem esta secção (3 blocos) que a referência não tem. Fica ou sai?
5. **Newsletter no footer:** entra? Obriga a ter política de privacidade.
6. **Idioma:** só português, ou também inglês?
