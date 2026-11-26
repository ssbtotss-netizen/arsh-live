// مشغل الأصوات في رابط OBS / TikTok LIVE Studio (Browser Source) — بدون واجهة مرئية
// أصوات الأحداث: واحد تلو الآخر حسب الأولوية (لا تداخل) · التشغيل اليدوي: فوقها (حتى 3 معاً) · ملف تالف/لا يحمّل ← تخطي بعد مهلة
import { View } from "./view.js";
import { sndQueue, sndQueuePush, sndQueueNext, sndUrl } from "./sounds.js";

const SNDV_CSS = `.sndp{position:absolute;inset:0;pointer-events:none}.sndp .sndp-card{display:none}
body:not(.ov) .sndp .sndp-card,.sndp.sndp-show .sndp-card{display:flex;align-items:center;gap:.5em;margin:.4em;padding:.45em .8em;border-radius:12px;background:rgba(15,18,30,.75);color:#fff;font:600 14px system-ui;border:1px solid rgba(255,255,255,.15);width:max-content}
.sndp-unlock{position:fixed;inset:auto 12px 12px auto;z-index:99;pointer-events:auto;padding:.7em 1.1em;border-radius:12px;border:0;background:#8b5cf6;color:#fff;font:700 15px system-ui;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.4)}`;
function sndvCss() { if (typeof document === "undefined" || document.getElementById("sndv-css")) return; const s = document.createElement("style"); s.id = "sndv-css"; s.textContent = SNDV_CSS; document.head.appendChild(s); }
const sndvIsOv = () => typeof window !== "undefined" && !!window.__arshOverlay; // الصوت يعمل في رابط OBS فقط — لا في معاينة لوحة التحكم
const sndvBase = () => (typeof window !== "undefined" && window.B6O6_SND_BASE) || (typeof location !== "undefined" && location.protocol === "file:" ? "../arsh-live/public/sounds/lib/" : "/sounds/lib/");
const sndvMaster = () => { const c = typeof window !== "undefined" && window.__arshSnd; return c && c.on === false ? 0 : Math.max(0, Math.min(100, c && c.vol != null ? +c.vol : 80)) / 100; };

