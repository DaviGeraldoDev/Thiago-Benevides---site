# Thiago Benevides — Design System v2

Biomédico Especialista em Estética Avançada e Nutricionista Especialista em Nutrição do Esporte · Mococa e Ribeirão Preto/SP
Assinatura: **"Seu objetivo é único. A estratégia também precisa ser."** (post do Instagram)

Veja ao vivo: `design-system/styleguide.html` (servidor `thiago-ds`, porta 8962) e o site em `thiago-nutri` (porta 8961).

## O que mudou da v1 para a v2

A v1 repetia a estrutura do Lit Concept (arco, faixa em loop, painéis, antes/depois). A v2 parte **só das refs de nutrição** (`Refs Nutri`) e da identidade real do Instagram, com linguagem visual própria.

| Ref de nutrição | O que levamos para a estrutura |
|---|---|
| **Mayara Brito** | Seção de **problema** ("você sofre de...?") antes da solução, consulta em dois caminhos (presencial e online), conteúdos no fim |
| **Clínica Chedid** | Selo de nota Google no topo, **perfil com manifesto**, dois caminhos de atendimento, dúvidas frequentes em acordeão, bloco do Google |
| **Camila Cavalari** | **Fatos rápidos** no hero, **grade de especialidades**, seção dedicada à **avaliação corporal** (InBody), FAQ, CTA final, rodapé em colunas |

Ordem do site: Hero escuro com fatos → 01 Reconhece? → 02 Quem cuida de você → 03 Especialidades → 04 Avaliação corporal → 05 Atendimento (presencial/online + 4 passos) → 06 Conteúdo (abas Vídeos/Posts) → 07 Avaliações Google → 08 Dúvidas → 09 Contato.

Linguagem visual própria: **retângulos com moldura fina dourada** (eco do selo do logo), **botões retos** (como o "CONFIRA >" dos posts), grade de linhas finas, numerais grandes em serifa, rótulos numerados, hero e contato escuros. Sem arcos, sem faixa em loop, sem cartão deslocado.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `tokens.css` | Cor, tipografia, espaço, formas, sombras, movimento, medidas por altura de tela |
| `components.css` | Base + componentes (botões, nav, células, linha do tempo, abas, acordeão, moldura, rodapé) |
| `motion.js` | Revelação ao rolar, título por palavra, contadores, filete, barra de leitura |
| `styleguide.html` | Guia visual vivo |
| `../site/` | Site (`index.html`, `entregaveis/`, `assets/css/site.css` com os layouts das seções) |
| `../site/assets/img/logo-mark-*.svg/png` | Monograma TB extraído do logo (sem a escrita), dourado e verde |
| `../_fontes/` | Originais fora do site |

## Cor

Medidas = amostradas nos posts/logo do Instagram. Derivadas = calculadas.

| Token | Hex | Origem | Uso |
|---|---|---|---|
| `--tb-forest` | `#163626` | **medida** (≈52% dos pixels chapados dos posts) | **Primária**: botões, nav, hero, rodapé |
| `--tb-forest-2` | `#2A463A` | **medida** (fundo do logo) | Superfície escura secundária |
| `--tb-gold` | `#DAB676` | **medida** (títulos dos posts) | Filetes, números, texto sobre escuro |
| `--tb-gold-logo` | `#C9A24D` | média do degradê do logo | Monograma |
| `--tb-cream` | `#F6EFE8` | medida (`#F6EEEA`) | Fundo padrão |
| `--tb-ivory` | `#FBF8F3` | derivada | Superfície clara |
| `--tb-mist` | `#E8ECE0` | derivada | Seções alternadas |
| `--tb-linen` | `#DDD5C8` | derivada | Linhas |
| `--tb-green` | `#2D5E45` | derivada | Palavra em itálico, hover |
| `--tb-gold-deep` | `#7A6626` | derivada | Texto dourado sobre claro (AA) |
| `--tb-gold-soft` | `#EBD9AE` | derivada | Halos |
| `--tb-teal` | `#2E8275` | medida (parede, só fotos) | Acento raro |
| `--tb-ink` / `--tb-mute` | `#14211B` / `#566660` | derivadas | Texto |
| `--tb-whatsapp` | `#1FA231` | padrão | Só CTA de WhatsApp |

