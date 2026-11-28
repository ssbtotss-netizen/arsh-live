# الدفعة C: الحلقات 12–16
from series import Ep, ep, EP
from eps_a import enter, result_texts
import sys

@ep
def layers():
    e = Ep(12, "layers", "09-الطبقات", "الطبقات المتحركة", "layers", dict(style="chip", hook="طبقات تتحرك|*مع كل تفاعل*", chip=["خ", "خالد كبّس 100 مرة ❤️", "آخر مكبس · الآن"], chipSnd="sparkle-rise"))
    enter(e, "layers")
    e.tx(4.4, 6.9, "*آخر مكبس* وآخر متابع"); e.tx(7.1, 9.8, "تتحدّث *تلقائياً*"); e.cam(7.6, [640, 330], 1.3); e.cam(9.8, [640, 330], 1.3)
    e.kk(10.4, 19.9, "<b>B6O6</b> · الطبقات")
    e.tx(10.4, 14.6, "جرّب *الحركة* قبل تضيفها", True); e.cl(10.4, '[data-layplay="like"]', .8); e.cam(10.8, [800, 380], 1.45); e.cl(12.2, '[data-layplay="follow"]', .7); e.cam(12.6, [480, 380], 1.45); e.cl(13.6, '[data-layplay="gift"]', .6); e.cam(14.4, [200, 380], 1.45)
    e.tx(15.0, 19.8, "تعليق · مشاركة · *دخول*"); e.scroll(14.9, 360, 1.2); e.cam(15.2, [640, 420], 1.05); e.cl(16.4, '[data-layplay="comment"]', .8); e.cam(17.0, '[data-layplay="comment"]', 1.5, ry=3); e.cl(18.4, '[data-layplay="join"]', .7); e.cam(19.6, [400, 400], 1.3)
    e.step(1, 20.4, 25.3, "اختر *نوع الطبقة*"); e.scroll(20.2, 0, .9); e.cam(20.4, [640, 420], 1.0); e.mv(21.4, '[data-layadd="gift"]', .9); e.ring(21.8, '[data-layadd="gift"]', 2.6); e.cam(22.0, '[data-layadd="gift"]', 1.9); e.cam(25.0, '[data-layadd="gift"]', 1.9)
    e.step(2, 25.6, 30.6, "اضغط *إضافة للمشهد*"); e.a(t=25.9, click=1); e.cl(27.4, '[data-layadd="follow"]', .9); e.cam(27.8, '[data-layadd="follow"]', 1.9); e.cam(30.2, [500, 420], 1.3)
    e.step(3, 31.0, 36.1, "رتّبها *في الاستوديو*"); e.cam(31.0, [640, 420], 1.0); e.nav(31.0, "studio"); e.cam(32.8, [560, 430], 1.35); e.mv(33.4, [560, 470], 1.0); e.cam(36.0, [600, 400], 1.3)
    e.step(4, 36.5, 41.6, "انسخ الرابط لـ *OBS*"); e.cam(36.6, [640, 420], 1.0); e.nav(36.6, "obs"); e.cl(38.3, '[data-copyall]', .9); e.ring(38.6, '[data-copyall]', 2.2); e.cam(38.8, '[data-copyall]', 2.1); e.cam(41.0, '[data-copyall]', 2.0); e.cam(42.0, [640, 420], .95)
    e.d["appCss"] = ".code{filter:blur(5px)}"
    e.result_layout([("levent", dict(kind="gift", design="crown", x=.08, y=.24, w=.84, h=.2)), ("levent", dict(kind="follow", design="butterfly", x=.08, y=.50, w=.84, h=.2))])
    e.gift(43.0, "سارة", 5, value=99, count=1, snd="gift-06"); e.follow(45.2, "فيصل", 6, "follow-06"); e.gift(47.6, "تركي", 8, gift="Lion", gid=6369, dia=29999, value=299, count=1, snd="tier-50"); e.follow(49.8, "لمى", 7, "follow-03")
    result_texts(e, "والنتيجة؟", "الطبقات *تتحدّث لحظياً*")
    e.desc = "الطبقات المتحركة: آخر مكبس، آخر متابع، آخر مرسل هدية، آخر معلّق، آخر مشارك وآخر داخل وغيرها — تجربة الحركة، الإضافة للمشهد، الترتيب في الاستوديو ونسخ رابط OBS."
    return e

