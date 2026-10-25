// عرش اللايف — سيرفر الربط مع تيك توك لايف
// التشغيل: npm install  ثم  node server.js اسم_المستخدم
// لوحة التحكم:       http://localhost:3000
// المشهد كامل لـ OBS:  http://localhost:3000/#scene   (مصدر متصفح 1080×1920)
// كل أداة لحالها: انسخ رابطها من قسم "المشهد والروابط" في اللوحة

const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const { WebSocketServer } = require('ws');
const { WebcastPushConnection } = require('tiktok-live-connector');
const yts = require('yt-search');
const os = require('os');

const PORT = process.env.PORT || 3000;
// في نسخة التطبيق تنحفظ البيانات في مجلد المستخدم (AppData) بدل مجلد البرنامج
const HOME = process.env.ARSH_HOME || __dirname; fs.mkdirSync(HOME, { recursive: true });
const IS_APP = !!process.env.ARSH_APP;
const APP_VER = '2.4.1';
const DATA = path.join(HOME, 'data.json');
const MEDIA = path.join(HOME, 'media');
fs.mkdirSync(MEDIA, { recursive: true });

// الإعدادات والحالة تنحفظ في data.json وترجع بعد إعادة التشغيل
let store = { settings: null, states: {} };
try { store = Object.assign(store, JSON.parse(fs.readFileSync(DATA, 'utf8'))); } catch (_) {}
let saveTimer;
function persist() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => fs.writeFile(DATA, JSON.stringify(store), () => {}), 500);
}

// تنظيف ملفات أصوات الميمز المكررة اللي ما لها مكان في القائمة
setTimeout(() => {
  try {
    const used = new Set([].concat(store.states.sfxOwn || [], (store.settings && store.settings.sfx && store.settings.sfx.own) || []).map(o => String(o.url || '').replace('/media/', '')));
    if (!used.size) return;
    for (const f of fs.readdirSync(MEDIA)) if (/^sfx-/.test(f) && !used.has(f)) fs.unlinkSync(path.join(MEDIA, f));
  } catch (_) {}
}, 4000);

// أحداث اللايف الحالي (تنعاد لأي أوفرلاي يفتح متأخر) — تنحفظ في events.json عشان العدادات والأهداف ما تضيع لو انطفى السيرفر
const EVF = path.join(HOME, 'events.json');
let events = [];
try { events = JSON.parse(fs.readFileSync(EVF, 'utf8')) || []; } catch (_) {}
let evDirty = false;
setInterval(() => { if (evDirty) { evDirty = false; fs.writeFile(EVF, JSON.stringify(events), () => {}); } }, 5000);

// سجل الداعمين الدائم (اليوم/الأسبوع/الشهر) + أكبر هدية بالأسبوع
store.states.ledger = store.states.ledger || { days: {}, big: {} };
const pad2 = n => String(n).padStart(2, '0');
const dayKey = ts => { const d = new Date(ts); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); };
const weekKey = ts => { const d = new Date(ts); d.setDate(d.getDate() - d.getDay()); return dayKey(d.getTime()); };
let ledgerTimer = null;
function ledgerAdd(ev) {
  if (ev.type !== 'gift' && ev.type !== 'like') return;
  const L = store.states.ledger, dk = dayKey(ev.ts), day = L.days[dk] || (L.days[dk] = {}), r = day[ev.user] || (day[ev.user] = [0, 0]);
  if (ev.type === 'gift') {
    const d = (+ev.diamonds || 1) * (+ev.count || 1); r[0] += d;
    const wk = weekKey(ev.ts); if (!L.big[wk] || d > L.big[wk].d) L.big[wk] = { user: ev.user, gift: ev.gift, img: ev.img || '', d, ts: ev.ts };
  } else r[1] += +ev.count || 1;
  // نحتفظ بآخر 62 يوم فقط
  const keys = Object.keys(L.days).sort(); while (keys.length > 62) delete L.days[keys.shift()];
  if (!ledgerTimer) ledgerTimer = setTimeout(() => { ledgerTimer = null; persist(); broadcast({ type: 'state', key: 'ledger', val: L }); }, 3000);
}

// إشعار تيليجرام عند بداية اللايف
async function telegram(username) {
  const t = store.settings && store.settings.telegram;
  if (!t || !t.token || !t.chat) return false;
  try {
    const r = await fetch('https://api.telegram.org/bot' + t.token + '/sendMessage', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: t.chat, text: String(t.msg || '').replace(/\{user\}/g, username || '') })
    });
    return r.ok;
  } catch (_) { return false; }
}
let currentUser = '';

// ===== بوت الشات: يكتب داخل شات تيك توك (ترحيب بالمنضمين، شكر الهدايا، ردود البوت) =====
// يحتاج: مفتاح Euler Stream + sessionid و tt-target-idc لحساب البوت. تنحفظ في data.json على جهازك فقط ولا تنرسل لأي صفحة.
let secret = store.secret || {};
let sender = null, senderReady = false, chatQ = [], lastSent = 0, pumping = false;
const welcomed = {}, thanked = {};
const CB = () => Object.assign({ enabled: true, welcome: true, welcomeMsgs: 'منور البث يا عسل @{user}', cooldown: 60, gifts: true, giftMin: 100,
  giftMsgs: 'شكراً @{user} على {gift}', follows: false, followMsgs: 'شكراً على المتابعة @{user}', botReplies: true, gap: 4, maxQueue: 3 },
  (store.settings && store.settings.chatbot) || {});
const pickLine = s => { const l = String(s || '').split(/\n+/).map(x => x.trim()).filter(Boolean); return l[Math.floor(Math.random() * l.length)] || ''; };
const greet = () => { const h = new Date().getHours(); return h >= 4 && h < 12 ? 'صباح الخير' : 'مساء الخير'; };
let lastWelcome = '';
function pickWelcome(c) {
  const p = Array.isArray(c.pool) && c.pool.length ? c.pool : String(c.welcomeMsgs || 'منور البث يا عسل @{user}').split(/\n+/).filter(x => x.trim());
  let m = p[Math.floor(Math.random() * p.length)]; if (p.length > 1 && m === lastWelcome) m = p[(p.indexOf(m) + 1) % p.length]; lastWelcome = m; return m;
}
const fill = (t, ev) => String(t).replace(/\{greet\}/g, greet()).replace(/\{user\}/g, ev.uid || ev.user || '').replace(/\{name\}/g, ev.user || '').replace(/\{gift\}/g, ev.gift || '');
function sayChat(text, kind) {
  const c = CB(); text = String(text || '').trim().slice(0, 150);
  if (!c.enabled || !text) return;
  if (kind !== 'bot' && chatQ.length >= (+c.maxQueue || 3)) return; // لايف زحمة: نتجاهل الترحيب بدل ما نتأخر
  chatQ.push(text); pumpChat();
}
async function pumpChat() {
  if (pumping) return; pumping = true;
  while (chatQ.length) {
    const wait = Math.max(0, lastSent + Math.max(2, +CB().gap || 4) * 1000 - Date.now());
    if (wait) await new Promise(r => setTimeout(r, wait));
    const t = chatQ.shift();
    try {
      if (!sender || !senderReady) throw new Error('بوت الشات غير متصل');
      await sender.sendMessage(t);
      broadcast({ type: 'chatSent', text: t, ok: true });
    } catch (e) { broadcast({ type: 'chatSent', text: t, ok: false, err: String((e && e.message) || e) }); }
    lastSent = Date.now();
  }
  pumping = false;
}
async function startSender(username) {
  senderReady = false;
  if (sender) { try { sender.disconnect(); } catch (_) {} sender = null; }
  if (!CB().enabled || !secret.apiKey || !secret.sessionId || !secret.idc || !username) return;
  try {
    const { TikTokLiveConnection } = await import('tiktok-live-connector-v2');
    sender = new TikTokLiveConnection(username, {
      signApiKey: secret.apiKey, authenticateWs: true,
      session: { cookie: { type: 'cookie', value: { sessionId: secret.sessionId, ttTargetIdc: secret.idc } } }
    });
    await sender.connect();
    senderReady = true;
    broadcast({ type: 'chatSent', text: 'بوت الشات جاهز ويكتب في لايفك', ok: true, sys: true });
  } catch (e) {
    broadcast({ type: 'chatSent', text: 'تعذر تشغيل بوت الشات: ' + ((e && e.message) || e), ok: false, sys: true });
  }
}

