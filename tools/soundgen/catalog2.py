# الدفعة الثانية من أصوات B6O6 الأصلية (توليد كامل — لا عينات ولا مقاطع منسوخة)
# عائلات جديدة: لمسة عربية (عود/قانون/ناي على مقامات حقيقية بأرباع الأتوار + دربكة بإيقاعات تقليدية)،
# ألعاب، كوميدي، تنبيهات، دعم، حماس. التكرار يُرفض آلياً في build.py (بصمة طيفية).
import numpy as np
from synth import *
from catalog import snd, INSTR, melody, chord, R, seq, N

def qn(n, q=0.0): return note(n) * 2 ** (q / 12)  # q = نصف/ربع تون (−0.5 = ربع تون منخفض)
def oud(f, d=1.1): return lp(pluck(f, d, .993, .55), 3200) * 1.1 + .15 * pluck(f * 2, d, .99, .4)
def qanun(f, d=.9): return pluck(f, d, .997, .85) * .9 + .25 * pluck(f * 1.003, d, .997, .8)
def ney(f, d=1.2):
    n = int(SR * d); t = t_(d); vib = 1 + .006 * np.sin(2 * np.pi * 5.2 * t) * np.clip(t / .3, 0, 1)
    tone = np.sin(2 * np.pi * np.cumsum(f * vib) / SR) + .25 * np.sin(2 * np.pi * np.cumsum(2 * f * vib) / SR)
    br = bp(noise(d), f * .8, min(f * 3.5, 16000)) * .35
    return (tone * .8 + br) * env_adsr(n, .12, .1, .8, .35)
INSTR.update({"oud": oud, "qanun": qanun, "ney": ney})
def phrase(inst, notes, ts=None, step=.16, dur=1.0, tail=.6):
    ts = ts or [i * step for i in range(len(notes))]
    return seq([(t, INSTR[inst](f, dur), 1) for t, f in zip(ts, notes)], tail)

# مقامات (نوتات بأرباع الأتوار الحقيقية)
MAQ = {
    "حجاز": [qn("D4"), qn("D#4"), qn("F#4"), qn("G4"), qn("A4"), qn("A#4"), qn("C5"), qn("D5")],
    "راست": [qn("C4"), qn("D4"), qn("E4", -.5), qn("F4"), qn("G4"), qn("A4"), qn("B4", -.5), qn("C5")],
    "بياتي": [qn("D4"), qn("E4", -.5), qn("F4"), qn("G4"), qn("A4"), qn("A#4"), qn("C5"), qn("D5")],
    "نهاوند": [qn("C4"), qn("D4"), qn("D#4"), qn("F4"), qn("G4"), qn("G#4"), qn("B4"), qn("C5")],
    "كرد": [qn("D4"), qn("D#4"), qn("F4"), qn("G4"), qn("A4"), qn("A#4"), qn("C5"), qn("D5")],
    "صبا": [qn("D4"), qn("E4", -.5), qn("F4"), qn("F#4"), qn("A4"), qn("A#4"), qn("C5"), qn("D5")],
}
# جمل قصيرة مختلفة (فهارس في السلم) — كل مقام × جملة × آلة = صوت مختلف فعلاً
MOT = [("صعود", [0, 1, 2, 3, 4]), ("قفلة", [4, 3, 2, 1, 0]), ("زخرفة", [0, 2, 1, 3, 2, 4]), ("ترحيب", [4, 2, 4, 7]), ("سؤال", [0, 3, 2, 4])]
INS3 = [("oud", "عود"), ("qanun", "قانون"), ("ney", "ناي")]
k = 0
for mi, (mq, sc) in enumerate(MAQ.items()):
    for j, (mn, idx) in enumerate(MOT):
        ins, inm = INS3[(mi + j) % 3]
        octv = [1, 2, .5, 2, 1][j] if ins != "ney" else [1, 2, 1, 2, 1][j]  # سجلات مختلفة فعلاً
        step = {"oud": [.12, .2, .09, .16, .26][j], "qanun": [.07, .15, .06, .11, .19][j], "ney": [.2, .32, .18, .26, .4][j]}[ins]
        k += 1
        snd(f"arab-{k:02d}", f"{inm} — مقام {mq} ({mn})", "arabic", "", f"عربي {inm} مقام {mq}")(
            lambda sc=sc, idx=idx, ins=ins, step=step, octv=octv: R(phrase(ins, [sc[i] * octv for i in idx], step=step, dur=1.3 if ins == "ney" else 1.0), 1.1, .22))

