#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MEAN — servidor local do site: http://localhost:8765

    python3 ferramentas/servidor-local.py [porta] [pasta de uma cópia do site, só para testes]

Faz três coisas que o "python3 -m http.server" não faz:
  1. Vigia TEXTOS-SITE.txt e TEXTOS-PROJETOS.txt. Quando um deles é guardado, passa as alterações para o
     site (ferramentas/textos.py). Ao arrancar também aplica o que tiver ficado por aplicar.
  2. Recarrega sozinho as páginas abertas quando um ficheiro do site muda (HTML, CSS ou JS). Para isso
     junta um pequeno script às páginas que serve; esse script NÃO está nos ficheiros, só existe aqui.
     Se os textos tiverem um erro, o aviso aparece no fundo da página (e em TEXTOS-ERRO.txt).
  3. Serve os ficheiros sem cache e aceita pedidos parciais (Range), de que o Safari precisa para o vídeo.

Só responde a este computador (localhost). Fecha-se com Ctrl + C ou fechando a janela do Terminal.
"""
import os, re, sys, json, time, socket, threading, traceback
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
if len(sys.argv) > 2: os.environ['MEAN_SITE'] = sys.argv[2]   # só para testes: servir uma cópia do site noutra pasta
import textos  # noqa: E402

ROOT = textos.ROOT

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
TXT = [textos.F_SITE, textos.F_PROJ]
state = {'v': '', 'erro': ''}   # v = carimbo da última gravação do site (texto, para o browser não o arredondar)


def log(msg):
    print(time.strftime('%H:%M:%S ') + msg, flush=True)


def mtime(p):
    try: return os.stat(p).st_mtime_ns
    except OSError: return 0


def site_stamp():   # muda sempre que um HTML, CSS ou JS da pasta do site é gravado
    return str(max([mtime(e.path) for e in os.scandir(ROOT) if e.name.endswith(('.html', '.css', '.js'))] or [0]))


def watch():
    seen, last = None, None
    while True:
        try:
            cur = [mtime(os.path.join(ROOT, f)) for f in TXT]
            if cur != seen:
                time.sleep(.15)                                    # deixa o editor acabar de gravar
                if [mtime(os.path.join(ROOT, f)) for f in TXT] == cur:
                    seen = cur
                    n, errs = textos.aplicar(log)
                    state['erro'] = '\n\n'.join(errs)
            raw = site_stamp()
            if raw == last: state['v'] = raw                       # só anuncia a mudança quando os ficheiros assentam
            last = raw
        except Exception as x:                                     # um erro aqui não pode deitar o servidor abaixo
            state['erro'] = 'Erro inesperado ao aplicar os textos: %s\nDiz ao Claude: "vê o servidor local".' % x
            log(traceback.format_exc())
        time.sleep(.3)


LIVE = """<script data-mean-local>/* Só no servidor local: recarrega a página quando o site muda e mostra erros dos ficheiros de texto. */
(function(){var v='__V__',box=null;
function show(t){if(!t){if(box){box.remove();box=null}return}
if(!box){box=document.createElement('pre');box.setAttribute('data-i18n-skip','');box.style.cssText='position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483647;margin:0;padding:16px 20px;border-radius:14px;background:#531316;color:#fff;font:13px/1.5 ui-monospace,Menlo,monospace;white-space:pre-wrap;max-height:60vh;overflow:auto;box-shadow:0 10px 40px rgba(0,0,0,.35)';document.body.appendChild(box)}
box.textContent=t}
function tick(){fetch('/__mean/estado',{cache:'no-store'}).then(function(r){return r.json()}).then(function(s){
show(s.erro?'TEXTOS: há um erro, por isso o site não mudou\\n\\n'+s.erro+'\\n\\nCorrige o ficheiro e guarda outra vez (Cmd + S).':'');
if(s.v!==v){location.reload();return}
setTimeout(tick,500)}).catch(function(){setTimeout(tick,1500)})}
tick()})();</script>
"""


class Handler(SimpleHTTPRequestHandler):
    left = None   # bytes que faltam enviar num pedido parcial

    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def log_message(self, fmt, *args):
        if args and str(args[1] if len(args) > 1 else '').startswith(('4', '5')): log(fmt % args)   # só os erros

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def send_bytes(self, body, ctype):
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        if self.command != 'HEAD': self.wfile.write(body)

    def do_GET(self):
        if self.path.split('?')[0] == '/__mean/estado':
            return self.send_bytes(json.dumps(state).encode('utf-8'), 'application/json')
        p = self.translate_path(self.path)
        if os.path.isdir(p): p = os.path.join(p, 'index.html')
        if p.endswith('.html') and os.path.isfile(p):
            live = LIVE.replace('__V__', state['v'])               # a página sabe com que versão do site foi servida
            src = open(p, encoding='utf-8').read()
            i = src.rfind('</body>')
            return self.send_bytes((src[:i] + live + src[i:] if i >= 0 else src + live).encode('utf-8'), 'text/html; charset=utf-8')
        super().do_GET()

    def send_head(self):
        self.left = None
        p = self.translate_path(self.path)
        m = re.match(r'bytes=(\d*)-(\d*)$', (self.headers.get('Range') or '').strip())
        if not (m and (m.group(1) or m.group(2)) and os.path.isfile(p)):
            return super().send_head()
        size = os.path.getsize(p)
        if m.group(1): start = int(m.group(1)); end = min(int(m.group(2)), size - 1) if m.group(2) else size - 1
        else: start = max(0, size - int(m.group(2))); end = size - 1
        if start >= size or start > end:
            self.send_response(416); self.send_header('Content-Range', 'bytes */%d' % size); self.end_headers(); return None
        f = open(p, 'rb'); f.seek(start); self.left = end - start + 1
        self.send_response(206)
        self.send_header('Content-Type', self.guess_type(p))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Range', 'bytes %d-%d/%d' % (start, end, size))
        self.send_header('Content-Length', str(self.left))
        self.send_header('Last-Modified', self.date_time_string(os.path.getmtime(p)))
        self.end_headers()
        return f

    def copyfile(self, source, out):
        if self.left is None: return super().copyfile(source, out)
        while self.left > 0:
            chunk = source.read(min(65536, self.left))
            if not chunk: break
            out.write(chunk); self.left -= len(chunk)


class V6(ThreadingHTTPServer):
    address_family = socket.AF_INET6


def main():
    servers = []
    for cls, host in ((ThreadingHTTPServer, '127.0.0.1'), (V6, '::1')):
        try: servers.append(cls((host, PORT), Handler))
        except OSError as x:
            if host == '127.0.0.1':
                print('Não consegui ligar o site local na porta %d: %s\nJá deve haver um servidor aberto nessa porta. '
                      'Fecha-o (ou a outra janela do Terminal) e tenta outra vez.' % (PORT, x)); sys.exit(1)
    state['v'] = site_stamp()
    threading.Thread(target=watch, daemon=True).start()
    for s in servers[1:]: threading.Thread(target=s.serve_forever, daemon=True).start()
    log('Site local em http://localhost:%d  (a vigiar %s)' % (PORT, ' e '.join(TXT)))
    try: servers[0].serve_forever()
    except KeyboardInterrupt: log('Site local desligado.')


if __name__ == '__main__':
    main()
