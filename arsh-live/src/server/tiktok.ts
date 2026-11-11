// ربط TikTok LIVE عبر مكتبة tiktok-live-connector (مكتبة مجتمعية غير رسمية).
// تقرأ الأحداث العامة للبث: إعجابات، هدايا، تعليقات. لا تحتاج كلمة مرور الحساب.
// قيود مهمة:
//  - تعمل فقط والحساب في بث مباشر.
//  - TikTok يرسل الإعجابات على دفعات، وفي البثوث الكبيرة قد لا تصل كل الدفعات.
//  - لا يوجد سجل تاريخي من TikTok: دعم اليوم/الأسبوع/الشهر = ما سجلته المنصة أثناء اتصالها فقط.
//  - قد تتوقف المكتبة إذا غيّر TikTok نظامه — حدّثها بـ npm i tiktok-live-connector@latest
import type { LiveEvent, LiveUser } from "../lib/core";

export type TikTokHandle = { stop(): void; connected: boolean };

function userOf(d: any): LiveUser {
  const u = d?.user ?? d ?? {};
  const id = String(u.uniqueId ?? d?.uniqueId ?? u.userId ?? d?.userId ?? "");
  const name = String(u.nickname ?? d?.nickname ?? id ?? "مجهول");
  const avatar =
    d?.profilePictureUrl ??
    u.profilePictureUrl ??
    u.profilePicture?.url?.[0] ??
    u.profilePicture?.urls?.[0] ??
    u.avatarThumb?.urlList?.[0] ??
    "";
  // صفات المشرف/المشترك: تُقرأ فقط إن أرسلتها المكتبة (غير مضمونة)
  const mod = !!(d?.isModerator ?? u.isModerator ?? d?.userIdentity?.isModeratorOfAnchor);
  const sub = !!(d?.isSubscriber ?? u.isSubscriber ?? d?.userIdentity?.isSubscriberOfAnchor);
  return { id: id || name, name: name || id, avatar, ...(mod ? { mod: true } : {}), ...(sub ? { sub: true } : {}) } as any;
}

