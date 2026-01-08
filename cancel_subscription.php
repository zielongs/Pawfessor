<?php
session_start();
header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","pawfessor_db");
if($conn->connect_error){
    echo json_encode(["error"=>"DB error"]);
    exit;
}

if(!isset($_SESSION['user_id'])){
    echo json_encode(["error"=>"Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Store normalized plan key 'free' instead of human-readable name
$sql = "UPDATE users 
        SET subscription_plan='free',
            plan_price=0,
            auto_renew=0,
            next_billing_date=NULL
        WHERE user_id=?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

echo json_encode(["success"=>true]);

$stmt->close();
$conn->close();
