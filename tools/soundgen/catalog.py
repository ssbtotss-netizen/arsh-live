# كتالوج أصوات B6O6 الأصلية: كل وصفة = لحن/إيقاع/آلة مختلفة (لا تكرار لنفس الصوت بأسماء مختلفة — يُتحقق آلياً في build.py)
import numpy as np
from synth import *

N = note
CAT = {"alerts": "🔔 تنبيهات البث", "comedy": "😂 كوميدي", "hype": "🔥 حماس وفخامة", "games": "🎮 ألعاب", "support": "💰 دعم ودونيشن"}
S = []  # (id, الاسم, التصنيف, الحدث المقترح, الوسوم, الدالة)
def snd(id_, name, cat, ev="", tags=""):
    def deco(fn): S.append((id_, name, cat, ev, tags, fn)); return fn
    return deco

INSTR = {
    "bell": lambda f, d: bell(f, d, 2.5, .45),
    "glass": lambda f, d: glass(f, d, .5),
    "marimba": lambda f, d: marimba(f, d),
    "pluck": lambda f, d: pluck(f, d, .995, .7),
    "chip": lambda f, d: chip_square(f, d) * env_adsr(int(SR * d), .002, .05, .5, .05) * .5,
    "kalimba": lambda f, d: bell(f, d, .9, .35, 1.0) + .3 * sine(f * 5.1, d) * env_exp(int(SR * d), .03),
    "harp": lambda f, d: pluck(f, d, .998, .45),
    "softsine": lambda f, d: sine(f, d) * env_adsr(int(SR * d), .01, .1, .5, .3) + .2 * sine(f * 2, d) * env_exp(int(SR * d), .2),
    "vibes": lambda f, d: (sine(f, d) + .3 * sine(f * 4, d) * env_exp(int(SR * d), .3)) * env_exp(int(SR * d), .7) * (1 + .25 * np.sin(2 * np.pi * 5.5 * t_(d))),
    "brassy": lambda f, d: brass(f, d, bright=2600, voices=2),
}
def melody(inst, notes, step=.12, dur=.9, gains=None, tail=.5):
    ev = [(i * step, INSTR[inst](N(n), dur), (gains[i] if gains else 1)) for i, n in enumerate(notes)]; return seq(ev, tail)
def chord(inst, notes, dur=1.4, strum=.0):
    return seq([(i * strum, INSTR[inst](N(n), dur), 1 / len(notes) ** .5) for i, n in enumerate(notes)], .4)
def R(x, size=1.0, mix=.2): return reverb(x, size, mix)

# ============ 🔔 تنبيهات البث ============
FOLLOW = [("bell", ["E5", "A5"], .11, "جرس صاعد"), ("glass", ["C6", "E6", "G6"], .09, "كريستال ثلاثي"), ("marimba", ["G5", "C6"], .1, "ماريمبا مرحة"),
          ("kalimba", ["A5", "C#6", "E6"], .08, "كاليمبا ناعمة"), ("chip", ["C6", "G6"], .07, "8-بت سريع"), ("harp", ["D5", "F#5", "A5", "D6"], .06, "هارب منساب"),
          ("vibes", ["F5", "A5"], .14, "فايبرافون دافئ")]
for i, (ins, ns, st, nm) in enumerate(FOLLOW):
    snd(f"follow-{i+1:02d}", f"متابعة جديدة — {nm}", "alerts", "follow", "فولو متابعة")(lambda ins=ins, ns=ns, st=st: R(melody(ins, ns, st, .9), .9, .18))
GIFT = [("glass", ["E6", "G#6", "B6", "E7"], .05, "بريق كريستالي"), ("bell", ["C6", "E6", "G6", "C7"], .06, "أجراس هدية"), ("harp", ["G5", "B5", "D6", "G6", "B6"], .045, "هارب لامع"),
        ("kalimba", ["D6", "F#6", "A6"], .07, "كاليمبا هدية"), ("chip", ["E6", "G6", "B6", "E7"], .05, "هدية 8-بت"), ("vibes", ["C6", "E6", "A6"], .09, "فايبرافون هدية")]
for i, (ins, ns, st, nm) in enumerate(GIFT):
    snd(f"gift-{i+1:02d}", f"هدية جديدة — {nm}", "alerts", "gift", "هدية")(lambda ins=ins, ns=ns, st=st: R(seq([(0, melody(ins, ns, st, 1.0), 1), (0, hp(noise(.6), 8000) * env_exp(int(SR * .6), .15), .12)], .3), 1.1, .22))
def coinhit(f=N("B5")): return seq([(0, bell(f, .25, 1.2, .08, 2.0), .7), (.08, bell(f * 4 / 3, .7, 1.2, .25, 2.0), .9)], .2)
DON = [("bell", ["C5", "E5", "G5", "C6"], "كوين + كورد"), ("glass", ["F5", "A5", "C6", "F6"], "كوين كريستالي"), ("marimba", ["D5", "F#5", "A5", "D6"], "كوين ماريمبا"),
       ("harp", ["Bb4", "D5", "F5", "Bb5"], "كوين هارب"), ("brassy", ["G4", "B4", "D5"], "كوين مع نحاس")]
for i, (ins, ns, nm) in enumerate(DON):
    snd(f"donation-{i+1:02d}", f"دونيشن — {nm}", "alerts", "donation", "دعم دونيشن")(lambda ins=ins, ns=ns: R(seq([(0, coinhit(N(ns[-1]) * 2), .8), (.18, chord(ins, ns, 1.4, .03), 1)], .5), 1.1, .2))
SUB = [(["C5", "C5", "G5", "C6"], [0, .12, .24, .42], "فانفير اشتراك"), (["D5", "F#5", "A5", "D6"], [0, .1, .2, .34], "فانفير مشرق"), (["Bb4", "D5", "F5", "Bb5"], [0, .14, .28, .5], "فانفير ملكي قصير"),
       (["E5", "G#5", "B5", "E6"], [0, .09, .18, .27], "اشتراك سريع")]
for i, (ns, ts, nm) in enumerate(SUB):
    snd(f"sub-{i+1:02d}", f"اشتراك جديد — {nm}", "alerts", "subscribe", "اشتراك")(lambda ns=ns, ts=ts: R(seq([(t, brass(N(n), .3 if k < 3 else .9, bright=3200), .8) for k, (n, t) in enumerate(zip(ns, ts))] + [(ts[-1], snare(.3), .3), (ts[-1], cymbal(1.2), .15)], .5), 1.2, .2))
def whoosh(d=.45, f0=300, f1=5000, up=True):
    n = int(SR * d); x = sweep_lp(noise(d), f0 if up else f1, f1 if up else f0, q=1.4); return x * np.sin(np.linspace(0, np.pi, n)) ** 1.5