# دربكة: دُم (منخفض) / تك (حاد) / كا (خفيف) — إيقاعات تقليدية
def doum(d=.45): return seq([(0, tom(78, d), .9), (0, lp(noise(.05), 600) * env_exp(int(SR * .05), .015), .4)], 0)
def tek(d=.18): return hp(noise(d), 2500) * env_exp(int(SR * d), .025) * .8 + sine(620, d) * env_exp(int(SR * d), .02) * .5
def ka(d=.14): return hp(noise(d), 3500) * env_exp(int(SR * d), .018) * .45
DR = {"D": doum, "T": tek, "K": ka}
RHY = [("مقسوم", "D T . T D . T .", .13), ("بلدي", "D D . T D . T .", .13), ("سعيدي", "D T . D D . T .", .13), ("ملفوف", "D . T . T .", .12),
       ("أيوب", "D . K D T .", .14), ("فلاحي", "D T D T D T T .", .1), ("وحدة", "D . . T . . T .", .14), ("خليجي", "D . T K D . T K", .11)]
for i, (nm, pat, st) in enumerate(RHY):
    ev = [(j * st, DR[c](), 1.0) for j, c in enumerate(pat.split()) if c in DR]
    snd(f"darbuka-{i+1:02d}", f"دربكة — إيقاع {nm}", "arabic", "", "دربكة طبلة إيقاع")(lambda ev=ev: R(seq(ev + [(e[0] + len(pat.split()) * st, e[1], e[2]) for e in ev], .4), .6, .12))
# دخلات عربية للتنبيهات (عود + دربكة)
for i, (mq, nm, ev_) in enumerate([("حجاز", "فولو — عود حجاز", "follow"), ("راست", "هدية — قانون راست", "gift"), ("نهاوند", "دعم — عود نهاوند", "donation"), ("بياتي", "اشتراك — ناي بياتي", "subscribe")]):
    sc = MAQ[mq]; ins = ["oud", "qanun", "oud", "ney"][i]
    snd(f"arab-alert-{i+1:02d}", nm, "arabic", ev_, "عربي تنبيه")(lambda sc=sc, ins=ins: R(seq([(0, doum(), .8), (.0, phrase(ins, [sc[0], sc[2], sc[4], sc[7]], step=.11), 1), (.44, tek(), .6)], .6), 1.0, .2))

# ============ 🎮 ألعاب (جديدة) ============
def beep(f, d=.18): return sine(f, d) * env_adsr(int(SR * d), .003, .02, .8, .03) * .7
CD = [("countdown-11", "عد تنازلي — بيب كلاسيكي", lambda: seq([(i, beep(880 if i < 3 else 1760, .2 if i < 3 else .6), 1) for i in range(4)], .3)),
      ("countdown-14", "عد تنازلي — ساعة", lambda: seq([(i * .5, hp(noise(.03), 3000) * env_exp(int(SR * .03), .008), 1) for i in range(8)] + [(4.0, bell(N("A5"), 1.2), .8)], .3)),
      ("countdown-15", "عد تنازلي — نبض متسارع", lambda: seq([(sum(.6 * .82 ** j for j in range(i)), beep(660 + i * 40, .12), 1) for i in range(10)] + [(3.0, beep(1320, .5), 1)], .3))]
for id_, nm, fn in CD: snd(id_, nm, "games", "", "عد تنازلي")(lambda fn=fn: R(fn(), .5, .1))
RND = [
]
for id_, nm, fn in RND: snd(id_, nm, "games", "", "جولة")(fn)
LOSE = [("lose-11", "خسارة — هبوط 8-بت", ["G5", "E5", "C5", "G4"]), ("lose-12", "خسارة — ماريمبا حزينة", ["E5", "D5", "C5", "A4"]), ("lose-13", "خسارة — أجراس منخفضة", ["C5", "A4", "F4", "D4"])]
for id_, nm, ns in LOSE:
    ins = "chip" if "8-بت" in nm else "marimba" if "ماريمبا" in nm else "bell"
    snd(id_, nm, "games", "", "خسارة")(lambda ns=ns, ins=ins: R(melody(ins, ns, .22, 1.0), .8, .18))
