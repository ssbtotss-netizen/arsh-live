// ربط TikTok LIVE عبر مكتبة tiktok-live-connector (مكتبة مجتمعية غير رسمية).
// تقرأ الأحداث العامة للبث: إعجابات، هدايا، تعليقات. لا تحتاج كلمة مرور الحساب.
// قيود مهمة:
//  - تعمل فقط والحساب في بث مباشر.
//  - TikTok يرسل الإعجابات على دفعات، وفي البثوث الكبيرة قد لا تصل كل الدفعات.
//  - لا يوجد سجل تاريخي من TikTok: دعم اليوم/الأسبوع/الشهر = ما سجلته المنصة أثناء اتصالها فقط.
//  - قد تتوقف المكتبة إذا غيّر TikTok نظامه — حدّثها بـ npm i tiktok-live-connector@latest
import type { LiveEvent, LiveUser } from "../lib/core";
import { normChat, chatShape } from "../engine/chatnorm.js";


export function userOf(d: any): LiveUser {
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
  // متابع لصاحب البث: followRole (1 متابع، 2 صديق) أو followInfo.followStatus — إن أرسلتها المكتبة
  const fr = Number(d?.followRole ?? u.followRole ?? u.followInfo?.followStatus ?? d?.userIdentity?.isFollowerOfAnchor ?? 0);
  const follower = fr >= 1 || d?.userIdentity?.isFollowerOfAnchor === true;
  return { id: id || name, name: name || id, avatar, ...(mod ? { mod: true } : {}), ...(sub ? { sub: true } : {}), ...(follower ? { follower: true } : {}) } as any;
}

/** حالة الربط المعروضة للواجهة — «متصل» فقط بعد نجاح connect() فعلياً */
export type TkState = "connecting" | "waiting" | "connected" | "failed" | "stopped";
export type TkInfo = { state: TkState; username: string; attempt: number; maxAttempts: number; retryAt?: number; kind?: string; text: string; admin?: string; at: number;
  /** معرّف البث الحقيقي من TikTok (roomId) — معرّف جلسة البث */ liveRoomId?: string; /** وقت بدء البث الحقيقي من TikTok (ms) إن توفر */ liveStartAt?: number; /** TikTok أعلن انتهاء البث (STREAM_END) — يختلف عن انقطاع الاتصال */ ended?: boolean };
export type TikTokHandle = { stop(): void; connected: boolean; username: string; info: TkInfo };

