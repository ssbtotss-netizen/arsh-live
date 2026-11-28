# صوت الحلقات v2 — بدون أي تعليق صوتي: موسيقى أصلية هادئة وفخمة (مولّدة بالكامل هنا، ملكية B6O6 — بدون عينات خارجية)
# + مؤثرات واجهة متزامنة مع سجل أحداث التصوير (نقرات، كتابة، ظهور النصوص، انتقالات) + أصوات تنبيهات المنصة الحقيقية من مكتبة B6O6.
# الاستخدام: python3 audio2.py ep.json events.json out.wav
import json, sys, os, subprocess, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, "..", "soundgen"))
from synth import SR, note, sine, tri, noise, lp, hp, bp, pad, pluck, bell, kick, hat, clap, env_exp, env_adsr, reverb, master
EP = json.load(open(sys.argv[1], encoding="utf-8")); EV = json.load(open(sys.argv[2])); OUT = sys.argv[3]
DUR = EP.get("dur", 59); N = int(SR * DUR); LIB = os.path.join(HERE, "..", "..", "arsh-live", "public", "sounds", "lib")
MUS = np.zeros(N); SFX = np.zeros((N, 2)); SIDE = np.ones(N)
rng = np.random.default_rng(7)
def add(buf, x, at, g=1.0):
    i = int(round(at * SR));
    if i >= N: return
    if i < 0: x = x[-i:]; i = 0
    n = min(len(x), N - i); buf[i:i + n] += x[:n] * g
def addS(x, at, g=1.0, pan=0.0):
    x = x if x.ndim == 2 else np.stack([x * min(1, 1 - pan), x * min(1, 1 + pan)], 1)
    i = int(round(at * SR)); n = min(len(x), N - i)
    if n > 0 and i >= 0: SFX[i:i + n] += x[:n] * g
# ================= الموسيقى: 120 BPM — Fmaj7 · C · Am7 · G — هادئة في البداية وتتصاعد بنعومة مع الشرح =================
BPM = 120; B = 60 / BPM; BAR = 4 * B
CH = [("F2", ["F3", "A3", "C4", "E4"]), ("C2", ["C3", "G3", "C4", "E4"]), ("A1", ["A2", "E3", "G3", "C4"]), ("G1", ["G2", "D3", "G3", "B3"])]
ARP = [[0, 2, 1, 3, 2, 1, 3, 2], [0, 1, 2, 3, 1, 2, 3, 2], [0, 2, 3, 1, 2, 3, 1, 2], [0, 1, 3, 2, 1, 3, 2, 3]]
def lvl(t):  # شدة المقطع
    return 0 if t < 4 else 1 if t < 10 else 2 if t < 20 else 3 if t < 42 else 4 if t < 52 else 5
bi = 0; t = 0.0
while t < DUR - .05:
    root, ch = CH[bi % 4]; L = lvl(t)
    pv = pad([note(n) for n in ch], BAR + .6, 1100 if L < 2 else 1500 if L < 4 else 1900)
    add(MUS, pv * (.17 if L == 0 else .2), t)
    for k in range(8):  # أربيجيو بنقر وتر حقيقي (Karplus–Strong)
        tk = t + k * B / 2
        if tk >= DUR - .3 or L == 0: continue
        if L == 1 and k % 2: continue
        nn = note(ch[ARP[bi % 4][k] % 4]) * (2 if L >= 3 and k in (3, 7) else 1)
        add(MUS, pluck(nn * 2, .9, .994, .45) * (.16 if L < 4 else .19), tk)
    for b4 in range(4):
        tb = t + b4 * B
        if tb >= DUR - .2: break
        if L >= 2 and L != 5:  # إيقاع ناعم + ضغط جانبي خفيف
            add(MUS, kick(.32, 105, 44) * (.55 if L >= 3 else .4), tb)
            i0 = int(tb * SR); n = min(int(SR * .32), N - i0); SIDE[i0:i0 + n] = np.minimum(SIDE[i0:i0 + n], 1 - .28 * np.exp(-np.arange(n) / (SR * .09)))
        if L >= 2 and L != 5:
            add(MUS, hat(.05) * (.05 if L < 3 else .07), tb + B / 2)
        if L >= 3 and L != 5 and b4 in (1, 3): add(MUS, lp(clap(.25), 5000) * (.09 if L == 3 else .12), tb)
        if L >= 3 and L != 5:  # باص دافئ
            add(MUS, lp(tri(note(root) * 2, B * .95, 12), 420) * env_adsr(int(SR * B * .95), .01, .1, .7, .15) * .30, tb)
    t += BAR; bi += 1
