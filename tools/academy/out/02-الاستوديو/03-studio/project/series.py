# B6O6 Academy — نظام التصميم الموحّد + منشئ الحلقات (مرجع ثابت: الحلقة 01 المعتمدة)
# كل حلقة = افتتاحية تسويقية (0–4) · فائدة (4–10) · الخيارات/التصاميم (10–20) · الخطوات عملياً (20–42) · النتيجة في بث تجريبي (42–52) · الخاتمة الموحّدة (52–59)
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
NAMES = ["أبو فهد", "نورة", "سلطان", "ريم", "خالد", "سارة", "فيصل", "لمى", "تركي", "هيا"]
SEED = r"""(()=>{const N=%s;const s=e=>__arsh.send({t:'sim',ev:e});
for(let i=0;i<40;i++){const u={id:'u'+(i%%10),name:N[i%%10]};s({type:'like',id:'l'+i,platform:'tiktok',user:u,count:15+(i%%7)*20});
 if(i%%4==0)s({type:'gift',id:'g'+i,platform:'tiktok',user:u,gift:'Rose',giftId:5655,diamonds:1,value:[1,30,99,500][i%%4],count:1});
 if(i%%3==0)s({type:'comment',id:'c'+i,platform:['tiktok','youtube','kick','twitch'][i%%4],user:u,text:['هلا والله 🔥','بث أسطوري','كمل كمل 💪','وش اسم اللعبة؟'][i%%4]})}})();
(()=>{ go('subathon'); const a=document.querySelector('[data-sa-op="start"]'); if(a) a.click(); go('duration'); const b=document.querySelector('[data-duop="durStart"]'); if(b) b.click(); go('home'); })()""" % json.dumps(NAMES, ensure_ascii=False)
# --- نظام التصميم (مستخرج من الحلقة 01) ---
DESIGN = dict(fonts=dict(head="Alexandria 700/800", body="IBM Plex Sans Arabic 500/600"), colors=dict(bg="#04060c", accent="#2f7bff", em="#4d8dff", text="#eef3ff", muted="#8794b4"),
  type=dict(hook=92, line=76, step=64, kicker=30), safe=dict(textTop=250, textBottom=1700), motion=dict(word_in=.62, stagger=.07, exit=.38, ease="expo-out / cubic in-out"),
  timing=dict(intro=[0, 4], benefit=[4, 10], options=[10, 20], howto=[20, 42], result=[42, 52], outro=[52, 59]), music="120 BPM — حدود المقاطع على المازورة (كل 2ث)")
class Ep:
    def __init__(s, num, slug, folder, title, page, intro):
        s.num, s.slug, s.folder, s.title, s.page = num, slug, folder, title, page
        s.d = dict(dur=59, seed=SEED, intro=dict(end=4.0, **intro), app=[4.0, 42.0], live=[42.0, 52.0], out=52.0, cam=[], acts=[], texts=[], kicks=[])
        s.desc = ""; s.steps_n = 4
    # نصوص
    def tx(s, t0, t1, txt, sm=False): s.d["texts"].append([t0, t1, txt] + ([{"sm": 1}] if sm else []))
    def kk(s, t0, t1, txt): s.d["kicks"].append([t0, t1, txt])
    def step(s, n, t0, t1, txt): s.kk(t0, t1, f"الخطوة <b>{n}</b> من {s.steps_n}"); s.tx(t0, t1, txt, True)
    # كاميرا
    def cam(s, t, f=None, z=1.0, **k): s.d["cam"].append(dict(t=t, f=f or [640, 420], z=z, **k))
    # إجراءات
    def a(s, **k): s.d["acts"].append(k)
    def mv(s, t, sel, d=.8, **k): s.a(t=t, move=sel, d=d, **k); return t + d
    def cl(s, t, sel, d=.8, **k): s.mv(t, sel, d); s.a(t=t + d + .1, click=1, **k); return t + d + .1
    def nav(s, t, page): return s.cl(t, f'.nav [data-go="{page}"]')
    def ty(s, t, sel, text, cps=11): s.a(t=t, type=text, sel=sel, cps=cps); return t + len(text) / cps
    def ring(s, t, sel, d=1.6): s.a(t=t, ring=sel, d=d)
    def scroll(s, t, y, d=1.4): s.a(t=t, scroll=y, d=d)
    def sel(s, t, sel, **k): s.a(t=t, select=sel, **k)
    def js(s, t, code): s.a(t=t, js=code)
    # نتيجة البث
    def result_layout(s, widgets):  # widgets: [(type, {x,y,w,h,...})]
        code = "(()=>{const l={id:'l_acad',name:'نتيجة الأكاديمية',canvas:L().canvas,widgets:[]};let z=1;" + "".join(
            f"l.widgets.push(newWidget({json.dumps(t)},Object.assign({{z:z++}},{json.dumps(o, ensure_ascii=False)})));" for t, o in widgets) + "S.layouts.push(l);save()})()"
        s.d["seed"] += ";" + code; s.d["ovl"] = "overlayURL(S.layouts.find(l=>l.id==='l_acad'))"
    def ev(s, t, ev, snd=None): s.a(t=t, sim=ev, **({"snd": snd} if snd else {}))
    def likes(s, t0, n=20, gap=.42, users=6, base=30):
        for i in range(n): s.ev(t0 + i * gap, dict(type="like", id=f"L{s.num}_{i}", platform="tiktok", user=dict(id=f"r{i % users}", name=NAMES[i % users]), count=base + (i * 13) % 70))
    def comments(s, t0, lines, gap=1.3, plats=("tiktok",)):
        for i, tx in enumerate(lines): s.ev(t0 + i * gap, dict(type="comment", id=f"C{s.num}_{i}", platform=plats[i % len(plats)], user=dict(id=f"q{i}", name=NAMES[(i + 3) % 10]), text=tx))
    def gift(s, t, name, i, gift="Rose", gid=5655, dia=1, value=30, count=30, snd=None):
        s.ev(t, dict(type="gift", id=f"G{s.num}_{t}", platform="tiktok", user=dict(id=f"r{i}", name=name), gift=gift, giftId=gid, diamonds=dia, value=value, count=count), snd)
    def follow(s, t, name, i, snd=None): s.ev(t, dict(type="follow", id=f"F{s.num}_{t}", platform="tiktok", user=dict(id=f"nf{i}", name=name)), snd)
    def save(s):
        os.makedirs(os.path.join(HERE, "episodes", "v2"), exist_ok=True)
        p = os.path.join(HERE, "episodes", "v2", f"{s.num:02d}-{s.slug}.json"); json.dump(s.d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        meta = dict(num=s.num, slug=s.slug, folder=s.folder, title=s.title, page=s.page, hook=s.d["intro"].get("hook") or s.d["intro"].get("title"), desc=s.desc)
        json.dump(meta, open(p.replace(".json", ".meta.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1); return p
EP = {}
def ep(f): EP[f.__name__] = f; return f
