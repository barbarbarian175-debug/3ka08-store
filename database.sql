-- 3KA08 — Defined by Simplicity | database berta_store
-- Cara pakai: import file ini lewat phpMyAdmin (tab Import), atau:
--   C:\xampp82\mysql\bin\mysql.exe -u root < database.sql
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
(1, 'Kemeja Linen Hitam', 'men', 689000, NULL, 'BEST SELLER', 'assets/product-01.jpg', 'S,M,L,XL'),
(2, 'Blus Satin Putih', 'women', 329000, NULL, 'NEW', 'assets/product-02.jpg', 'S,M,L,XL'),
(3, 'Kaos Heavyweight Abu', 'men', 759000, 949000, 'SALE', 'assets/product-03.jpg', 'S,M,L,XL'),
(4, 'Kaos Oversize Putih', 'women', 1290000, NULL, 'NEW', 'assets/product-04.jpg', 'S,M,L,XL'),
(5, 'Jaket Bomber Hitam', 'men', 549000, NULL, 'BEST SELLER', 'assets/product-05.jpg', 'S,M,L,XL'),
(6, 'Jaket Denim Abu', 'women', 619000, NULL, '', 'assets/product-06.jpg', 'S,M,L,XL'),
(7, 'Celana Chino Hitam', 'men', 249000, 311000, 'SALE', 'assets/product-07.jpg', 'S,M,L,XL'),
(8, 'Rok Plisket Hitam', 'women', 479000, NULL, '', 'assets/product-08.jpg', 'S,M,L,XL'),
(9, 'Hoodie Oversize Abu', 'men', 599000, NULL, '', 'assets/product-09.jpg', 'S,M,L,XL'),
(10, 'Sweater Rajut Putih', 'women', 399000, NULL, 'NEW', 'assets/product-10.jpg', 'S,M,L,XL'),
(11, 'Kemeja Flanel Hitam', 'men', 849000, NULL, '', 'assets/product-11.jpg', 'S,M,L,XL'),
(12, 'Dress Midi Hitam', 'women', 459000, 574000, 'SALE', 'assets/product-12.jpg', 'S,M,L,XL'),
(13, 'Sweater Rajut Abu', 'men', 729000, NULL, 'BEST SELLER', 'assets/product-13.jpg', 'S,M,L,XL'),
(14, 'Blazer Monokrom Hitam', 'women', 359000, NULL, '', 'assets/product-14.jpg', 'S,M,L,XL'),
(15, 'Celana Denim Hitam', 'men', 949000, NULL, '', 'assets/product-15.jpg', 'S,M,L,XL'),
(16, 'Celana Kulot Putih', 'women', 519000, 649000, 'SALE', 'assets/product-16.jpg', 'S,M,L,XL'),
(17, 'Jaket Kulit Hitam', 'men', 689000, NULL, '', 'assets/product-17.jpg', 'S,M,L,XL'),
(18, 'Coat Wol Abu', 'women', 329000, NULL, '', 'assets/product-18.jpg', 'S,M,L,XL'),
(19, 'Kaos Kerah Hitam', 'men', 759000, NULL, '', 'assets/product-19.jpg', 'S,M,L,XL'),
(20, 'Atasan Rajut Putih', 'women', 1290000, NULL, '', 'assets/product-20.jpg', 'S,M,L,XL'),
(21, 'Celana Kargo Hitam', 'men', 549000, 686000, 'SALE', 'assets/product-21.jpg', 'S,M,L,XL'),
(22, 'Rok Denim Abu', 'women', 619000, NULL, '', 'assets/product-22.jpg', 'S,M,L,XL'),
(23, 'Topi Baseball Hitam', 'acc', 249000, NULL, '', 'assets/product-23.jpg', 'One Size'),
(24, 'Syal Rajut Abu', 'acc', 479000, NULL, '', 'assets/product-24.jpg', 'One Size'),
(25, 'Jaket Parka Hitam', 'men', 599000, NULL, '', 'assets/product-25.jpg', 'S,M,L,XL'),
(26, 'Kemeja Oxford Putih', 'women', 399000, 499000, 'SALE', 'assets/product-26.jpg', 'S,M,L,XL'),
(27, 'Kaos Lengan Panjang Abu', 'men', 849000, NULL, '', 'assets/product-27.jpg', 'S,M,L,XL'),
(28, 'Dress Rajut Hitam', 'women', 459000, NULL, '', 'assets/product-28.jpg', 'S,M,L,XL'),
(29, 'Jaket Hoodie Hitam', 'men', 729000, NULL, '', 'assets/product-29.jpg', 'S,M,L,XL'),
(30, 'Blus Linen Abu', 'women', 359000, NULL, '', 'assets/product-30.jpg', 'S,M,L,XL'),
(31, 'Celana Jogger Hitam', 'men', 949000, 1186000, 'SALE', 'assets/product-31.jpg', 'S,M,L,XL'),
(32, 'Rok A-Line Putih', 'women', 519000, NULL, '', 'assets/product-32.jpg', 'S,M,L,XL'),
(33, 'Sweater Turtle Neck Abu', 'men', 689000, NULL, '', 'assets/product-33.jpg', 'S,M,L,XL'),
(34, 'Jaket Kulit Putih', 'women', 329000, NULL, '', 'assets/product-34.jpg', 'S,M,L,XL'),
(35, 'Kemeja Denim Hitam', 'men', 759000, 949000, 'SALE', 'assets/product-35.jpg', 'S,M,L,XL'),
(36, 'Kaos Crop Putih', 'women', 1290000, NULL, 'NEW', 'assets/product-36.jpg', 'S,M,L,XL'),
(37, 'Celana Formal Abu', 'men', 549000, NULL, '', 'assets/product-37.jpg', 'S,M,L,XL');
