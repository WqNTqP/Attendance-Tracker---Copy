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
    $db = new Database();
    $stmt = $db->conn->prepare("SELECT SESSION_ID, HTE_ID FROM intern_details WHERE INTERNS_ID = ?");
    $stmt->execute([$student_id]);
    $internDetails = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($internDetails) {   
        $sessionId = $internDetails['SESSION_ID'];
        $hteId = $internDetails['HTE_ID'];
    } else {
        $sessionId = null;
        $hteId = null;
    }
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    $sessionId = null;
    $hteId = null;
}

$currentDate = date('Y-m-d');

// Fetch student details for display
try {
    $stmt = $db->conn->prepare("SELECT NAME FROM student WHERE STUDENT_ID = ?");
    $stmt->execute([$student_id]);
    $studentDetails = $stmt->fetch(PDO::FETCH_ASSOC);
    $studentName = $studentDetails['NAME'] ?? 'Student';
} catch (PDOException $e) {
    $studentName = 'Student';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/attendance.css">
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>Student Dashboard</title>
</head>
<body>
    <div class="page">
        <div class="top-header">
            <button id="sidebarToggle" class="sidebar-toggle" aria-label="Toggle Sidebar">&#9776;</button>
            <div class="sidebar-logo" style="margin-left: 1rem; cursor: pointer;" onclick="window.location.href='student_dashboard.php';">
                <h2 class="logo" style="cursor: pointer;">ATTENDANCE TRACKER</h2>
            </div>
            <div class="user-profile" id="userProfile">
                <span id="userName"><?php echo htmlspecialchars($studentName); ?> &#x25BC;</span>
                <div class="user-dropdown" id="userDropdown" style="display:none;">
                    <button id="btnProfile">Profile</button>
                    <button id="logoutBtn">Logout</button>
                </div>
            </div>
        </div>

        <div class="sidebar">
            <ul class="sidebar-menu">
                <li class="sidebar-item active" id="dashboardTab">Dashboard</li>
                <li class="sidebar-item" id="attendanceTab">Attendance</li>
                <li class="sidebar-item" id="historyTab">History</li>
            </ul>
        </div>

        <div class="content-area">
            <div class="attendance-area" id="attendanceArea">
                <h3>Today's Attendance</h3>
                <div class="attendance-date" id="currentDate"></div>
                <p id="attendanceStatus" class="attendance-status">Not Checked In</p>
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

            <div class="current-week-area" id="currentWeek" style="margin: 20px; font-size: 16px; font-weight: bold;"></div>

            <div class="attendance-history-area" id="attendanceHistoryArea">
                <!-- Attendance history will be populated here -->
            </div>
        </div>
    </div>

    <input type="hidden" id="hiddenStudentId" value="<?php echo htmlspecialchars($student_id); ?>">
    <input type="hidden" id="hiddenSessionId" value="<?php echo htmlspecialchars($sessionId ?? ''); ?>">
    <input type="hidden" id="hiddenHteId" value="<?php echo htmlspecialchars($hteId ?? ''); ?>">

    <script src="js/jquery.js"></script>
    <script src="js/student_dashboard.js"></script>
    <script>
        // Add sidebar toggle functionality
        document.getElementById('sidebarToggle').addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('sidebar-open');
        });

        // User profile dropdown
        document.getElementById('userProfile').addEventListener('click', function() {
            const dropdown = document.getElementById('userDropdown');
            dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const userProfile = document.getElementById('userProfile');
            const userDropdown = document.getElementById('userDropdown');
            if (!userProfile.contains(event.target)) {
                userDropdown.style.display = 'none';
            }
        });

        // Logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function() {
            window.location.href = 'ajaxhandler/studentLogout.php';
        });

        // Profile button
        document.getElementById('btnProfile').addEventListener('click', function() {
            alert('Profile functionality to be implemented');
        });
    </script>
</body>
</html>
