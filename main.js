// Textos escritos por JavaScript passam por aqui: em PT vêm do i18n.js, em EN ficam como estão.
const meanT = s => (window.t ? window.t(s) : s);   // (nome próprio: o Lenis usa "T" no âmbito global)

// Live clock in the header (HH:MM:SS)
const clock = document.getElementById('clock');
if (clock) {
  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    const d = new Date();
    clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  tick();
  setInterval(tick, 1000);
}

// Project page: render from ?p=<folder> using window.PROJETOS + window.IMAGENS
const projeto = document.getElementById('projeto');
if (projeto && window.PROJETOS) {
  const folder = new URLSearchParams(location.search).get('p');
  const p = window.PROJETOS.find(x => x.folder === folder);
  if (p) {
    document.title = p.nome + ' — MEAN AGENCY';
    projeto.querySelector('.projeto-name').textContent = p.nome;
    projeto.querySelector('.projeto-cat').textContent = p.categoria;
    const txtEl = projeto.querySelector('.projeto-text');
    if (p.texto) txtEl.textContent = p.texto; else txtEl.remove();
    const wrap = projeto.querySelector('.projeto-imgs');
    const imgs = (window.IMAGENS && window.IMAGENS[folder]) || [];
    imgs.forEach(fn => {
      const im = document.createElement('img');
      im.src = 'Projetos/' + folder + '/' + fn;
      im.alt = p.nome; im.loading = 'lazy';
      wrap.appendChild(im);
    });
  } else {
    projeto.querySelector('.projeto-name').textContent = meanT('Project not found');
  }
  // Horizontal scroll + progress bar
  const scroller = document.getElementById('projeto-scroll');
  const bar = document.getElementById('projeto-bar');
  const pctEl = document.getElementById('projeto-pct');
  if (scroller) {
    scroller.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scroller.scrollLeft += e.deltaY;
      }
    }, { passive: false });
    const updateBar = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      const pct = max > 0 ? (scroller.scrollLeft / max) * 100 : 0;
      if (bar) bar.style.width = pct + '%';
      if (pctEl) pctEl.textContent = Math.round(pct) + '%';
    };
    scroller.addEventListener('scroll', updateBar, { passive: true });
    window.addEventListener('resize', updateBar);
    window.addEventListener('load', updateBar);
    updateBar();
  }
}

// Logo animado em ecrã inteiro: na 1.ª abertura do site e a cada mudança de página.
// Num recarregamento, o script inline de cada página já retirou o #preloader e isto não corre.
(function () {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  try { sessionStorage.setItem('mean_intro_seen', '1'); } catch (e) {}
  if (new URLSearchParams(location.search).has('introhold')) return; // dev: mantém o loading visível p/ inspeção
  const dur = parseInt(pre.dataset.duration, 10) || 1440;
  const anim = pre.dataset.anim || 'assets/intro-logo.webp?v=42';
  const still = pre.dataset.still || 'assets/intro-logo.png?v=42';
  // Se o logo não chegar a tempo (ligação lenta), a página abre sem ele: 2,5 s contados desde o
  // início do carregamento, com um mínimo de 0,7 s a partir daqui.
  const WAIT = Math.max(700, 2500 - (window.performance ? performance.now() : 0));
  let done = false, started = false, timer = 0, blobUrl = '';
  const hide = () => {
    if (done) return; done = true;
    pre.classList.add('done');
    // tempo que a saída demora: 700 ms por defeito; a Home pede mais (o ecrã do logo encolhe para um cartão)
    setTimeout(() => { pre.remove(); if (blobUrl) URL.revokeObjectURL(blobUrl); }, parseInt(pre.dataset.exit, 10) || 700);
  };
  const img = new Image();
  img.className = 'preloader-anim'; img.id = 'introAnim'; img.alt = 'MEAN';
  img.style.visibility = 'hidden';   // sem isto, enquanto a imagem não chega, o Safari desenha uma moldura com o texto "MEAN"
  // esconde quando a animação acaba (o tempo conta a partir do momento em que a imagem está pronta)
  img.onload = () => { img.style.visibility = ''; started = true; clearTimeout(timer); timer = setTimeout(hide, dur + 150); };
  // sem suporte para WebP animado: logo parado
  img.onerror = () => { img.onerror = () => setTimeout(hide, 300); img.src = still; };
  pre.appendChild(img);
  // O ficheiro entra como blob: assim a animação recomeça sempre do início.
  // (um WebP que só toca uma vez pode ficar parado no último frame quando o browser reutiliza a imagem)
  // O script inline da página já começou a descarregá-lo (window.__meanIntro).
  const canBlob = window.fetch && window.URL && URL.createObjectURL;
  const blob = window.__meanIntro || (canBlob
    ? fetch(anim).then(r => { if (!r.ok) throw new Error('intro'); return r.blob(); })
    : null);
  if (blob && canBlob) {
    blob.then(b => { if (done) return; blobUrl = URL.createObjectURL(b); img.src = blobUrl; })
        .catch(() => { if (!done) img.src = anim; });
  } else {
    img.src = anim;
  }
  setTimeout(() => { if (!started) hide(); }, WAIT);   // não prende ninguém à espera de uma animação
  setTimeout(hide, WAIT + dur + 1500);                 // segurança
})();

