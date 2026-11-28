#!/bin/bash
# طابور الإنتاج: ./queue.sh 02-connect 03-studio ...  (تصوير 60fps → صوت → دمج → غلاف → نسخة ويب للأكاديمية → ملفات المشروع)
cd "$(dirname "$0")"; W=/tmp/ep/q; mkdir -p $W; PUB=../../arsh-live/public/academy; mkdir -p $PUB
for N in "$@"; do
 EPF=episodes/v2/$N.json; MF=episodes/v2/$N.meta.json; FOLDER=$(python3 -c "import json;print(json.load(open('$MF'))['folder'])")
 D="out/$FOLDER/$N"; mkdir -p "$D/project"; echo "=== $N $(date +%T)"
 if [ -s $W/$N.mp4 ] && [ -s $W/$N.events.json ] && [ "$FORCE" != 1 ]; then echo "reuse render $N"; else node studio.cjs $EPF $W/$N.mp4 > $W/$N.log 2>&1 || { echo "FAIL render $N"; tail -3 $W/$N.log; continue; }; fi
 python3 audio2.py $EPF $W/$N.events.json "$D/$N-audio.wav" > /dev/null || { echo "FAIL audio $N"; continue; }
 ffmpeg -v error -y -i $W/$N.mp4 -i "$D/$N-audio.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart "$D/$N.part.mp4" && mv "$D/$N.part.mp4" "$D/$N.mp4"
 ffmpeg -v error -y -ss 27 -i "$D/$N.mp4" -frames:v 1 -q:v 2 $W/$N-f.jpg; node cover.cjs $MF $W/$N-f.jpg "$D/$N-cover.jpg"
 ffmpeg -v error -y -i "$D/$N.mp4" -vf scale=720:1280 -c:v libx264 -preset veryfast -crf 25 -r 30 -c:a aac -b:a 128k -movflags +faststart "$PUB/$N.part.mp4" && mv "$PUB/$N.part.mp4" "$PUB/$N.mp4"
 python3 -c "from PIL import Image; Image.open('$D/$N-cover.jpg').resize((540,960)).save('$PUB/$N.jpg',quality=84)"
 cp studio.html studio.cjs audio2.py series.py $EPF "$D/project/"; cp $W/$N.events.json "$D/project/$N.events.json"; cp $MF "$D/$N-meta.json"
 python3 - "$MF" "$D" "$N" <<'PY'
import json,sys,re; m=json.load(open(sys.argv[1])); D,N=sys.argv[2],sys.argv[3]; e=json.load(open('episodes/v2/'+N+'.json'))
L=[f"# الحلقة {m['num']:02d} — {m['title']}", "", f"الافتتاحية: {(m['hook'] or '').replace('*','').replace('|',' ')}", "", m['desc'], "", "## النصوص على الشاشة"]
L+=[f"- [{a:05.2f}–{b:05.2f}] {s.replace('*','')}" for a,b,s,*_ in e['texts']]
open(f"{D}/{N}-on-screen-text.md","w",encoding="utf-8").write("\n".join(L))
open(f"{D}/{N}-title-description.txt","w",encoding="utf-8").write(f"العنوان:\n{(m['hook'] or '').replace('*','').replace('|',' ')} | بطوط ستريم — {m['num']:02d}\n\nالوصف:\n{m['desc']}\nأول شهر مجاني — تبدأ التجربة بعد أول بث مؤهل لحسابك.\nb6o6-streaming.onrender.com\n\n#بطوط_ستريم #تيك_توك_لايف #بث_مباشر #ستريمر #OBS\n")
PY
 echo "OK $N $(date +%T) $(du -h "$D/$N.mp4" | cut -f1) web:$(du -h "$PUB/$N.mp4" | cut -f1)"
done
echo ALLDONE
