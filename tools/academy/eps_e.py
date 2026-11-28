# الدفعة E: الحلقات 24–29
from series import Ep, ep, EP
from eps_a import enter, result_texts
from eps_d import obs_copy
import sys

def click_in_app(e, t, sel, snd=None):  # ضغط زر تجربة حقيقي داخل المنصة أثناء مشهد النتيجة (المنصة تبقى مفتوحة خلف المشهد)
    e.js(t, f"(b=>b&&b.click())(document.querySelector('{sel}'))")
    if snd: e.a(t=t, snd=snd)

@ep
def actions():
    e = Ep(24, "actions", "11-البوتات", "الإجراءات التلقائية", "actions", dict(style="chip", hook="خلّ الهدايا|*تشغّل بثك*", chip=["🌹", "وردة = +30 ثانية", "قاعدة تلقائية · الآن"], chipSnd="gift-02"))
    enter(e, "actions")
    e.tx(4.4, 6.9, "*قواعد* تشتغل لحالها"); e.tx(7.1, 9.8, "مع كل *هدية وتفاعل*"); e.cam(7.6, [700, 110], 1.8); e.cam(9.8, [700, 110], 1.8)
    e.kk(10.4, 19.9, "<b>B6O6</b> · الإجراءات التلقائية")
    e.tx(10.4, 14.6, "*قوالب* جاهزة"); e.mv(10.4, '[data-actnew="rose"]', .9); e.ring(10.8, '[data-actnew="rose"]', 1.2); e.cam(10.8, [600, 110], 1.9); e.ring(12.2, '[data-actnew="lion"]', 1.2); e.ring(13.4, '[data-actnew="likes"]', 1.2); e.mv(13.0, '[data-actnew="likes"]', .6)
    e.tx(15.0, 19.8, "أو *قاعدة* من الصفر"); e.mv(15.0, '[data-actnew="blank"]', .8); e.ring(15.4, '[data-actnew="blank"]', 2.6); e.cam(15.4, '[data-actnew="blank"]', 2.0); e.cam(19.6, [640, 300], 1.3)
    e.step(1, 20.4, 25.3, "اختر *القالب*"); e.cl(20.6, '[data-actnew="rose"]', .9); e.cam(21.0, '[data-actnew="rose"]', 2.0); e.cam(23.2, [640, 380], 1.15); e.mv(23.4, [600, 400], 1.0)
    e.step(2, 25.6, 30.6, "*خصّص* الشرط والنتيجة"); e.cam(25.8, [640, 360], 1.35, ry=3); e.mv(26.0, [700, 330], 1.2); e.mv(28.0, [520, 380], 1.2); e.cam(30.4, [600, 360], 1.35)
    e.step(3, 31.0, 36.1, "أضف *قاعدة الأسد*"); e.cl(31.2, '[data-actnew="lion"]', .9); e.cam(31.6, '[data-actnew="lion"]', 2.0); e.cam(34.0, [640, 400], 1.1); e.mv(34.2, [600, 420], 1.0)
    e.step(4, 36.5, 41.6, "اعرضها *في البث*"); e.cl(36.8, '[data-addw="actbox"]', 1.0); e.ring(37.0, '[data-addw="actbox"]', 2.6); e.cam(37.2, '[data-addw="actbox"]', 2.0); e.cam(41.2, '[data-addw="actbox"]', 1.9); e.cam(42.0, [640, 420], .95)
    e.result_layout([("subathon", dict(x=.12, y=.2, w=.76, h=.13)), ("actbox", dict(x=.08, y=.4, w=.84, h=.3))])
    e.gift(43.0, "ريم", 3, value=1, count=1, dia=1, snd="gift-02"); e.gift(46.0, "سلطان", 2, gift="Lion", gid=6369, dia=29999, value=299, count=1, snd="tier-100"); e.gift(49.0, "هيا", 9, value=1, count=1, dia=1, snd="gift-04")
    result_texts(e, "والنتيجة؟", "الهدايا *تحرّك البث*")
    e.desc = "الإجراءات التلقائية: قوالب جاهزة (وردة = +30ث، هدية كبيرة = احتفال، 1000 لايك = +دقيقة، أوامر للمشرفين) أو قاعدة من الصفر، مع ودجت عرض الإجراءات في البث."
    return e

