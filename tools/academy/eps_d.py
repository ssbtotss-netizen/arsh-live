# الدفعة D: الحلقات 17–23
from series import Ep, ep, EP
from eps_a import enter, result_texts
import sys

def obs_copy(e, t=36.6):
    e.cam(t, [640, 420], 1.0); e.nav(t, "obs"); e.cl(t + 1.7, '[data-copyall]', .9); e.ring(t + 2.0, '[data-copyall]', 2.2); e.cam(t + 2.2, '[data-copyall]', 2.1); e.cam(t + 4.4, '[data-copyall]', 2.0); e.cam(42.0, [640, 420], .95)
    e.d["appCss"] = ".code{filter:blur(5px)}"

@ep
def music():
    e = Ep(17, "music", "11-البوتات", "بوت الأغاني", "music", dict(style="chip", hook="خلّ جمهورك|*يختار أغانيك*", chip=["س", "سارة طلبت أغنية 🎵", "‎!sr من الشات · الآن"], chipSnd="sparkle-rise"))
    enter(e, "music")
    e.tx(4.4, 6.9, "طلبات *من الشات*"); e.tx(7.1, 9.8, "وقائمة *انتظار مرتّبة*"); e.cam(7.6, [700, 380], 1.35); e.cam(9.8, [700, 380], 1.35)
    e.kk(10.4, 19.9, "<b>B6O6</b> · بوت الأغاني")
    e.tx(10.4, 14.6, "*أوامر* تتحكم فيها", True); e.scroll(10.4, 1100, 1.6); e.cam(10.8, [640, 420], 1.05, ry=3); e.mv(12.0, [560, 420], 1.2); e.cam(14.4, [600, 400], 1.2)
    e.tx(15.0, 19.8, "*حدود* لكل مشاهد"); e.scroll(15.0, 640, 1.4); e.cam(15.4, [640, 420], 1.05); e.ring(16.6, '[data-mcfg="perUser"]', 2.6); e.mv(16.4, '[data-mcfg="perUser"]', .9); e.cam(17.0, '[data-mcfg="perUser"]', 1.8); e.cam(19.6, '[data-mcfg="cooldownSec"]', 1.7)
    e.step(1, 20.4, 25.3, "فعّل *طلبات الأغاني*"); e.mv(20.6, '[data-mchk="enabled"]', .9); e.ring(21.0, '[data-mchk="enabled"]', 2.4); e.cam(21.0, '[data-mchk="enabled"]', 2.0); e.cam(25.0, '[data-mchk="enabled"]', 1.9)
    e.step(2, 25.6, 30.6, "ارفع *أغانيك*"); e.scroll(25.6, 0, 1.0); e.cam(25.8, [640, 420], 1.0); e.mv(26.6, '[data-mimport]', .9); e.ring(27.0, '[data-mimport]', 2.0); e.cam(27.0, '[data-mimport]', 2.0); e.a(t=27.6, click=1)
    e.js(28.2, "fetch('../tools/academy/assets/music/B6O6 - Night Drive.mp3').then(r=>r.blob()).then(b=>musicImport([new File([b],'B6O6 - Night Drive.mp3',{type:'audio/mpeg'})]))"); e.cam(29.0, '[data-muq]', 1.8); e.cam(30.4, '[data-muq]', 1.8)
    e.step(3, 31.0, 36.1, "جرّب *طلب من الشات*"); e.cam(31.0, [640, 420], 1.0); e.cl(31.8, '[data-mtest]', .9); e.cam(32.2, '[data-mtest]', 1.9); e.cam(34.0, [760, 400], 1.4); e.mv(34.4, '[data-mop="pause"]', 1.0); e.cam(36.0, [760, 420], 1.35)
    e.step(4, 36.5, 41.6, "أضف *الأغنية الحالية*"); e.cl(36.8, '[data-addw="nowplay"]', 1.0); e.ring(37.0, '[data-addw="nowplay"]', 2.6); e.cam(37.2, '[data-addw="nowplay"]', 2.0); e.cam(41.2, '[data-addw="nowplay"]', 1.9); e.cam(42.0, [640, 420], .95)
    e.result_layout([("nowplay", dict(x=.08, y=.26, w=.84, h=.16)), ("uchat", dict(x=.08, y=.46, w=.84, h=.32))])
    e.comments(43.4, ["حلوة الأغنية 🎶", "ذوق 👌", "ارفع الصوت 🔥", "كمل كمل 💪"], 1.8)
    e.a(t=42.0, snd="file:assets/music/B6O6 - Night Drive.mp3@9.3~10"); e.d["duck"] = [42.0, 52.0]
    result_texts(e, "والنتيجة؟", "الأغنية *تشتغل في بثك*")
    e.desc = "بوت الأغاني: طلبات من الشات بأوامر قابلة للتعديل، حدود لكل مشاهد ومهلة بين الطلبات، رفع أغانيك لمكتبتك أو البحث في YouTube، قائمة انتظار مع تحكم كامل، وودجت «الأغنية الحالية» للبث. (الأغنية في المقطع أصلية من B6O6؛ تأكد أن لديك حق بث الأغاني.)"
    return e

