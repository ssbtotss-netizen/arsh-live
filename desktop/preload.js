// جسر آمن بين صفحة المنصة وبرنامج الكمبيوتر — أوامر محددة فقط (لا وصول للملفات ولا للنظام)
const { contextBridge, ipcRenderer } = require("electron");
const subs = new Set();
let state = null; try { state = ipcRenderer.sendSync("b6o6:get"); } catch {}
ipcRenderer.on("b6o6:state", (_e, s) => { state = s; api.state = s; subs.forEach(f => { try { f(s); } catch {} }); });
ipcRenderer.on("b6o6:cmd", (_e, c) => { try { if (c === "probe" && window.__flcProbe) window.__flcProbe(); if (c === "opacity") window.dispatchEvent(new CustomEvent("b6o6-opacity")); } catch {} });
const api = {
  desktop: true, state,
  openFloat: () => ipcRenderer.invoke("b6o6:open"),
  toggle: key => ipcRenderer.invoke("b6o6:toggle", String(key)),
  setKeys: keys => ipcRenderer.invoke("b6o6:keys", keys),
  saveSettings: s => ipcRenderer.invoke("b6o6:settings", JSON.parse(JSON.stringify(s || {}))),
  probe: () => ipcRenderer.invoke("b6o6:probe"),
  onState: f => { if (typeof f === "function") subs.add(f); },
};
if (state) contextBridge.exposeInMainWorld("b6o6Desktop", api);
