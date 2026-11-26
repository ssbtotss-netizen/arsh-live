// برنامج بطوط ستريم لويندوز: لوحة التحكم + الشات العائم فوق الألعاب والتطبيقات (لا يخزن أي أسرار محلياً — تسجيل الدخول في المنصة نفسها)
// الشات العائم: فوق كل النوافذ (مستوى screen-saver) · وضع اللعب: تمرير الماوس للعبة (setIgnoreMouseEvents) · اختصارات عامة قابلة للتعديل
// حفظ المكان والحجم لكل شاشة · نقل بين الشاشات · استبعاد من التقاط الشاشة (setContentProtection — Windows 10 2004+) · تحديثات آمنة من GitHub Releases
// بدون أي حقن داخل الألعاب: نافذة عادية فوق اللعبة (Borderless/Windowed). ملء الشاشة الحصري (Exclusive Fullscreen) لا يسمح لأي نافذة بالظهور فوقه.
const { app, BrowserWindow, shell, Menu, Tray, globalShortcut, ipcMain, screen, nativeImage } = require("electron");
const path = require("path"), fs = require("fs");
const cfg = require("./config.json");
const BASE = String(cfg.url || "").replace(/\/$/, "");
app.setAppUserModelId("com.b6o6.streaming");
const STATE_FILE = () => path.join(app.getPath("userData"), "float.json");
const DEF_KEYS = { show: "Control+Shift+C", game: "Control+Shift+G", lock: "Control+Shift+L", onTop: "Control+Shift+T", opacity: "Control+Shift+O", display: "Control+Shift+M" };
let S = { bounds: null, displayId: null, onTop: true, clickThrough: false, locked: false, privacy: true, visible: true, keys: { ...DEF_KEYS }, settings: null };
try { S = { ...S, ...JSON.parse(fs.readFileSync(STATE_FILE(), "utf8")) }; S.keys = { ...DEF_KEYS, ...(S.keys || {}) }; } catch {}
let saveT; const persist = () => { clearTimeout(saveT); saveT = setTimeout(() => { try { fs.writeFileSync(STATE_FILE(), JSON.stringify(S, null, 1)); } catch {} }, 400); };
let mainWin = null, floatWin = null, tray = null;
const pub = () => ({ onTop: S.onTop, clickThrough: S.clickThrough, locked: S.locked, privacy: S.privacy, visible: S.visible, keys: S.keys });
const broadcast = () => { for (const w of [mainWin, floatWin]) if (w && !w.isDestroyed()) w.webContents.send("b6o6:state", pub()); updateTray(); };
const sameOrigin = url => { try { return new URL(url).origin === new URL(BASE).origin; } catch { return false; } };
const webPrefs = () => ({ contextIsolation: true, nodeIntegration: false, sandbox: true, preload: path.join(__dirname, "preload.js") });