// نقاط الولاء (تنحفظ بين البثوث)
store.states.points = store.states.points || {};
let ptsTimer = null;
function pointsPush() { if (!ptsTimer) ptsTimer = setTimeout(() => { ptsTimer = null; persist(); broadcast({ type: 'state', key: 'points', val: store.states.points }); }, 2000); }
function earn(ev) {
  const P = Object.assign({ enabled: true, perLikes: 10, perComment: 1, perFollow: 50, perShare: 20, perCoin: 2 }, (store.settings && store.settings.points) || {});
  if (!P.enabled || !ev.user) return;
  let v = 0;
  if (ev.type === 'like') v = (+ev.count || 1) / (+P.perLikes || 10);
  else if (ev.type === 'chat') v = +P.perComment || 0;
  else if (ev.type === 'follow') v = +P.perFollow || 0;
  else if (ev.type === 'share') v = +P.perShare || 0;
  else if (ev.type === 'gift') v = (+ev.diamonds || 1) * (+ev.count || 1) * (+P.perCoin || 0);
  if (v > 0) { store.states.points[ev.user] = (store.states.points[ev.user] || 0) + v; pointsPush(); }
}

// رابط التحكم من الجوال على نفس الشبكة
function lanUrl() {
  for (const list of Object.values(os.networkInterfaces())) for (const n of list || [])
    if (n.family === 'IPv4' && !n.internal) return 'http://' + n.address + ':' + PORT;
  return '';
}
let status = { text: 'السيرفر شغال · غير متصل باللايف', live: false };

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// نقرأ الصفحة مع كل طلب، عشان أي تحديث للملف يطلع بمجرد تحديث المتصفح بدون إعادة تشغيل
const page = () => fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// ===== رابط https عام (Cloudflare) عشان TikTok LIVE Studio يقبله =====
// الرابط العام يفتح الأوفرلاي بس (قراءة فقط) — لوحة التحكم والرفع والإعدادات محمية وتشتغل من جهازك فقط
const isRemote = req => !!(req.headers['cf-ray'] || req.headers['cf-connecting-ip']) || /trycloudflare\.com$/i.test(String(req.headers.host || '').split(':')[0]);
let tunnelUrl = '';
function readTunnel() {
  try {
    const t = fs.readFileSync(path.join(HOME, 'tunnel.log'), 'utf8');
    const all = t.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/gi); const u = all ? all[all.length - 1] : '';
    if (u && u !== tunnelUrl) { tunnelUrl = u; console.log('رابط تيك توك LIVE Studio: ' + u + '/scene'); broadcast({ type: 'tunnel', url: u }); }
  } catch (_) {}
}
setInterval(readTunnel, 3000);
app.use((req, res, next) => {
  if (!isRemote(req)) return next();
  if (/^\/(scene|item\/[\w-]+|w\/\w+|hook\/(kofi|donate))\/?$/.test(req.path) || req.path.startsWith('/media/')) return next();
  res.status(403).type('html').send('<meta charset="utf-8"><p style="font-family:sans-serif;direction:rtl">هذا الرابط مخصص للأوفرلاي فقط.</p>');
});

app.get(['/', '/scene', '/item/:id', '/w/:type'], (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.type('html').send(
    '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
    '<script>window.LIVE_WS=(location.protocol==="https:"?"wss://":"ws://")+location.host</script>' +
    '</head><body style="margin:0">' + page() + '</body></html>'
  );
});
app.use('/media', express.static(MEDIA));

// رفع صور/فيديو/أصوات الإجراءات
app.post('/upload', express.raw({ type: '*/*', limit: '80mb' }), (req, res) => {
  const name = Date.now() + '-' + String(req.query.name || 'file').replace(/[^\w.\-؀-ۿ]/g, '_').slice(-80);
  fs.writeFile(path.join(MEDIA, name), req.body, err => {
    if (err) return res.status(500).json({ error: 'تعذر حفظ الملف' });
    res.json({ url: '/media/' + encodeURIComponent(name) });
  });
});

