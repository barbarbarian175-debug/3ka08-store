/* ---------- DATA (dipisah dari UI) ---------- */
/* Gambar produk & model disimpan lokal di folder assets/ (sebelumnya dari Pinterest). */
const PRODUCT_IMG = ["assets/product-01.jpg", "assets/product-02.jpg", "assets/product-03.jpg", "assets/product-04.jpg", "assets/product-05.jpg", "assets/product-06.jpg", "assets/product-07.jpg", "assets/product-08.jpg", "assets/product-09.jpg", "assets/product-10.jpg", "assets/product-11.jpg", "assets/product-12.jpg", "assets/product-13.jpg", "assets/product-14.jpg", "assets/product-15.jpg", "assets/product-16.jpg"];
const MODEL_IMG = ["assets/model-01.jpg", "assets/model-02.jpg", "assets/model-03.jpg", "assets/model-04.jpg", "assets/model-05.jpg", "assets/model-06.jpg", "assets/model-07.jpg", "assets/model-08.jpg", "assets/model-09.jpg", "assets/model-10.jpg", "assets/model-11.jpg", "assets/model-12.jpg", "assets/model-13.jpg"];

/* Batch baru (16 foto) - menunggu dipilah: mana model, mana baju */
const NEW_BATCH = ["assets/product-17.jpg", "assets/product-18.jpg", "assets/model-14.jpg", "assets/model-15.jpg", "assets/model-16.jpg", "assets/model-17.jpg", "assets/product-19.jpg", "assets/product-20.jpg", "assets/product-21.jpg", "assets/product-22.jpg", "assets/product-23.jpg", "assets/product-24.jpg", "assets/product-25.jpg", "assets/model-18.jpg", "assets/model-19.jpg", "assets/model-20.jpg"];
const NB_PRODUCT = [0, 1, 6, 7, 8, 9, 10, 11, 12].map(i => NEW_BATCH[i]);   /* baju + topi */
const NB_MODEL = [2, 3, 4, 5, 13, 14, 15].map(i => NEW_BATCH[i]);          /* model manusia */
const NB_PRODUCT2 = ["assets/product-26.jpg", "assets/product-27.jpg", "assets/product-28.jpg", "assets/product-29.jpg", "assets/product-30.jpg", "assets/product-31.jpg", "assets/product-32.jpg", "assets/product-33.jpg", "assets/product-34.jpg", "assets/product-35.jpg", "assets/product-36.jpg", "assets/product-37.jpg"];   /* batch 3: baju */
const PRODUCT_ALL = [...PRODUCT_IMG, ...NB_PRODUCT, ...NB_PRODUCT2];
const PRICES = [689000, 329000, 759000, 1290000, 549000, 619000, 249000, 479000, 599000, 399000, 849000, 459000, 729000, 359000, 949000, 519000];
const TAGS = { 0: "BEST SELLER", 1: "NEW", 3: "NEW", 4: "BEST SELLER", 6: "NEW", 9: "NEW", 12: "BEST SELLER" };
const SWATCHES = [["#111", "#c9c4b8"], ["#e8e3d6", "#111"], ["#2b2b2b", "#8a8a86"], ["#8a8a86"], ["#d9d4c7", "#111"], ["#4a4a44", "#111"]];
/* Nama produk asli (37 produk, urut sesuai PRODUCT_ALL).
   Index genap = men, ganjil = women, mengikuti cat di bawah. */
const NAMES = [
  "Kemeja Linen Hitam", "Blus Satin Putih", "Kaos Heavyweight Abu", "Kaos Oversize Putih",
  "Jaket Bomber Hitam", "Jaket Denim Abu", "Celana Chino Hitam", "Rok Plisket Hitam",
  "Hoodie Oversize Abu", "Sweater Rajut Putih", "Kemeja Flanel Hitam", "Dress Midi Hitam",
  "Sweater Rajut Abu", "Blazer Monokrom Hitam", "Celana Denim Hitam", "Celana Kulot Putih",
  "Jaket Kulit Hitam", "Coat Wol Abu", "Kaos Kerah Hitam", "Atasan Rajut Putih",
  "Celana Kargo Hitam", "Rok Denim Abu", "Topi Baseball Hitam", "Syal Rajut Abu",
  "Jaket Parka Hitam", "Kemeja Oxford Putih", "Kaos Lengan Panjang Abu", "Dress Rajut Hitam",
  "Jaket Hoodie Hitam", "Blus Linen Abu", "Celana Jogger Hitam", "Rok A-Line Putih",
  "Sweater Turtle Neck Abu", "Jaket Kulit Putih", "Kemeja Denim Hitam", "Kaos Crop Putih",
  "Celana Formal Abu"
];
/* Satu produk per link foto (37 produk). Ganti name / cat / price di sini sesuai baju aslinya.
   ID 23-24 = aksesoris (Topi, Syal). SALE_IDS = produk diskon, harga coret = harga awal. */
const SALE_IDS = [3, 7, 12, 16, 21, 26, 31, 35];
let PRODUCTS = PRODUCT_ALL.map((img, i) => {
  const id = i + 1, price = PRICES[i % PRICES.length], sale = SALE_IDS.includes(id);
  return {
  id,
  name: NAMES[i] || `Essential ${String(id).padStart(2, "0")}`,
  price,
  oldPrice: sale ? Math.round(price * 1.25 / 1000) * 1000 : null,
  cat: (id === 23 || id === 24) ? "acc" : (i % 2 === 0 ? "men" : "women"),
  tag: sale ? "SALE" : (TAGS[i % 16 === i ? i : -1] || (i > 15 && i % 5 === 0 ? "NEW" : "")),
  colors: SWATCHES[i % SWATCHES.length],
  img,
  alt: null,
  sizes: (id === 23 || id === 24) ? ["One Size"] : ["S", "M", "L", "XL"],
  stock: 10 + (id % 7)
  };
});

const CATS = [["Men", 1], ["Women", 2], ["Accessories", 3], ["New Collection", 4]];
const MEGA = {
  men: [["Clothing", "Shirts", "T-Shirts", "Outerwear", "Trousers"], ["Featured", "New Arrivals", "Best Sellers", "Sale"]],
  women: [["Clothing", "Tops", "Knitwear", "Coats", "Trousers"], ["Featured", "New Arrivals", "Best Sellers", "Sale"]],
  collection: [["Seasonal", "Autumn / Winter 26", "Monochrome Edit"], ["Campaign", "Defined by Simplicity"]]
};