@ep
def donations():
    e = Ep(25, "donations", "16-الدونيشن", "الدونيشن والآيرتات", "donations", dict(style="counter", num=500, prefix="$", hook="الدعم المالي|*بشكل احترافي*", sub="الدونيشن"))
    enter(e, "donations")
    e.tx(4.4, 6.9, "*لوحة* لكل تبرعاتك"); e.tx(7.1, 9.8, "أهداف · تنبيهات · *سجل*"); e.cam(7.6, [640, 90], 1.8); e.cam(9.8, [640, 90], 1.8)
    e.kk(10.4, 19.9, "<b>B6O6</b> · الدونيشن")
    e.tx(10.4, 14.6, "*عناصر* جاهزة للبث"); e.cl(10.4, '[data-dontab="widgets"]', .8); e.cam(10.8, [640, 420], 1.05, ry=3); e.mv(12.0, [560, 420], 1.2); e.cam(14.4, [600, 400], 1.15)
    e.tx(15.0, 19.8, "و*أهداف* للدعم"); e.cl(15.0, '[data-dontab="goals"]', .8); e.cam(15.4, [640, 420], 1.05, ry=-3); e.mv(16.4, [560, 400], 1.2); e.cam(19.6, [600, 400], 1.15)
    e.step(1, 20.4, 25.3, "اربط *حساب الدونيشن*"); e.cl(20.4, '[data-dontab="providers"]', .8); e.cam(20.8, [640, 420], 1.05); e.mv(22.0, [700, 330], 1.0); e.cam(22.4, [700, 330], 1.4); e.cam(25.2, [700, 330], 1.4)
    e.step(2, 25.6, 30.6, "حدّد *مستويات التنبيه*"); e.nav(25.4, "donalerts"); e.cam(25.8, [640, 420], 1.0); e.mv(27.2, '[data-dnlib]', .9); e.ring(27.6, '[data-dnlib]', 2.6); e.cam(27.6, '[data-dnlib]', 1.9); e.cam(30.4, '[data-dnlib]', 1.8)
    e.step(3, 31.0, 36.1, "جرّب *مبلغ تجريبي*"); e.scroll(31.0, 500, 1.4); e.cam(31.2, [640, 420], 1.0); e.cl(32.6, '[data-dntamt="50"]', .9); e.cam(33.0, '[data-dntamt="50"]', 2.0); e.cam(36.0, [800, 330], 1.4)
    e.step(4, 36.5, 41.6, "ابدأ *جلسة البث*"); e.nav(36.4, "donations"); e.cam(36.8, [640, 420], 1.0); e.mv(38.2, '[data-don-session]', .9); e.ring(38.6, '[data-don-session]', 2.6); e.cam(38.6, '[data-don-session]', 1.9); e.cam(41.4, '[data-don-sim="50"]', 1.8); e.cam(42.0, [640, 420], .95)
    e.result_layout([("donGoal", dict(x=.08, y=.3, w=.84, h=.14))])
    click_in_app(e, 43.0, '[data-don-sim="5"]', "tier-5"); click_in_app(e, 45.4, '[data-don-sim="50"]', "tier-50"); click_in_app(e, 48.2, '[data-don-sim="500"]', "tier-200")
    result_texts(e, "والنتيجة؟", "الهدف *يتعبّى لحظياً*")
    e.desc = "الدونيشن: لوحة التبرعات، عناصر جاهزة (آخر دعم، شريط، هدف)، أهداف الدعم، ربط حساب مزود الدونيشن، مستويات التنبيه ومقاطعها، والتجربة بمبالغ تجريبية قبل البث."
    return e

