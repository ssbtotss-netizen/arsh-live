# يبني مكتبة الأصوات: توليد ← ضبط المستوى ← فحص الجودة ← منع التكرار ← ترميز MP3 ← موجات العرض ← فهرس
import json, os, subprocess, sys, hashlib, numpy as np, tempfile
from scipy.io import wavfile
from scipy import signal
sys.path.insert(0, os.path.dirname(__file__))
from synth import SR, master
from catalog import S, CAT
import catalog2  # الدفعة الثانية (تضيف إلى S)
CAT = {**CAT, "arabic": "🎶 لمسة عربية"}
OUT = sys.argv[1] if len(sys.argv) > 1 else "/home/claude/najd/arsh-live/public/sounds/lib"
os.makedirs(OUT, exist_ok=True)
def feats(x):  # بصمة طيفية: طيف لوغاريتمي على 24 حزمة عبر 8 مقاطع زمنية
    m = x.mean(1); f, t, Z = signal.stft(m, SR, nperseg=2048); P = np.abs(Z) ** 2
    edges = np.geomspace(60, 16000, 25); B = np.stack([P[(f >= edges[k]) & (f < edges[k + 1])].sum(0) for k in range(24)])
    segs = np.array_split(B, 8, axis=1); v = np.concatenate([np.log10(s.mean(1) + 1e-9) for s in segs]); v = v - v.mean(); return v / (np.linalg.norm(v) + 1e-9)
from collections import Counter as _C
_d = [k for k, v in _C(s[0] for s in S).items() if v > 1]
assert not _d, f"dup ids {_d}"
items, fps, rej = [], [], []
for id_, name, cat, ev, tags, fn in S:
    try: x = master(fn())
    except Exception as e: rej.append((id_, "error: " + str(e)[:120])); continue
    d = len(x) / SR; pk = float(np.abs(x).max()); a = np.abs(x).max(1)
    if not np.isfinite(x).all(): rej.append((id_, "nan")); continue
    if d < .08 or d > 12: rej.append((id_, f"duration {d:.2f}")); continue
    if pk < .05: rej.append((id_, "silent")); continue
    if pk > .95: rej.append((id_, f"peak {pk:.2f}")); continue
    fv = feats(x); sim = max([float(fv @ g) for g in fps] or [0])
    if sim > .985: j = int(np.argmax([float(fv @ g) for g in fps])); rej.append((id_, f"near-duplicate of {items[j]['id']} ({sim:.3f})")); continue
    with tempfile.TemporaryDirectory() as td:
        w = os.path.join(td, "a.wav"); wavfile.write(w, SR, (x * 32767).astype(np.int16)); mp = os.path.join(OUT, id_ + ".mp3")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", w, "-ac", "2", "-b:a", "128k", "-id3v2_version", "0", "-map_metadata", "-1", mp], check=True)
    # التحقق: الملف المرمّز يُفك فعلاً ومدته صحيحة
    pr = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", mp], capture_output=True, text=True)
    md = float(pr.stdout.strip() or 0)
    if abs(md - d) > .15: rej.append((id_, f"decode duration {md}")); os.remove(mp); continue
    nb = 48; seg = np.array_split(a, nb); peaks = [round(float(s.max()) / pk, 2) for s in seg]
    items.append({"id": id_, "name": name, "cat": cat, "ev": ev, "tags": tags, "dur": round(md, 2), "peaks": peaks, "size": os.path.getsize(mp), "sha": hashlib.sha256(open(mp, "rb").read()).hexdigest()[:16]})
    fps.append(fv)
json.dump({"v": 1, "cats": CAT, "items": items}, open(os.path.join(OUT, "index.json"), "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
from collections import Counter
print("OK", len(items), "sounds", Counter(i["cat"] for i in items), "total", sum(i["size"] for i in items) // 1024, "KB")
for r in rej: print("REJ", *r)