# حلّ ختامي: كورد Fmaj9 طويل ينطفئ مع نهاية المقطع
add(MUS, pad([note(n) for n in ["F2", "C3", "A3", "E4", "G4"]], 7.2, 1300) * .30 * np.linspace(1, 0, int(SR * 7.2)) ** 1.5, 51.9)
MUS *= SIDE; MUS = reverb(MUS, 1.6, .18, 5000); MUS = (MUS if MUS.ndim == 2 else np.stack([MUS, MUS], 1))[:N]
if len(MUS) < N: MUS = np.pad(MUS, ((0, N - len(MUS)), (0, 0)))
# ================= مؤثرات ================
def tick(f=2300, g=1.0):  # نقرة ماوس واقعية: نقرة قصيرة + جسم خفيف
    n = int(SR * .045); a = noise(.045) * np.exp(-np.arange(n) / (SR * .004)); b = sine(f, .045) * np.exp(-np.arange(n) / (SR * .012)) * .35
    return hp(a * .8 + b, 900) * g
def key(g=1.0):
    n = int(SR * .03); return bp(noise(.03) * np.exp(-np.arange(n) / (SR * .005)), 1500, 6000) * g
def whoosh(d=.8, f0=300, f1=3800, g=1.0):  # انتقال هوائي ناعم (بدون انفجار)
    n = int(SR * d); x = noise(d, "pink"); out = np.zeros(n); seg = 2048
    for i in range(0, n, seg):
        u = i / n; fc = f0 * (f1 / f0) ** (np.sin(u * np.pi / 2)); out[i:i + seg] = bp(x[i:i + seg + 512], max(80, fc * .6), min(SR / 2 - 100, fc * 1.6))[:len(out[i:i + seg])]
    env = np.sin(np.linspace(0, np.pi, n)) ** 2; return out * env * g
def air(g=1.0):  # ظهور نص: نفَس هوائي خفيف جداً
    n = int(SR * .18); return hp(noise(.18, "pink"), 4000) * np.sin(np.linspace(0, np.pi, n)) ** 2 * g
def lib(i):
    p = os.path.join(LIB, i + ".mp3")
    if not os.path.exists(p): return None
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)
# انتقالات المقاطع الكبرى (على حدود المازورة)
for b in [4.0, 10.0, 20.0, 42.0, 52.0]: addS(whoosh(.9), b - .55, .16)
# ضربة الشعار: جرس زجاجي ناعم + عمق منخفض
bl = bell(note("C6"), 2.2, 2.0, .7); bl2 = bell(note("G6"), 2.2, 2.0, .6); addS(reverb(bl * .5 + bl2[:len(bl)] * .25, 2.0, .35), .32, .32)
addS(lp(sine(55, 1.6) * env_exp(int(SR * 1.6), .5), 200), .3, .35)
for e in EV:
    k, at = e["k"], e["t"]
    if k == "click": addS(tick(2100 + rng.uniform(-250, 250)), at, .55, rng.uniform(-.15, .15))
    elif k == "key": addS(key(rng.uniform(.5, .8)), at, .45, rng.uniform(-.2, .2))
    elif k in ("text", "otext"): addS(air(), at, .10)
    elif k == "move" and e.get("v", 1) >= .9: addS(whoosh(.35, 1200, 5000), at + .05, .025)
    elif k == "swipe": addS(whoosh(e.get("v", 1.0) or 1.0, 400, 5200), at - .1, .22)
    elif k == "rise": addS(whoosh(e.get("v", 1.2) or 1.2, 250, 3000) * np.linspace(.2, 1, int(SR * (e.get("v", 1.2) or 1.2)))[:len(whoosh(e.get("v", 1.2) or 1.2))], at, .2)
    elif k == "hit": addS(lp(sine(70 - 8 * (e.get("v", 0) or 0), .5) * env_exp(int(SR * .5), .12), 300) + tick(1600) * .4, at, .32)
    elif k == "count":
        d = e.get("v", 1.3) or 1.3
        for j in range(14): addS(key(.6), at + d * (1 - (1 - j / 14) ** 2), .5)
    elif k == "snd":
        x = lib(e["v"])
        if x is not None: addS(x, at, .55)
# ================= مكس وماستر =================
mix = MUS * .9 + SFX; fi = int(SR * .35); mix[:fi] *= np.linspace(0, 1, fi)[:, None] ** 2
fade = int(SR * .5); mix[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
# تطبيع بدون قص للصمت (للحفاظ على التزامن): RMS ≈ -16dB ثم محدد ناعم
act = np.abs(mix).max(1) > np.abs(mix).max() * .05; rms = np.sqrt(np.mean(mix[act] ** 2)) + 1e-12
mix *= 10 ** (-16 / 20) / rms; lim = 10 ** (-1 / 20); mix = np.where(np.abs(mix) > lim * .8, np.sign(mix) * (lim * .8 + np.tanh((np.abs(mix) - lim * .8) / (lim * .2)) * lim * .2 * .98), mix)
from scipy.io import wavfile
wavfile.write(OUT, SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16)); print("OK", OUT, DUR)
