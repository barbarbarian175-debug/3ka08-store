<?php
/* 3KA08 API — config & helpers. Dijalankan di XAMPP (Apache + MySQL).
   Database: berta_store (lihat database.sql di folder utama). */
ini_set("display_errors", "0"); /* API mengembalikan JSON — jangan biarkan warning PHP merusak respons */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");
if (($_SERVER["REQUEST_METHOD"] ?? "") === "OPTIONS") { http_response_code(204); exit; }

$DB_HOST = "127.0.0.1";
$DB_NAME = "berta_store";
$DB_USER = "root";
$DB_PASS = "";
try {
  $pdo = new PDO(
    "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
    $DB_USER, $DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
  );
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["ok" => false, "error" => "Database tidak tersedia. Pastikan MySQL di XAMPP jalan dan database.sql sudah di-import."]);
  exit;
}

/* Kirim JSON lalu berhenti. */
function out($data, $code = 200) {
  http_response_code($code);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

/* Baca body JSON dari POST. */
function body() {
  $d = json_decode(file_get_contents("php://input"), true);
  return is_array($d) ? $d : [];
}

/* Nomor pesanan format 3KA08-YYYYMMDD-XXXX (sama seperti versi localStorage). */
function newOrderId($pdo) {
  for ($i = 0; $i < 10; $i++) {
    $id = "3KA08-" . date("Ymd") . "-" . str_pad((string) random_int(0, 9999), 4, "0", STR_PAD_LEFT);
    $st = $pdo->prepare("SELECT id FROM orders WHERE id = ?");
    $st->execute([$id]);
    if (!$st->fetch()) return $id;
  }
  return "3KA08-" . date("Ymd") . "-" . str_pad((string) random_int(0, 99999), 5, "0", STR_PAD_LEFT);
}

/* Ubah baris products dari DB ke bentuk yang dipakai frontend (solace.js). */
function productRow($p) {
  return [
    "id" => (int) $p["id"],
    "name" => $p["name"],
    "cat" => $p["cat"],
    "price" => (int) $p["price"],
    "oldPrice" => $p["old_price"] === null ? null : (int) $p["old_price"],
    "tag" => $p["tag"],
    "img" => $p["img"],
    "sizes" => explode(",", $p["sizes"]),
  ];
}

/* Ubah baris orders dari DB ke bentuk yang dipakai frontend (solace.js). */
function orderRow($o, $items = []) {
  return [
    "id" => $o["id"],
    "date" => $o["created_at"],
    "name" => $o["customer_name"],
    "phone" => $o["whatsapp"],
    "city" => $o["city"],
    "addr" => $o["address"],
    "note" => $o["note"],
    "pay" => $o["payment_method"],
    "promo" => $o["promo_code"],
    "subtotal" => (int) $o["subtotal"],
    "discount" => (int) $o["discount"],
    "shipping" => (int) $o["shipping"],
    "total" => (int) $o["total"],
    "status" => $o["status"],
    "items" => array_map(function ($it) {
      return ["id" => (int) $it["product_id"], "size" => $it["size"], "qty" => (int) $it["qty"]];
    }, $items),
  ];
}