for i, (up, ping, nm) in enumerate([(True, "A6", "سوووش + بينق"), (False, "E6", "سوووش هابط"), (True, "C7", "مشاركة لامعة"), (True, "G6", "إرسال سريع")]):
    snd(f"share-{i+1:02d}", f"مشاركة البث — {nm}", "alerts", "share", "مشاركة شير")(lambda up=up, ping=ping, i=i: R(seq([(0, whoosh(.35 + .1 * i, 400, 6000, up), .6), (.3, glass(N(ping), .8), .7)], .4), .8, .2))
JOIN = [("softsine", ["A5"], "دينق ناعم"), ("kalimba", ["E5", "B5"], "دخول كاليمبا"), ("glass", ["G6"], "نقرة كريستال"), ("marimba", ["C5", "G5"], "دخول ماريمبا"), ("vibes", ["D5", "A5"], "ترحيب هادئ")]
for i, (ins, ns, nm) in enumerate(JOIN):
    snd(f"join-{i+1:02d}", f"دخول مشاهد — {nm}", "alerts", "join", "دخول")(lambda ins=ins, ns=ns: R(melody(ins, ns, .13, .7) * .8, .7, .15))
GOAL = [(["C5", "E5", "G5", "C6", "E6"], "كورد انتصار"), (["F4", "A4", "C5", "F5"], "هدف مكتمل — نحاس"), (["D5", "F#5", "A5", "D6"], "إنجاز مشرق"), (["Eb5", "G5", "Bb5", "Eb6"], "هدف فخم")]
for i, (ns, nm) in enumerate(GOAL):
    snd(f"goal-{i+1:02d}", f"تحقيق هدف — {nm}", "alerts", "goal", "هدف")(lambda ns=ns, i=i: R(seq([(k * .1, (brass if i % 2 else INSTR["bell"])(N(n), 1.6 - k * .1) if i % 2 else bell(N(n), 1.8, 2.2, .6), .7) for k, n in enumerate(ns)] + [(.4, cymbal(2.0), .2), (.4, kick(.6), .4)], .6), 1.6, .25))
def popseq(n=6, f0=600, step=.06, rise=1.12):
    return seq([(k * step, sine(f0 * rise ** k * np.geomspace(1.6, 1, int(SR * .07)), .07) * env_exp(int(SR * .07), .02), .7) for k in range(n)], .2)
for i, (n, f0, st, fin, nm) in enumerate([(5, 500, .05, "C6", "مرحلة تكبيس — فقاعات"), (8, 400, .04, "E6", "تكبيس متسارع"), (4, 700, .07, "G6", "تكبيس + جرس"), (10, 300, .03, "C7", "انفجار تكبيس"), (6, 550, .055, "A6", "تكبيس لامع")]):
    snd(f"taps-{i+1:02d}", nm, "alerts", "likes", "تكبيس لايكات")(lambda n=n, f0=f0, st=st, fin=fin: R(seq([(0, popseq(n, f0, st), .8), (n * st + .02, bell(N(fin), 1.2, 2.0, .45), .8)], .4), .9, .2))

# ============ 😂 كوميدي ============
def boing(f0=180, d=.8, depth=.5, rate=14, decay=.35):
    t = t_(d); f = f0 * (1 + depth * np.exp(-t / decay) * np.sin(2 * np.pi * rate * t)) * np.geomspace(1, 1.25, len(t))
    return sine(f, d) * env_exp(len(t), d * .45) + .2 * sine(f * 2, d) * env_exp(len(t), .1)
for i, (f0, dpt, rt, nm) in enumerate([(160, .5, 14, "بوينق نابض"), (260, .35, 22, "بوينق سريع"), (110, .6, 9, "بوينق ثقيل"), (340, .4, 30, "سبرنق صغير")]):
    snd(f"boing-{i+1:02d}", nm, "comedy", "", "كرتوني")(lambda f0=f0, dpt=dpt, rt=rt: R(boing(f0, .9, dpt, rt), .5, .1))
def slide(f0, f1, d=.7, vib=6):
    t = t_(d); f = np.geomspace(f0, f1, len(t)) * (1 + .02 * np.sin(2 * np.pi * vib * t)); return (sine(f, d) + .15 * sine(f * 2, d)) * env_adsr(len(t), .03, .1, .9, .1)
snd("slide-up", "صفارة صاعدة", "comedy", "", "كرتوني")(lambda: R(slide(500, 1800, .7), .5, .12))
snd("slide-down", "صفارة هابطة (سقوط)", "comedy", "", "فشل سقوط")(lambda: R(slide(1800, 300, .9), .5, .12))
snd("slide-updown", "صفارة طالعة نازلة", "comedy", "", "استغراب")(lambda: R(np.concatenate([slide(500, 1600, .4), slide(1600, 450, .5)]), .5, .12))
def trombone(notes, last_vib=True, mute=1400):
    out = []
    for k, n in enumerate(notes):
        d = .45 if k < len(notes) - 1 else 1.3; f = N(n); t = t_(d)
        ff = f * (1 + (.03 * np.sin(2 * np.pi * 5 * t) * np.clip(t / .3, 0, 1) if (last_vib and k == len(notes) - 1) else 0)) * np.geomspace(1, .985, len(t))
        out.append(lp(saw(ff, d, 25) * env_adsr(len(t), .03, .1, .8, .12), mute))
    return np.concatenate(out)
snd("sad-trombone", "ترومبون حزين (واه واه واه)", "comedy", "", "فشل خسارة")(lambda: R(trombone(["D4", "C#4", "C4", "B3"]), 1.0, .2))
snd("sad-trombone-2", "واه واه — مكتوم", "comedy", "", "فشل")(lambda: R(trombone(["G3", "F#3", "F3", "E3"], mute=900), 1.0, .2))
snd("rimshot", "بادم تس (نكتة)", "comedy", "", "نكتة")(lambda: R(seq([(0, snare(.25), .8), (.16, tom(140, .3), .7), (.36, snare(.2), .5), (.36, cymbal(1.4), .4)], .4), .8, .15))
snd("rimshot-2", "بادم تس — سريع", "comedy", "", "نكتة")(lambda: R(seq([(0, tom(180, .25), .8), (.12, tom(130, .3), .8), (.26, cymbal(1.2), .5), (.26, kick(.4), .5)], .3), .8, .15))
def honk(f=380, d=.35):
    n = int(SR * d); x = bp(square(f * np.geomspace(1.02, .97, n), d, 30), 300, 1800, 2); return x * env_adsr(n, .01, .05, .8, .06)
