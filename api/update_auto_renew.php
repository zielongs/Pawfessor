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
if(!isset($data['auto_renew'])){
    echo json_encode(["success"=>false,"error"=>"Invalid data"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$autoRenew = (int)$data['auto_renew'];

$stmt = $conn->prepare(
    "UPDATE users SET auto_renew=? WHERE user_id=?"
);
$stmt->bind_param("ii", $autoRenew, $user_id);

if($stmt->execute()){
    echo json_encode(["success"=>true]);
} else {
    echo json_encode(["success"=>false,"error"=>$stmt->error]);
}

$stmt->close();
$conn->close();
