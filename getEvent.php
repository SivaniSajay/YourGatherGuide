<?php
// Database connection
$host = "localhost";
$user = "root";
$password = ""; // leave this empty if you didn't set a MySQL password in XAMPP
$database = "event_planning";
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch events data
$sql = "SELECT event_name, event_date, location, full_name, email, contact_number FROM events";
$result = $conn->query($sql);

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

// Return JSON data
echo json_encode($events);
$conn->close();
?>