/* ---------- HELPERS ---------- */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rp = n => "Rp " + n.toLocaleString("id-ID");
const IC = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.7 0-3 .5-4.5 2-1.5-1.5-2.8-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  truck: '<path d="M14 18V6H2v12h3m9 0H9m5 0h1m0-9h4l3 3v6h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>',
  tiktok: '<path d="M9 12a4 4 0 1 0 4 4V4c.6 2.5 2.4 4.3 5 4.6"/>',
  pinterest: '<circle cx="12" cy="12" r="10"/><path d="M9.5 20c.8-2.4 1.4-5.4 1.9-7.5"/><path d="M11 12.5a3 3 0 1 1 4.2 2.7c-1.1.7-2.7.3-3.2-.9"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
};
const icon = n => `<svg viewBox="0 0 24 24">${IC[n]}</svg>`;
const hydrateIcons = (root = document) => $$("[data-ic]", root).forEach(el => { if (!el.firstElementChild) el.innerHTML = icon(el.dataset.ic); });
const imgTag = (src, alt = "", lazy = true) => `<img src="${src}" alt="${alt}" ${lazy ? 'loading="lazy"' : ""} onerror="this.removeAttribute('src');this.style.opacity=.4">`;
let toastT; const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200); };

/* ---------- STATE ---------- */
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
let cart = load("sl_cart", []), wish = load("sl_wish", []), filter = "all", sort = "featured", priceFilter = "all";
const save = () => { try { localStorage.setItem("sl_cart", JSON.stringify(cart)); localStorage.setItem("sl_wish", JSON.stringify(wish)); } catch {} };

/* ---------- API (back end PHP + MySQL, jalan di XAMPP) ----------
   Kalau situs dibuka dari localhost (Live Server / file), frontend mencoba
   ngobrol ke API di http://localhost/berta-api. Kalau API tidak terjangkau
   (mis. situs GitHub Pages, atau XAMPP belum jalan), semua fitur tetap jalan
   dengan data lokal + localStorage seperti sebelumnya. */
const API_BASE = (() => {
  const h = location.hostname;
  return (h === "localhost" || h === "127.0.0.1" || h === "") ? "http://localhost/berta-api" : null;
})();
let apiOnline = false;
const apiGet = async path => {
  if (!API_BASE) throw new Error("API tidak aktif di host ini");
  const r = await fetch(API_BASE + path);
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.ok === false) throw new Error(d.error || ("HTTP " + r.status));
  return d;
};
const apiPost = async (path, data) => {
  if (!API_BASE) throw new Error("API tidak aktif di host ini");
  const r = await fetch(API_BASE + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.ok === false) throw new Error(d.error || ("HTTP " + r.status));
  return d;
};
function setApiStatus() {
  const el = $("#apiStatus");
  if (el) el.textContent = apiOnline ? "● Terhubung ke database MySQL" : "● Mode offline — data tersimpan di browser ini";
}
async function apiLoadProducts() {
  try {
    const d = await apiGet("/products.php");
    if (Array.isArray(d.products) && d.products.length) {
      PRODUCTS = d.products.map(p => ({ ...p, colors: SWATCHES[(p.id - 1) % SWATCHES.length], alt: null }));
      apiOnline = true; setApiStatus(); renderGrid();
    }
  } catch { apiOnline = false; setApiStatus(); }
}

/* ---------- STATIC IMAGES ---------- */
$("#heroImg").src = MODEL_IMG[0];
$("#featImg").src = MODEL_IMG[5]; [6,8,9,10,11,12].forEach((n,i)=>{const el=$("#m"+i);el.src=MODEL_IMG[n];el.onerror=()=>el.removeAttribute("src");});$("#editImg2").src = MODEL_IMG[7];
$("#catGrid").innerHTML = CATS.map(([n, i]) => `<a class="cat rv" href="#products" data-cat="${n}">${imgTag(MODEL_IMG[i], n)}<div>${n.toUpperCase()}${icon("arrow")}</div></a>`).join("");
$("#mega").innerHTML = Object.entries(MEGA).map(([k, cols]) => `<div class="mc" data-k="${k}" hidden style="display:flex;gap:80px">${cols.map(c => `<div><h5>${c[0]}</h5>${c.slice(1).map(l => { const f = l === "New Arrivals" ? "new" : l === "Sale" ? "sale" : l === "Best Sellers" ? "all" : ""; return `<a href="#products"${f ? ` data-f="${f}"` : ""}>${l}</a>`; }).join("")}</div>`).join("")}</div>`).join("");

