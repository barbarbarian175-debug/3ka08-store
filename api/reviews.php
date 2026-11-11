<?php
/* API ulasan produk.
   GET  /api/reviews.php?product_id=5   -> semua ulasan satu produk (terbaru dulu)
   POST /api/reviews.php  { product_id, name, rating (1-5), text } */
require __DIR__ . "/config.php";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
  $pid = (int) ($_GET["product_id"] ?? 0);
  if ($pid < 1) out(["ok" => false, "error" => "Pakai ?product_id=NOMOR."], 400);
  $st = $pdo->prepare("SELECT id, product_id, name, rating, text, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC, id DESC");
  $st->execute([$pid]);
  out(["ok" => true, "reviews" => array_map(function ($r) {
    return ["id" => (int) $r["id"], "product_id" => (int) $r["product_id"], "name" => $r["name"], "rating" => (int) $r["rating"], "text" => $r["text"], "created_at" => $r["created_at"]];
  }, $st->fetchAll())]);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") out(["ok" => false, "error" => "Method tidak didukung."], 405);

$d = body();
$pid = (int) ($d["product_id"] ?? 0);
$name = trim($d["name"] ?? "");
$rating = (int) ($d["rating"] ?? 0);
$text = trim($d["text"] ?? "");
if ($pid < 1) out(["ok" => false, "error" => "product_id tidak valid."], 422);
if ($name === "" || mb_strlen($name) > 120) out(["ok" => false, "error" => "Nama wajib diisi (maks 120 karakter)."], 422);
if ($rating < 1 || $rating > 5) out(["ok" => false, "error" => "Rating harus 1-5."], 422);
if ($text === "" || mb_strlen($text) > 500) out(["ok" => false, "error" => "Ulasan wajib diisi (maks 500 karakter)."], 422);
$st = $pdo->prepare("SELECT id FROM products WHERE id = ?");
$st->execute([$pid]);
if (!$st->fetch()) out(["ok" => false, "error" => "Produk tidak ditemukan."], 404);
$st = $pdo->prepare("INSERT INTO reviews (product_id, name, rating, text) VALUES (?, ?, ?, ?)");
$st->execute([$pid, $name, $rating, $text]);
out(["ok" => true, "id" => (int) $pdo->lastInsertId()]);
