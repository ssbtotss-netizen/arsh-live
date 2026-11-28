# الدفعة B: الحلقات 07–11
from series import Ep, ep, EP
from eps_a import enter, result_texts
import sys

@ep
def sounds():
    e = Ep(7, "sounds", "05-الأصوات", "مكتبة الأصوات والميمز", "sounds", dict(style="counter", num=308, hook="خلّ كل فولو|*له صوت مختلف!*", sub="مكتبة الأصوات"))
    enter(e, "sounds")
    e.tx(4.4, 6.9, "*+300* صوت أصلي"); e.tx(7.1, 9.8, "لكل *تفاعل* في بثك"); e.cam(8.0, [640, 330], 1.25); e.cam(9.8, [640, 330], 1.25)
    e.kk(10.4, 19.9, "<b>B6O6</b> · مكتبة الأصوات")
    e.tx(10.4, 14.6, "تنبيهات · *حماس* · كوميدي", True); e.cl(10.4, '[data-k="cat:hype"]', .8); e.cam(10.8, [600, 420], 1.15, ry=3); e.cl(12.6, '[data-k="cat:comedy"]', .7); e.mv(13.6, [560, 520], .8)
    e.tx(15.0, 19.8, "*جرّبه* قبل تستخدمه"); e.cl(15.0, '[data-k="all"]', .7); e.cl(16.2, '[data-snd="prev"][data-s="lib:follow-02"]', .8, snd="follow-02"); e.cam(16.4, '[data-snd="prev"][data-s="lib:follow-02"]', 1.9); e.cam(19.6, '[data-snd="prev"][data-s="lib:follow-02"]', 1.8)
    e.step(1, 20.4, 25.3, "ابحث عن *الصوت*"); e.cam(20.4, [640, 420], 1.0); e.cl(20.6, '[data-sndf="q"]', .8); e.cam(21.4, '[data-sndf="q"]', 1.9, dy=0); e.ty(21.8, '[data-sndf="q"]', "فولو", 6)
    e.cl(23.2, '[data-snd="prev"][data-s="lib:follow-01"]', .8, snd="follow-01"); e.cam(23.6, '[data-snd="prev"][data-s="lib:follow-01"]', 1.8); e.cam(25.2, '[data-snd="use"][data-s="lib:follow-01"]', 1.7)
    e.step(2, 25.6, 30.6, "اضغط *استخدام الصوت*"); e.cl(25.8, '[data-snd="use"][data-s="lib:follow-01"]', .8); e.ring(25.9, '[data-snd="use"][data-s="lib:follow-01"]', .8); e.cam(27.0, [640, 400], 1.3); e.mv(27.6, '[data-snd="uev"][data-k="follow"]', 1.2); e.cam(30.2, [640, 380], 1.35)
    e.step(3, 31.0, 36.1, "اختر *متى يشتغل*"); e.a(t=31.2, click=1); e.ring(31.3, '[data-snd="uev"][data-k="follow"]', 2.0); e.cam(31.6, '[data-snd="uev"][data-k="follow"]', 1.8); e.cl(33.6, '[data-snd="usesave"]', .9); e.cam(33.8, '[data-snd="usesave"]', 2.0); e.cam(36.0, [640, 420], 1.1)
    e.step(4, 36.5, 41.6, "أضف *المشغّل لـ OBS*"); e.js(36.4, "(q=>{q.value='';q.dispatchEvent(new Event('input',{bubbles:true}))})(document.querySelector('[data-sndf=\"q\"]'))"); e.scroll(36.6, 0, .8); e.cl(37.2, '[data-snd="addplayer"]', .9); e.ring(37.4, '[data-snd="addplayer"]', 2.4); e.cam(37.6, '[data-snd="addplayer"]', 2.0); e.cam(41.2, '[data-snd="addplayer"]', 1.9); e.cam(42.0, [640, 420], .95)
    e.result_layout([("recentFollows", dict(x=.1, y=.30, w=.8, h=.3, title="آخر المتابعين")), ("sndplayer", dict(x=.1, y=.64, w=.8, h=.12))])
    e.follow(43.0, "سلطان", 2, "follow-01"); e.follow(46.0, "لمى", 4, "follow-01"); e.follow(49.0, "تركي", 5, "follow-01")
    result_texts(e, "والنتيجة؟", "كل فولو *له صوته*")
    e.desc = "مكتبة الأصوات: أكثر من 300 صوت أصلي، تجربة الصوت، البحث، «استخدام الصوت» واختيار متى يشتغل (فولو، هدية، تكبيس…)، وإضافة مشغل الأصوات لـ OBS."
    return e