/* ---------- PRODUCTS ---------- */
function renderGrid() {
  let list = PRODUCTS.filter(p => filter === "all" ? true : filter === "new" ? p.tag === "NEW" : filter === "sale" ? p.tag === "SALE" : p.cat === filter);
  if (priceFilter === "lt500") list = list.filter(p => p.price < 500000);
  else if (priceFilter === "500-1000") list = list.filter(p => p.price >= 500000 && p.price <= 1000000);
  else if (priceFilter === "gt1000") list = list.filter(p => p.price > 1000000);
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  else if (sort === "name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "id"));
  else if (sort === "newest") list = [...list].sort((a, b) => ((b.tag === "NEW") - (a.tag === "NEW")) || b.id - a.id);
  const titles = { all: "BEST SELLERS", men: "MEN", women: "WOMEN", acc: "ACCESSORIES", new: "NEW ARRIVALS", sale: "SALE" };
  const h2 = document.querySelector(".prod-h h2");
  if (h2) h2.textContent = titles[filter] || "BEST SELLERS";
  $("#grid").innerHTML = list.map(p => `
    <article class="card" data-id="${p.id}">
      <div class="pimg">${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
        <button class="wish ${wish.includes(p.id) ? "on" : ""}" data-wish="${p.id}" aria-label="Wishlist">${icon("heart")}</button>
        ${imgTag(p.img, p.name)}${p.alt ? `<span class="alt">${imgTag(p.alt, "")}</span>` : ""}
        <button class="qvb" data-qv="${p.id}">Quick View</button></div>
      <div class="pinfo"><div>${p.name}<div class="sw">${p.colors.map(c => `<i style="background:${c}"></i>`).join("")}</div></div><span>${p.oldPrice ? `<s>${rp(p.oldPrice)}</s> ` : ""}${rp(p.price)}</span>${p.stock === 0 ? `<span class="stock out">Habis</span>` : (p.stock ?? 99) <= 5 ? `<span class="stock low">Sisa ${p.stock}</span>` : ""}</div>
    </article>`).join("");
  $$(".pimg .alt").forEach(a => { a.style.cssText = "position:absolute;inset:0;opacity:0;transition:opacity .7s"; });
  $$(".card").forEach((c, i) => setTimeout(() => c.classList.add("show"), 80 + i * 90));
}
const CSS_ALT = document.createElement("style");
CSS_ALT.textContent = ".card:hover .pimg>.alt{opacity:1!important}";
document.head.append(CSS_ALT);

/* ---------- COUNTS ---------- */
function sync() {
  $("#cartN").textContent = cart.reduce((a, c) => a + c.qty, 0);
  $("#wishN").textContent = wish.length;
  $$("[data-wish]").forEach(b => b.classList.toggle("on", wish.includes(+b.dataset.wish)));
  save();
}
function toggleWish(id) { wish = wish.includes(id) ? wish.filter(w => w !== id) : [...wish, id]; sync(); }
function shareProduct(id) {
  const p = PRODUCTS.find(x => x.id === id); if (!p) return;
  const text = `Lihat ${p.name} — ${rp(p.price)} di 3KA08 (Defined by Simplicity).`;
  window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
  toast("Membuka WhatsApp…");
}
function addCart(id, size) {
  const p = PRODUCTS.find(x => x.id === id), s = size || p.sizes[1] || p.sizes[0];
  if ((p.stock ?? 1) <= 0) return toast(`Maaf, ${p.name} sedang habis.`);
  const ex = cart.find(c => c.id === id && c.size === s);
  ex ? ex.qty++ : cart.push({ id, size: s, qty: 1 });
  sync(); toast(`${p.name} ditambahkan`); openDrawer("cart");
}

/* ---------- DRAWER (cart) ---------- */
function openDrawer(mode) {
  if (mode === "wish") return openWishlist();
  $("#drT").textContent = "Bag";
  const body = $("#drB"), foot = $("#drF");
  body.innerHTML = cart.length ? cart.map((c, i) => { const p = PRODUCTS.find(x => x.id === c.id); return `
    <div class="li"><div class="pimg">${imgTag(p.img)}</div><div><h4>${p.name}</h4><span style="color:#8a8a86">Size ${c.size} · ${rp(p.price)}</span><br>
    <div class="qty"><button data-q="${i}:-1">−</button><span>${c.qty}</span><button data-q="${i}:1">+</button></div><button class="rm" data-rm="${i}">Remove</button></div></div>`; }).join("") : '<p class="empty">Bag kamu masih kosong.</p>';
  const total = cart.reduce((a, c) => a + PRODUCTS.find(x => x.id === c.id).price * c.qty, 0);
  foot.innerHTML = cart.length ? `<div class="tot"><span>Subtotal</span><b>${rp(total)}</b></div><button class="btn" id="checkout">Checkout</button>` : "";
  $("#drawer").dataset.mode = mode;
  $("#drawer").classList.add("open"); $("#scrim").classList.add("open");
}
const closeDrawer = () => { $("#drawer").classList.remove("open"); $("#scrim").classList.remove("open"); };

/* ---------- WISHLIST PAGE ---------- */
const wishTotal = () => wish.reduce((a, id) => a + (PRODUCTS.find(x => x.id === id)?.price || 0), 0);
function updateWishChrome() {
  $("#wpCount").textContent = wish.length ? `(${wish.length})` : "";
  $("#wpEmpty").hidden = wish.length > 0;
  $("#wpActions").style.display = wish.length ? "" : "none";
  const t = $("#wpGrid .wp-total b"); if (t) t.textContent = rp(wishTotal());
  const ts = $("#wpGrid .wp-total span"); if (ts) ts.textContent = `Total ${wish.length} item`;
}
function renderWish() {
  $("#wpGrid").innerHTML = wish.map((id, i) => { const p = PRODUCTS.find(x => x.id === id); if (!p) return ""; return `
    <article class="wp-card" data-wcard="${p.id}" style="--d:${i * 70}ms">
      <div class="pimg" data-qv="${p.id}"><button class="wp-x" data-wpx="${p.id}" aria-label="Hapus ${p.name} dari wishlist">${icon("heart")}</button>${imgTag(p.img, p.name)}</div>
      <div class="wp-info"><h4>${p.name}</h4><span>${p.oldPrice ? `<s>${rp(p.oldPrice)}</s> ` : ""}${rp(p.price)}</span>
      <div class="sw">${p.colors.map(c => `<i style="background:${c}"></i>`).join("")}</div>
      <div class="wp-btns"><button class="btn" data-wadd="${p.id}">Add to Bag</button><button class="btn ghost" data-qv="${p.id}">Quick View</button></div>
      <button class="rm" data-share="${p.id}" style="margin:12px 0 0">Share ke WhatsApp</button></div>
    </article>`; }).join("") + (wish.length ? `<div class="wp-total" style="grid-column:1/-1"><span>Total ${wish.length} item</span><b>${rp(wishTotal())}</b></div>` : "");
  updateWishChrome();
}
function openWishlist() { renderWish(); const pg = $("#wishPage"); pg.classList.add("open"); pg.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
function closeWishlist() { const pg = $("#wishPage"); pg.classList.remove("open"); pg.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
function floatHeart(x, y) { const s = document.createElement("span"); s.className = "fh-float"; s.textContent = "♥"; s.style.left = (x - 9) + "px"; s.style.top = (y - 9) + "px"; document.body.append(s); setTimeout(() => s.remove(), 950); }

/* ---------- CHECKOUT ---------- */
const FREE_SHIP_MIN = 750000, SHIP_COST = 15000;
const PROMOS = { "3KA08": 0.10 }; /* kode promo: diskon 10% */
let promo = null;
const calcTotals = () => {
  const subtotal = cart.reduce((a, c) => a + PRODUCTS.find(x => x.id === c.id).price * c.qty, 0);
  const discount = promo ? Math.round(subtotal * PROMOS[promo]) : 0;
  const afterDisc = subtotal - discount;
  const shipping = cart.length === 0 ? 0 : (afterDisc >= FREE_SHIP_MIN ? 0 : SHIP_COST);
  return { subtotal, discount, shipping, total: afterDisc + shipping };
};
function promoRowHTML() {
  if (promo) return `<div class="tot-row disc"><span>Diskon (${promo} −10%)</span><span><b>−${rp(calcTotals().discount)}</b> <button class="promo-x" id="promoRemove" type="button" aria-label="Hapus kode promo">×</button></span></div>`;
  return `<div class="promo-box"><input id="promoInput" placeholder="Kode promo" autocomplete="off" spellcheck="false"><button class="btn" id="promoApply" type="button">Pakai</button></div>
  <div class="promo-hint">Punya kode promo? Coba <b>3KA08</b> untuk diskon 10%.</div>
  <div class="promo-msg" id="promoMsg"></div>`;
}
function updateSummary() {
  const { subtotal, shipping, total } = calcTotals();
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set("#sumSub", rp(subtotal));
  const ship = $("#sumShip"); if (ship) { ship.textContent = shipping === 0 ? "GRATIS" : rp(shipping); ship.classList.toggle("free", shipping === 0); }
  set("#sumGrand", rp(total));
  const g = $("#sumGrand"); if (g) { g.classList.remove("bump"); void g.offsetWidth; g.classList.add("bump"); }
}
function bindPromoInput() {
  const inp = $("#promoInput"); if (!inp) return;
  inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); applyPromo(); } });
}
function applyPromo() {
  const inp = $("#promoInput"); if (!inp) return;
  const code = inp.value.trim().toUpperCase();
  if (PROMOS[code]) {
    promo = code;
    $("#promoRow").innerHTML = promoRowHTML();
    updateSummary();
    toast(`Kode ${code} dipakai — diskon 10%!`);
  } else {
    const msg = $("#promoMsg"); if (msg) msg.textContent = code ? "Kode promo tidak ditemukan." : "Masukkan kode promo dulu.";
    inp.classList.remove("shake"); void inp.offsetWidth; inp.classList.add("shake");
  }
}
function removePromo() {
  promo = null;
  $("#promoRow").innerHTML = promoRowHTML();
  bindPromoInput();
  updateSummary();
}
function openCheckout() {
  if (!cart.length) return toast("Bag kamu masih kosong.");
  closeDrawer();
  const { subtotal, shipping, total } = calcTotals();
  const items = cart.map(c => { const p = PRODUCTS.find(x => x.id === c.id); return `
    <div class="li"><div class="pimg">${imgTag(p.img)}</div><div><h4 style="margin:0">${p.name}</h4><span>Size ${c.size} · ${c.qty} × ${rp(p.price)}</span></div><b>${rp(p.price * c.qty)}</b></div>`; }).join("");
  $("#coBox").innerHTML = `
  <form id="coForm" novalidate>
    <h3>Checkout</h3>
    <h4>Data Penerima</h4>
    <div class="co-field"><label>Nama Lengkap</label><input id="coName" placeholder="Nama kamu" autocomplete="name"><div class="err"></div></div>
    <div class="co-row">
      <div class="co-field"><label>No. WhatsApp</label><input id="coPhone" inputmode="tel" placeholder="08xxxxxxxxxx"><div class="err"></div></div>
      <div class="co-field"><label>Kota</label><input id="coCity" placeholder="Jakarta"><div class="err"></div></div>
    </div>
    <div class="co-field"><label>Alamat Lengkap</label><textarea id="coAddr" placeholder="Jalan, nomor rumah, RT/RW, kecamatan"></textarea><div class="err"></div></div>
    <div class="co-field"><label>Catatan (opsional)</label><input id="coNote" placeholder="Contoh: titip di satpam"></div>
    <h4>Pembayaran</h4>
    <div class="co-pay">
      <label><input type="radio" name="pay" value="COD" checked><span>COD — Bayar di Tempat<small>Siapkan uang tunai saat kurir datang.</small></span></label>
      <label><input type="radio" name="pay" value="Transfer Bank"><span>Transfer Bank<small>Detail rekening dikirim ke WhatsApp kamu.</small></span></label>
      <label><input type="radio" name="pay" value="QRIS"><span>QRIS / E-Wallet<small>Scan kode QRIS yang dikirim ke WhatsApp kamu.</small></span></label>
    </div>
    <div class="co-msg" id="coMsg"></div>
  </form>
  <div class="co-sum">
    <h4>Ringkasan Pesanan</h4>
    ${items}
    <div class="tot-row"><span>Subtotal</span><b id="sumSub">${rp(subtotal)}</b></div>
    <div id="promoRow">${promoRowHTML()}</div>
    <div class="tot-row"><span>Ongkir</span><b id="sumShip" class="${shipping === 0 ? "free" : ""}">${shipping === 0 ? "GRATIS" : rp(shipping)}</b></div>
    <div class="tot-row"><span></span><span style="font-size:11px;color:#888">${shipping === 0 ? "Gratis ongkir untuk belanja di atas Rp750.000" : "Gratis ongkir untuk belanja di atas Rp750.000"}</span></div>
    <div class="tot-row grand"><span>Total</span><b id="sumGrand">${rp(total)}</b></div>
    <button class="btn" id="coSubmit" type="button">Buat Pesanan ${icon("arrow")}</button>
  </div>`;
  $("#co").classList.add("open");
  bindPromoInput();
  $("#coForm").addEventListener("submit", e => { e.preventDefault(); submitCheckout(); });
}
function setFieldErr(id, msg) {
  const f = $("#" + id).closest(".co-field");
  f.classList.toggle("invalid", !!msg);
  f.querySelector(".err").textContent = msg || "";
  return !msg;
}
async function submitCheckout() {
  const name = $("#coName").value.trim(), phone = $("#coPhone").value.trim().replace(/[\s-]/g, ""),
        city = $("#coCity").value.trim(), addr = $("#coAddr").value.trim(),
        note = $("#coNote").value.trim(), pay = document.querySelector('input[name="pay"]:checked').value;
  let ok = true;
  ok = setFieldErr("coName", name.length < 3 ? "Isi nama lengkap kamu." : "") && ok;
  ok = setFieldErr("coPhone", !/^(\+62|62|0)8\d{7,12}$/.test(phone) ? "Isi nomor WhatsApp yang valid, contoh 081234567890." : "") && ok;
  ok = setFieldErr("coCity", city.length < 3 ? "Isi kota kamu." : "") && ok;
  ok = setFieldErr("coAddr", addr.length < 10 ? "Isi alamat lengkap, minimal 10 karakter." : "") && ok;
  if (!ok) { $("#coMsg").textContent = "Cek lagi bagian yang ditandai merah."; return; }
  let { subtotal, discount, shipping, total } = calcTotals();
  let orderId = "3KA08-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + String(Date.now()).slice(-4);
  try { /* simpan ke database lewat API; kalau gagal, tetap lanjut dengan penyimpanan lokal di bawah */
    const u = getUser();
    const res = await apiPost("/orders.php", { name, phone, city, addr, note, pay, promo: promo || null, user_email: u ? u.email : null, items: cart.map(c => ({ id: c.id, size: c.size, qty: c.qty })) });
    orderId = res.order.id; subtotal = res.order.subtotal; discount = res.order.discount; shipping = res.order.shipping; total = res.order.total;
    apiOnline = true;
  } catch (err) {
    apiOnline = false;
    if (err && /Stok/i.test(err.message || "")) { $("#coMsg").textContent = err.message; return; } /* stok habis di server: jangan simpan pesanan */
  }
  setApiStatus();
  const order = { id: orderId, date: new Date().toISOString(), name, phone, city, addr, note, pay,
    items: cart.map(c => ({ id: c.id, size: c.size, qty: c.qty })), subtotal, discount, promo: promo || null, shipping, total };
  try {
    const orders = JSON.parse(localStorage.getItem("sl_orders") || "[]");
    orders.push(order);
    localStorage.setItem("sl_orders", JSON.stringify(orders));
  } catch {}
  const usedPromo = promo, usedDiscount = discount;
  cart = []; promo = null; sync(); apiLoadProducts(); /* segarkan stok dari database */
  const payNote = pay === "COD" ? "Siapkan uang tunai sebesar " + rp(total) + " saat kurir datang."
    : pay === "Transfer Bank" ? "Detail rekening akan dikirim ke WhatsApp " + phone + "."
    : "Kode QRIS akan dikirim ke WhatsApp " + phone + ".";
  const waLines = [
    `Halo 3KA08! Saya ${name}, mau konfirmasi pesanan ${orderId}.`,
    `Total: ${rp(total)} (${pay})`,
    ...order.items.map(it => { const p = PRODUCTS.find(x => x.id === it.id); return `• ${it.qty}x ${p ? p.name : "Produk"} (${it.size}) — ${p ? rp(p.price * it.qty) : ""}`; }),
    `Kirim ke: ${city} — ${addr}`,
  ];
  const waUrl = `https://wa.me/${SELLER_WA}?text=${encodeURIComponent(waLines.join("\n"))}`;
  $("#coBox").innerHTML = `
  <div class="co-ok">
    <div class="tick">✓</div>
    <small>Pesanan Berhasil</small>
    <h3>Terima kasih, ${name.split(" ")[0]}!</h3>
    <p>Pesanan kamu sudah kami terima dan akan segera diproses. ${payNote}</p>
    <div class="ord">Nomor Pesanan<b>${orderId}</b></div>
    <p>Total yang harus dibayar: <b style="color:#000">${rp(total)}</b> · ${pay}${usedPromo ? `<br>Termasuk diskon ${usedPromo} (−${rp(usedDiscount)})` : ""}<br>Pengiriman ke ${city} — ${addr}</p>
    <a class="btn" href="${waUrl}" target="_blank" rel="noopener" style="margin-top:16px">Konfirmasi via WhatsApp ${icon("arrow")}</a>
    <p style="font-size:12px;color:#8a8a86">Klik tombol di atas supaya penjual langsung terima pesananmu di WhatsApp.</p>
    <button class="btn" data-close style="margin-top:24px">Lanjut Belanja ${icon("arrow")}</button>
  </div>`;
  hydrateIcons($("#coBox"));
  toast("Pesanan " + orderId + " berhasil dibuat");
}

