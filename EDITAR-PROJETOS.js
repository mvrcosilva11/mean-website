// ============================================================
//  MEAN AGENCY — PROJETOS
//  Edita aqui tudo o que aparece no site (Work / Projects).
//
//  Cada projeto é um bloco que começa por  == pasta ==  e tem:
//     nome:       o nome que aparece no site
//     categoria:  a categoria (por baixo do nome)
//     cor:        #ffffff (branco) ou #111111 (preto) — cor do contorno no hover
//     texto:      a descrição que aparece na página do projeto
//
//   • Muda nome / categoria / texto à vontade.
//   • NÃO mudes o  == pasta ==  (liga às imagens em /Projetos/<pasta>/).
//   • Cada pasta precisa de uma capa  00-capa.png  (e opcional 00-capa-hover.png).
//   • Reordenar projetos = trocar os blocos de posição.
//   • Esconder um projeto = apagar (ou comentar) o seu bloco.
//   • O texto é uma linha só (escreve à vontade, sem partir a linha).
//
//   EXEMPLO de um bloco (copia, descomenta e adapta):
//
//   == 01-nome-do-cliente ==
//   nome: Nome do Cliente
//   categoria: Branding / Website
//   cor: #111111
//   texto: Breve descrição do projeto que aparece na página do projeto.
//
//   Depois de adicionares pastas/imagens em /Projetos, pede ao Claude
//   para regenerar o imagens.js.
// ============================================================
const PROJETOS_TXT = `

`;

// ---------- (não precisas de mexer daqui para baixo) ----------
function parseProjetos(txt) {
  const out = []; let cur = null;
  txt.split('\n').forEach(line => {
    const h = line.trim().match(/^==\s*(.+?)\s*==$/);
    if (h) { cur = { folder: h[1], nome: '', categoria: '', cor: '#111111', texto: '' }; out.push(cur); return; }
    if (!cur) return;
    const kv = line.match(/^\s*(nome|categoria|cor|texto)\s*:\s*(.*)$/i);
    if (kv) cur[kv[1].toLowerCase()] = kv[2].trim();
  });
  return out.filter(p => p.folder);
}
window.PROJETOS = parseProjetos(PROJETOS_TXT);

(function () {
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const wgrid = document.getElementById('w-grid');
  const wlList = document.getElementById('wl-list');
  const wlFilters = document.getElementById('wl-filters');

  window.PROJETOS.forEach(p => {
    const src = 'Projetos/' + p.folder + '/00-capa.png';
    const href = 'projeto.html?p=' + encodeURIComponent(p.folder);
    if (wgrid) {
      const a = document.createElement('a');
      a.className = 'w-item'; a.href = href;
      a.dataset.project = p.folder; a.style.setProperty('--stroke', p.cor || '#111111');
      a.innerHTML = '<div class="w-rect"><img src="' + src + '" alt="' + esc(p.nome) + '" loading="lazy" /></div>'
        + '<div class="w-caption"><span class="w-name">' + esc(p.nome) + '</span>'
        + '<span class="w-cat">' + esc(p.categoria) + '</span></div>';
      wgrid.appendChild(a);
    }
    if (wlList) {
      const li = document.createElement('li');
      li.dataset.categoria = p.categoria || '';
      li.innerHTML = '<a class="wl-row" href="' + href + '" data-project="' + esc(p.folder) + '">'
        + '<span class="wl-name">' + esc(p.nome) + '</span>'
        + '<span class="wl-cat">' + esc(p.categoria) + '</span>'
        + '<span class="wl-thumb"><img src="' + src + '" alt="" loading="lazy" /></span>'
        + '<span class="wl-arrow" aria-hidden="true">→</span>'
        + '</a>';
      wlList.appendChild(li);
    }
  });

  if (wlList && !window.PROJETOS.length) {
    wlList.innerHTML = '<li class="wl-empty">Ainda sem projetos publicados. Volta em breve.</li>';
  }

  if (wlFilters && window.PROJETOS.length) {
    const cats = [...new Set(window.PROJETOS.map(p => p.categoria).filter(Boolean))];
    if (cats.length > 1) {
      const mkFilter = (label, cat, active) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'wl-filter' + (active ? ' active' : '');
        btn.textContent = label;
        btn.dataset.cat = cat;
        li.appendChild(btn);
        return li;
      };
      wlFilters.appendChild(mkFilter('Todos', '', true));
      cats.forEach(c => wlFilters.appendChild(mkFilter(c, c, false)));
    }
  }
})();