export function startTikTok(
  username: string,
  cb: { onEvent(ev: LiveEvent): void; onStatus(live: boolean, text: string): void; onGifts?(gifts: { id: number; name: string; diamonds: number; image?: string }[]): void }
): TikTokHandle {
  const handle: TikTokHandle = { connected: false, stop() {} };
  let stopped = false;
  let conn: any;
  let retry: NodeJS.Timeout | undefined;
  let attempts = 0;

  (async () => {
    let mod: any;
    try {
      mod = await import("tiktok-live-connector");
    } catch {
      cb.onStatus(false, "مكتبة tiktok-live-connector غير مثبتة على الخادم");
      return;
    }
    const Conn = mod.TikTokLiveConnection ?? mod.WebcastPushConnection ?? mod.default?.WebcastPushConnection;
    const E = mod.WebcastEvent ?? {};
    const ev = (k: string, legacy: string) => E[k] ?? legacy;

    const connect = async () => {
      if (stopped) return;
      try { conn?.disconnect(); } catch {}
      // مفتاح خدمة التوقيع (Euler Stream) يُضبط في إعدادات الخادم فقط: TIKTOK_SIGN_API_KEY — يرفع حدود الاتصال من خوادم الاستضافة
      const opts: any = { enableExtendedGiftInfo: true, processInitialData: false };
      if (process.env.TIKTOK_SIGN_API_KEY) opts.signApiKey = process.env.TIKTOK_SIGN_API_KEY;
      conn = new Conn(username, opts);

      // معرّف الرسالة من TikTok يُستخدم لمنع احتساب نفس الحدث مرتين
      const mid = (d: any, kind: string) => { const x = d?.msgId ?? d?.common?.msgId ?? d?.event?.msgId; return x ? `${kind}:${x}` : undefined; };
      conn.on(ev("LIKE", "like"), (d: any) => {
        const count = Number(d.likeCount ?? d.count ?? 0);
        if (count > 0) cb.onEvent({ type: "like", id: mid(d, "like"), user: userOf(d), count });
      });
      conn.on(ev("GIFT", "gift"), (d: any) => {
        const giftType = d.giftType ?? d.giftDetails?.giftType ?? d.gift?.gift_type;
        const repeatEnd = d.repeatEnd ?? d.gift?.repeat_end;
        // هدايا الـ streak: نحسبها مرة وحدة عند نهاية السلسلة بالعدد النهائي
        if (giftType === 1 && !repeatEnd) return;
        const repeat = Number(d.repeatCount ?? d.gift?.repeat_count ?? 1) || 1;
        const diamonds = Number(d.diamondCount ?? d.giftDetails?.diamondCount ?? d.extendedGiftInfo?.diamond_count ?? 0);
        const gift = String(d.giftName ?? d.giftDetails?.giftName ?? d.extendedGiftInfo?.name ?? "هدية");
        const giftId = d.giftId ?? d.giftDetails?.id ?? d.gift?.gift_id;
        const u = userOf(d);
        // معرّف ثابت لنهاية السلسلة: msgId إن وُجد، وإلا (المستخدم + الهدية + المجموعة + العدد)
        const id = mid(d, "gift") ?? `gift:${u.id}:${giftId}:${d.groupId ?? d.gift?.group_id ?? ""}:${repeat}:${d.createTime ?? ""}`;
        cb.onEvent({ type: "gift", id, user: u, value: diamonds * repeat, count: repeat, gift, giftId, diamonds });
      });
      conn.on(ev("CHAT", "chat"), (d: any) => {
        cb.onEvent({ type: "comment", id: mid(d, "chat"), user: userOf(d), text: String(d.comment ?? "").slice(0, 200) });
      });
      // متابعة: حدث FOLLOW في الإصدار 2، أو social بنوع follow في الإصدارات الأقدم
      const onFollow = (d: any) => cb.onEvent({ type: "follow", id: mid(d, "follow") ?? `follow:${userOf(d).id}`, user: userOf(d) });
      if (E.FOLLOW) conn.on(E.FOLLOW, onFollow);
      else conn.on("social", (d: any) => { if (String(d.displayType ?? "").includes("follow")) onFollow(d); });
      // اشتراك: يصل فقط للحسابات المفعّل لها الاشتراك
      // المشاركة: تُرسلها المكتبة (غير الرسمية) كحدث share أو ضمن social — لا تُعتبر مؤكدة حتى تصل فعلياً من بث حقيقي
      const onShare = (d: any) => cb.onEvent({ type: "share", id: mid(d, "share") ?? `share:${userOf(d).id}:${Date.now()}`, user: userOf(d) });
      if (E.SHARE) conn.on(E.SHARE, onShare);
      else conn.on("social", (d: any) => { if (String(d.displayType ?? "").includes("share")) onShare(d); });
      // دخول المشاهدين (لبوت الترحيب) — حدث member من المكتبة غير الرسمية؛ قد لا يصل لكل مشاهد
      conn.on(ev("MEMBER", "member"), (d: any) => cb.onEvent({ type: "join", id: mid(d, "join") ?? `join:${userOf(d).id}`, user: userOf(d) } as any));
      conn.on(ev("SUBSCRIBE", "subscribe"), (d: any) => cb.onEvent({ type: "subscribe", id: mid(d, "sub"), user: userOf(d) }));
      const onEnd = () => { handle.connected = false; cb.onStatus(false, "انتهى البث أو انقطع الاتصال"); schedule(); };
      conn.on(ev("STREAM_END", "streamEnd"), onEnd);
      conn.on(ev("DISCONNECTED", "disconnected"), onEnd);
      conn.on?.("error", () => {});

      try {
        const state = await conn.connect();
        attempts = 0;
        handle.connected = true;
        cb.onStatus(true, `متصل ببث @${username}` + (state?.roomId ? ` (غرفة ${state.roomId})` : ""));
        // قائمة الهدايا الحقيقية (المعرّف والاسم والقيمة) لجدول السبثون — لا نفترض أسماء أو قيم ثابتة
        try {
          const list = state?.availableGifts ?? (await (conn.fetchAvailableGifts?.() ?? conn.getAvailableGifts?.()));
          if (Array.isArray(list) && cb.onGifts) cb.onGifts(list.map((g: any) => ({ id: g.id, name: g.name, diamonds: Number(g.diamond_count ?? g.diamondCount ?? 0), image: g.image?.url_list?.[0] ?? g.image?.urlList?.[0] })).filter((g: any) => g.id != null).sort((a: any, b: any) => a.diamonds - b.diamonds));
        } catch {}
      } catch (e: any) {
        handle.connected = false;
        const msg = String(e?.message || e || "").slice(0, 300);
        console.error(`[tiktok] connect @${username} failed:`, msg, e?.exception?.message || e?.cause?.message || "");
        cb.onStatus(false, `تعذر الاتصال بـ @${username}: ${tiktokReason(msg)}`);
        schedule();
      }
    };
    const schedule = () => {
      if (stopped) return;
      clearTimeout(retry);
      attempts++;
      retry = setTimeout(connect, Math.min(60000, 5000 * attempts));
    };
    handle.stop = () => {
      stopped = true;
      clearTimeout(retry);
      try { conn?.disconnect(); } catch {}
      handle.connected = false;
    };
    await connect();
  })();

  handle.stop = () => { stopped = true; clearTimeout(retry); };
  return handle;
}

/** سبب مفهوم بالعربي من رسالة خطأ المكتبة (بدون اختلاق: غير المعروف يُعرض كما هو مختصراً) */
export function tiktokReason(m: string) {
  const x = m.toLowerCase();
  if (/offline|not live|isn't online|no live|ended/.test(x)) return "الحساب ليس في بث مباشر الآن (أو البث خاص)";
  if (/rate ?limit|429|too many/.test(x)) return "تجاوز حد خدمة التوقيع — حاول بعد دقيقة (أو أضف مفتاح TIKTOK_SIGN_API_KEY)";
  if (/sign|euler|api key|unauthori[sz]ed|401/.test(x)) return "خدمة التوقيع رفضت الطلب — يلزم مفتاح TIKTOK_SIGN_API_KEY على الخادم";
  if (/403|captcha|blocked|forbidden|room ?id|user_not_found|not found/.test(x)) return "TikTok رفض الطلب من الخادم أو لم يجد غرفة البث — تأكد من اسم المستخدم وأن البث عام";
  return "تأكد أن الحساب في بث مباشر الآن" + (m ? ` (${m.slice(0, 90)})` : "");
}