/* ---------- INFO / ACCOUNT / TRACK ORDER ---------- */
/* Nomor WhatsApp penjual — GANTI dengan nomor asli toko.
   Dipakai tombol "Konfirmasi via WhatsApp" setelah checkout dan info kontak. */
const SELLER_WA = "6281234567890";
const SELLER_WA_DISPLAY = "0812-3456-7890";
const INFO_CONTENT = {
  about: ["About Us", "3KA08 adalah brand fashion minimalis dari kelas 3KA08. Kami percaya pakaian yang baik tidak perlu ramai — potongan bersih, bahan berbobot, dan warna monokrom yang gampang dipadukan lintas musim."],
  contact: ["Contact", `Hubungi kami di WhatsApp ${SELLER_WA_DISPLAY} atau email halo@3ka08.id. Jam layanan Senin–Sabtu, 09.00–18.00 WIB.`],
  support: ["Customer Service", `Ada kendala dengan pesananmu? Hubungi Customer Service di WhatsApp ${SELLER_WA_DISPLAY} atau email halo@3ka08.id. Sertakan nomor pesananmu supaya kami bisa bantu lebih cepat.`],
  shipping: ["Shipping & Returns", "Pengiriman 2–4 hari kerja, ongkir Rp15.000 dan gratis untuk belanja di atas Rp750.000. Penukaran atau pengembalian bisa dilakukan dalam 30 hari, selama produk belum dipakai dan tag masih terpasang."],
  instagram: ["Instagram", "Follow 3KA08 di Instagram: @3ka08 — lihat lookbook terbaru, behind the scenes, dan info restock di sana."],
  tiktok: ["TikTok", "Follow 3KA08 di TikTok: @3ka08 — video styling, try-on, dan koleksi terbaru."],
  pinterest: ["Pinterest", "Follow 3KA08 di Pinterest: 3KA08 — kumpulan inspirasi outfit monokrom dan moodboard koleksi kami."]
};
function openInfo(key) {
  $("#acct").classList.remove("open"); /* info modal selalu di atas: tutup dulu panel login kalau sedang terbuka */
  const [title, body] = INFO_CONTENT[key] || ["Info", "Halaman ini belum tersedia."];
  $("#infoBox").innerHTML = `<small>3KA08</small><h3>${title}</h3><p>${body}</p><button class="btn" data-close>Tutup ${icon("arrow")}</button>`;
  $("#info").classList.add("open");
}
function getUser() { try { return JSON.parse(localStorage.getItem("sl_user") || "null"); } catch { return null; } }
/* ---------- LOGIN ALA REFERENSI ---------- */
const LOGIN_SLIDES = [
  { img: 0, tag: "Autumn / Winter 26", title: "The Monochrome Edit" },
  { img: 5, tag: "Featured", title: "Editorial 26" },
  { img: 7, tag: "Lookbook", title: "Defined by Simplicity" },
  { img: 1, tag: "New Collection", title: "Women" },
  { img: 2, tag: "New Collection", title: "Men" }
];
let loginSlide = 0, loginLang = "id", loginTimer = null;
const LOGIN_I18N = {
  id: { title: "Halo, selamat datang", sub: "Masuk ke 3KA08", name: "Nama kamu", email: "nama@email.com", submit: "Masuk", google: "Masuk dengan Google", signup: "Belum punya akun?", signupLink: "Daftar", lang: "ID" },
  en: { title: "Hi, welcome back", sub: "Sign in to 3KA08", name: "Your name", email: "name@email.com", submit: "Sign in", google: "Sign in with Google", signup: "Don't have an account?", signupLink: "Sign up", lang: "EN" }
};
const GOOGLE_G = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.8-5.1L1.3 17.2C3.3 21.2 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.3 6.8C.5 8.4 0 10.1 0 12s.5 3.6 1.3 5.2l3.9-2.9z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.8 1.3 6.8l3.9 2.9c.9-2.9 3.6-5 6.8-5z"/></svg>';
function loginLeftHTML() {
  const s = LOGIN_SLIDES[loginSlide];
  return `<div class="lg-left">
    <img class="lg-img" id="lgImg" src="${MODEL_IMG[s.img]}" alt="Lookbook 3KA08">
    <div class="lg-top"><span class="lg-tag" id="lgSlideTag">${s.tag}</span>
      <div class="lg-join"><button data-focus-form>Sign Up</button><button class="pill" data-focus-form>Join Us</button></div></div>
    <div class="lg-bottom">
      <div class="lg-who"><img src="${MODEL_IMG[3]}" alt="3KA08"><div><b id="lgSlideTitle">${s.title}</b><span>3KA08 — Defined by Simplicity</span></div></div>
      <div class="lg-nav"><span class="lg-count" id="lgCount">${String(loginSlide + 1).padStart(2, "0")} / ${String(LOGIN_SLIDES.length).padStart(2, "0")}</span><button id="lgPrev" aria-label="Sebelumnya">←</button><button id="lgNext" aria-label="Berikutnya">→</button></div>
    </div>
  </div>`;
}
function loginGo(dir) {
  loginSlide = (loginSlide + dir + LOGIN_SLIDES.length) % LOGIN_SLIDES.length;
  const s = LOGIN_SLIDES[loginSlide], img = $("#lgImg");
  if (img) { img.style.opacity = 0; setTimeout(() => { img.src = MODEL_IMG[s.img]; img.style.opacity = 1; }, 300); }
  const tag = $("#lgSlideTag"), title = $("#lgSlideTitle"), count = $("#lgCount");
  if (tag) tag.textContent = s.tag;
  if (title) title.textContent = s.title;
  if (count) count.textContent = `${String(loginSlide + 1).padStart(2, "0")} / ${String(LOGIN_SLIDES.length).padStart(2, "0")}`;
}
function loginTick() {
  if (!$("#acct").classList.contains("open")) { clearInterval(loginTimer); loginTimer = null; return; }
  loginGo(1);
}
function applyLoginLang() {
  const t = LOGIN_I18N[loginLang];
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v; };
  set("#lgLang", t.lang + " ▾");
  if (getUser()) return; /* kalau sudah login, sapaan personal jangan ditimpa */
  set("#lgTitle", t.title); set("#lgSub", t.sub); set("#lgSubmit", t.submit); set("#lgGoogle span", t.google);
  const n = $("#acctName"), e = $("#acctEmail");
  if (n) n.placeholder = t.name; if (e) e.placeholder = t.email;
  const su = $("#lgSignup"); if (su) su.innerHTML = `${t.signup} <button id="lgSignupLink">${t.signupLink}</button>`;
}
function openAccount() {
  const u = getUser();
  const orders = load("sl_orders", []);
  if (u) {
    const last = orders[orders.length - 1];
    $("#acctBox").innerHTML = `<div class="login-card">${loginLeftHTML()}
    <div class="lg-right">
      <div class="lg-r-top"><span class="lg-logo">3KA08</span><button class="lg-lang" id="lgLang">ID ▾</button></div>
      <div class="lg-body"><h2 id="lgTitle">Halo, ${u.name.split(" ")[0]}!</h2><p id="lgSub">Selamat datang kembali di 3KA08.</p>
      <p style="color:#555">${u.email}<br>Kamu punya ${orders.length} pesanan dan ${wish.length} item di wishlist.</p>
      ${last ? `<p style="color:#555">Pesanan terakhir: <b>${last.id}</b> — ${rp(last.total)}</p>` : "<p style=\"color:#555\">Belum ada pesanan. Yuk mulai belanja.</p>"}
      <p class="api-status" id="apiStatus">Memeriksa koneksi database…</p>
      <button class="btn lg-submit" data-logout>Logout</button><button class="btn ghost lg-submit" data-close>Tutup</button></div>
    </div></div>`;
  } else {
    $("#acctBox").innerHTML = `<div class="login-card">${loginLeftHTML()}
    <div class="lg-right">
      <div class="lg-r-top"><span class="lg-logo">3KA08</span><button class="lg-lang" id="lgLang">ID ▾</button></div>
      <div class="lg-body"><h2 id="lgTitle">Halo, selamat datang</h2><p id="lgSub">Masuk ke 3KA08</p>
      <form id="acctForm" novalidate>
        <div class="lg-field"><input id="acctName" placeholder="Nama kamu"></div>
        <div class="lg-field"><input id="acctEmail" type="email" placeholder="nama@email.com"></div>
        <div class="co-msg" id="acctMsg"></div>
        <button class="btn lg-submit" type="submit" id="lgSubmit">Masuk</button>
      </form>
      <p class="api-status" id="apiStatus">Memeriksa koneksi database…</p>
      <div class="lg-or">atau</div>
      <button class="lg-google" id="lgGoogle">${GOOGLE_G}<span>Masuk dengan Google</span></button>
      <p class="lg-signup" id="lgSignup">Belum punya akun? <button id="lgSignupLink">Daftar</button></p>
      <div class="lg-social">
        <button data-info="instagram" aria-label="Instagram">${icon("instagram")}</button>
        <button data-info="tiktok" aria-label="TikTok">${icon("tiktok")}</button>
        <button data-info="pinterest" aria-label="Pinterest">${icon("pinterest")}</button>
      </div></div>
    </div></div>`;
    $("#acctForm").addEventListener("submit", async e => {
      e.preventDefault();
      const name = $("#acctName").value.trim(), email = $("#acctEmail").value.trim();
      if (name.length < 3) { $("#acctMsg").textContent = "Isi nama kamu."; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { $("#acctMsg").textContent = "Masukkan alamat email yang valid."; return; }
      let user = { name, email };
      try { /* simpan/ambil user dari database; kalau API mati, tetap login lokal seperti sebelumnya */
        const res = await apiPost("/auth.php", { action: "login", name, email });
        user = res.user; apiOnline = true;
      } catch { apiOnline = false; }
      setApiStatus();
      try { localStorage.setItem("sl_user", JSON.stringify(user)); } catch {}
      toast("Halo, " + name + "!");
      openAccount();
    });
  }
  $("#lgPrev").onclick = () => loginGo(-1);
  $("#lgNext").onclick = () => loginGo(1);
  $("#lgLang").onclick = () => { loginLang = loginLang === "id" ? "en" : "id"; applyLoginLang(); };
  const g = $("#lgGoogle"); if (g) g.onclick = () => toast("Login dengan Google belum tersedia — pakai nama & email di atas ya.");
  if (loginTimer) clearInterval(loginTimer);
  loginTimer = setInterval(loginTick, 5000);
  setApiStatus();
  $("#acct").classList.add("open");
}

function openTrack() {
  $("#infoBox").innerHTML = `<small>Lacak Pesanan</small><h3>Track Your Order</h3>
  <p>Masukkan nomor pesananmu, contoh 3KA08-20261111-1234. Nomor ini muncul setelah checkout berhasil.</p>
  <form id="trackForm" novalidate>
    <div class="co-field"><label>Nomor Pesanan</label><input id="trackId" placeholder="3KA08-XXXXXXXX-XXXX"></div>
    <div class="co-msg" id="trackMsg"></div>
    <button class="btn" type="submit">Lacak Pesanan ${icon("arrow")}</button>
  </form><div id="trackRes" style="margin-top:20px"></div>`;
  $("#info").classList.add("open");
  $("#trackForm").addEventListener("submit", async e => {
    e.preventDefault();
    const id = $("#trackId").value.trim().toUpperCase();
    let order = null, fromApi = false;
    try { /* cari dulu di database; kalau API mati, cari di localStorage seperti sebelumnya */
      const res = await apiGet("/orders.php?code=" + encodeURIComponent(id));
      order = res.order; fromApi = true; apiOnline = true;
    } catch { apiOnline = false; }
    if (!order) order = load("sl_orders", []).find(o => o.id.toUpperCase() === id);
    $("#trackRes").innerHTML = order
      ? `<div class="ord" style="background:#fff;border:1px solid #bbb;padding:16px"><b>${order.id}</b><br>Status: <b>${order.status || "Diproses"}</b> — estimasi tiba 2–4 hari kerja.<br>Total: ${rp(order.total)} · ${order.pay}<br>Pengiriman ke ${order.city}${fromApi ? "<br><small>Data dari database MySQL</small>" : ""}</div>`
      : `<p style="color:#c62828">Nomor pesanan tidak ditemukan. Cek lagi nomor order kamu.</p>`;
  });
}

/* ---------- QUICK VIEW / SEARCH ---------- */
let qvSize = null;
function openQV(id) {
  const p = PRODUCTS.find(x => x.id === id); qvSize = p.sizes[Math.min(1, p.sizes.length - 1)];
  $("#qvBox").innerHTML = `<div class="pimg">${imgTag(p.img, p.name, false)}</div>
  <div class="qv-i"><small>${p.cat === "acc" ? "Accessories" : p.cat}</small><h3>${p.name}</h3><b>${p.oldPrice ? `<s style="color:#8a8a86;font-weight:400">${rp(p.oldPrice)}</s> ` : ""}${rp(p.price)}</b>
  <p>${p.stock === 0 ? `<span style="color:#c62828">Stok habis.</span>` : `Stok tersedia: ${p.stock ?? "—"}`}</p>
  <p>Dibuat dari bahan berbobot dengan potongan bersih dan detail minimal. Dirancang untuk dipakai berulang lintas musim.</p>
  <div class="sizes">${p.sizes.map(s => `<button class="${s === qvSize ? "on" : ""}" data-size="${s}">${s}</button>`).join("")}</div>
  <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-qadd="${p.id}" ${p.stock === 0 ? "disabled" : ""}>${p.stock === 0 ? "Stok Habis" : `Add to bag ${icon("arrow")}`}</button><button class="btn ghost" data-wish="${p.id}">Wishlist</button><button class="btn ghost" data-share="${p.id}">Share ${icon("share")}</button></div></div>`;
  $("#qv").classList.add("open");
}
$("#q").addEventListener("input", e => {
  const v = e.target.value.trim().toLowerCase();
  const r = v ? PRODUCTS.filter(p => p.name.toLowerCase().includes(v) || p.cat.includes(v)) : [];
  $("#res").innerHTML = r.length ? r.map(p => `<a data-qv="${p.id}"><div class="pimg">${imgTag(p.img)}</div>${p.name}<br><span style="color:#8a8a86">${rp(p.price)}</span></a>`).join("") : (v ? '<p class="empty">Tidak ada hasil.</p>' : "");
});

/* ---------- EVENTS ---------- */
document.addEventListener("click", e => {
  const t = e.target, c = s => t.closest(s);
  if (c("[data-info]")) { e.preventDefault(); return openInfo(c("[data-info]").dataset.info); }
  if (c("[data-focus-form]")) { const n = $("#acctName"); if (n) n.focus(); return; }
  if (c("#lgSignupLink")) { const n = $("#acctName"); if (n) n.focus(); return; }
  if (c("[data-track]")) return openTrack();
  if (c("#accountBtn")) return openAccount();
  if (c("[data-logout]")) { try { localStorage.removeItem("sl_user"); } catch {} toast("Kamu sudah logout."); return openAccount(); }
  if (c("[data-wish]")) { e.stopPropagation(); const id = +c("[data-wish]").dataset.wish; toggleWish(id); if (wish.includes(id)) { const b = c("[data-wish]"); b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); setTimeout(() => b.classList.remove("pop"), 550); floatHeart(e.clientX, e.clientY); } if ($("#wishPage").classList.contains("open")) renderWish(); return; }
  if (c("[data-wpx]")) { e.stopPropagation(); const id = +c("[data-wpx]").dataset.wpx, card = c("[data-wcard]"); floatHeart(e.clientX, e.clientY); card.classList.add("leaving"); setTimeout(() => { wish = wish.filter(w => w !== id); sync(); card.remove(); updateWishChrome(); const t = $("#wpGrid .wp-total"); if (!wish.length && t) t.remove(); }, 350); return; }
  if (c("[data-wadd]")) { const b = c("[data-wadd]"), id = +b.dataset.wadd, p = PRODUCTS.find(x => x.id === id); if ((p.stock ?? 1) <= 0) return toast(`Maaf, ${p.name} sedang habis.`); const ex = cart.find(x => x.id === id && x.size === (p.sizes[1] || p.sizes[0])); ex ? ex.qty++ : cart.push({ id, size: p.sizes[1] || p.sizes[0], qty: 1 }); sync(); b.textContent = "Ditambahkan ✓"; b.disabled = true; setTimeout(() => { b.textContent = "Add to Bag"; b.disabled = false; }, 1400); const cb = $("#cartBtn"); cb.classList.remove("bump"); void cb.offsetWidth; cb.classList.add("bump"); return; }
  if (c("[data-share]")) { e.stopPropagation(); return shareProduct(+c("[data-share]").dataset.share); }
  if (c("[data-qv]")) { $("#search").classList.remove("open"); return openQV(+c("[data-qv]").dataset.qv); }
  if (c(".pimg") && c(".card")) return openQV(+c(".card").dataset.id);
  if (c("[data-size]")) { qvSize = c("[data-size]").dataset.size; $$("[data-size]").forEach(b => b.classList.toggle("on", b === c("[data-size]"))); return; }
  if (c("[data-qadd]")) { $("#qv").classList.remove("open"); return addCart(+c("[data-qadd]").dataset.qadd, qvSize); }
  if (c("[data-add]")) return addCart(+c("[data-add]").dataset.add);
  if (c("[data-q]")) { const [i, d] = c("[data-q]").dataset.q.split(":"); cart[i].qty += +d; if (cart[i].qty < 1) cart.splice(i, 1); sync(); return openDrawer("cart"); }
  if (c("[data-rm]")) { cart.splice(+c("[data-rm]").dataset.rm, 1); sync(); return openDrawer("cart"); }
  if (c("#checkout")) return openCheckout();
  if (c("#promoApply")) return applyPromo();
  if (c("#promoRemove")) return removePromo();
  if (c("#coSubmit")) return submitCheckout();
  if (c("[data-close]")) return c(".ov").classList.remove("open");
  if (c("[data-f]")) { filter = c("[data-f]").dataset.f; $$("[data-f]").forEach(b => b.classList.toggle("on", b === c("[data-f]"))); $("#mm").classList.remove("open"); return renderGrid(); }
  if (c("[data-cat]")) { const n = c("[data-cat]").dataset.cat; filter = n === "Men" ? "men" : n === "Women" ? "women" : n === "Accessories" ? "acc" : n === "New Collection" ? "new" : "all"; $$("[data-f]").forEach(b => b.classList.toggle("on", b.dataset.f === filter)); renderGrid(); return; }
  if (c(".mm a")) $("#mm").classList.remove("open");
});
$("#cartBtn").onclick = () => openDrawer("cart");
$("#wishBtn").onclick = () => openWishlist();
$("#wpClose").onclick = closeWishlist;
$("#wpBrowse").onclick = () => { closeWishlist(); $("#products").scrollIntoView({ behavior: "smooth" }); };
$("#wpClear").onclick = () => { $$("#wpGrid .wp-card").forEach((card, i) => setTimeout(() => card.classList.add("leaving"), i * 60)); setTimeout(() => { wish = []; sync(); renderWish(); toast("Wishlist dikosongkan."); }, 500); };
$("#wpMoveAll").onclick = () => { const n = wish.length; if (!n) return; wish.forEach(id => { const p = PRODUCTS.find(x => x.id === id), s = p.sizes[1] || p.sizes[0]; const ex = cart.find(x => x.id === id && x.size === s); ex ? ex.qty++ : cart.push({ id, size: s, qty: 1 }); }); wish = []; sync(); closeWishlist(); toast(`${n} item dipindahkan ke Bag.`); openDrawer("cart"); };
$("#drClose").onclick = $("#scrim").onclick = closeDrawer;
$("#burger").onclick = () => $("#mm").classList.add("open");
$("#mmClose").onclick = () => $("#mm").classList.remove("open");
$("#searchBtn").onclick = () => { $("#search").classList.add("open"); setTimeout(() => $("#q").focus(), 300); };
$("#sortSel").addEventListener("change", e => { sort = e.target.value; renderGrid(); });
$("#priceSel").addEventListener("change", e => { priceFilter = e.target.value; renderGrid(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { $$(".ov").forEach(o => o.classList.remove("open")); closeDrawer(); closeWishlist(); $("#mm").classList.remove("open"); } });

/* ---------- 3D: TILT KARTU + PARALLAX HERO ---------- */
const finePointer = typeof window.matchMedia === "function" && window.matchMedia("(hover:hover) and (pointer:fine)").matches;
const reduceMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (finePointer && !reduceMotion) {
  const grid = $("#grid");
  grid.addEventListener("mousemove", e => {
    const card = e.target.closest(".card"); if (!card) return;
    const box = card.querySelector(".pimg"), pic = card.querySelector(".pimg img");
    if (!box) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.classList.add("tilting");
    box.style.transform = `rotateX(${(-y * 9).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg)`;
    if (pic) pic.style.transform = "translateZ(26px) scale(1.07)";
  });
  grid.addEventListener("mouseout", e => {
    const card = e.target.closest(".card"); if (!card || (e.relatedTarget && card.contains(e.relatedTarget))) return;
    card.classList.remove("tilting");
    const box = card.querySelector(".pimg"), pic = card.querySelector(".pimg img");
    if (box) box.style.transform = ""; if (pic) pic.style.transform = "";
  });
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.addEventListener("mousemove", e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--px", (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
      hero.style.setProperty("--py", (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
    });
    hero.addEventListener("mouseleave", () => { hero.style.setProperty("--px", 0); hero.style.setProperty("--py", 0); });
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => { hero.style.setProperty("--sy", Math.min(window.scrollY * 0.12, 60).toFixed(1) + "px"); ticking = false; });
    }, { passive: true });
  }
}

