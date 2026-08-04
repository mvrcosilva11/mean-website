// Theme toggle (light = gray, dark = black) with persistence
(function () {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.body.classList.add('dark');
  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });
})();

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

// Cursor personalizado: bolinha vermelha + rasto de 3 bolinhas (4 no total)
(function () {
  // ignora em dispositivos touch (não há cursor)
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
  const N = 4;
  const OPAC = [1, 0.7, 0.45, 0.22]; // desvanece proporcionalmente ao longo do rasto
  const dots = [];
  for (let i = 0; i < N; i++) {
    const el = document.createElement('div');
    el.className = 'cursor-dot';
    el.style.opacity = OPAC[i];
    document.body.appendChild(el);
    dots.push({ el, x: window.innerWidth / 2, y: window.innerHeight / 2 });
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

// About page: reveal elements already marked with .reveal in the HTML (com stagger por grupo)
['.ab-team-grid', '.ab-manifesto .ab-list', '.ab-services .ab-list'].forEach(sel => {
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
