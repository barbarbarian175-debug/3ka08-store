/* Admin end-to-end vs API sungguhan (php -S :8000 + MySQL/MariaDB).
   Jalankan dari folder project:
     npm install --no-save jsdom
     php -S 127.0.0.1:8000   (terminal lain, dari folder ini)
     node tests/test-admin.js */
const fs=require('fs'),path=require('path');
const {JSDOM}=require('jsdom');
const dir=path.join(__dirname,'..');
const html=fs.readFileSync(dir+'/admin.html','utf8');
const tick=(ms=50)=>new Promise(r=>setTimeout(r,ms));
(async()=>{
  const dom=new JSDOM(html,{url:'http://127.0.0.1:8000/admin.html',runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,beforeParse(w){ w.fetch=(u,o)=>fetch(new URL(String(u), w.location.href), o); w.confirm=()=>true; }});
  const {window}=dom,doc=window.document;
  await tick(1500);
  console.log('status:',doc.querySelector('#adminStatus').textContent);
  console.log('baris pesanan:',doc.querySelectorAll('#ordersBody tr').length,'| teks:',doc.querySelector('#ordersBody').textContent.trim().slice(0,40));
  console.log('baris produk:',doc.querySelectorAll('#stockBody tr').length);
  // tambah produk lewat form admin
  doc.querySelector('#pfName').value='Kaos Admin Tes';
  doc.querySelector('#pfPrice').value='99000';
  doc.querySelector('#pfStock').value='4';
  doc.querySelector('#prodForm').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
  await tick(1200);
  console.log('pesan form:',doc.querySelector('#pfMsg').textContent);
  console.log('baris produk setelah tambah:',doc.querySelectorAll('#stockBody tr').length);
  const row=[...doc.querySelectorAll('#stockBody tr')].find(tr=>tr.textContent.includes('Kaos Admin Tes'));
  console.log('produk baru tampil di tabel:',!!row);
  // hapus produk itu lewat tombol Hapus (confirm=true)
  window.confirm=()=>true;
  row.querySelector('[data-delprod]').dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}));
  await tick(1200);
  console.log('baris produk setelah hapus:',doc.querySelectorAll('#stockBody tr').length);
  console.log('ADMIN_TEST_DONE');
  process.exit(0);
})().catch(e=>{console.error('FAIL',e);process.exit(1);});