## Tipografia (conferida nos posts e no logo)

Comparamos os títulos, o texto corrido e a assinatura do logo com candidatas do Google Fonts.

| Uso | Fonte | Por quê |
|---|---|---|
| Títulos | **Instrument Serif** 400 + itálico | Os títulos dos posts têm serifa fechada, letras muito juntas e x-height alto. Playfair Display (v1) era mais larga e contrastada |
| Texto e UI | **Quicksand** 500–700 | O texto corrido dos carrosséis é uma sans arredondada de traço uniforme. Raleway (v1) era pontuda demais |
| Assinatura | **Montserrat** 700 + 300 | No logo, "Thiago" em negrito e "Benevides" em leve (geométrica). Só para o nome |

Uma palavra por título em *itálico* (verde sobre claro, dourado sobre escuro). Rótulos: Quicksand 700, caixa-alta, `+0.18em`, com número em serifa dourada ("03 / Especialidades"). Escalas fluidas; o display do hero é limitado pela altura (`svh`).

## Altura e responsividade

- Medidas por **altura de tela**: `--section-y` (11svh), `--head-gap`, `--fit-h` (altura útil abaixo da nav), `--nav-h` (9svh, 60–84px). Hero em 100svh; fotos, player e células limitam por `--fit-h`.
- Notebooks (1366×768 e 1280×720): cada seção entre ~540 e ~770 px.
- Celular: células viram faixas deslizantes; fatos do hero em 2 colunas; sem rolagem horizontal.

## Movimento

`.reveal` / `data-stagger` (fade + subida), `.reveal--words` (título por palavra), `.reveal--wipe` (foto revelada da esquerda), `.rule--draw`, `[data-count]`, barra de leitura dourada na nav, brilho que varre o botão, hover de célula (fundo verde + número desliza). Respeita `prefers-reduced-motion`.

## Componentes

Botões (`.btn`, `--gold`, `--outline`, `--light`, `--text`, `--whatsapp`, `--lg`, `--sm`) · Nav escura com barra de leitura · Pill de nota · Moldura dourada (`.frame`) · Fatos (`.fact`) · Grade de linhas (`.hair` + `.cell`, `--hover`) · Linha do tempo horizontal · Abas · Acordeão (`.acc`) · Card de reel e card de post · **Player próprio** (overlay com vídeo, controles e a legenda real do post) · Avaliação · Contato com mapa · Rodapé em colunas · WhatsApp flutuante.

## Conteúdo da marca

- **Nome:** Thiago Benevides — Biomédico e Nutricionista
- **Endereço (Mococa):** R. Riachuelo, 743 — Centro, 13730-070 · também atende em Ribeirão Preto
- **WhatsApp:** (19) 99104-6731 · `wa.me/5519991046731`
- **Instagram:** [@nutrithiagobenevides](https://www.instagram.com/nutrithiagobenevides/) · **Linktree:** linktr.ee/ThiagobenevidesBM
- **Google:** nota 5,0; depoimentos de Felipe Augusto e Kaynan Leite

## Pendências

1. **Logo em alta.** O arquivo recebido tem 640 px; o SVG foi redesenhado a partir dele. Ideal: vetor original.
2. **Fotos em alta.** Frames dos reels (720×1280) e recortes de posts (1080 px). Pedir originais.
3. **Resultados/antes e depois** não são públicos no perfil; só com fotos e consentimento por escrito.
4. **Avaliações Google:** confirmar a contagem ("5,07 avaliações" foi lido como nota 5,0 com poucas avaliações).
5. **Registro profissional** (CRN e CRBM), **horário** e **endereço de Ribeirão Preto**.
6. **Fotos de terceiros** (pacientes, colegas, alunos) exigem autorização de imagem.
7. **Fontes** no Google Fonts por ora; hospedar no próprio site na publicação.
8. **Vídeo de whey** tem 13 MB (2:49).
