"""Converte <img src="/assets/.../nome.jpg"> em <picture> responsivo (AVIF, WebP, JPG) e ajusta posters/logos.
Idempotente: ignora imagens que já estão dentro de <picture>.  Uso: python tools/picturize.py
"""
import os, re
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, 'site')
HTMLS = ['index.html', 'links/index.html', 'entregaveis/index.html']

WIDTHS = {  # largura disponível por imagem (ver tools/images.py)
    'thiago-consultorio': [360, 540, 720], 'thiago-sobre': [360, 540, 720], 'avaliacao-laptop': [360, 540, 720],
    'feedback-paciente': [560, 1000], 'perfil': [120, 240],
}
for n in ('post-nutricao-saude-estetica', 'post-nutricao-para-quem-busca', 'post-avaliacoes', 'post-estetica',
          'post-3-licoes', 'post-prato-equilibrado', 'post-lanche-escola', 'post-objetivo-unico'):
    WIDTHS[n] = [300, 500, 720]
for n in ('primeira-consulta', 'rotina-real', 'novembro-sem-listas', 'outubro-rosa', 'whey-receitas', 'palestra'):
    WIDTHS[n] = [220, 400, 540]
SIZES = {
    'thiago-consultorio': '(max-width:860px) 250px, 400px', 'thiago-sobre': '(max-width:860px) 240px, 420px',
    'avaliacao-laptop': '(max-width:860px) 240px, 380px', 'feedback-paciente': '(max-width:860px) 100vw, 640px',
    'perfil': '120px',
}
for n in list(WIDTHS):
    if n.startswith('post-'): SIZES[n] = '250px'
for n in ('primeira-consulta', 'rotina-real', 'novembro-sem-listas', 'outubro-rosa', 'whey-receitas', 'palestra'):
    SIZES[n] = '(max-width:860px) 220px, 200px'


def mid(name):
    w = WIDTHS[name]; return w[len(w) // 2]


def pic(m):
    pre, folder, name, post = m.group(1), m.group(2), m.group(3), m.group(4)
    if name not in WIDTHS: return m.group(0)
    attrs = (pre + ' ' + post).strip()
    ws = WIDTHS[name]; base = f'/assets/{folder}/{name}'
    def ss(ext): return ', '.join(f'{base}-{w}.{ext} {w}w' for w in ws)
    szs = SIZES[name]
    if 'decoding=' not in attrs: attrs += ' decoding="async"'
    if 'width=' not in attrs:
        im = Image.open(os.path.join(SITE, 'assets', folder, f'{name}-{mid(name)}.jpg'))
        attrs += f' width="{im.width}" height="{im.height}"'
    attrs = re.sub(r'\s+', ' ', attrs).strip()
    return (f'<picture><source type="image/avif" srcset="{ss("avif")}" sizes="{szs}">'
            f'<source type="image/webp" srcset="{ss("webp")}" sizes="{szs}">'
            f'<img src="{base}-{mid(name)}.jpg" {attrs}></picture>')


for h in HTMLS:
    p = os.path.join(SITE, h); s = open(p, encoding='utf-8').read()
    s2 = s
    # aplica só fora de <picture> (idempotente)
    out = []
    for part in re.split(r'(<picture>.*?</picture>)', s2, flags=re.S):
        if part.startswith('<picture>'): out.append(part); continue
        out.append(re.sub(r'<img((?:(?!src=)[^>])*)src="/assets/(img|video)/([a-z0-9-]+)\.jpg"([^>]*)>', pic, part))
    s2 = ''.join(out)
    # posters do player e metadados
    s2 = re.sub(r'data-poster="/assets/video/([a-z0-9-]+)\.jpg"', r'data-poster="/assets/video/\1-540.webp"', s2)
    s2 = s2.replace('/assets/img/post-objetivo-unico.jpg', '/assets/img/post-objetivo-unico-720.jpg')
    # logos PNG -> SVG
    s2 = s2.replace('/assets/img/logo-mark-gold-640.png', '/assets/img/logo-mark-gold.svg').replace('/assets/img/logo-mark-green-640.png', '/assets/img/logo-mark-green.svg')
    open(p, 'w', encoding='utf-8').write(s2)
    print(h, 'pictures:', s2.count('<picture>'))
