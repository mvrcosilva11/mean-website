/* ============================================================
   MEAN — camada de movimento (Home / Work / About)
   Atributos no HTML:
     data-reveal            sobe e aparece ao entrar no ecrã
     data-line              fio que se desenha da esquerda para a direita
     data-media             bloco de imagem que abre de baixo para cima
     data-blur              título que entra desfocado e ganha foco
     data-split="rise"      texto que sobe linha a linha
     data-split="scrub"     texto que acende linha a linha com o scroll
     data-stagger="90"      atrasa os filhos em cadeia (ms); data-stagger-mod="3" recomeça a cada 3
     data-open              abertura da Home: a animação da Intro cresce de uma miniatura até ao ecrã inteiro
     data-hero              vídeo da Home, depois da frase (fica preso ao ecrã, encolhe ao centro e sai com a página)
     data-focus-list        lista em que a linha a meio do ecrã ganha foco
     data-slider            carrossel (data-slide, data-prev, data-next, data-count)
     data-cursor="Ver"      texto da pill do cursor
   Sem atributo: a barra de progresso ao fundo do ecrã (todas as páginas); as etiquetas .m-label entram letra a letra; na Home o header abre a meio do ecrã
   e sobe para o topo com o scroll.
   Respeita "reduzir movimento": nesse caso tudo aparece sem animação.
   ============================================================ */
