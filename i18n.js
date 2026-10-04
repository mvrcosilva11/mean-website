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
   língua e recarrega a página.
   ============================================================ */
(function () {
  'use strict';
  var PT = {
    "MEAN · Creative agency, Porto": "MEAN · Agência criativa, Porto",
    "MEAN's opening statement. One long sentence that says who we are, what we do and what sets us apart from other agencies. Placeholder text, to be replaced with the final line.": "Frase de apresentação da MEAN. Uma frase longa, que diz quem somos, o que fazemos e o que nos distingue das outras agências. Texto provisório, a substituir pela frase final.",
    "Featured projects": "Projetos em destaque",
    "All projects": "Todos os projetos",
    "Project image": "Imagem do projeto",
    "↳ Short project tagline": "↳ Frase curta do projeto",
    "Type of work": "Tipo de trabalho",
    "Sector": "Setor",
    "What we do": "O que fazemos",
    "Everything we do": "Tudo o que fazemos",
    "Five disciplines working as one.": "Cinco disciplinas que trabalham como uma só.",
    "The foundation that decides how a brand is remembered.": "A base que decide como a marca é lembrada.",
    "Websites built to work, load and convert.": "Sites feitos para funcionar, carregar e converter.",
    "Presence with direction, not posts to fill a calendar.": "Presença com direção, não posts a encher o calendário.",
    "Video, Motion & Photography": "Vídeo, Motion e Fotografia",
    "Imagery made for the brand, still or moving.": "Imagem pensada para a marca, parada ou em movimento.",
    "Strategy": "Estratégia",
    "The first page, not the last.": "A primeira página, não a última.",
    "MEAN is a creative agency from Porto. Branding, web, social media, video and strategy, without splitting what should be born together.": "MEAN é uma agência criativa do Porto. Branding, web, social media, vídeo e estratégia, sem dividir o que devia nascer junto.",
    "MEAN project reel": "Vídeo dos projetos da MEAN",
    "View": "Ver",
    "We build brands that don't go unnoticed.": "Construímos marcas que não passam despercebidas.",
    "A selection of projects where branding, web, social and strategy were born together — not in pieces.": "Uma seleção de projetos onde branding, web, social e estratégia nasceram juntos — não aos bocados.",
    "Want to be the next case?": "Queres ser o próximo caso?",
    "Talk with us": "Fala connosco",
    "Talk with us — MEAN AGENCY": "Fala connosco — MEAN AGENCY",
    "MEAN projects: branding, web, social media, video and strategy.": "Projetos da MEAN: branding, web, social media, vídeo e estratégia.",
    "We are a creative agency based in Porto.": "Somos uma agência criativa baseada no Porto.",
    "Clients": "Clientes",
    "Brands we've worked with.": "Marcas com quem já trabalhámos.",
    "A short paragraph about our clients and the kind of relationship we have with them. Placeholder text.": "Parágrafo curto sobre os clientes e o tipo de relação que temos com eles. Texto provisório.",
    "What we believe": "No que acreditamos",
    "We're called MEAN because we have opinions and we don't apologise for them.": "Chamamo-nos MEAN porque temos opinião e não pedimos desculpa por isso.",
    "We don't believe in brands that please everyone, because those usually mean nothing to anyone. We'd rather build something a few people fully identify with than something nobody hates but nobody remembers either.": "Não acreditamos em marcas que agradam a todos, porque essas normalmente não significam nada para ninguém. Preferimos construir algo com que algumas pessoas se identifiquem completamente a construir algo que ninguém odeie, mas que também ninguém lembre.",
    "Strategy comes in on day one, not at the end to justify the rest. We think a brand without clear direction is just pretty design looking for a purpose.": "A estratégia entra desde o primeiro dia, não no fim para justificar o resto. Achamos que uma marca sem direção clara é só design bonito à procura de um propósito.",
    "No sugarcoating.": "Sem paninhos quentes.",
    "If something isn't going to work, we say so before you move ahead. We'd rather bother you once than politely deliver mediocrity.": "Se algo não vai funcionar, dizemos antes de avançares. Preferimos incomodar uma vez a entregar mediocridade educadamente.",
    "Together, not in pieces.": "Junto, não aos bocados.",
    "Identity, web, social, strategy. Either they're born together or they're born limping. Whoever splits them is selling you half a brand.": "Identidade, web, social, estratégia. Ou nascem juntas ou nascem coxas. Quem separa isto vende-te metade de uma marca.",
    "Disagree with us.": "Discorda de nós.",
    "A brief is a starting point, not a bible. You pay us to think with you, not to take dictation.": "Um brief é um ponto de partida, não uma bíblia. Pagas-nos para pensar contigo, não para escrever à tua ordem.",
    "No empty phrases.": "Nada de frases vazias.",
    "“Tailor-made solutions” says nothing to anyone. We write things that only make sense coming from you. The rest is filler.": "“Soluções à medida” não diz nada a ninguém. Escrevemos coisas que só fazem sentido ditas por ti. O resto é enchimento.",
    "We're not for everyone.": "Não somos para todos.",
    "If you're looking for someone who always agrees with you, there are plenty of agencies like that. We stick with those who want to be truly challenged.": "Se procuras alguém que concorde sempre contigo, há muitas agências assim. Nós ficamos com quem quer ser desafiado a sério.",
    "Every brand is its own case.": "Cada marca é um caso.",
    "We have no formula, no template, and we don't copy what worked for another client. What worked there may mean nothing here.": "Não temos fórmula, não temos template, não copiamos o que funcionou noutro cliente. O que funcionou lá pode não significar nada aqui.",
    "Strategy from the start.": "Estratégia desde o início.",
    "It's not the last page of the document, it's the first. If it only shows up once the visuals are done, it's already late.": "Não é a última página do documento, é a primeira. Se só aparece depois do visual pronto, já chegou tarde.",
    "The name is no accident.": "O nome não é acidente.",
    "We chose MEAN with this in mind. If you haven't figured out why yet, it's because you haven't worked with us yet.": "Escolhemos MEAN a pensar nisto. Se ainda não perceberam porquê, é porque ainda não trabalharam connosco.",
    "Name, visual identity, tone of voice. The foundation that decides how a brand is remembered — or forgotten.": "Nome, identidade visual, tom de voz. A base que decide como a marca é lembrada — ou esquecida.",
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
    "Presence with direction, not posts to pad out a calendar.": "Presença com direção, não posts a preencher o calendário.",
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
    "The first page, not the last. Direction before decoration.": "A primeira página, não a última. Direção antes de decoração.",
    "Brand audit": "Diagnóstico de marca",
    "Brand architecture": "Arquitetura de marca",
    "Communication plan": "Plano de comunicação",
    "Campaigns": "Campanhas",
    "Consulting": "Consultoria",
    "Testimonials": "Testemunhos",
    "“Space for a client testimonial: two or three real sentences about what it was like to work with MEAN.”": "“Espaço para um testemunho de cliente: duas ou três frases, reais, sobre como foi trabalhar com a MEAN.”",
    "Client name": "Nome do cliente",
    "Role, Company": "Cargo, Empresa",
    "We're not for everyone. Maybe we're for you.": "Não somos para todos. Talvez sejamos para ti.",
    "Work with us": "Trabalha connosco",
    "MEAN is an opinionated creative agency from Porto. Who we are, what we believe and what we do.": "A MEAN é uma agência criativa do Porto, com opinião. Quem somos, no que acreditamos e o que fazemos.",
    "Client testimonials": "Testemunhos de clientes",
    "Previous testimonial": "Testemunho anterior",
    "Next testimonial": "Testemunho seguinte",
    "Let's talk about your project.": "Vamos falar sobre o teu projeto.",
    "No detours, no nonsense.": "Sem rodeios, sem tretas.",
    "Talk to us directly": "Fala diretamente connosco",
    "We reply within 24 hours, every working day. No middlemen — whoever answers is who will work with you.": "Respondemos em menos de 24h, todos os dias úteis. Sem intermediários — quem responde é quem vai trabalhar contigo.",
    "Name": "Nome",
    "Estimated budget": "Orçamento estimado",
    "Select an option": "Seleciona uma opção",
    "Under €3,000": "Menos de 3.000€",
    "€3,000 – €8,000": "3.000€ – 8.000€",
    "€8,000 – €20,000": "8.000€ – 20.000€",
    "Over €20,000": "Mais de 20.000€",
    "Message": "Mensagem",
    "Send message": "Enviar mensagem",
    "How it works": "Como funciona",
    "You send the message": "Enviaste a mensagem",
    "You tell us what you need. No endless forms, just the essentials so we can start thinking.": "Contas-nos o que precisas. Sem formulários intermináveis, só o essencial para começarmos a pensar.",
    "A 20-minute call": "Conversa de 20 minutos",
    "A quick call, no strings attached, to see if we make sense for each other.": "Uma chamada rápida, sem compromisso, para perceber se fazemos sentido um para o outro.",
    "A tailored proposal": "Proposta à medida",
    "Scope, timings and costs, clear and in writing. No fine print and no surprises down the line.": "Âmbito, prazos e valores claros, por escrito. Sem letra pequena e sem surpresas mais à frente.",
    "Talk to MEAN AGENCY. Branding, web and strategy — no detours, we reply within 24 hours.": "Fala com a MEAN AGENCY. Branding, web e estratégia — sem rodeios, respondemos em menos de 24h.",
    "Your name": "O teu nome",
    "email@example.com": "email@exemplo.com",
    "Tell us what you have in mind…": "Conta-nos o que tens em mente…",
    "Studio": "Estúdio",
    "Project — MEAN AGENCY": "Projeto — MEAN AGENCY",
    "Project 01": "Projeto 01",
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
    "Project 08": "Projeto 08",
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
    "Invalid email.": "Email inválido.",
    "Sending…": "A enviar…",
    "Message sent! We'll reply soon.": "Mensagem enviada! Responderei em breve."
  };

  var lang = 'en';
  try { if (localStorage.getItem('mean_lang') === 'pt') lang = 'pt'; } catch (e) {}
  var norm = function (s) { return String(s).replace(/\s+/g, ' ').trim(); };

  window.MEAN_LANG = lang;
  // para textos escritos por JavaScript: t('Sending…')
  window.t = function (en) { return (lang === 'pt' && PT[en]) || en; };

  if (lang === 'pt') {
    document.documentElement.lang = 'pt';
    var check = /[?&]i18ncheck/.test(location.search), missing = [];
    // textos
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var p = node.parentNode;
      if (!p || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.nodeName)) return;
      if (p.closest && p.closest('[data-i18n-skip]')) return;      // o header fica sempre em inglês
      var key = norm(node.nodeValue);
      if (!key) return;
      if (PT[key]) node.nodeValue = node.nodeValue.replace(node.nodeValue.trim(), PT[key]);
      else if (check && /[a-z]{3}/i.test(key)) missing.push(key);
    });
    // atributos
    ['placeholder', 'aria-label', 'alt', 'title', 'data-cursor'].forEach(function (attr) {
      Array.prototype.forEach.call(document.querySelectorAll('[' + attr + ']'), function (el) {
        if (el.closest('[data-i18n-skip]')) return;
        var v = PT[norm(el.getAttribute(attr))];
        if (v) el.setAttribute(attr, v);
      });
    });
    var meta = document.querySelector('meta[name="description"]');
    if (meta && PT[norm(meta.content)]) meta.content = PT[norm(meta.content)];
    if (PT[norm(document.title)]) document.title = PT[norm(document.title)];
    if (check) console.log('[i18n] sem tradução para PT:', missing);
  }

  // botão do header: mostra a outra língua
  Array.prototype.forEach.call(document.querySelectorAll('[data-lang-switch]'), function (btn) {
    var next = lang === 'pt' ? 'en' : 'pt';
    btn.textContent = next.toUpperCase();
    btn.setAttribute('aria-label', next === 'pt' ? 'Mudar para português' : 'Switch to English');
    btn.setAttribute('lang', next);
    btn.addEventListener('click', function () {
      try {
        localStorage.setItem('mean_lang', next);
        sessionStorage.setItem('mean_fast', '1');   // ao recarregar, a Home não repete a abertura
      } catch (e) {}
      location.reload();
    });
  });

  document.documentElement.classList.remove('i18n-wait');
})();
