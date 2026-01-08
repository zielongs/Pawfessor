<?php
session_start();
header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","pawfessor_db");
if($conn->connect_error){
    echo json_encode(["error"=>"DB connection failed"]);
    exit;
}

if(!isset($_SESSION['user_id'])){
    echo json_encode(["error"=>"Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT subscription_plan, plan_price, next_billing_date, auto_renew, payment_method 
        FROM users WHERE user_id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i",$user_id);
$stmt->execute();
$result = $stmt->get_result();

if($row = $result->fetch_assoc()){
    echo json_encode($row);
} else {
    echo json_encode(["error"=>"User not found"]);
}

$stmt->close();
$conn->close();
