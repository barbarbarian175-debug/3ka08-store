<?php
/* GET  /api/products.php            -> semua produk
   GET  /api/products.php?id=3      -> satu produk
   GET  /api/products.php?cat=men   -> filter kategori (men/women/acc)
   GET  /api/products.php?q=jaket   -> cari nama produk
   POST /api/products.php { action: "create", name, cat, price, old_price?, tag?, img?, sizes?, stock? }
   POST /api/products.php { action: "update", id, name?, cat?, price?, old_price?, tag?, img?, sizes?, stock? }
   POST /api/products.php { action: "delete", id }
   Dipakai halaman admin (admin.html). Bentuk produk yang dikembalikan sama
   seperti sebelumnya (lihat productRow di config.php) supaya solace.js
   tidak perlu diubah. */
require __DIR__ . "/config.php";

function validCat($c) { return in_array($c, ["men", "women", "acc"], true); }
function parseSizes($v) {
  if (is_array($v)) $sizes = array_values(array_filter(array_map("trim", $v)));
  else $sizes = array_values(array_filter(array_map("trim", explode(",", (string) $v))));
  return $sizes;
}
function productInput($d, $isUpdate) {
  $out = [];
  if (!$isUpdate || array_key_exists("name", $d)) {
    $name = trim((string) ($d["name"] ?? ""));
    if ($name === "" || mb_strlen($name) > 120) out(["ok" => false, "error" => "Nama produk wajib diisi (maks 120 karakter)."], 422);
    $out["name"] = $name;
  }
  if (!$isUpdate || array_key_exists("cat", $d)) {
    $cat = trim((string) ($d["cat"] ?? ""));
    if (!validCat($cat)) out(["ok" => false, "error" => "Kategori harus men, women, atau acc."], 422);
    $out["cat"] = $cat;
  }
  if (!$isUpdate || array_key_exists("price", $d)) {
    $price = (int) ($d["price"] ?? 0);
    if ($price <= 0) out(["ok" => false, "error" => "Harga harus lebih dari 0."], 422);
    $out["price"] = $price;
  }
  if (array_key_exists("old_price", $d)) {
    $old = $d["old_price"];
    $out["old_price"] = ($old === null || $old === "") ? null : max(0, (int) $old);
  }
  if (array_key_exists("tag", $d)) $out["tag"] = mb_substr(trim((string) $d["tag"]), 0, 20);
  if (array_key_exists("img", $d)) $out["img"] = mb_substr(trim((string) $d["img"]), 0, 255);
  if (array_key_exists("sizes", $d)) {
    $sizes = parseSizes($d["sizes"]);
    if (!$sizes) out(["ok" => false, "error" => "Isi minimal satu ukuran."], 422);
    $out["sizes"] = implode(",", $sizes);
  }
  if (array_key_exists("stock", $d)) {
    $stock = (int) $d["stock"];
    if ($stock < 0) out(["ok" => false, "error" => "Stok tidak boleh negatif."], 422);
    $out["stock"] = $stock;
  }
  return $out;
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
  if (isset($_GET["id"])) {
    $st = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $st->execute([(int) $_GET["id"]]);
    $p = $st->fetch();
    if (!$p) out(["ok" => false, "error" => "Produk tidak ditemukan."], 404);
    out(["ok" => true, "product" => productRow($p)]);
  }
  $where = []; $params = [];
  if (!empty($_GET["cat"])) {
    if (!validCat($_GET["cat"])) out(["ok" => false, "error" => "Kategori harus men, women, atau acc."], 422);
    $where[] = "cat = ?"; $params[] = $_GET["cat"];
  }
  if (!empty($_GET["q"])) { $where[] = "name LIKE ?"; $params[] = "%" . trim($_GET["q"]) . "%"; }
  $sql = "SELECT * FROM products" . ($where ? " WHERE " . implode(" AND ", $where) : "") . " ORDER BY id ASC";
  $st = $pdo->prepare($sql);
  $st->execute($params);
  out(["ok" => true, "products" => array_map("productRow", $st->fetchAll())]);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") out(["ok" => false, "error" => "Method tidak didukung."], 405);

$d = body();
$action = $d["action"] ?? "";
if ($action === "create") {
  $in = productInput($d, false);
  $in += ["old_price" => null, "tag" => "", "img" => "assets/product-01.jpg", "sizes" => "S,M,L,XL", "stock" => 10];
  /* products.id tidak AUTO_INCREMENT di skema lama (id 1-37 di-seed manual),
     jadi hitung id berikutnya sendiri di dalam transaksi. Di skema baru id
     sudah AUTO_INCREMENT (lihat database.sql) — id eksplisit tetap valid. */
  $pdo->beginTransaction();
  try {
    $nextId = (int) $pdo->query("SELECT COALESCE(MAX(id), 0) + 1 FROM products")->fetchColumn();
    $st = $pdo->prepare("INSERT INTO products (id, name, cat, price, old_price, tag, img, sizes, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $st->execute([$nextId, $in["name"], $in["cat"], $in["price"], $in["old_price"], $in["tag"], $in["img"], $in["sizes"], $in["stock"]]);
    $pdo->commit();
  } catch (Exception $e) {
    $pdo->rollBack();
    out(["ok" => false, "error" => "Gagal menambah produk: " . $e->getMessage()], 500);
  }
  $st = $pdo->prepare("SELECT * FROM products WHERE id = ?");
  $st->execute([$nextId]);
  out(["ok" => true, "product" => productRow($st->fetch())], 201);
}
if ($action === "update") {
  $id = (int) ($d["id"] ?? 0);
  if ($id < 1) out(["ok" => false, "error" => "id produk tidak valid."], 422);
  $in = productInput($d, true);
  if (!$in) out(["ok" => false, "error" => "Tidak ada field yang diubah."], 422);
  $st = $pdo->prepare("SELECT * FROM products WHERE id = ?");
  $st->execute([$id]);
  if (!$st->fetch()) out(["ok" => false, "error" => "Produk tidak ditemukan."], 404);
  $sets = []; $params = [];
  foreach ($in as $k => $v) { $sets[] = "$k = ?"; $params[] = $v; }
  $params[] = $id;
  $st = $pdo->prepare("UPDATE products SET " . implode(", ", $sets) . " WHERE id = ?");
  $st->execute($params);
  $st = $pdo->prepare("SELECT * FROM products WHERE id = ?");
  $st->execute([$id]);
  out(["ok" => true, "product" => productRow($st->fetch())]);
}
if ($action === "delete") {
  $id = (int) ($d["id"] ?? 0);
  if ($id < 1) out(["ok" => false, "error" => "id produk tidak valid."], 422);
  $st = $pdo->prepare("DELETE FROM products WHERE id = ?");
  $st->execute([$id]);
  if ($st->rowCount() === 0) out(["ok" => false, "error" => "Produk tidak ditemukan."], 404);
  out(["ok" => true, "id" => $id]);
}
out(["ok" => false, "error" => "Action tidak dikenal. Pakai create, update, atau delete."], 400);