(function () {
  'use strict';
  window.__mean = true;

  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var finePointer = !!(window.matchMedia && window.matchMedia('(pointer: fine)').matches);
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ── 1. Partir texto em palavras (mantém <br> e spans de cor) ── */
  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var wi = document.createElement('span'); wi.className = 'wi';
            wi.style.setProperty('--i', i++);
            wi.textContent = part;
            w.appendChild(wi); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    })(el);
    return $$('.wi', el);
  }
  var scrubs = [];
  var splits = $$('[data-split]');
  splits.forEach(function (el) {
    var words = splitWords(el);
    if (el.getAttribute('data-split') === 'scrub') scrubs.push({ el: el, words: words, n: -1 });
  });
  // Em que linha ficou cada palavra: as palavras da mesma linha entram juntas (e acendem juntas).
  // Refaz-se quando a janela muda de largura.
  function measureLines() {
    splits.forEach(function (el) {
      var top = null, line = -1;
      $$('.w', el).forEach(function (w) {
        var t = w.offsetTop;
        if (top === null || Math.abs(t - top) > 3) { line++; top = t; }
        var wi = w.firstChild;
        wi.style.setProperty('--i', line);
        wi._line = line;
      });
      el._lines = line + 1;
    });
    scrubs.forEach(function (s) { s.n = -1; });
  }
  measureLines();

  /* ── 1b. Etiquetas: as letras aparecem uma a uma, por ordem aleatória ── */
  if (!reduce) $$('.m-label').forEach(function (el) {
    var text = el.textContent;
    var sr = document.createElement('span'); sr.className = 'm-sr'; sr.textContent = text;   // para leitores de ecrã
    var vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true');
    var span = Math.min(720, 260 + text.length * 22);
    text.split('').forEach(function (ch) {
      if (ch === ' ') { vis.appendChild(document.createTextNode(' ')); return; }
      var s = document.createElement('span'); s.className = 'm-ch'; s.textContent = ch;
      s.style.setProperty('--cd', Math.round(Math.random() * span) + 'ms');
      vis.appendChild(s);
    });
    el.textContent = '';
    el.appendChild(sr); el.appendChild(vis);
  });

  /* ── 2. Atrasos em cadeia ── */
  $$('[data-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-stagger'), 10) || 80;
    var mod = parseInt(group.getAttribute('data-stagger-mod'), 10) || 0;
    Array.prototype.slice.call(group.children).forEach(function (child, i) {
      child.style.setProperty('--d', ((mod ? i % mod : i) * step) + 'ms');
    });
  });

  /* ── 3. Revelar ao entrar no ecrã ── */
  var revealSel = '[data-reveal], [data-line], [data-media], [data-blur], [data-split="rise"]';
  var io = null;
  function observeAll() {
    var els = $$(revealSel);
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    // um bloco [data-media] começa totalmente recortado (clip-path), e o browser trata-o como
    // invisível; por isso observa-se o elemento-pai e revela-se o bloco quando o pai entra no ecrã
    var proxies = new WeakMap();
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        (proxies.get(e.target) || [e.target]).forEach(function (t) { t.classList.add('is-in'); });
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    els.forEach(function (el) {
      if (el.hasAttribute('data-media') && el.parentElement) {
        var host = el.parentElement;
        var list = proxies.get(host) || [];
        list.push(el); proxies.set(host, list);
        io.observe(host);
      } else {
        io.observe(el);
      }
    });
  }

  /* ── 4. Efeitos ligados ao scroll ── */
  var hero = document.querySelector('[data-hero]');
  var heroVideo = hero ? hero.querySelector('video') : null;
  var heroMedia = hero ? hero.querySelector('.m-hero-media') : null;   // a moldura do vídeo, presa ao ecrã
  var openFrame = document.querySelector('[data-open] .m-open-frame');  // Home: a animação de abertura (bordô)
  var nav = document.querySelector('.nav');
  var navLinks = document.querySelector('.nav-links');
  var focusLists = $$('[data-focus-list]').map(function (list) {
    return {
      list: list,
      items: Array.prototype.slice.call(list.children),
      counter: document.querySelector(list.getAttribute('data-focus-counter') || '.__none'),
      active: -1
    };
  });
  // Home: o vídeo vem depois da frase. Chega em ecrã inteiro, fica preso ao ecrã, encolhe até uma
  // miniatura ao centro (como em ondastudio.co) e só depois se solta e sai com a página.
  // A .m-hero é a calha (mais alta do que o ecrã); a .m-hero-media é a moldura presa dentro dela.
  //   --hero-min  = tamanho da miniatura;  --hero-hold = fração do percurso em que o vídeo fica inteiro.
  var isHome = !!hero && !!heroMedia && document.body.classList.contains('page-home');
  var heroMin = 0.4, heroHold = 0.15, heroNear = false;
  function readHeroVars() {
    if (!hero) return;
    var cs = getComputedStyle(hero);
    var v = parseFloat(cs.getPropertyValue('--hero-min')), k = parseFloat(cs.getPropertyValue('--hero-hold'));
    if (v > 0 && v < 1) heroMin = v;
    if (k >= 0 && k < 1) heroHold = k;
  }
  readHeroVars();
  function updateHero() {
    if (!isHome) return;
    var vh = window.innerHeight;
    var r = hero.getBoundingClientRect();
    var travel = r.height - (heroMedia.offsetHeight || vh);     // scroll em que o vídeo está preso ao ecrã
    var s = 1;
    if (travel > 4 && !reduce) {
      var hold = travel * heroHold;
      var p = clamp((-r.top - hold) / (travel - hold), 0, 1);
      var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;   // arranca e chega suave
      s = 1 - (1 - heroMin) * e;
    }
    hero.style.setProperty('--hero-s', s.toFixed(4));
    toneGate();                                                 // a cor do header acompanha o que tem por baixo
    if (heroVideo && !reduce && started) {                      // o vídeo só toca perto do ecrã (bateria e dados), e nunca antes de o logo animado sair
      var near = r.top < vh * 1.5 && r.bottom > -vh * 0.25;
      if (near !== heroNear) {
        heroNear = near;
        if (near) { heroVideo.preload = 'auto'; var pr = heroVideo.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else heroVideo.pause();
      }
    }
  }

  function updateScrub() {
    if (reduce || !scrubs.length) return;
    var vh = window.innerHeight;
    scrubs.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      var start = vh * 0.86, end = vh * 0.42;
      var p = clamp((start - r.top) / (r.height + start - end), 0, 1);
      var front = p * ((s.el._lines || 1) + 0.6);          // "frente" de luz que percorre as linhas
      var key = Math.round(front * 24);
      if (key === s.n) return;
      s.n = key;
      for (var i = 0; i < s.words.length; i++) {
        var lit = clamp(front - s.words[i]._line, 0, 1);  // 0 = por acender, 1 = acesa
        s.words[i].style.setProperty('--o', (0.26 + 0.74 * lit).toFixed(2));
      }
    });
  }

  function updateFocus() {
    if (!focusLists.length) return;
    var mid = window.innerHeight * 0.5;
    focusLists.forEach(function (f) {
      var lr = f.list.getBoundingClientRect();
      var live = lr.top < window.innerHeight * 0.8 && lr.bottom > window.innerHeight * 0.2;
      f.list.classList.toggle('is-live', live && !reduce);
      var best = -1, bestDist = Infinity;
      f.items.forEach(function (it, i) {
        var r = it.getBoundingClientRect();
        var d = Math.abs((r.top + r.height / 2) - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (best === f.active) return;
      f.active = best;
      f.items.forEach(function (it, i) { it.classList.toggle('is-active', i === best); });
      if (f.counter) f.counter.textContent = pad(best + 1);
    });
  }

  // Menu do telemóvel: enquanto está aberto, a nav deixa o "negativo" (o painel tem de ser opaco)
  var navToggle = document.querySelector('.nav-toggle');
  if (nav && navToggle) {
    var syncMenu = function () {
      nav.classList.toggle('nav--menu', !!(navLinks && navLinks.classList.contains('open')));
      if (isHome) toneGate();
    };
    navToggle.addEventListener('click', syncMenu);
    if (navLinks) navLinks.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) syncMenu(); });
  }

  /* ── 4b. Home: a cor do header ──
     Sobre a abertura (bordô) fica branco. Sobre o vídeo fica branco ou preto conforme o brilho do vídeo
     por baixo (sem sombras e sem "negativo", que tinge o texto de cores sobre imagem): lê uma miniatura
     do vídeo algumas vezes por segundo. No resto da página, a nav volta ao "negativo" normal do CSS. */
  var navGroups = nav ? [nav.querySelector('.nav-left-group'), nav.querySelector('.nav-right-group')] : [];
  var toneCanvas = null, toneCtx = null, toneOK = true;
  var posterImg = null;                                   // enquanto o vídeo não arranca, lê-se o poster
  if (isHome && heroVideo && heroVideo.getAttribute('poster')) {
    posterImg = new Image(); posterImg.src = heroVideo.getAttribute('poster');
  }
  function overFrame(g, fr) {                              // este grupo do header está todo por cima do vídeo?
    if (!g) return false;
    var r = g.getBoundingClientRect();
    return r.left >= fr.left - 2 && r.right <= fr.right + 2 && r.top >= fr.top - 2 && r.bottom <= fr.bottom + 2;
  }
  function toneGate() {
    if (!nav || !isHome) return null;
    var live = root.classList.contains('is-nav') && !nav.classList.contains('nav--menu');
    var plain = function () { navGroups.forEach(function (g) { if (g) g.classList.remove('is-dark'); }); };
    if (live && openFrame) {                                 // sobre a abertura: branco simples
      var or = openFrame.getBoundingClientRect();
      if (or.bottom > 0 && (overFrame(navGroups[0], or) || overFrame(navGroups[1], or))) {
        nav.classList.add('nav--onvideo'); plain(); return null;
      }
    }
    var fr = toneOK ? heroMedia.getBoundingClientRect() : null;   // onde o vídeo está agora (já com a escala)
    var on = !!fr && live && (overFrame(navGroups[0], fr) || overFrame(navGroups[1], fr));
    nav.classList.toggle('nav--onvideo', on);
    if (!on) { plain(); return null; }
    return fr;
  }
  function sampleTone() {
    var fr = toneGate();
    if (!fr) return;
    if (document.hidden) return;
    var playing = heroVideo.readyState >= 2 && heroVideo.currentTime > 0;
    var src = playing ? heroVideo : (posterImg && posterImg.complete && posterImg.naturalWidth ? posterImg : null);
    if (!src) return;
    try {
      if (!toneCanvas) {
        toneCanvas = document.createElement('canvas'); toneCanvas.width = 64; toneCanvas.height = 36;
        toneCtx = toneCanvas.getContext('2d', { willReadFrequently: true });
      }
      toneCtx.drawImage(src, 0, 0, 64, 36);
      var vw = (playing ? heroVideo.videoWidth : posterImg.naturalWidth) || 16, vh = (playing ? heroVideo.videoHeight : posterImg.naturalHeight) || 9;
      var k = Math.max(fr.width / vw, fr.height / vh);        // object-fit: cover, dentro da moldura
      var offX = (vw * k - fr.width) / 2, offY = (vh * k - fr.height) / 2;
      navGroups.forEach(function (g) {
        if (!g) return;
        if (!overFrame(g, fr)) { g.classList.remove('is-dark'); return; }   // fora do vídeo: fundo escuro, texto branco
        var r = g.getBoundingClientRect();
        var x0 = clamp(Math.floor((r.left - fr.left + offX) / (vw * k) * 64), 0, 63), x1 = clamp(Math.ceil((r.right - fr.left + offX) / (vw * k) * 64), x0 + 1, 64);
        var y0 = clamp(Math.floor((r.top - 4 - fr.top + offY) / (vh * k) * 36), 0, 35), y1 = clamp(Math.ceil((r.bottom + 4 - fr.top + offY) / (vh * k) * 36), y0 + 1, 36);
        var d = toneCtx.getImageData(x0, y0, x1 - x0, y1 - y0).data, sum = 0;
        for (var i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        var lum = sum / (d.length / 4) / 255;
        var dark = g.classList.contains('is-dark');
        if (!dark && lum > 0.56) g.classList.add('is-dark');         // fundo claro → texto preto
        else if (dark && lum < 0.44) g.classList.remove('is-dark');  // fundo escuro → texto branco
      });
    } catch (e) { toneOK = false; toneGate(); }
  }
  if (isHome && nav && heroVideo) setInterval(sampleTone, 160);

  /* ── 4c. O header sai de cena quando o footer chega ao topo (o footer tem o seu próprio menu) ── */
  var foot = document.querySelector('.m-foot');
  // …e o cursor passa ao vermelho dos textos enquanto está por cima do footer (ao mexer o rato e ao fazer scroll)
  var cursorLayer = document.querySelector('.cursor-layer'), cursorY = -1;
  function updateFoot() {
    if (!foot) return;
    var top = foot.getBoundingClientRect().top;
    if (nav) nav.classList.toggle('nav--away', top < nav.offsetHeight + 46);
    if (cursorLayer) cursorLayer.classList.toggle('is-foot', cursorY >= 0 && cursorY >= top);
  }
  if (cursorLayer && foot) window.addEventListener('mousemove', function (e) { cursorY = e.clientY; updateFoot(); }, { passive: true });

  /* ── 4d. Barra de progresso (todas as páginas com scroll) ──
     Presa ao fundo do ecrã, na cor do footer. Chega ao fim exatamente quando o footer começa a
     aparecer por baixo; a partir daí é o footer, da mesma cor, que continua a subir. */
  var progress = document.createElement('div');
  progress.className = 'm-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  function updateProgress(y) {
    var vh = window.innerHeight;
    // onde acaba o conteúdo: o ponto em que o topo do footer toca o fundo do ecrã
    var end = foot ? foot.getBoundingClientRect().top + y - vh : document.documentElement.scrollHeight - vh;
    progress.classList.toggle('is-off', end <= 4);
    progress.style.transform = 'scaleX(' + (end > 4 ? clamp(y / end, 0, 1) : 0).toFixed(4) + ')';
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      updateHero(); updateScrub(); updateFocus(); updateFoot(); updateProgress(y);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    onScroll();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { measureLines(); readHeroVars(); onScroll(); }, 160);
  });
  window.addEventListener('load', function () { measureLines(); onScroll(); });

  /* ── 5. Cursor: cresce sobre ligações, estica para uma pill com texto sobre os projetos ── */
  if (finePointer) {
    var dot = document.querySelector('.cursor-dot');   // a circunferência do cursor (criada no main.js)
    if (dot) {
      var layer = dot.parentNode && dot.parentNode.classList.contains('cursor-layer') ? dot.parentNode : null;
      var label = document.createElement('span');
      label.className = 'cursor-label';
      dot.appendChild(label);
      // sobre um projeto: a circunferência estica para uma pill à medida do texto
      var setView = function (on, text) {
        if (on) {
          if (label.textContent !== text) label.textContent = text;
          var w = Math.max(64, Math.ceil(label.offsetWidth) + 40) + 'px';
          dot.style.setProperty('--pill-w', w);
        }
        dot.classList.toggle('is-view', on);
        if (layer) layer.classList.toggle('is-view', on);
      };
      document.addEventListener('mouseover', function (e) {
        var t = e.target.closest ? e.target.closest('[data-cursor]') : null;
        if (t) {
          setView(true, t.getAttribute('data-cursor'));
          dot.classList.remove('is-link');
          return;
        }
        setView(false);
        dot.classList.toggle('is-link', !!(e.target.closest && e.target.closest('a, button')));
      });
    }
  }

  /* ── 6. Carrossel de testemunhos ── */
  $$('[data-slider]').forEach(function (sl) {
    var slides = $$('[data-slide]', sl);
    if (!slides.length) return;
    var count = sl.querySelector('[data-count]');
    var cur = 0;
    function go(i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle('is-active', k === cur);
        s.setAttribute('aria-hidden', k === cur ? 'false' : 'true');
      });
      if (count) count.textContent = pad(cur + 1) + ' — ' + pad(slides.length);
    }
    var prev = sl.querySelector('[data-prev]'), next = sl.querySelector('[data-next]');
    if (prev) prev.addEventListener('click', function () { go(cur - 1); });
    if (next) next.addEventListener('click', function () { go(cur + 1); });
    sl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(cur - 1);
      if (e.key === 'ArrowRight') go(cur + 1);
    });
    go(0);
  });

  /* ── 6b. Abertura da Home ──
     O ecrã do logo sobe como uma cortina; no ecrã em branco o fundo bordô aparece em miniatura e cresce
     num só movimento até encher o ecrã; só depois se formam as bolas e se constrói o logo (main.js). A coreografia está
     toda no CSS (m-rise, m-grow, m-pre-up), em transformações que o browser anima fora da thread
     principal. Aqui só se marcam dois momentos no <html>: .is-nav (o header pode entrar) e .is-open (acabou).
     Se a página chegar já com .is-open (troca de língua), a abertura não se repete. */
  var OPEN_DELAY = 500, OPEN_GROW = 1500;   // iguais aos tempos de m-grow no CSS (ms)
  var OPEN_NAV = 2850;                      // o header entra com o logo já quase construído
  var opened = function (all) { root.classList.add('is-open'); if (all) root.classList.add('is-nav'); toneGate(); };
  var skipOpening = !openFrame || reduce || root.classList.contains('is-open');
  if (skipOpening) opened(true);

  /* ── 7. Arranque: espera que o logo animado (abertura ou mudança de página) saia ── */
  // O vídeo da Home já não está no topo: só começa a tocar quando a secção dele se aproxima do ecrã
  // (updateHero). Com "reduzir movimento" fica o poster.
  var started = false;
  function start() {
    if (started) return;
    started = true;
    root.classList.add('is-ready');
    observeAll();
    onScroll();
    if (!skipOpening) {
      // acaba quando a moldura termina de crescer
      openFrame.addEventListener('animationend', function (e) { if (e.animationName === 'm-grow') opened(false); });
      // o header é o último a entrar: fundo, bolas, logo e só então o menu (tempos da entrada no main.js)
      setTimeout(function () { root.classList.add('is-nav'); toneGate(); }, OPEN_NAV);
      setTimeout(function () { opened(false); }, OPEN_DELAY + OPEN_GROW + 700);   // segurança
      setTimeout(function () { opened(true); }, OPEN_NAV + 900);                    // segurança
    }
  }
  var pre = document.getElementById('preloader');
  var hadLogo = !!(pre && getComputedStyle(pre).display !== 'none');
  if (!hadLogo) root.classList.add('is-bare');           // sem ecrã do logo: a miniatura aparece sozinha no branco
  if (hadLogo) {
    var mo = new MutationObserver(function () {
      if (!document.body.contains(pre) || pre.classList.contains('done')) { mo.disconnect(); setTimeout(start, 120); }
    });
    mo.observe(pre, { attributes: true, attributeFilter: ['class'] });
    mo.observe(document.body, { childList: true });
    setTimeout(start, 7000);   // segurança
  } else {
    setTimeout(start, reduce ? 0 : 80);
  }
})();
