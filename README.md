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

## Como adicionar os logótipos dos clientes

1. Mete os ficheiros na pasta `Clientes/`, um por cliente, com o número à frente para definir a ordem:
   `01-nome-do-cliente.svg`, `02-nome-do-cliente.svg`, … (a secção do About tem 8 espaços).
2. Formato: **SVG** de preferência (ou PNG com fundo transparente, com pelo menos 600 px de largura).
3. Cor: o logótipo numa só cor **clara** (branco), porque a secção tem fundo escuro.
4. Pede ao Claude para os **ligar à secção "Clients" do About** (hoje estão lá os marcadores "Logo 01"…"Logo 08").

## Marca / contactos

- Email: **mean.geral@gmail.com**
- Instagram: **@mean_agency**
- LinkedIn: **Mean Agency**

> O formulário de contacto valida no browser mas ainda não envia emails.
> Para receber mensagens, liga-o a um serviço (Formspree, Resend, etc.) no `main.js`.
