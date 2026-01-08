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
if(!isset($data['plan']) || !isset($data['price'])){
    echo json_encode(["success"=>false,"error"=>"Invalid data"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$plan = $data['plan'];
$price = $data['price'];

$sql = "UPDATE users 
        SET subscription_plan=?, plan_price=?, next_billing_date=DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), auto_renew=1 
        WHERE user_id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sdi", $plan, $price, $user_id);
$stmt->execute();

echo json_encode(["success"=>true]);

$stmt->close();
$conn->close();
