/* ============================================================
   MEAN — línguas
   O site está em inglês no HTML (língua por defeito). Este ficheiro guarda o português:
   à esquerda o texto em inglês TAL COMO ESTÁ NO HTML, à direita a versão portuguesa.

   Para mudar um texto:
     - em português: muda só o lado direito, aqui;
     - em inglês: muda no HTML E no lado esquerdo, aqui (têm de ficar iguais, senão o
       português desse texto deixa de aparecer e fica o inglês).
   Para conferir: abre o site em PT com ?i18ncheck no endereço e vê a consola do browser;
   lista os textos que ficaram sem tradução.

   A escolha fica guardada no browser (localStorage "mean_lang"). O botão do header troca a
   língua na hora, sem recarregar a página.
   ============================================================ */
(function () {
  'use strict';
  var PT = {
    "MEAN · Creative agency, Porto": "MEAN · Agência criativa, Porto",
    "Brand": "Marca",
    "Featured projects": "Projetos em destaque",
    "All projects": "Todos os projetos",
    "Project image": "Imagem do projeto",
    "↳ Short project tagline": "↳ Frase curta do projeto",
    "Type of work": "Tipo de trabalho",
    "Visual Identity, Motion": "Identidade visual, Motion",
    "Sector": "Setor",
    "Metal recycling": "Reciclagem de metais",
    "What we do": "O que fazemos",
    "Everything we do": "Tudo o que fazemos",
    "Five disciplines working as one.": "Cinco disciplinas que trabalham como uma só.",
    "The foundation that decides how a brand is remembered.": "A base que decide como a marca é lembrada.",
    "Websites built to work, load and convert.": "Sites feitos para funcionar, carregar e converter.",
    "Presence with direction, not posts to fill a calendar.": "Presença com direção, não posts a encher o calendário.",
    "Video, Motion & Photography": "Vídeo, Motion e Fotografia",
    "Imagery made for the brand, still or moving.": "Imagem pensada para a marca, <br> parada ou em movimento.",
    "Strategy": "Estratégia",
    "The first page, not the last.": "A primeira página, não a última.",
    "MEAN is a creative agency in Porto that brings strategy, design and copy together so brands stop whispering and start shouting, because the quiet ones get scrolled past.": "A MEAN é uma agência criativa no Porto que junta estratégia, design e copy para as marcas deixarem de sussurrar e começarem a gritar, porque as discretas passam ao lado.",
    "View": "Ver",
    "Brands that don’t need introductions.": "Marcas que não precisam de introdução.",
    "A selection of work across branding, web, social and strategy. Whatever the brief, the standard is the same.": "Uma seleção de trabalhos em marca, web, social e estratégia. Seja qual for o pedido, a exigência é a mesma.",
    "Want to be the next case?": "Queres ser o próximo caso?",
    "Talk with us": "Fala connosco",
    "MEAN projects: branding, web, social media, video and strategy.": "Projetos da MEAN: branding, web, social media, vídeo e estratégia.",
    "We are a creative agency based in Porto.": "Somos uma agência criativa baseada no Porto.",
    "Clients": "Clientes",
    "Client": "Cliente",
    "Brands we've worked with.": "Marcas com quem já trabalhámos.",
    "We treat every brand like it’s ours, which means we’re annoyingly invested in how it turns out.": "Tratamos cada marca como se fosse nossa, o que nos torna irritantemente preocupados com o resultado.",
    "What we believe": "No que acreditamos",
    "We're called MEAN because we have opinions and we don't apologise for them.": "Chamamo-nos MEAN porque temos opinião e não pedimos desculpa por isso.",
    "We don't believe in brands that please everyone, because those usually mean nothing to anyone. We'd rather build something a few people fully identify with than something nobody hates but nobody remembers either.": "Não acreditamos em marcas que agradam a todos, porque essas normalmente não significam nada para ninguém. Preferimos construir algo com <br> que algumas pessoas se identifiquem completamente a construir algo que ninguém odeie, mas que também ninguém lembre.",
    "Strategy comes in on day one, not at the end to justify the rest. We think a brand without clear direction is just pretty design looking for a purpose.": "A estratégia entra desde o primeiro dia, não no fim para justificar o resto. Achamos que uma marca sem direção clara é só design bonito à procura de um propósito.",
    "No sugarcoating.": "Sem paninhos quentes.",
    "If something isn't going to work, we say so before you move ahead. We'd rather bother you once than politely deliver mediocrity.": "Se algo não vai funcionar, dizemos antes de avançares. Preferimos incomodar <br> uma vez a entregar mediocridade educadamente.",
    "Together, not in pieces.": "Junto, não aos bocados.",
    "Identity, web, social, strategy. Either they're born together or they're born limping. Whoever splits them is selling you half a brand.": "Identidade, web, social, estratégia. <br> Ou nascem juntas ou nascem coxas. Quem separa isto vende-te metade <br> de uma marca.",
    "Disagree with us.": "Discorda de nós.",
    "A brief is a starting point, not a bible. You pay us to think with you, not to take dictation.": "Um brief é um ponto de partida, <br> não uma bíblia. Pagas-nos para pensar contigo, não para escrever à tua ordem.",
    "No empty phrases.": "Nada de frases vazias.",
    "“Tailor-made solutions” says nothing to anyone. We write things that only make sense coming from you. The rest is filler.": "“Soluções à medida” não diz nada a ninguém. Escrevemos coisas que só fazem sentido ditas por ti. O resto é enchimento.",
    "We're not for everyone.": "Não somos para todos.",
    "If you're looking for someone who always agrees with you, there are plenty of agencies like that. We stick with those who want to be truly challenged.": "Se procuras alguém que concorde sempre contigo, há muitas agências assim. <br> Nós ficamos com quem quer ser desafiado a sério.",
    "Every brand is its own case.": "Cada marca é um caso.",
    "We have no formula, no template, and we don't copy what worked for another client. What worked there may mean nothing here.": "Não temos fórmula, não temos template, não copiamos o que funcionou noutro cliente. O que funcionou lá pode não significar nada aqui.",
    "Strategy from the start.": "Estratégia desde o início.",
    "It's not the last page of the document, it's the first. If it only shows up once the visuals are done, it's already late.": "Não é a última página do documento, <br> é a primeira. Se só aparece depois do visual pronto, já chegou tarde.",
    "The name is no accident.": "O nome não é acidente.",
    "We chose MEAN with this in mind. If you haven't figured out why yet, it's because you haven't worked with us yet.": "Escolhemos MEAN a pensar nisto. <br> Se ainda não perceberam porquê, é porque ainda não trabalharam connosco.",
    "Name, visual identity, tone of voice. The foundation that decides how a brand is remembered or forgotten.": "Nome, identidade visual, tom de voz. <br> A base que decide como a marca é lembrada ou esquecida.",
    "Brand strategy": "Estratégia de marca",
    "Positioning": "Posicionamento",
    "Visual identity": "Identidade visual",
    "Logo": "Logótipo",
    "Tone of voice": "Tom de voz",
    "Brand guidelines": "Manual de marca",
    "Packaging": "Embalagem",
    "Print materials": "Materiais impressos",
    "Signage": "Sinalética",
    "Illustration": "Ilustração",
    "Websites that aren't just pretty. They're built to work, load and convert.": "Sites que não são só bonitos. São feitos para funcionar, carregar e converter.",
    "Development": "Desenvolvimento",
    "Portfolios": "Portfólios",
    "Optimisation and performance": "Otimização e performance",
    "Web copywriting": "Textos para web",
    "Maintenance": "Manutenção",
    "Presence with direction, not posts to pad out a calendar.": "Presença com direção, não posts <br> a preencher o calendário.",
    "Content strategy": "Estratégia de conteúdo",
    "Art direction": "Direção de arte",
    "Social media management": "Gestão de redes",
    "Editorial calendar": "Calendário editorial",
    "Post design": "Design de publicações",
    "Paid campaigns": "Campanhas pagas",
    "Reporting": "Relatórios",
    "Brand video": "Vídeo de marca",
    "Reels and short-form content": "Reels e conteúdo curto",
    "Logo animation": "Animação de logótipo",
    "Product photography": "Fotografia de produto",
    "Space and team photography": "Fotografia de espaço e equipa",
    "Editing and post-production": "Edição e pós-produção",
    "The first page, not the last. Direction before decoration.": "A primeira página, não a última. <br> Direção antes de decoração.",
    "Brand audit": "Diagnóstico de marca",
    "Brand architecture": "Arquitetura de marca",
    "Communication plan": "Plano de comunicação",
    "Campaigns": "Campanhas",
    "Consulting": "Consultoria",
    "Testimonials": "Testemunhos",
    "“Space for a client testimonial: two or three real sentences about what it was like to work with MEAN.”": "“Sempre acreditei nas minhas ideias, mas ao trabalhar com a Mean apercebi-me que elas podem chegar mais longe do que eu próprio imaginava. Não me ofereceram apenas um serviço, mas um trabalho de visão partilhada. Souberam ouvir, interpretar e transformar aquilo que tinha na cabeça em algo ainda melhor do que tinha pensado. E, pelo caminho, viram problemas e encontraram soluções antes de eu saber que precisava delas.”",
    "“I’ve always believed in my ideas, but working with Mean made me realize they can go further than I ever imagined. They didn’t just offer me a service, they offered a shared vision. They knew how to listen, interpret, and turn what I had in my head into something even better than I had thought of. And along the way, they spotted problems and found solutions before I even knew I needed them.”": "“Sempre acreditei nas minhas ideias, mas ao trabalhar com a Mean apercebi-me que elas podem chegar mais longe do que eu próprio imaginava. Não me ofereceram apenas um serviço, mas um trabalho de visão partilhada. Souberam ouvir, interpretar e transformar aquilo que tinha na cabeça em algo ainda melhor do que tinha pensado. E, pelo caminho, viram problemas e encontraram soluções antes de eu saber que precisava delas.”",
    "Client name": "Nome do cliente",
    "Role, Company": "Cargo, Empresa",
    "Founder, Comédia a Preto e Branco": "Fundador, Comédia a Preto e Branco",
    "We're not for everyone. Maybe we're for you.": "Não somos para todos. Talvez sejamos para ti.",
    "Work with us": "Trabalha connosco",
    "MEAN is an opinionated creative agency from Porto. Who we are, what we believe and what we do.": "A MEAN é uma agência criativa do Porto, com opinião. Quem somos, no que acreditamos e o que fazemos.",
    "Client testimonials": "Testemunhos de clientes",
    "Previous testimonial": "Testemunho anterior",
    "Next testimonial": "Testemunho seguinte",
    "Let's talk about your project.": "Vamos falar sobre o teu projeto.",
    "Name": "Nome",
    "Company": "Empresa",
    "Project type": "Tipo de projeto",
    "Brand Identity": "Identidade de marca",
    "Website / Landing Page": "Website / Landing page",
    "Marketing Strategy": "Estratégia de marketing",
    "Other": "Outro",
    "Estimated budget": "Orçamento estimado",
    "Under €3,000": "Menos de 3.000€",
    "€3,000 – €8,000": "3.000€ – 8.000€",
    "€8,000 – €20,000": "8.000€ – 20.000€",
    "Over €20,000": "Mais de 20.000€",
    "Message": "Mensagem",
    "Send message": "Enviar mensagem",
    "Studio": "Estúdio",
    "Project — MEAN AGENCY": "Projeto — MEAN AGENCY",
    "Logo 01": "Logótipo 01",
    "Project 02": "Projeto 02",
    "Logo 02": "Logótipo 02",
    "Project 03": "Projeto 03",
    "Logo 03": "Logótipo 03",
    "Project 04": "Projeto 04",
    "Logo 04": "Logótipo 04",
    "Project 05": "Projeto 05",
    "Logo 05": "Logótipo 05",
    "Project 06": "Projeto 06",
    "Logo 06": "Logótipo 06",
    "Project 07": "Projeto 07",
    "Logo 07": "Logótipo 07",
    "Logo 08": "Logótipo 08",
    "Creative agency.": "Agência criativa.",
    "All rights reserved.": "Todos os direitos reservados.",
    "We reply within 24h": "Respondemos em menos de 24h",
    "Services": "Serviços",
    "Project name": "Nome do projeto",
    "Visit website": "Ver website",
    "Opening sentence of the project: what it is and what changed, in one or two lines. Placeholder text, to be replaced.": "Frase de abertura do projeto: o que é e o que mudou, em uma ou duas linhas. Texto provisório, a substituir.",
    "Year": "Ano",
    "Client sector": "Setor do cliente",
    "Location": "Local",
    "City, Country": "Cidade, País",
    "Deliverables": "Entregáveis",
    "Project cover": "Capa do projeto",
    "Second sentence: the context, or the result in numbers. Placeholder text.": "Segunda frase: o contexto, ou o resultado em números. Texto provisório.",
    "First paragraph of the summary. Who the client is, what they asked for and why it mattered. Placeholder text.": "Primeiro parágrafo do resumo. Quem é o cliente, o que pediu e porque importava. Texto provisório.",
    "Second paragraph of the summary. What MEAN did and what came out of it. Placeholder text.": "Segundo parágrafo do resumo. O que a MEAN fez e o que saiu daí. Texto provisório.",
    "Full-width image": "Imagem de margem a margem",
    "Text for this chapter. What was done in this discipline and the decisions behind it. Placeholder text.": "Texto deste capítulo. O que foi feito nesta disciplina e as decisões por trás. Texto provisório.",
    "Continue here: the process, the difficulties, what was tried and dropped. Placeholder text.": "Continua aqui: o processo, as dificuldades, o que se tentou e ficou de fora. Texto provisório.",
    "End with what was delivered. Placeholder text.": "Fecha com o que foi entregue. Texto provisório.",
    "A sentence that sums up the idea behind the project. Placeholder text.": "Uma frase que resume a ideia por trás do projeto. Texto provisório.",
    "A closing sentence: what the project left behind. Placeholder text.": "Uma frase de fecho: o que o projeto deixou. Texto provisório.",
    "Next project": "Projeto seguinte",
    "A MEAN project: what it was, what we did and what came out of it.": "Um projeto da MEAN: o que era, o que fizemos e o que saiu daí.",
    "Project not found": "Projeto não encontrado",
    "Please fill in all fields.": "Por favor preenche todos os campos.",
    "Please fill in the missing fields.": "Por favor preenche os campos em falta.",
    "Invalid email.": "Email inválido.",
    "Sending…": "A enviar…",
    "Message sent! We'll reply soon.": "Mensagem enviada! Respondemos em breve.",
    "Close": "Fechar",
    "Contact": "Contacto",
    // Projeto: Metais Jaime Dias (página e textos alternativos das imagens)
    "Brand identity concept for Metais Jaime Dias, a Portuguese leader in metal recycling and industrial waste management.": "Conceito de identidade de marca para a Metais Jaime Dias, líder em Portugal na reciclagem de metais e na gestão de resíduos industriais.",
    "Founded in 1996, Metais Jaime Dias is a Portuguese leader in industrial waste management and metal recycling.": "Fundada em 1996, a Metais Jaime Dias é líder em Portugal na gestão de resíduos industriais e na reciclagem de metais.",
    "From end-of-life vehicles to ferrous and non-ferrous scrap, the company combines nearly three decades of experience, certified processes and a 180,000 m² operation built on environmental responsibility.": "Dos veículos em fim de vida à sucata ferrosa e não ferrosa, a empresa junta quase três décadas de experiência, processos certificados e uma operação de 180 000 m² assente na responsabilidade ambiental.",
    "The following is a proposed concept that was not carried through to the final project.": "O que se segue é um conceito proposto que não chegou a ser usado no projeto final.",
    "Metais Jaime Dias website on a desktop screen": "Website da Metais Jaime Dias num ecrã de computador",
    "Metais Jaime Dias logo in yellow on grey": "Logótipo da Metais Jaime Dias a amarelo sobre cinzento",
    "Construction grid of the Metais Jaime Dias symbol": "Grelha de construção do símbolo da Metais Jaime Dias",
    "Metal tubes marked with coloured tape": "Tubos de metal marcados com fita colorida",
    "Metais Jaime Dias app icon on a phone": "Ícone da aplicação da Metais Jaime Dias num telemóvel",
    "Metais Jaime Dias business cards on concrete": "Cartões de visita da Metais Jaime Dias sobre betão",
    "Metais Jaime Dias envelope and card": "Envelope e cartão da Metais Jaime Dias",
    "Tape with the Metais Jaime Dias pattern": "Fita com o padrão da Metais Jaime Dias",
    "Yellow container with the Metais Jaime Dias symbol": "Contentor amarelo com o símbolo da Metais Jaime Dias",
    "Worker wearing a Metais Jaime Dias vest": "Trabalhador com um colete da Metais Jaime Dias",
    "Metais Jaime Dias sticker on a laptop": "Autocolante da Metais Jaime Dias num portátil",
    "Metais Jaime Dias sign on a building": "Placa da Metais Jaime Dias num edifício",
    // Projeto: DNA Beauty (página e textos alternativos das imagens)
    "Brand identity and website for DNA Beauty, a professional hair and beauty cosmetics brand.": "Identidade de marca e website para a DNA Beauty, uma marca de cosmética profissional para cabelo e beleza.",
    "DNA Beauty is a cosmetics brand dedicated to supplying professional-grade products for hair and beauty care.": "A DNA Beauty é uma marca de cosmética dedicada a fornecer produtos de nível profissional para o cuidado do cabelo e da beleza.",
    "Designed to meet the needs of both professionals and everyday users, it offers a curated selection of tools and essentials focused on performance and reliability.": "Pensada para responder às necessidades de profissionais e de quem a usa no dia a dia, oferece uma seleção cuidada de ferramentas e essenciais, com foco no desempenho e na fiabilidade.",
    "Cosmetics": "Cosmética",
    "Brand Identity, Website": "Identidade de marca, Website",
    "Brand Identity, Website, E-Commerce": "Identidade de marca, Website, E-Commerce",
    "DNA Beauty website header in a browser window": "Cabeçalho do website da DNA Beauty numa janela de browser",
    "DNA Beauty logo on light blue": "Logótipo da DNA Beauty sobre azul claro",
    "DNA Beauty branded tape and packaging": "Fita e embalagem com a marca DNA Beauty",
    "DNA Beauty app icon and browser tab": "Ícone da aplicação e separador do browser da DNA Beauty",
    "Hairdressing scissors on a teal background": "Tesoura de cabeleireiro sobre fundo azul-petróleo",
    "Comb on a teal background": "Pente sobre fundo azul-petróleo",
    "Razor blade on a teal background": "Lâmina de barbear sobre fundo azul-petróleo",
    "Round hairbrush on a teal background": "Escova redonda sobre fundo azul-petróleo",
    "Hair dryer on a teal background": "Secador de cabelo sobre fundo azul-petróleo",
    "Black comb on a teal background": "Pente preto sobre fundo azul-petróleo",
    "DNA Beauty business cards": "Cartões de visita da DNA Beauty",
    "DNA Beauty social media posts": "Publicações da DNA Beauty nas redes sociais",
    "DNA Beauty content on a phone": "Conteúdos da DNA Beauty num telemóvel",
    "DNA Beauty brand board: logo, colours and typefaces": "Quadro da marca DNA Beauty: logótipo, cores e tipos de letra",
    // Projeto: Solnovo (página e textos alternativos das imagens e dos vídeos)
    "Visual identity and motion for Solnovo, a travel agency that crafts personalized trips.": "Identidade visual e motion para a Solnovo, uma agência de viagens que cria viagens personalizadas.",
    "Solnovo is a travel agency dedicated to crafting personalized trips while securing the best discounts for its clients.": "A Solnovo é uma agência de viagens dedicada a criar viagens personalizadas e a garantir os melhores descontos para os seus clientes.",
    "The visual identity is inspired by the idea of seeing the sun from a new corner of the world symbolizing fresh experiences and new perspectives.": "A identidade visual inspira-se na ideia de ver o sol a partir de um novo canto do mundo, símbolo de experiências novas e de outras perspetivas.",
    "Each continent is represented by a unique color, reflecting the diversity of destinations Solnovo offers.": "Cada continente é representado por uma cor própria, que reflete a diversidade de destinos que a Solnovo oferece.",
    "The identity combines warmth and vibrancy to communicate trust, adventure, and a tailored approach to travel planning.": "A identidade junta calor e energia para comunicar confiança, aventura e uma forma de planear viagens feita à medida.",
    "Travel": "Viagens",
    "Visual Identity": "Identidade visual",
    "Solnovo street posters with a view of Florence": "Cartazes de rua da Solnovo com uma vista de Florença",
    "Solnovo notebook and city-name stickers": "Caderno da Solnovo e autocolantes com nomes de cidades",
    "Solnovo business cards": "Cartões de visita da Solnovo",
    "Solnovo logo on dark green": "Logótipo da Solnovo sobre verde-escuro",
    "Solnovo animation: city guide cards": "Animação da Solnovo: cartões de guias de cidades",
    "Solnovo logo over aerial footage of green cliffs": "Logótipo da Solnovo sobre imagens aéreas de falésias verdes",
    "Solnovo logo over aerial footage of a rocky cove": "Logótipo da Solnovo sobre imagens aéreas de uma enseada rochosa",
    "Solnovo animation: city names on colour": "Animação da Solnovo: nomes de cidades sobre cor",
    "Solnovo animation: travel photos": "Animação da Solnovo: fotografias de viagem",
    // Projeto: Comédia a Preto & Branco (página e textos alternativos das imagens)
    "Brand identity and website for Comédia a Preto & Branco, a stand-up comedy platform from Porto.": "Identidade de marca e website para o Comédia a Preto & Branco, uma plataforma de stand-up comedy do Porto.",
    "Comédia a Preto & Branco was born in Porto in 2024, created by comedians David Santos and Tomás Matos to promote stand-up comedy and produce comedy video content.": "O Comédia a Preto & Branco nasceu no Porto, em 2024, pelas mãos dos humoristas David Santos e Tomás Matos, para promover stand-up comedy e criar conteúdos audiovisuais de humor.",
    "It is a platform for comedy interaction, promotion and participation: it brings Portuguese comedians together in original productions and live shows, runs comedy nights and puts different generations of comedians on the same stage.": "É uma plataforma de interação, divulgação e participação humorística: reúne artistas da comédia nacional em produções originais e espetáculos ao vivo, dinamiza noites de comédia e junta diferentes gerações de humoristas no mesmo palco.",
    "Comedy": "Comédia",
    "Comédia a Preto & Branco website: home page": "Website do Comédia a Preto & Branco: página inicial",
    "Comédia a Preto & Branco animated logo": "Logótipo animado do Comédia a Preto & Branco",
    "Comédia a Preto & Branco website: content formats on the home page": "Website do Comédia a Preto & Branco: formatos de conteúdos na página inicial",
    "Comédia a Preto & Branco website on a phone: home page": "Website do Comédia a Preto & Branco no telemóvel: página inicial",
    "Comédia a Preto & Branco website: comedians page": "Website do Comédia a Preto & Branco: página dos humoristas",
    "Comédia a Preto & Branco website: content page": "Website do Comédia a Preto & Branco: página de conteúdos",
    "Comédia a Preto & Branco stand-up night": "Noite de stand-up do Comédia a Preto & Branco",
    "Comédia a Preto & Branco website: about page": "Website do Comédia a Preto & Branco: página Sobre nós",
    "Comédia a Preto & Branco website on a phone: comedians page": "Website do Comédia a Preto & Branco no telemóvel: página dos humoristas",
    "T-shirt with the Comédia a Preto & Branco logo on the back": "T-shirt com o logótipo do Comédia a Preto & Branco nas costas",
  };

  var lang = 'en';
  try { if (localStorage.getItem('mean_lang') === 'pt') lang = 'pt'; } catch (e) {}
  var norm = function (s) { return String(s).replace(/\s+/g, ' ').trim(); };
  var check = /[?&]i18ncheck/.test(location.search);

  window.MEAN_LANG = lang;
  // para textos escritos por JavaScript: t('Sending…')
  window.t = function (en) { return (lang === 'pt' && PT[en]) || en; };

  /* A língua troca-se na hora, sem recarregar. Para isso guarda-se o inglês de cada texto da página:
       texts  — textos soltos (o nó de texto e o que lá estava em inglês);
       attrs  — atributos com texto (alt, aria-label, placeholder, title, data-cursor);
       blocks — blocos que o motion.js parte em palavras ou letras ([data-split], .m-label): guarda-se o
                HTML inteiro do bloco em inglês; ao trocar de língua o bloco é reposto e o motion.js volta a parti-lo;
       live   — textos postos por JavaScript que mudam com o uso (mensagens do formulário). */
  var ATTRS = ['placeholder', 'aria-label', 'alt', 'title', 'data-cursor'];
  var BLOCKS = '[data-split], .m-label';
  var texts = [], attrs = [], blocks = [], live = [];
  var skipped = function (el) { return !!(el && el.closest && el.closest('[data-i18n-skip]')); };   // o header fica sempre em inglês
  // um texto na língua atual, mantendo os espaços à volta
  function say(en) {
    var pt = lang === 'pt' && PT[norm(en)];
    return pt ? en.replace(en.trim(), function () { return pt.replace(/\s*<br>\s*/g, ' '); }) : en;
  }
  /* Quebras de linha manuais (vêm dos ficheiros de texto). No HTML são <br class="m-br">; numa tradução são
     "<br>" a meio do texto. Um elemento só com texto e quebras traduz-se inteiro: a chave no dicionário é a
     frase sem as quebras, e é a tradução que diz onde o português parte (pode não ser onde parte o inglês). */
  function plain(el) {      // só texto e quebras manuais lá dentro?
    for (var c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType !== 3 && !(c.nodeType === 1 && c.tagName === 'BR' && c.className === 'm-br')) return false;
    }
    return !!el.firstChild;
  }
  function phrase(el) {     // o texto do elemento, com um espaço no lugar de cada quebra
    var s = '';
    for (var c = el.firstChild; c; c = c.nextSibling) s += c.nodeType === 3 ? c.nodeValue : ' ';
    return norm(s);
  }
  function broken(el) {     // tem quebras manuais, ou a tradução dele tem?
    for (var c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 1) return true;
    var pt = PT[phrase(el)];
    return !!pt && pt.indexOf('<br>') >= 0;
  }
  function fill(el, text) { // escreve um texto no elemento, com <br class="m-br"> onde ele tiver "<br>"
    var parts = text.split(/\s*<br>\s*/);
    el.textContent = '';
    parts.forEach(function (p, i) {
      if (i) { var b = document.createElement('br'); b.className = 'm-br'; el.appendChild(b); }
      el.appendChild(document.createTextNode(i < parts.length - 1 ? p + ' ' : p));   // o espaço fica para quando a quebra não se usa (telemóvel)
    });
  }
  function sayAttr(en) { return (lang === 'pt' && PT[norm(en)]) || en; }
  // o HTML de um bloco na língua atual
  function blockHTML(en) {
    if (lang !== 'pt') return en;
    var box = document.createElement('div');
    box.innerHTML = en;
    [box].concat(Array.prototype.slice.call(box.querySelectorAll('*'))).forEach(function (el) {   // frases com quebras de linha
      if (plain(el) && broken(el) && PT[phrase(el)]) fill(el, PT[phrase(el)]);
    });
    var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) n.nodeValue = say(n.nodeValue);
    ATTRS.forEach(function (attr) {
      Array.prototype.forEach.call(box.querySelectorAll('[' + attr + ']'), function (el) { el.setAttribute(attr, sayAttr(el.getAttribute(attr))); });
    });
    return box.innerHTML;
  }
  // regista os textos de uma parte da página (tem de estar em inglês e ainda por partir)
  function scan(rootEl) {
    var list = Array.prototype.slice.call(rootEl.querySelectorAll(BLOCKS));
    if (rootEl.matches && rootEl.matches(BLOCKS)) list.unshift(rootEl);
    list.forEach(function (el) {
      if (el.__i18n || skipped(el) || (el.parentNode && el.parentNode.closest && el.parentNode.closest(BLOCKS))) return;
      el.__i18n = true;
      blocks.push({ el: el, en: el.innerHTML });
    });
    // fora desses blocos, os elementos com quebras de linha manuais também se repõem inteiros ao trocar de língua
    Array.prototype.forEach.call(rootEl.querySelectorAll('*'), function (el) {
      if (el.__i18n || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.nodeName) || skipped(el) || (el.closest && el.closest(BLOCKS))) return;
      if (!plain(el) || !broken(el)) return;
      el.__i18n = el.__phrase = true;
      blocks.push({ el: el, en: el.innerHTML });
    });
    var w = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var p = n.parentNode;
      if (!p || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.nodeName) || skipped(p)) continue;
      if (p.__phrase || (p.closest && p.closest(BLOCKS))) continue;
      if (norm(n.nodeValue)) texts.push({ node: n, en: n.nodeValue });
    }
    ATTRS.forEach(function (attr) {
      var els = Array.prototype.slice.call(rootEl.querySelectorAll('[' + attr + ']'));
      if (rootEl.hasAttribute && rootEl.hasAttribute(attr)) els.unshift(rootEl);
      els.forEach(function (el) {
        if (skipped(el) || (el.closest && el.closest(BLOCKS))) return;
        attrs.push({ el: el, attr: attr, en: el.getAttribute(attr) });
      });
    });
  }
  // põe na língua atual o que foi registado a partir das posições dadas (tudo, se não se disser nada)
  function apply(t0, a0, b0, resetBlocks) {
    var i, r, v;
    for (i = t0 || 0; i < texts.length; i++) { r = texts[i]; v = say(r.en); if (r.node.nodeValue !== v) r.node.nodeValue = v; }
    for (i = a0 || 0; i < attrs.length; i++) { r = attrs[i]; v = sayAttr(r.en); if (r.el.getAttribute(r.attr) !== v) r.el.setAttribute(r.attr, v); }
    if (resetBlocks) for (i = b0 || 0; i < blocks.length; i++) blocks[i].el.innerHTML = blockHTML(blocks[i].en);
  }
  var head = {
    title: document.title,
    meta: document.querySelector('meta[name="description"]'),
    desc: (document.querySelector('meta[name="description"]') || {}).content || ''
  };
  function applyHead() {
    document.documentElement.lang = lang;
    document.title = sayAttr(head.title);
    if (head.meta) head.meta.content = sayAttr(head.desc);
  }
  function buttons() {   // o botão do header mostra a outra língua
    var next = lang === 'pt' ? 'en' : 'pt';
    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-switch]'), function (btn) {
      btn.textContent = next.toUpperCase();
      btn.setAttribute('aria-label', next === 'pt' ? 'Mudar para português' : 'Switch to English');
      btn.setAttribute('lang', next);
    });
  }
  function missing() {   // ?i18ncheck: o que ficou sem tradução
    var out = [], seen = {};
    var note = function (s) { var k = norm(s); if (k && /[a-z]{3}/i.test(k) && !PT[k] && !seen[k]) { seen[k] = 1; out.push(k); } };
    texts.forEach(function (r) { note(r.en); });
    blocks.forEach(function (b) {
      var box = document.createElement('div'); box.innerHTML = b.en;
      var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) note(n.nodeValue);
    });
    console.log('[i18n] sem tradução para PT:', out);
  }
  function setLang(next) {
    if (next !== 'pt' && next !== 'en') return;
    if (next === lang) return;
    lang = next; window.MEAN_LANG = lang;
    try { localStorage.setItem('mean_lang', lang); } catch (e) {}
    applyHead();
    apply(0, 0, 0, true);
    live.forEach(function (el) { if (el.__en) el.textContent = window.t(el.__en); });
    buttons();
    // quem partiu textos em palavras ou letras (motion.js) volta a fazê-lo agora, antes de o ecrã ser pintado
    var ev;
    try { ev = new CustomEvent('mean:lang', { detail: { lang: lang } }); }
    catch (e) { ev = document.createEvent('CustomEvent'); ev.initCustomEvent('mean:lang', false, false, { lang: lang }); }
    window.dispatchEvent(ev);
  }

  scan(document.body);
  applyHead();
  if (lang === 'pt') apply(0, 0, 0, true);   // ao carregar, os blocos ainda estão por partir
  if (check && lang === 'pt') missing();
  buttons();
  Array.prototype.forEach.call(document.querySelectorAll('[data-lang-switch]'), function (btn) {
    btn.addEventListener('click', function () { setLang(lang === 'pt' ? 'en' : 'pt'); });
  });

  // para o que é criado depois por JavaScript (ex.: o painel "Talk with us", feito em inglês pelo main.js)
  window.meanI18n = {
    scan: function (el) { var t0 = texts.length, a0 = attrs.length, b0 = blocks.length; scan(el); apply(t0, a0, b0, lang === 'pt'); },
    set: function (el, en) {                 // um texto que muda com o uso: fica sempre na língua atual
      el.__en = en || '';
      if (live.indexOf(el) < 0) live.push(el);
      el.textContent = en ? window.t(en) : '';
    },
    setLang: setLang,
    lang: function () { return lang; }
  };

  document.documentElement.classList.remove('i18n-wait');
})();
