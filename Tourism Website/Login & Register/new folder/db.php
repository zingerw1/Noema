<?php
$host = "127.0.0.1";
$port = 3306; // default MySQL port
$username = "root"; // or your MySQL Workbench username
$password = "@Lesegoseeletso2"; // or your MySQL Workbench password
$database = "tourism"; // the schema you created

$conn = new mysqli($host, $username, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


?>