@ep
def latest():
    e = Ep(13, "latest", "09-الطبقات", "آخر داعم وآخر متابع", "latest", dict(style="rise", hook="آخر داعم وآخر متابع|*قدام الكل*", sub="آخر التفاعلات"))
    enter(e, "latest")
    e.tx(4.4, 6.9, "كرّم *جمهورك* لحظياً"); e.tx(7.1, 9.8, "*خمسة أنواع* بضغطة"); e.cam(7.6, '[data-leall]', 1.7); e.cam(9.8, '[data-leall]', 1.7)
    e.kk(10.4, 19.9, "<b>B6O6</b> · آخر التفاعلات")
    e.tx(10.4, 14.6, "*110* نمط حركة"); e.cam(10.4, [640, 420], 1.0); e.cl(10.4, '[data-libtab="levent"]', .9); e.scroll(12.4, 700, 1.8); e.cam(12.6, [600, 430], 1.15, ry=3)
    e.tx(15.0, 19.8, "فراشات · تيجان · *نجوم*"); e.scroll(15.0, 1500, 2.0); e.mv(15.4, [520, 480], 1.2); e.cam(16.2, [560, 430], 1.25, ry=-3); e.cam(19.6, [560, 430], 1.25)
    e.step(1, 20.4, 25.3, "افتح *آخر التفاعلات*"); e.cam(20.4, [640, 420], 1.0); e.nav(20.2, "latest"); e.mv(21.8, '[data-letest="follow"]', .9); e.cam(22.2, [400, 470], 1.6); e.a(t=22.8, click=1, snd="follow-06"); e.cam(25.0, [400, 470], 1.6)
    e.step(2, 25.6, 30.6, "*جرّب* قبل تضيف"); e.cl(25.8, '[data-letest="like"]', .8); e.cam(26.2, [800, 500], 1.6); e.cl(28.2, '[data-letest="donation"]', .8); e.cam(30.4, [820, 560], 1.35)
    e.step(3, 31.0, 36.1, "شغّل أو أوقف *الصوت*"); e.cam(31.0, [640, 420], 1.0); e.cl(31.4, '[data-levoice="follow"]', .9); e.cam(31.8, '[data-levoice="follow"]', 2.0); e.cam(36.0, '[data-levoice="follow"]', 1.9)
    e.step(4, 36.5, 41.6, "ضع *الخمسة* في المشهد"); e.cam(36.6, [640, 420], 1.0); e.cl(37.2, '[data-leall]', 1.0); e.ring(37.4, '[data-leall]', 2.4); e.cam(37.6, '[data-leall]', 2.0); e.cam(41.2, '[data-leall]', 1.9); e.cam(42.0, [640, 420], .95)
    e.result_layout([("levent", dict(kind="follow", design="butterfly", x=.08, y=.22, w=.84, h=.17)), ("levent", dict(kind="gift", design="crown", x=.08, y=.42, w=.84, h=.17)), ("levent", dict(kind="like", design="fire", x=.08, y=.62, w=.84, h=.17))])
    e.follow(43.0, "هيا", 9, "follow-05"); e.gift(45.0, "خالد", 4, value=99, count=1, snd="gift-04"); e.likes(46.0, 8, .3, 3, 80); e.follow(49.0, "سلطان", 2, "follow-02")
    result_texts(e, "والنتيجة؟", "تتحدّث *لحظة بلحظة*")
    e.desc = "آخر التفاعلات: آخر لايك، آخر متابعة، آخر دخول، آخر مشاركة، آخر دعم وآخر هدية — 110 نمط، تجربة كل نوع، التحكم بالصوت، ووضع الخمسة في المشهد بضغطة."
    return e

