# الدفعة A: الحلقات 02–06 (كل الأزرار والأقسام حقيقية من النسخة التجريبية — راجع /tmp/vt/pages.json)
from series import Ep, ep, EP
import sys

def enter(e, page, t=4.5):  # النافذة تدخل على الرئيسية ثم تفتح صفحة الميزة من القائمة الجانبية
    e.cam(4.0, [640, 400], 1, ry=-9, rx=4); e.cam(6.0, [640, 400], 1)
    e.a(t=4.0, move=[700, 380], d=.1); e.nav(t, page)

def result_texts(e, a="والنتيجة؟", b="بثك يتفاعل *لحظياً*"):
    e.tx(42.3, 44.9, a); e.tx(45.1, 51.6, b); e.kk(45.1, 51.6, "بث تجريبي · أحداث حقيقية من المحرك")

@ep
def connect():
    e = Ep(2, "connect", "01-البداية", "ربط حسابات البث", "connections", dict(style="mask", hook="اربط بثك في *دقيقة*", sub="ربط حسابات البث"))
    enter(e, "connections")
    e.tx(4.4, 6.9, "اربط *تيك توك* باليوزر"); e.tx(7.1, 9.8, "*بدون* كلمة مرور")
    e.cam(8.0, [700, 300], 1.25); e.cam(9.8, [700, 300], 1.25)
    # الخيارات: المنصات + جدول الدعم + الشات الموحد
    e.kk(10.4, 19.9, "<b>B6O6</b> · مركز ربط البثوث")
    e.tx(10.4, 14.6, "كل منصة *وحالة ربطها*"); e.cam(10.6, [640, 420], 1.0); e.scroll(11.2, 560, 1.8); e.mv(11.0, [520, 360], 1.2); e.cam(13.6, [600, 380], 1.15, ry=4)
    e.tx(15.0, 19.8, "*شات موحّد* لكل منصاتك", True); e.scroll(15.2, 1000, 1.8); e.mv(15.6, '[data-ucadd]', 1.0); e.cam(17.4, '[data-ucadd]', 1.6); e.cam(19.6, '[data-ucadd]', 1.6)
    e.steps_n = 4
    e.step(1, 20.4, 25.3, "اكتب *يوزرك* في تيك توك"); e.scroll(20.0, 0, 1.0); e.cam(20.6, [640, 420], 1.0)
    e.cl(20.9, '[data-set="tiktok"]', .9); e.cam(21.8, '[data-set="tiktok"]', 2.0); e.ty(22.2, '[data-set="tiktok"]', "b6o6_demo"); e.cam(24.9, '[data-set="tiktok"]', 2.0)
    e.step(2, 25.6, 30.6, "واضغط *اتصال*"); e.mv(25.7, '[data-tiktok]', .8); e.ring(26.0, '[data-tiktok]', 2.6); e.cam(26.6, '[data-tiktok]', 2.3); e.cam(30.2, '[data-tiktok]', 2.2)
    e.step(3, 31.0, 36.1, "جرّب *رسالة تجربة*"); e.cl(31.2, '[data-conntest="tiktok"]', .9); e.cam(31.6, '[data-conntest="tiktok"]', 2.0); e.cam(35.0, [700, 330], 1.3)
    e.step(4, 36.5, 41.6, "تابعها في *الشات المباشر*"); e.cam(36.6, [640, 420], 1.0); e.nav(36.8, "livechat"); e.cam(38.6, [600, 380], 1.25, ry=-3); e.mv(39.0, [560, 420], 1.2); e.cam(42.0, [640, 420], .95)
    e.result_layout([("uchat", dict(x=.06, y=.30, w=.88, h=.46))])
    e.comments(42.6, ["يا هلا والله 👋", "بث أسطوري 🔥", "من يوتيوب نتابعك 🙌", "كمل كمل 💪", "الله يعطيك العافية", "👏👏👏", "أقوى ستريمر"], 1.15, ("tiktok", "tiktok", "youtube", "tiktok"))
    result_texts(e, "والنتيجة؟", "تعليقات بثك *توصل لحظياً*")
    e.desc = "اربط بث تيك توك باليوزر فقط وبدون كلمة مرور، جرّب برسالة تجربة، وتابع كل التعليقات في الشات الموحد."
    return e

