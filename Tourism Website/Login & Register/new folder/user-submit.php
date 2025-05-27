<?php
// Show errors (for debugging)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
include 'db.php'; // Make sure db.php sets up $conn (MySQLi connection)

// Set header for JSON response
header("Content-Type: application/json");

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

// If decoding fails
if (!$data) {
    echo json_encode(["message" => "No data received or invalid JSON"]);
    exit;
}

// Extract and sanitize
$name = trim($data['name'] ?? '');
$surname = trim($data['surname'] ?? '');
$email = trim($data['email'] ?? '');
$age = (int)($data['age'] ?? 0);
$phone = trim($data['phone'] ?? '');
$country = trim($data['country_of_origin'] ?? '');
$marital_status = trim($data['marital_status'] ?? '');
$password = $data['password'] ?? '';
$gender = trim($data['gender'] ?? '');

// === Server-side validation ===
if (!$name || !$surname || !$email || !$age || !$phone || !$country || !$marital_status || !$password || !$gender) {
    echo json_encode(["message" => "All fields are required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["message" => "Invalid email format"]);
    exit;
}

if (!preg_match('/^\d{8}$/', $phone)) {
    echo json_encode(["message" => "Phone must be exactly 8 digits"]);
    exit;
}

if ($age < 1 || $age > 120) {
    echo json_encode(["message" => "Invalid age"]);
    exit;
}

if (strlen($password) < 6 || strlen($password) > 45) {
    echo json_encode(["message" => "Password must be between 6 and 45 characters"]);
    exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Prepare SQL
$sql = "INSERT INTO `user` 
(`name`, `surname`, `email`, `age`, `phone`, `country_of_origin`, `marital_status`, `password`, `gender`)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["message" => "Prepare failed: " . $conn->error]);
    exit;
}

// Bind values
$stmt->bind_param(
    "sssisssss",
    $name,
    $surname,
    $email,
    $age,
    $phone,
    $country,
    $marital_status,
    $hashedPassword,
    $gender
);

// Execute
if ($stmt->execute()) {
    echo json_encode(["message" => "Registration successful"]);
} else {
    echo json_encode(["message" => "Database error: " . $stmt->error]);
}

// Clean up
$stmt->close();
$conn->close();
?>