@ep
def uchat():
    e = Ep(14, "uchat", "10-الشات", "الشات الموحّد", "chatcfg", dict(style="split", hook="كل منصاتك|*في شات واحد!*", sub="الشات الموحّد"))
    enter(e, "connections")
    e.tx(4.4, 6.9, "تيك توك · يوتيوب · *كيك* · تويتش", True); e.tx(7.1, 9.8, "في *واجهة وحدة*"); e.scroll(6.6, 1000, 1.6); e.cam(7.6, '[data-ucadd]', 1.5); e.cam(9.8, '[data-ucadd]', 1.5)
    e.kk(10.4, 19.9, "<b>B6O6</b> · تصاميم الشات")
    e.tx(10.4, 14.6, "*30* تصميم للشات"); e.cam(10.4, [640, 420], 1.0); e.cl(10.4, '[data-libtab="uchat"]', .9); e.scroll(12.4, 700, 1.8); e.cam(12.6, [600, 430], 1.15, ry=3)
    e.tx(15.0, 19.8, "شفاف · زجاجي · *نيون*"); e.scroll(15.0, 1500, 2.0); e.mv(15.4, [520, 480], 1.2); e.cam(16.2, [560, 430], 1.25, ry=-3); e.cam(19.6, [560, 430], 1.25)
    e.step(1, 20.4, 25.3, "افتح *إعدادات الشات*"); e.cam(20.4, [640, 420], 1.0); e.nav(20.2, "chatcfg"); e.mv(21.8, '[data-add="uchat"]', .9); e.ring(22.2, '[data-add="uchat"]', 2.6); e.cam(22.2, '[data-add="uchat"]', 2.0); e.cam(25.0, '[data-add="uchat"]', 2.0)
    e.step(2, 25.6, 30.6, "أضف *الشات للمشهد*"); e.a(t=25.9, click=1); e.cam(27.0, [640, 420], 1.05); e.mv(27.4, [600, 450], 1.2); e.cam(30.4, [600, 400], 1.2)
    e.step(3, 31.0, 36.1, "جرّب *المنصات الأربع*"); e.cam(31.0, [640, 420], 1.0); e.nav(31.0, "connections"); e.scroll(32.2, 1000, 1.0); e.cl(33.2, '[data-conntest="all"]', .9); e.cam(33.6, '[data-conntest="all"]', 1.9); e.cam(36.0, '[data-conntest="all"]', 1.8)
    e.step(4, 36.5, 41.6, "تابع *الشات المباشر*"); e.cam(36.6, [640, 420], 1.0); e.nav(36.6, "livechat"); e.cam(38.4, [600, 360], 1.3, ry=-3); e.mv(38.8, [560, 420], 1.4); e.cam(42.0, [640, 420], .95)
    e.result_layout([("uchat", dict(x=.06, y=.22, w=.88, h=.56))])
    e.comments(42.6, ["السلام عليكم 👋", "من يوتيوب نتابعك 🙌", "كيك حاضرين 💚", "تويتش هنا 💜", "بث أسطوري 🔥", "كمل كمل 💪", "الله يعطيك العافية"], 1.2, ("tiktok", "youtube", "kick", "twitch"))
    result_texts(e, "والنتيجة؟", "*شات واحد* للكل")
    e.desc = "الشات الموحّد: رسائل TikTok وYouTube وKick وTwitch في شات واحد (حسب ربط كل منصة)، 30 تصميم، إضافته للمشهد، رسائل تجربة من المنصات الأربع، ومتابعته من الشات المباشر."
    return e