@ep
def poststats():
    e = Ep(18, "poststats", "12-الإحصائيات", "إحصائيات البث", "poststats", dict(style="counter", num=36, hook="بثك بالأرقام|*في صورة وحدة*", sub="إحصائيات نهاية البث"))
    enter(e, "poststats")
    e.tx(4.4, 6.9, "تقرير *جاهز للنشر*"); e.tx(7.1, 9.8, "بعد *كل بث*"); e.cam(7.6, '[data-pstest]', 1.7); e.cam(9.8, '[data-pstest]', 1.7)
    e.kk(10.4, 19.9, "<b>B6O6</b> · إحصائيات نهاية البث")
    e.tx(10.4, 14.6, "*36* قالب للتقرير"); e.cl(10.4, '[data-pst="gold-cards"]', .8); e.cam(10.8, [700, 400], 1.4); e.cl(12.4, '[data-pst="ocean-glass"]', .7); e.cl(13.8, '[data-pst="neon-cards"]', .6)
    e.tx(15.0, 19.8, "اختر *القوائم* اللي تبيها", True); e.scroll(14.9, 1000, 1.6); e.cam(15.4, [640, 420], 1.05); e.cl(16.6, '[data-psl="supporters"][data-n="5"]', .8); e.cam(17.0, '[data-psl="supporters"][data-n="5"]', 1.8); e.cl(18.6, '[data-psl="likers"][data-n="3"]', .6); e.cam(19.6, [560, 420], 1.2)
    e.step(1, 20.4, 25.3, "أنشئ *التقرير*"); e.scroll(20.2, 0, 1.0); e.cam(20.4, [640, 420], 1.0); e.cl(21.2, '[data-pstest]', .9); e.ring(21.4, '[data-pstest]', 1.8); e.cam(21.6, '[data-pstest]', 1.9); e.cam(23.6, [640, 420], 1.1); e.cam(25.2, [640, 420], 1.1)
    e.step(2, 25.6, 30.6, "اختر *القالب*"); e.cl(25.8, '[data-pst="b6o6-glass"]', .8); e.cam(26.2, '[data-pst="b6o6-glass"]', 1.8); e.cl(28.0, '[data-pst="gold-glass"]', .6); e.cam(30.4, [640, 420], 1.1)
    e.step(3, 31.0, 36.1, "حمّل *الصورة*"); e.scroll(31.0, 1300, 1.6); e.cam(31.2, [640, 420], 1.0); e.mv(32.8, '[data-psdl="png"]', .9); e.ring(33.2, '[data-psdl="png"]', 2.6); e.cam(33.2, '[data-psdl="png"]', 2.0); e.cam(36.0, '[data-psdl="png"]', 1.9)
    e.step(4, 36.5, 41.6, "*شاركها* مع جمهورك"); e.mv(36.6, '[data-psshare]', .8); e.ring(37.0, '[data-psshare]', 2.6); e.cam(37.0, '[data-psshare]', 2.0); e.cam(41.2, '[data-psshare]', 1.9); e.cam(42.0, [640, 420], .95)
    e.result_layout([("chatstats", dict(x=.06, y=.24, w=.88, h=.12)), ("lb", dict(topN=3, x=.08, y=.40, w=.84, h=.38, source="gifts", design="goldenHalo", title="أفضل الداعمين"))])
    e.likes(42.6, 16, .32); e.gift(44.0, "نورة", 1, value=99, count=1, snd="gift-01"); e.comments(45.0, ["بث ممتع 🔥", "كمل 💪", "👏👏"], 1.4); e.gift(48.0, "خالد", 4, gift="Lion", gid=6369, dia=29999, value=299, count=1, snd="tier-50")
    result_texts(e, "والنتيجة؟", "أرقام بثك *لحظة بلحظة*")
    e.desc = "إحصائيات البث: تقرير نهاية البث بـ36 قالب، اختيار القوائم (أفضل الداعمين والمكبسين والمعلقين…)، التحميل PNG/JPG/WebP والمشاركة، وشريط إحصائيات مباشر داخل البث."
    return e

