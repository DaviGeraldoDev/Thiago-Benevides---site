"""Gera as versões responsivas das imagens do site (AVIF + WebP + JPG).

Originais ficam em _fontes/site-originais/ (fora do site). Saída em site/assets/img e site/assets/video.
Uso:  python tools/images.py
"""
import os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIG = os.path.join(ROOT, '_fontes', 'site-originais')
IMG = os.path.join(ROOT, 'site', 'assets', 'img')
VID = os.path.join(ROOT, 'site', 'assets', 'video')

# nome -> (pasta de saída, larguras, qualidade avif/webp/jpg)
SPEC = {}
for n in ('thiago-consultorio', 'thiago-sobre', 'avaliacao-laptop'):
    SPEC[n] = (IMG, [360, 540, 720], (48, 70, 76))
for n in ('post-nutricao-saude-estetica', 'post-nutricao-para-quem-busca', 'post-avaliacoes', 'post-estetica',
          'post-3-licoes', 'post-prato-equilibrado', 'post-lanche-escola', 'post-objetivo-unico'):
    SPEC[n] = (IMG, [300, 500, 720], (46, 68, 74))
SPEC['feedback-paciente'] = (IMG, [560, 1000], (50, 72, 78))
SPEC['perfil'] = (IMG, [120, 240], (50, 72, 80))
for n in ('primeira-consulta', 'rotina-real', 'novembro-sem-listas', 'outubro-rosa', 'whey-receitas', 'palestra'):
    SPEC[n] = (VID, [220, 400, 540], (46, 68, 74))


def find(n):
    for ext in ('jpg', 'png'):
        p = os.path.join(ORIG, f'{n}.{ext}')
        if os.path.exists(p):
            return p
    raise FileNotFoundError(n)


total_in = total_out = 0
for name, (outdir, widths, (qa, qw, qj)) in SPEC.items():
    src = find(name)
    im = Image.open(src).convert('RGB')
    total_in += os.path.getsize(src)
    for w in widths:
        if w > im.width:
            continue
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        for ext, kw in (('avif', dict(quality=qa, speed=4)), ('webp', dict(quality=qw, method=6)),
                        ('jpg', dict(quality=qj, optimize=True, progressive=True))):
            if ext == 'jpg':
                # JPG só como reserva: tamanho médio; posters de vídeo não usam JPG; og:image usa 720
                keep = (outdir == IMG and w == widths[len(widths) // 2]) or (name == 'post-objetivo-unico' and w == 720)
                if not keep:
                    continue
            out = os.path.join(outdir, f'{name}-{w}.{ext}')
            r.save(out, **kw)
            total_out += os.path.getsize(out)
    print(f'{name:34s} ok  ({im.width}x{im.height})')
print(f'original total: {total_in/1024:.0f} KB (um tamanho) | derivados gerados: {total_out/1024:.0f} KB (todos os tamanhos e formatos)')