snd("honk", "زمور مضحك", "comedy", "", "كرتوني")(lambda: R(honk(), .4, .1))
snd("honk-double", "زمور مزدوج", "comedy", "", "كرتوني")(lambda: R(seq([(0, honk(420, .18), 1), (.22, honk(420, .3), 1)], .2), .4, .1))
snd("honk-low", "زمور ثقيل", "comedy", "", "كرتوني")(lambda: R(honk(190, .6), .5, .1))
for i, (f, nm) in enumerate([(900, "بوب"), (1400, "بوب صغير"), (500, "بوب ثقيل")]):
    snd(f"pop-{i+1:02d}", nm, "comedy", "", "كرتوني")(lambda f=f: R(sine(f * np.geomspace(2.2, 1, int(SR * .09)), .09) * env_exp(int(SR * .09), .025), .3, .1))
snd("pop-multi", "فقاعات متتالية", "comedy", "", "كرتوني")(lambda: R(seq([(k * .07 + .01 * (k % 3), sine(700 * (1.1 ** ((k * 5) % 7)) * np.geomspace(2, 1, int(SR * .08)), .08) * env_exp(int(SR * .08), .02), .8) for k in range(9)], .2), .4, .1))
def wobble(f=220, d=1.0, rate=7):
    t = t_(d); return lp(saw(f * (1 + .25 * np.sin(2 * np.pi * rate * t)), d, 20), 1500) * env_adsr(len(t), .02, .1, .8, .2)
snd("wobble", "هزهزة كرتونية", "comedy", "", "كرتوني استغراب")(lambda: R(wobble(), .5, .1))
snd("wobble-fast", "ارتجاف سريع", "comedy", "", "صدمة")(lambda: R(wobble(330, .7, 16), .5, .1))
def scratch(d=.5):
    n = int(SR * d); t = t_(d); c = 1500 + 1200 * np.sin(2 * np.pi * 3 / d * t); x = np.zeros(n); src = noise(d)
    for k in range(0, n, 512): seg = src[k:k + 512]; fc = c[k]; x[k:k + len(seg)] = bp(seg, fc * .6, fc * 1.4) if len(seg) > 20 else 0
    return x * env_adsr(n, .01, .05, .9, .05)
snd("scratch", "خدش أسطوانة (توقف!)", "comedy", "", "صدمة توقف")(lambda: R(scratch(.45), .3, .05))
snd("scratch-2", "خدش أسطوانة مزدوج", "comedy", "", "صدمة")(lambda: R(seq([(0, scratch(.25), 1), (.28, scratch(.3), 1)], .2), .3, .05))
def crickets(d=3.0, f=4300):
    out = np.zeros(int(SR * d))
    for k in range(int(d * 2.2)):
        at = k / 2.2 + .03 * (k % 2)
        for j in range(3): out = place(out, sine(f + 60 * j, .035) * env_adsr(int(SR * .035), .004, .01, .7, .01), at + j * .045, .5)
    return out[:int(SR * d)]
snd("crickets", "صمت محرج (صراصير)", "comedy", "", "صمت محرج")(lambda: R(crickets(), 1.4, .25))
snd("crickets-2", "صمت محرج — ليلي", "comedy", "", "صمت محرج")(lambda: R(crickets(3.5, 3700) * .8 + .15 * lp(noise(3.5, "pink"), 500), 1.6, .3))
def buzzer(f=140, d=.7):
    n = int(SR * d); x = square(f, d, 25) + square(f * 1.06, d, 25); return lp(x, 2500) * env_adsr(n, .005, .05, .9, .05) * .5
snd("wrong", "خطأ (بززز)", "comedy", "", "خطأ")(lambda: R(buzzer(), .4, .08))
snd("wrong-double", "خطأ مزدوج", "comedy", "", "خطأ")(lambda: R(seq([(0, buzzer(160, .25), 1), (.3, buzzer(120, .5), 1)], .2), .4, .08))
snd("wrong-chip", "خطأ 8-بت", "comedy", "", "خطأ")(lambda: R(seq([(k * .12, chip_square(N(n), .12) * env_adsr(int(SR * .12), .002, .02, .7, .02) * .5, 1) for k, n in enumerate(["E4", "C4", "A3"])], .2), .4, .1))
snd("correct", "صح (دينق)", "comedy", "", "صح فوز")(lambda: R(melody("bell", ["C6", "G6"], .1, .8), .8, .2))
snd("correct-chime", "إجابة صحيحة", "comedy", "", "صح")(lambda: R(melody("marimba", ["E5", "G5", "C6"], .08, .7), .8, .2))
def applause(d=3.0, density=40, sw=True):
    n = int(SR * d); out = np.zeros(n); c = clap(.12)
    for k in range(int(density * d)):
        at = rng.uniform(0, d - .15); g = rng.uniform(.2, .6) * (np.sin(np.pi * at / d) ** .6 if sw else 1)
        cc = bp(c, rng.uniform(700, 1200), rng.uniform(2500, 5000)); out = place(out, cc, at, g)
    return out[:n] + .15 * bp(noise(d, "pink"), 500, 4000) * np.sin(np.linspace(0, np.pi, n)) ** .8
snd("applause-small", "تصفيق خفيف", "comedy", "", "تصفيق")(lambda: R(applause(2.0, 18), 1.2, .25))
snd("applause", "تصفيق حار", "comedy", "", "تصفيق")(lambda: R(applause(3.5, 60), 1.4, .25))
snd("applause-big", "تصفيق جمهور كبير", "comedy", "", "تصفيق احتفال")(lambda: R(applause(5.0, 110), 1.8, .3))
def drumroll(d=1.6, end=True):
    out = np.zeros(int(SR * d)); k = 0; at = 0
    while at < d - .1: out = place(out, snare(.12), at, .25 + .5 * at / d); at += .032 + .004 * (k % 2); k += 1
    if end: out = place(out, cymbal(1.8), d - .05, .7); out = place(out, kick(.5), d - .05, .7)
    return out