@ep
def duration():
    e = Ep(19, "duration", "13-المؤقتات", "مدة البث والمؤقتات", "duration", dict(style="focus", hook="كل ثانية|*محسوبة*", sub="مدة البث والمؤقتات"))
    enter(e, "duration")
    e.tx(4.4, 6.9, "*مدة البث* قدام جمهورك"); e.tx(7.1, 9.8, "ومؤقتات *للتحديات*"); e.cam(7.6, [700, 300], 1.5); e.cam(9.8, [700, 300], 1.5)
    e.kk(10.4, 19.9, "<b>B6O6</b> · مؤقتات البث")
    e.tx(10.4, 14.6, "عد تنازلي · *استراحة*"); e.nav(10.0, "timers"); e.cam(10.6, [640, 420], 1.0); e.mv(11.6, [800, 270], .9); e.cam(12.2, [760, 300], 1.5, ry=3)
    e.tx(15.0, 19.8, "*تشغيل* وإيقاف بضغطة"); e.cl(15.0, '[data-tm="stream"][data-tmop="start"]', .8); e.cam(15.4, '[data-tm="stream"][data-tmop="start"]', 1.9); e.cl(17.2, '[data-tm="stream"][data-tmadd="60000"]', .7); e.cam(19.6, [760, 300], 1.5)
    e.step(1, 20.4, 25.3, "افتح *مدة البث*"); e.cam(20.4, [640, 420], 1.0); e.nav(20.2, "duration"); e.cam(22.0, [700, 300], 1.5); e.mv(22.4, [700, 300], 1.0); e.cam(25.0, [700, 300], 1.5)
    e.step(2, 25.6, 30.6, "*الاستمرار* بين البثوث"); e.mv(25.8, '[data-ducarry]', .9); e.ring(26.2, '[data-ducarry]', 2.4); e.cam(26.2, '[data-ducarry]', 2.1); e.cam(30.4, '[data-ducarry]', 2.0)
    e.step(3, 31.0, 36.1, "أضفها *للمشهد*"); e.cl(31.2, '[data-add="duration"]', .9); e.ring(31.4, '[data-add="duration"]', 2.0); e.cam(31.6, '[data-add="duration"]', 2.0); e.cam(36.0, [500, 450], 1.3)
    e.step(4, 36.5, 41.6, "انسخ الرابط لـ *OBS*")
    obs_copy(e)
    e.result_layout([("duration", dict(x=.15, y=.26, w=.7, h=.1)), ("timer", dict(x=.18, y=.42, w=.64, h=.08))])
    e.likes(42.6, 12, .6)
    result_texts(e, "والنتيجة؟", "الوقت *قدام جمهورك*")
    e.desc = "مدة البث والمؤقتات: عداد مدة البث (يبدأ مع البث أو يدوياً) مع خيار الاستمرار بين البثوث، ومؤقتات للعد التنازلي والاستراحة والتحديات بتشغيل وإيقاف وإضافة وقت."
    return e

