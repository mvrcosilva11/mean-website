# MEAN AGENCY — Website

Site estático (HTML/CSS/JS, sem build) com a **mesma organização do Portfolio Nupi**.
Abre o `index.html` num browser ou publica a pasta inteira (Netlify, Vercel, GitHub Pages).

## Estrutura

```
_Mean_Website/
├── index.html            # Home (wordmark MEAN)
├── work.html             # "Selected projects" — grelha grande
├── projects.html         # "All projects" — grelha compacta
├── projeto.html          # Página de um projeto (?p=<pasta>)
├── about.html            # Sobre a agência
│
├── EDITAR-PROJETOS.js    # ← FONTE DE DADOS: nome/categoria/cor/texto de cada projeto
├── imagens.js            # AUTO-gerado: lista de imagens por pasta (não editar à mão)
├── projetos-textos.md    # Doc humano com os textos dos projetos
├── main.js               # Comportamento (nav, relógio, tema, projeto, form)
├── style.css             # Estilos + temas light/dark
│
├── TEXTOS-SITE.txt       # ← todo o copy do site, página a página (EN e PT), para editar sem mexer no código
├── TEXTOS-PROJETOS.txt   # ← o copy dos projetos (grelhas e página de projeto), EN e PT
├── Abrir site local.command  # ← duplo clique: abre o site neste computador, ligado aos ficheiros de texto
├── ferramentas/          # textos.py (passa os textos para o site) e servidor-local.py (site local que recarrega sozinho)
├── Projetos/             # 1 pasta por projeto: NN-slug/ com 00-capa.png + 01.png, 02.png…
├── Clientes/             # logótipos dos clientes (secção "Clients" do About): 01-nome.svg, 02-nome.svg…
├── assets/               # imagens gerais (about-visual.jpg, etc.)
└── fonts/                # fontes locais (opcional)
```

## Como adicionar um projeto

1. Cria a pasta `Projetos/NN-nome-do-cliente/`.
2. Mete lá a capa `00-capa.png` (e, se quiseres, `00-capa-hover.png`) + as imagens `01.png`, `02.jpg`, …
3. Adiciona o bloco do projeto no `EDITAR-PROJETOS.js` (há um exemplo lá em cima).
4. Pede ao Claude para **regenerar o `imagens.js`** a partir das pastas.

## Como adicionar um projeto (site atual)

1. Põe as imagens em `Projetos/NN-nome-do-cliente/`: `00-capa` (a imagem das grelhas da Home e do Work) e depois
   `01`, `02`, … pela ordem em que aparecem na página. A página abre com a `01`; a capa só aparece na página se for
   essa a intenção (no Metais Jaime Dias é a primeira imagem).
2. Pede ao Claude para criar a página. Ele copia o modelo `projeto.html` para `projeto-nome-do-cliente.html`, liga o
   cartão do projeto nas grelhas da Home e do Work e junta o bloco da página ao `TEXTOS-PROJETOS.txt`.
   As imagens entram tal como estão na pasta: não se convertem nem se comprimem.
3. Feitos assim: `projeto-metais-jaime-dias.html`, `projeto-dna-beauty.html` e `projeto-solnovo.html` (este com vídeos:
   `<video muted loop playsinline preload="metadata">` dentro do bloco `m-media`; tocam sozinhos só enquanto estão no ecrã). Como se compõe uma página (capítulos,
   larguras e proporções das imagens) está em `PLANEAMENTO.md`, na secção Projeto; a esses blocos juntam-se
   `m-pj-pair` (duas imagens lado a lado; `m-pj-pair--fit` quando têm proporções diferentes) e `r-43` (proporção 4:3).
   Todas as imagens ficam entre as margens da página.
4. Os entregáveis da ficha (Deliverables) mandam: o tipo de trabalho do cartão nas grelhas e o título do capítulo
   (quando a página tem um só) são sempre essa lista, separada por vírgulas. Quem trata disso é o
   `ferramentas/textos.py`, cada vez que corre; não se escrevem à mão.

## Como editar os textos do site

1. Abre o site local: duplo clique em `Abrir site local.command` (abre http://localhost:8765; deixa a janela do
   Terminal aberta). Se o Claude já tiver o site local aberto, não é preciso.
2. Abre `TEXTOS-SITE.txt` (páginas) ou `TEXTOS-PROJETOS.txt` (projetos) e muda o texto à frente de `EN:` e de `PT:`
   (nas listas, de cada lado da barra `|`).
3. Guarda (Cmd + S). Em um ou dois segundos a página aberta recarrega com o texto novo, em inglês e em português.
4. Não apagues nem acrescentes linhas; cada texto fica numa só linha. Se houver um erro, aparece um aviso no fundo da
   página (e no ficheiro `TEXTOS-ERRO.txt`) a dizer a linha; corrige e guarda outra vez.

As alterações ficam só neste computador até se fazer commit e push ("fecha sessão").

Para obrigar um texto a mudar de linha num sítio certo, escreve-se `<br>` nesse sítio, no ficheiro de texto (o inglês e o
português podem partir em sítios diferentes). No HTML fica `<br class="m-br">` e na tradução do `i18n.js` fica `<br>`
dentro do texto; a chave no dicionário é a frase sem as quebras. Vale em computador e tablet; no telemóvel não se usam.

Como funciona: `ferramentas/servidor-local.py` vigia os dois ficheiros e chama `ferramentas/textos.py`, que troca o
inglês nas páginas (ou no `main.js`, para o painel de contacto), acerta o dicionário de português no `i18n.js` e sobe
o número `?v=` das páginas. Só aplica as linhas que mudaram desde a última vez, por isso não desfaz textos mudados
diretamente nas páginas. Depois de mexer nos textos à mão nas páginas (ou de um pull), corre
`python3 ferramentas/textos.py atualizar` para os ficheiros de texto voltarem a mostrar o que o site diz.

> Os ficheiros antigos `EDITAR-PROJETOS.js`, `imagens.js` e `projetos-textos.md` são da versão anterior do site
> e já não são lidos por nenhuma página.

## Como adicionar os logótipos dos clientes

1. Mete os ficheiros na pasta `Clientes/`, um por cliente: PNG com fundo transparente (ou SVG). A cor do ficheiro não
   interessa: no site aparecem todos no mesmo cinzento claro (o ficheiro serve de máscara) e a branco no hover.
2. Pede ao Claude para os pôr na grelha do About. Ele mede a caixa do desenho dentro de cada imagem (sem a margem
   transparente) e escreve-a no HTML, para todos caberem na mesma moldura e ficarem com o mesmo peso.
3. A grelha tem 8 espaços; os que ainda não têm logótipo ficam com o texto provisório "Logo 0N".

## Marca / contactos

- Email: **mean.geral@gmail.com**
- Instagram: **@mean_agency**
- LinkedIn: **Mean Agency**

> O formulário de contacto valida no browser mas ainda não envia emails.
> Para receber mensagens, liga-o a um serviço (Formspree, Resend, etc.) no `main.js`.
