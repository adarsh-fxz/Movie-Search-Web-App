<?php

$servername = "localhost";
$username = "root";
$password = "";
$database = "movies_db";

$conn = mysqli_connect($servername, $username, $password, $database);

if ($conn) {
    echo "Connection successful" . "<br>";
} else {
    echo "Connection failed" . mysqli_connect_error();
}

// $createDatabase = "CREATE DATABASE movies_db";
// if (mysqli_query($conn, $createDatabase)) {
//     echo "Database created";
// } else {
//     echo "Failed to create database". mysqli_error($conn);
// }

// $createTable = "CREATE TABLE movies(id int auto_increment PRIMARY KEY, title varchar(255) NOT NULL, year varchar(255) NOT NULL, poster varchar(255) NOT NULL, genre varchar(255) NOT NULL, rating float NOT NULL)";
// if(mysqli_query($conn, $createTable)) {
//     echo "Table created";
// } else {
//     echo "Failed to create table" . mysqli_error($conn);
// }


if (isset($_GET['t'])) {
    $movieName = $_GET['t'];
} else {
    $movieName = 'Iron Man';
}

$apiKey = "abcdefgh";

$url = "http://www.omdbapi.com/?t=' . $movieName . '&apikey=' . $apiKey . '";
$response = file_get_contents($url);
$data = json_decode($response, true); // converts data which is in JSON format to PHP objects
$title = $data['Title'];
$year = $data['Year'];
$poster = $data['Poster'];
$genre = $data['Genre'];
$rating = $data['imdbRating'];

$existingData = "SELECT * FROM movies WHERE title='$title' AND year='$year'";
$result = mysqli_query($conn, $existingData);

if (mysqli_num_rows($result) > 0) {
    // echo "Movie already in database";
} else {
    $insertData = "INSERT INTO movies(title, year, poster, genre, rating) VALUES('$title', '$year', '$poster', '$genre', $rating) ";
    if (mysqli_query($conn, $insertData)) {
        // echo "Data inserted";
    } else {
        echo "Failed to insert data" . mysqli_error($conn);
    }
}

mysqli_close($conn);
