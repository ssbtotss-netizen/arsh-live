# صوت الحلقة: موسيقى حماسية أصلية مولّدة (بدون عينات — صالحة للاستخدام التجاري) + مؤثرات من مكتبة أصوات B6O6 عند القطعات والنقرات
# الاستخدام: python3 audio.py ep.json out.wav [voice.wav]  — عند وجود تعليق صوتي تنخفض الموسيقى تلقائياً تحته (ducking)
import json, sys, os, subprocess, numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "soundgen"))
from synth import SR, note, kick, snare, hat, clap, saw, sine, lp, hp, bp, env_exp, env_adsr, riser, boom, noise, reverb, pad
from scipy.io import wavfile
EP = json.load(open(sys.argv[1], encoding="utf-8")); OUT = sys.argv[2]; VOICE = sys.argv[3] if len(sys.argv) > 3 else None
DUR = max(s["t1"] for s in EP["scenes"]); N = int(SR * DUR); LIB = os.path.join(os.path.dirname(__file__), "..", "..", "arsh-live", "public", "sounds", "lib")
mix = np.zeros((N, 2))
def put(x, at, g=1.0, pan=0.0):
    i = int(at * SR); x = x if x.ndim == 2 else np.stack([x * (1 - max(0, pan)), x * (1 + min(0, pan))], 1)
    n = min(len(x), N - i);
    if n > 0 and i >= 0: mix[i:i + n] += x[:n] * g
# ===== الموسيقى: 128 BPM، Am–F–C–G، مقدمة ← بناء ← انطلاق عند ظهور الشعار ← استراحة ← ذروة عند النتيجة ← خاتمة
BPM = 128; B = 60 / BPM; bar = 4 * B
PROG = [("A2", ["A3", "C4", "E4"]), ("F2", ["F3", "A3", "C4"]), ("C3", ["C4", "E4", "G4"]), ("G2", ["G3", "B3", "D4"])]
sec = lambda t: (0 if t < 4 else 1 if t < 10 else 2 if t < 42 else 3 if t < 52 else 4)  # 0 مقدمة · 1 بناء · 2 انطلاق · 3 ذروة · 4 خاتمة
t = 0.0; bi = 0
while t < DUR - .01:
    root, ch = PROG[bi % 4]; s = sec(t)
    for b in range(4):
        tb = t + b * B
        if tb >= DUR: break
        sb = sec(tb)
        if sb in (2, 3) or (sb == 4 and tb < DUR - 2): put(kick(.45, 140, 45), tb, .9 if sb == 3 else .75)
        if sb == 1 and b % 2 == 0: put(kick(.35, 120, 50), tb, .5)
        if sb in (2, 3) and b in (1, 3): put(clap(.35), tb, .45); put(snare(.25, 200), tb, .3)
        if sb >= 1:
            for h in range(2 if sb < 3 else 4): put(hat(.06), tb + h * B / (2 if sb < 3 else 4), .16 if h % 2 else .22, .3)
        if sb in (2, 3, 4):  # باص
            put(lp(saw(note(root), B * .9, 12), 600 if sb != 3 else 900) * env_adsr(int(SR * B * .9), .005, .08, .7, .1) * .5, tb, .7)
    # باد للكورد
    put(lp(pad([note(n) for n in ch], bar, 1600 if s >= 2 else 900), 3000) * (.35 if s != 0 else .25), t, .55, 0)
    t += bar; bi += 1
put(riser(5.6, 150, 7000) * .35, 4.4, .6)          # بناء قبل الشعار
put(boom(3.0, 42), 10.0, .8)                        # الانطلاق مع ظهور الشعار
put(riser(3.0, 200, 8000) * .3, 39.0, .6); put(boom(2.5, 46), 42.0, .7)  # الذروة عند النتيجة
put(boom(3.5, 40), 52.0, .6)
# ===== المؤثرات: قطعات المشاهد + النقرات + أحداث النتيجة (من مكتبة أصوات B6O6 الأصلية)
def lib(i):
    p = os.path.join(LIB, i + ".mp3")
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64) if r.returncode == 0 else np.zeros((1, 2))
cuts = [s["t0"] for s in EP["scenes"] if s["t0"] > 0]
for c in cuts: put(lib("dash-01"), c - .18, .55)
put(lib("impact-rise-02"), 0.0, .5)
for s in EP["scenes"]:
    for tp in s.get("taps", []): put(lib("menu-select"), s["t0"] + tp[0], .6)
    if s["type"] == "problem":
        for i in range(len(s["apps"])): put(lib("pop-cork"), s["t0"] + .25 + i * .45, .45)
        put(lib("wrong-02"), s["t0"] + 3.6, .5)
    if s["type"] == "live": put(lib("follow-01"), s["t0"] + 1.0, .45); put(lib("gift-01"), s["t0"] + 4.5, .6); put(lib("applause"), s["t0"] + 5.2, .25)
    if s["type"] == "cta": put(lib("tier-100"), s["t0"] + .1, .45)
# ===== التعليق الصوتي (اختياري) + خفض الموسيقى تحته
music_gain = .55
if VOICE:
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", VOICE, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True)
    v = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)[:N]
    env = np.convolve(np.abs(v).mean(1), np.ones(int(SR * .25)) / int(SR * .25), "same"); duck = 1 - .6 * np.clip(env / (env.max() + 1e-9) * 6, 0, 1)
    mix *= duck[:, None] if len(duck) == N else np.pad(duck, (0, N - len(duck)), constant_values=1)[:, None]
    mix[:len(v)] += v * 1.0
mix *= music_gain if not VOICE else 1.0
# تحجيم وحد أقصى (بدون تشويه) + تلاشي في النهاية
fade = int(SR * 1.2); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
pk = np.abs(mix).max(); mix = np.tanh(mix / (pk + 1e-9) * 1.6) / np.tanh(1.6) * .89
wavfile.write(OUT, SR, (mix * 32767).astype(np.int16)); print("OK", OUT, round(DUR, 2), "s")