// Cursor personalizado: circunferência com um ponto no centro, em modo "negativo" (sem rasto).
// (a forma está no CSS: .cursor-dot é a circunferência, ::before o ponto;
//  sobre os projetos a circunferência estica para uma pill só com contorno e texto, sem fundo, ver motion.js)
// A mistura "difference" está no grupo .cursor-layer (ver CSS): branco sobre preto, negativo sobre imagens.
(function () {
  // ignora em dispositivos touch (não há cursor)
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'cursor-layer';
  layer.setAttribute('aria-hidden', 'true');
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.style.opacity = 0;
  layer.appendChild(dot);
  document.body.appendChild(layer);

  let visible = false, placed = false;
  const show = v => { visible = v; dot.style.opacity = v ? 1 : 0; };
  const place = (x, y) => {
    placed = true;
    dot.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
  };

  // ao mudar de página o rato não se mexeu: retoma a posição do último clique
  try {
    const saved = sessionStorage.getItem('mean_cursor');
    sessionStorage.removeItem('mean_cursor');
    if (saved) {
      const xy = saved.split(',').map(Number);
      if (xy.length === 2 && isFinite(xy[0]) && isFinite(xy[1])) { place(xy[0], xy[1]); show(true); }
    }
  } catch (e) {}

  window.addEventListener('mousemove', e => {
    place(e.clientX, e.clientY);
    if (!visible) show(true);
  }, { passive: true });
  document.addEventListener('mouseleave', () => show(false));
  document.addEventListener('mouseenter', () => { if (placed) show(true); });
})();

