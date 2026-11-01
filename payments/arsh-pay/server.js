// عرش اللايف — سيرفر الدفع والاشتراكات (ميسر)
// المتغيرات المطلوبة في Render: MOYASAR_SECRET_KEY, LICENSE_PRIVATE_KEY, PUBLIC_URL
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.urlencoded({ extended: false }));

const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');
const MOYASAR = 'https://api.moyasar.com/v1';
const PLANS = {
  1:  { name: 'شهر',      months: 1,  sar: 39 },
  3:  { name: '3 شهور',   months: 3,  sar: 99 },
  6:  { name: '6 شهور',   months: 6,  sar: 169 },
  12: { name: 'سنة',      months: 12, sar: 299 },
};

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const cleanUser = s => String(s || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9._]/g, '');

// توقيع الكود بنفس الصيغة اللي تتحقق منها المنصة: ARSH1.<payload>.<signature>
function makeCode({ user, months, invoiceId, plan }) {
  const b64u = buf => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const until = Date.now() + months * 30 * 864e5;
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
      <h3>${p.name} — ${p.sar} ريال</h3>
      <input type="hidden" name="months" value="${m}">
      <label>اسم حسابك في تيك توك (بدون @)</label>
      <input name="user" required placeholder="username">
      <p><button type="submit">ادفع ${p.sar} ريال</button></p>
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
        amount: plan.sar * 100, currency: 'SAR',
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

app.get('/health', (_, res) => res.send('ok'));
app.listen(process.env.PORT || 10000, () => console.log('arsh-pay up'));