// ===== أصوات الميمز الأصلية: بحث في myinstants وتنزيل الصوت لمجلد media =====
const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36', 'Accept-Language': 'ar,en;q=0.8' };
const MI = 'https://www.myinstants.com';
function parseInstants(html) {
  const out = [], seen = new Set();
  for (const tag of html.match(/<button[^>]*play\([^>]*>/gi) || []) {
    const m = tag.match(/play\(\s*['"]([^'"]+\.(?:mp3|ogg|wav|m4a))['"]/i); if (!m) continue;
    const url = m[1].startsWith('http') ? m[1] : MI + m[1]; if (seen.has(url)) continue; seen.add(url);
    const t = tag.match(/title="(?:Play\s+)?([^"]*?)(?:\s+sound)?"/i);
    const name = (t && t[1].trim()) || decodeURIComponent(url.split('/').pop().replace(/\.[^.]+$/, '')).replace(/[-_]+/g, ' ');
    out.push({ name: name.replace(/&#(x27|39);/gi, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').slice(0, 60), url });
  }
  if (!out.length) for (const m of html.matchAll(/['"](\/media\/sounds\/[^'"]+\.(?:mp3|ogg|wav|m4a))['"]/gi)) {
    const url = MI + m[1]; if (seen.has(url)) continue; seen.add(url);
    out.push({ name: decodeURIComponent(m[1].split('/').pop().replace(/\.[^.]+$/, '')).replace(/[-_]+/g, ' ').slice(0, 60), url });
  }
  return out;
}
app.get('/api/sfx/search', async (req, res) => {
  const q = String(req.query.q || '').trim(); if (!q) return res.json({ items: [] });
  try {
    const r = await fetch(MI + '/en/search/?name=' + encodeURIComponent(q), { headers: UA });
    res.json({ items: parseInstants(await r.text()).slice(0, 30) });
  } catch (e) { res.json({ items: [], error: 'تعذر الوصول لموقع myinstants' }); }
});
// ===== الدونيشن: Ko-fi و رابط عام و Streamlabs و StreamElements =====
const DN = () => (store.settings && store.settings.donate) || {};
function donation(o) { const amount = Math.round((+o.amount || 0) * 100) / 100; if (!amount) return;
  pushEvent({ type: 'donation', user: String(o.name || 'متبرع').slice(0, 40), amount, currency: String(o.currency || 'USD').toUpperCase().slice(0, 4), msg: String(o.message || '').slice(0, 200), source: o.source || '' }); }
app.post('/hook/kofi', express.urlencoded({ extended: false }), (req, res) => {
  try { const d = JSON.parse((req.body && req.body.data) || '{}'), tok = DN().kofiToken;
    if (!tok || d.verification_token !== tok) return res.status(401).end();
    donation({ name: d.is_public === false ? 'متبرع مجهول' : d.from_name, amount: d.amount, currency: d.currency, message: d.is_public === false ? '' : d.message, source: 'kofi' });
    res.status(200).end();
  } catch (e) { logErr('kofi', e); res.status(400).end(); }
});
app.post('/hook/donate', express.json(), (req, res) => {
  const k = DN().hookKey; if (!k || req.query.k !== k) return res.status(401).end();
  const b = req.body || {}; donation({ name: b.name || b.from_name || b.username, amount: b.amount, currency: b.currency, message: b.message, source: 'hook' }); res.json({ ok: true });
});
let slSock = null, seSock = null, dnKeys = '';
function startDonations() {
  const d = DN(), key = (d.slToken || '') + '|' + (d.seToken || ''); if (key === dnKeys) return; dnKeys = key;
  try { slSock && slSock.close(); } catch (_) {} try { seSock && seSock.close(); } catch (_) {} slSock = seSock = null;
  let io; try { io = require('socket.io-client'); } catch (e) { if (d.slToken || d.seToken) logErr('socket.io-client', e); return; }
  if (d.slToken) { slSock = io('https://sockets.streamlabs.com?token=' + encodeURIComponent(d.slToken), { transports: ['websocket'] });
    slSock.on('event', e => { try { if (!e) return; if (e.type === 'donation') for (const m of [].concat(e.message || [])) donation({ name: m.name || m.from, amount: m.amount, currency: m.currency, message: m.message, source: 'streamlabs' });
      else { const src = /youtube/.test(e.for || '') ? 'youtube' : /twitch/.test(e.for || '') ? 'twitch' : ''; if (!src) return;
        for (const m of [].concat(e.message || [])) { const user = m.name || m.display_name || m.from || '';
          if (e.type === 'follow') mpush({ type: 'malert', src, kind: src === 'youtube' ? 'ytsub' : 'follow', user });
          else if (e.type === 'subscription' || e.type === 'resub') mpush({ type: 'malert', src, kind: src === 'youtube' ? 'member' : 'sub', user, months: +m.months || 1, msg: m.message || '' });
          else if (e.type === 'superchat') mpush({ type: 'malert', src: 'youtube', kind: 'super', user, amountText: m.displayString || ((m.amount ? (+m.amount / (m.amount > 1000 ? 1e6 : 1)) : '') + ' ' + (m.currency || '')), msg: m.comment || m.message || '' });
          else if (e.type === 'bits') mpush({ type: 'malert', src: 'twitch', kind: 'bits', user, amount: +m.amount || 0, msg: m.message || '' });
          else if (e.type === 'raid' || e.type === 'host') mpush({ type: 'malert', src, kind: 'raid', user, viewers: +m.raiders || +m.viewers || 0 }); } } } catch (x) { logErr('streamlabs', x); } });
    slSock.on('connect_error', e => logErr('streamlabs-connect', e)); }
  if (d.seToken) { seSock = io('https://realtime.streamelements.com', { transports: ['websocket'] });
    seSock.on('connect', () => seSock.emit('authenticate', { method: 'jwt', token: d.seToken }));
    seSock.on('event', e => { try { if (!e) return; const x = e.data || {}; if (e.type === 'tip') { donation({ name: x.displayName || x.username, amount: x.amount, currency: x.currency, message: x.message, source: 'streamelements' }); return; }
      const src = e.provider === 'youtube' ? 'youtube' : e.provider === 'twitch' ? 'twitch' : e.provider === 'kick' ? 'kick' : ''; if (!src) return; const user = x.displayName || x.username || '';
      if (e.type === 'follower') mpush({ type: 'malert', src, kind: src === 'youtube' ? 'ytsub' : 'follow', user });
      else if (e.type === 'subscriber' || e.type === 'sponsor') mpush({ type: 'malert', src, kind: src === 'youtube' ? 'member' : (x.gifted ? 'gift' : 'sub'), user: x.gifted && x.sender ? x.sender : user, months: +x.amount || 1, count: 1, msg: x.message || '' });
      else if (e.type === 'superchat') mpush({ type: 'malert', src: 'youtube', kind: 'super', user, amountText: (x.amount || '') + ' ' + (x.currency || ''), msg: x.message || '' });
      else if (e.type === 'cheer') mpush({ type: 'malert', src: 'twitch', kind: 'bits', user, amount: +x.amount || 0, msg: x.message || '' });
      else if (e.type === 'raid' || e.type === 'host') mpush({ type: 'malert', src, kind: 'raid', user, viewers: +x.amount || 0 }); } catch (y) { logErr('streamelements', y); } });
    seSock.on('unauthorized', e => logErr('streamelements-auth', new Error(JSON.stringify(e)))); }
}
setTimeout(startDonations, 1500);

// ===== البث المتعدد: يوتيوب وكيك وتويتش (شات موحّد + تنبيهات) =====
const WSC = require('ws');
const MP = () => (store.settings && store.settings.multi) || {};
const mHandle = k => { const L = ((store.settings && store.settings.socials) || {}).list || []; const a = L.find(x => x && x.k === k); return String((a && a.h) || '').trim(); };
const mstat = {};
function setM(p, ok, text) { mstat[p] = { ok: !!ok, text: text || '', ts: Date.now() }; broadcast({ type: 'mstatus', s: mstat }); }
const mRecent = new Map();
function mpush(ev) {
  if (licStatus().state === 'expired') return;
  if (ev.type === 'malert') { const k = [ev.src, ev.kind, String(ev.user || '').toLowerCase()].join('|'), t = mRecent.get(k); if (t && Date.now() - t < 30000) return; mRecent.set(k, Date.now()); if (mRecent.size > 400) mRecent.clear(); }
  if (ev.text) ev.text = String(ev.text).slice(0, 300);
  if (ev.user) ev.user = String(ev.user).slice(0, 40);
  pushEvent(ev);
}
// --- Twitch: شات تويتش بدون تسجيل دخول (IRC) ---
let twSock = null, twKey = '', twMass = {};
function ircParse(line) {
  const tags = {}; let rest = line;
  if (rest[0] === '@') { const i = rest.indexOf(' '); rest.slice(1, i).split(';').forEach(kv => { const j = kv.indexOf('='); tags[kv.slice(0, j)] = kv.slice(j + 1).replace(/\\s/g, ' ').replace(/\\:/g, ';').replace(/\\\\/g, '\\'); }); rest = rest.slice(i + 1); }
  let prefix = ''; if (rest[0] === ':') { const i = rest.indexOf(' '); prefix = rest.slice(1, i); rest = rest.slice(i + 1); }
  const ti = rest.indexOf(' :'), text = ti >= 0 ? rest.slice(ti + 2) : '', parts = (ti >= 0 ? rest.slice(0, ti) : rest).split(' ');
  return { tags, prefix, cmd: parts[0], params: parts.slice(1), text };
}
function twLine(line) {
  const m = ircParse(line), t = m.tags, user = t['display-name'] || m.prefix.split('!')[0] || '';
  if (m.cmd === 'PRIVMSG') {
    let text = m.text; if (/^\u0001ACTION /.test(text)) text = text.slice(8).replace(/\u0001$/, '');
    const emotes = []; if (t.emotes) t.emotes.split('/').forEach(e => { const [id, pos] = e.split(':'); (pos || '').split(',').forEach(r => { const [a, b] = r.split('-').map(Number); if (isFinite(a) && isFinite(b)) emotes.push([a, b, id]); }); });
    const badges = t.badges || '';
    mpush({ type: 'mchat', src: 'twitch', user, text, emotes: emotes.length ? emotes : undefined, color: t.color || '', mod: /moderator|broadcaster/.test(badges), sub: /subscriber|founder/.test(badges) });
    if (+t.bits > 0) mpush({ type: 'malert', src: 'twitch', kind: 'bits', user, amount: +t.bits, msg: text.replace(/\b[a-z]+\d+\b/gi, '').trim() });
  } else if (m.cmd === 'USERNOTICE') {
    const id = t['msg-id'], key = user.toLowerCase();
    if (id === 'sub' || id === 'resub') mpush({ type: 'malert', src: 'twitch', kind: 'sub', user, months: +t['msg-param-cumulative-months'] || 1, msg: m.text || '' });
    else if (id === 'submysterygift') { const n = +t['msg-param-mass-gift-count'] || 1; twMass[key] = (twMass[key] || 0) + n; mpush({ type: 'malert', src: 'twitch', kind: 'gift', user, count: n }); }
    else if (id === 'subgift') { if (twMass[key] > 0) { twMass[key]--; return; } mpush({ type: 'malert', src: 'twitch', kind: 'gift', user, count: 1, to: t['msg-param-recipient-display-name'] || '' }); }
    else if (id === 'raid') mpush({ type: 'malert', src: 'twitch', kind: 'raid', user: t['msg-param-displayName'] || user, viewers: +t['msg-param-viewerCount'] || 0 });
  }
}
function startTwitch() {
  const c = MP().twitch || {}, ch = mHandle('twitch').replace(/^@/, '').replace(/^.*twitch\.tv\//i, '').replace(/[^\w]/g, '').toLowerCase();
  const key = c.on && ch ? ch : ''; if (key === twKey) return; twKey = key;
  try { twSock && twSock.close(); } catch (_) {} twSock = null;
  if (!key) { setM('twitch', false, ''); return; }
  setM('twitch', false, 'جاري الاتصال بشات تويتش…');
  const open = () => {
    if (twKey !== key) return; const s = new WSC('wss://irc-ws.chat.twitch.tv:443'); twSock = s;
    s.on('open', () => { s.send('CAP REQ :twitch.tv/tags twitch.tv/commands'); s.send('PASS SCHMOOPIIE'); s.send('NICK justinfan' + (10000 + Math.floor(Math.random() * 80000))); s.send('JOIN #' + key); });
    s.on('message', buf => String(buf).split('\r\n').forEach(line => {
      if (!line) return; if (line.startsWith('PING')) { try { s.send('PONG :tmi.twitch.tv'); } catch (_) {} return; }
      if (/ JOIN #/.test(line) || / 366 /.test(line)) setM('twitch', true, 'متصل بشات تويتش #' + key);
      try { twLine(line); } catch (e) { logErr('twitch', e); }
    }));
    s.on('close', () => { if (twSock === s && twKey === key) { setM('twitch', false, 'انقطع شات تويتش — نعيد الاتصال…'); setTimeout(open, 5000); } });
    s.on('error', e => logErr('twitch-ws', e));
  };
  open();
}
// --- Kick: شات كيك (Pusher) ---
let kkSock = null, kkKey = '';
const kickIdCache = {};
async function kickIds(slug) {
  if (kickIdCache[slug]) return kickIdCache[slug];
  const r = await fetch('https://kick.com/api/v2/channels/' + encodeURIComponent(slug), { headers: { 'User-Agent': UA['User-Agent'], Accept: 'application/json', 'Accept-Language': 'en-US,en;q=0.9' } });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = await r.json(); const ids = { chat: j.chatroom && j.chatroom.id, chan: j.id };
  if (!ids.chat) throw new Error('no chatroom'); kickIdCache[slug] = ids; return ids;
}
function kickEv(name, d) {
  const E = String(name || '').replace(/^App\\Events\\/, '');
  if (E === 'ChatMessageEvent') { const sn = d.sender || {}, id = sn.identity || {}, bad = (id.badges || []).map(b => b.type).join(',');
    mpush({ type: 'mchat', src: 'kick', user: sn.username || '', text: d.content || '', color: id.color || '', mod: /moderator|broadcaster/.test(bad), sub: /subscriber|founder|og/.test(bad) }); }
  else if (E === 'SubscriptionEvent') mpush({ type: 'malert', src: 'kick', kind: 'sub', user: d.username || '', months: +d.months || 1 });
  else if (E === 'GiftedSubscriptionsEvent') mpush({ type: 'malert', src: 'kick', kind: 'gift', user: d.gifter_username || '', count: (d.gifted_usernames || []).length || 1 });
  else if (E === 'FollowersUpdated') { if (d.followed !== false && d.username) mpush({ type: 'malert', src: 'kick', kind: 'follow', user: d.username }); }
  else if (E === 'StreamHostEvent') mpush({ type: 'malert', src: 'kick', kind: 'raid', user: d.host_username || '', viewers: +d.number_viewers || 0 });
}
function startKick() {
  const c = MP().kick || {}, slug = mHandle('kick').replace(/^@/, '').replace(/^.*kick\.com\//i, '').replace(/[^\w-]/g, '').toLowerCase();
  const key = c.on && slug ? slug + '|' + (c.chatroomId || '') + '|' + (c.channelId || '') : ''; if (key === kkKey) return; kkKey = key;
  try { kkSock && kkSock.close(); } catch (_) {} kkSock = null;
  if (!key) { setM('kick', false, ''); return; }
  setM('kick', false, 'جاري الاتصال بشات كيك…');
  (async () => {
    let ids = { chat: +c.chatroomId || 0, chan: +c.channelId || 0 };
    if (!ids.chat) { try { ids = await kickIds(slug); } catch (e) { logErr('kick-ids', e); if (kkKey === key) setM('kick', false, 'كيك منع جلب رقم الشات تلقائياً — حطه يدوي من "ما اشتغل كيك؟"'); return; } }
    const open = () => {
      if (kkKey !== key) return; const s = new WSC('wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false'); kkSock = s;
      s.on('message', buf => { let m; try { m = JSON.parse(String(buf)); } catch (_) { return; }
        if (m.event === 'pusher:connection_established') { s.send(JSON.stringify({ event: 'pusher:subscribe', data: { auth: '', channel: 'chatrooms.' + ids.chat + '.v2' } })); if (ids.chan) s.send(JSON.stringify({ event: 'pusher:subscribe', data: { auth: '', channel: 'channel.' + ids.chan } })); setM('kick', true, 'متصل بشات كيك @' + slug); return; }
        if (m.event === 'pusher:ping') { try { s.send(JSON.stringify({ event: 'pusher:pong', data: {} })); } catch (_) {} return; }
        let d = {}; try { d = typeof m.data === 'string' ? JSON.parse(m.data) : (m.data || {}); } catch (_) {}
        try { kickEv(m.event, d); } catch (e) { logErr('kick', e); } });
      s.on('close', () => { if (kkSock === s && kkKey === key) { setM('kick', false, 'انقطع شات كيك — نعيد الاتصال…'); setTimeout(open, 5000); } });
      s.on('error', e => logErr('kick-ws', e));
    };
    open();
  })();
}
// --- YouTube: شات البث المباشر بدون مفتاح API ---
let ytTimer = null, ytKey = '';
function ytUrl(v) { v = String(v || '').trim(); if (!v) return '';
  if (/youtube\.com\/(watch\?v=|live\/)|youtu\.be\//.test(v)) return (v.startsWith('http') ? v : 'https://' + v);
  const m = v.match(/youtube\.com\/(@[\w.\-]+|channel\/[\w-]+|c\/[\w.\-]+)/); if (m) return 'https://www.youtube.com/' + m[1] + '/live';
  if (/^UC[\w-]{20,}$/.test(v)) return 'https://www.youtube.com/channel/' + v + '/live';
  return 'https://www.youtube.com/@' + v.replace(/^@/, '') + '/live'; }
const ytRuns = runs => (runs || []).map(r => r.text != null ? r.text : (r.emoji ? (r.emoji.isCustomEmoji ? '[yt:' + (((r.emoji.image && r.emoji.image.thumbnails) || []).slice(-1)[0] || {}).url + ']' : (r.emoji.emojiId || '')) : '')).join('');
function ytAction(a) {
  const it = a.addChatItemAction && a.addChatItemAction.item; if (!it) return;
  const k = Object.keys(it)[0], x = it[k] || {}, user = (x.authorName && x.authorName.simpleText) || '';
  const ph = ((x.authorPhoto && x.authorPhoto.thumbnails) || []).slice(-1)[0], badges = (x.authorBadges || []).map(b => ((b.liveChatAuthorBadgeRenderer || {}).tooltip || '')).join(',');
  const base = { src: 'youtube', user, pic: (ph && ph.url) || '' };
  if (k === 'liveChatTextMessageRenderer') mpush(Object.assign({ type: 'mchat', text: ytRuns(x.message && x.message.runs), mod: /moderator|owner/i.test(badges), sub: /member/i.test(badges) }, base));
  else if (k === 'liveChatPaidMessageRenderer' || k === 'liveChatPaidStickerRenderer') { const amt = (x.purchaseAmountText && x.purchaseAmountText.simpleText) || ''; const msg = ytRuns(x.message && x.message.runs);
    mpush(Object.assign({ type: 'malert', kind: 'super', amountText: amt, msg }, base)); mpush(Object.assign({ type: 'mchat', text: msg, superchat: amt }, base)); }
  else if (k === 'liveChatMembershipItemRenderer') { const sub = ytRuns(x.headerSubtext && x.headerSubtext.runs) || ((x.headerSubtext && x.headerSubtext.simpleText) || ''); const mo = (sub.match(/(\d+)\s*(month|شهر|أشهر)/i) || [])[1];
    mpush(Object.assign({ type: 'malert', kind: 'member', months: +mo || 1, msg: ytRuns(x.message && x.message.runs) }, base)); }
  else if (k === 'liveChatSponsorshipsGiftPurchaseAnnouncementRenderer') { const h = (x.header && x.header.liveChatSponsorshipsHeaderRenderer) || {}; const t = ytRuns(h.primaryText && h.primaryText.runs); const n = (t.match(/(\d+)/) || [])[1];
    mpush({ type: 'malert', src: 'youtube', kind: 'gift', user: (h.authorName && h.authorName.simpleText) || user, count: +n || 1 }); }
}
function startYouTube() {
  const c = MP().youtube || {}, url = c.on ? ytUrl(mHandle('youtube')) : ''; if (url === ytKey) return; ytKey = url; clearTimeout(ytTimer);
  if (!url) { setM('youtube', false, ''); return; }
  const H = { 'User-Agent': UA['User-Agent'], 'Accept-Language': 'en-US,en;q=0.9' }; let st = null;
  setM('youtube', false, 'جاري البحث عن بثك في يوتيوب…');
  const find = async () => { if (ytKey !== url) return;
    try { const r = await fetch(url, { headers: H }); const h = await r.text();
      const vid = (h.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/) || [])[1], lc = h.indexOf('"liveChatRenderer"');
      if (!vid || lc < 0) { setM('youtube', false, 'ننتظر تبدأ البث في يوتيوب… (نتأكد كل دقيقة)'); ytTimer = setTimeout(find, 60000); return; }
      const key = (h.match(/"INNERTUBE_API_KEY":"([^"]+)"/) || [])[1], ver = (h.match(/"clientVersion":"([\d.]+)"/) || [])[1] || '2.20250101.00.00', cont = (h.slice(lc).match(/"continuation":"([^"]+)"/) || [])[1];
      if (!key || !cont) { setM('youtube', false, 'ما لقينا شات البث — تأكد إن الشات مفعّل في البث'); ytTimer = setTimeout(find, 60000); return; }
      st = { key, ver, cont, first: true }; setM('youtube', true, 'متصل بشات يوتيوب'); poll();
    } catch (e) { logErr('yt-find', e); setM('youtube', false, 'تعذر الوصول ليوتيوب — نعيد المحاولة'); ytTimer = setTimeout(find, 60000); } };
  const poll = async () => { if (ytKey !== url || !st) return; let wait = 3000;
    try { const r = await fetch('https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=' + st.key + '&prettyPrint=false', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, H), body: JSON.stringify({ context: { client: { clientName: 'WEB', clientVersion: st.ver, hl: 'en' } }, continuation: st.cont }) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json(), lcc = j.continuationContents && j.continuationContents.liveChatContinuation;
      if (!lcc) { setM('youtube', false, 'انتهى البث في يوتيوب — ننتظر البث الجاي'); st = null; ytTimer = setTimeout(find, 60000); return; }
      const cs = (lcc.continuations || [])[0] || {}, cd = cs.invalidationContinuationData || cs.timedContinuationData || cs.reloadContinuationData || {};
      if (cd.continuation) st.cont = cd.continuation; wait = Math.min(8000, Math.max(1500, +cd.timeoutMs || 3000));
      if (!st.first) for (const a of (lcc.actions || [])) { try { ytAction(a); } catch (e) { logErr('yt-action', e); } }
      st.first = false;
    } catch (e) { logErr('yt-poll', e); wait = 10000; }
    ytTimer = setTimeout(poll, wait); };
  find();
}
function startMulti() { try { startTwitch(); } catch (e) { logErr('twitch-start', e); } try { startKick(); } catch (e) { logErr('kick-start', e); } try { startYouTube(); } catch (e) { logErr('yt-start', e); } }
setTimeout(startMulti, 2500);

// ===== التحديث التلقائي: يحمّل آخر نسخة من arshlive.com ويطبقها بعد إعادة التشغيل =====
const UPD_URL = 'https://arshlive.com/update/latest.json';
const vcmp = (a, b) => { const x = String(a || '0').split('.').map(Number), y = String(b || '0').split('.').map(Number); for (let i = 0; i < 3; i++) { const d = (x[i] || 0) - (y[i] || 0); if (d) return d > 0 ? 1 : -1; } return 0; };
let updState = { state: 'idle', ver: APP_VER };
async function checkUpdate(manual) {
  if (!IS_APP) return;
  try {
    const r = await fetch(UPD_URL + '?t=' + Date.now(), { headers: { 'Cache-Control': 'no-cache' } }); if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json(); if (!j || !j.version || !j.files) throw new Error('bad manifest');
    if (vcmp(j.version, APP_VER) <= 0) { updState = { state: 'latest', ver: APP_VER }; if (manual) broadcast(Object.assign({ type: 'upd' }, updState)); return; }
    const root = path.join(HOME, 'update'), dir = path.join(root, j.version); fs.mkdirSync(dir, { recursive: true });
    const crypto2 = require('crypto');
    for (const [f, h] of Object.entries(j.files)) {
      if (!/^[\w.-]+$/.test(f)) throw new Error('bad file ' + f);
      const rr = await fetch(new URL(f, UPD_URL).href + '?v=' + encodeURIComponent(j.version)); if (!rr.ok) throw new Error(f + ' HTTP ' + rr.status);
      const b = Buffer.from(await rr.arrayBuffer()); if (crypto2.createHash('sha256').update(b).digest('hex') !== h) throw new Error('hash mismatch ' + f);
      fs.writeFileSync(path.join(dir, f + '.new'), b);
    }
    for (const f of Object.keys(j.files)) fs.renameSync(path.join(dir, f + '.new'), path.join(dir, f));
    fs.writeFileSync(path.join(root, 'current.json'), JSON.stringify({ version: j.version, dir }));
    updState = { state: 'ready', ver: j.version, notes: j.notes || '' }; broadcast(Object.assign({ type: 'upd' }, updState));
    console.log('تحديث جديد جاهز: ' + j.version);
  } catch (e) { logErr('update', e); if (manual) broadcast({ type: 'upd', state: 'error', ver: APP_VER, text: String(e.message || e).slice(0, 120) }); }
}
if (IS_APP) { setTimeout(() => checkUpdate(false), 20000); setInterval(() => checkUpdate(false), 3 * 3600e3); }
function restartApp() { if (!IS_APP) return; try { persist(); } catch (_) {} try { const { app } = require('electron'); app.relaunch(); setTimeout(() => app.exit(0), 300); } catch (e) { logErr('relaunch', e); } }
// ===== مكتبة الأصوات الحقيقية: كل صوت يتنزّل من myinstants أول مرة وينحفظ في media =====
const crypto = require('crypto');
const realPending = new Map();
function realPath(q) { return path.join(MEDIA, 'real-' + crypto.createHash('sha1').update(q.toLowerCase()).digest('hex').slice(0, 14) + '.mp3'); }
function realFile(q) {
  const f = realPath(q); if (fs.existsSync(f)) return Promise.resolve(f);
  if (realPending.has(q)) return realPending.get(q);
  const p = (async () => {
    const r = await fetch(MI + '/en/search/?name=' + encodeURIComponent(q), { headers: UA });
    const it = parseInstants(await r.text())[0]; if (!it) throw new Error('no result for ' + q);
    const a = await fetch(it.url, { headers: UA }); if (!a.ok) throw new Error('download ' + a.status);
    const buf = Buffer.from(await a.arrayBuffer()); if (buf.length < 500 || buf.length > 6 * 1024 * 1024) throw new Error('bad size');
    fs.writeFileSync(f, buf); return f;
  })().finally(() => realPending.delete(q));
  realPending.set(q, p); return p;
}
app.get('/api/sfx/real', async (req, res) => {
  const q = String(req.query.q || '').trim().slice(0, 80); if (!q) return res.status(400).end();
  try { const f = await realFile(q); res.set('Cache-Control', 'public, max-age=604800'); res.type('audio/mpeg'); fs.createReadStream(f).pipe(res); }
  catch (e) { logErr('real-sfx ' + q, e); res.status(404).end(); }
});
let prefetching = false;
async function realPrefetch(qs) {
  if (prefetching || !Array.isArray(qs)) return; prefetching = true; let n = 0;
  for (const q of qs.slice(0, 300)) { const s = String(q).trim().slice(0, 80); if (!s || fs.existsSync(realPath(s))) continue;
    try { await realFile(s); n++; } catch (_) {} await new Promise(r => setTimeout(r, 400)); }
  prefetching = false; if (n) console.log('تجهّزت ' + n + ' صوت حقيقي في مكتبة الأصوات');
}
app.post('/api/sfx/add', express.json(), async (req, res) => {
  try {
    let url = String((req.body && req.body.url) || '').trim(); let name = String((req.body && req.body.name) || '').trim();
    if (!/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'الرابط غير صحيح' });
    if (!/\.(mp3|ogg|wav|m4a)(\?|$)/i.test(url)) { // صفحة صوت: نطلع رابط الملف منها
      const r = await fetch(url, { headers: UA }); const items = parseInstants(await r.text());
      if (!items.length) return res.status(400).json({ error: 'ما لقيت ملف صوت في هالصفحة' });
      url = items[0].url; if (!name) name = items[0].name;
    }
    const r = await fetch(url, { headers: UA }); if (!r.ok) return res.status(400).json({ error: 'تعذر تنزيل الصوت' });
    const buf = Buffer.from(await r.arrayBuffer()); if (buf.length > 6 * 1024 * 1024) return res.status(400).json({ error: 'الصوت أكبر من 6 ميقا' });
    const ext = (url.match(/\.(mp3|ogg|wav|m4a)(\?|$)/i) || [, 'mp3'])[1].toLowerCase();
    const file = 'sfx-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6) + '.' + ext;
    fs.writeFileSync(path.join(MEDIA, file), buf);
    // السيرفر هو اللي يحفظ قائمة الأصوات، عشان ما تضيع لو كانت لوحة التحكم مفتوحة في أكثر من مكان
    const item = { id: Math.random().toString(36).slice(2, 8), name: (name || 'صوت').slice(0, 60), url: '/media/' + file, trend: !(req.body && req.body.trend === false), src: String((req.body && req.body.url) || url) };
    store.states.sfxOwn = (store.states.sfxOwn || []).filter(o => o.src !== item.src).concat([item]);
    persist(); broadcast({ type: 'state', key: 'sfxOwn', val: store.states.sfxOwn });
    res.json({ url: item.url, name: item.name, item });
  } catch (e) { res.status(500).json({ error: 'تعذر تنزيل الصوت' }); }
});

// ===== مشغّل الأغاني المحلي: yt-dlp يجيب صوت الأغنية مباشرة (بدل مشغل يوتيوب اللي يطلع أخطاء) =====
const { spawn } = require('child_process');
const BIN = path.join(HOME, 'bin'); fs.mkdirSync(BIN, { recursive: true });
const YTDLP = path.join(BIN, process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');
let ytdlpOk = fs.existsSync(YTDLP) && fs.statSync(YTDLP).size > 1e6;
async function ensureYtdlp() {
  if (ytdlpOk) return;
  try {
    const name = process.platform === 'win32' ? 'yt-dlp.exe' : (process.platform === 'darwin' ? 'yt-dlp_macos' : 'yt-dlp');
    console.log('تجهيز مشغّل الأغاني المحلي (أول مرة بس)…');
    const r = await fetch('https://github.com/yt-dlp/yt-dlp/releases/latest/download/' + name, { redirect: 'follow' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    fs.writeFileSync(YTDLP + '.tmp', Buffer.from(await r.arrayBuffer()));
    fs.renameSync(YTDLP + '.tmp', YTDLP); if (process.platform !== 'win32') fs.chmodSync(YTDLP, 0o755);
    ytdlpOk = true; console.log('المشغّل المحلي جاهز'); broadcast({ type: 'ytdlp', ok: true });
  } catch (e) { logErr('ytdlp-download', e); }
}
setTimeout(ensureYtdlp, 2000);

// ===== نسخة التطبيق: نشغّل رابط Cloudflare بنفسنا (بدون نافذة سوداء) =====
let cfProc = null;
async function startTunnel() {
  const CF = path.join(BIN, process.platform === 'win32' ? 'cloudflared.exe' : 'cloudflared');
  try {
    if (!(fs.existsSync(CF) && fs.statSync(CF).size > 1e6)) {
      console.log('تجهيز رابط البث (أول مرة بس)…');
      const name = process.platform === 'win32' ? 'cloudflared-windows-amd64.exe' : process.platform === 'darwin' ? 'cloudflared-darwin-amd64.tgz' : 'cloudflared-linux-amd64';
      const r = await fetch('https://github.com/cloudflare/cloudflared/releases/latest/download/' + name, { redirect: 'follow' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      fs.writeFileSync(CF + '.tmp', Buffer.from(await r.arrayBuffer())); fs.renameSync(CF + '.tmp', CF);
      if (process.platform !== 'win32') fs.chmodSync(CF, 0o755);
    }
    const log = path.join(HOME, 'tunnel.log'); try { fs.unlinkSync(log); } catch (_) {}
    cfProc = spawn(CF, ['tunnel', '--no-autoupdate', '--url', 'http://127.0.0.1:' + PORT], { windowsHide: true });
    const w = d => { try { fs.appendFileSync(log, d); } catch (_) {} };
    cfProc.stdout.on('data', w); cfProc.stderr.on('data', w);
    cfProc.on('exit', () => { cfProc = null; tunnelUrl = ''; setTimeout(startTunnel, 5000); });
  } catch (e) { logErr('tunnel', e); setTimeout(startTunnel, 30000); }
}
if (IS_APP) { setTimeout(startTunnel, 500); process.on('exit', () => { try { cfProc && cfProc.kill(); } catch (_) {} }); }
app.get('/api/yt/audio', (req, res) => {
  const id = String(req.query.id || ''); if (!/^[\w-]{11}$/.test(id) || !ytdlpOk) return res.status(400).end();
  const p = spawn(YTDLP, ['-f', 'bestaudio[ext=m4a]/bestaudio', '-o', '-', '--no-playlist', '--quiet', '--no-warnings', 'https://www.youtube.com/watch?v=' + id], { windowsHide: true });
  res.set({ 'Content-Type': 'audio/mp4', 'Cache-Control': 'no-store' });
  let sent = false; p.stdout.on('data', () => { sent = true; });
  p.stdout.pipe(res);
  let err = ''; p.stderr.on('data', d => { err += d; });
  p.on('error', e => { logErr('ytdlp-spawn', e); if (!res.headersSent) res.status(502); res.end(); });
  p.on('close', code => { if (code && !sent) { logErr('ytdlp ' + id, new Error(err.slice(0, 300))); if (!res.headersSent) res.status(502); } res.end(); });
  req.on('close', () => { try { p.kill(); } catch (_) {} });
});

// البحث في يوتيوب لطلبات الأغاني
app.get('/api/yt', async (req, res) => {
  try {
    const r = await yts(String(req.query.q || ''));
    const v = r.videos && r.videos[0];
    if (!v) return res.json({});
    res.json({ id: v.videoId, title: v.title, dur: v.timestamp, seconds: v.seconds });
  } catch (e) { res.json({}); }
});

function send(ws, msg) { if (ws.readyState === 1) ws.send(JSON.stringify(msg)); }
function broadcast(msg) { const d = JSON.stringify(msg); wss.clients.forEach(c => { if (c.readyState === 1) c.send(d); }); }
// صورة العرض واسم صانع المحتوى وعدد متابعينه (من معلومات الغرفة)
function pushHost(st, me, username) {
  try {
    let ri = (st && st.roomInfo) || (me && me.roomInfo) || {};
    if (ri.data && !ri.owner) ri = ri.data;
    const ow = ri.owner || ri.anchor || {};
    const fi = ow.follow_info || ow.followInfo || {};
    const followers = +(fi.follower_count || fi.followerCount || ow.follower_count || 0);
    const av = ow.avatar_large || ow.avatar_medium || ow.avatar_thumb || ow.avatarThumb || {};
    const pic = (av.url_list && av.url_list[0]) || (av.urlList && av.urlList[0]) || (av.url && av.url[0]) || '';
    const name = ow.nickname || username;
    if (!followers && !pic) return;
    store.host = { name, pic, followers, user: username, ts: Date.now() };
    persist();
    pushEvent({ type: 'host', name, pic, followers });
  } catch (e) { console.log('host info:', e.message); }
}
function pushEvent(ev) {
  ev.ts = ev.ts || Date.now();
  events.push(ev); evDirty = true;
  if (events.length > 60000) events = events.slice(-40000);
  ledgerAdd(ev);
  earn(ev);
  broadcast({ type: 'ev', ev });
}
function setStatus(text, live) { status = { text, live }; broadcast({ type: 'status', text, live }); }

function newSession() {
  if (events.length) {
    const T = { likes: 0, diamonds: 0, follows: 0 }, sup = {};
    for (const e of events) {
      if (e.type === 'like') { T.likes += +e.count || 1; if (+e.total > T.likes) T.likes = +e.total; }
      else if (e.type === 'gift') { const d = (+e.diamonds || 1) * (+e.count || 1); T.diamonds += d; sup[e.user] = (sup[e.user] || 0) + d; }
      else if (e.type === 'follow') T.follows++;
    }
    const top = Object.entries(sup).sort((a, b) => b[1] - a[1])[0];
    const t0 = events[0].ts || Date.now(), t1 = events[events.length - 1].ts || Date.now(), d = new Date(t0);
    const h = { date: d.toLocaleDateString('en-GB') + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), mins: Math.max(1, Math.round((t1 - t0) / 60000)), likes: T.likes, diamonds: T.diamonds, follows: T.follows, top: top ? top[0] : '' };
    store.states.history = [h].concat(store.states.history || []).slice(0, 30);
    broadcast({ type: 'state', key: 'history', val: store.states.history });
  }
  events = []; evDirty = true; persist();
  broadcast({ type: 'reset' });
  console.log('بث جديد — تم حفظ البث السابق وتصفير التكبيس والعدادات');
}

let tiktok = null;
// سجل أخطاء الاتصال في ملف arsh.log عشان نعرف السبب بالضبط
function logErr(where, err) {
  const msg = (err && (err.message || err.toString())) || String(err);
  const extra = err && (err.exception || err.cause) ? ' | ' + String((err.exception && err.exception.message) || err.cause) : '';
  const line = new Date().toISOString() + ' [' + where + '] ' + msg + extra + '\n';
  console.error(line.trim());
  try { fs.appendFileSync(path.join(HOME, 'arsh.log'), line); } catch (_) {}
  return msg + extra;
}
// نقرأ بيانات الحدث بشكل يناسب نسختي المكتبة (القديمة والجديدة)
const U = d => (d && d.user) || d || {};
const nick = d => { const u = U(d); return u.nickname || u.uniqueId || d.nickname || d.uniqueId || 'مجهول'; };
const uidOf = d => { const u = U(d); return u.uniqueId || d.uniqueId || ''; };
const picOf = d => { const u = U(d), p = u.profilePicture || {}; return u.profilePictureUrl || d.profilePictureUrl || (p.url && p.url[0]) || (p.urls && p.urls[0]) || (p.urlList && p.urlList[0]) || ''; };
const giftInfo = d => {
  const g = d.giftDetails || d.gift || {}, x = d.extendedGiftInfo || {}, img = g.giftImage || g.image || x.image || {};
  return {
    name: d.giftName || g.giftName || g.name || x.name || 'هدية',
    diamonds: +(d.diamondCount || g.diamondCount || x.diamond_count || 1),
    type: d.giftType != null ? d.giftType : (g.giftType != null ? g.giftType : g.type),
    img: d.giftPictureUrl || img.giftPictureUrl || (img.url && img.url[0]) || (img.urlList && img.urlList[0]) || (img.url_list && img.url_list[0]) || ''
  };
};

async function makeConnection(username) {
  // 1) الواجهة الأساسية للنسخة 2: WebSocket موقّع مجاناً. (جلب قائمة الهدايا enableExtendedGiftInfo يطلب باقة مدفوعة من Euler، فنطفيه — اسم الهدية وقيمتها يجون مع الحدث نفسه)
  try {
    const mod = await import('tiktok-live-connector-v2');
    const C = mod.TikTokLiveConnection || (mod.default && mod.default.TikTokLiveConnection);
    if (C) { const E = Object.assign({}, mod.ControlEvent || {}, mod.WebcastEvent || {}); return { conn: new C(username, { enableExtendedGiftInfo: false }), ver: 2, E }; }
  } catch (e) { logErr('v2-load', e); }
  // 2) احتياط: المكتبة القديمة
  return { conn: new WebcastPushConnection(username, { enableExtendedGiftInfo: false }), ver: 1, E: {} };
}

// ===== الاشتراك: كود تفعيل موقّع (ما ينزوّر) + تجربة مجانية =====
const LIC_PUB = crypto.createPublicKey({ key: Buffer.from('MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEvUmEyM6QQ/Dc/YRPZ3D407ENMKqNJMYQTZreIdEzkW8/fL74apVvZ6RxRJT8j51Ku8xDi/bZ3XG3OuiHqyG+KA==', 'base64'), format: 'der', type: 'spki' });
const TRIAL_DAYS = 3;
const b64u = s => Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64');
function parseLicense(code) {
  try {
    const m = String(code || '').trim().replace(/\s+/g, '').match(/^ARSH1\.([\w-]+)\.([\w-]+)$/); if (!m) return null;
    const ok = crypto.verify('sha256', Buffer.from(m[1]), { key: LIC_PUB, dsaEncoding: 'ieee-p1363' }, b64u(m[2]));
    if (!ok) return null; const p = JSON.parse(b64u(m[1]).toString('utf8'));
    return { user: String(p.u || '*').toLowerCase().replace(/^@/, ''), until: +p.x || 0, id: p.n || '', name: p.c || '' };
  } catch (_) { return null; }
}
if (!store.trialStart) { store.trialStart = Date.now(); persist(); }
function licStatus() {
  const L = store.license && parseLicense(store.license.code), now = Date.now();
  if (L && L.until > now) return { state: 'active', until: L.until, user: L.user, name: L.name };
  const tEnd = (store.trialStart || now) + TRIAL_DAYS * 864e5;
  if (tEnd > now && !(L && L.until <= now)) return { state: 'trial', until: tEnd };
  return { state: 'expired', until: L ? L.until : tEnd, user: L ? L.user : '' };
}
function licAllows(username) {
  const L = licStatus();
  if (L.state === 'expired') return 'الاشتراك منتهي — فعّل اشتراكك من قسم "الاشتراك" عشان تتصل باللايف (تقدر تجرب كل شي بالمحاكاة)';
  if (L.state === 'active' && L.user !== '*' && L.user !== String(username).toLowerCase()) return 'كود الاشتراك مربوط بحساب @' + L.user + ' — اتصل بنفس الحساب أو تواصل معنا';
  return '';
}
// إعادة الاتصال التلقائي: ننتظر بداية اللايف، ونرجع نتصل لو انقطع
let connGen = 0, retryT = null;
function retryLater(username, gen, sec, msg) {
  if (gen !== connGen) return; clearTimeout(retryT); setStatus(msg, false);
  retryT = setTimeout(() => { if (gen === connGen) connect(username, true); }, sec * 1000);
}
async function connect(username, isRetry) {
  if (!isRetry) connGen++;
  const gen = connGen; clearTimeout(retryT);
  if (tiktok) { const old = tiktok; tiktok = null; try { old.disconnect(); } catch (_) {} }
  if (store.lastUser !== username) { store.lastUser = username; persist(); }
  { const why = licAllows(username); if (why) { setStatus(why, false); broadcast({ type: 'lic', ...licStatus() }); return; } }
  setStatus('جاري الاتصال بلايف @' + username + ' …', false);
  let made;
  try { made = await makeConnection(username); } catch (e) { setStatus('تعذر تشغيل مكتبة الاتصال: ' + logErr('init', e), false); return; }
  if (gen !== connGen) { try { made.conn.disconnect(); } catch (_) {} return; }
  tiktok = made.conn; const me = tiktok;
  const E = made.E || {}, on = (k, name, fn) => tiktok.on(E[k] || name, d => { try { fn(d || {}); } catch (e) { logErr('event ' + name, e); } });

  // v2 من المكتبة يرسل count و total — v1 يرسل likeCount و totalLikeCount
  on('LIKE', 'like', d => pushEvent({ type: 'like', user: nick(d), uid: uidOf(d), pic: picOf(d), count: Math.max(1, +(d.likeCount || d.count || 1)), total: +(d.totalLikeCount || d.total || 0) || undefined }));
  on('GIFT', 'gift', d => {
    const g = giftInfo(d);
    if (g.type === 1 && !d.repeatEnd) return; // نحسب السلسلة مرة وحدة عند نهايتها
    const ev = { type: 'gift', user: nick(d), uid: uidOf(d), pic: picOf(d), gift: g.name, img: g.img, diamonds: g.diamonds, count: +(d.repeatCount || 1) };
    pushEvent(ev);
    const c = CB(), total = ev.diamonds * ev.count;
    if (c.gifts && total >= (+c.giftMin || 0) && (!thanked[ev.uid] || Date.now() - thanked[ev.uid] > 20000)) {
      thanked[ev.uid] = Date.now(); sayChat(fill(pickLine(c.giftMsgs), ev), 'gift');
    }
  });
  // نعلّم مشرفين اللايف وصاحب البث عشان يتحكمون بالموسيقى
  const isTkMod = d => { const u = U(d), id = d.userIdentity || u.userIdentity || {}, at = u.userAttr || d.userAttr || {};
    return !!(d.isModerator || u.isModerator || id.isModeratorOfAnchor || at.isAdmin || at.isSuperAdmin); };
  on('CHAT', 'chat', d => { const uid = uidOf(d); pushEvent({ type: 'chat', user: nick(d), uid, pic: picOf(d), text: d.comment || d.content || '',
    mod: isTkMod(d), host: !!uid && uid.toLowerCase() === String(username).toLowerCase() }); });
  on('FOLLOW', 'follow', d => {
    const ev = { type: 'follow', user: nick(d), uid: uidOf(d), pic: picOf(d) }; pushEvent(ev);
    const c = CB(); if (c.follows) sayChat(fill(pickLine(c.followMsgs), ev), 'follow');
  });
  on('SHARE', 'share', d => pushEvent({ type: 'share', user: nick(d), uid: uidOf(d), pic: picOf(d) }));
  // الدخول للايف — يُبث مباشرة بدون حفظ (للدخلات الملكية)
  on('MEMBER', 'member', d => {
    const ev = { type: 'join', user: nick(d), uid: uidOf(d), pic: picOf(d), ts: Date.now() };
    broadcast({ type: 'ev', ev });
    const c = CB(), now = Date.now();
    if (c.welcome && ev.uid && (!welcomed[ev.uid] || now - welcomed[ev.uid] > (+c.cooldown || 60) * 60000)) {
      welcomed[ev.uid] = now; sayChat(fill(pickWelcome(c), ev), 'welcome');
    }
  });
  on('ROOM_USER', 'roomUser', d => pushEvent({ type: 'viewers', count: +(d.viewerCount || d.totalUser || 0) }));
  on('STREAM_END', 'streamEnd', () => { if (tiktok !== me) return; me._ended = true; retryLater(username, gen, 45, 'انتهى اللايف — أول ما تبدأ لايف جديد نتصل تلقائياً'); });
  on('DISCONNECTED', 'disconnected', () => { if (tiktok !== me || me._ended) return; retryLater(username, gen, 5, 'انقطع الاتصال بتيك توك — نعيد الاتصال تلقائياً…'); });
  on('ERROR', 'error', e => logErr('runtime', e));

  try {
    const st = await me.connect();
    if (tiktok !== me) { try { me.disconnect(); } catch (_) {} return; }
    // بث جديد (رقم غرفة مختلف) = نحفظ ملخص البث القديم ونصفّر التكبيس والعدادات
    const room = String((st && (st.roomId || (st.roomInfo && st.roomInfo.id))) || '');
    const auto = !store.settings || store.settings.autoReset !== false;
    if (auto && room && store.lastRoom && room !== store.lastRoom) newSession();
    else if (auto && room && !store.lastRoom && events.length && Date.now() - (events[events.length - 1].ts || 0) > 20 * 60e3) newSession(); // أول مرة: بيانات من بث سابق
    if (room) { store.lastRoom = room; persist(); }
    console.log('متصل بلايف @' + username + ' (نسخة ' + made.ver + ') — roomId ' + (st && st.roomId));
    setStatus('متصل بلايف @' + username, true);
    currentUser = username;
    pushHost(st, me, username);
    if (me._hostT) clearInterval(me._hostT);
    me._hostT = setInterval(async () => { if (tiktok !== me) return clearInterval(me._hostT); try { const ri = me.fetchRoomInfo ? await me.fetchRoomInfo() : null; if (ri) pushHost({ roomInfo: ri }, me, username); } catch (_) {} }, 10 * 60e3);
    startSender(username);
    if (store.settings && store.settings.telegram && store.settings.telegram.enabled) telegram(username);
  } catch (err) {
    const why = logErr('connect v' + made.ver, err);
    let hint = 'تأكد إن @' + username + ' فاتح لايف والحساب عام';
    if (/offline|not live|LIVE has ended|isn't online/i.test(why)) hint = 'تيك توك يقول إن @' + username + ' مو لايف — تأكد من اسم الحساب';
    else if (/rate|429|limit/i.test(why)) hint = 'محاولات كثيرة، انتظر دقيقة وجرّب';
    else if (/sign|euler|api key|401|403/i.test(why)) hint = 'خدمة التوقيع رفضت الاتصال';
    else if (/captcha|verify/i.test(why)) hint = 'تيك توك طلب تحقق، جرّب بعد شوي';
    if (tiktok !== me) return;
    if (/offline|not live|LIVE has ended|isn't online|user_not_found|room ?id/i.test(why)) retryLater(username, gen, 20, '@' + username + ' مو لايف الحين — أول ما تبدأ اللايف نتصل تلقائياً (نتأكد كل 20 ثانية)');
    else retryLater(username, gen, /rate|429|limit/i.test(why) ? 60 : 30, 'فشل الاتصال — ' + hint + ' · نعيد المحاولة تلقائياً · السبب: ' + why.slice(0, 120));
  }
}

// ===== جهاز واحد بس يشغّل الأصوات والموسيقى والبوت (حتى لو لوحة التحكم مفتوحة في أكثر من مكان) =====
let leaderId = null;
const dashes = () => [...wss.clients].filter(c => c.readyState === 1 && c.dashId);
let claimed = false;
function pickLeader(pref) {
  const d = dashes(), cur = d.find(c => c.dashId === leaderId), local = d.find(c => c.isLocalHost);
  if (pref && d.some(c => c.dashId === pref)) { leaderId = pref; claimed = true; }
  else if (!cur) { claimed = false; const c = local || d[0]; leaderId = c ? c.dashId : null; }
  else if (!claimed && !cur.isLocalHost && local) leaderId = local.dashId; // الكمبيوتر أولى من الجوال
  broadcast({ type: 'leader', id: leaderId });
}

wss.on('connection', (ws, req) => {
  ws.isLocalHost = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(String(req.headers.host || ''));
  ws.on('close', () => { if (ws.dashId && ws.dashId === leaderId) { leaderId = null; pickLeader(); } });
  const remote = isRemote(req);
  send(ws, { type: 'hello', settings: store.settings, states: store.states, events, status: status.text, live: status.live, lan: lanUrl(), tunnel: tunnelUrl, ytdlp: ytdlpOk, lastUser: store.lastUser || '', host: store.host || null, mstatus: mstat, upd: updState, appVer: APP_VER, lic: licStatus(),
    chatAuth: !!(secret.apiKey && secret.sessionId && secret.idc), chatReady: senderReady });
  ws.on('message', raw => {
    if (remote) return; // الأوفرلاي من الرابط العام يستقبل بس، ما يقدر يغيّر شي
    let mm; try { mm = JSON.parse(raw); } catch (_) { return; }
    if (mm.type === 'dash') { ws.dashId = String(mm.id || ''); pickLeader(); return; }
    if (mm.type === 'claim') { if (ws.dashId) pickLeader(ws.dashId); return; }
    if (mm.type === 'lead') { broadcast({ type: 'lead', a: mm.a, v: mm.v }); return; }
    let m; try { m = JSON.parse(raw); } catch (_) { return; }
    if (m.type === 'connect' && m.username) connect(String(m.username).replace(/^@/, ''));
    else if (m.type === 'updCheck') checkUpdate(true);
    else if (m.type === 'updRestart') restartApp();
    else if (m.type === 'settings') { store.settings = m.settings; persist(); broadcast(m); startDonations(); startMulti(); }
    else if (m.type === 'state') { store.states[m.key] = m.val; persist(); broadcast(m); }
    else if (m.type === 'sim' && m.ev) {
      const ev = Object.assign({}, m.ev, { ts: Date.now() });
      if (ev.type === 'join') broadcast({ type: 'ev', ev }); else pushEvent(ev);
    }
    else if (m.type === 'fx') broadcast(m);
    else if (m.type === 'chatSay' && m.text) sayChat(m.text, 'bot');
    else if (m.type === 'chatAuth') {
      secret = { apiKey: String(m.apiKey || '').trim(), sessionId: String(m.sessionId || '').trim(), idc: String(m.idc || '').trim() };
      store.secret = secret; persist();
      send(ws, { type: 'chatAuthOk', ok: !!(secret.apiKey && secret.sessionId && secret.idc) });
      if (currentUser) startSender(currentUser);
    }
    else if (m.type === 'chatTest') sayChat(String(m.text || 'تجربة بوت عرش اللايف'), 'bot');
    else if (m.type === 'pointsAdj' && m.user) {
      store.states.points[m.user] = Math.max(0, (store.states.points[m.user] || 0) + (+m.delta || 0));
      persist(); broadcast({ type: 'state', key: 'points', val: store.states.points });
    }
    else if (m.type === 'reset') { events = []; evDirty = true; broadcast({ type: 'reset' }); }
    else if (m.type === 'realPrefetch') realPrefetch(m.qs);
    else if (m.type === 'license') { const L = parseLicense(m.code);
      if (!L) send(ws, { type: 'licErr', text: 'الكود غير صحيح — انسخه كامل من الرسالة' });
      else if (L.until <= Date.now()) send(ws, { type: 'licErr', text: 'هذا الكود منتهي' });
      else { store.license = { code: String(m.code).trim() }; persist(); broadcast({ type: 'lic', ...licStatus(), fresh: 1 }); if (store.lastUser && !tiktok) connect(store.lastUser); } }
    else if (m.type === 'telegramTest') telegram(currentUser || 'username').then(ok => send(ws, { type: 'status', text: ok ? 'وصلت رسالة تيليجرام التجريبية' : 'فشل إرسال تيليجرام — تأكد من التوكن والمعرّف', live: status.live }));
  });
});

// تحديث تلقائي: لو تغيّرت الصفحة تتحدث كل الشاشات (اللوحة والأوفرلاي)، ولو تغيّر السيرفر يعيد تشغيل نفسه
fs.watchFile(path.join(__dirname, 'index.html'), { interval: 1500 }, (a, b) => { if (a.mtimeMs !== b.mtimeMs) { console.log('تحديث جديد للصفحة — تحديث الشاشات'); broadcast({ type: 'reload' }); } });
if (!IS_APP) fs.watchFile(__filename, { interval: 1500 }, (a, b) => { if (a.mtimeMs !== b.mtimeMs) { console.log('تحديث جديد للسيرفر — إعادة تشغيل'); persist(); setTimeout(() => process.exit(0), 600); } });

server.listen(PORT, '0.0.0.0', () => {
  console.log('عرش اللايف شغال: http://localhost:' + PORT);
  const lan = lanUrl(); if (lan) console.log('تحكم من جوالك على نفس الواي فاي: ' + lan);
  const u = (IS_APP ? '' : process.argv[2]) || store.lastUser;
  if (u) connect(String(u).replace(/^@/, ''));
});
