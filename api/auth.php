<?php
/* API akun (demo).
   POST /api/auth.php  { action: "login", name, email }
   POST /api/auth.php  { action: "register", name, email }
   Login: kalau email belum ada, user baru dibuat otomatis; kalau sudah ada,
   user yang lama dipakai. Register: menolak kalau email sudah terdaftar
   (HTTP 409) supaya "Daftar" dan "Masuk" benar-benar berbeda.
   Tidak ada password di versi demo ini — form login di situs memang hanya
   meminta nama & email — jadi jangan pakai pola ini untuk situs yang butuh
   keamanan beneran (tambahkan password_hash). */
require __DIR__ . "/config.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") out(["ok" => false, "error" => "Method tidak didukung."], 405);
$d = body();
$action = $d["action"] ?? "";
if ($action !== "login" && $action !== "register") out(["ok" => false, "error" => "Action tidak dikenal. Pakai login atau register."], 400);

$name = trim((string) ($d["name"] ?? ""));
$email = trim((string) ($d["email"] ?? ""));
if (strlen($name) < 3) out(["ok" => false, "error" => "Isi nama kamu."], 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) out(["ok" => false, "error" => "Masukkan alamat email yang valid."], 422);

$st = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$st->execute([$email]);
$u = $st->fetch();
if ($action === "register" && $u) out(["ok" => false, "error" => "Email sudah terdaftar. Silakan masuk dengan akun itu."], 409);
$created = false;
if (!$u) {
  $created = true;
  $st = $pdo->prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  $st->execute([$name, $email]);
  $st = $pdo->prepare("SELECT * FROM users WHERE id = ?");
  $st->execute([$pdo->lastInsertId()]);
  $u = $st->fetch();
}
out(["ok" => true, "user" => ["id" => (int) $u["id"], "name" => $u["name"], "email" => $u["email"]]], $created && $action === "register" ? 201 : 200);