/* mega menu */
const mega = $("#mega"); let mt;
$$("[data-mega]").forEach(a => a.addEventListener("mouseenter", () => {
  clearTimeout(mt); $$(".mc", mega).forEach(m => m.hidden = m.dataset.k !== a.dataset.mega); mega.classList.add("open");
}));
$("#nav").addEventListener("mouseleave", () => { mt = setTimeout(() => mega.classList.remove("open"), 150); });
$$(".mega a, .links a").forEach(a => a.addEventListener("click", () => mega.classList.remove("open")));

/* newsletter */
$("#nl").addEventListener("submit", e => {
  e.preventDefault(); const v = $("#nlEmail").value.trim(), m = $("#nlMsg");
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  m.textContent = ok ? "Terima kasih, kamu sudah terdaftar." : "Masukkan alamat email yang valid."; m.style.color = ok ? "#fff" : "#e57373";
  if (ok) $("#nlEmail").value = "";
});

/* scroll: navbar, hero parallax, reveal */
const nav = $("#nav"), hi = $("#heroImg");
addEventListener("scroll", () => {
  const y = scrollY; nav.classList.toggle("sc", y > 40);
  if (y < innerHeight) hi.style.translate = `0 ${y * 0.08}px`;
}, { passive: true });
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.15 });
$$(".rv, .clip").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + "ms"; io.observe(el); });

NB_MODEL.forEach((src, i) => { const el = $(i < 3 ? "#p" + i : "#l" + (i - 3)); if (el) { el.src = src; el.onerror = () => el.removeAttribute("src"); } });
hydrateIcons(); renderGrid(); sync(); apiLoadProducts();