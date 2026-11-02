// عرش اللايف — سيرفر الدفع والاشتراكات (ميسر)
// المتغيرات المطلوبة في Render: MOYASAR_SECRET_KEY, LICENSE_PRIVATE_KEY, PUBLIC_URL
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.urlencoded({ extended: false }));

const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');
const MOYASAR = 'https://api.moyasar.com/v1';
// عرض خاص: الشهر بـ 26 ريال لمدة 30 يوم (ينتهي 2 ديسمبر 2026 الساعة 00:00 بتوقيت الرياض)
const PROMO_END = Date.parse('2026-12-02T00:00:00+03:00');
const priceOf = m => (+m === 1 && Date.now() < PROMO_END) ? 26 : PLANS[+m].sar;
const PLANS = {
  1:  { name: 'شهر',      months: 1,  sar: 39 },
  3:  { name: '3 شهور',   months: 3,  sar: 99 },
  6:  { name: '6 شهور',   months: 6,  sar: 169 },
  12: { name: 'سنة',      months: 12, sar: 299 },
};

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cleanUser = s => String(s || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9._]/g, '');

// توقيع الكود بنفس الصيغة اللي تتحقق منها المنصة: ARSH1.<payload>.<signature>
function makeCode({ user, months, invoiceId, plan, until: untilOverride }) {
  const b64u = buf => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const until = untilOverride || Date.now() + months * 30 * 864e5;
  const payload = b64u(JSON.stringify({ u: user || '*', x: until, n: invoiceId, c: plan }));
  const key = process.env.LICENSE_PRIVATE_KEY.replace(/\\n/g, '\n');
  const sig = crypto.sign('sha256', Buffer.from(payload), { key, dsaEncoding: 'ieee-p1363' });
  return 'ARSH1.' + payload + '.' + b64u(sig);
}

