// 由 index.html 的 products 產生每件商品的獨立頁面 p/<code>.html，並更新 sitemap.xml
// 用法：node tools/build_pages.js
const fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
const BASE='https://dailyselect.github.io/casual-select/';
const GA='G-JE8Q86BKDQ';
const s=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const a=s.indexOf('const products = ['),b=s.indexOf('\n];',a)+3;
const products=eval(s.slice(a,b-1).replace('const products =','(')+')');
products.splice(0,products.length,...products.filter(p=>!p.jp));
const esc=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>'NT$ '+Number(n).toLocaleString('en-US');
const brandOf=p=>p.brand||'Casual Select 開久';
const imgs=(p,abs)=>{const n=p.n||1;return Array.from({length:n},(_,i)=>p.imgs?`https://down-tw.img.susercontent.com/file/${p.imgs[i]}${abs?'':'@resize_w900_nl.webp'}`:`${abs?BASE:'../'}img/${p.code}${i?'-'+(i+1):''}.jpg`)};
const slug=c=>encodeURIComponent(c);
fs.mkdirSync(path.join(ROOT,'p'),{recursive:true});
for(const f of fs.readdirSync(path.join(ROOT,'p'))) if(f.endsWith('.html')) fs.unlinkSync(path.join(ROOT,'p',f));
for(const p of products){
  const url=`${BASE}p/${slug(p.code)}.html`, title=`${p.name}｜${brandOf(p)}｜日常選物所`;
  const desc=`${brandOf(p)} ${p.name}：${p.desc} 蝦皮售價 ${fmt(p.price)}${p.sold?`，已售出 ${p.sold}`:''}。`;
  const rel=products.filter(q=>q.code!==p.code&&brandOf(q)===brandOf(p)).slice(0,4);
  const ld={"@context":"https://schema.org","@type":"Product",name:p.name,image:imgs(p,true),description:p.desc,sku:p.code,category:p.cat,brand:{"@type":"Brand",name:brandOf(p)},offers:{"@type":"Offer",price:String(p.price),priceCurrency:"TWD",availability:"https://schema.org/InStock",url:p.link}};
  const html=`<!doctype html>
<html lang="zh-Hant-TW"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="product"><meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(p.name)}｜${esc(brandOf(p))}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:image" content="${imgs(p,true)[0]}">
<meta property="og:site_name" content="日常選物所 The Daily Collection"><meta property="og:locale" content="zh_TW">
<meta name="twitter:card" content="summary_large_image">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
(function(){try{var q=new URLSearchParams(location.search).get('me');if(q==='1')localStorage.setItem('ds_internal','1');if(q==='0')localStorage.removeItem('ds_internal');if(localStorage.getItem('ds_internal')==='1'){window['ga-disable-${GA}']=true;}}catch(e){}})();
gtag('js',new Date());gtag('config','${GA}');</script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{--ink:#1b1c1d;--muted:#6a6b6c;--line:#e4e4e2;--accent:#8a7a63;--sale:#b23a22;--ph:#f3f3f2;--mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--ink);font-family:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;font-size:15px;line-height:1.7}
a{color:inherit}
header{display:flex;justify-content:space-between;align-items:center;max-width:1180px;margin:0 auto;padding:18px max(16px,env(safe-area-inset-left,0px))}
header a{text-decoration:none;font-weight:900;letter-spacing:.06em}
header .back{font-family:var(--mono);font-size:12.5px;font-weight:400;color:var(--muted);letter-spacing:.08em}
main{max-width:1180px;margin:0 auto;padding:8px 16px 72px;display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:48px}
.gal{display:grid;gap:10px}
.gal .main{aspect-ratio:1/1;background:var(--ph);overflow:hidden}
.gal .main img{width:100%;height:100%;object-fit:cover;display:block}
.thumbs{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.thumbs button{padding:0;border:1.5px solid transparent;background:var(--ph);aspect-ratio:1/1;cursor:pointer;overflow:hidden}
.thumbs button[aria-current="true"]{border-color:var(--ink)}
.thumbs img{width:100%;height:100%;object-fit:cover;display:block}
.meta{font-family:var(--mono);font-size:12px;letter-spacing:.14em;color:var(--muted);text-transform:uppercase}
h1{font-size:clamp(24px,3.4vw,34px);line-height:1.3;margin:10px 0 18px;font-weight:900}
.price{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap}
.price .now{font-size:28px;font-weight:700}
.price s{color:var(--muted)}
.price .off{color:var(--sale);font-family:var(--mono);font-size:13px}
.sold{color:var(--muted);font-size:13px;margin-top:4px}
.desc{margin:24px 0;padding:20px 0;border-block:1px solid var(--line);font-size:16px;line-height:1.9}
.buy{display:flex;align-items:center;justify-content:center;gap:10px;background:var(--ink);color:#fff;text-decoration:none;font-weight:700;padding:16px 20px;font-size:16px}
.buy:hover{opacity:.9}
.fine{font-size:12.5px;color:var(--muted);margin-top:10px}
.rel{max-width:1180px;margin:0 auto;padding:0 16px 80px}
.rel h2{font-size:15px;font-family:var(--mono);letter-spacing:.14em;color:var(--muted);font-weight:500;border-top:1px solid var(--ink);padding-top:18px}
.rel ul{list-style:none;padding:0;margin:20px 0 0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
.rel a{text-decoration:none}
.rel img{width:100%;aspect-ratio:1/1;object-fit:cover;background:var(--ph);display:block}
.rel .n{font-size:14px;margin-top:8px;line-height:1.4}
.rel .p{font-size:13px;color:var(--muted)}
@media (max-width:760px){main{grid-template-columns:1fr;gap:24px}.rel ul{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style></head><body>
<header><a href="../">日常選物所</a><a class="back" href="../">← 回到所有單品</a></header>
<main>
  <div class="gal">
    <div class="main"><img id="mainimg" src="${esc(imgs(p)[0])}" alt="${esc(p.name)}"></div>
    ${imgs(p).length>1?`<div class="thumbs">${imgs(p).map((u,i)=>`<button type="button" data-src="${esc(u)}" aria-current="${i===0}" aria-label="第 ${i+1} 張"><img src="${esc(u)}" alt="" loading="lazy"></button>`).join('')}</div>`:''}
  </div>
  <div>
    <div class="meta">${esc(brandOf(p))} · ${esc(p.cat)} · ${esc(p.code)}</div>
    <h1>${esc(p.name)}</h1>
    <div class="price"><span class="now">${fmt(p.price)}</span>${p.orig?`<s>${fmt(p.orig)}</s>`:''}${p.off?`<span class="off">${esc(p.off)}</span>`:''}</div>
    ${p.sold?`<div class="sold">蝦皮已售出 ${esc(p.sold)}</div>`:''}
    <p class="desc">${esc(p.desc)}</p>
    <a class="buy" href="${esc(p.link)}" target="_blank" rel="sponsored noopener">購買</a>
    <p class="fine">價格與銷量以蝦皮頁面為準。本頁連結為蝦皮分潤連結，透過連結購買不會讓你多付錢。</p>
  </div>
</main>
${rel.length?`<section class="rel"><h2>同品牌其他單品</h2><ul>${rel.map(q=>`<li><a href="${slug(q.code)}.html"><img src="${esc(imgs(q)[0])}" alt="${esc(q.name)}" loading="lazy"><div class="n">${esc(q.name)}</div><div class="p">${fmt(q.price)}</div></a></li>`).join('')}</ul></section>`:''}
<script>
document.querySelectorAll('.thumbs button').forEach(b=>b.onclick=()=>{document.getElementById('mainimg').src=b.dataset.src;document.querySelectorAll('.thumbs button').forEach(x=>x.setAttribute('aria-current',x===b))});
document.addEventListener('click',e=>{const a=e.target.closest('a[rel~="sponsored"]');if(!a||typeof gtag!=='function')return;gtag('event','shopee_click',{item_code:${JSON.stringify(p.code)},item_name:${JSON.stringify(p.name)},area:'product_page',tab:'',link_type:'buy_button',transport_type:'beacon'})});
</script>
</body></html>
`;
  fs.writeFileSync(path.join(ROOT,'p',p.code+'.html'),html);
}
const today=new Date().toISOString().slice(0,10);
const urls=[BASE,...products.map(p=>`${BASE}p/${slug(p.code)}.html`)];
fs.writeFileSync(path.join(ROOT,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u,i)=>`  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>${i?'weekly':'daily'}</changefreq><priority>${i?'0.8':'1.0'}</priority></url>`).join('\n')}\n</urlset>\n`);
console.log('pages',products.length);
