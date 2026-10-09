"""Verifica links quebrados (src, href, srcset, preload, data-video/poster) e arquivos não usados em site/assets.
Uso: python tools/check.py
"""
import glob, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'site')
PAGES = ['index.html', 'links/index.html', 'entregaveis/index.html']
read = lambda p: open(p, encoding='utf-8').read()


def refs(s):
    out = set()
    for m in re.finditer(r'(?:src|href|data-video|data-poster|imagesrcset|srcset)="([^"]+)"', s):
        for part in m.group(1).split(','):
            u = part.strip().split(' ')[0]
            if u.startswith('/assets/'):
                out.add(u.split('?')[0])
    return out


html = {h: read(os.path.join(SITE, h)) for h in PAGES}
broken, total = [], 0
for h, s in html.items():
    for u in refs(s):
        total += 1
        if not os.path.exists(os.path.join(SITE, u.lstrip('/'))):
            broken.append((h, u))
print(f'referências: {total} | quebradas: {broken or "nenhuma"}')

code = ''.join(read(f) for f in glob.glob(os.path.join(SITE, 'assets', '*', '*.css')) + glob.glob(os.path.join(SITE, 'assets', 'js', '*.js')))
alltext = ''.join(html.values()) + code
unused, size = [], 0
for root, _, files in os.walk(os.path.join(SITE, 'assets')):
    for f in files:
        full = os.path.join(root, f)
        rel = '/' + os.path.relpath(full, SITE).replace(os.sep, '/')
        if rel not in alltext and f not in alltext:
            unused.append(rel); size += os.path.getsize(full)
print(f'não referenciados: {len(unused)} arquivos, {size/1024:.0f} KB')
for u in unused: print('  ', u)
tot = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(SITE) for f in fs)
print(f'peso total de site/: {tot/1048576:.1f} MB')