@ep
def subathon():
    e = Ep(8, "subathon", "06-السبثون", "السبثون وقوانينه", "subathon", dict(style="split", hook="خلّ جمهورك|*يتحكم بوقت بثك!*", sub="السبثون وقوانينه"))
    enter(e, "subathon")
    e.tx(4.4, 6.9, "كل هدية *تزيد الوقت*"); e.tx(7.1, 9.8, "وجمهورك *يمدّد البث*"); e.cam(7.6, [700, 330], 1.5); e.cam(9.8, [700, 330], 1.5)
    e.kk(10.4, 19.9, "<b>B6O6</b> · نظام السبثون")
    e.tx(10.4, 14.6, "قواعد *للعملات والهدايا*", True); e.cl(10.4, '[data-sajump="sa-s2"]', .8); e.cam(10.8, [640, 420], 1.05); e.mv(12.2, [600, 450], 1.0); e.cam(13.6, [640, 420], 1.2, ry=3)
    e.tx(15.0, 19.8, "تصاميم *للعدّاد*"); e.scroll(14.8, 0, .6); e.cl(15.4, '[data-sajump="sa-s4"]', .8); e.cam(15.8, [640, 420], 1.05); e.mv(17.0, [560, 450], 1.2); e.cam(19.6, [600, 420], 1.2, ry=-3)
    e.step(1, 20.4, 25.3, "أضف *وقت* بضغطة"); e.scroll(20.2, 0, .9); e.cam(20.4, [640, 420], 1.0); e.cl(21.2, '[data-sa-add="600000"]', .9); e.cam(21.6, '[data-sa-add="600000"]', 1.6, dx=-200); e.a(t=23.4, click=1); e.cam(25.2, [300, 420], 1.5)
    e.step(2, 25.6, 30.6, "حدّد *قواعد الهدايا*"); e.cl(25.8, '[data-sajump="sa-s3"]', .8); e.cam(26.4, [640, 420], 1.0); e.mv(27.4, [700, 360], 1.0); e.cam(27.8, [700, 330], 1.45, ry=3); e.cam(30.4, [640, 360], 1.3)
    e.step(3, 31.0, 36.1, "اعرض *قوانين السبثون*"); e.cam(31.0, [640, 420], 1.0); e.nav(31.0, "library"); e.cl(32.6, '[data-libtab="rules"]', .8); e.cam(33.2, [640, 430], 1.1, ry=3); e.mv(34.4, [560, 520], 1.2); e.cam(36.0, [600, 450], 1.2)
    e.step(4, 36.5, 41.6, "تحكّم *بالإيقاف والاستكمال*", ); e.cam(36.6, [640, 420], 1.0); e.nav(36.6, "subathon"); e.cl(38.2, '[data-sa-op="pause"]', .8); e.cam(38.4, '[data-sa-op="pause"]', 1.8); e.cl(39.8, '[data-sa-op="resume"]', .6); e.cam(41.4, '[data-sa-op="resume"]', 1.8); e.cam(42.0, [640, 420], .95)
    e.result_layout([("subathon", dict(x=.12, y=.20, w=.76, h=.13)), ("srules", dict(x=.1, y=.40, w=.8, h=.34))])
    e.gift(43.2, "نورة", 1, value=30, count=30, snd="gift-02"); e.gift(46.4, "خالد", 4, gift="Lion", gid=6369, dia=29999, value=299, count=1, snd="tier-50"); e.gift(49.2, "ريم", 3, value=99, count=1, snd="gift-05")
    result_texts(e, "والنتيجة؟", "الوقت *يزيد مع كل هدية*")
    e.desc = "السبثون: إضافة وخصم الوقت بضغطة، قواعد العملات والهدايا، تصاميم العداد، لوحة قوانين السبثون، والإيقاف والاستكمال."
    return e

