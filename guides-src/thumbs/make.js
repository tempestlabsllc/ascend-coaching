// Renders guide thumbnails (1200x675) to /public/guides with Playwright.
// Run: node guides-src/thumbs/make.js
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..", "..");
const img = (f) => "data:image/jpeg;base64," + fs.readFileSync(path.join(root, "public/results", f)).toString("base64");

const vial = `<svg viewBox="0 0 200 260" width="300"><defs><linearGradient id="l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#89cff0"/><stop offset="1" stop-color="#3a9ad9"/></linearGradient></defs>
<rect x="62" y="10" width="76" height="34" rx="6" fill="#16181d"/><rect x="70" y="44" width="60" height="16" fill="#cfd8de"/>
<rect x="50" y="60" width="100" height="180" rx="18" fill="#fff" stroke="#16181d" stroke-width="6"/>
<rect x="56" y="130" width="88" height="104" rx="13" fill="url(#l)"/><rect x="66" y="80" width="12" height="130" rx="6" fill="#fff" opacity=".7"/>
<g fill="#16181d"><rect x="132" y="95" width="18" height="4"/><rect x="132" y="125" width="18" height="4"/><rect x="132" y="155" width="18" height="4"/></g></svg>`;
const chain = `<div class="chain">${["Gly","Ala","Leu","Pro","Lys"].map((a,i)=>`<span class="${i%2?'alt':''}">${a}</span>`).join("<i></i>")}</div>`;
const bars = (pairs) => `<div class="bars">${pairs.map(([l,h,c])=>`<div><b style="height:${h}%;background:${c}"></b><span>${l}</span></div>`).join("")}</div>`;
const ring = `<svg viewBox="0 0 200 200" width="300"><circle cx="100" cy="100" r="80" fill="none" stroke="#e6f4fc" stroke-width="22"/><circle cx="100" cy="100" r="80" fill="none" stroke="#3a9ad9" stroke-width="22" stroke-linecap="round" stroke-dasharray="503" stroke-dashoffset="125" transform="rotate(-90 100 100)"/><text x="100" y="108" text-anchor="middle" font-size="58" font-weight="900" fill="#16181d" font-family="Helvetica">90</text><text x="100" y="140" text-anchor="middle" font-size="18" font-weight="700" fill="#2378b5" font-family="Helvetica" letter-spacing="3">DAYS</text></svg>`;
const photo = (f, pos = "center 40%", size = "cover") => `<div class="photo" style="background-image:url(${img(f)});background-position:${pos};background-size:${size}"></div>`;
const pair = (a, b, la, lb) => `<div class="pair"><div class="photo" style="background-image:url(${img(a)})"><em>${la}</em></div><div class="photo" style="background-image:url(${img(b)})"><em class="hi">${lb}</em></div></div>`;

const thumbs = [
  { id: "starting-peps", tag: "Free guide", title: "Starting <span>Peptides</span>", sub: "What they are, what they do & what the science says", art: `<div class="art">${vial}${chain}</div>` },
  { id: "personal-split", tag: "My exact program", title: "My Training <span>Split</span>", sub: "Every day, exercise, set & rep I train with", art: photo("coach-lean.jpg", "center 55%") },
  { id: "personal-protocol", tag: "My system", title: "My Personal <span>Protocol</span>", sub: "The day-to-day system behind my physique", art: photo("coach-heavy-2.jpg", "56% 40%", "190%") },
  { id: "skinny-fat-fix", tag: "Lose the gut · build muscle", title: "The Skinny <span>Fat Fix</span>", sub: "The roadmap I used to fill out my frame", art: `<div class="art"><div class="groups"><div>${bars([["Before",80,"#c8d3da"],["After",38,"#c8d3da"]])}<h5>Fat ↓</h5></div><div>${bars([["Before",42,"#89cff0"],["After",88,"#3a9ad9"]])}<h5>Muscle ↑</h5></div></div><p class="arrow">Soft → Strong</p></div>` },
  { id: "recomp-blueprint", tag: "Build muscle · burn fat", title: "The Recomp <span>Blueprint</span>", sub: "Get leaner and stronger at the same time", art: pair("coach-heavy-1.jpg", "coach-lean.jpg", "180 lbs", "147 lbs") },
  { id: "abs-blueprint", tag: "Visible six-pack", title: "Abs <span>Unlocked</span>", sub: "The body fat, training & diet that reveal your abs", art: photo("coach-lean.jpg", "50% 50%", "260%") },
  { id: "first-90-days", tag: "For beginners", title: "Your First <span>90 Days</span>", sub: "From zero to results: what to lift, eat & do", art: `<div class="art">${ring}</div>` },
];