@ep
def studio():
    e = Ep(3, "studio", "02-الاستوديو", "استوديو تصميم البث", "studio", dict(style="focus", hook="صمّم بثك|*على ذوقك!*", sub="استوديو البث"))
    enter(e, "studio")
    e.tx(4.4, 6.9, "كل عناصر *بثك*"); e.tx(7.1, 9.8, "على *شاشة وحدة*"); e.cam(8.0, [560, 420], 1.3); e.cam(9.8, [560, 420], 1.3)
    e.kk(10.4, 19.9, "<b>B6O6</b> · استوديو البث")
    e.tx(10.4, 14.6, "تخطيطات *جاهزة*"); e.mv(10.4, '[data-act="pickLayout"]', .9); e.cam(10.6, '[data-act="pickLayout"]', 1.5)
    e.sel(11.6, '[data-act="pickLayout"]', idx=1); e.cam(12.0, [560, 420], 1.25); e.sel(13.0, '[data-act="pickLayout"]', idx=2); e.sel(14.3, '[data-act="pickLayout"]', idx=0)
    e.tx(15.0, 19.8, "*عمودي* أو أفقي"); e.cl(14.9, '[data-canvas="horizontal"]', .8); e.cam(15.2, [520, 380], 1.15, ry=3); e.cl(17.4, '[data-canvas="vertical"]', .8); e.cam(19.6, [560, 400], 1.2)
    e.step(1, 20.4, 25.3, "أضف *عنصر* جديد"); e.mv(20.4, '[data-act="addW"]', .9); e.cam(20.6, '[data-act="addW"]', 1.9); e.ring(20.9, '[data-act="addW"]', 1.4)
    e.sel(22.4, '[data-act="addW"]', value="fcount"); e.cam(23.2, [560, 430], 1.35); e.cam(25.2, [560, 430], 1.35)
    e.step(2, 25.6, 30.6, "تحكّم *بالطبقات*"); e.cl(25.8, '[data-tog="visible"]', .9); e.cam(26.2, '[data-tog="visible"]', 1.7); e.cl(28.0, '[data-tog="visible"]', .5); e.cam(30.4, [700, 400], 1.3)
    e.step(3, 31.0, 36.1, "*شارك* تصميمك"); e.cl(31.2, '[data-lyshare]', .9); e.cam(31.6, '[data-lyshare]', 1.9); e.cam(34.8, [640, 400], 1.1)
    e.js(35.9, "document.querySelectorAll('.modal,.mdl,.ovl,[data-close]').forEach(x=>{if(x.dataset&&x.dataset.close!==undefined)x.click()})")
    e.step(4, 36.5, 41.6, "انسخ الرابط لـ *OBS*"); e.nav(36.6, "obs"); e.cam(37.0, [640, 420], 1.0); e.cl(38.3, '[data-copyall]', .9); e.ring(38.6, '[data-copyall]', 2.2); e.cam(38.8, '[data-copyall]', 2.1); e.cam(41.0, '[data-copyall]', 2.0); e.cam(42.0, [640, 420], .95)
    e.d["ba"] = [42.6, 45.0, 51.6]; e.d["appCss"] = ".code{filter:blur(5px)}"
    e.likes(43.0, 18); e.gift(46.0, "ريم", 3, snd="gift-03")
    result_texts(e, "قبل وبعد", "بثك *بهوية احترافية*")
    e.desc = "استوديو البث: تخطيطات جاهزة، مقاسات عمودي وأفقي، إضافة عناصر، تحكم بالطبقات، مشاركة التصميم، ونسخ رابط OBS."
    return e

