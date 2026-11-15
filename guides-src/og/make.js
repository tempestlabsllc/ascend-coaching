// Renders the link-preview image (public/og.png, 1200x630) shown when the site is shared.
// Run: node guides-src/og/make.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..", "..");
const font = fs.readFileSync(path.join(root, "node_modules/@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff2")).toString("base64");

const chev = ["M13 37 L24 29 L35 37", "M13 28.5 L24 20.5 L35 28.5", "M13 20 L24 11 L35 20"];
const mark = `<svg viewBox="0 0 48 48" width="190" height="190">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22262c"/><stop offset="1" stop-color="#000"/></linearGradient>
<linearGradient id="cb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#3a9ad9"/><stop offset="1" stop-color="#d4f1ff"/></linearGradient>
<filter id="gl" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<rect width="48" height="48" rx="13" fill="url(#bg)" stroke="rgba(137,207,240,.35)" stroke-width=".6"/>
${chev.map((d) => `<path d="${d}" fill="none" stroke="url(#cb)" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" filter="url(#gl)"/>`).join("")}</svg>`;

let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const dots = Array.from({ length: 70 }, () => {
  const s = 2 + rnd() * 5;
  return `<i style="left:${rnd() * 1200}px;top:${rnd() * 630}px;width:${s}px;height:${s}px;opacity:${0.25 + rnd() * 0.6}"></i>`;
}).join("");

const html = `<!doctype html><html><head><style>
@font-face{font-family:Bebas;src:url(data:font/woff2;base64,${font}) format("woff2")}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#05070a;font-family:Helvetica,Arial,sans-serif}
.wrap{position:relative;width:1200px;height:630px;overflow:hidden;
 background:radial-gradient(ellipse 60% 70% at 50% 45%,rgba(58,154,217,.38),rgba(58,154,217,0) 70%),
 radial-gradient(circle at 12% 110%,rgba(137,207,240,.25),transparent 45%),radial-gradient(circle at 92% -10%,rgba(58,154,217,.3),transparent 45%),#05070a}
.lines{position:absolute;inset:0;opacity:.5}
.dots i{position:absolute;border-radius:50%;background:radial-gradient(circle,#fff 0%,#89cff0 50%,rgba(58,154,217,0) 100%);box-shadow:0 0 12px 2px rgba(137,207,240,.55)}
.c{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:46px}
.mark{filter:drop-shadow(0 25px 50px rgba(58,154,217,.55))}
.w{display:flex;flex-direction:column}
.a{font-family:Bebas;font-size:212px;line-height:.78;letter-spacing:.03em;color:#fff;text-shadow:0 8px 40px rgba(58,154,217,.45)}
.b{margin-top:22px;font-weight:800;font-size:34px;letter-spacing:.62em;color:#4fb3f0;padding-left:6px}
.t{position:absolute;left:0;right:0;bottom:44px;text-align:center;color:rgba(255,255,255,.62);font-size:24px;font-weight:600;letter-spacing:.14em;text-transform:uppercase}
.t b{color:#89cff0;font-weight:800}
</style></head><body><div class="wrap">
<svg class="lines" viewBox="0 0 1200 630" preserveAspectRatio="none">${Array.from({ length: 8 }, (_, i) => {
  const y = 560 + i * 26;
  return `<path d="M-20 ${y} C 360 ${y + 6}, 700 ${y - 60 - i * 6}, 960 ${y - 220 - i * 6} S 1180 ${y - 470}, 1240 ${y - 560}" fill="none" stroke="#3a9ad9" stroke-opacity="${0.12 + i * 0.02}" stroke-width="1.4"/>`;
}).join("")}</svg>
<div class="dots">${dots}</div>
<div class="c"><div class="mark">${mark}</div><div class="w"><div class="a">ASCEND</div><div class="b">COACHING</div></div></div>
<div class="t">1:1 Online Coaching <b>·</b> ascendcoaching.pro</div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(html);
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(root, "public/og.png") });
  await b.close();
})();
