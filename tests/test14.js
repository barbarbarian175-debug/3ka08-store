/* Test 14: ulasan & rating, related products, size guide, flash sale,
   tombol WA melayang, feed Instagram.
   Jalankan: timeout 60 node tests/test14.js */
const fs = require('fs');
const { JSDOM } = require('jsdom');
const dir = '/home/hatch/workspace/berta-work';
const html = fs.readFileSync(dir + '/3ka08.html', 'utf8');
const js = fs.readFileSync(dir + '/solace.js', 'utf8');
const css = fs.readFileSync(dir + '/style.css', 'utf8');
const tick = (ms = 50) => new Promise(r => setTimeout(r, ms));

const dom = new JSDOM(html, { url: 'http://localhost:5500/3ka08.html', runScripts: 'outside-only', pretendToBeVisual: true,
  beforeParse(w) {
    w.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
    w.scrollY = 0;
    w.matchMedia = q => ({ matches: false, media: q, addListener() {}, removeListener() {} });
    w.fetch = async (u) => {
      const s = String(u);
      if (s.includes('reviews.php')) {
        if (s.includes('product_id=5')) return { ok: true, json: async () => ({ ok: true, reviews: [{ id: 99, product_id: 5, name: 'API User', rating: 5, text: 'Ulasan dari database.', created_at: '2026-11-11 15:00:00' }] }) };
        return { ok: true, json: async () => ({ ok: true, reviews: [] }) };
      }
      throw new Error('API mati');
    };
  } });
const { window } = dom, doc = window.document;
const click = el => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, clientX: 100, clientY: 100 }));

(async () => {
  window.eval(js);
  await tick(150);

  // 1. Flash sale
  const ft = doc.querySelector('#flashT').textContent;
  console.log('flash teks:', ft, '| format ok:', /^\d+ hari \d\d:\d\d:\d\d$/.test(ft) || /^\d\d:\d\d:\d\d$/.test(ft));
  console.log('flash link sale:', !!doc.querySelector('.flash a[data-f="sale"]'));

  // 2. Tombol WA melayang
  const wa = doc.querySelector('.wa-float');
  console.log('WA href:', wa.getAttribute('href').includes('wa.me/6282197712791'), '| target _blank:', wa.getAttribute('target') === '_blank');

  // 3. Feed Instagram
  const ig = doc.querySelectorAll('#igGrid .ig-t');
  console.log('IG tiles:', ig.length, '| semua ke IG:', [...ig].every(a => a.href.includes('instagram.com/sisfor.ka08')), '| gambar lokal:', [...ig].every(a => a.querySelector('img').getAttribute('src').startsWith('assets/')));
  console.log('IG nomor 03:', doc.querySelector('#ig .sec-no').textContent.includes('03'), '| Manifesto 04:', doc.body.innerHTML.includes('04 — Manifesto'));

  // 4. Rating di grid
  const rate = doc.querySelector('#grid .card .rate');
  console.log('rating grid:', rate ? rate.textContent.trim() : 'TIDAK ADA', '| format:', /★ \d\.\d · \d+ ulasan/.test(rate.textContent));

  // 5. Quick View: rating, related, size guide, ulasan
  window.eval('openQV(5)');
  await tick(150);
  const qv = doc.querySelector('#qvBox');
  console.log('QV rating:', qv.querySelector('.qv-rate').textContent.includes('ulasan'));
  const rel = qv.querySelectorAll('.qv-rel a');
  console.log('related:', rel.length, '| nama pertama:', rel[0].textContent.trim().slice(0, 20));
  const sgBtn = qv.querySelector('[data-sg]');
  console.log('size guide tombol:', !!sgBtn);
  click(sgBtn); await tick(30);
  console.log('size guide terbuka:', !qv.querySelector('#sgT').hidden, '| baris tabel:', qv.querySelectorAll('#sgT table tr').length);
  const revs = qv.querySelectorAll('#qvReviews .rvw');
  console.log('ulasan seed (pid 5):', revs.length, '| pertama:', revs[0] ? revs[0].querySelector('b').textContent : '-');
  await tick(100);
  console.log('ulasan API muncul:', [...qv.querySelectorAll('#qvReviews .rvw b')].some(b => b.textContent === 'API User'));

  // 6. Kirim ulasan baru
  qv.querySelector('#rvName').value = 'Tester';
  qv.querySelector('#rvText').value = 'Bahannya bagus, pengiriman cepat.';
  click(qv.querySelector('[data-rvstar="4"]')); await tick(30);
  console.log('bintang terpilih 4:', qv.querySelectorAll('.rv-stars button.on').length === 4);
  click(qv.querySelector('#rvSubmit')); await tick(50);
  const after = [...qv.querySelectorAll('#qvReviews .rvw b')].map(b => b.textContent);
  console.log('ulasan baru tampil:', after.includes('Tester'), '| tersimpan localStorage:', JSON.parse(window.localStorage.getItem('sl_reviews')).some(r => r.name === 'Tester'));

  // 7. Produk tanpa ulasan seed + aksesoris tanpa size guide
  window.eval('openQV(4)');
  await tick(80);
  console.log('produk tanpa seed -> empty state:', doc.querySelector('#qvReviews .empty') !== null);
  window.eval('openQV(23)');
  await tick(80);
  console.log('aksesoris tanpa size guide:', !doc.querySelector('#qvBox [data-sg]'));

  // 8. Related di QV bisa diklik (buka produk lain)
  window.eval('openQV(5)');
  await tick(80);
  click(doc.querySelector('.qv-rel a')); await tick(80);
  console.log('klik related -> QV ganti produk:', doc.querySelector('#qvBox h3').textContent !== 'Jaket Bomber Hitam');

  console.log('TEST_DONE');
  process.exit(0);
})().catch(e => { console.error('FAIL', e); process.exit(1); });