FX = [
      ("pickup-01", "التقاط عنصر", lambda: seq([(0, chip_square(N("E6"), .06) * .4, 1), (.06, chip_square(N("B6"), .2) * env_exp(int(SR * .2), .1) * .4, 1)], .2)),
      ("shield-01", "درع", lambda: R(fm(N("A4"), 1.5, 6, 1.0, env_exp(int(SR * 1.0), .3)) * env_adsr(int(SR * 1.0), .02, .2, .5, .4) * .5, .8, .3)),
      ("dash-01", "اندفاع سريع", lambda: bp(noise(.35), 800, 6000) * np.linspace(0, 1, int(SR * .35)) ** 2 * env_exp(int(SR * .35), .3) * 1.2),
      ("menu-select", "اختيار في القائمة", lambda: seq([(0, beep(1200, .06), 1)], .1)),
      ("menu-cancel", "إلغاء", lambda: seq([(0, beep(700, .07), 1), (.08, beep(470, .14), 1)], .2)),
      ("boss-01", "ظهور الزعيم", lambda: R(seq([(0, braam_like(N("C2"), 2.5), 1), (0, tom(55, 1.0), .8)], .5), 1.4, .3)),
      ("sudden-01", "الموت المفاجئ", lambda: seq([(i * .25, square(N("A3") if i % 2 == 0 else N("G#3"), .22, 12) * env_adsr(int(SR * .22), .005, .05, .7, .05) * .3, 1) for i in range(8)], .3)),
      ("coin-chip", "عملة 8-بت", lambda: seq([(0, chip_square(N("B5"), .07) * .4, 1), (.07, chip_square(N("E6"), .35) * env_exp(int(SR * .35), .15) * .4, 1)], .2)),
      ("checkpoint", "نقطة حفظ", lambda: R(melody("glass", ["G5", "C6", "E6", "G6"], .07, .7), .8, .2)),
      ("victory-8bit", "فوز 8-بت طويل", lambda: chipmel_simple(["G5", "G5", "G5", "E5", "F5", "G5", "F5", "G5", "C6"], [0, .12, .24, .36, .6, .72, .84, .96, 1.1], .1))]
def braam_like(f, d): return lp(brass(f, d, vib=0, bright=900, voices=4), 1200) * env_adsr(int(SR * d), .05, .3, .7, .8)
def chipmel_simple(ns, ts, d): return seq([(t, chip_square(N(n), d) * env_adsr(int(SR * d), .002, .03, .6, .03) * .4, 1) for n, t in zip(ns, ts)], .3)
for id_, nm, fn in FX: snd(id_, nm, "games", "", "لعبة")(fn)

