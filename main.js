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
document.querySelectorAll('.ab .reveal, .page-work .reveal, .page-home-intro .reveal').forEach(el => observer.observe(el));

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
    feedback.textContent = meanT('Please fill in all fields.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.classList.add('error');
    feedback.textContent = meanT('Invalid email.');
    return;
  }

  // Simulate send (replace with real endpoint if needed)
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = meanT('Sending…');

  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.textContent = meanT('Send message');
    feedback.classList.add('success');
    feedback.textContent = meanT("Message sent! We'll reply soon.");
    setTimeout(() => { feedback.textContent = ''; feedback.className = 'form-feedback'; }, 5000);
  }, 1200);
});

// ── Animação da Intro (página Intro e abertura da Home) ──
// O logo sobre uma grelha de bolas que crescem junto ao cursor. As bolas e o logo são desenhados juntos
// num <canvas> (WebGL), como se fossem a mesma matéria: uma bola que toca no logo funde-se com ele, e a
// parte do logo que fica dentro de uma bola aparece em negativo (bordô sobre vermelho).
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
    'uniform sampler2D uRad;',   // raio de cada bola (16 bits)
    'uniform vec2 uRadRange;',   // raio mínimo e amplitude
    'uniform sampler2D uLogo;',  // distância ao contorno do logo: R = fina, G = larga
    'uniform vec4 uLogoRect;',   // onde está a textura do logo, px de CSS
    'uniform vec4 uClip;',       // máscara do logo (x0, y0, x1, y1): é por ela que o logo entra
    'uniform vec3 uSdf;',        // alcance fino, alcance largo (em texels), px de CSS por texel
    'uniform float uK;',         // raio da fusão entre formas
    'uniform float uEdge;',      // largura da orla em que o logo se funde com a bola
    'uniform vec3 uColor;',
    // união suave: onde duas formas se aproximam, nasce uma ponte entre elas
    'float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }',
    'void main() {',
    '  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;',
    '  vec2 c = floor((p - uGrid.xy) / uGrid.zw);',
    '  float dB = 1.0e4;',       // distância à bola mais próxima (só as 9 células à volta contam)
    '  for (int j = -1; j <= 1; j++) {',
    '    for (int i = -1; i <= 1; i++) {',
    '      vec2 cc = c + vec2(float(i), float(j));',
    '      if (cc.x < 0.0 || cc.y < 0.0 || cc.x >= uCells.x || cc.y >= uCells.y) continue;',
    '      vec4 t = texture2D(uRad, (cc + 0.5) / uCells);',
    '      float r = uRadRange.x + (t.r * 65280.0 + t.a * 255.0) / 65535.0 * uRadRange.y;',
    '      dB = smin(dB, length(p - (uGrid.xy + (cc + 0.5) * uGrid.zw)) - r, uK);',
    '    }',
    '  }',
    '  float dL = 1.0e4;',       // distância ao logo
    '  vec2 uv = (p - uLogoRect.xy) / uLogoRect.zw;',
    '  if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {',
    '    vec4 s = texture2D(uLogo, uv);',
    '    float wide = (s.g * 2.0 - 1.0) * uSdf.y;',
    '    float fine = (s.r * 2.0 - 1.0) * uSdf.x;',
    '    dL = (abs(wide) < uSdf.x * 0.75 ? fine : wide) * uSdf.z;',
    '  }',
    '  dL = max(dL, max(max(uClip.x - p.x, p.x - uClip.z), max(uClip.y - p.y, p.y - uClip.w)));',
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
    ['uRes', 'uDpr', 'uGrid', 'uCells', 'uRad', 'uRadRange', 'uLogo', 'uLogoRect', 'uClip', 'uSdf', 'uK', 'uEdge', 'uColor'].forEach(n => { U[n] = gl.getUniformLocation(prog, n); });
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
    let dead = false, shown = false, field = null;
    let G = null, px = [], py = [], rest = new Float32Array(0), shy = rest, target = rest, rad = rest, bytes = new Uint8Array(0);
    let logoRest = null, logoLive = null, clipLive = null, dotsIn = 0, k = K;
    let mx = -1e4, my = -1e4, raf = 0, last = 0, settleUntil = 0;

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
        let p = pull(px[i] - mx, py[i] - my);
        if (shy[i] > 0 && p > 0) p = Math.pow(p, 1 + shy[i] * 0.45);   // as bolas recolhidas junto ao logo só saem com o cursor mais perto
        target[i] = rest[i] + (MAX_R - rest[i]) * p;
      }
    }
    function layout() {
      const b = frameBox(), m = toLocal(mask.getBoundingClientRect(), b);
      if (!m.w || !img.offsetHeight) return false;
      logoRest = { x: m.x, y: m.y, w: m.w, h: img.offsetHeight };
      G = grid();
      G.x = (hero.clientWidth - G.w) / 2; G.y = (hero.clientHeight - G.h) / 2;
      const n = G.cols * G.rows, keep = rad.length === n ? rad : null;
      px = new Float32Array(n); py = new Float32Array(n);
      rest = new Float32Array(n); shy = new Float32Array(n); target = new Float32Array(n); bytes = new Uint8Array(n * 2);
      // junto ao logo as bolas recolhem-se: a tinta fica limpa e só voltam quando o cursor as puxa
      const far = Math.max(14, Math.min(34, logoRest.w * 0.05));
      for (let r = 0, i = 0; r < G.rows; r++) for (let c = 0; c < G.cols; c++, i++) {
        px[i] = G.x + (c + 0.5) * G.cellW; py[i] = G.y + (r + 0.5) * G.cellH;
        let t = (inkDist(px[i], py[i]) - 6) / (far - 6);
        t = t < 0 ? 0 : t > 1 ? 1 : t; t = t * t * (3 - 2 * t);
        rest[i] = R_MIN + (BASE_R - R_MIN) * t; shy[i] = 1 - t;
      }
      aim();
      rad = keep || Float32Array.from(target);
      k = Math.min(K, field.WIDE * (logoRest.w / field.iw) * 0.9);
      return true;
    }
    function readGeom() {
      const b = frameBox();
      if (!b.cr.width) return;
      const m = toLocal(mask.getBoundingClientRect(), b);
      if (!logoRest || Math.abs(m.x - logoRest.x) > 0.5 || Math.abs(m.y - logoRest.y) > 0.5 || Math.abs(m.w - logoRest.w) > 0.5 ||
          Math.abs(img.offsetHeight - logoRest.h) > 0.5) { if (!layout()) return; }
      logoLive = toLocal(img.getBoundingClientRect(), b);
      clipLive = m;
      dotsIn = parseFloat(getComputedStyle(wrap).opacity) || 0;   // as bolas entram ao ritmo do CSS
    }
    function draw() {
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      if (!cw || !ch || !G || !logoLive) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(8e6 / (cw * ch)));   // teto de ~8 milhões de píxeis
      const pw = Math.max(1, Math.round(cw * dpr)), ph = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
      gl.viewport(0, 0, pw, ph);
      for (let i = 0; i < rad.length; i++) {
        const r = rad[i] > 0 ? rad[i] * dotsIn : rad[i];
        let q = Math.round((r - R_MIN) / R_SPAN * 65535);
        q = q < 0 ? 0 : q > 65535 ? 65535 : q;
        bytes[i * 2] = q >> 8; bytes[i * 2 + 1] = q & 255;
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE_ALPHA, G.cols, G.rows, 0, gl.LUMINANCE_ALPHA, gl.UNSIGNED_BYTE, bytes);
      const s = logoLive.w / field.iw;   // px de CSS por texel do logo
      gl.uniform2f(U.uRes, pw, ph); gl.uniform1f(U.uDpr, pw / cw);
      gl.uniform4f(U.uGrid, G.x, G.y, G.cellW, G.cellH); gl.uniform2f(U.uCells, G.cols, G.rows);
      gl.uniform2f(U.uRadRange, R_MIN, R_SPAN);
      gl.uniform4f(U.uLogoRect, logoLive.x - field.PAD * s, logoLive.y - field.PAD * s, field.W * s, field.H * s);
      gl.uniform4f(U.uClip, clipLive.x, clipLive.y, clipLive.x + clipLive.w, clipLive.y + clipLive.h);
      gl.uniform3f(U.uSdf, field.FINE, field.WIDE, s); gl.uniform1f(U.uK, k); gl.uniform1f(U.uEdge, EDGE);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return true;
    }
    function frame(now) {
      raf = 0;
      if (dead) return;
      const dt = last ? Math.min(64, now - last) : 16; last = now;
      const settling = now < settleUntil;
      if (settling || !logoLive) readGeom();
      let moving = false;
      const kf = 1 - Math.exp(-dt / 100);   // cada bola persegue o seu tamanho com um ligeiro atraso
      for (let i = 0; i < rad.length; i++) {
        const d = target[i] - rad[i];
        if (d > 0.02 || d < -0.02) { rad[i] += d * kf; moving = true; } else rad[i] = target[i];
      }
      if (draw() && !shown) { shown = true; hero.classList.add('hi-gl'); }   // só agora o logo em imagem sai de cena
      if (moving || settling) raf = requestAnimationFrame(frame); else last = 0;
    }
    // "kick": volta a desenhar e, durante ms, acompanha as animações do CSS (entrada do logo, abertura da Home)
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
      hero.classList.remove('hi-gl');
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
      window.addEventListener('pointermove', point, { passive: true });
      window.addEventListener('pointerdown', point, { passive: true });
      const lift = e => { if (e.pointerType !== 'mouse') release(); };   // no telemóvel, as bolas voltam ao levantar o dedo
      window.addEventListener('pointerup', lift, { passive: true });
      window.addEventListener('pointercancel', lift, { passive: true });
      document.addEventListener('pointerleave', release);
      document.documentElement.addEventListener('mouseleave', release);
      if ('ResizeObserver' in window) new ResizeObserver(() => { if (layout()) kick(600); }).observe(hero);
      else addEventListener('resize', () => { if (layout()) kick(600); });
      // entrada do logo e abertura da Home: quando o estado muda, acompanha-se o CSS durante uns segundos
      const root = document.documentElement;
      const state = () => (root.classList.contains('is-ready') ? 1 : 0) + (root.classList.contains('is-open') ? 2 : 0) + (hero.classList.contains('is-in') ? 4 : 0);
      let seen = state();
      const mo = new MutationObserver(() => { const s = state(); if (s !== seen) { seen = s; kick(4000); } });
      mo.observe(root, { attributes: true, attributeFilter: ['class'] });
      mo.observe(hero, { attributes: true, attributeFilter: ['class'] });
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
