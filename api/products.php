<?php
/* GET /api/products.php          -> semua produk
   GET /api/products.php?id=3    -> satu produk */
require __DIR__ . "/config.php";

if (isset($_GET["id"])) {
  $st = $pdo->prepare("SELECT * FROM products WHERE id = ?");
  $st->execute([(int) $_GET["id"]]);
  $p = $st->fetch();
  if (!$p) out(["ok" => false, "error" => "Produk tidak ditemukan."], 404);
  out(["ok" => true, "product" => productRow($p)]);
}

$st = $pdo->query("SELECT * FROM products ORDER BY id ASC");
out(["ok" => true, "products" => array_map("productRow", $st->fetchAll())]);
