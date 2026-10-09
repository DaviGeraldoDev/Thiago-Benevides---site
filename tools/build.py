"""Build do site: junta e minifica CSS/JS, gera nomes com hash (cache longo) e atualiza o HTML.

Fontes:  design-system/tokens.css, components.css, motion.js  +  src/css/fonts.css, site.css  +  src/js/site.js
Saída:   site/assets/css/app.<hash>.css  (home e entregáveis)   base.<hash>.css (links)
         site/assets/js/app.<hash>.js (motion + site)          motion.<hash>.js (links)
Uso:     python tools/build.py
"""
import glob, hashlib, os, re
import rcssmin, rjsmin

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd = lambda *p: open(os.path.join(ROOT, *p), encoding='utf-8').read()
SITE = os.path.join(ROOT, 'site')

bundles = {
    ('css', 'app'):    rd('src/css/fonts.css') + rd('design-system/tokens.css') + rd('design-system/components.css') + rd('src/css/site.css'),
    ('css', 'base'):   rd('src/css/fonts.css') + rd('design-system/tokens.css') + rd('design-system/components.css'),
    ('js', 'app'):     rd('design-system/motion.js') + ';\n' + rd('src/js/site.js'),
    ('js', 'motion'):  rd('design-system/motion.js'),
}
names = {}
for (kind, name), src in bundles.items():
    out = rcssmin.cssmin(src) if kind == 'css' else rjsmin.jsmin(src)
    h = hashlib.sha1(out.encode()).hexdigest()[:8]
    d = os.path.join(SITE, 'assets', kind)
    for old in glob.glob(os.path.join(d, f'{name}.*.{kind}')): os.remove(old)
    fn = f'{name}.{h}.{kind}'
    open(os.path.join(d, fn), 'w', encoding='utf-8').write(out)
    names[(kind, name)] = fn
    print(f'{kind}/{fn}: {len(src)/1024:.1f} KB -> {len(out.encode())/1024:.1f} KB')

# HTML: aponta para os arquivos com hash
use = {'index.html': ('app', 'app'), 'entregaveis/index.html': ('app', 'motion'), 'links/index.html': ('base', 'motion')}
for h, (css, js) in use.items():
    p = os.path.join(SITE, h); s = open(p, encoding='utf-8').read()
    s = re.sub(r'/assets/css/(?:app|base|tokens|components|site)(?:\.[0-9a-f]{8})?\.css', '/assets/css/' + names[('css', css)], s, count=1)
    # remove folhas extras antigas (tokens/components/site) que sobraram no <head>
    s = re.sub(r'<link rel="stylesheet" href="/assets/css/(?:tokens|components|site)\.css">\n?', '', s)
    s = re.sub(r'/assets/js/(?:app|motion|site)(?:\.[0-9a-f]{8})?\.js', '/assets/js/' + names[('js', js)], s)
    # em páginas que carregavam motion.js e site.js separados, mantém só um script
    s = re.sub(r'(<script src="/assets/js/[^"]+" defer></script>)\n<script src="/assets/js/[^"]+" defer></script>', r'\1', s)
    open(p, 'w', encoding='utf-8').write(s)
print('HTML atualizado:', ', '.join(use))
