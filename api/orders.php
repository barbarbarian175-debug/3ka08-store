<?php
/* API pesanan.
   GET  /api/orders.php?code=3KA08-20261111-1234  -> lacak satu pesanan
   GET  /api/orders.php?email=a@b.com             -> semua pesanan satu email
   POST /api/orders.php  { name, phone, city, addr, note?, pay, promo?, user_email?, items: [{id, size, qty}] }
   Total dihitung ulang di server dari harga di database — bukan dari angka
   yang dikirim frontend — supaya tidak bisa dimanipulasi. */
require __DIR__ . "/config.php";

define("FREE_SHIP_MIN", 750000);
define("SHIP_COST", 15000);

if ($_SERVER["REQUEST_METHOD"] === "GET") {
  if (!empty($_GET["all"])) {
    $st = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC, id DESC");
    $out = [];
    foreach ($st->fetchAll() as $o) {
      $it = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC");
      $it->execute([$o["id"]]);
      $out[] = orderRow($o, $it->fetchAll());
    }
    out(["ok" => true, "orders" => $out]);
  }
  if (!empty($_GET["code"])) {
    $code = strtoupper(trim($_GET["code"]));
    $st = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
    $st->execute([$code]);
    $o = $st->fetch();
    if (!$o) out(["ok" => false, "error" => "Nomor pesanan tidak ditemukan."], 404);
    $it = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC");
    $it->execute([$code]);
    out(["ok" => true, "order" => orderRow($o, $it->fetchAll())]);
  }
  if (!empty($_GET["email"])) {
    $st = $pdo->prepare(
      "SELECT o.* FROM orders o JOIN users u ON u.id = o.user_id WHERE u.email = ? ORDER BY o.created_at DESC"
    );
    $st->execute([trim($_GET["email"])]);
    out(["ok" => true, "orders" => array_map(function ($o) { return orderRow($o, []); }, $st->fetchAll())]);
  }
  out(["ok" => false, "error" => "Pakai ?code=NOMOR atau ?email=EMAIL."], 400);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") out(["ok" => false, "error" => "Method tidak didukung."], 405);

$d = body();
if (($d["action"] ?? "") === "update_status") {
  $id = strtoupper(trim($d["id"] ?? ""));
  $status = trim($d["status"] ?? "");
  if (!in_array($status, ["Diproses", "Dikirim", "Selesai", "Dibatalkan"], true)) out(["ok" => false, "error" => "Status tidak dikenal."], 422);
  $st = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
  $st->execute([$status, $id]);
  if ($st->rowCount() === 0) out(["ok" => false, "error" => "Nomor pesanan tidak ditemukan."], 404);
  out(["ok" => true, "id" => $id, "status" => $status]);
}
$name = trim($d["name"] ?? "");
$phone = preg_replace("/[\s-]/", "", trim($d["phone"] ?? ""));
$city = trim($d["city"] ?? "");
$addr = trim($d["addr"] ?? "");
$note = trim($d["note"] ?? "");
$pay = $d["pay"] ?? "";
$promo = strtoupper(trim($d["promo"] ?? ""));
$items = $d["items"] ?? [];

if (strlen($name) < 3) out(["ok" => false, "error" => "Isi nama lengkap kamu."], 422);
if (!preg_match("/^(\+62|62|0)8\d{7,12}$/", $phone)) out(["ok" => false, "error" => "Isi nomor WhatsApp yang valid."], 422);
if (strlen($city) < 3) out(["ok" => false, "error" => "Isi kota kamu."], 422);
if (strlen($addr) < 10) out(["ok" => false, "error" => "Isi alamat lengkap, minimal 10 karakter."], 422);
if (!in_array($pay, ["COD", "Transfer Bank", "QRIS"], true)) out(["ok" => false, "error" => "Pilih metode pembayaran."], 422);
if (!is_array($items) || count($items) === 0) out(["ok" => false, "error" => "Bag kamu masih kosong."], 422);
if ($promo !== "" && $promo !== "3KA08") out(["ok" => false, "error" => "Kode promo tidak ditemukan."], 422);

/* Hitung ulang dari harga di database. */
$ids = array_values(array_unique(array_map(function ($it) { return (int) ($it["id"] ?? 0); }, $items)));
$placeholders = implode(",", array_fill(0, count($ids), "?"));
$st = $pdo->prepare("SELECT * FROM products WHERE id IN ($placeholders)");
$st->execute($ids);
$byId = [];
foreach ($st->fetchAll() as $p) $byId[(int) $p["id"]] = $p;

$subtotal = 0;
$cleanItems = [];
foreach ($items as $it) {
  $pid = (int) ($it["id"] ?? 0);
  $qty = max(1, (int) ($it["qty"] ?? 1));
  if (!isset($byId[$pid])) out(["ok" => false, "error" => "Produk #$pid tidak ditemukan."], 422);
  $p = $byId[$pid];
  $size = in_array($it["size"] ?? "", explode(",", $p["sizes"]), true) ? $it["size"] : explode(",", $p["sizes"])[0];
  $subtotal += (int) $p["price"] * $qty;
  $cleanItems[] = ["id" => $pid, "name" => $p["name"], "size" => $size, "price" => (int) $p["price"], "qty" => $qty];
}
$discount = $promo === "3KA08" ? (int) round($subtotal * 0.10) : 0;
$afterDisc = $subtotal - $discount;
$shipping = $afterDisc >= FREE_SHIP_MIN ? 0 : SHIP_COST;
$total = $afterDisc + $shipping;

/* Cari user (kalau login) supaya pesanan terhubung ke akunnya. */
$userId = null;
if (!empty($d["user_email"])) {
  $st = $pdo->prepare("SELECT id FROM users WHERE email = ?");
  $st->execute([trim($d["user_email"])]);
  $u = $st->fetch();
  if ($u) $userId = (int) $u["id"];
}

$pdo->beginTransaction();
try {
  $orderId = newOrderId($pdo);
  $st = $pdo->prepare(
    "INSERT INTO orders (id, user_id, customer_name, whatsapp, city, address, note, payment_method, promo_code, subtotal, discount, shipping, total)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  $st->execute([
    $orderId, $userId, $name, $phone, $city, $addr, $note === "" ? null : $note, $pay,
    $promo === "" ? null : $promo, $subtotal, $discount, $shipping, $total,
  ]);
  $dec = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?");
  foreach ($cleanItems as $it) {
    $dec->execute([$it["qty"], $it["id"], $it["qty"]]);
    if ($dec->rowCount() === 0) throw new Exception("Stok " . $it["name"] . " tidak mencukupi.");
  }
  $st = $pdo->prepare(
    "INSERT INTO order_items (order_id, product_id, product_name, size, price, qty) VALUES (?, ?, ?, ?, ?, ?)"
  );
  foreach ($cleanItems as $it) {
    $st->execute([$orderId, $it["id"], $it["name"], $it["size"], $it["price"], $it["qty"]]);
  }
  $pdo->commit();
} catch (Exception $e) {
  $pdo->rollBack();
  out(["ok" => false, "error" => "Gagal menyimpan pesanan: " . $e->getMessage()], 500);
}

$st = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
$st->execute([$orderId]);
$respItems = array_map(function ($it) {
  return ["product_id" => $it["id"], "size" => $it["size"], "qty" => $it["qty"]];
}, $cleanItems);
out(["ok" => true, "order" => orderRow($st->fetch(), $respItems)], 201);