const css = `*{box-sizing:border-box;margin:0}body{width:1200px;height:675px;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;color:#16181d;overflow:hidden}
.t{position:relative;width:1200px;height:675px;background:linear-gradient(135deg,#ffffff 0%,#f1f9fe 55%,#d8eefb 100%);display:flex;align-items:center;padding:0 64px;gap:48px;overflow:hidden}
.t:before{content:"";position:absolute;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(137,207,240,.55),rgba(137,207,240,0) 65%);right:-180px;top:-220px}
.t:after{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(58,154,217,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(58,154,217,.07) 1px,transparent 1px);background-size:48px 48px;-webkit-mask-image:radial-gradient(ellipse at 30% 50%,#000 20%,transparent 70%)}
.txt{position:relative;z-index:1;flex:1.15}.brand{font-weight:800;color:#3a9ad9;font-size:22px;letter-spacing:.02em}
.tag{display:inline-block;margin-top:26px;background:#3a9ad9;color:#fff;font-weight:800;text-transform:uppercase;letter-spacing:.14em;font-size:17px;padding:9px 18px;border-radius:999px}
h1{margin-top:22px;font-size:84px;line-height:.95;font-weight:900;text-transform:uppercase;letter-spacing:-.02em}h1 span{color:#3a9ad9;display:block}
.sub{margin-top:22px;font-size:25px;color:#4b5563;max-width:520px;line-height:1.3}
.side{position:relative;z-index:1;flex:.85;height:560px;display:flex;align-items:center;justify-content:center}
.photo{width:100%;height:100%;border-radius:28px;background-size:cover;box-shadow:0 30px 70px -25px rgba(35,120,181,.6);border:6px solid #fff;position:relative}
.pair{display:flex;gap:12px;width:100%;height:100%}.pair .photo{flex:1}
.photo em{position:absolute;left:12px;bottom:12px;font-style:normal;font-weight:800;font-size:20px;background:rgba(22,24,29,.75);color:#fff;padding:6px 14px;border-radius:999px}.photo em.hi{background:#3a9ad9}
.art{width:100%;height:100%;border-radius:28px;background:#fff;box-shadow:0 30px 70px -25px rgba(35,120,181,.45);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px}
.chain{display:flex;align-items:center}.chain span{width:52px;height:52px;border-radius:50%;background:#3a9ad9;color:#fff;font-weight:800;font-size:15px;display:flex;align-items:center;justify-content:center}.chain span.alt{background:#89cff0}.chain i{width:14px;height:4px;background:#16181d}
.bars{display:flex;align-items:flex-end;gap:14px;height:280px}.bars div{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;width:64px}.bars b{width:100%;border-radius:12px 12px 4px 4px;display:block}.bars span{margin-top:10px;font-weight:800;font-size:16px;color:#4b5563;text-transform:uppercase}
.groups{display:flex;gap:40px}.groups h5{text-align:center;font-size:26px;font-weight:900;margin-top:8px}.bars span{font-size:13px}.arrow{font-size:30px;font-weight:900;color:#2378b5}`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 675 } });
  for (const t of thumbs) {
    await p.setContent(`<!doctype html><html><head><style>${css}</style></head><body><div class="t"><div class="txt"><div class="brand">Ascend Coaching</div><div class="tag">${t.tag}</div><h1>${t.title}</h1><p class="sub">${t.sub}</p></div><div class="side">${t.art}</div></div></body></html>`);
    await p.screenshot({ path: path.join(root, "public/guides", `${t.id}.jpg`), type: "jpeg", quality: 85 });
  }
  await b.close();
})();