snd("drumroll", "طبول تشويق + ضربة", "comedy", "", "تشويق")(lambda: R(drumroll(), 1.0, .2))
snd("drumroll-long", "طبول تشويق طويلة", "comedy", "", "تشويق")(lambda: R(drumroll(3.0), 1.2, .2))
snd("dun-dun", "دن دن دننن (صدمة درامية)", "comedy", "", "صدمة")(lambda: R(seq([(0, brass(N("D3"), .3, bright=1500), 1), (.38, brass(N("F3"), .3, bright=1500), 1), (.8, brass(N("C#3"), 1.8, bright=1200), 1.1), (.8, boom(2.2, 38), .5)], .5), 1.8, .3))
snd("dun-dun-2", "صدمة درامية — أوركسترا", "comedy", "", "صدمة")(lambda: R(seq([(0, pad([N("C3"), N("Eb3"), N("G3")], .35, 2500), 1), (.42, pad([N("Db3"), N("F3"), N("Ab3")], .35, 2500), 1), (.9, pad([N("B2"), N("D3"), N("F3"), N("Ab3")], 2.2, 2200), 1.2), (.9, tom(70, 1.2), .6)], .5), 2.0, .3))
snd("suspense", "لحظة توتر", "comedy", "", "تشويق صدمة")(lambda: R(seq([(0, pad([N("C3"), N("F#3")], 2.5, 1600), .8), (0, hp(noise(2.5), 6000) * np.linspace(0, .2, int(SR * 2.5)), 1), (2.3, boom(1.8, 45), .6)], .4), 1.6, .25))
def runner(d=1.2, base=60):
    sc = [0, 2, 4, 7, 9, 12, 14, 12, 9, 7, 4, 2]; return seq([(k * .05, INSTR["marimba"](N(base + sc[k % len(sc)]), .2), .7) for k in range(int(d / .05))], .3)
snd("cartoon-run", "جري كرتوني", "comedy", "", "كرتوني")(lambda: R(runner(), .6, .1))
snd("cartoon-sneak", "تسلل كرتوني", "comedy", "", "كرتوني")(lambda: R(seq([(k * .28, pluck(N(n), .3, .99, .3), .9) for k, n in enumerate(["E3", "G3", "A3", "Bb3", "A3", "G3", "E3"])], .4), .6, .1))
def kazoo(notes, step=.3):
    out = []
    for n in notes:
        d = step; t = t_(d); f = N(n) * (1 + .012 * np.sin(2 * np.pi * 6 * t)); x = saw(f, d, 40); x = bp(x, 400, 3500) + .3 * hp(noise(d), 3000) * .05
        out.append(x * env_adsr(len(t), .02, .05, .85, .05))
    return np.concatenate(out)
snd("kazoo-tada", "كازو «تادا»", "comedy", "", "مضحك")(lambda: R(kazoo(["C5", "E5", "G5"], .22), .5, .1))
snd("kazoo-fail", "كازو فاشل", "comedy", "", "فشل")(lambda: R(kazoo(["G4", "F4", "Eb4", "D4"], .3), .5, .1))
def squeak(d=.25, f=2200):
    t = t_(d); return sine(f * (1 + .3 * np.sin(np.pi * t / d)), d) * env_adsr(len(t), .01, .05, .7, .05)
snd("squeak", "صوت صرير لعبة", "comedy", "", "كرتوني")(lambda: R(seq([(0, squeak(), .8), (.27, squeak(.2, 2600), .8)], .2), .3, .1))
snd("tada", "تادا!", "comedy", "", "مفاجأة فوز")(lambda: R(seq([(0, brass(N("C5"), .18, bright=3500), .8), (.16, brass(N("G5"), 1.2, bright=3800), 1), (.16, brass(N("E5"), 1.2, bright=3800), .8), (.16, cymbal(1.5), .3)], .4), 1.3, .25))
snd("oops", "أوبس (انزلاق)", "comedy", "", "فشل")(lambda: R(seq([(0, slide(900, 1300, .15), .8), (.17, slide(1300, 350, .45), .9)], .2), .5, .1))
snd("fail-chip", "فشل 8-بت", "comedy", "", "فشل خسارة")(lambda: R(seq([(k * .16, chip_square(N(n), .2) * env_adsr(int(SR * .2), .002, .03, .7, .04) * .5, 1) for k, n in enumerate(["G4", "F#4", "F4", "E4"])], .3), .5, .1))
snd("surprise", "مفاجأة! (صعود حاد)", "comedy", "", "صدمة مفاجأة")(lambda: R(seq([(0, slide(300, 2400, .25), 1), (.25, glass(N("E7"), .6), .6)], .3), .6, .15))
snd("thinking", "تفكير... (تك تك)", "comedy", "", "استغراب")(lambda: R(seq([(k * .35, marimba(N("A5" if k % 2 else "E5"), .2) * .6, 1) for k in range(6)], .3), .5, .1))
snd("hmm", "هممم؟ (استغراب)", "comedy", "", "استغراب")(lambda: R(seq([(0, slide(400, 480, .35), .8), (.42, slide(480, 700, .45), .9)], .3), .5, .12))

# ============ 🔥 حماس وفخامة ============
def fanfare(ns, ts, durs, bright=3600, perc=True, key_boom=False):
    ev = [(t, brass(N(n), d, bright=bright), .8) for n, t, d in zip(ns, ts, durs)]
    if perc: ev += [(ts[-1], cymbal(2.2), .3), (ts[-1], kick(.7), .6), (ts[-1], snare(.4), .3)]
    if key_boom: ev += [(ts[-1], boom(3, 40), .5)]
    return seq(ev, .8)
FAN = [("crown-01", "تتويج ملكي", ["C4", "G4", "C5", "E5", "G5"], [0, .2, .4, .6, .8], [.25, .25, .25, .25, 2.0]),
       ("crown-02", "تتويج — نحاس ذهبي", ["Bb3", "F4", "Bb4", "D5"], [0, .25, .5, .75], [.3, .3, .3, 2.2]),
       ("crown-03", "تاج الداعم الأول", ["D4", "A4", "D5", "F#5", "A5"], [0, .15, .3, .45, .6], [.18, .18, .18, .18, 1.8]),
       ("crown-04", "تتويج أسطوري", ["Eb4", "Bb4", "Eb5", "G5", "Bb5"], [0, .3, .6, .9, 1.2], [.35, .35, .35, .35, 2.6]),
       ("victory-01", "انتصار — فانفير", ["G4", "G4", "G4", "Eb5"], [0, .13, .26, .42], [.12, .12, .12, 1.6]),
       ("victory-02", "انتصار ساحق", ["C5", "C5", "C5", "C5", "Ab4", "Bb4", "C5"], [0, .12, .24, .36, .6, .84, 1.08], [.1, .1, .1, .22, .22, .22, 1.6]),
       ("victory-03", "فوز الفريق", ["F4", "A4", "C5", "F5"], [0, .1, .2, .3], [.12, .12, .12, 1.8]),
       ("victory-04", "بطل البث", ["E4", "B4", "E5", "G#5", "B5"], [0, .18, .36, .54, .72], [.2, .2, .2, .2, 2.0])]
for id_, nm, ns, ts, ds in FAN:
    snd(id_, nm, "hype", "gift", "تتويج انتصار فخم")(lambda ns=ns, ts=ts, ds=ds, id_=id_: R(fanfare(ns, ts, ds, key_boom=id_.endswith("4")), 1.8, .28))
