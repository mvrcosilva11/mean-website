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

// Home: lente de vidro canelado que segue o cursor sobre o vídeo
(function () {
  const home = document.querySelector('.home');
  const lens = document.getElementById('homeLens');
  if (!home || !lens) return;
  let raf = null, x = 0, y = 0;
  const move = e => {
    x = e.clientX; y = e.clientY;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      lens.style.left = x + 'px';
      lens.style.top = y + 'px';
      raf = null;
    });
  };
  home.addEventListener('mouseenter', () => lens.classList.add('on'));
  home.addEventListener('mouseleave', () => lens.classList.remove('on'));
  home.addEventListener('mousemove', move);
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