@ep
def likes():
    e = Ep(4, "likes", "03-القوائم", "قوائم التكبيس", "likes", dict(style="stack", hook="حوّل تكبيسات جمهورك|*لمنافسة!*", sub="قوائم التكبيس"))
    enter(e, "likes")
    e.tx(4.4, 6.9, "كل تكبيسة *تنحسب*"); e.tx(7.1, 9.8, "وجمهورك *يتنافس*"); e.cam(8.0, [640, 330], 1.25); e.cam(9.8, [640, 330], 1.25)
    e.kk(10.4, 19.9, "<b>B6O6</b> · مكتبة التصاميم")
    e.tx(10.4, 14.6, "*+260* تصميم للقوائم"); e.nav(10.0, "library"); e.cam(10.6, [640, 420], 1.0); e.cl(11.4, '[data-libtab="pro"]', .7); e.scroll(12.6, 900, 2.0); e.mv(12.4, [560, 480], 1.0); e.cam(13.2, [520, 420], 1.15, ry=4)
    e.tx(15.0, 19.8, "صور دائرية *وتتويج*"); e.scroll(15.0, 1900, 2.2); e.cam(16.0, [600, 420], 1.25, ry=-4); e.cam(19.6, [600, 420], 1.25)
    e.step(1, 20.4, 25.3, "افتح *التكبيس والإعجابات*", ); e.cam(20.4, [640, 420], 1.0); e.nav(20.2, "likes"); e.mv(21.6, '[data-sessnew]', .9); e.ring(22.0, '[data-sessnew]', 2.6); e.cam(22.2, '[data-sessnew]', 1.8); e.cam(25.0, '[data-sessnew]', 1.8)
    e.step(2, 25.6, 30.6, "أضف *قائمة التكبيس*"); e.cl(25.8, '[data-lsadd="likes"]', .9); e.cam(26.2, '[data-lsadd="likes"]', 2.0); e.cam(29.0, [300, 600], 1.4)
    e.step(3, 31.0, 36.1, "اختر *التصميم*"); e.cl(31.0, '[data-lssec="gallery"]', .9); e.cam(31.4, '[data-lssec="gallery"]', 1.8); e.cam(33.2, [640, 420], 1.0); e.mv(33.6, '[data-galuse]', 1.0); e.cl(34.6, '[data-galuse]', .2); e.cam(34.8, '[data-galuse]', 1.6)
    e.step(4, 36.5, 41.6, "انسخ *رابط القائمة*"); e.cam(36.6, [640, 420], 1.0); e.nav(36.6, "likes"); e.cl(38.4, '[data-lscopy]', .9); e.ring(38.6, '[data-lscopy]', 2.2); e.cam(38.8, '[data-lscopy]', 2.0); e.cam(41.2, '[data-lscopy]', 1.9); e.cam(42.0, [640, 420], .95)
    e.result_layout([("lb", dict(topN=5, x=.08, y=.24, w=.84, h=.46, source="likes", design="roseAura", title="أفضل المكبسين", icon="❤️"))])
    for i in range(30): e.ev(42.5 + i * .3, dict(type="like", id=f"L4_{i}", platform="tiktok", user=dict(id=f"z{[0,1,2,3,4,2,3,4,4,3][i % 10]}", name=["أبو فهد","نورة","سلطان","ريم","خالد"][[0,1,2,3,4,2,3,4,4,3][i % 10]]), count=60 + (i * 37) % 90))
    result_texts(e, "والنتيجة؟", "الترتيب *يتغيّر لحظياً*")
    e.desc = "قوائم التكبيس: أكثر من 260 تصميم Pro، إضافة القائمة من صفحة التكبيس، تغيير التصميم، ونسخ رابط القائمة لـ OBS."
    return e

@ep
def supporters():
    e = Ep(5, "supporters", "03-القوائم", "قوائم الداعمين", "gifts", dict(style="rise", hook="خلّ داعمينك *يتصدّرون*", sub="قوائم الداعمين"))
    enter(e, "gifts")
    e.tx(4.4, 6.9, "كل هدية *لها قيمة*"); e.tx(7.1, 9.8, "والداعم الأول *يتتوّج*"); e.cam(8.0, [640, 330], 1.25); e.cam(9.8, [640, 330], 1.25)
    e.kk(10.4, 19.9, "<b>B6O6</b> · قوائم الترتيب")
    e.tx(10.4, 14.6, "أفضل *3* · *5* · *10* · *20*"); e.nav(10.0, "boards"); e.cam(10.6, [640, 420], 1.0); e.mv(11.4, '[data-add-lb="3"]', .9); e.cam(12.0, '[data-add-lb="3"]', 1.7); e.ring(12.2, '[data-add-lb="20"]', 2.0)
    e.tx(15.0, 19.8, "كؤوس *وأهداف* مصغّرة"); e.mv(15.0, '[data-add-vg="goldCup"]', .9); e.cam(15.4, '[data-add-vg="goldCup"]', 1.8); e.cam(19.6, '[data-add-vg="ringGoal"]', 1.7)
    e.step(1, 20.4, 25.3, "افتح *الدعم والهدايا*"); e.cam(20.4, [640, 420], 1.0); e.nav(20.2, "gifts"); e.mv(21.8, '[data-lsadd="gifts"]', .9); e.cam(22.2, '[data-lsadd="gifts"]', 1.9); e.cam(25.0, '[data-lsadd="gifts"]', 1.9)
    e.step(2, 25.6, 30.6, "أضف *قائمة الدعم*"); e.a(t=25.8, click=1); e.cam(27.2, [300, 260], 1.5); e.mv(27.0, '[data-lssec="settings"]', 1.0)
    e.step(3, 31.0, 36.1, "خصّص *التصميم*"); e.cl(31.0, '[data-lssec="gallery"]', .9); e.cam(31.4, '[data-lssec="gallery"]', 1.8); e.cam(33.2, [640, 420], 1.0); e.mv(33.6, '[data-galuse]', 1.0); e.cl(34.6, '[data-galuse]', .2); e.cam(34.8, '[data-galuse]', 1.6)
    e.step(4, 36.5, 41.6, "انسخ *رابط البث*"); e.cam(36.6, [640, 420], 1.0); e.nav(36.6, "gifts"); e.cl(38.4, '[data-lscopy]', .9); e.ring(38.6, '[data-lscopy]', 2.2); e.cam(38.8, '[data-lscopy]', 2.0); e.cam(41.2, '[data-lscopy]', 1.9); e.cam(42.0, [640, 420], .95)
    e.result_layout([("lb", dict(topN=3, x=.06, y=.20, w=.88, h=.40, source="gifts", design="royalCrown", title="أفضل الداعمين")), ("recentGifts", dict(x=.12, y=.64, w=.76, h=.20, title="آخر الداعمين"))])
    e.gift(42.8, "سارة", 5, value=99, count=1, snd="gift-01"); e.gift(44.6, "تركي", 8, gift="Lion", gid=6369, dia=29999, value=299, count=1, snd="tier-50")
    e.gift(46.6, "لمى", 7, value=30, count=30, snd="gift-04"); e.gift(48.6, "نورة", 1, gift="Universe", gid=7934, dia=34999, value=500, count=1, snd="tier-100")
    result_texts(e, "والنتيجة؟", "الصدارة *تتغيّر لحظياً*")
    e.desc = "قوائم الداعمين: أفضل 3 و5 و10 و20، كؤوس وأهداف مصغّرة، إضافة قائمة الدعم وتخصيص تصميمها ونسخ رابطها."
    return e

