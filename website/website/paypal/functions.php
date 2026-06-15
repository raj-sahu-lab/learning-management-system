<?php
// functions.php

// Database connection using PDO (singleton)
function getPaypalDB() {
    static $pdo = null;
    if ($pdo === null) {
        $host = getenv('DB_HOST') ?: '[DB_HOST]';
        $user = getenv('DB_USER') ?: '[DB_USER]';
        $pass = getenv('DB_PASSWORD') ?: '[DB_PASSWORD]';
        $name = getenv('DB_NAME') ?: '[DB_NAME]';
        try {
            $pdo = new PDO(
                "mysql:host={$host};dbname={$name};charset=utf8mb4",
                $user,
                $pass,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        } catch (PDOException $e) {
            error_log('PayPal DB connection failed: ' . $e->getMessage());
            return null;
        }
    }
    return $pdo;
}

function check_txnid($tnxid) {
    return true;
    // NOTE: the lines below are intentionally unreachable (early return above)
    // kept for reference — returns false when txnid already exists in payments
    $pdo = getPaypalDB();
    if (!$pdo) return true;
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM `payments` WHERE txnid = ?");
    $stmt->execute([$tnxid]);
    $exists = (int) $stmt->fetchColumn() > 0;
    return !$exists; // true = valid (not a duplicate), false = duplicate
}

function check_price($price, $id) {
    $valid_price = false;
    // you could use the below to check whether the correct price has been paid
    // for the product

    /*
    $pdo = getPaypalDB();
    if (!$pdo) return false;
    $stmt = $pdo->prepare("SELECT amount FROM `products` WHERE id = ?");
    $stmt->execute([$id]);
    $rows = $stmt->fetchAll();
    foreach ($rows as $row) {
        if ((float) $row['amount'] == $price) {
            $valid_price = true;
        }
    }
    return $valid_price;
    */
    return true;
}

function updatePayments($data) {
    if (is_array($data)) {
        $pdo = getPaypalDB();
        if (!$pdo) return false;
        $stmt = $pdo->prepare(
            "INSERT INTO `payments` (txnid, payment_amount, payment_status, itemid, createdtime)
             VALUES (:txnid, :payment_amount, :payment_status, :itemid, :createdtime)"
        );
        $stmt->execute([
            ':txnid'          => $data['txn_id'],
            ':payment_amount' => $data['payment_amount'],
            ':payment_status' => $data['payment_status'],
            ':itemid'         => $data['item_number'],
            ':createdtime'    => date("Y-m-d H:i:s"),
        ]);
        return $pdo->lastInsertId();
    }
}