# ============ 😂 كوميدي (جديدة) ============
CM = [
      ("drama-01", "دن دن دااان (درامي)", lambda: R(seq([(0, brass(N("D3"), .3, bright=1800), 1), (.4, brass(N("F3"), .3, bright=1800), 1), (.8, brass(N("C#3"), 1.6, bright=1800), 1)], .5), 1.2, .25)),
      ("cuckoo", "ساعة الوقواق", lambda: seq([(i * .5 + j * .18, sine(N(n), .16) * env_adsr(int(SR * .16), .01, .03, .7, .05) * .5, 1) for i in range(2) for j, n in enumerate(["E6", "C6"])], .3)),
      ("spring-01", "زنبرك", lambda: np.sin(2 * np.pi * np.cumsum(220 + 160 * np.sin(2 * np.pi * 18 * t_(.7)) * np.exp(-t_(.7) * 3)) / SR) * env_exp(int(SR * .7), .35) * .6),
      ("duck", "بطة مطاطية", lambda: seq([(i * .22, bp(saw(N("A5") * (1 - .1 * i), .14, 20), 900, 3200) * env_adsr(int(SR * .14), .005, .05, .7, .05) * .8, 1) for i in range(2)], .2)),
      ("tiptoe", "مشي على أطراف الأصابع", lambda: seq([(i * .25, pluck(N(n), .2, .99, .5), .8) for i, n in enumerate(["C5", "D5", "E5", "F5", "G5", "F5", "E5", "D5"])], .3)),
      ("oops-01", "أوبس", lambda: seq([(0, slide_simple(800, 1200, .1), 1), (.12, slide_simple(1100, 500, .25), 1)], .2)),
      ("tada-small", "تادا صغيرة", lambda: R(chord("harp", ["C5", "E5", "G5", "C6"], 1.0, .03), .8, .2)),
      ("whistle-fall", "صفارة نازلة كرتونية", lambda: slide_simple(2400, 400, 1.2)),
      ("whistle-rise", "صفارة صاعدة كرتونية", lambda: slide_simple(500, 2600, .9)),
      ("glass-break", "تكسر زجاج", lambda: seq([(0, hp(noise(.5), 3000) * env_exp(int(SR * .5), .12), 1)] + [(.02 + i * .05, glass(N("C7") * (1 + .13 * i), .4, .1), .3) for i in range(6)], .3)),
      ("pop-cork", "فلّينة", lambda: seq([(0, bp(noise(.04), 400, 3000) * env_exp(int(SR * .04), .01) * 1.2, 1), (.03, sine(520, .12) * env_exp(int(SR * .12), .04) * .5, 1)], .2)),
      ("zip", "سحّاب", lambda: bp(noise(.5), 2000, 7000) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 60 * t_(.5)))) * env_adsr(int(SR * .5), .01, .05, .8, .05) * .7),
      ("sneeze", "عطسة كرتونية (بدون كلام)", lambda: seq([(0, bp(noise(.35), 600, 2000) * np.linspace(0, 1, int(SR * .35)) * .5, 1), (.36, hp(noise(.2), 1500) * env_exp(int(SR * .2), .05) * 1.2, 1)], .2)),
      ("tick-tock", "تك تك انتظار", lambda: seq([(i * .5, (hp(noise(.02), 4000) if i % 2 else bp(noise(.02), 1500, 3000)) * env_exp(int(SR * .02), .006) * 1.4, 1) for i in range(8)], .2)),
      ("wrong-02", "خطأ — بيب بيب", lambda: seq([(0, square(330, .18, 10) * .25, 1), (.24, square(330, .3, 10) * .25, 1)], .2)),
      ("wrong-03", "خطأ — كرتوني", lambda: seq([(0, honk_simple(300, .2), 1), (.22, honk_simple(250, .35), 1)], .2)),
]
def slide_simple(f0, f1, d): f = np.geomspace(f0, f1, int(SR * d)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_adsr(int(SR * d), .01, .05, .8, .1) * .5
def honk_simple(f, d): return lp(saw(f, d, 25), 1600) * env_adsr(int(SR * d), .01, .05, .8, .05) * .5
for id_, nm, fn in CM: snd(id_, nm, "comedy", "", "كوميدي")(fn)

# ============ 🔔 تنبيهات (جديدة) ============
SHARE = [("share-11", "مشاركة البث — نقرتان", lambda: seq([(0, glass(N("A6"), .4, .15), 1), (.09, glass(N("E7"), .6, .2), 1)], .3)),
         ("share-12", "مشاركة البث — طيران", lambda: seq([(0, bp(noise(.4), 1000, 8000) * np.linspace(0, 1, int(SR * .4)) * env_exp(int(SR * .4), .4), 1), (.35, bell(N("D6"), .8, 2.0, .3), .8)], .3))]
for id_, nm, fn in SHARE: snd(id_, nm, "alerts", "share", "مشاركة")(lambda fn=fn: R(fn(), .8, .2))
TAPS = [(1000, ["C5", "E5"], "marimba"), (2000, ["D5", "F#5", "A5"], "marimba"), (5000, ["E5", "G#5", "B5", "E6"], "glass"), (10000, ["C5", "E5", "G5", "C6", "E6"], "bell"), (50000, ["C4", "G4", "C5", "E5", "G5", "C6"], "brassy")]
for n, ns, ins in TAPS:
    snd(f"taps-{n}", f"مرحلة تكبيس {n:,}".replace(",", "٬"), "alerts", "taps", "تكبيس مرحلة")(lambda ns=ns, ins=ins: R(melody(ins, ns, .08 if ins != "brassy" else .14, 1.0 if ins != "brassy" else .6), 1.0, .22))
JOIN2 = [("join-11", "دخول مشاهد — نقطة ماء", lambda: np.sin(2 * np.pi * np.cumsum(np.geomspace(900, 1800, int(SR * .12))) / SR) * env_exp(int(SR * .12), .04) * .6),
         ("join-12", "دخول مشاهد — باب لطيف", lambda: seq([(0, marimba(N("G5"), .4), .7), (.1, marimba(N("D6"), .6), .7)], .2))]
for id_, nm, fn in JOIN2: snd(id_, nm, "alerts", "join", "دخول")(fn)
SUB2 = [("sub-11", "اشتراك — كورد ناعم", lambda: R(chord("vibes", ["F5", "A5", "C6", "E6"], 1.4, .05), 1.0, .25)),
        ("sub-12", "اشتراك — نجمة", lambda: R(seq([(0, glass(N("B6"), .8, .25), 1), (.05, glass(N("F#7"), 1.0, .3), .7)] + [(.1 + i * .04, glass(N("C8") * (1 + .07 * i), .3, .08), .2) for i in range(6)], .4), 1.0, .25))]
for id_, nm, fn in SUB2: snd(id_, nm, "alerts", "subscribe", "اشتراك")(fn)

# ============ 💰 دعم (جديدة) ============
SP2 = [("jackpot-01", "جاكبوت", lambda: seq([(i * .05, bell(N("C6") * (1 + (i % 4) * .25), .2, 1.5, .06), .5) for i in range(30)] + [(1.6, bell(N("C7"), 1.5, 2.0, .6), 1)], .4)),
       ("gems-01", "مجوهرات لامعة", lambda: R(seq([(i * .06, glass(N(n), .7, .25), .6) for i, n in enumerate(["E7", "B6", "G#7", "E7", "C#8"])], .4), 1.0, .3)),
       ("coin-drop-01", "عملة تسقط على الطاولة", lambda: seq([(sum(.18 * .7 ** j for j in range(i)), bell(N("A6"), .15, 2.0, .05, 2.6) * (.85 ** i), 1) for i in range(9)], .3)),
       ("tier-5", "دعم 5$ — لمسة", lambda: R(melody("glass", ["G6", "D7"], .07, .6), .7, .2)),
       ("tier-20", "دعم 20$ — احتفال صغير", lambda: R(melody("bell", ["C6", "E6", "G6", "C7"], .07, .9), .9, .22)),
       ("tier-50", "دعم 50$ — حماس", lambda: R(seq([(0, brass(N("G4"), .2), 1), (.22, brass(N("C5"), .2), 1), (.44, brass(N("E5"), .7), 1), (.44, cymbal(1.2), .4)], .4), 1.0, .22)),
       ("tier-100", "دعم 100$ — فخم", lambda: R(seq([(0, boom(1.6, 48), .7), (0, chord("brassy", ["C4", "G4", "C5", "E5"], 1.6, .04), 1), (.1, cymbal(2.0), .5)], .4), 1.3, .28)),
       ("tier-200", "دعم 200$ — أسطوري", lambda: R(seq([(0, riser(1.4, 200, 6000), .5), (1.4, boom(2.0, 42), .9), (1.4, chord("brassy", ["D4", "A4", "D5", "F#5", "A5"], 2.0, .03), 1), (1.45, cymbal(2.5), .5)], .5), 1.5, .3)),
       ("tier-500", "دعم 500$ — خاص جداً", lambda: R(seq([(0, riser(2.0, 120, 8000), .5), (2.0, boom(3.0, 38), 1), (2.0, chord("brassy", ["C3", "G3", "C4", "E4", "G4", "C5"], 2.6, .05), 1), (2.05, cymbal(3.0), .5)] + [(2.3 + i * .08, glass(N("C7") * (1 + .12 * (i % 5)), .5, .15), .25) for i in range(12)], .6), 1.6, .32))]
for id_, nm, fn in SP2: snd(id_, nm, "support", "donation" if id_.startswith("tier") else "", "دعم")(fn)

# ============ 🔥 حماس (جديدة) ============
HY = [("timpani-01", "رول تمباني + ضربة", lambda: R(seq([(i * .045, tom(90, .25) * (.3 + .7 * i / 30), 1) for i in range(30)] + [(1.4, boom(2.0, 50), 1)], .4), 1.3, .25)),
      ("drumfill-01", "فيل طبول حماسي", lambda: seq([(i * .09, (snare(.15) if i % 2 else tom(160 - i * 6, .3)), .8) for i in range(12)] + [(1.1, kick(.5), 1), (1.1, cymbal(1.8), .7)], .4)),
      ("choir-01", "كورال ملائكي", lambda: R(choir([N("C4"), N("G4"), N("C5"), N("E5")], 3.0), 1.6, .35)),
      ("choir-02", "كورال ملحمي", lambda: R(seq([(0, choir([N("A3"), N("E4"), N("A4"), N("C5")], 1.4), 1), (1.4, choir([N("F3"), N("C4"), N("F4"), N("A4")], 2.2), 1)], .5), 1.6, .35)),
      ("anthem-01", "نشيد انتصار", lambda: R(seq([(t, brass(N(n), d, bright=3200), 1) for n, t, d in [("C4", 0, .3), ("E4", .3, .3), ("G4", .6, .3), ("C5", .9, .9), ("A4", 1.8, .3), ("C5", 2.1, 1.2)]] + [(.9, cymbal(1.5), .4), (2.1, cymbal(2.0), .5)], .5), 1.3, .25)),
      ("impact-rise-02", "تصاعد قصير + ضربة", lambda: seq([(0, riser(.9, 300, 7000), .7), (.9, boom(1.6, 55), 1), (.9, hp(noise(.3), 2000) * env_exp(int(SR * .3), .08) * .5, 1)], .4)),
      ("heartbeat", "نبضات توتر", lambda: seq([(i * .8 + j * .22, kick(.25, 90, 40) * (1 if j == 0 else .7), 1) for i in range(4) for j in range(2)], .3)),
      ("horn-stadium", "بوق الملعب", lambda: R(chord("brassy", ["F3", "C4", "F4", "A4"], 1.6, 0), 1.2, .25)),
      ("sparkle-rise", "تصاعد لامع", lambda: R(seq([(i * .05, glass(N("C6") * 2 ** (i / 12), .5, .15), .35) for i in range(25)], .5), 1.2, .3))]
def choir(fs, d):
    n = int(SR * d); out = np.zeros(n)
    for f in fs:
        src = saw(f * (1 + .003 * np.random.default_rng(int(f)).standard_normal()), d, 30)
        v = bp(src, 650, 1100) * .9 + bp(src, 1100, 1400) * .5 + bp(src, 2400, 2900) * .25  # فورمنت «آآه»
        out += v
    return out / len(fs) * env_adsr(n, .5, .3, .8, .9) * 1.6
for id_, nm, fn in HY: snd(id_, nm, "hype", "", "حماس")(fn)

# ============ الدفعة الثالثة: عائلات جديدة ============
def sweep(f0, f1, d, wave="sine"):
    f = np.geomspace(f0, f1, int(SR * d)); ph = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(ph) if wave == "sine" else np.sign(np.sin(ph)) * .5)
