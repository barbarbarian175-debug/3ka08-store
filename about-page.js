/* ===== Halaman About (gaya "Quiet Place") =====
   Taruh file ini SETELAH <script src="solace.js"></script> di 3ka08.html.
   Script ini membuat halamannya sendiri, lalu menghubungkan link "About Us" di footer. */
(function () {
  "use strict";

  /* font */
  if (!document.getElementById("abFont")) {
    var f = document.createElement("link");
    f.id = "abFont"; f.rel = "stylesheet";
    f.href = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&display=swap";
    document.head.appendChild(f);
  }

  /* markup halaman */
  var page = document.createElement("div");
  page.className = "ab-page";
  page.id = "aboutPage";
  page.setAttribute("aria-hidden", "true");
  page.setAttribute("role", "dialog");
  page.setAttribute("aria-label", "Tentang 3KA08");
  page.innerHTML =
    '<button class="ab-close" id="abClose" aria-label="Tutup halaman About">×</button>' +
    '<header class="ab-hero">' +
      '<nav class="ab-nav" aria-label="Navigasi About">' +
        '<div class="ab-brand"><svg viewBox="0 0 9 12" shape-rendering="crispEdges" aria-hidden="true"><path d="M4 0h1v2h1v2h1v2h1v2H1V6h1V4h1V2h1z M4 10h1v2H4z"/></svg>3KA08</div>' +
        '<ul><li><button data-ab-go="abCerita">Cerita</button></li><li><button data-ab-go="abKontak">Kontak</button></li></ul>' +
        '<div class="ab-navr"><button class="ab-btn" data-ab-shop>Belanja Sekarang</button></div>' +
      '</nav>' +
      '<div class="ab-hero-c">' +
        '<h1>Pakaian yang Tenang, Dibuat dengan Sengaja.</h1>' +
        '<p class="ab-lead">3KA08 lahir dari satu ide sederhana: pakaian yang baik tidak perlu ramai. Potongan bersih, bahan berbobot, dan warna yang cocok dipakai kapan saja.</p>' +
        '<div class="ab-vals">' +
          '<div><div class="e" aria-hidden="true">🧵</div><h3>Bahan Berbobot</h3><p>Kain tebal yang awet dan nyaman dipakai berulang kali.</p></div>' +
          '<div><div class="e" aria-hidden="true">✂️</div><h3>Potongan Bersih</h3><p>Siluet rapi tanpa detail berlebihan, mudah dipadukan.</p></div>' +
          '<div><div class="e" aria-hidden="true">🖤</div><h3>Monokrom</h3><p>Hitam, putih, dan abu yang cocok lintas musim.</p></div>' +
        '</div>' +
        '<div class="ab-cta"><button class="ab-btn" data-ab-shop>Lihat Koleksi</button><button class="ab-btn soft" data-ab-go="abCerita">Baca Cerita Kami</button></div>' +
      '</div>' +
      '<div class="ab-scene" aria-hidden="true"><svg id="abScene" viewBox="0 0 240 90" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges"></svg></div>' +
    '</header>' +

    '<section class="ab-sec ab-story" id="abCerita">' +
      '<div><h2>Cerita di balik 3KA08</h2>' +
        '<p>3KA08 adalah brand fashion minimalis yang dibuat oleh mahasiswa kelas 3KA08, Universitas Gunadarma. Awalnya ini tugas kuliah, tapi kami ingin hasilnya terasa seperti toko sungguhan.</p>' +
        '<p>Kami memilih pendekatan yang sama untuk pakaian dan untuk situs ini: kurangi yang tidak perlu, sisakan yang penting. Hasilnya koleksi Men, Women, dan Accessories yang mudah dipilih dan mudah dipakai.</p></div>' +
      '<ul class="ab-facts">' +
        '<li><span>Kelas</span><b>3KA08</b></li><li><span>Kampus</span><b>Universitas Gunadarma</b></li>' +
        '<li><span>Koleksi</span><b>37 produk</b></li><li><span>Gratis ongkir</span><b>di atas Rp750.000</b></li>' +
      '</ul>' +
    '</section>' +

    '<section class="ab-sec"><h2>Cara belanja di 3KA08</h2>' +
      '<ol class="ab-steps">' +
        '<li class="ab-step"><h3>Pilih produk</h3><p>Jelajahi koleksi, lalu buka Quick View untuk lihat detail dan ukuran.</p></li>' +
        '<li class="ab-step"><h3>Masuk ke Bag</h3><p>Tambahkan ke Bag. Simpan yang masih ragu ke Wishlist.</p></li>' +
        '<li class="ab-step"><h3>Checkout</h3><p>Isi data pengiriman. Pakai kode 3KA08 untuk diskon 10%.</p></li>' +
        '<li class="ab-step"><h3>Lacak pesanan</h3><p>Pantau status pesananmu dari menu Track your order.</p></li>' +
      '</ol>' +
    '</section>' +

    '<section class="ab-sec" id="abKontak"><h2>Ada pertanyaan? Hubungi kami</h2>' +
      '<div class="ab-contact">' +
        '<a class="ab-card" href="https://wa.me/6282197712791" target="_blank" rel="noopener"><h3>WhatsApp</h3><p>0821-9771-2791<br>Senin–Sabtu, 09.00–18.00 WIB</p></a>' +
        '<a class="ab-card" href="mailto:halo@3ka08.id"><h3>Email</h3><p>halo@3ka08.id</p></a>' +
        '<a class="ab-card" href="https://www.instagram.com/sisfor.ka08" target="_blank" rel="noopener"><h3>Instagram</h3><p>@sisfor.ka08</p></a>' +
      '</div>' +
    '</section>' +

    '<section class="ab-sec ab-end"><h2>Siap menemukan gayamu?</h2><p>Koleksi Autumn / Winter 26 sudah tersedia.</p><button class="ab-btn" data-ab-shop>Belanja Koleksi</button></section>' +
    '<div class="ab-foot">© 2026 3KA08. Defined by Simplicity.</div>';
  document.body.appendChild(page);

  /* pemandangan pixel art (digambar sekali dengan SVG) */
  (function drawScene() {
    var NS = "http://www.w3.org/2000/svg", svg = page.querySelector("#abScene");
    var OUT = "#3b2f3a", seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    function G(cls) { var e = document.createElementNS(NS, "g"); if (cls) e.setAttribute("class", cls); svg.appendChild(e); return e; }
    function R(p, x, y, w, h, fill, cls) {
      var r = document.createElementNS(NS, "rect");
      r.setAttribute("x", x); r.setAttribute("y", y); r.setAttribute("width", w); r.setAttribute("height", h); r.setAttribute("fill", fill);
      if (cls) r.setAttribute("class", cls);
      p.appendChild(r);
    }
    var sky = G(); R(sky, 0, 0, 240, 90, "#cfe0d8");
    function cloud(x, y, w) { R(sky, x + 5, y, w - 10, 3, "#f1efe3"); R(sky, x + 2, y + 3, w - 4, 4, "#f1efe3"); R(sky, x, y + 7, w, 12, "#f1efe3"); }
    cloud(38, 34, 76); cloud(86, 44, 66); cloud(142, 36, 62); cloud(196, 46, 40);

    var trees = G();
    function pine(cx, h) {
      var base = 66, mh = h * 0.3, r, hw, y;
      R(trees, cx - 1, base, 3, 4, "#8a5f5c");
      for (r = 0; r < h; r++) { hw = Math.floor(r * mh / h) + (r % 5 === 4 ? 1 : 0); R(trees, cx - hw - 1, base - h + r, 2 * hw + 3, 1, OUT); }
      for (r = 0; r < h; r++) {
        hw = Math.floor(r * mh / h) + (r % 5 === 4 ? 1 : 0); y = base - h + r;
        R(trees, cx - hw, y, 2 * hw + 1, 1, "#aac3a9");
        R(trees, cx + Math.floor(hw / 3), y, hw - Math.floor(hw / 3) + 1, 1, "#87a58f");
        if (r % 6 < 2) R(trees, cx - hw, y, Math.max(1, Math.floor(hw / 2)), 1, "#cdd9b4");
      }
    }
    [[32, 46], [48, 34], [62, 26], [168, 24], [183, 34], [196, 30], [212, 44]].forEach(function (t) { pine(t[0], t[1]); });

    var gr = G();
    [[12, 92], [143, 90]].forEach(function (p) {
      R(gr, p[0] - 1, 68, p[1] + 2, 7, OUT);
      R(gr, p[0], 69, p[1], 2, "#6f8f6c");
      R(gr, p[0], 71, p[1], 3, "#9a7673");
      for (var i = 0; i < p[1]; i += 3) if (rnd() > 0.45) R(gr, p[0] + i, 66 + Math.floor(rnd() * 2), 1, 3, "#4f6f5a");
    });
    R(gr, 33, 65, 2, 3, "#e8625a"); R(gr, 33, 68, 1, 1, "#4f6f5a");
    R(gr, 175, 64, 2, 3, "#e8625a"); R(gr, 175, 67, 1, 2, "#4f6f5a");

    var wt = G(); R(wt, 0, 74, 240, 16, "#8fb3ae"); R(wt, 0, 74, 240, 1, OUT);
    var sh = G();
    for (var k = 0; k < 34; k++) R(sh, Math.floor(rnd() * 230), 76 + Math.floor(rnd() * 12), 4 + Math.floor(rnd() * 8), 1, "#c3dad4", "ab-shim");

    var b = G("ab-bob");
    R(b, 86, 70, 9, 1, OUT);
    R(b, 89, 64, 6, 5, "#e8625a");
    R(b, 90, 60, 4, 4, "#ffffff"); R(b, 90, 56, 1, 4, "#ffffff"); R(b, 93, 56, 1, 4, "#ffffff");
    R(b, 91, 61, 1, 1, OUT);
    for (var i2 = 0; i2 < 17; i2++) R(b, 95 + i2, 64 - Math.floor(i2 * 0.4), 1, 1, "#7a4f4c");
    R(b, 112, 57, 1, 19, OUT); R(b, 111, 76, 3, 1, "#e8625a");
    R(b, 70, 67, 6, 3, "#6b7f84"); R(b, 71, 66, 4, 1, "#8fa0a4");
  })();

  /* buka / tutup */
  var lastFocus = null;
  function openAbout() {
    lastFocus = document.activeElement;
    page.scrollTop = 0;
    page.classList.add("open");
    page.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(function () { var c = document.getElementById("abClose"); if (c) c.focus({ preventScroll: true }); }, 400);
    if (location.hash !== "#about") { try { history.replaceState(null, "", "#about"); } catch (e) {} }
  }
  function closeAbout() {
    if (!page.classList.contains("open")) return;
    page.classList.remove("open");
    page.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (location.hash === "#about") { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  window.openAbout = openAbout;
  window.closeAbout = closeAbout;

  /* klik di dalam halaman */
  page.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest("#abClose")) return closeAbout();
    var go = t.closest("[data-ab-go]");
    if (go) { var el = document.getElementById(go.dataset.abGo); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (t.closest("[data-ab-shop]")) {
      closeAbout();
      var prod = document.getElementById("products");
      if (prod) setTimeout(function () { prod.scrollIntoView({ behavior: "smooth" }); }, 250);
    }
  });

  /* ambil alih link "About Us" (menggantikan popup lama) — fase capture supaya jalan lebih dulu */
  document.addEventListener("click", function (e) {
    var a = e.target.closest('[data-info="about"], a[href="#about"]');
    if (!a) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    var mm = document.getElementById("mm"); if (mm) mm.classList.remove("open");
    openAbout();
  }, true);

  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAbout(); });

  /* buka langsung kalau URL berakhiran #about */
  if (location.hash === "#about") openAbout();
  window.addEventListener("hashchange", function () { if (location.hash === "#about") openAbout(); });
})();
