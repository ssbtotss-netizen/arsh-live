# مولّد أصوات B6O6 الأصلية — كل صوت يُصنع من الصفر رياضياً (لا عينات ولا ملفات خارجية) فلا توجد أي حقوق لطرف آخر
import numpy as np
from scipy import signal

SR = 44100
rng = np.random.default_rng(6060)

def t_(d): return np.arange(int(SR * d)) / SR
def note(n):  # "A4" / "C#5" / رقم MIDI
    if isinstance(n, (int, float)): return 440.0 * 2 ** ((n - 69) / 12)
    names = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
    s = n[0].upper(); acc = 0; i = 1
    if len(n) > 2 or (len(n) == 2 and n[1] in "#b"):
        if n[1] == "#": acc = 1; i = 2
        elif n[1] == "b": acc = -1; i = 2
    o = int(n[i:]); m = 12 * (o + 1) + names[s] + acc
    return 440.0 * 2 ** ((m - 69) / 12)

def env_adsr(n, a=.005, d=.1, s=.6, r=.2, total=None):
    total = total or n / SR; A, D, R = int(a * SR), int(d * SR), int(r * SR); S = max(0, n - A - D - R)
    e = np.concatenate([np.linspace(0, 1, max(A, 1)), np.linspace(1, s, max(D, 1)), np.full(S, s), np.linspace(s, 0, max(R, 1))])
    return np.pad(e, (0, max(0, n - len(e))))[:n]
def env_exp(n, tau=.3, a=.002):
    t = np.arange(n) / SR; e = np.exp(-t / tau); A = int(a * SR)
    if A > 1: e[:A] *= np.linspace(0, 1, A)
    return e

def phase_of(f, d):
    f = np.broadcast_to(np.asarray(f, dtype=float), (int(SR * d),)) if np.ndim(f) == 0 else np.asarray(f, dtype=float)
    return 2 * np.pi * np.cumsum(f) / SR
def sine(f, d, ph=0): return np.sin(phase_of(f, d) + ph)
def additive(f, d, amps):
    p = phase_of(f, d); fmax = np.max(np.atleast_1d(f)); out = np.zeros_like(p)
    for k, a in enumerate(amps, 1):
        if fmax * k >= SR / 2 * .95: break
        out += a * np.sin(k * p)
    return out