@ep
def share():
    e = Ep(20, "share", "02-الاستوديو", "نسخ ومشاركة التصاميم", "layouts", dict(style="mask", hook="صمّم مرة|*وشاركه بضغطة*", sub="مشاركة التصاميم"))
    enter(e, "layouts")
    e.tx(4.4, 6.9, "*كود* لكل تصميم"); e.tx(7.1, 9.8, "ينسخ بثك *كامل*"); e.cam(7.6, [700, 240], 1.4); e.cam(9.8, [700, 240], 1.4)
    e.kk(10.4, 19.9, "<b>B6O6</b> · مكتبة تصاميم البث")
    e.tx(10.4, 14.6, "تصاميم *رسمية* جاهزة"); e.cl(10.4, '[data-lysec="official"]', .8); e.cam(10.8, [640, 440], 1.05, ry=3); e.mv(12.2, [560, 560], 1.2)
    e.tx(15.0, 19.8, "ومن *مكتبة المجتمع*"); e.cl(15.0, '[data-lysec="all"]', .8); e.cam(15.4, [640, 440], 1.05, ry=-3); e.scroll(16.4, 500, 1.6); e.cam(19.6, [600, 420], 1.15)
    e.step(1, 20.4, 25.3, "اضغط *مشاركة تصميمي*"); e.scroll(20.2, 0, .9); e.cam(20.4, [640, 420], 1.0); e.cl(21.2, '[data-lyshare]', .9); e.cam(21.6, '[data-lyshare]', 1.8); e.cam(23.4, [640, 400], 1.2)
    e.step(2, 25.6, 30.6, "انسخ *الكود أو الرابط*"); e.cl(25.8, '[data-ly="code"]', .9); e.ring(26.0, '[data-ly="code"]', 1.6); e.cam(26.2, '[data-ly="code"]', 1.8); e.mv(28.0, '[data-ly="link"]', .7); e.ring(28.2, '[data-ly="link"]', 2.0); e.cam(30.2, '[data-ly="pub"]', 1.6)
    e.step(3, 31.0, 36.1, "أو *انشره* للمجتمع"); e.ring(31.0, '[data-ly="pub"]', 2.4); e.mv(31.2, '[data-ly="pub"]', .8); e.cam(31.4, '[data-ly="pub"]', 1.9); e.cam(35.6, [640, 420], 1.05); e.js(35.8, "document.querySelectorAll('.modal').forEach(m=>m.remove())")
    e.step(4, 36.5, 41.6, "*استورد* أي تصميم"); e.cl(36.6, '[data-lyimp]', .9); e.cam(37.0, '[data-lyimp]', 1.8); e.cam(38.6, [640, 360], 1.3); e.mv(39.0, '[data-li="check"]', .9); e.ring(39.2, '[data-li="check"]', 2.2); e.cam(41.4, '[data-li="check"]', 1.7)
    e.js(41.8, "document.querySelectorAll('.modal').forEach(m=>m.remove())"); e.cam(42.0, [640, 420], .95)
    e.d["ba"] = [42.6, 45.0, 51.6]; e.likes(43.0, 18); e.gift(46.2, "لمى", 7, value=30, count=30, snd="gift-02")
    result_texts(e, "قبل وبعد", "تصميم *جاهز بثواني*")
    e.desc = "مشاركة التصاميم: انسخ كود التصميم أو رابط المشاركة، احفظه في مكتبتك أو انشره في مكتبة المجتمع، واستورد أي تصميم بالكود أو الرابط مع التحقق والمعاينة."
    return e