@ep
def bots():
    e = Ep(26, "bots", "11-البوتات", "مركز البوتات", "bots", dict(style="mask", hook="بوت يرد|*ويشكر بدالك*", sub="مركز البوتات"))
    enter(e, "bots")
    e.tx(4.4, 6.9, "أوامر · ردود · *شكر*"); e.tx(7.1, 9.8, "*يشتغل* وأنت تلعب"); e.cam(7.6, [640, 220], 1.45); e.cam(9.8, [640, 220], 1.45)
    e.kk(10.4, 19.9, "<b>B6O6</b> · مركز البوتات")
    e.tx(10.4, 14.6, "*أوامر* مثل ‎!وقت و‎!هدف", True); e.cl(10.4, '[data-btab="commands"]', .8); e.cam(10.8, [640, 420], 1.05, ry=3); e.mv(12.0, [600, 400], 1.2); e.cam(14.4, [620, 380], 1.2)
    e.tx(15.0, 19.8, "*شكر تلقائي* للداعمين"); e.cl(15.0, '[data-btab="thanks"]', .8); e.cam(15.4, [640, 420], 1.05, ry=-3); e.mv(16.4, [600, 400], 1.2); e.cam(19.6, [620, 380], 1.2)
    e.step(1, 20.4, 25.3, "شغّل *البوتات* اللي تبيها"); e.cl(20.4, '[data-btab="status"]', .8); e.cam(20.8, [640, 260], 1.4); e.mv(22.0, '[data-bp="status.welcome"]', .9); e.ring(22.4, '[data-bp="status.welcome"]', 2.4); e.cam(22.4, '[data-bp="status.welcome"]', 2.0); e.cam(25.2, '[data-bp="status.welcome"]', 1.9)
    e.step(2, 25.6, 30.6, "*ردود تلقائية* للأسئلة"); e.cl(25.8, '[data-btab="replies"]', .8); e.cam(26.2, [640, 420], 1.05); e.mv(27.4, [600, 380], 1.2); e.cam(30.4, [620, 360], 1.25)
    e.step(3, 31.0, 36.1, "*جرّب* البوت"); e.cl(31.0, '[data-btab="test"]', .8); e.cam(31.4, [640, 260], 1.3); e.cl(32.6, '[data-bsim="hi"]', .8); e.cam(33.0, '[data-bsim="hi"]', 1.9); e.cl(34.4, '[data-bsim="time"]', .7); e.cam(36.0, [640, 320], 1.3)
    e.step(4, 36.5, 41.6, "اعرض الردود *في البث*"); e.cl(36.8, '[data-bsim="rose"]', .8, snd="gift-02"); e.cam(37.2, '[data-bsim="rose"]', 1.9); e.cam(39.0, [640, 400], 1.1); e.mv(39.4, [600, 420], 1.4); e.cam(42.0, [640, 420], .95)
    e.result_layout([("botbox", dict(x=.08, y=.24, w=.84, h=.24)), ("uchat", dict(x=.08, y=.52, w=.84, h=.28))])
    click_in_app(e, 42.8, '[data-bsim="hi"]'); click_in_app(e, 44.8, '[data-bsim="goal"]'); click_in_app(e, 46.8, '[data-bsim="rose"]', "gift-04"); click_in_app(e, 48.8, '[data-bsim="likes"]')
    result_texts(e, "والنتيجة؟", "البوت *يرد لحظياً*")
    e.desc = "مركز البوتات: بوت الأوامر (‎!وقت، ‎!هدف، ‎!تكبيس…)، الردود التلقائية، شكر الداعمين والمتابعين، الترحيب، الرسائل الدورية، القارئ الصوتي والفلترة — مع لوحة تجربة وودجت ردود البوت في البث."
    return e

@ep
def socials():
    e = Ep(27, "socials", "17-الحسابات", "حساباتي في البث", "socials", dict(style="rise", hook="خلّ جمهورك|*يتابعك في كل مكان*", sub="حساباتي"))
    enter(e, "socials")
    e.tx(4.4, 6.9, "حساباتك *على البث*"); e.tx(7.1, 9.8, "بتناوب *أنيق*"); e.cam(7.6, [700, 260], 1.45); e.cam(9.8, [700, 260], 1.45)
    e.kk(10.4, 19.9, "<b>B6O6</b> · حساباتي")
    e.tx(10.4, 14.6, "*تصاميم* للبطاقة"); e.cl(10.4, '[data-soctab="style"]', .8); e.cam(10.8, [640, 420], 1.05, ry=3); e.mv(12.0, [560, 420], 1.2); e.cam(14.4, [600, 400], 1.15)
    e.tx(15.0, 19.8, "*مكتبة* للحركات"); e.cl(15.0, '[data-soctab="anim"]', .8); e.cam(15.4, [640, 420], 1.05, ry=-3); e.mv(16.4, [560, 420], 1.2); e.cam(19.6, [600, 400], 1.15)
    e.step(1, 20.4, 25.3, "أضف *حسابك*"); e.cl(20.4, '[data-soctab="accounts"]', .8); e.cam(20.8, [640, 420], 1.0); e.mv(21.8, '[data-acc-add="social"]', .9); e.ring(22.2, '[data-acc-add="social"]', 2.4); e.cam(22.2, '[data-acc-add="social"]', 2.0); e.cam(25.2, [700, 330], 1.5)
    e.step(2, 25.6, 30.6, "اكتب *اليوزر* والمنصة"); e.cam(25.8, [700, 340], 1.7); e.mv(26.0, [700, 340], 1.0); e.cam(30.4, [700, 360], 1.6)
    e.step(3, 31.0, 36.1, "جرّب *التناوب*"); e.cl(31.0, '[data-soctab="rotation"]', .8); e.cam(31.4, [640, 380], 1.1); e.cl(32.6, '[data-pv="play"]', .8); e.cam(33.0, [640, 300], 1.5); e.cl(34.6, '[data-pv="next"]', .6); e.cam(36.0, [640, 300], 1.5)
    e.step(4, 36.5, 41.6, "انسخ الرابط لـ *OBS*")
    obs_copy(e)
    e.result_layout([("social", dict(x=.12, y=.62, w=.76, h=.1)), ("lb", dict(topN=3, x=.1, y=.2, w=.8, h=.36, source="gifts", design="crystalMoon", title="أفضل الداعمين"))])
    e.likes(42.6, 16, .5)
    result_texts(e, "والنتيجة؟", "حساباتك *قدام جمهورك*")
    e.desc = "حساباتي: إضافة حسابات التواصل والألعاب، تصاميم للبطاقة ومكتبة حركات، تناوب تلقائي مع معاينة، وإظهارها في البث برابط OBS."
    return e