def saw(f, d, nh=40): return additive(f, d, [1 / k for k in range(1, nh + 1)])
def square(f, d, nh=40): return additive(f, d, [(1 / k if k % 2 else 0) for k in range(1, nh + 1)])
def tri(f, d, nh=20): return additive(f, d, [((-1) ** ((k - 1) // 2) / k ** 2 if k % 2 else 0) for k in range(1, nh + 1)])
def chip_square(f, d, duty=.5):  # موجة مربعة حادة (8-بت) بدون تشويش ترددي مزعج: معالجة مخففة
    p = (np.cumsum(np.broadcast_to(np.asarray(f, float), (int(SR * d),)) if np.ndim(f) == 0 else np.asarray(f, float)) / SR) % 1
    x = np.where(p < duty, 1.0, -1.0); return lp(x, 9000)
def noise(d, color="white"):
    x = rng.standard_normal(int(SR * d))
    if color == "pink":
        b, a = [0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400]
        x = signal.lfilter(b, a, x); x /= np.max(np.abs(x)) + 1e-9
    if color == "brown": x = np.cumsum(x); x = hp(x, 20); x /= np.max(np.abs(x)) + 1e-9
    return x

def _filt(x, kind, fc, order=2):
    fc = np.clip(np.atleast_1d(fc), 20, SR / 2 * .95)
    b, a = signal.butter(order, fc / (SR / 2) if len(fc) > 1 else fc[0] / (SR / 2), btype=kind)
    return signal.lfilter(b, a, x)
def lp(x, fc, order=2): return _filt(x, "low", fc, order)
def hp(x, fc, order=2): return _filt(x, "high", fc, order)
def bp(x, lo, hi, order=2): return _filt(x, "band", [lo, hi], order)
def sweep_lp(x, f0, f1, q=.7, curve="exp"):  # مرشح متحرك (state-variable) لكنس الترددات — مستخدم في البراس والرايزر
    n = len(x); fc = (np.geomspace(max(f0, 30), max(f1, 30), n) if curve == "exp" else np.linspace(f0, f1, n))
    y = np.zeros(n); lo = bd = 0.0; damp = 1 / max(q, .3)
    g = 2 * np.sin(np.pi * np.clip(fc, 20, SR / 6) / SR)
    for i in range(n):
        hi_ = x[i] - lo - damp * bd; bd += g[i] * hi_; lo += g[i] * bd; y[i] = lo
    return y

def fm(fc, ratio, index, d, idx_env=None):
    t = t_(d); mod = np.sin(2 * np.pi * fc * ratio * t) * index * (idx_env if idx_env is not None else 1)
    return np.sin(2 * np.pi * fc * t + mod)
def bell(f, d=1.6, bright=3.0, tau=.5, ratio=3.5):
    n = int(SR * d); ie = env_exp(n, tau * .6); return fm(f, ratio, bright, d, ie) * env_exp(n, tau)
def glass(f, d=1.2, tau=.45):  # جزئيات غير توافقية (زجاج/كريستال)
    n = int(SR * d); out = np.zeros(n)
    for r, a, tt in [(1, 1, 1), (2.76, .5, .6), (5.4, .25, .35), (8.93, .12, .2)]: out += a * sine(f * r, d) * env_exp(n, tau * tt)
    return out
def marimba(f, d=.9):
    n = int(SR * d); return (sine(f, d) * env_exp(n, .28) + .35 * sine(f * 4, d) * env_exp(n, .05) + .15 * sine(f * 9.9, d) * env_exp(n, .02))
def pluck(f, d=1.2, damp=.996, bright=.6):  # Karplus–Strong: وتر مقطوف حقيقي فيزيائياً
    n = int(SR * d); N = max(2, int(SR / f)); buf = rng.uniform(-1, 1, N); buf = lp(buf, 1500 + 9000 * bright); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % N]; buf[i % N] = damp * .5 * (buf[i % N] + buf[(i + 1) % N])
    return out
def brass(f, d, vib=4.5, vdepth=.006, bright=3000, voices=3, det=.004):
    n = int(SR * d); t = t_(d); out = np.zeros(n)
    for v in range(voices):
        fv = f * (1 + det * (v - (voices - 1) / 2)) * (1 + vdepth * np.sin(2 * np.pi * vib * t + v) * np.clip(t / .25, 0, 1))
        out += saw(fv, d, 30)
    e = env_adsr(n, .04, .12, .8, min(.25, d * .3)); x = sweep_lp(out * e, 400, bright, q=1.1, curve="lin") if d < 3 else lp(out * e, bright)
    return x / voices
def pad(freqs, d, bright=1800):
    n = int(SR * d); out = np.zeros(n)
    for f in freqs:
        for dv in (-.006, 0, .006): out += saw(f * (1 + dv), d, 24)
    return lp(out * env_adsr(n, d * .35, .2, .85, d * .35), bright)

# ---- إيقاعات ----
def kick(d=.5, f0=150, f1=45):
    n = int(SR * d); f = f1 + (f0 - f1) * np.exp(-t_(d) / .04); return sine(f, d) * env_exp(n, .18) + .3 * lp(noise(d), 3000) * env_exp(n, .006)
def snare(d=.35, tone=190):
    n = int(SR * d); return .6 * bp(noise(d), 1500, 9000) * env_exp(n, .09) + .5 * sine(tone, d) * env_exp(n, .05)
def hat(d=.12, open_=False):
    n = int(SR * d); return hp(noise(d), 7000) * env_exp(n, .18 if open_ else .025)
def clap(d=.4):
    n = int(SR * d); x = np.zeros(n); src = bp(noise(d), 900, 4000)
    for k, off in enumerate([0, .011, .022, .034]):
        i = int(off * SR); seg = src[i:] * env_exp(n - i, .012 if k < 3 else .12); x[i:] += seg[:n - i]
    return x
def tom(f=110, d=.5):
    n = int(SR * d); ff = f * (1 + .6 * np.exp(-t_(d) / .05)); return sine(ff, d) * env_exp(n, .2)
def cymbal(d=2.0):
    n = int(SR * d); x = hp(noise(d), 4000) * env_exp(n, .6); return x + .3 * bp(noise(d), 6000, 12000) * env_exp(n, .25)
def boom(d=3.0, f=42):  # ضربة سينمائية
    n = int(SR * d); ff = f * (1 + 1.5 * np.exp(-t_(d) / .08)); x = sine(ff, d) * env_exp(n, .9)
    return x + .5 * lp(noise(d, "brown"), 400) * env_exp(n, .5) + .2 * lp(noise(d), 2500) * env_exp(n, .03)
def riser(d=2.5, f0=200, f1=4000):
    n = int(SR * d); x = sweep_lp(noise(d), f0, f1, q=2.0); e = np.linspace(0, 1, n) ** 2
    s = sine(np.geomspace(f0 / 2, f1 / 4, n), d) * .3; return (x + s) * e

# ---- أدوات المزج ----
def place(dst, src, at, gain=1.0):
    i = int(at * SR); need = i + len(src)
    if need > len(dst): dst = np.pad(dst, (0, need - len(dst)))
    dst[i:i + len(src)] += gain * src; return dst
def seq(events, tail=.6):
    out = np.zeros(1)
    for at, s, g in events: out = place(out, s, at, g)
    return np.pad(out, (0, int(tail * SR)))
def reverb(x, size=1.2, mix=.22, damp=6000):
    n = int(SR * size)
    irs = []
    for s in (11, 23):
        r = np.random.default_rng(s).standard_normal(n) * np.exp(-np.arange(n) / SR / (size / 5)); irs.append(lp(r, damp))
    m = len(x) + n; fit = lambda y: np.pad(y, (0, max(0, m - len(y))))[:m]
    L = fit(signal.fftconvolve(x, irs[0])); R = fit(signal.fftconvolve(x, irs[1]))
    dry = np.pad(x, (0, n)); sc = np.max(np.abs(L)) + 1e-9
    wet = np.stack([L, R], 1) / sc * (np.max(np.abs(x)) + 1e-9)
    return np.stack([dry, dry], 1) * (1 - mix) + wet * mix
def stereo(x, width=0.0):
    if x.ndim == 2: return x
    if width <= 0: return np.stack([x, x], 1)
    d = int(.012 * SR * width); r = np.pad(x, (d, 0))[:len(x)]; return np.stack([x, x * (1 - width * .3) + r * width * .3], 1)
def fade_tail(x, ms=40):
    n = int(SR * ms / 1000); x = x.copy()
    if n and len(x) > n: x[-n:] *= np.linspace(1, 0, n)[:, None] if x.ndim == 2 else np.linspace(1, 0, n)
    return x
def trim_silence(x, thr=1e-3):
    a = np.abs(x).max(1) if x.ndim == 2 else np.abs(x); idx = np.where(a > thr)[0]
    if not len(idx): return x
    end = min(len(x), idx[-1] + int(.03 * SR)); return x[:end]
def master(x, rms_db=-17.0, peak_db=-1.0):
    x = np.asarray(x, float); x = x - (x.mean(0) if x.ndim == 2 else x.mean())
    x = trim_silence(x); a = np.abs(x).max(1) if x.ndim == 2 else np.abs(x)
    act = a > a.max() * .05; rms = np.sqrt(np.mean((x[act] ** 2))) + 1e-12
    x = x * (10 ** (rms_db / 20) / rms)
    pk = np.abs(x).max(); lim = 10 ** (peak_db / 20)
    if pk > lim:  # محدِّد ناعم بدل القص
        x = np.tanh(x / lim) * lim * .98
    return fade_tail(stereo(x) if x.ndim == 1 else x)
