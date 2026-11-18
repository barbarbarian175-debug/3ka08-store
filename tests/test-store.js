/* Storefront end-to-end vs API sungguhan (php -S :8000 + MySQL/MariaDB).
   Jalankan dari folder project:
     npm install --no-save jsdom        (sekali saja)
     php -S 127.0.0.1:8000               (terminal lain, dari folder ini)
     node tests/test-store.js
   Menguji: produk dari API, tambah ke Bag, checkout + promo 3KA08,
   lacak pesanan dari database, dan register akun baru. */
const fs = require('fs');
const { JSDOM } = require('jsdom');
const path = require('path');
const dir = path.join(__dirname, '..');
const html = fs.readFileSync(dir + '/3ka08.html', 'utf8');
const js = fs.readFileSync(dir + '/solace.js', 'utf8');
const tick = (ms = 50) => new Promise(r => setTimeout(r, ms));
const dom = new JSDOM(html, {
  url: 'http://127.0.0.1:8000/3ka08.html', runScripts: 'outside-only', pretendToBeVisual: true,
  beforeParse(w) {
    w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
    w.scrollY = 0;
    w.matchMedia = q => ({ matches: false, media: q, addListener() {}, removeListener() {} });
    w.fetch = (u, o) => fetch(new URL(String(u), w.location.href), o);
  }
});
const { window } = dom, doc = window.document;
const click = el => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, clientX: 100, clientY: 100 }));
(async () => {
  window.eval(js);
  await tick(1200);
  console.log('kartu produk:', doc.querySelectorAll('#grid .card').length, '(37 = katalog penuh)');
  // tambah ke keranjang (grid: tombol berubah jadi "Ditambahkan ✓", drawer dibuka lewat ikon Bag)
  click(doc.querySelector('[data-qab]')); await tick(100);
  console.log('isi bag:', doc.querySelector('#cartN').textContent);
  click(doc.querySelector('#cartBtn')); await tick(100);
  console.log('drawer terbuka:', doc.querySelector('#drawer').classList.contains('open'), '| tombol checkout ada:', !!doc.querySelector('#checkout'));
  // checkout
  click(doc.querySelector('#checkout')); await tick(100);
  doc.querySelector('#coName').value = 'E2E Tester';
  doc.querySelector('#coPhone').value = '081234567890';
  doc.querySelector('#coCity').value = 'Jakarta';
  doc.querySelector('#coAddr').value = 'Jl. Merdeka No. 1, Jakarta';
  doc.querySelector('#promoInput').value = '3KA08';
  click(doc.querySelector('#promoApply')); await tick(50);
  console.log('promo dipakai, total:', doc.querySelector('#sumGrand').textContent);
  click(doc.querySelector('#coSubmit')); await tick(1200);
  const okBox = doc.querySelector('#coBox').textContent;
  const m = okBox.match(/3KA08-\d{8}-\d{4}/);
  console.log('checkout berhasil:', okBox.includes('Pesanan Berhasil'), '| nomor:', m && m[0]);
  const saved = JSON.parse(window.localStorage.getItem('sl_orders') || '[]');
  console.log('pesanan di localStorage:', saved.length, '| terakhir:', saved[0] && saved[0].id);
  // lacak pesanan (harus ketemu di database, bukan cuma lokal)
  window.eval(`localStorage.removeItem('sl_orders')`);
  click(doc.querySelector('[data-track]')); await tick(100);
  doc.querySelector('#trackId').value = m[0];
  doc.querySelector('#trackForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await tick(800);
  console.log('lacak dari DB:', doc.querySelector('#trackRes').textContent.includes('Data dari database MySQL'));
  // register akun baru (mode Daftar)
  click(doc.querySelector('#accountBtn')); await tick(100);
  click(doc.querySelector('#lgSignupLink')); await tick(50);
  console.log('mode register, tombol submit:', doc.querySelector('#lgSubmit').textContent);
  doc.querySelector('#acctName').value = 'E2E Tester';
  const uniqEmail = 'e2e' + Date.now() + '@3ka08.id';
  doc.querySelector('#acctEmail').value = uniqEmail;
  doc.querySelector('#acctForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  await tick(800);
  console.log('login/register berhasil:', doc.querySelector('#acctBox').textContent.includes(uniqEmail) && doc.querySelector('#acctBox').textContent.includes('Halo, E2E!'));
  console.log('STORE_TEST_DONE');
  process.exit(0);
})().catch(e => { console.error('FAIL', e); process.exit(1); });