for i, (f, nm) in enumerate([(40, "ضربة سينمائية عميقة"), (52, "ضربة سينمائية حادة"), (34, "ارتطام ملحمي")]):
    snd(f"boom-{i+1:02d}", nm, "hype", "", "سينمائي")(lambda f=f, i=i: R(seq([(0, boom(3.2 + i * .5, f), 1)] + ([(0, cymbal(2.5), .3)] if i == 1 else []), .3), 2.4, .35))
def braam(f=N("C2"), d=3.5, bright=900):
    n = int(SR * d); x = np.zeros(n)
    for m in (1, 2, 1.5, 3):
        for dv in (-.004, 0, .004): x += saw(f * m * (1 + dv), d, 30) / m
    return sweep_lp(x * env_adsr(n, .02, .3, .8, 1.2), 200, bright * 2, q=1.0) * .2 + .5 * boom(d, f)
for i, (n, br, nm) in enumerate([("C2", 900, "براااام سينمائي"), ("A1", 700, "براااام مظلم"), ("D2", 1300, "براااام صادم")]):
    snd(f"braam-{i+1:02d}", nm, "hype", "", "سينمائي صدمة")(lambda n=n, br=br: R(braam(N(n), 3.5, br), 2.6, .35))
for i, (d, f1, nm) in enumerate([(2.0, 5000, "تصاعد + ارتطام"), (3.0, 7000, "تصاعد طويل + انفجار"), (1.4, 4000, "تصاعد سريع")]):
    snd(f"riser-{i+1:02d}", nm, "hype", "", "سينمائي دخول")(lambda d=d, f1=f1: R(seq([(0, riser(d, 150, f1), .7), (d, boom(2.5, 44), .9), (d, cymbal(2.2), .3)], .5), 2.0, .3))
ROYAL = [("royal-01", "دخول ملكي — نحاس", ["C4", "E4", "G4", "C5"], [.5, .5, .5, 2.0]), ("royal-02", "موكب ملكي", ["G3", "C4", "D4", "E4", "G4"], [.4, .4, .4, .4, 2.0]), ("royal-03", "نشيد فخامة", ["F3", "A3", "C4", "F4", "A4", "C5"], [.35, .35, .35, .35, .35, 2.2])]
for id_, nm, ns, ds in ROYAL:
    ts = list(np.cumsum([0] + ds[:-1]))
    snd(id_, nm, "hype", "", "ملكي فخم")(lambda ns=ns, ts=ts, ds=ds: R(seq([(t, brass(N(n), d, bright=2400, voices=4), .8) for n, t, d in zip(ns, ts, ds)] + [(t, tom(80, .5), .5) for t in ts] + [(ts[-1], cymbal(2.5), .25)], .8), 2.2, .3))
ACH = [("achieve-01", "إنجاز جديد", "bell", ["C5", "E5", "G5", "C6", "E6", "G6"], .07), ("achieve-02", "إنجاز — كريستالي", "glass", ["D6", "F#6", "A6", "D7"], .08),
       ("achieve-03", "إنجاز — هارب", "harp", ["G4", "B4", "D5", "G5", "B5", "D6", "G6"], .05), ("achieve-04", "إنجاز — كاليمبا", "kalimba", ["A5", "C#6", "E6", "A6"], .09)]
for id_, nm, ins, ns, st in ACH:
    snd(id_, nm, "hype", "goal", "إنجاز")(lambda ins=ins, ns=ns, st=st: R(seq([(0, melody(ins, ns, st, 1.4), .9), (len(ns) * st, pad([N(ns[0]), N(ns[1]), N(ns[2])], 1.8, 3000), .25)], .6), 1.6, .28))
for i, (base, nm) in enumerate([("C2", "دخول أسطوري"), ("E2", "دخول البطل"), ("G1", "دخول الملك")]):
    snd(f"legend-{i+1:02d}", nm, "hype", "", "أسطوري دخول")(lambda base=base: R(seq([(0, riser(1.6, 200, 6000), .6), (1.6, braam(N(base), 3.0, 1100), .9), (1.6, fanfare([base.replace("1", "4").replace("2", "4")], [0], [2.4], perc=True), .6)], .6), 2.6, .32))
def celebration(key="C", d=3.0):
    root = N(key + "5"); notes = [root * r for r in (1, 1.25, 1.5, 2, 2.5, 3)]
    ev = [(k * .08, bell(f, 1.0, 2.0, .35), .5) for k, f in enumerate(notes)] + [(0, applause(d, 50), .5), (0, cymbal(2), .25)]
    return seq(ev, .5)
for i, (k, nm) in enumerate([("C", "احتفال"), ("F", "احتفال كبير"), ("A", "حفلة دعم")]):
    snd(f"celebrate-{i+1:02d}", nm, "hype", "", "احتفال")(lambda k=k: R(celebration(k), 1.6, .25))
snd("hero-swell", "تصاعد بطولي", "hype", "", "حماس")(lambda: R(seq([(0, pad([N("C3"), N("G3"), N("C4"), N("E4")], 3.5, 2600), 1), (2.6, cymbal(2), .3), (2.6, boom(2, 48), .5)], .6), 2.2, .3))
snd("hero-swell-2", "تصاعد ملحمي — مينور", "hype", "", "حماس")(lambda: R(seq([(0, pad([N("A2"), N("E3"), N("A3"), N("C4")], 3.5, 2400), 1), (2.6, cymbal(2), .3), (2.6, boom(2, 44), .5)], .6), 2.2, .3))

# ============ 🎮 ألعاب ============
def chipmel(ns, step=.09, d=.14, duty=.5):
    return seq([(k * step, chip_square(N(n), d, duty) * env_adsr(int(SR * d), .002, .03, .6, .04) * .45, 1) for k, n in enumerate(ns)], .25)
