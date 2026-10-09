#!/usr/bin/env bash
# Recomprime os reels para a web: 540 px de largura, H.264 High, CRF 29, áudio AAC mono 56k, faststart.
# Fontes: _fontes/video-raw (vídeo e áudio originais do Instagram). Saída: site/assets/video/*.mp4
set -e
cd "$(dirname "$0")/.."
RAW=_fontes/video-raw; OUT=site/assets/video
declare -A N=( [r1]=primeira-consulta [r2]=outubro-rosa [r3]=novembro-sem-listas [r4]=whey-receitas [r5]=rotina-real [r6]=palestra )
for k in r1 r2 r3 r4 r5 r6; do
  n=${N[$k]}; w=540; crf=29; ab=56k
  [ "$k" = r4 ] && { w=432; crf=34; ab=40k; }      # vídeo longo (2:49): um pouco mais comprimido
  ffmpeg -y -loglevel error -i $RAW/$k.v.mp4 -i $RAW/$k.a.mp4 -map 0:v:0 -map 1:a:0 \
    -vf "scale=$w:-2" -r 30 -c:v libx264 -profile:v high -level 4.0 -preset slow -crf $crf -g 60 -pix_fmt yuv420p \
    -c:a aac -b:a $ab -ac 1 -movflags +faststart -shortest $OUT/$n.mp4
  echo "$n: $(du -k $OUT/$n.mp4 | cut -f1) KB"
done
