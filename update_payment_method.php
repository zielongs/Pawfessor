<?php
session_start();
header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","pawfessor_db");
if($conn->connect_error){
    echo json_encode(["success"=>false,"error"=>"DB connection failed"]);
    exit;
}

if(!isset($_SESSION['user_id'])){
    echo json_encode(["success"=>false,"error"=>"Not logged in"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if(!isset($data['payment_method'])){
    echo json_encode(["success"=>false,"error"=>"No payment method"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$payment_method = trim($data['payment_method']);

$sql = "UPDATE users SET payment_method=? WHERE user_id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si",$payment_method, $user_id);
$stmt->execute();

echo json_encode(["success"=>true]);

$stmt->close();
$conn->close();