const page = (title, body) => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#0b0f14;color:#eef;padding:24px 16px}main{max-width:520px;margin:auto}
.card{background:#141b24;border:1px solid #223;border-radius:12px;padding:16px;margin:10px 0}
input{width:100%;padding:10px;border-radius:8px;border:1px solid #334;background:#0b0f14;color:#eef;box-sizing:border-box}
button,.btn{background:#e2b865;color:#111;border:0;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block}
code{direction:ltr;display:block;word-break:break-all;background:#0b0f14;padding:10px;border-radius:8px}</style></head><body><main>${body}</main></body></html>`;

app.get('/', (req, res) => {
  const cards = Object.entries(PLANS).map(([m, p]) => `
    <form class="card" method="post" action="/buy">
      <h3>${p.name} — ${priceOf(m)} ريال</h3>
      <input type="hidden" name="months" value="${m}">
      <label>اسم حسابك في تيك توك (بدون @)</label>
      <input name="user" required placeholder="username">
      <p><button type="submit">ادفع ${priceOf(m)} ريال</button></p>
    </form>`).join('');
  res.send(page('عرش اللايف — الاشتراكات', `<h2>اشتراك عرش اللايف</h2><p>التفعيل فوري بعد الدفع.</p>${cards}`));
});

app.post('/buy', async (req, res) => {
  const plan = PLANS[+req.body.months];
  const user = cleanUser(req.body.user);
  if (!plan || !user) return res.status(400).send(page('خطأ', '<p>بيانات غير صحيحة. ارجع وحاول مرة ثانية.</p>'));
  try {
    const r = await fetch(MOYASAR + '/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(process.env.MOYASAR_SECRET_KEY + ':').toString('base64') },
      body: JSON.stringify({
        amount: priceOf(plan.months) * 100, currency: 'SAR',
        description: 'عرش اللايف — ' + plan.name + ' — @' + user,
        callback_url: PUBLIC_URL + '/return',
        success_url: PUBLIC_URL + '/return',
        metadata: { user, months: String(plan.months), plan: plan.name },
      }),
    });
    const inv = await r.json();
    if (!r.ok || !inv.url) return res.status(502).send(page('خطأ', '<p>ما قدرنا نجهز الدفع الحين. جرّب بعد شوي.</p>'));
    res.redirect(inv.url);
  } catch (_) {
    res.status(502).send(page('خطأ', '<p>ما قدرنا نجهز الدفع الحين. جرّب بعد شوي.</p>'));
  }
});

// الرجوع من ميسر: نتحقق من الفاتورة من السيرفر نفسه، ونصدر الكود إذا مدفوعة
app.get('/return', async (req, res) => {
  const id = String(req.query.id || '');
  if (!/^[\w-]{6,80}$/.test(id)) return res.status(400).send(page('خطأ', '<p>رابط غير صحيح.</p>'));
  try {
    const r = await fetch(MOYASAR + '/invoices/' + encodeURIComponent(id), {
      headers: { Authorization: 'Basic ' + Buffer.from(process.env.MOYASAR_SECRET_KEY + ':').toString('base64') },
    });
    const inv = await r.json();
    if (!r.ok || inv.status !== 'paid') {
      return res.send(page('الدفع', '<p>الدفع ما اكتمل بعد. إذا خصم المبلغ، انتظر دقيقة وحدّث الصفحة.</p>'));
    }
    const m = inv.metadata || {};
    const code = makeCode({ user: cleanUser(m.user), months: +m.months || 1, invoiceId: id, plan: m.plan || '' });
    res.send(page('تم الاشتراك', `<h2>تم تفعيل اشتراكك ✅</h2>
      <p>انسخ الكود وحطه في لوحة عرش اللايف (قسم الاشتراك):</p><code>${esc(code)}</code>
      <p>احفظ الكود، لأنك ترجع له بنفس الرابط.</p>`));
  } catch (_) {
    res.status(502).send(page('خطأ', '<p>ما قدرنا نتحقق من الدفع الحين. حدّث الصفحة بعد شوي.</p>'));
  }
});


// ===== صفحة الإدارة: إصدار كود يدوي للتحويلات البنكية =====
// تحتاج متغير ADMIN_PASSWORD في Render. ما تحفظ شي، فقط تصدر الكود.
const crypto2 = require('crypto');
function passOk(given) {
  const want = process.env.ADMIN_PASSWORD || '';
  if (!want) return false;
  const a = Buffer.from(String(given || '')), b = Buffer.from(want);
  return a.length === b.length && crypto2.timingSafeEqual(a, b);
}
app.get('/admin', (req, res) => {
  if (!process.env.ADMIN_PASSWORD) return res.status(503).send(page('الإدارة', '<p>صفحة الإدارة مو مفعّلة. أضف ADMIN_PASSWORD في Render.</p>'));
  const opts = Object.entries(PLANS).map(([m, p]) => `<option value="${m}">${p.name}</option>`).join('');
  res.send(page('إصدار كود', `<h2>إصدار كود اشتراك</h2>
    <form class="card" method="post" action="/admin/issue">
      <label>كلمة المرور</label><input type="password" name="pw" required>
      <label>اسم حساب تيك توك (بدون @)</label><input name="user" required>
      <label>المدة</label><select name="months" style="width:100%;padding:10px;border-radius:8px;background:#0b0f14;color:#eef;border:1px solid #334">${opts}</select>
      <p><button type="submit">أصدر الكود</button></p>
    </form>`));
});
app.post('/admin/issue', (req, res) => {
  if (!passOk(req.body.pw)) return res.status(403).send(page('إدارة', '<p>كلمة المرور غلط.</p>'));
  const plan = PLANS[+req.body.months];
  const user = cleanUser(req.body.user);
  if (!plan || !user) return res.status(400).send(page('إدارة', '<p>بيانات ناقصة.</p>'));
  const code = makeCode({ user, months: plan.months, invoiceId: 'manual-' + Date.now(), plan: plan.name });
  const msg = `تم تفعيل اشتراكك في عرش اللايف (${plan.name}). الكود:\n${code}\nالصقه في لوحة عرش اللايف، قسم الاشتراك.`;
  const wa = 'https://wa.me/?text=' + encodeURIComponent(msg);
  res.send(page('تم إصدار الكود', `<h2>تم إصدار الكود ✅</h2>
    <p>للحساب <b>@${esc(user)}</b> — ${esc(plan.name)}</p>
    <code>${esc(code)}</code>
    <p><a class="btn" href="${esc(wa)}" target="_blank" rel="noopener">أرسله على واتساب</a></p>
    <p><a href="/admin">إصدار كود ثاني</a></p>`));
});

// ===== التفعيل التلقائي للبطاقة وApple Pay =====
// المنصة تسأل: هل فيه دفع مكتمل لهذا اليوزر؟ إذا فيه، نرجع الكود.
// مدة الكود تُحسب من تاريخ الدفع (مو من الحين)، فكل طلب يرجع نفس المدة ولا يمدد الاشتراك.
app.get('/check', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const user = cleanUser(req.query.u);
  if (!user) return res.json({ ok: false });
  try {
    const r = await fetch(MOYASAR + '/invoices?page=1&per_page=100', {
      headers: { Authorization: 'Basic ' + Buffer.from(process.env.MOYASAR_SECRET_KEY + ':').toString('base64') },
    });
    const j = await r.json();
    const list = Array.isArray(j) ? j : (j.data || []);
    const paid = list
      .filter(i => i.status === 'paid' && cleanUser((i.metadata || {}).user) === user && +((i.metadata || {}).months) > 0)
      .sort((a, b) => Date.parse(b.paid_at || b.created_at || 0) - Date.parse(a.paid_at || a.created_at || 0));
    const hit = paid[0];
    if (!hit) return res.json({ ok: false });
    const m = hit.metadata;
    const base = Date.parse(hit.paid_at || hit.created_at || '') || Date.now();
    const until = base + (+m.months) * 30 * 864e5;
    if (until <= Date.now()) return res.json({ ok: false, expired: true });
    const code = makeCode({ user, months: +m.months, invoiceId: hit.id, plan: m.plan || '', until });
    res.json({ ok: true, code });
  } catch (_) {
    res.status(502).json({ ok: false });
  }
});
app.get('/health', (_, res) => res.send('ok'));
app.listen(process.env.PORT || 10000, () => console.log('arsh-pay up'));
