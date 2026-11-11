// خادم اختبار: النسخة التجريبية + مركز WebSocket الحقيقي + حفظ وهمي في الذاكرة/ملف (لاختبار الاستعادة بعد إعادة التشغيل)
import http from "http"; import fs from "fs";
import { WebSocketServer } from "/opt/npm-tools/node_modules/ws/wrapper.mjs";
import { createHub } from "../arsh-live/src/server/live-hub.ts";
const html = () => fs.readFileSync(new URL("../demo/index.html", import.meta.url));
const DB = "/tmp/hubdb.json"; const db = fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB, "utf8")) : { clock: {}, logs: {} };
const flush = () => fs.writeFileSync(DB, JSON.stringify(db));
const srv = http.createServer((q, s) => { s.writeHead(200, { "content-type": "text/html; charset=utf-8" }); s.end(html()); });
const wss = new WebSocketServer({ server: srv, path: "/ws" });
createHub(wss as any, {
  authorize: async (room, key) => key === "secret-key",
  loadRoom: async room => ({ C: db.clock[room], logs: db.logs[room] || [] }),
  saveClock: async (room, C) => { db.clock[room] = C; flush(); },
  saveLogs: async (room, logs) => { const ex = db.logs[room] || (db.logs[room] = []); for (const l of logs) if (!l.eventId || !ex.some((x: any) => x.eventId === l.eventId)) ex.unshift(l); flush(); },
});
srv.listen(4555, () => console.log("ready"));