@ep
def obs():
    e = Ep(21, "obs", "14-الربط", "الربط مع OBS", "obs", dict(style="split", hook="رابط واحد|*وبثك جاهز*", sub="الربط مع OBS"))
    enter(e, "obs")
    e.tx(4.4, 6.9, "*Browser Source* في OBS"); e.tx(7.1, 9.8, "*بخلفية شفافة*"); e.cam(7.6, [700, 200], 1.5); e.cam(9.8, [700, 200], 1.5)
    e.kk(10.4, 19.9, "<b>B6O6</b> · روابط OBS")
    e.tx(10.4, 14.6, "*رابط شامل* للمشهد"); e.mv(10.4, '[data-copyall]', .9); e.ring(10.8, '[data-copyall]', 3.2); e.cam(10.8, '[data-copyall]', 1.8); e.cam(14.4, [640, 300], 1.3)
    e.tx(15.0, 19.8, "أو *رابط لكل عنصر*"); e.cam(15.0, [640, 520], 1.15, ry=3); e.mv(15.4, '[data-copylink]', 1.0); e.ring(16.0, '[data-copylink]', 2.6); e.cam(17.0, '[data-copylink]', 1.8); e.cam(19.6, [640, 520], 1.15)
    e.step(1, 20.4, 25.3, "*عاين* قبل البث"); e.cam(20.4, [640, 420], 1.0); e.cl(21.0, '[data-preview]', .9); e.cam(21.4, '[data-preview]', 1.8); e.cam(23.4, [640, 400], 1.05)
    e.step(2, 25.6, 30.6, "انسخ *الرابط الشامل*"); e.js(25.4, "document.querySelectorAll('.modal').forEach(m=>m.remove())"); e.cl(25.8, '[data-copyall]', .9); e.ring(26.0, '[data-copyall]', 2.2); e.cam(26.2, '[data-copyall]', 2.1); e.cam(30.4, '[data-copyall]', 2.0)
    e.step(3, 31.0, 36.1, "*Sources* ← + ← *Browser*"); e.scroll(30.8, 520, 1.4); e.cam(31.2, [640, 420], 1.0); e.mv(32.6, [760, 590], 1.0); e.cam(33.0, [700, 590], 2.0); e.cam(36.0, [700, 595], 2.0)
    e.step(4, 36.5, 41.6, "الصق الرابط *والمقاس*"); e.cam(36.6, [620, 600], 2.0, ry=3); e.mv(37.0, [520, 600], 1.4); e.cam(41.4, [600, 600], 1.9); e.cam(42.0, [640, 420], .95)
    e.d["appCss"] = ".code{filter:blur(5px)}"; e.d["ba"] = [42.6, 45.0, 51.6]; e.likes(43.0, 18); e.gift(46.2, "فيصل", 6, value=99, count=1, snd="gift-05")
    result_texts(e, "قبل وبعد", "بثك *جاهز في OBS*")
    e.desc = "الربط مع OBS: رابط شامل للمشهد كاملاً أو رابط مستقل لكل عنصر بمقاسه، المعاينة قبل البث، ثم في OBS: Sources ← + ← Browser ← الصق الرابط واكتب العرض والارتفاع."
    return e

@ep
def livestudio():
    e = Ep(22, "livestudio", "14-الربط", "الربط مع TikTok LIVE Studio", "obs", dict(style="rise", hook="بطوط ستريم|*في LIVE Studio*", sub="الربط مع TikTok LIVE Studio"))
    enter(e, "obs")
    e.tx(4.4, 6.9, "نفس *روابط البث*"); e.tx(7.1, 9.8, "داخل *LIVE Studio*"); e.cam(7.6, [700, 240], 1.4); e.cam(9.8, [700, 240], 1.4)
    e.kk(10.4, 19.9, "<b>B6O6</b> · طريقة الإضافة")
    e.tx(10.4, 14.6, "*مصدر رابط* إن توفّر", True); e.scroll(10.4, 520, 1.6); e.cam(10.8, [640, 420], 1.0); e.mv(12.0, [700, 600], 1.0); e.cam(12.6, [680, 600], 2.0)
    e.tx(15.0, 19.8, "أو *OBS Virtual Camera*", True); e.cam(15.2, [560, 615], 2.0, ry=3); e.mv(15.6, [520, 615], 1.4); e.cam(19.6, [560, 615], 2.0)
    e.step(1, 20.4, 25.3, "انسخ *الرابط الشامل*"); e.scroll(20.2, 0, 1.0); e.cam(20.4, [640, 420], 1.0); e.cl(21.4, '[data-copyall]', .9); e.ring(21.6, '[data-copyall]', 2.2); e.cam(21.8, '[data-copyall]', 2.1); e.cam(25.0, '[data-copyall]', 2.0)
    e.step(2, 25.6, 30.6, "أضفه *كمصدر متصفح*", ); e.scroll(25.6, 520, 1.4); e.cam(25.8, [640, 420], 1.0); e.cam(27.4, [680, 600], 2.0); e.mv(27.6, [640, 600], 1.2); e.cam(30.4, [680, 600], 2.0)
    e.step(3, 31.0, 36.1, "أو شغّل *Virtual Camera*"); e.cam(31.2, [560, 615], 2.1, ry=-3); e.mv(31.4, [520, 615], 1.2); e.cam(36.0, [560, 615], 2.1)
    e.step(4, 36.5, 41.6, "ابدأ *بثك المباشر*"); e.cam(36.6, [640, 420], 1.0); e.nav(36.6, "live"); e.cam(38.4, [700, 250], 1.6); e.mv(38.6, '[data-tiktok]', 1.0); e.ring(39.2, '[data-tiktok]', 2.2); e.cam(41.4, '[data-tiktok]', 1.9); e.cam(42.0, [640, 420], .95)
    e.d["appCss"] = ".code{filter:blur(5px)}"; e.likes(42.6, 22, .38); e.gift(45.2, "هيا", 9, value=30, count=30, snd="gift-02"); e.follow(48.0, "تركي", 5, "follow-04")
    result_texts(e, "والنتيجة؟", "طبقاتك *على البث*")
    e.desc = "الربط مع TikTok LIVE Studio: انسخ الرابط الشامل وأضفه كمصدر رابط/متصفح إن كان متاحاً في نسختك، أو استخدم OBS Virtual Camera لإظهار المشهد كاملاً، ثم ابدأ بثك."
    return e