@ep
def goals():
    e = Ep(9, "goals", "07-الأهداف", "أهداف الدعم", "boards", dict(style="mask", hook="حمّس جمهورك|*على هدف واحد*", sub="أهداف الدعم"))
    enter(e, "boards")
    e.tx(4.4, 6.9, "هدف *واضح* للدعم"); e.tx(7.1, 9.8, "يتعبّى *قدام جمهورك*"); e.cam(7.6, '[data-add-vg="goldCup"]', 1.6); e.cam(9.8, '[data-add-vg="goldCup"]', 1.6)
    e.kk(10.4, 19.9, "<b>B6O6</b> · مكتبة التصاميم")
    e.tx(10.4, 14.6, "*+30* تصميم للأهداف"); e.cam(10.4, [640, 420], 1.0); e.nav(10.2, "library"); e.cl(11.8, '[data-libtab="goals"]', .7); e.scroll(13.0, 700, 1.8); e.cam(13.0, [600, 420], 1.15, ry=3)
    e.tx(15.0, 19.8, "كأس · كنز · *ألماسة*"); e.scroll(15.2, 1500, 2.0); e.mv(15.6, [520, 480], 1.2); e.cam(16.4, [560, 430], 1.25, ry=-3); e.cam(19.6, [560, 430], 1.25)
    e.step(1, 20.4, 25.3, "افتح *قوائم الترتيب*"); e.cam(20.4, [640, 420], 1.0); e.nav(20.2, "boards"); e.mv(21.8, '[data-add-vg="treasureChest"]', .9); e.cam(22.2, [400, 240], 1.7); e.cam(25.0, [400, 240], 1.7)
    e.step(2, 25.6, 30.6, "اختر *شكل الهدف*"); e.a(t=25.9, click=1); e.ring(25.9, '[data-add-vg="treasureChest"]', 2.0); e.mv(27.4, '[data-add-vg="goldCup"]', .9); e.a(t=28.4, click=1); e.cam(30.2, [500, 260], 1.4)
    e.step(3, 31.0, 36.1, "رتّبه *في الاستوديو*"); e.cam(31.0, [640, 420], 1.0); e.nav(31.0, "studio"); e.cam(32.8, [560, 430], 1.35); e.mv(33.4, [560, 460], 1.0); e.cam(36.0, [560, 430], 1.35)
    e.step(4, 36.5, 41.6, "انسخ الرابط لـ *OBS*"); e.cam(36.6, [640, 420], 1.0); e.nav(36.6, "obs"); e.cl(38.3, '[data-copyall]', .9); e.ring(38.6, '[data-copyall]', 2.2); e.cam(38.8, '[data-copyall]', 2.1); e.cam(41.0, '[data-copyall]', 2.0); e.cam(42.0, [640, 420], .95)
    e.d["appCss"] = ".code{filter:blur(5px)}"
    e.result_layout([("sgoal", dict(x=.12, y=.22, w=.76, h=.42, design="treasureChest", source="giftPoints", target=1000, title="هدف الليلة", icon="🪙"))])
    e.gift(43.0, "سارة", 5, value=99, count=1, snd="gift-01"); e.gift(45.4, "تركي", 8, gift="Lion", gid=6369, dia=29999, value=299, count=1, snd="tier-50"); e.gift(48.2, "نورة", 1, gift="Universe", gid=7934, dia=34999, value=500, count=1, snd="tier-100"); e.gift(50.4, "هيا", 9, value=100, count=100, snd="tier-100")
    result_texts(e, "والنتيجة؟", "الهدف *يتعبّى لحظياً*")
    e.desc = "أهداف الدعم: أكثر من 30 تصميم (كأس، كنز، ألماسة، هدف دائري)، إضافة الهدف من قوائم الترتيب، ترتيبه في الاستوديو ونسخ رابط OBS."
    return e

