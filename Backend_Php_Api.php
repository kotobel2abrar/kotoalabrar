<?php
// config.php
$DB_HOST = 'localhost';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'abrar_library';
$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($conn->connect_error) {
    die(json_encode(['error' => 'DB connection failed']));
}
?>

<?php
// upload_book.php
include 'config.php';

if (!isset($_POST['title']) || !isset($_POST['grade']) || !isset($_POST['path'])) {
    echo json_encode(['error' => 'missing_fields']);
    exit;
}
$title = $_POST['title'];
$grade = $_POST['grade'];
$path = $_POST['path'];
$sql = "INSERT INTO books (title, grade, file_path) VALUES ('$title', '$grade', '$path')";
if ($conn->query($sql)) echo json_encode(['success' => true]);
else echo json_encode(['error' => 'db_error']);
?>

<?php
// stats_update.php
include 'config.php';
if (!isset($_POST['username']) || !isset($_POST['duration'])) {
    echo json_encode(['error' => 'missing_fields']);
    exit;
}
$user = $_POST['username'];
$duration = intval($_POST['duration']);
$sql = "INSERT INTO stats (username, duration) VALUES ('$user', $duration)";
$conn->query($sql);
echo json_encode(['success' => true]);
?>

<?php
// get_books.php
include 'config.php';
$res = $conn->query("SELECT * FROM books");
$data = [];
while ($row = $res->fetch_assoc()) $data[] = $row;
echo json_encode($data);
?>
