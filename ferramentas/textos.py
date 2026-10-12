#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MEAN — liga os ficheiros de texto (TEXTOS-SITE.txt, TEXTOS-PROJETOS.txt) ao site.

    python3 ferramentas/textos.py            passa para o site o que mudou nos ficheiros de texto
    python3 ferramentas/textos.py atualizar  depois de o site mudar por outra via (páginas editadas à mão, pull do sócio):
                                             aplica o que houver por aplicar e refaz os ficheiros de texto a partir do site
    python3 ferramentas/textos.py gerar      volta a escrever os ficheiros de texto a partir do site
                                             (apaga o que neles estiver por aplicar; pode levar o nome de um só ficheiro)

Como funciona
  1. Lê as páginas e descobre cada texto e o sítio exato onde está (ficheiro e posição).
  2. Com isso monta o "documento canónico": o ficheiro de texto tal como sairia do site neste momento.
     Cada linha editável (EN:, PT:, itens de lista) fica ligada ao texto a que corresponde.
  3. Compara o ficheiro do utilizador com a última versão aplicada (guardada em ferramentas/.estado/).
     Só as linhas que o utilizador mudou contam como alterações.
  4. Troca o inglês nas páginas (ou no main.js, para o painel de contacto) e acerta o dicionário de
     português no i18n.js, que tem como chave o texto em inglês.
  5. Antes de gravar, confirma que a estrutura do HTML não mudou e que o site passou a dizer o que o
     ficheiro diz. Se algo não bater certo, não grava nada e explica o problema em TEXTOS-ERRO.txt.

