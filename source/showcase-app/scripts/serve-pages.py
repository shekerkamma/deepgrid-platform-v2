# Serves a Pages artifact under its base path the way GitHub Pages does: /x -> x.html (before x/),
# /x/ -> x/index.html. python3 -m http.server does not, so it 404s every route and the gate fails.
import http.server, os, sys, functools
root, base, port = sys.argv[1], sys.argv[2].strip('/'), int(sys.argv[3])
class H(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = path.split('?')[0].split('#')[0]
        if p.startswith('/' + base): p = p[len(base) + 1:]
        f = os.path.join(root, p.lstrip('/'))
        if not os.path.isfile(f) and os.path.isfile(f + '.html'): f += '.html'   # Pages: x.html before x/
        elif os.path.isdir(f): f = os.path.join(f, 'index.html')
        return f
    def log_message(self, *a): pass
http.server.ThreadingHTTPServer(('127.0.0.1', port), H).serve_forever()
