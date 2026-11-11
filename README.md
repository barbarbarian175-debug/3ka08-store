# 3KA08 — Defined by Simplicity

Fashion store minimalis — tugas Bu Berta, kelas 3KA08, Universitas Gunadarma.

- 37 produk (Men / Women / Accessories), harga dalam Rupiah
- Keranjang & wishlist (localStorage), checkout dengan kode promo `3KA08` (diskon 10%)
- Sorting & filter harga, Quick View, lacak pesanan
- Semua gambar produk tersimpan lokal di `assets/`

Buka `3ka08.html` di browser, atau kunjungi situs GitHub Pages repo ini.

Dibangun dengan HTML, CSS, dan JavaScript murni — tanpa framework. Back end
(PHP + MySQL, lihat bawah) bersifat opsional: tanpa XAMPP situs tetap jalan
penuh dengan data lokal + localStorage.

## Back end (PHP + MySQL, localhost via XAMPP)

Struktur: `database.sql` (skema + 37 produk), `api/` (REST API), `gen-db.js`
(generator `database.sql` dari data produk di `solace.js`).

1. Jalankan Apache & MySQL dari XAMPP Control Panel.
2. Import `database.sql` lewat phpMyAdmin (tab Import) atau:
   `C:\xampp82\mysql\bin\mysql.exe -u root < database.sql`
3. Buat symlink supaya Apache bisa melayani API dari folder ini:
   `mklink /D C:\xampp82\htdocs\berta-api "C:\Users\X1\Desktop\Tugas Bu Berta\api"`
   (jalankan Command Prompt sebagai Administrator; kalau gagal, copy saja
   folder `api` ke `C:\xampp82\htdocs\berta-api`).
4. Buka situs lewat Live Server / `localhost` (bukan GitHub Pages — Pages
   hanya melayani file statis, jadi di sana situs otomatis pakai mode offline).
   Panel login menampilkan "● Terhubung ke database MySQL" kalau API terjangkau.

Endpoint:

- `GET /berta-api/products.php` — semua produk (atau `?id=3`)
- `POST /berta-api/orders.php` — buat pesanan (total dihitung ulang server)
- `GET /berta-api/orders.php?code=3KA08-...` — lacak pesanan
- `POST /berta-api/auth.php` — login/demo (nama + email, tanpa password)
- `GET /berta-api/reviews.php?product_id=5` — ulasan satu produk
- `POST /berta-api/reviews.php` — kirim ulasan `{ product_id, name, rating (1-5), text }` (tabel `reviews`)

Catatan: login demo ini tanpa password — cocok untuk tugas, bukan untuk
situs produksi. Pesanan & user yang dibuat saat mode offline tetap tersimpan
di localStorage (`sl_orders`, `sl_user`).

## Fitur toko (semua sudah dites)

- **Ulasan & rating** — tiap produk punya rating bintang (★ 4.0–5.0) di grid
  dan Quick View, plus daftar ulasan + form kirim ulasan (nama, bintang,
  teks). Ada 12 ulasan contoh; ulasan baru tersimpan di localStorage
  (`sl_reviews`) dan, kalau API terjangkau, masuk ke tabel `reviews`.
- **Lengkapi gayamu** — Quick View menampilkan 4 produk sejenis (kategori
  sama) yang bisa diklik untuk membuka Quick View produk tersebut.
- **Panduan ukuran** — tombol di Quick View membuka tabel ukuran
  (S/M/L/XL: lingkar dada, panjang, bahu) + catatan lingkar pinggang
  untuk celana & rok. Disembunyikan untuk aksesoris (One Size).
- **Flash sale** — banner hitam di bawah hero dengan countdown live
  (berakhir Minggu 23:59, otomatis lanjut ke minggu berikutnya) dan
  link ke filter Sale (diskon hingga 20%).
- **Tombol WhatsApp melayang** — pojok kanan bawah, langsung chat ke
  0821-9771-2791.
- **Feed Instagram** — section "03 — Instagram" berisi 6 foto model yang
  semuanya mengarah ke https://www.instagram.com/sisfor.ka08.

## Jualan beneran: stok, WhatsApp & admin

- **Stok**: tiap produk punya stok (kolom `stock` di `products`, dibuat dari
  `gen-db.js`). Stok berkurang otomatis saat pesanan dibuat; produk habis
  tidak bisa dimasukkan ke Bag. Kalau database sudah pernah di-import,
  jalankan migrasi ini sekali:
  `ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 10;`
  `UPDATE products SET stock = 10 + (id % 7);`
- **Konfirmasi via WhatsApp**: setelah checkout berhasil muncul tombol yang
  membuka `wa.me` ke nomor penjual dengan isi pesanan lengkap. Nomornya
  diatur di satu tempat di `solace.js`: `SELLER_WA` (format `628xx`) —
  ganti dengan nomor WhatsApp asli toko.
- **Halaman admin** (`admin.html`, hanya jalan di localhost): daftar semua
  pesanan + ubah status (Diproses / Dikirim / Selesai / Dibatalkan) dan
  tabel stok produk. Buka lewat Live Server: `http://localhost:5500/admin.html`.
- **SEO**: meta description + Open Graph di `3ka08.html`, `favicon.svg`,
  `sitemap.xml`, `robots.txt`.