// Nav: scrolled class + hamburger
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  links.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close menu when a link is clicked
links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Scroll reveal
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll('.card, .contact-info, .contact-form, .section-title, .section-sub').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 60}ms`;
  observer.observe(el);
});

// About page: reveal elements already marked with .reveal in the HTML (com stagger por grupo)
['.ab-team-grid', '.ab-manifesto .ab-list', '.ab-services .ab-list', '.ab-values-grid', '.ab-life-grid'].forEach(sel => {
  const group = document.querySelector(sel);
  if (group) group.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i * 65) + 'ms'; });
});
document.querySelectorAll('.ab .reveal, .page-work .reveal').forEach(el => observer.observe(el));

// Parallax — elementos com data-parallax movem-se ao scroll
(function () {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    els.forEach(el => {
      const s = parseFloat(el.dataset.parallax) || 0.1;
      el.style.transform = 'translate3d(0,' + (y * s) + 'px,0)';
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
})();

// Work: header muda para escuro quando a cortina branca cobre o vídeo
(function () {
  if (!document.body.classList.contains('page-work')) return;
  const nav = document.querySelector('.nav');
  const hero = document.querySelector('.work-hero');
  if (!nav || !hero) return;
  const onScroll = () => {
    nav.classList.toggle('nav-on-light', window.scrollY > hero.offsetHeight * 0.72);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Transição de página: uma cortina (na cor do loading) cobre a página ao sair;
// a página seguinte abre com o logo animado (#preloader) e só depois se revela.
(function () {
  const calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const trans = document.createElement('div');
  trans.className = 'page-trans';
  trans.setAttribute('aria-hidden', 'true');
  document.body.appendChild(trans);
  const EASE = 'transform .55s cubic-bezier(.76,0,.24,1)';
  let leaving = false;
  // ao clicar num link interno: cobre e depois navega
  document.addEventListener('click', e => {
    if (e.defaultPrevented || leaving || calm) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;   // abrir noutro separador, etc.
    const a = e.target.closest ? e.target.closest('a') : null;
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    let url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (!/^(https?|file):$/.test(url.protocol) || url.origin !== location.origin) return;   // externos, mailto:, tel:
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return; // âncora na própria página
    e.preventDefault();
    leaving = true;
    try {
      sessionStorage.setItem('mean_nav', '1');                                        // a página seguinte mostra o logo
      if (e.detail) sessionStorage.setItem('mean_cursor', e.clientX + ',' + e.clientY); // e o cursor fica onde estava
    } catch (err) {}
    trans.style.transition = EASE;
    trans.style.transformOrigin = 'left center';
    trans.style.transform = 'scaleX(1)';
    setTimeout(() => { window.location.href = url.href; }, 520);
  });
  // "voltar atrás" pode trazer a página tal como ficou (cortina fechada): abre-a outra vez
  window.addEventListener('pageshow', e => {
    if (!e.persisted) return;
    leaving = false;
    trans.style.transition = 'none';
    trans.style.transform = 'scaleX(0)';
    try { sessionStorage.removeItem('mean_nav'); } catch (err) {}
  });
})();

// About: sticky title swaps to match the manifesto item scrolled into the middle of the screen
(function () {
  const active = document.getElementById('manifestoActive');
  const items = document.querySelectorAll('.ab-manifesto .ab-item');
  if (!active || !items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const title = entry.target.querySelector('.ab-item-title');
      if (!title) return;
      active.textContent = title.textContent;
      active.classList.add('visible');
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  items.forEach(el => io.observe(el));
})();

// Projects: category filter pills
(function () {
  const filters = document.getElementById('wl-filters');
  const list = document.getElementById('wl-list');
  if (!filters || !list) return;
  filters.addEventListener('click', e => {
    const btn = e.target.closest('.wl-filter');
    if (!btn) return;
    filters.querySelectorAll('.wl-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    list.querySelectorAll('li[data-categoria]').forEach(li => {
      li.style.display = (!cat || li.dataset.categoria === cat) ? '' : 'none';
    });
  });
})();

// Work grid reveal — left column slides in from the left, right column from the right
document.querySelectorAll('.w-item').forEach((el, i) => {
  el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
  observer.observe(el);
});

// ── "Talk with us": painel de contacto que entra da direita para a esquerda ──
// Substitui a página de contacto. É criado aqui para ser igual em todas as páginas. Abre em qualquer
// ligação com data-talk (header, footer, fechos de página) e quando o endereço acaba em #talk.
(function () {
  const root = document.documentElement;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const tx = s => esc(meanT(s));
  const budgets = ['Under €3,000', '€3,000 – €8,000', '€8,000 – €20,000', 'Over €20,000'];

  const veil = document.createElement('div');
  veil.className = 'm-talk-veil'; veil.setAttribute('data-talk-close', '');
  const panel = document.createElement('aside');
  panel.className = 'm-talk'; panel.id = 'talk'; panel.tabIndex = -1; panel.inert = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'talkTitle'); panel.setAttribute('aria-hidden', 'true');
  panel.setAttribute('data-lenis-prevent', '');   // dentro do painel o scroll é o do browser
  panel.innerHTML =
    '<div class="m-talk-in">' +
      '<div class="m-talk-top m-talk-rise" style="--i:0">' +
        '<span>' + tx('Talk with us') + '</span>' +
        '<button type="button" class="m-talk-close" data-talk-close>' + tx('Close') + '</button>' +
      '</div>' +
      '<h2 class="m-talk-title m-talk-rise" id="talkTitle" style="--i:1">' + tx("Let's talk about your project.") + '</h2>' +
      '<form class="m-talk-form" novalidate>' +
        '<label class="m-talk-field m-talk-rise" style="--i:2"><span>' + tx('Name') + '</span>' +
          '<input type="text" name="name" autocomplete="name" required /></label>' +
        '<label class="m-talk-field m-talk-rise" style="--i:3"><span>' + tx('Email') + '</span>' +
          '<input type="email" name="email" autocomplete="email" inputmode="email" required /></label>' +
        '<fieldset class="m-talk-budget m-talk-rise" style="--i:4"><legend>' + tx('Estimated budget') + '</legend>' +
          '<div class="m-talk-opts">' + budgets.map(b =>
            '<label class="m-talk-opt"><input type="radio" name="budget" value="' + esc(b) + '" /><span>' + tx(b) + '</span></label>').join('') +
          '</div></fieldset>' +
        '<label class="m-talk-field m-talk-rise" style="--i:5"><span>' + tx('Message') + '</span>' +
          '<textarea name="message" rows="3" required></textarea></label>' +
        '<div class="m-talk-send m-talk-rise" style="--i:6">' +
          '<button type="submit" class="m-talk-submit"><span class="m-talk-submit-t">' + tx('Send message') + '</span> <span class="m-arrow" aria-hidden="true">→</span></button>' +
          '<p class="form-feedback" role="status"></p>' +
        '</div>' +
      '</form>' +
      '<div class="m-talk-bottom m-talk-rise" style="--i:7">' +
        '<div class="m-talk-block"><h3>' + tx('Contact') + '</h3><p><a href="mailto:mean.geral@gmail.com">mean.geral@gmail.com</a><span>' + tx('We reply within 24h') + '</span></p></div>' +
        '<div class="m-talk-block"><h3>' + tx('Studio') + '</h3><p><span>Porto, Portugal</span></p></div>' +
        '<a class="m-talk-ext" href="https://instagram.com/mean_agency" target="_blank" rel="noopener">@mean_agency</a>' +
        '<a class="m-talk-ext" href="https://www.linkedin.com/company/mean-agency" target="_blank" rel="noopener">LinkedIn</a>' +
      '</div>' +
    '</div>';
  document.body.appendChild(veil);
  document.body.appendChild(panel);
  document.querySelectorAll('[data-talk]').forEach(a => { a.setAttribute('aria-haspopup', 'dialog'); a.setAttribute('aria-controls', 'talk'); });

  let isOpen = false, opener = null, frozen = [];
  const cursor = () => document.querySelector('.cursor-layer');
  function open(from) {
    if (isOpen) return;
    isOpen = true; opener = from || null;
    const menu = document.querySelector('.nav-links.open'), toggle = document.querySelector('.nav-toggle');
    if (menu && toggle) toggle.click();            // no telemóvel, fecha primeiro o menu
    // o resto da página fica parado e fora do alcance do teclado enquanto o painel está aberto
    frozen = [];
    Array.prototype.forEach.call(document.body.children, el => {
      if (el === panel || el === veil || el.tagName === 'SCRIPT' || el.id === 'preloader' ||
          el.classList.contains('cursor-layer') || el.classList.contains('page-trans')) return;
      if (!el.inert) { el.inert = true; frozen.push(el); }
    });
    panel.inert = false; panel.setAttribute('aria-hidden', 'false');
    panel.scrollTop = 0;
    root.classList.add('talk-open');
    if (window.__lenis) window.__lenis.stop();
    try { panel.focus({ preventScroll: true }); } catch (e) { panel.focus(); }
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove('talk-open');
    panel.inert = true; panel.setAttribute('aria-hidden', 'true');
    frozen.forEach(el => { el.inert = false; }); frozen = [];
    if (window.__lenis) window.__lenis.start();
    const c = cursor(); if (c) c.classList.remove('is-talk');
    if (location.hash === '#talk' && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) {} }
    opener = null;
  }
  document.addEventListener('click', e => {
    const el = e.target && e.target.closest ? e.target : null;
    if (!el) return;
    const t = el.closest('[data-talk]');
    if (t) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault(); open(t);
      return;
    }
    if (el.closest('[data-talk-close]')) { e.preventDefault(); close(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) { e.preventDefault(); close(); } });
  // sobre o painel o cursor fica no vermelho dos textos, como no footer
  panel.addEventListener('pointerenter', () => { const c = cursor(); if (c) c.classList.add('is-talk'); });
  panel.addEventListener('pointerleave', () => { const c = cursor(); if (c) c.classList.remove('is-talk'); });
  // …#talk no endereço abre o painel (depois de o ecrã do logo sair)
  window.addEventListener('hashchange', () => { if (location.hash === '#talk') open(null); });
  if (location.hash === '#talk') {
    const pre = document.getElementById('preloader');
    if (!pre) setTimeout(() => open(null), 400);
    else {
      const mo = new MutationObserver(() => { if (!document.body.contains(pre)) { mo.disconnect(); setTimeout(() => open(null), 400); } });
      mo.observe(document.body, { childList: true });
      setTimeout(() => { mo.disconnect(); open(null); }, 6000);
    }
  }

  // Formulário
  const form = panel.querySelector('form'), feedback = panel.querySelector('.form-feedback');
  const btn = panel.querySelector('.m-talk-submit'), btnText = panel.querySelector('.m-talk-submit-t');
  let clearTimer = 0;
  const say = (kind, text) => { feedback.className = 'form-feedback' + (kind ? ' ' + kind : ''); feedback.textContent = text; };
  // orçamento: clicar outra vez na opção escolhida volta a deixá-la em branco (o campo é opcional)
  form.addEventListener('click', e => {
    const r = e.target;
    if (!r || r.type !== 'radio') return;
    const was = r.getAttribute('data-on') === '1';
    form.querySelectorAll('input[type="radio"]').forEach(o => o.removeAttribute('data-on'));
    if (was) r.checked = false; else r.setAttribute('data-on', '1');
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(clearTimer); say('', '');
    const f = form.elements, name = f.name.value.trim(), email = f.email.value.trim(), message = f.message.value.trim();
    if (!name || !email || !message) {
      say('error', meanT('Please fill in all fields.'));
      (!name ? f.name : !email ? f.email : f.message).focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      say('error', meanT('Invalid email.'));
      f.email.focus();
      return;
    }
    // ATENÇÃO: ainda não envia nada. Simula o envio, como a página antiga; falta ligar a um serviço de
    // formulários ou a um endpoint próprio.
    btn.disabled = true; btnText.textContent = meanT('Sending…');
    setTimeout(() => {
      form.reset();
      form.querySelectorAll('input[type="radio"]').forEach(o => o.removeAttribute('data-on'));
      btn.disabled = false; btnText.textContent = meanT('Send message');
      say('success', meanT("Message sent! We'll reply soon."));
      clearTimer = setTimeout(() => say('', ''), 5000);
    }, 1200);
  });
})();

// ── Abertura da Home: o logo sobre uma grelha de bolas que crescem junto ao cursor ──
// As bolas e o logo são desenhados juntos num <canvas> (WebGL), como se fossem a mesma matéria: uma bola
// que toca no logo funde-se com ele, e a parte do logo que fica dentro de uma bola aparece em negativo
// (bordô sobre vermelho). A entrada é progressiva: primeiro só o fundo, depois as bolas formam-se do
// centro para fora, e por fim o logo constrói-se da esquerda para a direita. Ao fazer scroll, as bolas
// têm inércia: ficam um pouco para trás e voltam ao sítio com um pequeno balanço.
// Sem WebGL, ou com "reduzir movimento", fica a versão simples: bolas em HTML por trás do logo.
(function () {
  const hero = document.querySelector('.hi-hero');
  if (!hero) return;
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-in')));

  const wrap = hero.querySelector('.hi-dots');
  if (!wrap) return;

  const SPACING = 80;   // distância entre bolas
  const RADIUS  = 300;  // raio de influência do cursor — as bolas ao lado também crescem
  const BASE_R  = 5;    // raio de uma bola em repouso (10 px de diâmetro)
  const MAX_R   = 75;   // raio junto ao cursor (150 px de diâmetro)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // grelha por células: bola no centro de cada célula → meia-célula de margem em todos os lados,
  // simétrico e sem bolas cortadas nas bordas seja qual for a largura do ecrã
  function grid() {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    const cols = Math.max(1, Math.round(w / SPACING)), rows = Math.max(1, Math.round(h / SPACING));
    return { w: w, h: h, cols: cols, rows: rows, cellW: w / cols, cellH: h / rows };
  }
  // quanto uma bola cresce: 1 debaixo do cursor, 0 a partir de RADIUS, com queda suave
  function pull(dx, dy) {
    const p = 1 - Math.sqrt(dx * dx + dy * dy) / RADIUS;
    return p > 0 ? p * p : 0;
  }

  /* ── Versão simples: uma <span> por bola, por trás do logo ── */
  function startDom() {
    const MIN_S = BASE_R / MAX_R;   // a bola é desenhada no tamanho máximo e reduzida (mantém-se nítida)
    let dots = [], pos = [];
    function build() {
      const g = grid();
      const frag = document.createDocumentFragment();
      dots = []; pos = [];
      for (let r = 0; r < g.rows; r++) for (let c = 0; c < g.cols; c++) {
        const x = (c + 0.5) * g.cellW, y = (r + 0.5) * g.cellH;
        const d = document.createElement('span');
        d.className = 'hi-dot';
        d.style.left = x + 'px'; d.style.top = y + 'px';
        d.style.setProperty('--s', MIN_S.toFixed(4));
        frag.appendChild(d); dots.push(d); pos.push([x, y]);
      }
      wrap.replaceChildren(frag);
    }
    function update(mx, my) {
      for (let i = 0; i < dots.length; i++) {
        dots[i].style.setProperty('--s', (MIN_S + pull(pos[i][0] - mx, pos[i][1] - my) * (1 - MIN_S)).toFixed(3));
      }
    }
    build();
    let rt;
    if ('ResizeObserver' in window) {
      new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(build, 120); }).observe(wrap);
    } else {
      addEventListener('load', build);
      addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
    }
    if (reduce) return;
    let raf = null, mx = 0, my = 0;
    // listener na janela (não só na hero) para o efeito continuar mesmo com o cursor sobre o header
    window.addEventListener('pointermove', e => {
      const r = wrap.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(() => { update(mx, my); raf = null; });
    });
    document.addEventListener('pointerleave', () => update(-9999, -9999));
  }

  /* ── Versão WebGL: bolas e logo no mesmo campo ── */
  const VERT = 'attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }';
  const FRAG = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 uRes;',        // tamanho do canvas, em px de ecrã
    'uniform float uDpr;',       // px de ecrã por px de CSS
    'uniform vec4 uGrid;',       // grelha: origem (x, y) e célula (largura, altura), px de CSS
    'uniform vec2 uCells;',      // colunas, linhas
    'uniform sampler2D uRad;',   // por bola: raio (R, G) e desvio vertical (B, A), 16 bits cada
    'uniform vec3 uRadRange;',   // raio mínimo, amplitude do raio, desvio máximo
    'uniform sampler2D uLogo;',  // distância ao contorno do logo: R = fina, G = larga
    'uniform vec4 uLogoRect;',   // onde está a textura do logo, px de CSS
    'uniform vec3 uBuild;',      // construção do logo: posição da frente (x), largura da frente, quanto os traços ainda têm de engrossar
    'uniform vec3 uSdf;',        // alcance fino, alcance largo (em texels), px de CSS por texel
    'uniform float uK;',         // raio da fusão entre formas
    'uniform float uEdge;',      // largura da orla em que o logo se funde com a bola
    'uniform vec3 uColor;',
    // união suave: onde duas formas se aproximam, nasce uma ponte entre elas
    'float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }',
    'void main() {',
    '  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;',
    '  vec2 c = floor((p - uGrid.xy) / uGrid.zw);',
    '  float dB = 1.0e4;',       // distância à bola mais próxima (só as células à volta contam)
    '  for (int j = -2; j <= 2; j++) {',
    '    for (int i = -1; i <= 1; i++) {',
    '      vec2 cc = c + vec2(float(i), float(j));',
    '      if (cc.x < 0.0 || cc.y < 0.0 || cc.x >= uCells.x || cc.y >= uCells.y) continue;',
    '      vec4 t = texture2D(uRad, (cc + 0.5) / uCells);',
    '      float r = uRadRange.x + (t.r * 65280.0 + t.g * 255.0) / 65535.0 * uRadRange.y;',
    '      float oy = ((t.b * 65280.0 + t.a * 255.0) / 65535.0 * 2.0 - 1.0) * uRadRange.z;',
    '      dB = smin(dB, length(p - (uGrid.xy + (cc + 0.5) * uGrid.zw + vec2(0.0, oy))) - r, uK);',
    '    }',
    '  }',
    '  float dL = 1.0e4;',       // distância ao logo
    '  vec2 uv = (p - uLogoRect.xy) / uLogoRect.zw;',
    '  if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {',
    '    vec4 s = texture2D(uLogo, uv);',
    '    float wide = (s.g * 2.0 - 1.0) * uSdf.y;',
    '    float fine = (s.r * 2.0 - 1.0) * uSdf.x;',
    '    float q = clamp((uBuild.x - p.x) / uBuild.y, 0.0, 1.0);',   // 0 = por construir, 1 = feito
    '    q = q * q * (3.0 - 2.0 * q);',
    '    dL = ((abs(wide) < uSdf.x * 0.75 ? fine : wide) + (1.0 - q) * uBuild.z) * uSdf.z;',   // os traços nascem finos e engrossam
    '    if (uBuild.z > 0.0) dL += (1.0 - smoothstep(0.0, 0.35, q)) * 48.0;',   // o que ainda não foi construído não puxa as bolas
    '  }',
    '  float aU = clamp(0.5 - smin(dB, dL, uK) * uDpr, 0.0, 1.0);',   // bolas e logo fundidos
    '  float aL = clamp(0.5 - dL * uDpr, 0.0, 1.0);',
    // na orla de uma bola o logo funde-se com ela (vermelho sobre vermelho); mais para dentro reaparece em negativo
    '  float a = aU - aL * smoothstep(0.0, uEdge, -dB);',
    '  gl_FragColor = vec4(uColor * a, a);',
    '}'
  ].join('\n');

  // Distância de cada ponto ao contorno do logo (positiva fora, negativa dentro), a partir da imagem.
  // Transformada de distância euclidiana em duas passagens (Felzenszwalb e Huttenlocher); a transparência
  // das bordas dá a posição do contorno com precisão abaixo do píxel.
  function logoField(img) {
    const PAD = 72, FINE = 4, WIDE = 64, INF = 1e20;
    const iw = img.naturalWidth, ih = img.naturalHeight, W = iw + PAD * 2, H = ih + PAD * 2, n = W * H;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const cx = cv.getContext('2d', { willReadFrequently: true });
    cx.drawImage(img, PAD, PAD);
    const src = cx.getImageData(0, 0, W, H).data;
    const outer = new Float64Array(n), inner = new Float64Array(n);
    let ink = 0;
    for (let i = 0; i < n; i++) {
      const al = src[i * 4 + 3] / 255;
      if (al > 0.5) ink++;
      if (al >= 1) { outer[i] = 0; inner[i] = INF; }
      else if (al <= 0) { outer[i] = INF; inner[i] = 0; }
      else { const d = 0.5 - al; outer[i] = d > 0 ? d * d : 0; inner[i] = d < 0 ? d * d : 0; }
    }
    if (!ink) return null;   // a imagem ainda não estava descodificada: saiu em branco (acontece no Safari)
    const m = Math.max(W, H), f = new Float64Array(m), z = new Float64Array(m + 1), v = new Uint16Array(m);
    const pass = (g, off, stride, len) => {
      v[0] = 0; z[0] = -INF; z[1] = INF; f[0] = g[off];
      for (let q = 1, k = 0, s = 0; q < len; q++) {
        f[q] = g[off + q * stride];
        const q2 = q * q;
        do { const r = v[k]; s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2; } while (s <= z[k] && --k > -1);
        k++; v[k] = q; z[k] = s; z[k + 1] = INF;
      }
      for (let q = 0, k = 0; q < len; q++) {
        while (z[k + 1] < q) k++;
        const r = v[k], qr = q - r;
        g[off + q * stride] = f[r] + qr * qr;
      }
    };
    [outer, inner].forEach(g => {
      for (let x = 0; x < W; x++) pass(g, x, W, H);
      for (let y = 0; y < H; y++) pass(g, y * W, 1, W);
    });
    const sd = new Float32Array(n), tex = new Uint8Array(n * 4);
    const enc = t => Math.max(0, Math.min(255, Math.round((t * 0.5 + 0.5) * 255)));
    for (let i = 0; i < n; i++) {
      const d = Math.sqrt(outer[i]) - Math.sqrt(inner[i]);
      sd[i] = d; tex[i * 4] = enc(d / FINE); tex[i * 4 + 1] = enc(d / WIDE); tex[i * 4 + 3] = 255;
    }
    return { W: W, H: H, PAD: PAD, FINE: FINE, WIDE: WIDE, iw: iw, ih: ih, sd: sd, tex: tex };
  }

  function startGl() {
    const img = hero.querySelector('.hi-logo'), mask = hero.querySelector('.hi-logo-mask');
    if (!img || !mask) return false;
    const canvas = document.createElement('canvas');
    canvas.className = 'hi-canvas'; canvas.setAttribute('aria-hidden', 'true');
    let gl = null;
    try { gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true }); } catch (e) {}
    if (!gl) return false;
    const shader = (type, code) => {
      const s = gl.createShader(type); gl.shaderSource(s, code); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = shader(gl.VERTEX_SHADER, VERT), fs = shader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);   // um triângulo cobre o ecrã
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {};
    ['uRes', 'uDpr', 'uGrid', 'uCells', 'uRad', 'uRadRange', 'uLogo', 'uLogoRect', 'uBuild', 'uSdf', 'uK', 'uEdge', 'uColor'].forEach(n => { U[n] = gl.getUniformLocation(prog, n); });
    const texture = unit => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    texture(0);   // raios das bolas: um texel por bola, lido sem interpolar
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    texture(1);   // campo de distância do logo
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(U.uRad, 0); gl.uniform1i(U.uLogo, 1);
    const hex = (getComputedStyle(hero).getPropertyValue('--accent') || '').trim().replace('#', '');
    const rgb = /^[0-9a-f]{6}$/i.test(hex) ? [0, 2, 4].map(i => parseInt(hex.substr(i, 2), 16) / 255) : [230 / 255, 40 / 255, 52 / 255];
    gl.uniform3f(U.uColor, rgb[0], rgb[1], rgb[2]);
    gl.disable(gl.BLEND); gl.clearColor(0, 0, 0, 0);
    hero.insertBefore(canvas, wrap.nextSibling);

    const K = 14;                    // raio da fusão, px de CSS
    const EDGE = 6;                  // orla das bolas onde o logo ainda não está em negativo, px de CSS
    const R_MIN = -K, R_SPAN = MAX_R + K + 2;
    // Entrada progressiva (ms depois de a abertura começar): as bolas formam-se, depois o logo constrói-se.
    // Na Home a abertura começa quando o ecrã do logo sai (.is-ready no <html>) e a moldura ainda está a crescer.
    const root = document.documentElement, onHome = !!hero.closest('.m-open');
    const BALLS_AT = onHome ? 1600 : 150;   // as bolas começam a formar-se (a moldura já enche quase o ecrã)
    const WAVE = 500, BALL_DUR = 700;       // do centro até aos cantos; tempo que cada bola leva a formar-se
    const LOGO_AT = onHome ? 2150 : 700;    // o logo começa a construir-se
    const LOGO_DUR = 1200, GROW = 11;       // duração; quanto os traços engrossam (em texels: mais do que meio traço)
    let t0 = null, introDone = root.classList.contains('is-open');   // página já aberta (troca de língua): sem entrada
    let dead = false, shown = false, field = null;
    let G = null, px = [], py = [], rest = new Float32Array(0), shy = rest, target = rest, rad = rest, bytes = new Uint8Array(0);
    let wave = rest, appear = rest, stay = rest;   // por bola: atraso na onda, quanto já se formou, quanto ainda fica junto ao logo
    // Inércia ao scroll: cada bola tem o seu peso; fica para trás quando a página anda e volta com uma mola
    const SHIFT = 46, STIFF = 60, DAMP = 8.5;     // desvio máximo (px); rigidez e amortecimento da mola
    let off = rest, vel = rest, mass = rest, lastY = window.scrollY;
    let logoRest = null, front = 1e6, band = 1, k = K;
    let mx = -1e4, my = -1e4, raf = 0, last = 0, settleUntil = 0;
    hero.classList.add('hi-wait');   // o logo em imagem não chega a aparecer: quem o mostra é o canvas

    // do ecrã para as coordenadas do canvas (que pode estar reduzido, na abertura da Home)
    const frameBox = () => { const cr = canvas.getBoundingClientRect(); return { cr: cr, sc: cr.width ? canvas.clientWidth / cr.width : 1 }; };
    const toLocal = (r, b) => ({ x: (r.left - b.cr.left) * b.sc, y: (r.top - b.cr.top) * b.sc, w: r.width * b.sc, h: r.height * b.sc });
    // distância de um ponto à tinta do logo parado, px de CSS (grande se estiver longe)
    function inkDist(x, y) {
      const s = logoRest.w / field.iw;
      const tx = (x - logoRest.x) / s + field.PAD, ty = (y - logoRest.y) / s + field.PAD;
      if (!(tx >= 0 && ty >= 0 && tx < field.W && ty < field.H)) return 1e4;
      return field.sd[(ty | 0) * field.W + (tx | 0)] * s;
    }
    function aim() {
      for (let i = 0; i < rest.length; i++) {
        // enquanto o logo não chega a uma bola, ela fica no seu tamanho normal; depois recolhe-se
        const r0 = BASE_R + (rest[i] - BASE_R) * stay[i];
        let p = pull(px[i] - mx, py[i] - my);
        if (shy[i] > 0 && p > 0) p = Math.pow(p, 1 + shy[i] * stay[i] * 0.45);   // as bolas recolhidas junto ao logo só saem com o cursor mais perto
        target[i] = r0 + (MAX_R - r0) * p;
      }
    }
    function layout() {
      const b = frameBox(), m = toLocal(mask.getBoundingClientRect(), b);
      if (!m.w || !img.offsetHeight) return false;
      logoRest = { x: m.x, y: m.y, w: m.w, h: img.offsetHeight };
      band = logoRest.w * 0.26;
      G = grid();
      G.x = (hero.clientWidth - G.w) / 2; G.y = (hero.clientHeight - G.h) / 2;
      const n = G.cols * G.rows, keep = rad.length === n ? rad : null;
      px = new Float32Array(n); py = new Float32Array(n);
      rest = new Float32Array(n); shy = new Float32Array(n); target = new Float32Array(n); bytes = new Uint8Array(n * 4);
      off = new Float32Array(n); vel = new Float32Array(n); mass = new Float32Array(n);
      wave = new Float32Array(n); appear = new Float32Array(n).fill(introDone ? 1 : 0); stay = new Float32Array(n).fill(introDone ? 1 : 0);
      // junto ao logo as bolas recolhem-se: a tinta fica limpa e só voltam quando o cursor as puxa
      const far = Math.max(14, Math.min(34, logoRest.w * 0.05));
      const cx = hero.clientWidth / 2, cy = hero.clientHeight / 2, reach = Math.sqrt(cx * cx + cy * cy) || 1;
      for (let r = 0, i = 0; r < G.rows; r++) for (let c = 0; c < G.cols; c++, i++) {
        px[i] = G.x + (c + 0.5) * G.cellW; py[i] = G.y + (r + 0.5) * G.cellH;
        let t = (inkDist(px[i], py[i]) - 6) / (far - 6);
        t = t < 0 ? 0 : t > 1 ? 1 : t; t = t * t * (3 - 2 * t);
        rest[i] = R_MIN + (BASE_R - R_MIN) * t; shy[i] = 1 - t;
        wave[i] = Math.sqrt((px[i] - cx) * (px[i] - cx) + (py[i] - cy) * (py[i] - cy)) / reach;
        const h = Math.sin((c + 1) * 127.1 + (r + 1) * 311.7) * 43758.5453;   // peso diferente de bola para bola, sempre o mesmo
        mass[i] = 0.25 + 0.5 * (h - Math.floor(h));
      }
      aim();
      rad = keep || Float32Array.from(target);
      k = Math.min(K, field.WIDE * (logoRest.w / field.iw) * 0.9);
      return true;
    }
    function readGeom() {   // o logo mudou de sítio ou de tamanho? (janela redimensionada, imagem acabada de chegar)
      const b = frameBox();
      if (!b.cr.width) return;
      const m = toLocal(mask.getBoundingClientRect(), b);
      if (!logoRest || Math.abs(m.x - logoRest.x) > 0.5 || Math.abs(m.y - logoRest.y) > 0.5 || Math.abs(m.w - logoRest.w) > 0.5 ||
          Math.abs(img.offsetHeight - logoRest.h) > 0.5) layout();
    }
    // Entrada: a cada quadro, quanto de cada bola já se formou e até onde o logo já foi construído
    function intro(now) {
      if (introDone || !logoRest) return;
      if (t0 === null) { front = logoRest.x - band; return; }   // ainda só há fundo
      const t = now - t0;
      for (let i = 0; i < appear.length; i++) {
        let a = (t - BALLS_AT - wave[i] * WAVE) / BALL_DUR;
        a = a < 0 ? 0 : a > 1 ? 1 : a; a = 1 - a;
        appear[i] = 1 - a * a * a;
      }
      let u = (t - LOGO_AT) / LOGO_DUR;
      u = u < 0 ? 0 : u > 1 ? 1 : u;
      const e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      front = logoRest.x - band + e * (logoRest.w + band * 2);
      for (let i = 0; i < stay.length; i++) {
        let g = (front - px[i]) / band;
        g = g < 0 ? 0 : g > 1 ? 1 : g;
        stay[i] = g * g * (3 - 2 * g);
      }
      if (t >= LOGO_AT + LOGO_DUR && t >= BALLS_AT + WAVE + BALL_DUR) { introDone = true; front = 1e6; appear.fill(1); stay.fill(1); }
      aim();
    }
    function draw() {
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      if (!cw || !ch || !G || !logoRest) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(8e6 / (cw * ch)));   // teto de ~8 milhões de píxeis
      const pw = Math.max(1, Math.round(cw * dpr)), ph = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
      gl.viewport(0, 0, pw, ph);
      for (let i = 0; i < rad.length; i++) {
        const r = rad[i] > 0 ? rad[i] * appear[i] : rad[i];
        let q = Math.round((r - R_MIN) / R_SPAN * 65535);
        q = q < 0 ? 0 : q > 65535 ? 65535 : q;
        bytes[i * 4] = q >> 8; bytes[i * 4 + 1] = q & 255;
        let o = Math.round((Math.tanh(off[i] / SHIFT) * 0.5 + 0.5) * 65535);   // o desvio satura com suavidade
        o = o < 0 ? 0 : o > 65535 ? 65535 : o;
        bytes[i * 4 + 2] = o >> 8; bytes[i * 4 + 3] = o & 255;
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, G.cols, G.rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, bytes);
      const s = logoRest.w / field.iw;   // px de CSS por texel do logo
      gl.uniform2f(U.uRes, pw, ph); gl.uniform1f(U.uDpr, pw / cw);
      gl.uniform4f(U.uGrid, G.x, G.y, G.cellW, G.cellH); gl.uniform2f(U.uCells, G.cols, G.rows);
      gl.uniform3f(U.uRadRange, R_MIN, R_SPAN, SHIFT);
      gl.uniform4f(U.uLogoRect, logoRest.x - field.PAD * s, logoRest.y - field.PAD * s, field.W * s, field.H * s);
      gl.uniform3f(U.uBuild, front, band, introDone ? 0 : GROW);
      gl.uniform3f(U.uSdf, field.FINE, field.WIDE, s); gl.uniform1f(U.uK, k); gl.uniform1f(U.uEdge, EDGE);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return true;
    }
    function frame(now) {
      raf = 0;
      if (dead) return;
      const dt = last ? Math.min(64, now - last) : 16; last = now;
      const settling = now < settleUntil || (!introDone && t0 !== null);
      if (settling || !logoRest) readGeom();
      intro(now);
      let moving = false;
      const kf = 1 - Math.exp(-dt / 100);   // cada bola persegue o seu tamanho com um ligeiro atraso
      for (let i = 0; i < rad.length; i++) {
        const d = target[i] - rad[i];
        if (d > 0.02 || d < -0.02) { rad[i] += d * kf; moving = true; } else rad[i] = target[i];
      }
      // inércia: o que a página andou desde o último quadro empurra cada bola; a mola trá-la de volta
      const y = window.scrollY, dy = y - lastY, dts = dt / 1000;
      lastY = y;
      for (let i = 0; i < off.length; i++) {
        let o = off[i] + dy * mass[i], v = vel[i];
        v += (-STIFF * o - DAMP * v) * dts; o += v * dts;
        if (o > SHIFT * 4) o = SHIFT * 4; else if (o < -SHIFT * 4) o = -SHIFT * 4;
        if (o > 0.05 || o < -0.05 || v > 1 || v < -1) moving = true; else { o = 0; v = 0; }
        off[i] = o; vel[i] = v;
      }
      if (draw() && !shown) { shown = true; hero.classList.add('hi-gl'); hero.classList.remove('hi-wait'); }
      if (moving || settling) raf = requestAnimationFrame(frame); else last = 0;
    }
    // "kick": volta a desenhar e, durante ms, vai confirmando onde está o logo (a moldura da Home ainda pode estar a crescer)
    function kick(ms) {
      settleUntil = Math.max(settleUntil, performance.now() + (ms || 0));
      if (!raf && !dead) raf = requestAnimationFrame(frame);
    }
    function point(e) {
      const b = frameBox();
      if (!b.cr.width || b.cr.bottom < 0 || b.cr.top > window.innerHeight) return;
      mx = (e.clientX - b.cr.left) * b.sc; my = (e.clientY - b.cr.top) * b.sc;
      aim(); kick(0);
    }
    function release() { if (mx === -1e4) return; mx = my = -1e4; aim(); kick(0); }
    function fallback() {
      if (dead) return;
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      hero.classList.remove('hi-gl', 'hi-wait');
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      startDom();
    }
    let tries = 0;
    function go() {
      if (dead) return;
      let f = null;
      try { f = logoField(img); } catch (e) { fallback(); return; }
      if (!f) {   // imagem ainda por descodificar: volta a tentar; até lá vê-se o logo em imagem
        if (++tries > 40) fallback(); else setTimeout(go, 100);
        return;
      }
      field = f;
      gl.activeTexture(gl.TEXTURE1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, field.W, field.H, 0, gl.RGBA, gl.UNSIGNED_BYTE, field.tex);
      field.tex = null;
      kick(4000);
      // o cursor conta em toda a janela, para o efeito continuar com o cursor sobre o header
      window.addEventListener('scroll', () => {   // só enquanto a animação está no ecrã
        const cr = canvas.getBoundingClientRect();
        if (cr.bottom < -40 || cr.top > window.innerHeight + 40) { lastY = window.scrollY; return; }
        kick(0);
      }, { passive: true });
      window.addEventListener('pointermove', point, { passive: true });
      window.addEventListener('pointerdown', point, { passive: true });
      const lift = e => { if (e.pointerType !== 'mouse') release(); };   // no telemóvel, as bolas voltam ao levantar o dedo
      window.addEventListener('pointerup', lift, { passive: true });
      window.addEventListener('pointercancel', lift, { passive: true });
      document.addEventListener('pointerleave', release);
      document.documentElement.addEventListener('mouseleave', release);
      if ('ResizeObserver' in window) new ResizeObserver(() => { if (layout()) kick(600); }).observe(hero);
      else addEventListener('resize', () => { if (layout()) kick(600); });
      // a entrada começa quando o ecrã do logo sai (Home); noutra página, logo que o canvas esteja pronto
      const begin = () => { if (t0 === null && !introDone) { t0 = performance.now(); kick(LOGO_AT + LOGO_DUR + 400); } };
      if (!onHome || root.classList.contains('is-ready')) begin();
      else {
        const mo = new MutationObserver(() => { if (root.classList.contains('is-ready')) { mo.disconnect(); begin(); } });
        mo.observe(root, { attributes: true, attributeFilter: ['class'] });
        setTimeout(begin, 8000);   // segurança
      }
      addEventListener('load', () => kick(1500));
      addEventListener('pageshow', () => kick(1500));
      document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(300); });
    }
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); fallback(); });
    // só depois de a imagem estar carregada e descodificada é que se pode ler o contorno do logo
    const ready = () => { if (img.decode) img.decode().then(go, go); else go(); };
    if (img.complete && img.naturalWidth) ready();
    else { img.addEventListener('load', ready, { once: true }); img.addEventListener('error', fallback, { once: true }); }
    return true;
  }

  if (reduce || !startGl()) startDom();
})();

// ── Smooth scroll (Lenis) — em todo o site ──
// Lenis self-hosted (lenis.min.js). Roda com easing (smoothWheel); toque fica nativo.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const s = document.createElement('script');
  s.src = 'lenis.min.js';
  s.onload = () => {
    if (typeof Lenis !== 'function') return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    window.__lenis = lenis;   // referência (ex.: voltar-ao-topo pode usar lenis.scrollTo)
  };
  document.head.appendChild(s);
})();
