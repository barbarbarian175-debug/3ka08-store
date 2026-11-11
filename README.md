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

Catatan: login demo ini tanpa password — cocok untuk tugas, bukan untuk
situs produksi. Pesanan & user yang dibuat saat mode offline tetap tersimpan
di localStorage (`sl_orders`, `sl_user`).
