// أفضل K: نفس نتيجة الفرز الكامل تماماً (بما فيه التساوي والأسماء العربية) — وأسرع بكثير
import { entries } from "../arsh-live/src/engine/leaderboard.js";
let pass = 0, fail = 0; const ok = (c: any, m: string) => { c ? pass++ : (fail++, process.stdout.write("FAIL " + m + "\n")); };
const names = ["أحمد", "محمد", "سارة", "نورة", "خالد", "Ali", "zed", "عبدالله", "ريم", "فهد"];
const full = (w: any, D: any) => { const k = w.type === "gifts" ? "gifts" : w.type; return Object.values(D[k] || {}).map((r: any) => ({ k: r.k, name: r.name, av: r.av, v: r.v, ...(w.type === "gifts" ? { c: r.c } : {}) })).sort((a: any, b: any) => b.v - a.v || a.name.localeCompare(b.name)).slice(0, w.topN); };
for (let trial = 0; trial < 300; trial++) {
  const D: any = { likes: {}, comments: {}, interact: {}, gifts: {} }; const n = 1 + Math.floor(Math.random() * 400);
  for (let i = 0; i < n; i++) { const k = "u" + i, name = names[Math.floor(Math.random() * names.length)] + (Math.random() < .5 ? "" : i % 7); const v = Math.floor(Math.random() * (trial % 3 === 0 ? 3 : 500));
    for (const m of ["likes", "comments", "interact"]) D[m][k] = { k, name, av: "", v }; D.gifts[k] = { k, name, av: "", v, c: v % 5 }; }
  for (const type of ["likes", "comments", "interact", "gifts"]) for (const topN of [1, 3, 5, 10, 20]) { const w = { type, topN, sortBy: "value" };
    const a = JSON.stringify(entries(w, D, [])), b = JSON.stringify(full(w, D)); if (a !== b) { ok(false, `mismatch ${type} top${topN} n=${n}`); break; } }
}
ok(fail === 0, "top-K identical to full sort on 300 random rooms × 4 lists × 5 sizes (ties + Arabic names)");
{ const D: any = { likes: {} }; for (let i = 0; i < 50000; i++) D.likes["u" + i] = { k: "u" + i, name: names[i % 10], av: "", v: 1 + ((i * 7919) % 100000) };
  const w = { type: "likes", topN: 10 }; let t0 = performance.now(); for (let i = 0; i < 20; i++) entries(w, D, []); const tk = (performance.now() - t0) / 20;
  t0 = performance.now(); for (let i = 0; i < 3; i++) full(w, D); const fs = (performance.now() - t0) / 3;
  process.stdout.write(`  50,000 viewers top-10: ${tk.toFixed(1)}ms (full sort ${fs.toFixed(0)}ms)\n`); ok(tk < fs, "top-K faster than a full sort on big streams"); }
console.log(`lb-topk: ${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
