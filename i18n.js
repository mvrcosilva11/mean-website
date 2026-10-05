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
    "Name": "Nome",
    "Estimated budget": "Orçamento estimado",
    "Under €3,000": "Menos de 3.000€",
    "€3,000 – €8,000": "3.000€ – 8.000€",
    "€8,000 – €20,000": "8.000€ – 20.000€",
    "Over €20,000": "Mais de 20.000€",
    "Message": "Mensagem",
    "Send message": "Enviar mensagem",
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
    "Message sent! We'll reply soon.": "Mensagem enviada! Respondemos em breve.",
    "Close": "Fechar",
    "Contact": "Contacto"
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
    return pt ? en.replace(en.trim(), function () { return pt; }) : en;
  }
  function sayAttr(en) { return (lang === 'pt' && PT[norm(en)]) || en; }
  // o HTML de um bloco na língua atual
  function blockHTML(en) {
    if (lang !== 'pt') return en;
    var box = document.createElement('div');
    box.innerHTML = en;
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
    var w = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var p = n.parentNode;
      if (!p || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.nodeName) || skipped(p)) continue;
      if (p.closest && p.closest(BLOCKS)) continue;
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