@ep
def bio():
    e = Ep(28, "bio", "17-الحسابات", "رابط البايو", "bio", dict(style="focus", hook="رابط واحد|*لكل حساباتك*", sub="رابط البايو"))
    e.d["live"] = None; e.d["app"] = [4.0, 52.0]
    enter(e, "bio")
    e.tx(4.4, 6.9, "صفحة *باسمك*"); e.tx(7.1, 9.8, "حطها في *البايو*"); e.cam(7.6, [700, 200], 1.6); e.cam(9.8, [700, 200], 1.6)
    e.kk(10.4, 19.9, "<b>B6O6</b> · رابط البايو")
    e.tx(10.4, 14.6, "*40* تصميم للصفحة"); e.scroll(10.4, 860, 1.6); e.cam(10.8, [640, 420], 1.05, ry=3); e.mv(12.0, [560, 420], 1.2); e.cl(12.8, '[data-biod="duck"]', .6); e.cam(14.4, [600, 400], 1.15)
    e.tx(15.0, 19.8, "*لايف* وروابطك كلها"); e.cl(15.2, '[data-biod="starNight"]', .8); e.cam(15.6, '[data-biod="starNight"]', 1.6, ry=-3); e.cam(19.6, [600, 400], 1.15)
    e.step(1, 20.4, 25.3, "اكتب *اسمك ويوزرك*"); e.scroll(20.2, 0, 1.0); e.cam(20.4, [640, 420], 1.0); e.cl(21.2, '[data-bio="name"]', .8); e.cam(21.6, '[data-bio="name"]', 1.9); e.ty(22.2, '[data-bio="name"]', "B6O6 Streaming", 8)
    e.step(2, 25.6, 30.6, "أضف *روابطك*"); e.scroll(25.6, 380, 1.2); e.cam(25.8, [640, 420], 1.0); e.mv(27.0, '[data-bl="0"][data-blf="url"]', .9); e.cam(27.2, '[data-bl="0"][data-blf="url"]', 1.8); e.ring(27.6, '[data-bl="0"][data-blf="type"]', 2.4); e.cam(30.4, [700, 300], 1.4)
    e.step(3, 31.0, 36.1, "انسخ *الرابط*"); e.scroll(31.0, 1400, 1.6); e.cam(31.2, [640, 420], 1.0); e.cl(32.8, '[data-biocopy]', .9); e.ring(33.0, '[data-biocopy]', 2.2); e.cam(33.2, '[data-biocopy]', 2.0); e.cam(36.0, '[data-biocopy]', 1.9)
    e.step(4, 36.5, 41.6, "أو حمّل *رمز QR*"); e.cl(36.8, '[data-bioqr="png"]', .9); e.ring(37.0, '[data-bioqr="png"]', 2.4); e.cam(37.2, '[data-bioqr="png"]', 2.0); e.cam(41.4, [600, 360], 1.3)
    e.tx(42.3, 44.9, "والنتيجة؟"); e.tx(45.1, 51.6, "صفحة *احترافية* باسمك"); e.kk(45.1, 51.6, "معاينة حيّة من المنصة")
    e.scroll(42.2, 860, 1.6); e.cam(42.4, [640, 420], 1.0); e.cam(44.6, [150, 360], 2.0, ry=4); e.cam(48.4, [150, 380], 2.2, ry=-4); e.cam(51.6, [150, 370], 2.0)
    e.desc = "رابط البايو: صفحة باسمك فيها كل حساباتك وحالة اللايف، 40 تصميم، ترتيب الروابط، نسخ الرابط أو تحميل رمز QR بصيغة PNG/SVG."
    return e