@ep
def alerts():
    e = Ep(6, "alerts", "04-التنبيهات", "الأليرتات وتنبيهات المتابعين", "alerts", dict(style="chip", hook="خلّ كل فولو يدخل بثك|*بطريقة أسطورية!*", chip=["ر", "ريم تابعتك ❤️", "متابعة جديدة · الآن"], chipSnd="follow-02"))
    enter(e, "alerts")
    e.tx(4.4, 6.9, "كل متابع *له ترحيب*"); e.tx(7.1, 9.8, "*يظهر بثواني* في بثك"); e.cam(8.0, [640, 330], 1.2); e.cam(9.8, [640, 330], 1.2)
    e.kk(10.4, 19.9, "<b>B6O6</b> · مكتبة الأليرتات")
    e.tx(10.4, 14.6, "مكتبة *أليرتات* جاهزة"); e.cl(10.4, '[data-altab="lib"]', .8); e.cam(10.8, [640, 420], 1.0); e.scroll(11.6, 420, 1.6); e.mv(11.8, [600, 520], 1.2); e.cam(13.0, [640, 430], 1.15, ry=3)
    e.tx(15.0, 19.8, "*رسمية* ومن المجتمع"); e.scroll(15.0, 0, 1.0); e.cl(15.6, '[data-alsec="official"]', .8); e.cam(16.0, '[data-alsec="official"]', 1.8); e.cl(17.8, '[data-alsec="all"]', .7); e.cam(19.6, [640, 420], 1.05)
    e.step(1, 20.4, 25.3, "اختر *الأليرت*"); e.scroll(20.2, 420, 1.2); e.mv(21.0, '[data-aluse="tpl:duck_classic"]', 1.0); e.ring(21.4, '[data-altp="tpl:duck_classic"]', .1); e.cam(21.6, '[data-aluse="tpl:duck_classic"]', 1.8, dy=-80); e.cam(25.0, '[data-aluse="tpl:duck_classic"]', 1.8)
    e.step(2, 25.6, 30.6, "أضفه *لمكتبتك*"); e.a(t=26.2, click=1); e.ring(26.0, '[data-aluse="tpl:duck_classic"]', 2.6); e.cam(26.4, '[data-aluse="tpl:duck_classic"]', 2.1); e.cam(30.2, [640, 520], 1.2)
    e.step(3, 31.0, 36.1, "افتح *تنبيهات المتابعين*"); e.cam(31.0, [640, 420], 1.0); e.nav(31.0, "falerts"); e.mv(32.8, '[data-faadd]', 1.0); e.ring(33.2, '[data-faadd]', 2.6); e.cam(33.0, '[data-faadd]', 2.0); e.cam(36.0, '[data-faadd]', 2.0)
    e.step(4, 36.5, 41.6, "فعّلها *بضغطة*"); e.a(t=36.9, click=1); e.cam(37.6, [640, 360], 1.2); e.mv(38.4, [600, 460], 1.4); e.cam(41.2, [640, 380], 1.15); e.cam(42.0, [640, 420], .95)
    e.result_layout([("falert", dict(x=.04, y=.36, w=.92, h=.3))])
    e.follow(42.7, "ريم", 1, "follow-07"); e.follow(48.7, "سلطان", 2, "follow-03")
    result_texts(e, "والنتيجة؟", "كل متابع *يدخل بفخامة*")
    e.desc = "مكتبة الأليرتات وتنبيهات المتابعين: اختيار أليرت جاهز من مكتبة المجتمع، إضافته لمكتبتك، وتفعيل تنبيه المتابعين في البث. (أليرتات الهدايا بمقاطع الفيديو تحتاج رفع/تعيين مقطع لكل هدية)."
    return e

if __name__ == "__main__":
    for n in (sys.argv[1:] or EP.keys()): print(EP[n]().save())