O servidor local (ferramentas/servidor-local.py) corre isto sozinho sempre que um ficheiro de texto é guardado.
"""
import re, json, html, os, sys, difflib, subprocess, shutil

ROOT = os.environ.get('MEAN_SITE') or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # MEAN_SITE: só para testes
BASE = ['index.html', 'about.html', 'work.html', 'projeto.html']
PAGES = list(BASE)   # + as páginas de projeto (projeto-nome-do-cliente.html); a lista é refeita cada vez que se lê o site


def pages():
    return BASE + sorted(f for f in os.listdir(ROOT) if re.match(r'projeto-[\w-]+\.html$', f))
F_SITE, F_PROJ, F_ERR = 'TEXTOS-SITE.txt', 'TEXTOS-PROJETOS.txt', 'TEXTOS-ERRO.txt'
STATE = os.path.join(ROOT, 'ferramentas', '.estado')


class Erro(Exception):
    pass


def path(f): return os.path.join(ROOT, f)
def rd(f):
    try: return open(path(f), encoding='utf-8-sig').read()
    except UnicodeDecodeError:
        raise Erro(f + ': o ficheiro não está guardado em UTF-8. No editor, escolhe "Texto simples" e codificação UTF-8 ao guardar.')
def norm(t): return re.sub(r'\s+', ' ', t).strip()


def wr(f, text):   # grava de uma vez (ficheiro temporário + troca), para o browser nunca apanhar um ficheiro a meio
    tmp = path(f) + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as h: h.write(text)
    os.replace(tmp, path(f))


# ───────────────────────────── ler o HTML: textos e onde estão ─────────────────────────────
VOID = {'br', 'img', 'input', 'meta', 'link', 'source', 'hr', 'path', 'circle', 'rect', 'use'}
TOK = re.compile(r'<!--.*?-->|<(script|style|svg)\b.*?</\1\s*>|<[^>]+>', re.S)


BR_TAG = re.compile(r'<br\s+class="m-br"\s*/?>')    # quebra de linha manual, tal como fica no HTML
BR = '<br>'                                         # …e como se escreve nos ficheiros de texto e nas traduções


def canon_br(t):
    """Arruma as quebras de linha de um texto: ' <br> ' entre as partes, nenhuma no princípio nem no fim."""
    parts = [x.strip() for x in re.split(r'<br\s*/?>', t, flags=re.I)]
    return (' ' + BR + ' ').join(x for x in parts if x)


def key(t):   # a chave de um texto no dicionário de português: a frase sem as quebras
    return norm(t.replace(BR, ' '))


class Node:
    """Um texto visível numa página: ficheiro, posição (a, b), texto e os elementos onde está metido.
    leaf = o texto é tudo o que o elemento tem lá dentro (só assim pode levar quebras de linha)."""
    __slots__ = ('f', 'a', 'b', 'en', 'path', 'leaf')

    def __init__(s, f, a, b, en, p, leaf=False): s.f, s.a, s.b, s.en, s.path, s.leaf = f, a, b, en, p, leaf
    def tag(s, t): return any(x[0] == t for x in s.path)
    def cls(s, c): return any(c in x[1] for x in s.path)
    def uid(s, c): return next((x[2] for x in s.path if c in x[1]), None)   # o elemento concreto com essa classe
    @property
    def el(s):
        t, c, _ = s.path[-1]
        return t + ('.' + c[0] if c else '')
    @property
    def loc(s): return (s.f, s.a, s.b, 'html')


def nodes(f, src):
    out, stack, uid = [], [], 0
    pos = src.find('<body'); opened = False          # opened: a etiqueta anterior abriu o elemento onde estamos
    for m in TOK.finditer(src, pos):
        t = m.group(0)
        if BR_TAG.fullmatch(t): continue             # quebra de linha manual: não interrompe o texto
        raw = src[pos:m.start()]
        if BR_TAG.sub('', raw).strip():
            a = pos + len(raw) - len(raw.lstrip()); b = pos + len(raw.rstrip())
            en = canon_br(html.unescape(norm(BR_TAG.sub(' ' + BR + ' ', src[a:b]))))
            out.append(Node(f, a, b, en, list(stack), opened and t.startswith('</')))
        pos = m.end(); was, opened = opened, False
        if t.startswith('<!--') or m.group(1): continue
        if t.startswith('</'):
            name = t[2:-1].strip().lower()
            for i in range(len(stack) - 1, -1, -1):
                if stack[i][0] == name: del stack[i:]; break
            continue
        name = re.match(r'<([a-zA-Z0-9]+)', t).group(1).lower()
        if name in VOID or t.endswith('/>'): continue
        cm = re.search(r'\bclass="([^"]*)"', t); uid += 1
        stack.append((name, cm.group(1).split() if cm else [], uid)); opened = True
    return out


def tags(src):
    """O esqueleto de uma página: a sequência de etiquetas (só o nome; os atributos podem mudar, p. ex. a descrição
    para o Google ou um link mailto:), mais os comentários e blocos de script/estilo por inteiro.
    Tem de ficar igual depois de trocar textos."""
    return [m.group(0) if m.group(1) or m.group(0).startswith('<!--') else re.match(r'</?\s*[a-zA-Z0-9!]+', m.group(0)).group(0)
            for m in TOK.finditer(src) if not BR_TAG.fullmatch(m.group(0))]      # as quebras de linha manuais são texto


# ───────────────────────────── dicionário de português (i18n.js) ─────────────────────────────
PT_LINE = re.compile(r'^([ \t]*)("(?:[^"\\]|\\.)*")(\s*:\s*)("(?:[^"\\]|\\.)*")(\s*,?[ \t]*)$', re.M)


def pt_bounds(src):
    a = src.index('var PT = {')
    b = re.compile(r'^\s*\};', re.M).search(src, a).start()
    return a, b


def pt_read(src):
    a, b = pt_bounds(src); out = {}
    for m in PT_LINE.finditer(src, a, b):
        try: out[json.loads(m.group(2))] = json.loads(m.group(4))
        except ValueError: pass
    return out


def pt_set(src, key, val, after=None):
    a, b = pt_bounds(src); js = lambda t: json.dumps(t, ensure_ascii=False)
    for m in PT_LINE.finditer(src, a, b):
        if json.loads(m.group(2)) == key:
            return src[:m.start(4)] + js(val) + src[m.end(4):]
    line = '    ' + js(key) + ': ' + js(val) + ',\n'
    if after is not None:
        for m in PT_LINE.finditer(src, a, b):
            if json.loads(m.group(2)) == after:
                at = m.end() + 1
                return src[:at] + line + src[at:]
    last = None
    for last in PT_LINE.finditer(src, a, b): pass
    if last and ',' not in last.group(5):          # a última entrada não tem vírgula: precisa dela antes de se acrescentar outra
        src = src[:last.end(4)] + ',' + src[last.end(4):]; b += 1
    return src[:b] + line + src[b:]


def pt_del(src, key):
    a, b = pt_bounds(src)
    for m in PT_LINE.finditer(src, a, b):
        if json.loads(m.group(2)) == key:
            return src[:m.start()] + src[m.end() + 1:]
    return src


# ───────────────────────────── entradas e documentos ─────────────────────────────
class E:
    """Um texto editável: inglês, português e todos os sítios do site onde o inglês está escrito."""
    def __init__(s, en, locs, only_en=False, leaf=False):
        s.en, s.locs, s.only_en, s.pt, s.email, s.leaf = en, locs, only_en, None, False, leaf


def ent(*ns, only_en=False):
    if len(set(n.en for n in ns)) != 1:
        raise Erro('O mesmo sítio tem textos diferentes de página para página: ' + ' / '.join(sorted(set(n.en for n in ns))))
    return E(ns[0].en, [n.loc for n in ns], only_en, all(n.leaf for n in ns))


class Doc:
    def __init__(s): s.lines, s.refs = [], []
    def w(s, t='', ref=None): s.lines.append(t); s.refs.append(ref)
    def big(s, t): s.w(); s.w(); s.w('#' * 72); s.w('#  ' + t); s.w('#' * 72)
    def sub(s, t): s.w(); s.w('--- ' + t + ' ---')
    def note(s, t): s.w(); s.w('  (' + t + ')')
    def pair(s, label, e):
        s.w(); s.w(label); s.w('  EN: ' + e.en, (e, 'en'))
        if not e.only_en: s.w('  PT: ' + e.pt, (e, 'pt'))
    def lst(s, label, es):
        s.w(); s.w(label + '  (um por linha: inglês | português)')
        for e in es: s.w('  - ' + e.en + ' | ' + e.pt, (e, 'item'))


JS_STR = r"(['\"])((?:\\.|(?!\1).)*)\1"
def js_un(t): return re.sub(r'\\(.)', r'\1', t)
def js_esc(t, q): return t.replace('\\', '\\\\').replace(q, '\\' + q)
def h_esc(t): return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def write_as(t, kind):
    """O texto tal como tem de ficar escrito no sítio onde vai: HTML, atributo, string de JavaScript…"""
    if kind == 'html': return ' <br class="m-br">'.join(h_esc(x.strip()) for x in t.split(BR))
    if kind == 'attr': return h_esc(t).replace('"', '&quot;')
    if kind == 'raw': return t
    if kind.startswith('jshtml'): return js_esc(h_esc(t), kind[6:])     # HTML dentro de uma string de JavaScript
    return js_esc(t, kind[2:])                                           # 'js' + aspa usada na string


class Site:
    def __init__(s, src=None):
        PAGES[:] = pages()
        s.src = src or {f: rd(f) for f in PAGES + ['main.js', 'i18n.js']}
        s.pt = pt_read(s.src['i18n.js'])
        s.P = {f: nodes(f, s.src[f]) for f in PAGES}
        s.all = []
        s.derive = {}   # página de projeto → {'deliv': entregáveis, 'targets': textos que os seguem (cartão das grelhas, título do capítulo)}

    def e(s, x):
        x.pt = canon_br(s.pt.get(key(x.en), x.en)); s.all.append(x); return x

    def main(s, f): return [n for n in s.P[f] if not n.tag('header') and not n.tag('footer')]

    def shared(s, tag):   # header e footer: iguais nas quatro páginas, por isso cada texto tem quatro sítios
        cols = [[n for n in s.P[f] if n.tag(tag)] for f in PAGES]
        if len(set(map(len, cols))) != 1:
            raise Erro('O ' + tag + ' não tem o mesmo número de textos em todas as páginas.')
        return list(zip(*cols))

    def head(s, f):   # título da aba e descrição para o Google
        src = s.src[f]
        t = re.search(r'<title>(.*?)</title>', src, re.S); d = re.search(r'<meta name="description" content="(.*?)"', src, re.S)
        return (s.e(E(html.unescape(norm(t.group(1))), [(f, t.start(1), t.end(1), 'html')])),
                s.e(E(html.unescape(norm(d.group(1))), [(f, d.start(1), d.end(1), 'attr')])))

    def panel(s):   # painel "Talk with us": os textos estão no main.js
        src = s.src['main.js']
        a = src.index('painel de contacto que entra da direita'); b = src.index('Abertura da Home', a)
        def lits(rx, grp=2):
            return [(js_un(m.group(grp)), ('main.js', m.start(grp), m.end(grp), 'js' + m.group(grp - 1))) for m in re.finditer(rx, src[a:b])]
        fix = lambda L: [(t, (f, x + a, y + a, k)) for t, (f, x, y, k) in L]
        tx = fix(lits(r'\btx\(\s*' + JS_STR + r'\s*\)'))
        put = fix(lits(r'\bput\(\s*btnText\s*,\s*' + JS_STR + r'\s*\)'))
        err = fix(lits(r"\bsay\(\s*'error'\s*,\s*" + JS_STR + r'\s*\)'))
        ok = fix(lits(r"\bsay\(\s*'success'\s*,\s*" + JS_STR + r'\s*\)'))
        def arr(name):
            m = re.search(r'const ' + name + r'\s*=\s*\[(.*?)\];', src[a:b], re.S)
            return [(js_un(x.group(2)), ('main.js', a + m.start(1) + x.start(2), a + m.start(1) + x.end(2), 'js' + x.group(1))) for x in re.finditer(JS_STR, m.group(1))]
        if len(tx) < 12 or len(err) < 2 or len(ok) < 1:
            raise Erro('Não reconheço a estrutura do painel de contacto no main.js.')
        names = ['top', 'close', 'title', 'name', 'company', 'email', 'ptype', 'budget', 'message', 'send', 'contact', 'studio']
        d = {k: s.e(E(t, [loc])) for k, (t, loc) in zip(names, tx)}
        sending = None
        for t, loc in put:
            if t == d['send'].en: d['send'].locs.append(loc)
            elif sending is None: sending = s.e(E(t, [loc]))
            elif t == sending.en: sending.locs.append(loc)
        d['sending'] = sending
        d['missing'] = s.e(E(*[x for x in (err[0][0], [err[0][1]])])); d['invalid'] = s.e(E(err[1][0], [err[1][1]])); d['sent'] = s.e(E(ok[0][0], [ok[0][1]]))
        d['types'] = [s.e(E(t, [loc])) for t, loc in arr('types')]; d['budgets'] = [s.e(E(t, [loc])) for t, loc in arr('budgets')]
        return d

    def everywhere(s, x):   # o email: está também nos links mailto: e no painel de contacto
        if not re.match(r'^\S+@\S+\.\S+$', x.en): return
        for f in PAGES + ['main.js']:
            have = [(a, b) for g, a, b, _ in x.locs if g == f]
            for m in re.finditer(re.escape(x.en), s.src[f]):
                if not any(a < m.end() and m.start() < b for a, b in have): x.locs.append((f, m.start(), m.end(), 'raw'))

    def in_panel(s, x):     # a morada: está também escrita no painel de contacto (main.js)
        src = s.src['main.js']
        a = src.index('painel de contacto que entra da direita'); b = src.index('Abertura da Home', a)
        t = js_esc(h_esc(x.en), "'")
        for m in re.finditer(re.escape('<span>' + t + '</span>'), src[a:b]):
            x.locs.append(('main.js', a + m.start() + 6, a + m.end() - 7, "jshtml'"))

    def tiles(s, f):
        """Cartões de projeto de uma grelha: nome, tipo de trabalho, setor. O nome está escrito duas vezes em cada
        cartão (a segunda, com a seta, é a que aparece ao passar o rato), por isso 'name' é uma lista de sítios."""
        out, seen = [], []
        for n in s.main(f):
            u = n.uid('m-tile')
            if u is None: continue
            if u not in seen: seen.append(u); out.append({'name': []})
            t = out[-1]
            if n.cls('m-cap-type'): t['type'] = [n]
            elif n.cls('m-cap-sector'): t['sector'] = [n]
            elif n.cls('m-cap-name') and not n.cls('m-arrow'): t['name'].append(n)
        return out


INTRO_SITE = '''MEAN AGENCY — TEXTOS DO SITE
============================

Este ficheiro tem todo o texto do site, página a página, em inglês (EN) e em
português (PT). Serve para escreveres e corrigires o copy sem mexer no código.

COMO USAR
  1. Muda só o texto que está à frente de "EN:" e de "PT:" (ou, nas listas,
     de cada lado da barra | ).
  2. Guarda (Cmd + S). O site local (http://localhost:8765) atualiza sozinho
     em um ou dois segundos.
  3. Não apagues nem acrescentes linhas, e não mudes as etiquetas (ex.: "Frase de
     apresentação"): é pela posição delas que se sabe onde cada texto vai.
     Cada texto fica numa só linha, por mais comprida que seja.
  4. Se o site não mudar, procura o ficheiro TEXTOS-ERRO.txt nesta pasta: explica
     o que está mal e em que linha.

MUDAR DE LINHA ONDE QUISERES
  Escreve <br> no sítio onde o texto deve passar para a linha de baixo. Exemplo:
     EN: We are a creative agency <br> based in Porto.
     PT: Somos uma agência criativa <br> sediada no Porto.
  O inglês e o português podem partir em sítios diferentes (ou só um deles).
  Vale em ecrãs de computador e tablet; no telemóvel o texto ajusta-se sozinho.
  Dá em títulos, frases e parágrafos; não dá em botões, links com seta, no painel
  de contacto nem nos textos para o Google (aí o ficheiro TEXTOS-ERRO.txt avisa).

NOTAS
  • As alterações ficam só no teu computador até dizeres ao Claude "fecha sessão";
    é aí que vão para o site publicado.
  • O site abre em inglês; o botão PT/EN do topo troca para português.
  • O menu do topo fica sempre em inglês, por isso só tem linha EN.
  • Se o mesmo texto em inglês aparecer em vários sítios, a tradução portuguesa é
    a mesma em todos (o site só guarda uma tradução por texto).
  • "Descrição (aparece nos resultados do Google)" não se vê na página: é o texto
    que o Google mostra por baixo do link do site.
  • Os textos dos projetos estão no ficheiro TEXTOS-PROJETOS.txt.
  • Muitos textos ainda são provisórios (dizem "Placeholder text"): são os que
    falta escrever.'''

INTRO_PROJ = '''MEAN AGENCY — TEXTOS DOS PROJETOS
=================================

Este ficheiro tem o texto dos projetos: o que aparece nas grelhas (Home e Work)
e o que aparece na página de projeto. Em inglês (EN) e em português (PT).

COMO ESTÁ ORGANIZADO
  • PROJETO 01, 02, …: o que aparece nas grelhas da página Work (os 4 primeiros
    aparecem também na Home, em "Featured projects"). Ao passar o rato num
    projeto aparece o nome dele com uma seta.
  • PÁGINA DO PROJETO: o texto da página de cada projeto que já tem página própria.
    Os entregáveis da ficha aparecem sozinhos no cartão das grelhas (tipo de
    trabalho) e no título do capítulo: basta mudá-los na ficha.
  • PÁGINA DE PROJETO: MODELO: a página provisória para onde vão os projetos que
    ainda não têm página.
  • Para um projeto novo, põe as imagens na pasta Projetos/ e pede ao Claude para
    lhe criar a página: passa a ter o seu bloco neste ficheiro.

COMO USAR
  1. Muda só o texto à frente de "EN:" e de "PT:" (ou, nas listas, de cada lado
     da barra | ).
  2. Guarda (Cmd + S). O site local (http://localhost:8765) atualiza sozinho.
  3. Não apagues nem acrescentes linhas, e não mudes as etiquetas. Cada texto
     numa só linha.
  4. Para acrescentar, tirar ou trocar a ordem de projetos, pede ao Claude.
  5. Se o site não mudar, procura o ficheiro TEXTOS-ERRO.txt nesta pasta.
  6. Para mudar de linha num sítio certo, escreve <br> nesse sítio (como está
     explicado no TEXTOS-SITE.txt).

IMAGENS
  As imagens de cada projeto vão para a pasta Projetos/NN-nome-do-projeto/
  (00-capa é a imagem das grelhas; depois 01, 02, … pela ordem em que aparecem
  na página). O site usa estes ficheiros tal como estão, sem os converter.'''


def project_page(s, G, f):
    e = s.e; m = [n for n in s.main(f) if not n.cls('m-arrow') and not n.cls('m-media')]
    own = f not in BASE                                                   # página de um projeto a sério (não o modelo)
    follow = own and sum(1 for n in m if n.el == 'h2.m-label') == 1       # um só capítulo: o título dele segue os entregáveis
    d_ = s.derive.setdefault(f, {'deliv': [], 'targets': []}) if own else None
    t, d = s.head(f)
    G.sub('Para o Google e para a aba do browser'); G.pair('Título da aba', t); G.pair('Descrição (aparece nos resultados do Google)', d)
    G.sub('Abertura')
    cnt = {}; part = 'top'; i = 0
    def nx(k): cnt[k] = cnt.get(k, 0) + 1; return cnt[k]
    def to(name, title):
        nonlocal part
        if part != name: part = name; G.sub(title)
    while i < len(m):
        n = m[i]; el = n.el
        if n.cls('m-pj-bar'):
            if el == 'a.m-pj-back': G.pair('Link para voltar à grelha', e(ent(n)))
            elif el == 'p.m-pj-name': G.pair('Nome no topo da página', e(ent(n)))
            else: G.pair('Link %d da barra (texto)' % nx('link'), e(ent(n)))
        elif el == 'h1.m-pj-statement': G.pair('Frase de abertura', e(ent(n)))
        elif el == 'dt':
            k = nx('row'); G.pair('Ficha, linha %d: etiqueta' % k, e(ent(n))); q = i + 1; vals = []
            while q < len(m) and m[q].tag('dd') and m[q].el != 'dt': vals.append(m[q]); q += 1
            if len(vals) == 1 and vals[0].el == 'dd': G.pair('Ficha, linha %d: valor' % k, e(ent(vals[0])))
            elif vals:
                es = [e(ent(v)) for v in vals]; G.lst('Ficha, linha %d: valores' % k, es)
                if own: d_['deliv'] = es                                   # a lista da ficha são os entregáveis
            i = q - 1
        elif el == 'p.m-pj-lead': to('sum', 'Resumo'); G.pair('Segunda frase (contexto ou resultado)', e(ent(n)))
        elif el == 'p' and n.cls('m-pj-cols'): to('sum', 'Resumo'); G.pair('Resumo, parágrafo %d' % nx('sum'), e(ent(n)))
        elif el == 'h2.m-label':
            part = 'chap'; cnt['par'] = 0; G.sub('Capítulo %d' % nx('chap')); x = e(ent(n))
            if follow: d_['targets'].append(x); G.note('o título do capítulo é sempre a lista de entregáveis da ficha, acima: muda-se lá')
            else: G.pair('Título do capítulo', x)
        elif el == 'p.m-body': G.pair('Parágrafo %d' % nx('par'), e(ent(n)))
        elif el == 'p.m-pj-phrase': G.pair('Frase em destaque', e(ent(n)))
        elif n.cls('m-pj-next'):
            to('end', 'Fundo da página')
            G.pair('Etiqueta do projeto seguinte' if el == 'span.m-label' else 'Nome do projeto seguinte', e(ent(n)))
        i += 1


def build(site):
    """Devolve {ficheiro: Doc} — os dois ficheiros de texto tal como saem do site neste momento."""
    s = site; e = s.e
    one = lambda L, what: L[0] if L else (_ for _ in ()).throw(Erro('Não encontro no site: ' + what))

    # ── TEXTOS-SITE.txt
    D = Doc(); [D.w(l) for l in INTRO_SITE.split('\n')]
    D.big('EM TODAS AS PÁGINAS')
    hd, ft = s.shared('header'), s.shared('footer')
    D.sub('Menu do topo (fica sempre em inglês)')
    for i, r in enumerate([r for r in hd if r[0].cls('nav-links')]): D.pair('Menu %d' % (i + 1), e(ent(*r, only_en=True)))
    D.pair('Botão de contacto (abre o painel "Talk with us")', e(ent(*one([r for r in hd if r[0].cls('nav-cta')], 'botão do header'), only_en=True)))
    D.sub('Rodapé (footer)')
    F = lambda c: [r for r in ft if r[0].cls(c)]
    D.pair('Nome, canto superior esquerdo', e(ent(*one(F('m-foot-name'), 'nome no footer'))))
    for i, r in enumerate(F('m-foot-desc')): D.pair('Descrição, linha %d' % (i + 1), e(ent(*r)))
    D.lst('Lista de páginas', [e(ent(*r)) for r in F('m-foot-nav')])
    blocks = {}
    for r in F('m-foot-block'): blocks.setdefault(r[0].uid('m-foot-block'), []).append(r)
    blocks = list(blocks.values())
    if len(blocks) != 3: raise Erro('O footer devia ter três blocos (contacto, morada, serviços).')
    mail = e(ent(*blocks[0][1], only_en=True)); mail.email = True; s.everywhere(mail)
    addr = e(ent(*blocks[1][1])); s.in_panel(addr)
    D.pair('Título do bloco de contacto', e(ent(*blocks[0][0]))); D.pair('Email de contacto', mail)
    D.pair('Título do bloco da morada', e(ent(*blocks[1][0]))); D.pair('Morada', addr)
    D.pair('Título do bloco de serviços', e(ent(*blocks[2][0]))); D.lst('Serviços', [e(ent(*r)) for r in blocks[2][1:]])
    D.pair('Instagram (texto do link)', e(ent(*one(F('m-foot-social'), 'Instagram no footer'), only_en=True)))
    D.pair('LinkedIn (texto do link)', e(ent(*one(F('m-foot-link'), 'LinkedIn no footer'), only_en=True)))
    p = s.panel()
    D.sub('Painel "Talk with us" (forms de contacto)')
    D.pair('Etiqueta do topo', p['top']); D.pair('Botão de fechar', p['close']); D.pair('Título', p['title'])
    D.pair('Campo: nome', p['name']); D.pair('Campo: empresa (opcional)', p['company']); D.pair('Campo: email', p['email'])
    D.pair('Grupo: tipo de projeto', p['ptype']); D.lst('Opções do tipo de projeto', p['types'])
    D.pair('Grupo: orçamento', p['budget']); D.lst('Opções de orçamento', p['budgets'])
    D.pair('Campo: mensagem', p['message']); D.pair('Botão de enviar', p['send']); D.pair('Botão enquanto envia', p['sending'])
    D.pair('Aviso: faltam campos', p['missing']); D.pair('Aviso: email inválido', p['invalid']); D.pair('Aviso: mensagem enviada', p['sent'])
    D.pair('Título do bloco de contacto', p['contact']); D.pair('Título do bloco da morada', p['studio'])

    def seo(f):
        t, d = s.head(f)
        D.sub('Para o Google e para a aba do browser'); D.pair('Título da aba', t); D.pair('Descrição (aparece nos resultados do Google)', d)
    by = lambda m, el: [n for n in m if n.el == el]

    D.big('HOME  (index.html)'); m = s.main('index.html'); seo('index.html')
    D.sub('Frase de apresentação (logo a seguir à abertura)')
    D.pair('Etiqueta', e(ent(one([n for n in by(m, 'p.m-label') if n.cls('m-statement')], 'etiqueta da frase da Home'))))
    D.pair('Frase de apresentação', e(ent(one(by(m, 'h1.m-statement-text'), 'frase da Home'))))
    D.sub('Projetos em destaque')
    D.pair('Etiqueta', e(ent(one([n for n in by(m, 'h2.m-label') if n.cls('m-featured')], 'etiqueta dos destaques'))))
    D.pair('Link para todos os projetos', e(ent(one([n for n in by(m, 'a.m-link') if n.cls('m-featured')], 'link dos projetos'))))
    D.note('os nomes e descrições dos 4 projetos estão no TEXTOS-PROJETOS.txt')
    D.sub('O que fazemos (versão curta)')
    D.pair('Etiqueta', e(ent(one([n for n in by(m, 'h2.m-label') if n.cls('m-svc')], 'etiqueta dos serviços'))))
    D.pair('Frase', e(ent(one(by(m, 'p.m-svc-lead'), 'frase dos serviços'))))
    for i, (a, b) in enumerate(zip(by(m, 'span.m-svc-name'), by(m, 'span.m-svc-desc'))):
        D.pair('Serviço %d: nome' % (i + 1), e(ent(a))); D.pair('Serviço %d: descrição' % (i + 1), e(ent(b)))

    D.big('WORK  (work.html)'); m = s.main('work.html'); seo('work.html')
    D.sub('Abertura')
    D.pair('Etiqueta', e(ent(one(by(m, 'p.m-label'), 'etiqueta do Work')))); D.pair('Título', e(ent(one(by(m, 'h1.work-lead-title'), 'título do Work'))))
    D.pair('Texto por baixo do título', e(ent(one(by(m, 'p.work-lead-sub'), 'texto do Work'))))
    D.note('os nomes e descrições dos projetos da grelha estão no TEXTOS-PROJETOS.txt')
    D.sub('Fecho da página')
    D.pair('Frase', e(ent(one(by(m, 'h2.m-cta-title'), 'frase final do Work')))); D.pair('Link (abre o painel de contacto)', e(ent(one(by(m, 'a.m-link'), 'link final do Work'))))

    D.big('ABOUT  (about.html)'); m = s.main('about.html'); seo('about.html')
    secs = ['Abertura', 'Clientes', 'O que acreditamos (manifesto)', 'O que fazemos (disciplinas)', 'Testemunhos']
    cnt, i, k = {}, 0, 0
    def nx(key): cnt[key] = cnt.get(key, 0) + 1; return cnt[key]
    while i < len(m):
        n = m[i]; el = n.el
        if el in ('p.m-label', 'h2.m-label'):
            D.sub(secs[k] if k < len(secs) else 'Secção %d' % (k + 1)); k += 1; cnt = {}; D.pair('Etiqueta', e(ent(n)))
        elif el == 'h1.m-ahero-title': D.pair('Título', e(ent(n)))
        elif el == 'p.m-lead': D.pair('Frase grande', e(ent(n)))
        elif el == 'p.m-body': D.pair('Parágrafo %d' % nx('body'), e(ent(n)))
        elif el == 'h3.m-mani-title':
            j = nx('mani'); D.pair('Ponto %02d: título' % j, e(ent(n)))
            if i + 1 < len(m) and m[i + 1].el == 'p.m-mani-text': D.pair('Ponto %02d: texto' % j, e(ent(m[i + 1]))); i += 1
        elif el == 'h3.m-disc-name':
            j = nx('disc'); D.pair('Disciplina %d: nome' % j, e(ent(n))); q = i + 1; items = []
            if q < len(m) and m[q].el == 'p.m-disc-pitch': D.pair('Disciplina %d: frase' % j, e(ent(m[q]))); q += 1
            while q < len(m) and m[q].el == 'li': items.append(e(ent(m[q]))); q += 1
            D.lst('Disciplina %d: serviços' % j, items); i = q - 1
        elif el == 'blockquote':
            j = nx('q'); D.pair('Testemunho %d: citação' % j, e(ent(n)))
            if i + 1 < len(m) and m[i + 1].el == 'strong': D.pair('Testemunho %d: nome' % j, e(ent(m[i + 1]))); i += 1
            if i + 1 < len(m) and m[i + 1].el == 'figcaption': D.pair('Testemunho %d: cargo e empresa' % j, e(ent(m[i + 1]))); i += 1
        elif el == 'h2.m-cta-title': D.sub('Fecho da página'); D.pair('Frase', e(ent(n)))
        elif el == 'a.m-link': D.pair('Link (abre o painel de contacto)', e(ent(n)))
        i += 1
    D.w()

    # ── TEXTOS-PROJETOS.txt
    G = Doc(); [G.w(l) for l in INTRO_PROJ.split('\n')]
    work, home = s.tiles('work.html'), s.tiles('index.html')
    hrefs = re.findall(r'<a class="m-tile[^"]*" href="([^"]+)"', s.src['work.html'])     # para onde vai cada cartão
    for i, t in enumerate(work):
        G.big('PROJETO %02d' % (i + 1) + ('  (em destaque na Home)' if i < len(home) else ''))
        G.sub('Nas grelhas (Home e Work)')
        both = lambda key: e(ent(*(t[key] + (home[i][key] if i < len(home) else []))))
        G.pair('Nome', both('name')); typ = both('type')
        page = hrefs[i] if i < len(hrefs) and hrefs[i] in PAGES[len(BASE):] else None
        if page:   # projeto com página própria: o tipo de trabalho do cartão é a lista de entregáveis dessa página
            s.derive.setdefault(page, {'deliv': [], 'targets': []})['targets'].append(typ)
            G.note('o tipo de trabalho do cartão é sempre a lista de entregáveis da página do projeto: muda-se lá')
        else: G.pair('Tipo de trabalho', typ)
        G.pair('Setor', both('sector'))
    order = re.findall(r'href="(projeto-[\w-]+\.html)"', s.src['work.html'])       # pela ordem em que estão no Work
    for f in sorted(PAGES[len(BASE):], key=lambda f: (order.index(f) if f in order else len(order), f)):
        G.big('PÁGINA DO PROJETO: ' + next((n.en for n in s.main(f) if n.el == 'p.m-pj-name'), f) + '  (' + f + ')')
        project_page(s, G, f)
    G.big('PÁGINA DE PROJETO: MODELO  (projeto.html, para onde vão os projetos que ainda não têm página)')
    project_page(s, G, 'projeto.html')
    G.w()
    return {F_SITE: D, F_PROJ: G}


# ───────────────────────────── comparar e aplicar ─────────────────────────────
def body(lines):   # a parte editável começa na primeira linha de cardinais; o texto de instruções pode ser mudado à vontade
    L = [l.rstrip() for l in lines]
    while L and not L[-1]: L.pop()
    at = next((i for i, l in enumerate(L) if l.startswith('####')), len(L))
    return at, L[at:]


def shape(line):
    if not line.strip(): return ''
    if re.match(r'\s*EN\s*:', line): return 'EN'
    if re.match(r'\s*PT\s*:', line): return 'PT'
    if re.match(r'\s*-\s', line): return '-'
    return 't'


def parse(kind, line, n, f):
    if kind in ('en', 'pt'):
        m = re.match(r'^\s*' + kind.upper() + r'\s*:(.*)$', line)
        if not m: raise Erro('%s, linha %d: esta linha tem de começar por "%s:".\n    está: %s' % (f, n, kind.upper(), line.strip()))
        return (canon_br(norm(m.group(1))),)
    m = re.match(r'^\s*-\s+(.*?)\s*\|\s*(.*?)\s*$', line)
    if not m: raise Erro('%s, linha %d: nas listas cada linha é "- inglês | português" (falta a barra | ).\n    está: %s' % (f, n, line.strip()))
    return (canon_br(norm(m.group(1))), canon_br(norm(m.group(2))))


def line_of(kind, vals):   # a linha tal como fica no ficheiro de texto
    return '  - %s | %s' % vals if kind == 'item' else '  %s: %s' % (kind.upper(), vals[0])


def check_shape(f, u0, user, canon, refs):
    want = [{'en': 'EN', 'pt': 'PT', 'item': '-'}[r[1]] if r else shape(c) for c, r in zip(canon, refs)]
    got = [shape(l) for l in user]
    if got == want: return
    tag, i1, i2, j1, j2 = next(o for o in difflib.SequenceMatcher(None, want, got, autojunk=False).get_opcodes() if o[0] != 'equal')
    show = lambda l: l.strip() or '(linha em branco)'
    if tag == 'insert':
        msg = 'linha %d: há uma linha a mais:\n    %s\n  Cada texto fica numa só linha (não carregues em Enter a meio de um texto) e não se podem acrescentar linhas.' % (u0 + j1 + 1, show(user[j1]))
    elif tag == 'delete':
        msg = 'falta uma linha a seguir à linha %d. Devia lá estar:\n    %s' % (u0 + j1, show(canon[i1]))
    else:
        msg = 'linha %d: esta linha devia ser como\n    %s\n  mas está\n    %s' % (u0 + j1 + 1, show(canon[i1]), show(user[j1]))
    raise Erro(f + ', ' + msg + '\n  (as linhas e as etiquetas têm de ficar onde estão; só se muda o texto à frente de "EN:", de "PT:" e dos dois lados da barra | )')


def bump(src_by_file):
    rx = re.compile(r'((?:style\.css|i18n\.js|main\.js|motion\.js)\?v=)(\d+)')
    htmls = [f for f in src_by_file if f.endswith('.html')]          # todas as páginas ficam com o mesmo número
    cur = max([int(m.group(2)) for f in htmls for m in rx.finditer(src_by_file[f])] or [0])
    for f in htmls: src_by_file[f] = rx.sub(lambda m: m.group(1) + str(cur + 1), src_by_file[f])
    return cur + 1


def write_err(msg):
    open(path(F_ERR), 'w', encoding='utf-8').write(
        'OS TEXTOS NÃO FORAM APLICADOS AO SITE\n=====================================\n\n' + msg +
        '\n\nCorrige o ficheiro de texto e guarda outra vez (Cmd + S). Este aviso desaparece sozinho quando estiver tudo bem.\n'
        'Se não conseguires perceber o problema, diz ao Claude: "vê o TEXTOS-ERRO".\n')


def snapshot(files):
    os.makedirs(STATE, exist_ok=True)
    for f in files:
        if os.path.exists(path(f)): shutil.copyfile(path(f), os.path.join(STATE, f))


def aplicar(log=print):
    """Passa para o site o que mudou nos ficheiros de texto. Devolve (n.º de textos alterados, lista de erros).
    Um ficheiro com erro não trava o outro: aplica-se o que estiver bem e o erro fica escrito em TEXTOS-ERRO.txt."""
    errs = []
    try: n = _aplicar(log, errs)
    except Erro as x: n = 0; errs.append(str(x))
    if errs:
        write_err('\n\n'.join(errs))
        for x in errs: log('ERRO: ' + x)
    elif os.path.exists(path(F_ERR)): os.remove(path(F_ERR))
    return n, errs


def _aplicar(log, errs):
    site = Site(); docs = build(site)
    changes = {}    # entrada -> {'en': novo, 'pt': novo, 'where': 'ficheiro, linha N'}
    lines_changed = []   # (ficheiro, índice no corpo, linha do utilizador)
    present = []
    for f, doc in docs.items():
        if not os.path.exists(path(f)): continue
        try:
            user_all = rd(f).split('\n')
            u0, user = body(user_all); c0, canon = body(doc.lines); refs = doc.refs[c0:]
            check_shape(f, u0, user, canon, refs)
            for i, (u, ref) in enumerate(zip(user, refs)):
                if ref: parse(ref[1], u, u0 + i + 1, f)
        except Erro as x:
            errs.append(str(x)); continue             # este ficheiro fica de fora; o outro aplica-se na mesma
        present.append(f)
        base = None
        bp = os.path.join(STATE, f)
        if os.path.exists(bp):
            _, b = body(open(bp, encoding='utf-8').read().split('\n'))
            if len(b) == len(canon): base = b
        if base is None: base = canon
        for i, (u, c, b, ref) in enumerate(zip(user, canon, base, refs)):
            n = u0 + i + 1
            if ref is None or u == b: continue       # etiqueta, ou linha em que o utilizador não tocou
            ent_, kind = ref; vals = parse(kind, u, n, f)
            ch = changes.setdefault(ent_, {'where': '%s, linha %d' % (f, n)})
            if kind == 'item': ch['en'], ch['pt'] = vals
            else: ch[kind] = vals[0]
            lines_changed.append((f, i, u))
    # só o que é mesmo diferente do que o site já diz
    todo = []
    for x, ch in changes.items():
        en = ch.get('en', x.en); ptv = ch.get('pt', x.pt if not x.only_en else None)
        if not en: raise Erro(ch['where'] + ': o texto em inglês está vazio. Para tirar um texto do site, pede ao Claude.')
        if x.email and not re.match(r'^[^\s@<>"\']+@[^\s@<>"\']+\.[^\s@<>"\']+$', en): raise Erro(ch['where'] + ': "%s" não parece um endereço de email.' % en)
        if not x.only_en and not ptv: ptv = en
        if BR in en or (ptv and BR in ptv):
            if not (x.leaf and all(k == 'html' for _, _, _, k in x.locs)):
                raise Erro(ch['where'] + ': este texto não pode ter quebras de linha (<br>). Só dá nos textos das páginas que estão sozinhos no seu bloco (títulos, frases, parágrafos); não dá em botões, links com seta, no painel de contacto nem nos textos para o Google.')
            if x.only_en: raise Erro(ch['where'] + ': o menu do topo não pode ter quebras de linha (<br>).')
        if en != x.en or (not x.only_en and ptv != x.pt): todo.append((x, en, ptv, ch['where']))
    # textos que seguem outros: o cartão das grelhas e o título do capítulo repetem os entregáveis do projeto
    now = {x: (en, ptv) for x, en, ptv, where in todo}
    for f, d in site.derive.items():
        if not d['deliv']: continue
        en = ', '.join(now.get(x, (x.en, x.pt))[0] for x in d['deliv']); ptv = ', '.join(now.get(x, (x.en, x.pt))[1] for x in d['deliv'])
        for x in d['targets']:
            if x not in now and (en != x.en or ptv != x.pt): todo.append((x, en, ptv, 'automático, pelos entregáveis de ' + f))
    if not todo:
        snapshot(present); return 0
    # o mesmo inglês com duas traduções diferentes: o site só guarda uma
    seen = {}
    for x, en, ptv, where in todo:
        if x.only_en: continue
        k = key(en)
        if k in seen and seen[k][0] != ptv:
            raise Erro('O texto em inglês "%s" tem duas traduções diferentes:\n    %s: %s\n    %s: %s\n  O site só guarda uma tradução por texto: põe a mesma nos dois sítios.' % (k, seen[k][1], seen[k][0], where, ptv))
        seen[k] = (ptv, where)
    # 1) trocar o inglês nos ficheiros (do fim para o princípio, para as posições não se desviarem)
    new = dict(site.src); reps = {}
    for x, en, ptv, where in todo:
        if en == x.en: continue
        for f, a, b, kind in x.locs:
            reps.setdefault(f, []).append((a, b, write_as(en, kind)))
    for f, L in reps.items():
        src = new[f]
        for a, b, txt in sorted(L, reverse=True): src = src[:a] + txt + src[b:]
        new[f] = src
    # 2) dicionário de português
    i18 = new['i18n.js']
    blob = html.unescape(re.sub(r'\s*<br\s+class="m-br"\s*/?>\s*', ' ', ''.join(new[f] for f in PAGES + ['main.js'])))
    used = lambda t: t in blob or js_esc(t, "'") in blob or js_esc(t, '"') in blob
    for x, en, ptv, where in todo:
        if x.only_en: continue
        k, k0 = key(en), key(x.en)                                   # a chave é a frase sem as quebras de linha
        if ptv != en: i18 = pt_set(i18, k, ptv, after=k0)            # chave nova logo a seguir à antiga (ou atualiza a que já existe)
        elif k in pt_read(i18): i18 = pt_del(i18, k)                 # português igual ao inglês: não precisa de tradução
        if k != k0 and not used(k0): i18 = pt_del(i18, k0)           # o inglês antigo já não aparece em lado nenhum do site
    new['i18n.js'] = i18
    # 3) verificar antes de gravar
    for f in PAGES:
        if tags(new[f]) != tags(site.src[f]): raise Erro('Segurança: a troca de textos ia mexer na estrutura de ' + f + '. Não gravei nada. (' + todo[0][3] + ')')
    site2 = Site(dict(new)); docs2 = build(site2)
    for f, i, u in lines_changed:
        c0, canon2 = body(docs2[f].lines); kind = docs2[f].refs[c0 + i][1]
        vals = parse(kind, u, 0, f)
        if kind != 'en' and not vals[-1]: vals = vals[:-1] + (docs2[f].refs[c0 + i][0].en,)     # português vazio = igual ao inglês
        if canon2[i] != line_of(kind, vals):
            raise Erro('Segurança: depois da troca o site não ficava a dizer o que está no ficheiro (%s, linha %d).\n    ficheiro: %s\n    site:     %s\n  Não gravei nada. Diz ao Claude: "vê o TEXTOS-ERRO".' % (f, body(rd(f).split('\n'))[0] + i + 1, line_of(kind, vals).strip(), canon2[i].strip()))
    if shutil.which('node'):
        for f in ('main.js', 'i18n.js'):
            r = subprocess.run(['node', '-e', 'new Function(require("fs").readFileSync(0,"utf8"))'], input=new[f].encode('utf-8'), capture_output=True)
            if r.returncode: raise Erro('Segurança: ' + f + ' ficava com um erro de JavaScript. Não gravei nada.')
    v = bump(new)
    for f, src in new.items():
        if src != site.src[f]: wr(f, src)
    snapshot(present)
    for x, en, ptv, where in todo:
        log('  ' + where + ': ' + (('"%s" → "%s"' % (x.en, en)) if en != x.en else ('PT de "%s" → "%s"' % (en, ptv))))
    log('%d texto(s) aplicado(s) ao site (v=%d).' % (len(todo), v))
    return len(todo)


def gerar(so=None, log=print):
    """Volta a escrever os ficheiros de texto a partir do site. ATENÇÃO: apaga o que neles estiver por aplicar."""
    docs = build(Site()); done = []
    for f, doc in docs.items():
        if so and f not in so: continue
        open(path(f), 'w', encoding='utf-8').write('\n'.join(doc.lines).rstrip('\n') + '\n'); done.append(f)
        log('%s: %d linhas, %d textos' % (f, len(doc.lines), sum(1 for r in doc.refs if r and r[1] in ('en', 'item'))))
    snapshot(done)
    if os.path.exists(path(F_ERR)): os.remove(path(F_ERR))


def atualizar(log=print):
    """Para quando o site mudou por outra via (o Claude ou o sócio mexeram nas páginas): aplica o que estiver por
    aplicar e volta a escrever os ficheiros de texto a partir do site. Se um ficheiro tiver alterações que não se
    conseguem aplicar, não lhe toca e avisa."""
    said = []; n, errs = aplicar(said.append)
    for line in said:
        if not line.startswith('ERRO'): log(line)      # um erro de estrutura é o esperado aqui; se impedir de atualizar, avisa-se abaixo
    docs = build(Site()); ok = []
    for f, doc in docs.items():
        if os.path.exists(path(f)):
            user = body(rd(f).split('\n'))[1]; canon = body(doc.lines)[1]; bp = os.path.join(STATE, f)
            snap = body(open(bp, encoding='utf-8').read().split('\n'))[1] if os.path.exists(bp) else None
            same_shape = len(user) == len(canon) and all(shape(u) == shape(c) for u, c in zip(user, canon))
            if not same_shape and user != snap:      # estrutura diferente e linhas mexidas desde a última aplicação
                log('NÃO ATUALIZEI ' + f + ': tem alterações por aplicar e a estrutura do site mudou. Vê as diferenças à mão.'); continue
        ok.append(f)
    if ok: gerar(ok, log)
    return ok


def instrucoes(log=print):
    """Atualiza só o texto de instruções do topo dos ficheiros; os textos do site ficam como o utilizador os tem."""
    for f, doc in build(Site()).items():
        if not os.path.exists(path(f)): continue
        user = rd(f).split('\n'); u0, _ = body(user); c0, _ = body(doc.lines)
        if user[:u0] != doc.lines[:c0]:
            open(path(f), 'w', encoding='utf-8').write('\n'.join(doc.lines[:c0] + user[u0:]).rstrip('\n') + '\n'); log(f + ': instruções atualizadas')


if __name__ == '__main__':
    try:
        if len(sys.argv) > 1 and sys.argv[1] == 'gerar': gerar(sys.argv[2:] or None)
        elif len(sys.argv) > 1 and sys.argv[1] == 'instrucoes': instrucoes()
        elif len(sys.argv) > 1 and sys.argv[1] == 'atualizar': atualizar()
        else:
            n, errs = aplicar()
            if n == 0 and not errs: print('Nada para aplicar: o site já diz o que está nos ficheiros de texto.')
            sys.exit(1 if errs else 0)
    except Erro as x:
        print('ERRO: ' + str(x)); sys.exit(1)