function createMain() {
  mainWin = new BrowserWindow({ width: 1400, height: 900, minWidth: 980, minHeight: 640, title: "بطوط ستريم — B6O6 Streaming", icon: path.join(__dirname, "icon.png"), backgroundColor: "#0b1020", autoHideMenuBar: true, webPreferences: webPrefs() });
  mainWin.loadURL(BASE + "/dashboard");
  guard(mainWin);
  mainWin.on("closed", () => { mainWin = null; });
}
function guard(win) {
  // الروابط الخارجية (الدفع، GitHub، حسابات المشاهدين) تفتح في المتصفح الافتراضي
  win.webContents.setWindowOpenHandler(({ url }) => { if (sameOrigin(url) && /#float/.test(url)) { openFloat(); return { action: "deny" }; } shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => { if (!sameOrigin(url)) { e.preventDefault(); shell.openExternal(url); } });
  win.webContents.on("did-fail-load", (_e, code) => { if (code === -3) return; win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(`<html dir="rtl" style="background:#0b1020;color:#fff;font-family:sans-serif;display:grid;place-items:center;height:100%"><div style="text-align:center"><h2>تعذر الاتصال بالمنصة</h2><p>تحقق من الإنترنت ثم أعد المحاولة</p><button onclick="location.href='${BASE}/dashboard'" style="padding:10px 18px;border-radius:10px;border:0;background:#8b5cf6;color:#fff">إعادة المحاولة</button></div></html>`)); });
}
/** الشات العائم: نافذة شفافة بلا إطار، فوق كل التطبيقات، بنفس جلسة تسجيل الدخول */
function openFloat() {
  if (floatWin && !floatWin.isDestroyed()) { floatWin.showInactive(); S.visible = true; broadcast(); return; }
  const disp = screen.getAllDisplays().find(d => d.id === S.displayId) || screen.getPrimaryDisplay(), wa = disp.workArea;
  let b = S.bounds && screen.getAllDisplays().some(d => inside(S.bounds, d.workArea)) ? S.bounds : { width: 380, height: 620, x: wa.x + wa.width - 400, y: wa.y + 80 };
  floatWin = new BrowserWindow({ ...b, minWidth: 220, minHeight: 160, frame: false, transparent: true, backgroundColor: "#00000000", hasShadow: false, resizable: !S.locked, movable: !S.locked, skipTaskbar: false,
    title: "الشات العائم — B6O6", icon: path.join(__dirname, "icon.png"), focusable: true, webPreferences: { ...webPrefs(), backgroundThrottling: false } });
  applyOnTop(); applyClick(); floatWin.setContentProtection(!!S.privacy);
  floatWin.loadURL(BASE + "/dashboard#float"); guard(floatWin);
  const remember = () => { if (!floatWin || floatWin.isDestroyed()) return; S.bounds = floatWin.getBounds(); S.displayId = screen.getDisplayMatching(S.bounds).id; persist(); };
  floatWin.on("moved", remember); floatWin.on("resized", remember);
  floatWin.on("closed", () => { floatWin = null; S.visible = false; persist(); updateTray(); });
  S.visible = true; persist(); broadcast();
}
const inside = (r, a) => r.x + 40 > a.x && r.y + 20 > a.y && r.x + 40 < a.x + a.width && r.y + 20 < a.y + a.height;
function applyOnTop() { if (!floatWin) return; floatWin.setAlwaysOnTop(!!S.onTop, "screen-saver"); floatWin.setVisibleOnAllWorkspaces(!!S.onTop, { visibleOnFullScreen: true }); }
/** وضع اللعب: الضغطات تمر للعبة ولا تسحب التركيز منها — للخروج استخدم الاختصار (لا يمكن الضغط على النافذة وهي شفافة للماوس) */
function applyClick() { if (!floatWin) return; floatWin.setIgnoreMouseEvents(!!S.clickThrough, { forward: true }); floatWin.setFocusable(!S.clickThrough); if (S.clickThrough) floatWin.blur(); }
function toggle(key) {
  if (key === "onTop") { S.onTop = !S.onTop; applyOnTop(); }
  else if (key === "clickThrough") { S.clickThrough = !S.clickThrough; applyClick(); }
  else if (key === "locked") { S.locked = !S.locked; if (floatWin) { floatWin.setMovable(!S.locked); floatWin.setResizable(!S.locked); } }
  else if (key === "privacy") { S.privacy = !S.privacy; if (floatWin) floatWin.setContentProtection(!!S.privacy); }
  else if (key === "visible") { if (!floatWin) return openFloat(); if (floatWin.isVisible()) { floatWin.hide(); S.visible = false; } else { floatWin.showInactive(); S.visible = true; } }
  else if (key === "display") { if (!floatWin) return; const ds = screen.getAllDisplays(); if (ds.length < 2) return; const cur = screen.getDisplayMatching(floatWin.getBounds()), i = ds.findIndex(d => d.id === cur.id), nx = ds[(i + 1) % ds.length].workArea, b = floatWin.getBounds();
    floatWin.setBounds({ x: nx.x + Math.min(b.x - cur.workArea.x, nx.width - b.width), y: nx.y + Math.min(b.y - cur.workArea.y, nx.height - b.height), width: Math.min(b.width, nx.width), height: Math.min(b.height, nx.height) }); }
  else if (key === "opacity") { if (floatWin) floatWin.webContents.send("b6o6:cmd", "opacity"); }
  persist(); broadcast();
}
function registerKeys() {
  globalShortcut.unregisterAll(); const map = { show: "visible", game: "clickThrough", lock: "locked", onTop: "onTop", opacity: "opacity", display: "display" }, failed = [];
  for (const [k, acc] of Object.entries(S.keys)) { if (!acc) continue; try { if (!globalShortcut.register(acc, () => toggle(map[k]))) failed.push(acc); } catch { failed.push(acc); } }
  return failed;
}
function updateTray() {
  if (!tray) return; const ck = (label, key, on) => ({ label, type: "checkbox", checked: !!on, click: () => toggle(key) });
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "فتح لوحة التحكم", click: () => { if (!mainWin) createMain(); else { mainWin.show(); mainWin.focus(); } } },
    { label: floatWin ? (S.visible ? "إخفاء الشات العائم" : "إظهار الشات العائم") : "فتح الشات العائم", click: () => toggle("visible") }, { type: "separator" },
    ck(`وضع اللعب — تمرير الماوس (${S.keys.game})`, "clickThrough", S.clickThrough), ck(`فوق كل التطبيقات (${S.keys.onTop})`, "onTop", S.onTop), ck(`قفل المكان والحجم (${S.keys.lock})`, "locked", S.locked),
    ck("إخفاء الشات من التقاط الشاشة (خاص بك)", "privacy", S.privacy), { label: `نقل للشاشة التالية (${S.keys.display})`, click: () => toggle("display") }, { type: "separator" },
    { label: "خروج", click: () => app.quit() }]));
  tray.setToolTip("B6O6 — الشات العائم" + (S.clickThrough ? " (وضع اللعب)" : ""));
}
// واجهة آمنة للصفحة (من نفس نطاق المنصة فقط)
const okSender = e => sameOrigin(e.senderFrame ? e.senderFrame.url : e.sender.getURL());
ipcMain.on("b6o6:get", e => { e.returnValue = okSender(e) ? pub() : null; });
ipcMain.handle("b6o6:toggle", (e, key) => { if (okSender(e) && ["onTop", "clickThrough", "locked", "privacy", "visible", "display", "opacity"].includes(key)) toggle(key); return pub(); });
ipcMain.handle("b6o6:open", e => { if (okSender(e)) openFloat(); return pub(); });
ipcMain.handle("b6o6:keys", (e, keys) => { if (!okSender(e) || !keys || typeof keys !== "object") return { ok: false }; for (const k of Object.keys(DEF_KEYS)) if (typeof keys[k] === "string") S.keys[k] = keys[k].slice(0, 40); const failed = registerKeys(); persist(); broadcast(); return { ok: !failed.length, failed }; });
ipcMain.handle("b6o6:settings", (e, s) => { if (okSender(e) && s && typeof s === "object") { S.settings = s; persist(); } return true; });
ipcMain.handle("b6o6:probe", e => { if (okSender(e) && floatWin) floatWin.webContents.send("b6o6:cmd", "probe"); return true; });