@ep
def billing():
    e = Ep(23, "billing", "15-الاشتراك", "الاشتراك والتجربة المجانية", "billing", dict(style="counter", num=30, hook="أول شهر|*مجاني*", sub="الاشتراك والتجربة المجانية"))
    enter(e, "billing")
    e.tx(4.4, 6.9, "*كل الميزات* بلا حدود"); e.tx(7.1, 9.8, "باشتراك *واحد*"); e.cam(7.6, [770, 330], 2.0); e.cam(9.8, [770, 330], 2.0)
    e.kk(10.4, 19.9, "<b>B6O6</b> · الاشتراك")
    e.tx(10.4, 14.6, "*$7* شهرياً بعد التجربة"); e.cam(10.6, [790, 300], 2.5); e.mv(11.0, [790, 300], 1.2); e.cam(14.4, [790, 320], 2.4)
    e.tx(15.0, 19.8, "*بدون* خصم تلقائي"); e.cam(15.2, [760, 330], 2.4, ry=3); e.mv(15.6, [700, 330], 1.2); e.cam(19.6, [760, 340], 2.3)
    e.step(1, 20.4, 25.3, "*سجّل* حسابك"); e.cam(20.4, [640, 420], 1.0); e.cam(22.0, [770, 400], 2.2); e.mv(22.4, [760, 420], 1.0); e.cam(25.0, [770, 400], 2.2)
    e.step(2, 25.6, 30.6, "التجربة تبدأ *بعد أول بث*"); e.cam(26.0, [770, 330], 2.5); e.mv(26.2, [760, 335], 1.0); e.cam(30.4, [770, 330], 2.5)
    e.step(3, 31.0, 36.1, "اختر *المدة*"); e.cl(31.2, '[data-billm="3"]', .9); e.cam(31.6, '[data-billm="3"]', 2.6); e.cl(33.2, '[data-billm="12"]', .6); e.cam(34.4, '[data-billbuy]', 2.3); e.cl(34.8, '[data-billm="1"]', .5)
    e.step(4, 36.5, 41.6, "ادفع *بأمان*"); e.mv(36.6, '[data-billbuy]', .9); e.ring(37.0, '[data-billbuy]', 3.0); e.cam(37.0, '[data-billbuy]', 2.4); e.cam(40.0, [770, 420], 2.0); e.cam(42.0, [640, 420], .95)
    e.likes(42.6, 22, .38); e.gift(44.6, "سلطان", 2, value=99, count=1, snd="gift-01"); e.follow(47.0, "ريم", 3, "follow-07"); e.comments(45.4, ["بث أسطوري 🔥", "كمل 💪"], 1.6)
    result_texts(e, "والنتيجة؟", "بثك *على مستوى ثاني*")
    e.desc = "الاشتراك: أول 30 يوماً مجاناً وتبدأ التجربة بعد أول بث مؤهل لحسابك، ثم $7 شهرياً ($21 لـ3 أشهر، $84 للسنة) بدون التزام ولا خصم تلقائي — الدفع عبر بوابة آمنة."
    return e

if __name__ == "__main__":
    for n in (sys.argv[1:] or EP.keys()): print(EP[n]().save())
