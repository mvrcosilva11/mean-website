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

// Separador / preloader: só na 1ª abertura do site (por sessão); some quando a animação acaba
(function () {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  // já visto nesta sessão → remove sem animação
  if (sessionStorage.getItem('mean_intro_seen')) { pre.remove(); return; }
  sessionStorage.setItem('mean_intro_seen', '1');
  const vid = document.getElementById('introVideo');
  let done = false;
  const hide = () => {
    if (done) return; done = true;
    pre.classList.add('done');
    setTimeout(() => pre.remove(), 700);
  };
  if (vid) {
    vid.addEventListener('ended', hide);
    setTimeout(hide, 4000); // fallback caso o vídeo não toque
  } else {
    setTimeout(hide, 1300);
  }
})();

// Cursor personalizado: uma só bolinha (sem rasto), em modo "negativo" (ver .cursor-dot no CSS)
(function () {
  // ignora em dispositivos touch (não há cursor)
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
  const N = 1;
  const OPAC = [1];
  const dots = [];
  for (let i = 0; i < N; i++) {
    const el = document.createElement('div');
    el.className = 'cursor-dot';
    el.style.opacity = OPAC[i];
    document.body.appendChild(el);
    dots.push({ el });
  }
  const GAP = 7;                                   // intervalo (frames) entre bolinhas → espaçamento
  let mx = window.innerWidth / 2, my = window.innerHeight / 2, visible = true;
  const hist = [];
  const show = v => dots.forEach((d, i) => d.el.style.opacity = v ? OPAC[i] : 0);
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!visible) { visible = true; show(true); }
  });
  document.addEventListener('mouseleave', () => { visible = false; show(false); });
  document.addEventListener('mouseenter', () => { visible = true; show(true); });
  (function loop() {
    hist.unshift({ x: mx, y: my });
    const maxLen = (N - 1) * GAP + 1;
    if (hist.length > maxLen) hist.length = maxLen;
    for (let i = 0; i < N; i++) {
      const p = hist[Math.min(i * GAP, hist.length - 1)];   // bolinha i = posição de i*GAP frames atrás
      dots[i].el.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) translate(-50%,-50%)';
    }
    requestAnimationFrame(loop);
  })();
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

// Elementos já marcados com .reveal no HTML — blur-in ao entrar no ecrã, com stagger de 0.1s por grupo
['.ab-team-grid', '.ab-manifesto .ab-list', '.ab-services .ab-list', '.ab-values-grid', '.ab-life-grid',
 '.work-lead', '.ft2-top'].forEach(sel => {
  document.querySelectorAll(sel).forEach(group => {
    group.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i * 100) + 'ms'; });
  });
});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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

// Transição de página — wipe vermelho ao navegar entre páginas do site
(function () {
  const trans = document.createElement('div');
  trans.className = 'page-trans';
  document.body.appendChild(trans);
  const EASE = 'transform .55s cubic-bezier(.76,0,.24,1)';
  // ao carregar: revela (a não ser que o preloader de entrada esteja a mostrar)
  if (!document.getElementById('preloader')) {
    trans.style.transformOrigin = 'right center';
    trans.style.transform = 'scaleX(1)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      trans.style.transition = EASE;
      trans.style.transform = 'scaleX(0)';
    }));
  }
  // ao clicar num link interno: cobre e depois navega
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || a.target === '_blank') return;
    e.preventDefault();
    trans.style.transition = EASE;
    trans.style.transformOrigin = 'left center';
    trans.style.transform = 'scaleX(1)';
    setTimeout(() => { window.location.href = href; }, 520);
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

// ── Contact: formulário por passos (âmbito → orçamento → prazo → dados) ──
(function () {
  const pf = document.getElementById('projectForm');
  if (!pf) return;
  const steps = [...pf.querySelectorAll('.cf-steps button')];
  const sections = [...pf.querySelectorAll('.cf-section')];
  const bar = pf.querySelector('.cf-steps');

  function scrollToEl(el) {
    const nav = document.querySelector('.nav');
    const offset = (nav ? nav.offsetHeight : 64) + (bar ? bar.offsetHeight : 0) + 16;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -offset });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const nextOf = el => sections[sections.indexOf(el.closest('.cf-section')) + 1];

  // resumo do passo final acompanha as escolhas
  pf.addEventListener('change', e => {
    if (e.target.type !== 'radio') return;
    const out = pf.querySelector('[data-summary="' + e.target.name + '"]');
    if (out) out.textContent = e.target.value;
  });

  // "Próximo passo" num cartão já escolhido avança para o passo seguinte
  pf.addEventListener('click', e => {
    const btn = e.target.closest('.cf-card-btn');
    if (!btn) return;
    const radio = btn.closest('.cf-card').querySelector('.cf-radio');
    if (radio.checked) {
      e.preventDefault();
      const next = nextOf(btn);
      if (next) scrollToEl(next);
    }
  });
  // Enter num cartão (teclado) também avança
  pf.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || !e.target.classList.contains('cf-radio')) return;
    e.preventDefault();
    e.target.checked = true;
    e.target.dispatchEvent(new Event('change', { bubbles: true }));
    const next = nextOf(e.target);
    if (next) scrollToEl(next);
  });

  // separadores da barra de passos
  steps.forEach(b => b.addEventListener('click', () => {
    const target = document.getElementById(b.dataset.go);
    if (target) scrollToEl(target);
  }));
  function setActive(i) {
    steps.forEach((b, j) => {
      b.classList.toggle('is-active', j === i);
      if (j === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) setActive(+en.target.dataset.step); });
  }, { rootMargin: '-35% 0px -60% 0px' });
  sections.forEach(s => io.observe(s));

  // envio: abre o email do visitante já preenchido com o pedido
  const fb = pf.querySelector('.cf-feedback');
  pf.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(pf);
    const name = (d.get('name') || '').trim();
    const email = (d.get('email') || '').trim();
    const nameEl = pf.elements.name, emailEl = pf.elements.email;
    nameEl.removeAttribute('aria-invalid'); emailEl.removeAttribute('aria-invalid');
    fb.className = 'cf-feedback';

    let err = '';
    if (!name) { err = 'Escreve o teu nome.'; nameEl.setAttribute('aria-invalid', 'true'); }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err = 'Escreve um email válido.'; emailEl.setAttribute('aria-invalid', 'true'); }
    else if (!d.get('privacy')) err = 'Confirma que aceitas que usemos estes dados para te responder.';
    if (err) { fb.classList.add('is-error'); fb.textContent = err; return; }

    const body = [
      'Foco: ' + d.get('scope'),
      'Orçamento: ' + d.get('budget'),
      'Prazo: ' + d.get('timeline'),
      '',
      'Nome: ' + name,
      'Empresa: ' + ((d.get('company') || '').trim() || '—'),
      'País: ' + ((d.get('country') || '').trim() || '—'),
      'Email: ' + email,
      '',
      (d.get('message') || '').trim()
    ].join('\n');
    window.location.href = 'mailto:mean.geral@gmail.com'
      + '?subject=' + encodeURIComponent('Pedido de projeto — ' + name)
      + '&body=' + encodeURIComponent(body);
    fb.textContent = 'A abrir o teu email com o pedido preenchido. Se não abrir, escreve-nos para mean.geral@gmail.com.';
  });
})();