Object.assign(View.prototype, {
  sndMount() { sndvCss(); if (this.sndRoot && this.sndRoot.isConnected) return; this.el.innerHTML = `<div class="sndp"><div class="sndp-card">🔊 <span>مشغل الأصوات — يعمل في رابط OBS</span></div></div>`; this.sndRoot = this.el.firstElementChild;
    this.SQ = this.SQ || sndQueue(); this.sndManual = this.sndManual || []; this.sndStat = this.sndStat || { played: 0, failed: 0, merged: 0 }; },
  /** رسالة من الخادم: {t:"snd", items} أو {t:"snd", stop:"cur"|"all"} */
  sndOn(m) { if (!sndvIsOv()) return; this.sndMount();
    if (m.stop) { this.sndStopAll(m.stop === "all"); return; }
    const explore = !!window.__arshExplore, cfgMax = (window.__arshSnd && +window.__arshSnd.maxQ) || 12;
    for (const it of m.items || []) {
      if (it.manual) { this.sndPlayNow(it); continue; }
      sndQueuePush(this.SQ, it, explore ? Math.min(6, cfgMax) : cfgMax); this.sndStat.merged += it.merged || 0; }
    this.sndNext(); },
  sndNext() { if (this.sndBusy) return; const it = sndQueueNext(this.SQ); if (!it) return; this.sndBusy = true;
    this.sndPlay(it, true).then(ok => { ok ? this.sndStat.played++ : this.sndStat.failed++; this.sndBusy = false; this.sndCur = null; setTimeout(() => this.sndNext(), 60); }); },
  sndPlayNow(it) { this.sndManual = this.sndManual.filter(a => !a.done); if (this.sndManual.length >= 3) { const old = this.sndManual.shift(); old.stop(); } this.sndPlay(it, false); },
  /** تشغيل صوت واحد بإعداداته (البداية/النهاية/التكرار/الانتظار/التلاشي/السرعة/مستوى الصوت) — يعيد true عند النجاح */
  sndPlay(it, main) {
    const s = it.s || {}, url = sndUrl(s.src, window.__arshSndUrls, sndvBase()); if (!url) return Promise.resolve(false);
    return new Promise(resolve => {
      const a = new Audio(); a.preload = "auto"; a.src = url; a.playbackRate = s.rate || 1; let times = s.times || 1, done = false, iv = 0, endT = 0, guard = 0, useT = false;
      const vol = () => Math.max(0, Math.min(1, ((s.vol ?? 100) / 100) * sndvMaster()));
      const ctl = { done: false, stop: () => finish(true) }; if (main) this.sndCur = ctl; else this.sndManual.push(ctl);
      const finish = (ok) => { if (done) return; done = ctl.done = true; clearInterval(iv); clearTimeout(endT); clearTimeout(guard); try { a.pause(); a.removeAttribute("src"); a.load(); } catch (e) {} resolve(ok !== false); };
      const fade = (from, to, sec, then) => { clearInterval(iv); if (!(sec > 0)) { a.volume = to; then && then(); return; } const t0 = performance.now(); iv = setInterval(() => { const k = Math.min(1, (performance.now() - t0) / (sec * 1000)); a.volume = from + (to - from) * k; if (k >= 1) { clearInterval(iv); then && then(); } }, 30); };
      const once = () => {
        try { a.currentTime = s.start || 0; } catch (e) {}
        a.volume = s.fin > 0 ? 0 : vol(); const p = a.play();
        const go = () => { if (s.fin > 0) fade(0, vol(), s.fin);
          const len = ((s.end > s.start ? s.end : (isFinite(a.duration) ? a.duration : 0)) - (s.start || 0)) / (s.rate || 1);
          if (len > 0) { useT = true; endT = setTimeout(() => { const next = () => { times--; if (times > 0) { a.pause(); setTimeout(() => !done && once(), (s.gap || 0) * 1000); } else finish(true); };
            if (s.fout > 0) fade(a.volume, 0, Math.min(s.fout, len), next); else next(); }, Math.max(50, len * 1000 - (s.fout > 0 ? Math.min(s.fout, len) * 1000 : 0))); }
        };
        if (p && p.then) p.then(go, e => { if (e && e.name === "NotAllowedError") this.sndNeedUnlock(() => once()); else finish(false); }); else go();
      };
      a.addEventListener("ended", () => { if (done || useT) return; times--; if (times > 0) setTimeout(() => !done && once(), (s.gap || 0) * 1000); else finish(true); });
      a.addEventListener("error", () => finish(false)); // ملف تالف ← تخطي (لا يتعطل الطابور)
      a.addEventListener("loadedmetadata", () => { clearTimeout(guard); const total = ((s.end > s.start ? s.end - s.start : a.duration || 10) / (s.rate || 1) + (s.gap || 0)) * (s.times || 1) + 8; guard = setTimeout(() => finish(true), total * 1000); }, { once: true });
      guard = setTimeout(() => { if (!a.duration) finish(false); }, 8000); // لم يُحمَّل خلال 8 ث ← تخطي
      once();
    });
  },
  sndStopAll(all) { if (this.sndCur) this.sndCur.stop(); if (all) { this.SQ && (this.SQ.q.length = 0); (this.sndManual || []).forEach(c => c.stop()); this.sndManual = []; } },
  /** المتصفح منع التشغيل التلقائي (لا يحدث في OBS عادة): زر تفعيل أولي واحد */
  sndNeedUnlock(retry) { if (typeof document === "undefined") return; (this.sndRetry || (this.sndRetry = [])).push(retry); if (document.querySelector(".sndp-unlock")) return;
    const b = document.createElement("button"); b.className = "sndp-unlock"; b.textContent = "🔊 اضغط لتفعيل الأصوات"; b.onclick = () => { b.remove(); const r = this.sndRetry || []; this.sndRetry = []; r.forEach(f => f()); }; document.body.appendChild(b); },
});
