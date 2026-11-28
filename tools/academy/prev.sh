#!/bin/bash
# معاينة سريعة: ./prev.sh episodes/v2/02-connect.json "1.5,3,12,..."  → /tmp/ep/prev/<name>.jpg
EPF=$1; T=$2; N=$(basename $EPF .json); O=/tmp/ep/prev/$N; rm -rf $O; mkdir -p $O
timeout 900 node studio.cjs $EPF $O/k.mp4 --frames $T 2>&1 | grep -iv "^$" | grep -i "error" | head -5
FS=$(for t in ${T//,/ }; do f=$O/k_$t.jpg; [ -f $f ] || f=$O/k_${t%.0}.jpg; echo $f; done); python3 /tmp/sheet.py /tmp/ep/prev/$N.jpg $FS && echo /tmp/ep/prev/$N.jpg
