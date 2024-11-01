<?php 
session_start();
if(!isset($_SESSION["student_user"]))
{
    header("location:student_login.php");
    die();
}
$student_id = $_SESSION["student_user"];

$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker - Copy - NP/database/database.php";

try {
    $db = new Database(); // Assuming you have a Database class
    $stmt = $db->conn->prepare("SELECT SESSION_ID, HTE_ID FROM intern_details WHERE INTERNS_ID = ?");
    $stmt->execute([$student_id]);
    $internDetails = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($internDetails) {
        $sessionId = $internDetails['SESSION_ID'];
        $hteId = $internDetails['HTE_ID'];
    } else {
        // Handle case where no internship details are found
        $sessionId = null;
        $hteId = null;
        // You might want to redirect the student or show an error message
    }
} catch (PDOException $e) {
    // Handle database error
    error_log("Database error: " . $e->getMessage());
    // You might want to redirect the student or show an error message
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/student_dashboard.css">
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>Student Dashboard</title>
</head>
<body>
    <div class="page">
        <div class="header-area">
            <div class="logo-area">
                <h2 class="logo">STUDENT DASHBOARD</h2>
            </div>
            <div class="logout-area">
                <button class="btnlogout" id="btnLogout"><span>LOGOUT</span></button>
            </div>
        </div>

        <div class="attendance-area" id="attendanceArea">
            <h3>Today's Attendance</h3>
            <div class="attendance-date" id="currentDate"></div>
            <p id="attendanceStatus" class="attendance-status"></p>
            <div class="attendance-times">
                <div class="attendance-time">
                    <span>Time In</span>
                    <strong id="timeInDisplay">--:--</strong>
                </div>
                <div class="attendance-time">
                    <span>Time Out</span>
                    <strong id="timeOutDisplay">--:--</strong>
                </div>
            </div>
            <div class="attendance-buttons">
                <button id="timeInButton" class="btn">Time In</button>
                <button id="timeOutButton" class="btn">Time Out</button>
            </div>
            <div id="attendanceStatusMessage" class="attendance-status-message"></div>
        </div>

        <div class="student-details-area" id="studentDetailsArea">
            <!-- Student details will be populated here -->
        </div>

        <div class="internship-details-area" id="internshipDetailsArea">
            <!-- Internship details will be populated here -->
        </div>
    </div>

    <input type="hidden" id="hiddenStudentId" value="<?php echo htmlspecialchars($student_id); ?>">
    <input type="hidden" id="hiddenSessionId" value="<?php echo htmlspecialchars($sessionId ?? ''); ?>">
    <input type="hidden" id="hiddenHteId" value="<?php echo htmlspecialchars($hteId ?? ''); ?>">

    <script src="js/jquery.js"></script>
    <script src="js/student_dashboard.js"></script>
</body>
</html>