snd("win-01", "فوز — 8-بت", "games", "", "فوز")(lambda: R(chipmel(["C5", "E5", "G5", "C6", "G5", "C6"], .1, .16), .5, .1))
snd("win-02", "فوز — أجراس", "games", "", "فوز")(lambda: R(melody("bell", ["G5", "C6", "E6", "G6"], .12, 1.2), 1.2, .22))
snd("win-03", "فوز الجولة", "games", "", "فوز")(lambda: R(fanfare(["C5", "E5", "G5"], [0, .12, .24], [.14, .14, 1.2], perc=True), 1.2, .2))
snd("win-04", "فوز — ماريمبا", "games", "", "فوز")(lambda: R(melody("marimba", ["E5", "G#5", "B5", "E6", "B5", "E6"], .09, .7), .8, .15))
snd("lose-01", "خسارة — 8-بت", "games", "", "خسارة")(lambda: R(chipmel(["B4", "F5", "F5", "F5", "E5", "D5", "C5"], .14, .18, .25), .5, .1))
snd("lose-02", "خسارة حزينة", "games", "", "خسارة")(lambda: R(melody("vibes", ["E5", "C5", "A4", "F4"], .28, 1.0), 1.2, .25))
snd("lose-03", "خسارة — نحاس", "games", "", "خسارة")(lambda: R(seq([(k * .35, brass(N(n), .5 if k < 2 else 1.4, bright=1600), .8) for k, n in enumerate(["G4", "F#4", "F4"])], .4), 1.2, .2))
snd("lose-04", "انهزام (هبوط)", "games", "", "خسارة")(lambda: R(seq([(0, slide(800, 120, 1.0) * .8, 1), (.9, boom(1.6, 50), .4)], .4), 1.0, .15))
snd("round-start-01", "بداية الجولة — جرس", "games", "", "بداية")(lambda: R(seq([(0, bell(N("A4"), 2.5, 4.0, .9, 1.4), 1), (0, bell(N("A5"), 2.0, 2.0, .6, 2.0), .4)], .4), 1.8, .25))
snd("round-start-02", "بداية — صفارة", "games", "", "بداية")(lambda: R(sine(2800 * (1 + .015 * np.sin(2 * np.pi * 28 * t_(.6))), .6) * env_adsr(int(SR * .6), .01, .05, .9, .08) * .6, .6, .1))
snd("round-start-03", "استعد... ابدأ!", "games", "", "بداية")(lambda: R(seq([(0, chipmel(["C5"], .1, .25), 1), (.5, chipmel(["C5"], .1, .25), 1), (1.0, chipmel(["C6"], .1, .6), 1.2)], .3), .5, .1))
snd("round-end-01", "نهاية الجولة — جونق", "games", "", "نهاية")(lambda: R(seq([(0, bell(N("D3"), 4.0, 5.0, 1.4, 1.41), 1), (0, lp(noise(2.5), 1200) * env_exp(int(SR * 2.5), .3) * .2, 1)], .5), 2.2, .3))
snd("round-end-02", "نهاية — صفارة مزدوجة", "games", "", "نهاية")(lambda: R(seq([(0, sine(2600, .25) * env_adsr(int(SR * .25), .01, .03, .9, .04) * .6, 1), (.33, sine(2600, .6) * env_adsr(int(SR * .6), .01, .03, .9, .08) * .6, 1)], .3), .6, .1))
snd("round-end-03", "انتهى الوقت", "games", "", "نهاية")(lambda: R(seq([(k * .2, buzzer(220 - k * 10, .18) * .7, 1) for k in range(3)] + [(.6, buzzer(170, .9), 1)], .3), .5, .1))
LVL = [("levelup-01", "مستوى جديد — 8-بت", lambda: chipmel(["C5", "G5", "C6", "E6", "G6", "C7"], .06, .12)), ("levelup-02", "مستوى جديد — لامع", lambda: melody("glass", ["C6", "D6", "E6", "G6", "C7"], .06, .9)),
       ("levelup-03", "ترقية المستوى", lambda: seq([(0, riser(.6, 400, 6000), .5), (.6, melody("bell", ["C6", "E6", "G6"], .05, 1.2), 1)], .4)), ("levelup-04", "مستوى أسطوري", lambda: seq([(0, chipmel(["G4", "C5", "E5", "G5", "C6", "E6"], .05, .1), 1), (.32, fanfare(["C5", "G5"], [0, .15], [.15, 1.4]), .7)], .5))]
for id_, nm, fn in LVL: snd(id_, nm, "games", "", "مستوى")(lambda fn=fn: R(fn(), 1.0, .2))
def beep(f, d=.18): return sine(f, d) * env_adsr(int(SR * d), .003, .02, .8, .03) * .7
snd("countdown-01", "عد تنازلي 3-2-1", "games", "", "عد تنازلي")(lambda: R(seq([(0, beep(880), 1), (1, beep(880), 1), (2, beep(880), 1), (3, beep(1760, .7), 1)], .3), .4, .08))
snd("countdown-02", "عد تنازلي — 8-بت", "games", "", "عد تنازلي")(lambda: R(seq([(k, chipmel(["A4"], .1, .2), 1) for k in range(3)] + [(3, chipmel(["A5"], .1, .7), 1.1)], .3), .4, .08))
snd("countdown-03", "عد تنازلي — طبول", "games", "", "عد تنازلي")(lambda: R(seq([(k, tom(120, .4), 1) for k in range(3)] + [(3, kick(.6), 1), (3, cymbal(1.8), .5)], .3), .9, .15))
snd("challenge-01", "تحدي! (إنذار)", "games", "", "تحدي")(lambda: R(seq([(k * .3, square(N("A5") if k % 2 == 0 else N("E5"), .28, 15) * env_adsr(int(SR * .28), .01, .02, .8, .03) * .35, 1) for k in range(6)], .3), .5, .1))
snd("challenge-02", "تحدي جديد", "games", "", "تحدي")(lambda: R(seq([(0, braam(N("E2"), 1.8, 1500), .7), (0, brass(N("E4"), .3, bright=3000), .6), (.3, brass(N("B4"), 1.4, bright=3000), .8)], .5), 1.5, .25))
snd("challenge-03", "مواجهة!", "games", "", "تحدي")(lambda: R(seq([(0, tom(90, .5), 1), (.25, tom(90, .5), 1), (.5, tom(120, .5), 1), (.75, boom(2.0, 46), .8), (.75, brass(N("D4"), 1.4, bright=2200), .7)], .5), 1.5, .25))
snd("powerup-01", "باور أب", "games", "", "باور")(lambda: R(chip_square(np.geomspace(200, 1600, int(SR * .5)), .5) * env_adsr(int(SR * .5), .005, .05, .8, .1) * .4, .5, .1))
snd("powerup-02", "شحن طاقة", "games", "", "باور")(lambda: R(seq([(0, sine(np.geomspace(150, 1200, int(SR * 1.0)), 1.0) * np.linspace(.2, 1, int(SR * 1.0)) * .6, 1), (1.0, glass(N("E7"), .7), .6)], .3), .8, .15))
snd("powerup-03", "باور أب — تريلو", "games", "", "باور")(lambda: R(seq([(k * .035, chip_square(N(60 + k * 2), .05) * .35, 1) for k in range(14)], .2), .4, .1))
snd("coin-01", "التقاط عملة", "games", "", "عملة")(lambda: R(chipmel(["B5", "E6"], .07, .2), .4, .08))
snd("coin-02", "عملة — جرس", "games", "", "عملة")(lambda: R(coinhit(N("E6")), .6, .12))
snd("coin-03", "عملات متتالية", "games", "", "عملة")(lambda: R(seq([(k * .09, coinhit(N("B5") * (1.06 ** (k % 3))), .6) for k in range(5)], .3), .6, .12))
snd("jump-01", "قفزة", "games", "", "قفز")(lambda: R(chip_square(np.geomspace(300, 900, int(SR * .18)), .18) * env_exp(int(SR * .18), .12) * .4, .3, .05))
snd("jump-02", "قفزة مزدوجة", "games", "", "قفز")(lambda: R(seq([(0, sine(np.geomspace(250, 800, int(SR * .15)), .15) * env_exp(int(SR * .15), .1), 1), (.16, sine(np.geomspace(400, 1200, int(SR * .15)), .15) * env_exp(int(SR * .15), .1), 1)], .2), .3, .05))
for i, (f0, f1, d, nm) in enumerate([(2400, 300, .25, "ليزر"), (1600, 200, .4, "ليزر ثقيل"), (3200, 900, .15, "ليزر سريع")]):
    snd(f"laser-{i+1:02d}", nm, "games", "", "ليزر")(lambda f0=f0, f1=f1, d=d: R(square(np.geomspace(f0, f1, int(SR * d)), d, 12) * env_exp(int(SR * d), d * .6) * .35, .4, .1))