@ep
def challenges():
    e = Ep(10, "challenges", "03-القوائم", "تحديات التكبيس", "layouts", dict(style="focus", hook="تحدّى جمهورك|*بالتكبيس!*", sub="تحديات التكبيس"))
    enter(e, "layouts")
    e.tx(4.4, 6.9, "تصاميم *تحديات* جاهزة"); e.tx(7.1, 9.8, "*بضغطة* تستخدمها"); e.cam(7.6, [640, 300], 1.3); e.cam(9.8, [640, 300], 1.3)
    e.kk(10.4, 19.9, "<b>B6O6</b> · مكتبة تصاميم البث")
    e.tx(10.4, 14.6, "ألعاب · شاتينق · *سابثون*"); e.cl(10.4, '[data-lycat="gaming"]', .8); e.cam(10.8, [640, 420], 1.05, ry=3); e.cl(12.4, '[data-lycat="subathon"]', .8); e.mv(13.6, [560, 560], .8)
    e.tx(15.0, 19.8, "*عمودي* وأفقي"); e.cl(15.0, '[data-lyshape="vertical"]', .8); e.cam(15.4, [640, 440], 1.1, ry=-3); e.cl(17.2, '[data-lyshape=""]', .7); e.cam(19.6, [640, 420], 1.05)
    e.step(1, 20.4, 25.3, "اختر *تحديات التكبيس*"); e.cl(20.6, '[data-lycat="likes"]', .9); e.cam(21.0, '[data-lycat="likes"]', 1.9); e.cam(23.0, [640, 480], 1.1); e.mv(23.6, '[data-lyuse="off_likes"]', 1.0)
    e.step(2, 25.6, 30.6, "اضغط *استخدام*"); e.ring(25.6, '[data-lyuse="off_likes"]', 2.0); e.cam(25.8, '[data-lyuse="off_likes"]', 2.0); e.a(t=26.8, click=1); e.cam(27.6, [640, 400], 1.05); e.cl(27.4, '[data-lt="likes"]', .7); e.cam(28.4, '[data-lt="likes"]', 1.5); e.cl(29.0, '[data-li="use"]', .8); e.cam(30.4, [640, 420], 1.05)
    e.step(3, 31.0, 36.1, "أضف *هدف الإعجابات*"); e.nav(31.0, "likes"); e.cam(31.4, [640, 420], 1.0); e.cl(32.8, '[data-lsadd="goal"]', .9); e.cam(33.2, '[data-lsadd="goal"]', 2.0); e.cam(36.0, [300, 560], 1.4)
    e.step(4, 36.5, 41.6, "ابدأ *جلسة جديدة*"); e.scroll(36.4, 0, .8); e.cam(36.6, [640, 420], 1.0); e.cl(37.4, '[data-sessnew]', 1.0); e.ring(37.6, '[data-sessnew]', 1.4); e.cam(37.8, '[data-sessnew]', 1.9); e.cl(39.2, '[data-ok]', .7); e.cam(39.6, '[data-ok]', 1.9); e.cam(41.2, [700, 300], 1.4); e.cam(42.0, [640, 420], .95)
    e.result_layout([("goal", dict(x=.1, y=.18, w=.8, h=.12, target=5000, title="تحدي التكبيس")), ("lb", dict(topN=3, x=.08, y=.36, w=.84, h=.38, source="likes", design="fireCircle", title="أبطال التكبيس", icon="❤️"))])
    for i in range(26): e.ev(42.5 + i * .34, dict(type="like", id=f"L10_{i}", platform="tiktok", user=dict(id=f"c{i % 4}", name=["خالد", "هيا", "فيصل", "سارة"][i % 4]), count=150 + (i * 53) % 120))
    result_texts(e, "والنتيجة؟", "التحدي *يشتعل لحظياً*")
    e.desc = "تحديات التكبيس: تصاميم بث جاهزة من مكتبة التصاميم (قسم تحديات التكبيس)، استخدامها بضغطة، إضافة هدف الإعجابات، وبدء جلسة جديدة."
    return e