/** تصنيف خطأ الاتصال (بدون كشف أي مفتاح) — يقرأ صنف الخطأ وretryAfter/resetTime من المكتبة (≥2.5) وحالة HTTP إن وُجدت */
export type TkErr = { kind: "rate_limit" | "offline" | "sign_auth" | "sign_plan" | "blocked" | "unknown"; code?: string; status?: number; retryAfterMs?: number; requestId?: string; name?: string; msg: string };
export function classifyTikTokError(e: any): TkErr {
  const parts = [e, e?.exception, e?.cause, ...(Array.isArray(e?.errors) ? e.errors : [])].filter(Boolean);
  const msg = parts.map((x: any) => String(x?.message || x || "")).join(" | ").slice(0, 500);
  const x = msg.toLowerCase(), name = String(e?.name || e?.constructor?.name || "");
  const num = (v: any) => (v == null || v === "" || !Number.isFinite(+v) ? undefined : +v);
  let status: number | undefined, retryAfterMs: number | undefined, requestId: string | undefined;
  for (const p of parts) {
    status ??= num(p?.status ?? p?.statusCode ?? p?.response?.status);
    const h = p?.response?.headers ?? p?.headers; const get = (k: string) => (typeof h?.get === "function" ? h.get(k) : h?.[k] ?? h?.[k.toLowerCase()]);
    // retryAfter من المكتبة بالمللي ثانية؛ Retry-After من HTTP بالثواني أو تاريخ؛ resetTime وقت إعادة الضبط
    if (retryAfterMs == null && num(p?.retryAfter) != null) retryAfterMs = Math.max(0, num(p.retryAfter)!);
    const ra = get?.("retry-after"); if (retryAfterMs == null && ra != null) { const n = num(ra); retryAfterMs = n != null ? n * 1000 : Math.max(0, Date.parse(String(ra)) - Date.now()) || undefined; }
    if (retryAfterMs == null && num(p?.resetTime) != null) { const t = num(p.resetTime)!; const ms = t > 1e12 ? t : t * 1000; if (ms > Date.now()) retryAfterMs = ms - Date.now(); }
    requestId ??= get?.("x-request-id") ?? get?.("x-amzn-requestid") ?? p?.requestId ?? undefined;
  }
  const code = (x.match(/rate_limit_[a-z_]+/) || [])[0];
  if (/signatureratelimit/i.test(name) || code || status === 429 || /rate ?limit|too many/.test(x)) return { kind: "rate_limit", code, status: status ?? 429, retryAfterMs, requestId, name, msg };
  if (/useroffline/i.test(name) || /offline|not live|isn't online|no live|ended/.test(x)) return { kind: "offline", status, requestId, name, msg };
  if (/business plan|pricing|premium/.test(x) && !/rate/.test(x)) return { kind: "sign_plan", status, requestId, name, msg };
  if (status === 401 || /api key|unauthori[sz]ed|invalid key|forbidden key/.test(x)) return { kind: "sign_auth", status, requestId, name, msg };
  if (/403|captcha|blocked|forbidden|room ?id|user_not_found|not found/.test(x)) return { kind: "blocked", status, requestId, name, msg };
  return { kind: "unknown", status, requestId, name, msg };
}

/** حصة خدمة التوقيع مشتركة لكل اتصالات هذا الخادم (نفس عنوان IP ونفس المفتاح) — فترة انتظار واحدة للجميع */
export const signQuota = { until: 0, code: "" as string, kind: "" as string, at: 0, last: null as null | (TkErr & { at: number; user: string; attemptId: string }) };
(globalThis as any).__b6o6Sign = signQuota; // تقرأها لوحة الإدارة (نفس العملية) — بدون أي مفتاح
const fmtWait = (ms: number) => { const s = Math.ceil(ms / 1000); if (s < 90) return `${s} ثانية`; const m = Math.round(s / 60); if (m < 90) return `${m} دقيقة`; return `${Math.round(m / 60)} ساعة`; };
/** خطة الانتظار: Retry-After أولاً، وإلا تصاعدي بعدد محاولات محدود (لا حلقة لا نهائية تستهلك الحصة) */
export const TK_BACKOFF: Record<string, number[]> = { rate_limit: [60_000, 5 * 60_000, 15 * 60_000], offline: [30_000, 60_000, 2 * 60_000, 5 * 60_000], unknown: [15_000, 60_000, 3 * 60_000], blocked: [60_000, 5 * 60_000], dropped: [5_000, 15_000, 60_000, 2 * 60_000, 5 * 60_000] };
export function tkDelay(kind: string, attempt: number, retryAfterMs?: number) { const L = TK_BACKOFF[kind]; if (!L || attempt > L.length) return -1; return retryAfterMs != null && retryAfterMs > 0 ? Math.min(retryAfterMs + 1000, 24 * 3600_000) : L[attempt - 1]; }
const keySet = () => !!process.env.TIKTOK_SIGN_API_KEY;
/** رسالة صانع المحتوى + رسالة المشرف (اسم المتغير ومكانه) — بدون أي قيمة للمفتاح */
export function tkTexts(err: TkErr, waitMs: number) {
  const w = waitMs > 0 ? ` — إعادة المحاولة بعد ${fmtWait(waitMs)}` : "";
  const day = /day/.test(err.code || ""), hour = /hour/.test(err.code || "");
  switch (err.kind) {
    case "rate_limit": return { text: `خدمة التوقيع (Euler Stream) رفضت الاتصال: تجاوز ${day ? "الحد اليومي" : hour ? "حد الساعة" : "حد الطلبات"}${waitMs > 0 ? w : " — أُوقفت المحاولات التلقائية"}`,
      admin: keySet() ? `مفتاح TIKTOK_SIGN_API_KEY مضبوط لكن الحصة انتهت (${err.code || "429"}) — راجع خطة Euler Stream` : `TIKTOK_SIGN_API_KEY غير مضبوط: الخادم يستخدم الحصة المجانية المشتركة لعنوان IP (${err.code || "429"}). أنشئ مفتاحاً من eulerstream.com وأضفه في Render ← الخدمة ← Environment باسم TIKTOK_SIGN_API_KEY ثم أعد النشر` };
    case "sign_auth": return { text: "خدمة التوقيع رفضت المفتاح" + w, admin: keySet() ? "TIKTOK_SIGN_API_KEY مضبوط لكنه غير صالح أو منتهي — حدّث قيمته في Render ← Environment" : "خدمة التوقيع تطلب مفتاحاً: أضف TIKTOK_SIGN_API_KEY في Render ← Environment" };
    case "sign_plan": return { text: "خدمة التوقيع تطلب اشتراكاً أعلى لهذا النوع من الاتصال", admin: "مسار التوقيع المطلوب يحتاج خطة Euler مدفوعة" };
    case "offline": return { text: "الحساب ليس في بث مباشر الآن (أو البث خاص)" + w };
    case "blocked": return { text: "TikTok رفض الطلب من الخادم أو لم يجد غرفة البث — تأكد من اسم المستخدم وأن البث عام" + w };
    default: return { text: "تعذر الاتصال" + (err.msg ? ` (${err.msg.slice(0, 90)})` : "") + w };
  }
}

export function startTikTok(
  username: string,
  cb: { onEvent(ev: LiveEvent): void; onStatus(live: boolean, text: string, info?: TkInfo): void; onFollowers?(n: number): void; onStats?(s: { viewers?: number | null; views?: number | null }): void; onGifts?(gifts: { id: number; name: string; diamonds: number; image?: string }[]): void },
  deps: { mod?: any; now?: () => number; log?: (s: string) => void } = {}
): TikTokHandle {
  const now = deps.now ?? Date.now, log = deps.log ?? ((s: string) => console.log(s));
  const info: TkInfo = { state: "connecting", username, attempt: 0, maxAttempts: 0, text: "", at: now() };
  const handle: TikTokHandle = { connected: false, username, info, stop() {} };
  let stopped = false, conn: any, retry: NodeJS.Timeout | undefined, fcTimer: NodeJS.Timeout | undefined, failKind = "", failCount = 0, seq = 0;
  // كل حدث يحمل roomId البث الذي جاء منه — الغرفة تتجاهل أحداث بث سابق وصلت متأخرة
  let lr: string | null = null;
  const emit = (e: any) => cb.onEvent(lr ? { ...e, lr } : e);
  const set = (p: Partial<TkInfo>, live = false) => { if (stopped && p.state !== "stopped") return; Object.assign(info, p, { at: now() }); if (p.retryAt === undefined && p.state !== "waiting") delete info.retryAt; cb.onStatus(live, info.text, { ...info }); };
  const wait = (kind: string, err: TkErr | null, fallbackText?: string) => {
    if (stopped) return;
    if (kind !== failKind) { failKind = kind; failCount = 0; }
    failCount++;
    const shared = kind === "rate_limit" ? Math.max(0, signQuota.until - now()) : 0;
    const d = tkDelay(kind, failCount, err?.retryAfterMs ?? (shared || undefined));
    const T = err ? tkTexts(err, d) : { text: fallbackText || "انقطع الاتصال", admin: undefined };
    if (d < 0) { set({ state: "failed", text: T.text.replace(/ — إعادة المحاولة.*$/, "") + " — أُوقفت المحاولات التلقائية (اضغط «اتصال» للمحاولة)", admin: T.admin, kind, maxAttempts: (TK_BACKOFF[kind] || []).length, attempt: failCount - 1 }); return; }
    if (kind === "rate_limit") { signQuota.until = Math.max(signQuota.until, now() + d); signQuota.code = err?.code || "429"; }
    set({ state: "waiting", retryAt: now() + d, text: T.text, admin: T.admin, kind, attempt: failCount, maxAttempts: (TK_BACKOFF[kind] || []).length });
    clearTimeout(retry); retry = setTimeout(connect, d);
  };

  const connect = async (): Promise<void> => {
    if (stopped) return;
    // حصة مشتركة: إن كان هناك انتظار من اتصال آخر على نفس الخادم ننتظره بدل إرسال طلب توقيع جديد
    const shared = signQuota.until - now();
    if (shared > 1000) { clearTimeout(retry); set({ state: "waiting", retryAt: signQuota.until, kind: "rate_limit", text: `خدمة التوقيع مشغولة لهذا الخادم (${signQuota.code || "429"}) — إعادة المحاولة بعد ${fmtWait(shared)}`, admin: tkTexts({ kind: "rate_limit", code: signQuota.code, msg: "" }, shared).admin }); retry = setTimeout(connect, shared + 500); return; }
    const attemptId = `tk${now().toString(36)}${(++seq).toString(36)}`;
    let mod: any = deps.mod ?? (globalThis as any).__tkTestMod; // __tkTestMod: للاختبارات فقط
    if (!mod) { try { mod = await import("tiktok-live-connector"); } catch { set({ state: "failed", text: "مكتبة tiktok-live-connector غير مثبتة على الخادم" }); return; } }
    if (stopped) return;
    const Conn = mod.TikTokLiveConnection ?? mod.WebcastPushConnection ?? mod.default?.WebcastPushConnection;
    const E = mod.WebcastEvent ?? {};
    const ev = (k: string, legacy: string) => E[k] ?? legacy;
    try { conn?.removeAllListeners?.(); conn?.disconnect(); } catch {}
    set({ state: "connecting", text: `جارٍ الاتصال ببث @${username} …`, kind: undefined, admin: undefined });
    // مفتاح خدمة التوقيع (Euler Stream) من متغيرات بيئة الخادم فقط: TIKTOK_SIGN_API_KEY — لا يُرسل للمتصفح ولا يُسجَّل
    const opts: any = { processInitialData: false }; // بدون enableExtendedGiftInfo (مسار Business) — قيم الهدايا تصل في giftDetails
    if (process.env.TIKTOK_SIGN_API_KEY) opts.signApiKey = process.env.TIKTOK_SIGN_API_KEY;
    const c = new Conn(username, opts); conn = c;
    const live = () => !stopped && conn === c; // تجاهل أحداث اتصال قديم بعد إعادة المحاولة أو الإيقاف

    // معرّف الرسالة من TikTok يُستخدم لمنع احتساب نفس الحدث مرتين
    const mid = (d: any, kind: string) => { const x = d?.msgId ?? d?.common?.msgId ?? d?.event?.msgId; return x ? `${kind}:${x}` : undefined; };
    c.on(ev("LIKE", "like"), (d: any) => { if (!live()) return;
      const count = Number(d.likeCount ?? d.count ?? 0);
      if (count > 0) emit({ type: "like", id: mid(d, "like"), user: userOf(d), count });
    });
    let rawShown = 0;
    c.on(ev("GIFT", "gift"), (d: any) => { if (!live()) return;
      // السلاسل (Streak): TikTok يرسل تحديثات بعدد تراكمي (1→3→5→8) ثم حدثاً نهائياً بنفس العدد.
      // نرسل كل تحديث بمعلومات السلسلة، والغرفة (giftstreak.js) تحتسب الزيادة الجديدة فقط — بدون انتظار النهائي وبدون تكرار.
      const gd = d.giftDetails ?? d.gift ?? {};
      const giftType = d.giftType ?? gd.giftType ?? gd.gift_type ?? gd.type;
      const repeatEnd = d.repeatEnd ?? d.gift?.repeat_end ?? gd.repeatEnd;
      const repeat = Number(d.repeatCount ?? d.gift?.repeat_count ?? d.comboCount ?? 1) || 1;
      const groupCount = Number(d.groupCount ?? d.gift?.group_count ?? 0) || 0;
      const groupId = d.groupId ?? d.gift?.group_id ?? "";
      const diamonds = Number(d.diamondCount ?? gd.diamondCount ?? gd.diamond_count ?? d.extendedGiftInfo?.diamond_count ?? 0);
      const giftId = d.giftId ?? gd.id ?? gd.giftId ?? d.gift?.gift_id;
      const name = d.giftName ?? gd.giftName ?? gd.name ?? d.extendedGiftInfo?.name;
      const image = d.giftPictureUrl ?? gd.giftImage?.giftPictureUrl ?? gd.image?.urlList?.[0] ?? gd.icon?.urlList?.[0] ?? "";
      const u = userOf(d);
      // تشخيص بنية الحدث (أسماء الحقول وقيم العدّ فقط — بدون بيانات حساسة) لأول 3 هدايا في كل اتصال
      if (rawShown < 3) { rawShown++; log(`[tiktok] gift shape id=${attemptId} keys=${Object.keys(d).slice(0, 40).join(",")} details=${Object.keys(gd).slice(0, 25).join(",")} type=${giftType} repeat=${repeat} end=${repeatEnd} group=${groupId ? "yes" : "no"} gc=${groupCount} diamonds=${diamonds} giftId=${giftId ?? "?"}`); }
      const end = repeatEnd === true || Number(repeatEnd) > 0;
      const total = repeat * Math.max(1, groupCount);
      const id = mid(d, "gift") ?? `gift:${u.id}:${giftId}:${groupId}:${repeat}:${end ? 1 : 0}:${d.createTime ?? ""}`;
      emit({ type: "gift", id, user: u, value: diamonds * total, count: total, gift: name != null && String(name).trim() ? String(name) : "هدية", giftId, diamonds, image: String(image || ""),
        streak: { cum: repeat, gc: groupCount, end, type: giftType ?? null, group: groupId != null ? String(groupId) : "" } } as any);
    });
    // إحصائيات البث: المشاهدون الآن (total/viewerCount) وإجمالي المشاهدين في الجلسة (totalUser) من حدث roomUser — كل 5 ث على الأكثر
    let ruShown = 0, ruAt = 0;
    const numOf = (v: any) => { const n = typeof v === "string" ? Number(v.replace(/[,\s]/g, "")) : Number(v); return Number.isFinite(n) && n >= 0 ? n : null; };
    c.on(ev("ROOM_USER", "roomUser"), (d: any) => { if (!live()) return;
      const viewers = numOf(d?.viewerCount ?? d?.total ?? d?.totalUserCount), views = numOf(d?.totalUser ?? d?.total_user);
      if (ruShown < 2) { ruShown++; log(`[tiktok] roomUser shape id=${attemptId} keys=${Object.keys(d || {}).slice(0, 20).join(",")} viewers=${viewers ?? "?"} totalUser=${views ?? "?"}`); }
      const now = Date.now(); if (now - ruAt < 5000) return; ruAt = now; cb.onStats?.({ viewers, views });
    });
    let chatShown = 0;
    c.on(ev("CHAT", "chat"), (d: any) => { if (!live()) return;
      const cu: any = userOf(d); if (String(cu.id).toLowerCase() === username.toLowerCase()) cu.owner = true;
      // النص في v2 داخل content (وكان الكود يقرأ comment من v1 فيصل الاسم بلا نص) — الموحِّد يقرأ الحقل الصحيح أياً كان
      const n = normChat("tiktok", d, { userId: cu.id, username: cu.name, avatar: cu.avatar, messageId: mid(d, "chat") });
      if (chatShown < 3 || (!n.message && !n.emotes.length && chatShown < 10)) { chatShown++; log(`[tiktok] chat shape id=${attemptId} keys=${chatShape(d)} field=${n.field ?? "none"} len=${n.message.length} emotes=${n.emotes.length}`); } // بدون نص المحادثة
      emit({ type: "comment", id: n.messageId ?? undefined, user: cu, text: n.message, emotes: n.emotes, diag: { field: n.field, keys: n.message || n.emotes.length ? undefined : chatShape(d) } } as any);
    });
    const onFollow = (d: any) => { if (live()) emit({ type: "follow", id: mid(d, "follow") ?? `follow:${userOf(d).id}`, user: userOf(d) }); };
    if (E.FOLLOW) c.on(E.FOLLOW, onFollow);
    else c.on("social", (d: any) => { if (String(d.displayType ?? "").includes("follow")) onFollow(d); });
    const onShare = (d: any) => { if (live()) emit({ type: "share", id: mid(d, "share") ?? `share:${userOf(d).id}:${Date.now()}`, user: userOf(d) }); };
    if (E.SHARE) c.on(E.SHARE, onShare);
    else c.on("social", (d: any) => { if (String(d.displayType ?? "").includes("share")) onShare(d); });
    c.on(ev("MEMBER", "member"), (d: any) => { if (live()) emit({ type: "join", id: mid(d, "join") ?? `join:${userOf(d).id}`, user: userOf(d) } as any); });
    c.on(ev("SUBSCRIBE", "subscribe"), (d: any) => { if (live()) emit({ type: "subscribe", id: mid(d, "sub"), user: userOf(d) }); });
    let ended = false;
    // STREAM_END = TikTok أعلن انتهاء البث (تُغلق الجلسة وتُحفظ إحصائياتها) · DISCONNECTED = انقطاع فقط (لا تغيير في الجلسة)
    const onEnd = (real: boolean) => { if (!live() || ended || !handle.connected) return; ended = true; clearInterval(fcTimer); handle.connected = false; if (real) info.ended = true; log(`[tiktok] @${username} ${real ? "stream ended" : "disconnected"} id=${attemptId} room=${lr ?? "?"}`); wait("dropped", null, "انتهى البث أو انقطع الاتصال"); };
    c.on(ev("STREAM_END", "streamEnd"), () => onEnd(true));
    c.on(ev("DISCONNECTED", "disconnected"), () => onEnd(false));
    c.on?.("error", () => {});

    try {
      const state = await c.connect();
      if (!live()) { try { c.disconnect(); } catch {} return; }
      failKind = ""; failCount = 0;
      handle.connected = true;
      log(`[tiktok] @${username} connected id=${attemptId} room=${state?.roomId ?? "?"} key=${keySet() ? "set" : "missing"}`);
      lr = state?.roomId != null ? String(state.roomId) : null;
      // وقت بدء البث الحقيقي (create_time بالثواني) من معلومات الغرفة إن أرسلتها المكتبة — لمدة البث
      const ri: any = state?.roomInfo ?? state?.roomInfoResponse ?? null, rd: any = ri?.data ?? ri ?? {};
      const ct = Number(rd?.create_time ?? rd?.createTime ?? rd?.start_time ?? rd?.room?.create_time ?? 0);
      const liveStartAt = ct > 1e12 ? ct : ct > 1e9 ? ct * 1000 : undefined;
      { const uc = Number(rd?.user_count ?? rd?.userCount ?? NaN), tu = Number(rd?.stats?.total_user ?? rd?.stats?.totalUser ?? NaN);
        if (Number.isFinite(uc) || Number.isFinite(tu)) queueMicrotask(() => cb.onStats?.({ viewers: Number.isFinite(uc) ? uc : null, views: Number.isFinite(tu) ? tu : null })); }
      log(`[tiktok] room info id=${attemptId} stateKeys=${Object.keys(state || {}).slice(0, 12).join(",")} infoKeys=${Object.keys(rd || {}).slice(0, 20).join(",")} start=${liveStartAt ? new Date(liveStartAt).toISOString() : "n/a"}`);
      set({ state: "connected", attempt: 0, maxAttempts: 0, kind: undefined, admin: undefined, liveRoomId: lr ?? undefined, liveStartAt, ended: false, text: `متصل ببث @${username}` + (state?.roomId ? ` (غرفة ${state.roomId})` : "") }, true);
      const syncFollowers = async () => { try { const inf: any = await c.fetchRoomInfo?.(); const o = inf?.owner ?? inf?.data?.owner ?? inf?.roomInfo?.owner; const n = Number(o?.follow_info?.follower_count ?? o?.followInfo?.followerCount);
        if (Number.isFinite(n) && n > 0) cb.onFollowers?.(n);
        // وقت بدء البث من معلومات الغرفة (إن لم يصل مع الاتصال) — مرة واحدة
        if (!info.liveStartAt) { const d: any = inf?.data ?? inf ?? {}; const ct2 = Number(d?.create_time ?? d?.createTime ?? d?.room?.create_time ?? 0); const at = ct2 > 1e12 ? ct2 : ct2 > 1e9 ? ct2 * 1000 : 0;
          if (at && live() && handle.connected) { log(`[tiktok] stream start from room info id=${attemptId} start=${new Date(at).toISOString()}`); set({ liveStartAt: at, text: info.text }, true); } }
      } catch (e: any) { console.error("[tiktok] follower sync failed:", String(e?.message || e).slice(0, 160)); } };
      clearInterval(fcTimer); syncFollowers(); fcTimer = setInterval(() => { if (handle.connected && live()) syncFollowers(); }, 60_000);
      try {
        const raw: any = state?.availableGifts ?? (await (c.fetchAvailableGifts?.() ?? c.getAvailableGifts?.()));
        const list = Array.isArray(raw) ? raw : (raw?.gifts ?? raw?.data?.gifts ?? raw?.giftList ?? null);
        if (Array.isArray(list) && list.length && cb.onGifts) { cb.onGifts(list.map((g: any) => ({ id: g.id ?? g.giftId, name: g.name ?? g.giftName, diamonds: Number(g.diamond_count ?? g.diamondCount ?? 0), image: g.image?.url_list?.[0] ?? g.image?.urlList?.[0] ?? g.icon?.url_list?.[0] })).filter((g: any) => g.id != null && g.name).sort((a: any, b: any) => a.diamonds - b.diamonds)); log(`[tiktok] gift catalog loaded n=${list.length} id=${attemptId}`); }
        else log(`[tiktok] gift catalog unavailable id=${attemptId} type=${raw == null ? "none" : Array.isArray(raw) ? "array0" : Object.keys(raw).slice(0, 8).join(",")}`);
      } catch (e: any) { log(`[tiktok] gift catalog failed id=${attemptId} msg=${String(e?.message || e).replace(/\s+/g, " ").slice(0, 140)}`); }
    } catch (e: any) {
      if (!live()) return;
      handle.connected = false;
      const err = classifyTikTokError(e);
      // سجل آمن: الحالة، الصنف، الكود، Retry-After، معرّف الطلب والمحاولة — بدون المفتاح أو أي ترويسة سرية
      log(`[tiktok] connect @${username} failed id=${attemptId} kind=${err.kind} status=${err.status ?? "-"} code=${err.code ?? "-"} retryAfterMs=${err.retryAfterMs ?? "-"} reqId=${err.requestId ?? "-"} name=${err.name || "-"} key=${keySet() ? "set" : "missing"} msg=${err.msg.replace(/\s+/g, " ").slice(0, 160)}`);
      if (err.kind === "rate_limit") signQuota.last = { ...err, at: now(), user: username, attemptId };
      const kind = err.kind === "sign_auth" || err.kind === "sign_plan" ? "" : err.kind;
      if (!kind) { const T = tkTexts(err, 0); set({ state: "failed", text: T.text, admin: T.admin, kind: err.kind }); return; } // مفتاح مرفوض: لا إعادة محاولة
      wait(kind, err);
    }
  };
  handle.stop = () => {
    stopped = true; clearInterval(fcTimer); clearTimeout(retry);
    try { conn?.removeAllListeners?.(); conn?.disconnect(); } catch {}
    conn = null; handle.connected = false; Object.assign(info, { state: "stopped", text: "تم إيقاف الربط", at: now() }); delete info.retryAt;
  };
  queueMicrotask(() => { connect(); }); // بعد إرجاع المقبض: أول حالة تصل والمستدعي يعرف الاتصال
  return handle;
}

/** سبب مفهوم بالعربي من رسالة خطأ (للتوافق مع الاستخدامات القديمة) */
export function tiktokReason(m: string) { return tkTexts(classifyTikTokError(new Error(m)), 0).text; }