@ep
def moderation():
    e = Ep(16, "moderation", "10-الشات", "إدارة الشات: كتم وحظر وتثبيت", "livechat", dict(style="mask", hook="شاتك تحت *سيطرتك*", sub="إدارة الشات"))
    enter(e, "livechat")
    e.tx(4.4, 6.9, "كتم · حظر · *تثبيت*"); e.tx(7.1, 9.8, "*بضغطة* على الاسم"); e.cam(7.6, [640, 300], 1.35); e.cam(9.8, [640, 300], 1.35)
    e.kk(10.4, 19.9, "<b>B6O6</b> · الشات المباشر والإدارة")
    e.tx(10.4, 14.6, "*بحث* وفلترة سريعة"); e.cl(10.4, '[data-flcf="q"]', .8); e.cam(10.8, '[data-flcf="q"]', 1.7); e.ty(11.4, '[data-flcf="q"]', "هلا", 6); e.js(13.8, "(q=>{q.value='';q.dispatchEvent(new Event('input',{bubbles:true}))})(document.querySelector('[data-flcf=\"q\"]'))"); e.cam(14.4, [640, 420], 1.1)
    e.tx(15.0, 19.8, "تصاميم *وأوضاع* للعرض"); e.cl(15.0, '[data-flc="design"]', .8); e.cam(15.4, [300, 330], 1.4); e.mv(17.0, [480, 460], 1.0); e.cl(18.4, '[data-flc="design"]', .6); e.cam(19.6, [640, 420], 1.05)
    e.step(1, 20.4, 25.3, "اضغط *اسم المشاهد*"); e.cl(20.6, '.flc-m[data-id]:last-child .flc-n', 1.0); e.cam(21.2, '.flc-m[data-id]:last-child .flc-n', 1.9); e.cam(23.2, [1060, 470], 1.35); e.mv(23.6, '[data-fm="timeout"][data-sec="300"]', 1.0)
    e.step(2, 25.6, 30.6, "*كتم مؤقت* بالمدة اللي تبيها"); e.ring(25.6, '[data-fm="timeout"][data-sec="300"]', 1.6); e.cam(25.8, '[data-fm="timeout"][data-sec="300"]', 2.1); e.a(t=26.8, click=1); e.cam(28.4, [640, 420], 1.05); e.mv(28.6, [600, 420], 1.0)
    e.step(3, 31.0, 36.1, "*ثبّت* رسالة مهمة"); e.cl(31.0, '.flc-m[data-id]:nth-last-child(3) .flc-n', .9); e.cam(31.6, [1060, 470], 1.35); e.mv(32.6, '[data-fm="pin"][data-sec="60"]', .9); e.ring(32.8, '[data-fm="pin"][data-sec="60"]', 1.6); e.cam(33.0, '[data-fm="pin"][data-sec="60"]', 2.0); e.a(t=33.8, click=1); e.cam(35.6, [600, 330], 1.3)
    e.step(4, 36.5, 41.6, "احذف أو *احظر*"); e.cl(36.6, '.flc-m[data-id]:nth-last-child(5) .flc-n', .9); e.cam(37.2, [1060, 470], 1.35); e.mv(38.2, '[data-fm="delete"]', .8); e.ring(38.4, '[data-fm="delete"]', 1.4); e.cam(38.6, '[data-fm="delete"]', 2.0); e.ring(39.8, '[data-fm="ban"]', 1.6); e.cam(41.4, '[data-fm="ban"]', 1.9)
    e.js(41.7, "document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));document.body.click()"); e.cam(42.0, [640, 420], .95)
    e.result_layout([("uchat", dict(x=.06, y=.22, w=.88, h=.56))])
    e.comments(42.6, ["يا هلا والله 👋", "بث أسطوري 🔥", "كمل كمل 💪", "الله يعطيك العافية", "👏👏👏", "أقوى ستريمر"], 1.4)
    result_texts(e, "والنتيجة؟", "شات *نظيف ومرتّب*")
    e.desc = "إدارة الشات: اضغط اسم المشاهد لكتمه مؤقتاً أو حظره أو حذف رسالته أو تثبيتها. على TikTok الإجراءات محلية داخل B6O6 (لا توجد واجهة رسمية)، وعلى YouTube/Twitch/Kick تحتاج الربط الرسمي."
    return e

