/* Generate database.sql from the product data in solace.js (single source of truth).
   Run: node gen-db.js  ->  writes database.sql */
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "solace.js"), "utf8");
const start = src.indexOf("const PRODUCT_IMG");
const end = src.indexOf("const PRODUCTS =");
if (start < 0 || end < 0) throw new Error("data block not found");
const dataSrc = src.slice(start, end);
const sandbox = {};
vm.createContext(sandbox);
const out = vm.runInContext(
  dataSrc + "\n;({ PRODUCT_ALL, PRICES, TAGS, NAMES, SALE_IDS })",
  sandbox
);
const { PRODUCT_ALL, PRICES, TAGS, NAMES, SALE_IDS } = out;
const esc = s => String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");

const products = PRODUCT_ALL.map((img, i) => {
  const id = i + 1;
  const price = PRICES[i % PRICES.length];
  const sale = SALE_IDS.includes(id);
  return {
    id,
    name: NAMES[i] || `Essential ${String(id).padStart(2, "0")}`,
    cat: id === 23 || id === 24 ? "acc" : i % 2 === 0 ? "men" : "women",
    price,
    oldPrice: sale ? Math.round((price * 1.25) / 1000) * 1000 : null,
    tag: sale ? "SALE" : TAGS[i % 16 === i ? i : -1] || (i > 15 && i % 5 === 0 ? "NEW" : ""),
    img,
    sizes: id === 23 || id === 24 ? "One Size" : "S,M,L,XL",
  };
});

const rows = products
  .map(p => `(${p.id}, '${esc(p.name)}', '${p.cat}', ${p.price}, ${p.oldPrice === null ? "NULL" : p.oldPrice}, '${esc(p.tag)}', '${esc(p.img)}', '${esc(p.sizes)}')`)
  .join(",\n");

const sql = `-- 3KA08 — Defined by Simplicity | database berta_store
-- Cara pakai: import file ini lewat phpMyAdmin (tab Import), atau:
--   C:\\xampp82\\mysql\\bin\\mysql.exe -u root < database.sql
-- Dibuat otomatis dari data produk di solace.js (37 produk) — jangan edit manual,
-- ubah solace.js lalu jalankan ulang: node gen-db.js

CREATE DATABASE IF NOT EXISTS berta_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE berta_store;

CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  cat ENUM('men','women','acc') NOT NULL,
  price INT NOT NULL,
  old_price INT NULL,
  tag VARCHAR(20) NOT NULL DEFAULT '',
  img VARCHAR(255) NOT NULL,
  sizes VARCHAR(50) NOT NULL DEFAULT 'S,M,L,XL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(32) PRIMARY KEY,
  user_id INT NULL,
  customer_name VARCHAR(120) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  city VARCHAR(80) NOT NULL,
  address TEXT NOT NULL,
  note VARCHAR(255) NULL,
  payment_method VARCHAR(20) NOT NULL,
  promo_code VARCHAR(20) NULL,
  subtotal INT NOT NULL,
  discount INT NOT NULL DEFAULT 0,
  shipping INT NOT NULL,
  total INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Diproses',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(32) NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(120) NOT NULL,
  size VARCHAR(10) NOT NULL,
  price INT NOT NULL,
  qty INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

INSERT IGNORE INTO products (id, name, cat, price, old_price, tag, img, sizes) VALUES
${rows};
`;

fs.writeFileSync(path.join(__dirname, "database.sql"), sql);
console.log(`database.sql written: ${products.length} products`);
console.log(`men=${products.filter(p => p.cat === "men").length} women=${products.filter(p => p.cat === "women").length} acc=${products.filter(p => p.cat === "acc").length} sale=${products.filter(p => p.tag === "SALE").length}`);
