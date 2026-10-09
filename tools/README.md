# Ferramentas do site (build e otimização)

Fluxo de trabalho. Fontes em `design-system/` (tokens, componentes, motion) e `src/` (layouts e JS do site). Saída em `site/` (é o que vai para o servidor).

| Comando | O que faz |
|---|---|
| `python tools/images.py` | Gera AVIF, WebP e JPG em vários tamanhos a partir de `_fontes/site-originais/` |
| `python tools/picturize.py` | Troca `<img src=".../nome.jpg">` por `<picture>` responsivo (idempotente) |
| `bash tools/videos.sh` | Recomprime os reels (540 px, H.264, CRF 29, áudio mono) a partir de `_fontes/video-raw/` |
| `python tools/build.py` | Junta e minifica CSS e JS, gera `app.<hash>.css/js` e atualiza os `<link>`/`<script>` do HTML |
| `python tools/check.py` | Procura links quebrados e arquivos não usados |

Requisitos: Python 3 com `Pillow` (com AVIF), `rcssmin`, `rjsmin` e `ffmpeg`.
Depois de editar `design-system/*.css`, `src/css/site.css` ou `src/js/site.js`, rode `python tools/build.py`.

## Resultado da otimização (home, notebook 1366×768)

| | Antes | Depois |
|---|---|---|
| Primeira dobra | 344 KB (sem fontes) | **143 KB (com fontes)** |
| Página inteira rolada | 656 KB (sem fontes) | **213 KB (com fontes)** |
| DOMContentLoaded (local) | 357 ms | 148 ms |
| Fontes | Google Fonts (CSS + 4 arquivos, 2 domínios) | 4 woff2 locais, 68 KB, preload |
| Vídeos (6 reels) | 33 MB | 15 MB, só baixam ao clicar |
| Mapa | iframe do Google ao carregar (>1 MB) | Só ao clicar em "Carregar mapa" |

Servidor: `deploy/nginx-thiago.conf` (gzip, cache de 1 ano para CSS/JS com hash e fontes, 30 dias para imagens e vídeos, HTML sempre revalidado).