def explosion(d=2.0):
    n = int(SR * d); return lp(noise(d, "brown"), 900) * env_exp(n, .45) + .4 * lp(noise(d), 4000) * env_exp(n, .08) + .6 * kick(d, 90, 30)
snd("explosion-01", "انفجار", "games", "", "انفجار")(lambda: R(explosion(), 1.6, .25))
snd("explosion-02", "انفجار 8-بت", "games", "", "انفجار")(lambda: R(lp(chip_square(np.geomspace(200, 40, int(SR * .8)), .8) * .3 + noise(.8) * .5, 2500) * env_exp(int(SR * .8), .25), .6, .1))
snd("hit-01", "ضربة", "games", "", "ضربة")(lambda: R(seq([(0, kick(.3, 200, 60), 1), (0, snare(.2), .5)], .2), .4, .08))
snd("hit-02", "ضربة قوية", "games", "", "ضربة")(lambda: R(seq([(0, kick(.5, 160, 40), 1), (0, lp(noise(.3), 3000) * env_exp(int(SR * .3), .05), .8), (0, tom(70, .5), .5)], .2), .6, .12))
snd("select-01", "اختيار قائمة", "games", "", "واجهة")(lambda: R(chipmel(["E6"], .1, .06), .2, .05))
snd("select-02", "تأكيد", "games", "", "واجهة")(lambda: R(melody("marimba", ["G5", "D6"], .06, .4), .3, .08))
snd("gameover-01", "انتهت اللعبة", "games", "", "خسارة نهاية")(lambda: R(chipmel(["C5", "G4", "E4", "A4", "B4", "A4", "G#4", "A#4", "G#4", "G4"], .13, .16, .25), .6, .12))
snd("gameover-02", "انتهت اللعبة — درامي", "games", "", "نهاية")(lambda: R(seq([(0, pad([N("C3"), N("Eb3"), N("G3")], 2.5, 1600), 1), (0, bell(N("C3"), 3.0, 4.0, 1.2, 1.41), .5)], .5), 2.0, .3))
snd("combo-01", "كومبو!", "games", "", "كومبو")(lambda: R(seq([(k * .05, glass(N(72 + [0, 4, 7, 12, 16][k]), .5), .6) for k in range(5)], .3), .7, .15))
snd("combo-02", "كومبو — 8-بت", "games", "", "كومبو")(lambda: R(chipmel(["C6", "D6", "E6", "F6", "G6", "A6", "B6", "C7"], .035, .06), .4, .08))
snd("tick-01", "مؤقت (تك تك)", "games", "", "مؤقت")(lambda: R(seq([(k * .5, hp(noise(.03), 3000) * env_exp(int(SR * .03), .008) + .5 * sine(2000, .03) * env_exp(int(SR * .03), .01), 1) for k in range(8)], .2), .2, .05))
snd("tick-02", "مؤقت متسارع", "games", "", "مؤقت")(lambda: R(seq([(sum(.5 * .85 ** j for j in range(k)), marimba(N("C6"), .15) * .7, 1) for k in range(14)], .2), .3, .05))

# ============ 💰 دعم ودونيشن ============
snd("coins-01", "عملة واحدة", "support", "donation", "عملات")(lambda: R(coinhit(N("A5")), .7, .15))
snd("coins-02", "عملتان", "support", "donation", "عملات")(lambda: R(seq([(0, coinhit(N("A5")), 1), (.2, coinhit(N("C#6")), 1)], .3), .7, .15))
def coinshower(n=18, d=1.6):
    return seq([(rng.uniform(0, d), bell(N("E6") * rng.choice([1, 1.122, 1.26, 1.335, 1.5]), .4, 1.3, .1, 2.0), rng.uniform(.25, .55)) for _ in range(n)], .5)
snd("coins-03", "مطر عملات صغير", "support", "donation", "عملات")(lambda: R(coinshower(12, 1.2), .8, .2))
snd("coins-04", "مطر عملات كبير", "support", "donation", "عملات")(lambda: R(coinshower(40, 2.4), 1.0, .2))
snd("coins-05", "سقوط عملة ودوران", "support", "donation", "عملات")(lambda: R(seq([(sum(.18 * .8 ** j for j in range(k)), bell(N("D6"), .3, 1.0, .06, 2.4), .7 * .85 ** k) for k in range(12)], .3), .6, .15))
def register():
    d = .4; drawer = bp(noise(d), 300, 2000) * env_exp(int(SR * d), .08)
    return seq([(0, hp(noise(.05), 2000) * env_exp(int(SR * .05), .01), .6), (.06, drawer, .6), (.12, bell(N("A6"), 1.4, 1.6, .6, 2.76), .9), (.12, bell(N("E6"), 1.4, 1.6, .6, 2.76), .5)], .4)