Menu.setApplicationMenu(Menu.buildFromTemplate([{ label: "عرض", submenu: [{ role: "reload", label: "تحديث" }, { role: "togglefullscreen", label: "ملء الشاشة" }, { role: "zoomIn", label: "تكبير" }, { role: "zoomOut", label: "تصغير" }, { role: "resetZoom", label: "الحجم الأصلي" }] },
  { label: "الشات العائم", submenu: [{ label: "فتح الشات العائم", click: openFloat }, { label: "وضع اللعب", click: () => toggle("clickThrough") }, { label: "فوق كل التطبيقات", click: () => toggle("onTop") }] }]));
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on("second-instance", () => { const w = mainWin || floatWin; if (w) { if (w.isMinimized()) w.restore(); w.focus(); } });
  app.whenReady().then(() => {
    createMain(); registerKeys();
    try { tray = new Tray(nativeImage.createFromPath(path.join(__dirname, "icon.png")).resize({ width: 16, height: 16 })); tray.on("click", () => toggle("visible")); updateTray(); } catch {}
    if (S.visible && S.bounds) openFloat(); // يعود الشات العائم لنفس المكان عند تشغيل البرنامج
    // تحديثات آمنة: ملفات موقّعة بالتحقق (sha512) من GitHub Releases الرسمي للمشروع فقط
    try { const { autoUpdater } = require("electron-updater"); autoUpdater.autoDownload = true; autoUpdater.checkForUpdatesAndNotify().catch(() => {}); setInterval(() => autoUpdater.checkForUpdates().catch(() => {}), 6 * 3600e3); } catch {}
  });
}
app.on("will-quit", () => globalShortcut.unregisterAll());
app.on("window-all-closed", () => { if (!tray) app.quit(); });