@ep
def floatchat():
    e = Ep(15, "floatchat", "10-الشات", "الشات العائم فوق الألعاب", "livechat", dict(style="stack", hook="العب واقرأ شاتك|*بدون ما تطلع!*"))
    enter(e, "livechat")
    e.tx(4.4, 6.9, "شات *عائم* فوق كل شي"); e.tx(7.1, 9.8, "*شفافية* وأوضاع للعرض"); e.cam(7.6, [520, 220], 1.6); e.cam(9.8, [520, 220], 1.6)
    e.kk(10.4, 19.9, "<b>B6O6</b> · الشات العائم")
    e.tx(10.4, 14.6, "*25* تصميم للشات"); e.cl(10.4, '[data-flc="design"]', .8); e.cam(10.8, [300, 330], 1.45); e.mv(12.4, [480, 460], 1.0); e.cl(14.0, '[data-flc="design"]', .5)
    e.tx(15.0, 19.8, "تحكّم *بالشفافية*"); e.cl(15.0, '[data-flc="op"]', .8); e.cam(15.4, '[data-flc="op"]', 1.9); e.a(t=17.6, click=1); e.cam(19.6, [640, 420], 1.1)
    e.step(1, 20.4, 25.3, "حمّل *تطبيق الكمبيوتر*"); e.mv(20.6, 'a[href*="B6O6-Streaming-Setup"]', 1.0); e.ring(21.0, 'a[href*="B6O6-Streaming-Setup"]', 4.0); e.cam(21.0, 'a[href*="B6O6-Streaming-Setup"]', 2.1); e.cam(25.0, 'a[href*="B6O6-Streaming-Setup"]', 2.0)
    e.step(2, 25.6, 30.6, "افتح *الشات العائم*"); e.mv(25.8, '[data-flc="open"]', .9); e.ring(26.2, '[data-flc="open"]', 2.6); e.cam(26.2, '[data-flc="open"]', 2.0); e.cam(30.2, '[data-flc="open"]', 1.9)
    e.step(3, 31.0, 36.1, "فعّل *وضع اللعب*"); e.mv(31.2, '[data-flc="game"]', .8); e.ring(31.6, '[data-flc="game"]', 2.6); e.cam(31.6, '[data-flc="game"]', 2.1); e.cam(36.0, '[data-flc="game"]', 2.0)
    e.step(4, 36.5, 41.6, "*ثبّته* فوق التطبيقات"); e.mv(36.6, '[data-flc="ontop"]', .8); e.ring(37.0, '[data-flc="ontop"]', 2.6); e.cam(37.0, '[data-flc="ontop"]', 2.1); e.cam(41.2, [640, 420], 1.1); e.cam(42.0, [640, 420], .95)
    e.d["liveMode"] = "desk"
    for i, (tx, pl) in enumerate([("ضربة أسطورية 🔥", "tiktok"), ("وش السيارة ذي؟", "youtube"), ("كمل كمل 💪", "tiktok"), ("لفة نظيفة 👏", "kick"), ("السلام عليكم", "tiktok"), ("بث ممتع 💜", "twitch"), ("أسرع لفة!", "tiktok")]):
        e.a(t=42.6 + i * 1.25, sim=dict(type="comment", id=f"FL{i}", platform=pl, user=dict(id=f"fl{i}", name=["ريم", "خالد", "نورة", "فيصل", "سارة", "تركي", "هيا"][i]), text=tx), fl=1)
    result_texts(e, "والنتيجة؟", "الشات *فوق اللعبة*"); e.d["kicks"][-1][2] = "الشات العائم الحقيقي · مشهد لعبة توضيحي"
    e.desc = "الشات العائم: نافذة شات شفافة فوق الألعاب عبر تطبيق الكمبيوتر (Windows)، 25 تصميم، تحكم بالشفافية، وضع اللعب (تمرير الماوس للعبة) والتثبيت فوق التطبيقات. لا يظهر فوق الألعاب في وضع ملء الشاشة الحصري."
    return e

if __name__ == "__main__":
    for n in (sys.argv[1:] or EP.keys()): print(EP[n]().save())