@ep
def community():
    e = Ep(29, "community", "17-الحسابات", "المجتمعات والإشعارات", "community", dict(style="split", hook="جمهورك يعرف|*إنك لايف*", sub="Discord وTelegram"))
    e.d["live"] = None; e.d["app"] = [4.0, 52.0]
    enter(e, "community")
    e.tx(4.4, 6.9, "*Discord* و*Telegram*"); e.tx(7.1, 9.8, "إشعار *تلقائي* لمجتمعك"); e.cam(7.6, [700, 160], 1.7); e.cam(9.8, [700, 160], 1.7)
    e.kk(10.4, 19.9, "<b>B6O6</b> · المجتمعات والإشعارات")
    e.tx(10.4, 14.6, "بداية البث · *نهايته*"); e.cam(10.6, [760, 420], 1.5, ry=3); e.mv(11.0, '[data-nf="discord.events.live_start.on"]', .9); e.ring(11.4, '[data-nf="discord.events.live_start.tpl"]', 3.0)
    e.tx(15.0, 19.8, "ملخص · أهداف · *دعم كبير*", True); e.cam(15.2, [760, 640], 1.5, ry=-3); e.mv(15.4, '[data-nf="discord.events.big_support.tpl"]', 1.0); e.ring(15.8, '[data-nf="discord.events.big_support.tpl"]', 3.4); e.cam(19.6, [760, 620], 1.45)
    e.step(1, 20.4, 25.3, "الصق *رابط Webhook*"); e.cam(20.6, '[data-nf="discord.secret"]', 2.0); e.mv(20.8, '[data-nf="discord.secret"]', .9); e.ring(21.4, '[data-nf="discord.secret"]', 3.6); e.cam(25.2, '[data-nf="discord.secret"]', 1.9)
    e.step(2, 25.6, 30.6, "اختر *متى ينرسل*"); e.cam(25.8, [760, 470], 1.5); e.cl(26.6, '[data-nf="discord.events.goal.on"]', .9); e.cam(27.0, '[data-nf="discord.events.goal.on"]', 2.0); e.cam(30.4, [760, 520], 1.5)
    e.step(3, 31.0, 36.1, "*خصّص* نص الرسالة"); e.cl(31.2, '[data-nf="discord.events.live_start.tpl"]', .9); e.cam(31.6, '[data-nf="discord.events.live_start.tpl"]', 1.9); e.ring(32.4, '[data-nf="discord.events.live_start.tpl"]', 3.2); e.cam(36.0, '[data-nf="discord.events.live_start.tpl"]', 1.8)
    e.step(4, 36.5, 41.6, "احفظ *وجرّب*"); e.cl(36.8, '[data-nsave="discord"]', .9); e.cam(37.2, '[data-nsave="discord"]', 2.0); e.mv(38.6, '[data-ntest="discord"]', .7); e.ring(38.8, '[data-ntest="discord"]', 2.4); e.cam(41.4, '[data-ntest="discord"]', 1.9)
    e.tx(42.3, 44.9, "والنتيجة؟"); e.tx(45.1, 51.6, "رسائلك *جاهزة للإرسال*"); e.kk(45.1, 51.6, "قوالب الإشعارات داخل المنصة")
    e.cam(42.4, [760, 420], 1.1); e.cam(44.6, '[data-nf="discord.events.live_start.tpl"]', 1.9, ry=3); e.cam(47.6, '[data-nf="discord.events.stats.tpl"]', 1.9, ry=-3); e.cam(51.6, '[data-nf="discord.events.goal.tpl"]', 1.8)
    e.desc = "المجتمعات والإشعارات: ربط Discord أو Telegram برابط Webhook (يبقى سرياً ومخفياً)، إشعارات بداية ونهاية البث والملخص والأهداف والدعم الكبير، قوالب نص قابلة للتعديل، حفظ وإرسال تجربة."
    return e

if __name__ == "__main__":
    for n in (sys.argv[1:] or EP.keys()): print(EP[n]().save())
