<?php

// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$database = "movies_db";

$conn = mysqli_connect($servername, $username, $password, $database);

if ($conn) {
    // echo "Connection successful";
} else {
    echo "Connection failed" . mysqli_connect_error();
}

if (isset($_GET['t'])) {
    $movieName = $_GET['t'];
} else {
    $movieName = 'Iron man';
}

$selectAllData = "SELECT * FROM movies WHERE title='$movieName'";
$result = mysqli_query($conn, $selectAllData);

if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }

    $json_data = json_encode($rows); // converts associative array to JSON format
    echo $json_data;
} else {
    $errorResponse = ['error' => true, 'message' => 'Movie not found'];
    $json_data = json_encode($errorResponse);
    echo $json_data;
}
