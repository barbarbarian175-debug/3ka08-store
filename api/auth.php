<?php
/* API akun (demo).
   POST /api/auth.php  { action: "login", name, email }
   Kalau email belum ada, user baru dibuat otomatis; kalau sudah ada, user
   yang lama dipakai. Tidak ada password di versi demo ini — form login di
   situs memang hanya meminta nama & email — jadi jangan pakai pola ini
   untuk situs yang butuh keamanan beneran (tambahkan password_hash). */
require __DIR__ . "/config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") out(["ok" => false, "error" => "Method tidak didukung."], 405);
$d = body();
if (($d["action"] ?? "") !== "login") out(["ok" => false, "error" => "Action tidak dikenal."], 400);

$name = trim($d["name"] ?? "");
$email = trim($d["email"] ?? "");
if (strlen($name) < 3) out(["ok" => false, "error" => "Isi nama kamu."], 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) out(["ok" => false, "error" => "Masukkan alamat email yang valid."], 422);

$st = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$st->execute([$email]);
$u = $st->fetch();
if (!$u) {
  $st = $pdo->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  $st->execute([$name, $email]);
  $st = $pdo->prepare("SELECT * FROM users WHERE id = ?");
  $st->execute([$pdo->lastInsertId()]);
  $u = $st->fetch();
}
out(["ok" => true, "user" => ["id" => (int) $u["id"], "name" => $u["name"], "email" => $u["email"]]]);
