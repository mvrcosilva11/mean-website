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
    projeto.querySelector('.projeto-name').textContent = 'Projeto não encontrado';
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
  const anim = pre.dataset.anim || 'assets/intro-logo.webp?v=41';
  const still = pre.dataset.still || 'assets/intro-logo.png?v=41';
  let done = false, timer = 0, blobUrl = '';
  const hide = () => {
    if (done) return; done = true;
    pre.classList.add('done');
    setTimeout(() => { pre.remove(); if (blobUrl) URL.revokeObjectURL(blobUrl); }, 700);
  };
  const img = new Image();
  img.className = 'preloader-anim'; img.id = 'introAnim'; img.alt = 'MEAN';
  // esconde quando a animação acaba (o tempo conta a partir do momento em que a imagem está pronta)
  img.onload = () => { clearTimeout(timer); timer = setTimeout(hide, dur + 150); };
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
    blob.then(b => { blobUrl = URL.createObjectURL(b); img.src = blobUrl; })
        .catch(() => { img.src = anim; });
  } else {
    img.src = anim;
  }
  setTimeout(hide, dur + 4000); // segurança
})();

// Cursor personalizado: circunferência com um ponto no centro, em modo "negativo" (sem rasto).
// (a forma está no CSS: .cursor-dot é a circunferência, ::before o ponto;
//  sobre os projetos a circunferência estica para uma pill com texto, ver motion.js)
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
  // fundo escuro da pill que aparece sobre os projetos (fica fora do grupo "negativo", ver CSS)
  const back = document.createElement('div');
  back.className = 'cursor-back';
  back.setAttribute('aria-hidden', 'true');
  document.body.appendChild(back);
  document.body.appendChild(layer);

  let visible = false, placed = false;
  const show = v => {
    visible = v;
    dot.style.opacity = v ? 1 : 0;
    back.style.visibility = v ? '' : 'hidden';
  };
  const place = (x, y) => {
    placed = true;
    const tr = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%)';
    dot.style.transform = tr;
    back.style.transform = tr;
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

// Contact form
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  feedback.className = 'form-feedback';
  feedback.textContent = '';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    feedback.classList.add('error');
    feedback.textContent = 'Por favor preenche todos os campos.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.classList.add('error');
    feedback.textContent = 'Email inválido.';
    return;
  }

  // Simulate send (replace with real endpoint if needed)
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'A enviar…';

  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Enviar mensagem';
    feedback.classList.add('success');
    feedback.textContent = 'Mensagem enviada! Responderei em breve.';
    setTimeout(() => { feedback.textContent = ''; feedback.className = 'form-feedback'; }, 5000);
  }, 1200);
});

// ── Home intro: dispara a animação de entrada ao carregar ──
(function () {
  const hero = document.querySelector('.hi-hero');
  if (!hero) return;
  requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('is-in')));

  const wrap = hero.querySelector('.hi-dots');
  if (!wrap) return;

  const SPACING = 80;   // mais espaço entre bolas (menos bolas no ecrã)
  const RADIUS  = 300;  // raio de influência largo — as bolas ao lado também crescem
  // Bola renderizada a 150px; escala é 0..1 (reduzir mantém-se nítido)
  const MAX_S   = 1;      // 150px junto ao cursor
  const MIN_S   = 0.0667; // ≈ 10px de base (longe)
  let dots = [], pos = [];

  function build() {
    const w = wrap.clientWidth, h = wrap.clientHeight;
    // grelha por células: bola no centro de cada célula → meia-célula de margem em todos os lados,
    // simétrico e sem bolas cortadas nas bordas seja qual for a largura do ecrã
    const cols = Math.max(1, Math.round(w / SPACING)), rows = Math.max(1, Math.round(h / SPACING));
    const cellW = w / cols, cellH = h / rows;
    const frag = document.createDocumentFragment();
    dots = []; pos = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) * cellW, y = (r + 0.5) * cellH;
      const d = document.createElement('span');
      d.className = 'hi-dot';
      d.style.left = x + 'px'; d.style.top = y + 'px';
      d.style.setProperty('--s', MIN_S);
      frag.appendChild(d); dots.push(d); pos.push([x, y]);
    }
    wrap.replaceChildren(frag);
  }

  function update(mx, my) {
    for (let i = 0; i < dots.length; i++) {
      const dx = pos[i][0] - mx, dy = pos[i][1] - my;
      let p = 1 - Math.sqrt(dx * dx + dy * dy) / RADIUS;
      if (p < 0) p = 0; else p = p * p;            // queda suave — gradiente amplo à volta do cursor
      dots[i].style.setProperty('--s', (MIN_S + p * (MAX_S - MIN_S)).toFixed(3));
    }
  }

  build();
  // ResizeObserver: reconstrói a grelha assim que a caixa recebe (ou muda) as dimensões reais,
  // resolvendo o timing do 1º layout e o redimensionar da janela de forma fiável.
  let rt;
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(build, 120); }).observe(wrap);
  } else {
    addEventListener('load', build);
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = null, mx = 0, my = 0;
  // listener na janela (não só na hero) para o efeito continuar mesmo com o cursor sobre o header
  window.addEventListener('pointermove', e => {
    const r = wrap.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
    if (!raf) raf = requestAnimationFrame(() => { update(mx, my); raf = null; });
  });
  // só reinicia quando o cursor sai da janela toda
  document.addEventListener('pointerleave', () => update(-9999, -9999));
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
