// برنامج بطوط ستريم لويندوز: نافذة مستقلة للوحة التحكم المستضافة (لا يخزن أي أسرار محلياً)
const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");
const cfg = require("./config.json");
const BASE = String(cfg.url || "").replace(/\/$/, "");
app.setAppUserModelId("com.b6o6.streaming");
function create() {
  const win = new BrowserWindow({ width: 1400, height: 900, minWidth: 980, minHeight: 640, title: "بطوط ستريم — B6O6 Streaming", icon: path.join(__dirname, "icon.png"), backgroundColor: "#0b1020", autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true } });
  win.loadURL(BASE + "/dashboard");
  // الروابط الخارجية (الدفع، GitHub، ...) تفتح في المتصفح الافتراضي
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => { if (!url.startsWith(BASE)) { e.preventDefault(); shell.openExternal(url); } });
  win.webContents.on("did-fail-load", () => win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(`<html dir="rtl" style="background:#0b1020;color:#fff;font-family:sans-serif;display:grid;place-items:center;height:100%"><div style="text-align:center"><h2>تعذر الاتصال ببطوط ستريم</h2><p>تأكد من اتصال الإنترنت ثم أعد المحاولة.</p><button onclick="location.href='${BASE}/dashboard'" style="padding:10px 20px">إعادة المحاولة</button></div></html>`)));
}
Menu.setApplicationMenu(Menu.buildFromTemplate([{ label: "عرض", submenu: [{ role: "reload", label: "تحديث" }, { role: "togglefullscreen", label: "ملء الشاشة" }, { role: "zoomIn", label: "تكبير" }, { role: "zoomOut", label: "تصغير" }, { role: "resetZoom", label: "الحجم الأصلي" }] }]));
if (!app.requestSingleInstanceLock()) app.quit();
else { app.on("second-instance", () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { if (w.isMinimized()) w.restore(); w.focus(); } }); app.whenReady().then(create); }
app.on("window-all-closed", () => app.quit());