snd("cash-01", "صندوق كاش (تشينق)", "support", "donation", "كاش")(lambda: R(register(), .9, .18))
snd("cash-02", "كاش — مزدوج", "support", "donation", "كاش")(lambda: R(seq([(0, register(), 1), (.5, coinshower(8, .8), .6)], .3), .9, .18))
snd("cash-03", "عد الفلوس", "support", "donation", "كاش")(lambda: R(seq([(k * .07, hp(noise(.05), 2500) * env_exp(int(SR * .05), .015), .5) for k in range(14)] + [(1.0, bell(N("G6"), 1.0, 1.4, .4, 2.76), .8)], .3), .7, .15))
SUP = [("support-01", "وصول دعم", ["C5", "G5", "C6"], "bell"), ("support-02", "وصول دعم — كريستال", ["E5", "B5", "E6", "G#6"], "glass"), ("support-03", "دعم جديد — هارب", ["F4", "C5", "F5", "A5", "C6"], "harp"), ("support-04", "دعم — فايبرافون", ["D5", "A5", "F#6"], "vibes")]
for id_, nm, ns, ins in SUP:
    snd(id_, nm, "support", "donation", "دعم")(lambda ns=ns, ins=ins: R(seq([(0, coinhit(N(ns[-1]) * 2), .5), (.12, melody(ins, ns, .08, 1.2), 1)], .5), 1.2, .22))
STRONG = [("strong-01", "دعم قوي", ["C4", "E4", "G4", "C5"], [0, .1, .2, .35]), ("strong-02", "دعم قوي — نحاس", ["D4", "F#4", "A4", "D5"], [0, .12, .24, .4]), ("strong-03", "دعم قوي جداً", ["Bb3", "D4", "F4", "Bb4", "D5"], [0, .1, .2, .3, .45])]
for id_, nm, ns, ts in STRONG:
    snd(id_, nm, "support", "donation", "دعم قوي")(lambda ns=ns, ts=ts: R(seq([(0, coinshower(10, .8), .6), (.2, fanfare(ns, [t for t in ts], [.15] * (len(ns) - 1) + [1.6]), .9)], .5), 1.6, .25))
for i, (b, nm) in enumerate([("C2", "دعم أسطوري"), ("F2", "دعم أسطوري — ملحمي"), ("D2", "دعم خرافي")]):
    snd(f"legendary-{i+1:02d}", nm, "support", "donation", "أسطوري")(lambda b=b: R(seq([(0, riser(1.3, 200, 7000), .6), (1.3, braam(N(b), 2.8, 1200), .8), (1.3, coinshower(40, 2.2), .6), (1.3, fanfare([b.replace("2", "4"), b.replace("2", "5")], [0, .2], [.2, 2.2]), .6)], .6), 2.4, .3))
for i, (k, nm) in enumerate([("D", "احتفال مبلغ كبير"), ("G", "احتفال ضخم"), ("Bb", "ليلة الدعم")]):
    snd(f"bigcelebrate-{i+1:02d}", nm, "support", "donation", "احتفال")(lambda k=k: R(seq([(0, celebration(k, 3.0), 1), (.1, coinshower(30, 2.5), .5), (0, fanfare([k + "4", k + "5"], [0, .2], [.2, 2.0]), .5)], .5), 1.8, .28))
snd("rose-01", "وردة — بريق خفيف", "support", "gift", "وردة هدية")(lambda: R(seq([(k * .05, glass(N(n), .7), .6) for k, n in enumerate(["E6", "G#6", "B6"])], .3), .9, .22))
snd("rose-02", "وردة — نسمة", "support", "gift", "وردة هدية")(lambda: R(seq([(0, whoosh(.5, 800, 6000), .3), (.2, INSTR["kalimba"](N("C#6"), .9), .7)], .3), .9, .22))
snd("heart-01", "أحبني — نبض قلب", "support", "gift", "أحبني قلب")(lambda: R(seq([(0, kick(.25, 90, 50), .9), (.18, kick(.25, 80, 45), .7), (.4, glass(N("A6"), .9), .5), (.45, glass(N("E7"), .8), .35)], .4), .9, .2))
snd("heart-02", "أحبني — نغمة حب", "support", "gift", "أحبني قلب")(lambda: R(melody("vibes", ["A5", "C#6", "E6", "A6"], .11, 1.0), 1.1, .25))
snd("lion-01", "أسد — زئير ملحمي", "support", "gift", "أسد هدية كبيرة")(lambda: R(seq([(0, lp(noise(1.6, "brown"), 500) * env_adsr(int(SR * 1.6), .15, .3, .7, .6) * (1 + .5 * np.sin(2 * np.pi * 22 * t_(1.6))), .8), (0, saw(np.geomspace(95, 70, int(SR * 1.6)), 1.6, 20) * env_adsr(int(SR * 1.6), .12, .3, .7, .6) * .35, 1), (1.3, fanfare(["D4", "A4", "D5"], [0, .15, .3], [.15, .15, 1.6]), .7)], .5), 1.8, .28))
snd("lion-02", "أسد — طبول حرب", "support", "gift", "أسد هدية كبيرة")(lambda: R(seq([(k * .3, tom(75 if k % 2 else 95, .5), 1) for k in range(6)] + [(1.8, boom(2.4, 40), .8), (1.8, brass(N("D4"), 1.8, bright=2200), .7)], .5), 1.8, .28))
def space(d=4.0, root="C3"):
    n = int(SR * d); x = pad([N(root), N(root) * 1.5, N(root) * 2, N(root) * 3], d, 2200) * .6
    sh = seq([(rng.uniform(.3, d - .5), glass(N("C7") * rng.choice([1, 1.122, 1.335, 1.5, 1.68]), .9), .25) for _ in range(14)], .2)[:n]
    return x[:n] + np.pad(sh, (0, max(0, n - len(sh))))[:n]
snd("universe-01", "اليونيفرس — فضاء سينمائي", "support", "gift", "يونيفرس هدية كبيرة")(lambda: R(seq([(0, space(4.0, "C3"), 1), (3.2, boom(2.5, 38), .6)], .6), 3.0, .4))
snd("universe-02", "اليونيفرس — مجرّة", "support", "gift", "يونيفرس هدية كبيرة")(lambda: R(seq([(0, riser(2.0, 200, 6000), .5), (2.0, space(3.5, "A2"), 1), (2.0, braam(N("A1"), 3.0, 900), .5)], .6), 3.0, .4))
snd("galaxy-01", "بريق مجرّي", "support", "gift", "هدية")(lambda: R(seq([(k * .06, glass(N(n), 1.0), .45) for k, n in enumerate(["C6", "E6", "G6", "B6", "D7", "G7"])] + [(0, pad([N("C4"), N("G4")], 2.0, 3000), .3)], .5), 2.0, .35))
snd("galaxy-02", "نجوم متلألئة", "support", "gift", "هدية")(lambda: R(seq([(rng.uniform(0, 1.8), glass(N("A6") * rng.choice([1, 1.189, 1.335, 1.498, 1.782]), .8), .35) for _ in range(16)], .5), 1.8, .35))