G3 = [("sword-01", "سيف — اشتباك", lambda: seq([(0, hp(noise(.08), 3000) * env_exp(int(SR * .08), .02), 1), (0, glass(N("E7"), .8, .25) * .6, 1), (0, glass(N("A7") * 1.04, .6, .2) * .4, 1)], .3)),
      ("bow-01", "سهم ينطلق", lambda: seq([(0, pluck(110, .2, .97, .9), .8), (.05, bp(noise(.4), 2000, 8000) * np.linspace(1, 0, int(SR * .4)) ** 2, .6)], .2)),
      ("reload-01", "إعادة تلقيم", lambda: seq([(0, bp(noise(.05), 800, 3000) * env_exp(int(SR * .05), .01) * 1.3, 1), (.18, bp(noise(.06), 1500, 5000) * env_exp(int(SR * .06), .012) * 1.3, 1), (.3, kick(.1, 400, 150) * .5, 1)], .2)),
      ("teleport-01", "انتقال آني", lambda: R(seq([(0, sweep(200, 3000, .5) * env_adsr(int(SR * .5), .01, .1, .7, .2) * .4, 1), (0, sweep(260, 3900, .5) * env_adsr(int(SR * .5), .01, .1, .7, .2) * .3, 1)], .4), 1.0, .35)),
      ("freeze-01", "تجميد", lambda: R(seq([(i * .03, glass(N("C7") * (1 + .09 * (i % 7)), .6, .2), .3) for i in range(16)] + [(0, hp(noise(.8), 6000) * env_exp(int(SR * .8), .4) * .3, 1)], .4), 1.1, .3)),
      ("fire-01", "تعويذة نار", lambda: seq([(0, lp(noise(1.0), 900) * env_adsr(int(SR * 1.0), .05, .2, .6, .4) * 1.4, 1), (0, sweep(120, 60, 1.0) * env_exp(int(SR * 1.0), .5) * .5, 1)], .3)),
      ("heal-01", "شفاء", lambda: R(melody("vibes", ["C5", "E5", "G5", "B5", "D6"], .1, 1.2), 1.2, .3)),
      ("ufo-01", "صحن طائر", lambda: sine(700, 1.6) * (1 + .5 * np.sin(2 * np.pi * 6 * t_(1.6))) * env_adsr(int(SR * 1.6), .2, .1, .8, .4) * .25 + sine(1400, 1.6) * .05),
      ("robot-01", "روبوت يتكلم (بيبات)", lambda: seq([(i * .11, square(N(n), .09, 8) * env_adsr(int(SR * .09), .003, .02, .7, .02) * .25, 1) for i, n in enumerate(["C5", "G5", "E5", "A5", "D5", "B5", "C6"])], .2)),
      ("typing-01", "كتابة على الكيبورد", lambda: seq([(i * .07 + (.03 if i % 3 == 0 else 0), bp(noise(.025), 1500, 6000) * env_exp(int(SR * .025), .006) * 1.4, 1) for i in range(14)], .2)),
      ("shutter-01", "تصوير كاميرا", lambda: seq([(0, bp(noise(.04), 1000, 6000) * env_exp(int(SR * .04), .01) * 1.4, 1), (.07, bp(noise(.05), 600, 4000) * env_exp(int(SR * .05), .012) * 1.2, 1)], .2)),
      ("siren-01", "صفارة إنذار", lambda: sweep(600, 1200, .6) * .3 if False else np.sin(2 * np.pi * np.cumsum(850 + 300 * np.sin(2 * np.pi * 1.1 * t_(2.4))) / SR) * env_adsr(int(SR * 2.4), .05, .1, .9, .3) * .4),
      ("taiko-01", "طبول الحرب (تايكو)", lambda: R(seq([(t, tom(70, .8), g) for t, g in [(0, 1), (.4, .7), (.6, .7), (1.0, 1), (1.4, .8), (1.6, .8), (1.8, 1)]], .6), 1.3, .25)),
      ("strings-01", "وتريات ملحمية", lambda: R(seq([(0, pad([N("D3"), N("A3"), N("D4"), N("F4")], 2.2, 2200), 1), (1.1, pad([N("A#2"), N("F3"), N("A#3"), N("D4")], 2.2, 2200), 1)], .5), 1.5, .35)),
      ("treasure-01", "فتح كنز", lambda: R(seq([(0, kick(.2, 120, 60), .6), (.15, bp(noise(.3), 300, 1500) * env_exp(int(SR * .3), .1), .5), (.35, melody("glass", ["C6", "E6", "G6", "C7", "E7"], .06, .8), 1)], .5), 1.1, .3)),
      ("piggy-01", "حصالة", lambda: seq([(i * .11, bell(N("D6") * (1 + .06 * i), .2, 2.0, .06, 2.4) * (.9 ** i), 1) for i in range(5)] + [(.6, lp(noise(.2), 1500) * env_exp(int(SR * .2), .05) * .5, 1)], .3)),
      ("bonus-01", "مكافأة", lambda: R(seq([(i * .05, chip_square(N(n), .06) * .3, 1) for i, n in enumerate(["G5", "B5", "D6", "G6", "B6", "D7", "G7"])], .4), .8, .2)),
      ("fall-thud", "سقطة كرتونية", lambda: seq([(0, sweep(1800, 250, .6) * env_adsr(int(SR * .6), .01, .05, .8, .05) * .4, 1), (.62, kick(.4, 120, 40), 1), (.62, lp(noise(.2), 800) * env_exp(int(SR * .2), .05) * .8, 1)], .3)),
      ("poof-01", "اختفاء سحري (بوف)", lambda: R(seq([(0, bp(noise(.4), 400, 4000) * env_exp(int(SR * .4), .12) * 1.2, 1)] + [(.05 + i * .04, glass(N("G7") * (1 + .1 * i), .3, .1), .2) for i in range(6)], .3), 1.0, .3)),
      ("balloon-01", "بالون يفش", lambda: bp(noise(1.2), 300, 2500) * (1 + .8 * np.sin(2 * np.pi * np.cumsum(np.geomspace(30, 8, int(SR * 1.2))) / SR)) * env_adsr(int(SR * 1.2), .02, .1, .8, .2) * .5),
      ("slowclap-01", "تصفيق بطيء (سخرية)", lambda: seq([(i * .7, clap(.35), 1) for i in range(5)], .3)),
      ("doorbell-01", "جرس باب", lambda: R(seq([(0, bell(N("E5"), 1.2, 1.5, .6, 2.0), 1), (.45, bell(N("C5"), 1.6, 1.5, .8, 2.0), 1)], .5), 1.0, .2)),
      ("tritone-01", "إشعار ثلاثي", lambda: seq([(i * .1, marimba(N(n), .6), 1) for i, n in enumerate(["A5", "E6", "C#6"])], .4)),
      ("xylo-up", "زيلوفون صاعد", lambda: R(seq([(i * .04, marimba(N("C5") * 2 ** (i * 2 / 12), .4), .6) for i in range(14)], .4), .8, .2)),
      ("harp-gliss", "هارب منساب طويل", lambda: R(seq([(i * .035, pluck(N("C4") * 2 ** (i * 2 / 12), 1.2, .997, .5), .4) for i in range(22)], .6), 1.3, .3)),
      ("wind-01", "رياح", lambda: bp(noise(2.5), 300, 1800) * (0.5 + 0.5 * np.sin(2 * np.pi * .4 * t_(2.5))) * env_adsr(int(SR * 2.5), .5, .3, .8, .8) * .8),
      ("thunder-01", "رعد", lambda: R(seq([(0, lp(noise(2.5), 400) * env_exp(int(SR * 2.5), .8) * 1.6, 1), (0, hp(noise(.2), 1500) * env_exp(int(SR * .2), .05) * .6, 1)], .5), 1.4, .3)),
      ("level-gong", "مستوى جديد — جونق", lambda: R(seq([(0, bell(N("G2"), 3.0, 1.2, 1.4, 2.76), 1), (.05, melody("bell", ["G5", "D6", "G6"], .1, 1.0), .5)], .5), 1.4, .3))]
CAT3 = {"sword-01": "games", "bow-01": "games", "reload-01": "games", "teleport-01": "games", "freeze-01": "games", "fire-01": "games", "heal-01": "games", "ufo-01": "comedy", "robot-01": "comedy",
        "typing-01": "comedy", "shutter-01": "alerts", "siren-01": "hype", "taiko-01": "hype", "strings-01": "hype", "treasure-01": "support", "piggy-01": "support", "bonus-01": "support",
        "fall-thud": "comedy", "poof-01": "comedy", "balloon-01": "comedy", "slowclap-01": "comedy", "doorbell-01": "alerts", "tritone-01": "alerts", "xylo-up": "alerts", "harp-gliss": "hype",
        "wind-01": "hype", "thunder-01": "hype", "level-gong": "games"}
for id_, nm, fn in G3: snd(id_, nm, CAT3[id_], "", "")(fn)