@ep
def followers():
    e = Ep(11, "followers", "08-المتابعين", "عدادات المتابعين", "followers", dict(style="rise", hook="عدّاد متابعينك|*يكبر قدامك*", sub="عدادات المتابعين"))
    enter(e, "followers")
    e.tx(4.4, 6.9, "*خمس منصات* في مكان واحد"); e.tx(7.1, 9.8, "والعدّاد *يتحدّث لحظياً*"); e.cam(7.6, [640, 160], 1.6); e.cam(9.8, [640, 160], 1.6)
    e.kk(10.4, 19.9, "<b>B6O6</b> · مكتبة التصاميم")
    e.tx(10.4, 14.6, "*60* تصميم للعدّاد"); e.cam(10.4, [640, 420], 1.0); e.cl(10.4, '[data-libtab="fcount"]', .9); e.scroll(12.6, 800, 1.8); e.cam(12.8, [600, 430], 1.15, ry=3)
    e.tx(15.0, 19.8, "*أرقام* بحركة ناعمة"); e.scroll(15.0, 1600, 2.0); e.mv(15.4, [520, 480], 1.2); e.cam(16.2, [560, 430], 1.25, ry=-3); e.cam(19.6, [560, 430], 1.25)
    e.step(1, 20.4, 25.3, "أضف *عدّاد المنصة*"); e.cam(20.4, [640, 420], 1.0); e.nav(20.2, "followers"); e.cl(21.8, '[data-fcadd="tiktok"]', .9); e.cam(22.2, '[data-fcadd="tiktok"]', 1.9); e.cam(25.0, '[data-fcadd="tiktok"]', 1.8)
    e.step(2, 25.6, 30.6, "اكتب *عددك الحالي*"); e.cl(25.8, '[data-fcset-in="tiktok"]', .9); e.cam(26.2, '[data-fcset-in="tiktok"]', 2.0); e.ty(26.9, '[data-fcset-in="tiktok"]', "12500", 8); e.cl(28.4, '[data-fcset="tiktok"]', .7); e.cam(30.2, '[data-fcset="tiktok"]', 1.9)
    e.step(3, 31.0, 36.1, "ابدأ *جلسة جديدة*"); e.cl(31.2, '[data-fcsession="tiktok"]', .8); e.ring(31.4, '[data-fcsession="tiktok"]', 2.2); e.cam(31.6, '[data-fcsession="tiktok"]', 1.9); e.cam(36.0, [640, 420], 1.1)
    e.step(4, 36.5, 41.6, "جرّب *متابع تجريبي*"); e.scroll(36.4, 1100, 1.2); e.cam(36.6, [640, 420], 1.0); e.cl(37.8, '[data-fctest="1"]', .9); e.cam(38.0, '[data-fctest="1"]', 2.0); e.cl(39.6, '[data-fctest="25"]', .6); e.cam(41.4, '[data-fctest="25"]', 1.9); e.cam(42.0, [640, 420], .95)
    e.result_layout([("fcount", dict(x=.1, y=.28, w=.8, h=.2, platform="tiktok"))])
    for i, n in enumerate(["ريم", "سلطان", "هيا", "تركي", "لمى", "فيصل"]): e.follow(42.8 + i * 1.4, n, 10 + i, "follow-05" if i % 2 else None)
    result_texts(e, "والنتيجة؟", "كل متابع *ينحسب لحظياً*")
    e.desc = "عدادات المتابعين: TikTok وYouTube وInstagram وTwitch وKick، 60 تصميم، تعيين العدد الحالي، جلسة جديدة، وتجربة متابع تجريبي."
    return e

if __name__ == "__main__":
    for n in (sys.argv[1:] or EP.keys()): print(EP[n]().save())
