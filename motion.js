/* ============================================================
   MEAN — camada de movimento (Home / Work / About)
   Atributos no HTML:
     data-reveal            sobe e aparece ao entrar no ecrã
     data-line              fio que se desenha da esquerda para a direita
     data-media             bloco de imagem que abre de baixo para cima
     data-split="rise"      texto que sobe palavra a palavra
     data-split="scrub"     texto que acende palavra a palavra com o scroll
     data-stagger="90"      atrasa os filhos em cadeia (ms); data-stagger-mod="3" recomeça a cada 3
     data-hero              vídeo de abertura (escala e escurece ao descer)
     data-focus-list        lista em que a linha a meio do ecrã ganha foco
     data-slider            carrossel (data-slide, data-prev, data-next, data-count)
     data-cursor="Ver"      etiqueta no cursor
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
  $$('[data-split]').forEach(function (el) {
    var words = splitWords(el);
    if (el.getAttribute('data-split') === 'scrub') scrubs.push({ el: el, words: words, n: -1 });
  });

  /* ── 2. Atrasos em cadeia ── */
  $$('[data-stagger]').forEach(function (group) {
    var step = parseInt(group.getAttribute('data-stagger'), 10) || 80;
    var mod = parseInt(group.getAttribute('data-stagger-mod'), 10) || 0;
    Array.prototype.slice.call(group.children).forEach(function (child, i) {
      child.style.setProperty('--d', ((mod ? i % mod : i) * step) + 'ms');
    });
  });
  $$('.m-symbols .m-sym').forEach(function (s, i) { s.style.setProperty('--i', i); });

  /* ── 3. Revelar ao entrar no ecrã ── */
  var revealSel = '[data-reveal], [data-line], [data-media], [data-split="rise"], .m-symbols';
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
  var lastY = window.scrollY, heroPaused = false;

  function updateHero(y) {
    if (!hero) return;
    var h = hero.offsetHeight || window.innerHeight;
    var p = clamp(y / h, 0, 1);
    if (!reduce) {
      hero.style.setProperty('--hero-s', (1 + p * 0.08).toFixed(4));
      hero.style.setProperty('--hero-dim', (p * 0.72).toFixed(3));
    }
    if (nav) nav.classList.toggle('nav-solid', y > h - 80);
    if (heroVideo && !reduce) {           // não gastar bateria com o vídeo tapado
      if (p >= 1 && !heroPaused) { heroVideo.pause(); heroPaused = true; }
      else if (p < 1 && heroPaused) { var pr = heroVideo.play(); if (pr && pr.catch) pr.catch(function () {}); heroPaused = false; }
    }
  }

  function updateScrub() {
    if (reduce || !scrubs.length) return;
    var vh = window.innerHeight;
    scrubs.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      var start = vh * 0.86, end = vh * 0.42;
      var p = clamp((start - r.top) / (r.height + start - end), 0, 1);
      var n = Math.round(p * s.words.length);
      if (n === s.n) return;
      s.n = n;
      for (var i = 0; i < s.words.length; i++) s.words[i].classList.toggle('on', i < n);
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

  function updateNav(y) {
    if (!nav) return;
    var menuOpen = navLinks && navLinks.classList.contains('open');
    var goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (menuOpen || y < 140) nav.classList.remove('nav--hidden');
    else if (goingDown) nav.classList.add('nav--hidden');
    else if (goingUp) nav.classList.remove('nav--hidden');
    if (goingDown || goingUp) lastY = y;
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      updateHero(y); updateScrub(); updateFocus(); updateNav(y);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ── 5. Cursor: cresce sobre ligações, etiqueta sobre projetos ── */
  if (finePointer) {
    var dot = document.querySelector('.cursor-dot');   // a bolinha principal (as do rasto vêm depois)
    if (dot) {
      var layer = dot.parentNode && dot.parentNode.classList.contains('cursor-layer') ? dot.parentNode : null;
      var label = document.createElement('span');
      label.className = 'cursor-label';
      dot.appendChild(label);
      var setView = function (on) {
        dot.classList.toggle('is-view', on);
        if (layer) layer.classList.toggle('is-view', on);   // o círculo vermelho não faz "negativo"
      };
      document.addEventListener('mouseover', function (e) {
        var t = e.target.closest ? e.target.closest('[data-cursor]') : null;
        if (t) {
          label.textContent = t.getAttribute('data-cursor');
          setView(true); dot.classList.remove('is-link');
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

  /* ── 7. Arranque: espera que o logo animado (abertura ou mudança de página) saia ── */
  if (reduce && heroVideo) { heroVideo.removeAttribute('autoplay'); heroVideo.pause(); }
  var started = false;
  function start() {
    if (started) return;
    started = true;
    root.classList.add('is-ready');
    if (heroVideo && !reduce && heroVideo.paused) { var pp = heroVideo.play(); if (pp && pp.catch) pp.catch(function () {}); }
    observeAll();
    onScroll();
  }
  var pre = document.getElementById('preloader');
  if (pre && getComputedStyle(pre).display !== 'none') {
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
