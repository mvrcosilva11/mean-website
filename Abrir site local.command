#!/bin/bash
# MEAN — abre o site neste computador (http://localhost:8765), ligado aos ficheiros de texto:
# ao guardar o TEXTOS-SITE.txt ou o TEXTOS-PROJETOS.txt, a página aberta atualiza sozinha.
# Duplo clique para abrir. Deixa esta janela do Terminal aberta; fecha-a para desligar o site local.
cd "$(dirname "$0")" || exit 1
URL="http://localhost:8765"
if curl -s -o /dev/null --max-time 2 "$URL/__mean/estado"; then
  echo "O site local já está ligado. A abrir $URL"
  open "$URL"
  exit 0
fi
echo "A ligar o site local em $URL"
echo "(deixa esta janela aberta; fecha-a para desligar)"
(sleep 1; open "$URL") &
exec python3 ferramentas/servidor-local.py 8765
