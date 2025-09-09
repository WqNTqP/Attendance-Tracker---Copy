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
$stmt = $db->conn->prepare("SELECT NAME, SURNAME, profile_picture FROM interns_details WHERE INTERNS_ID = ?");
    $stmt->execute([$student_id]);
    $studentDetails = $stmt->fetch(PDO::FETCH_ASSOC);
$studentName = ($studentDetails['NAME'] ?? '') . ' ' . ($studentDetails['SURNAME'] ?? 'Student');
error_log("Profile Picture: " . ($studentDetails['profile_picture'] ?? 'Not Found'));
} catch (PDOException $e) {
    $studentName = 'Student';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <link rel="stylesheet" href="css/student_dashboard.css">
    <!-- <link rel="stylesheet" href="css/attendance.css"> -->
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>Student Dashboard - Attendance Tracker</title>
</head>
<body>
    <!-- Top Header with Hamburger Menu -->
    <div class="top-header">
        <button id="sidebarToggle" class="hamburger-menu">
            <i class="fas fa-bars"></i>
        </button>
        <div class="sidebar-logo">
            <div class="logo" onclick="window.location.href='student_dashboard.php'">
                <span>ATTENDANCE TRACKER</span>
            </div>
        </div>
        <div class="user-profile">
            <span id="userName"><?php echo htmlspecialchars($studentName); ?></span>
            <span id="draftUserName" style="display:none;"></span>
            <div class="user-dropdown" id="userDropdown">
                <button onclick="window.location.href='student_dashboard.php'">
                    <i class="fas fa-tachometer-alt"></i>
                    Dashboard
                </button>
                <button onclick="loadProfileDetails()">
                    <i class="fas fa-user"></i>
                    Profile
                </button>
                <button onclick="window.location.href='ajaxhandler/studentLogout.php'">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </div>
        </div>
    </div>

    <!-- Sidebar Navigation -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="logo" onclick="window.location.href='student_dashboard.php'">
                <i class="fas fa-calendar-check"></i>
                <span>ATTENDANCE TRACKER</span>
            </div>
        </div>
        
        <nav class="sidebar-nav">
            <ul class="sidebar-menu">
                <li class="sidebar-item active" data-tab="dashboard">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </li>
                <li class="sidebar-item" data-tab="attendance">
                    <i class="fas fa-clock"></i>
                    <span>Attendance</span>
                </li>
                <li class="sidebar-item" data-tab="history">
                    <i class="fas fa-history"></i>
                    <span>History</span>
                </li>
                <li class="sidebar-item" data-tab="report">
                    <i class="fas fa-file-alt"></i>
                    <span>Report</span>
                </li>
            </ul>
        </nav>
        
        <div class="sidebar-footer">
            <div class="sidebar-bottom-buttons">
                <!-- Removed Coordinator Details Button -->
                <!-- Removed Logout Button from Sidebar Footer -->
            </div>
        </div>
    </aside>

    <!-- Main Content Area -->
    <div class="content-area">
        <main class="main-content">
            <!-- Header -->
            <header class="main-header">
                <div class="header-left">
                    <h1>Student Dashboard</h1>
                    <p class="welcome-message">Welcome back, <?php echo htmlspecialchars(explode(' ', $studentName)[0]); ?>!</p>
                </div>
                <div class="header-right">
                    <div class="current-date" id="currentDateHeader">
                        <i class="fas fa-calendar-day"></i>
                        <span>Loading date...</span>
                    </div>
                </div>
            </header>

<!-- Main Content Tabs -->
<div class="content-tabs">
    <!-- Dashboard Tab -->
    <div class="tab-content active" id="dashboardTab">
        <!-- Quick Stats -->
        <section class="stats-grid" id="statsSection">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-content">
                    <h3>Present Days</h3>
                    <span class="stat-value" id="presentDays"><?php echo htmlspecialchars($presentDays); ?></span>
                    <span class="stat-label">This Week</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-content">
                    <h3>Total Hours</h3>
                    <span class="stat-value" id="totalHours">0h</span>
                    <span class="stat-label">Total Hours</span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-calendar-week"></i>
                </div>
                <div class="stat-content">
                    <h3>Current Week</h3>
                    <span class="stat-value" id="currentWeekRange">Loading...</span>
                    <span class="stat-label"><?php echo date('Y'); ?></span>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-percentage"></i>
                </div>
                <div class="stat-content">
                    <h3>Attendance Rate</h3>
                    <span class="stat-value" id="attendanceRate">0%</span>
                    <span class="stat-label">Overall</span>
                </div>
            </div>
        </section>
        
        <div class="dashboard-grid">
            <!-- Weekly Overview Card -->
            <div class="card overview-card">
                <div class="card-header">
                    <h3><i class="fas fa-chart-bar"></i> Weekly Overview</h3>
                </div>
                <div class="card-body">
                    <div class="week-overview" id="weekOverview">
                        <div class="overview-loading">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span>Loading weekly data...</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity Card -->
            <div class="card activity-card">
                <div class="card-header">
                    <h3><i class="fas fa-list-alt"></i> Recent Activity</h3>
                </div>
                <div class="card-body">
                    <div class="recent-activity" id="recentActivity">
                        <div class="activity-loading">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span>Loading recent activity...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Attendance Tab -->
    <div class="tab-content" id="attendanceTab">
        <div class="card attendance-card">
            <div class="card-header">
                <h3><i class="fas fa-calendar-day"></i> Today's Attendance</h3>
                <span class="card-badge" id="todayStatusBadge">Not Checked In</span>
            </div>
            <div class="card-body">
                <div class="attendance-display">
                    <div class="time-display">
                        <div class="time-box">
                            <label>Time In</label>
                            <div class="time-value" id="timeInDisplay">--:--</div>
                        </div>
                        <div class="time-box">
                            <label>Time Out</label>
                            <div class="time-value" id="timeOutDisplay">--:--</div>
                        </div>
                    </div>
                    
                    <div class="attendance-actions">
                        <button id="timeInButton" class="btn btn-primary btn-large">
                            <i class="fas fa-sign-in-alt"></i>
                            Time In
                        </button>
                        <button id="timeOutButton" class="btn btn-secondary btn-large">
                            <i class="fas fa-sign-out-alt"></i>
                            Time Out
                        </button>
                    </div>
                    
                    <div id="attendanceStatusMessage" class="status-message"></div>
                </div>
            </div>
        </div>
    </div>

                <!-- Attendance History Tab -->
                <div class="tab-content" id="historyTab">
                    <div class="card">
                        <div class="card-header">
                            <h3><i class="fas fa-history"></i> Attendance History</h3>
                    <div class="date-filter" style="display: flex; align-items: center; gap: 10px;">
                        <button id="clearFiltersBtn" class="btn-clear-filter" style="display: none;" title="Clear all filters">
                            <i class="fas fa-times"></i> Clear
                        </button>
                        <select id="monthFilter" style="display: none;">
                            <option value="">Select Month</option>
                        </select>
                        <select id="yearFilter" style="display: none; margin: 0 10px;">
                            <option value="">Select Year</option>
                        </select>
                        <select id="historyFilter" style="margin-left: 10px;">
                            <option value="week">This Week</option>
                            <option value="lastweek">Last Week</option>
                            <option value="month">This Month</option>
                            <option value="lastmonth">Last Month</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                        </div>
                        <div class="card-body">

                            <div id="attendanceHistoryArea">
                                <!-- History will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Profile Tab -->
                <div class="tab-content" id="profileTab">
                    <!-- Profile tab content removed -->
                </div>
<div class="tab-content" id="reportTab">
    <div class="card">
        <div class="card-header">
            <h3><i class="fas fa-file-alt"></i> Weekly Activity Report</h3>
        </div>
        <div class="card-body">
            <input type="hidden" id="reportWeek" value="<?php echo date('W'); ?>">
<div id="reportContainer">
                <div class="report-editor">
    <div class="weekly-report-inputs">
        <h4>Weekly Report</h4>
        <div class="weekly-description">
            <div class="report-field">
                <label for="challengesFaced">Challenges Faced:</label>
                <textarea id="challengesFaced" name="challengesFaced" rows="4" placeholder="Describe the challenges you faced this week..."></textarea>
            </div>
            <div class="report-field">
                <label for="lessonsLearned">Lessons Learned:</label>
                <textarea id="lessonsLearned" name="lessonsLearned" rows="4" placeholder="What lessons did you learn this week..."></textarea>
            </div>
            <div class="report-field">
                <label for="goalsNextWeek">Goals for Next Week:</label>
                <textarea id="goalsNextWeek" name="goalsNextWeek" rows="4" placeholder="What are your goals for next week..."></textarea>
            </div>
        </div>
    </div>

    <div class="everyday-image">
        <div class="day-report">
            <!-- Monday Description textarea removed as per request -->
            <label>Monday Images:</label>
                <div class="image-upload-area" data-day="monday">
                        <div class="upload-placeholder" id="uploadPlaceholderMonday" onclick="document.getElementById('imageUploadMonday').click();">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag & drop images here or click to browse</p>
                            <input type="file" id="imageUploadMonday" multiple accept="image/*" style="display: none;">
                        </div>
                    <!-- Removed Browse Images button as requested -->
                    <div id="imagePreviewMonday" class="image-preview"></div>
                </div>
        </div>

        <div class="day-report">
            <!-- Tuesday Description textarea removed as per request -->
            <label>Tuesday Images:</label>
            <div class="image-upload-area" data-day="tuesday">
                        <div class="upload-placeholder" id="uploadPlaceholderTuesday" onclick="document.getElementById('imageUploadTuesday').click();">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag & drop images here or click to browse</p>
                            <input type="file" id="imageUploadTuesday" multiple accept="image/*" style="display: none;">
                        </div>
                <!-- Removed Browse Images button as requested -->
                <div id="imagePreviewTuesday" class="image-preview"></div>
            </div>
        </div>

        <div class="day-report">
            <!-- Wednesday Description textarea removed as per request -->
            <label>Wednesday Images:</label>
            <div class="image-upload-area" data-day="wednesday">
                        <div class="upload-placeholder" id="uploadPlaceholderWednesday" onclick="document.getElementById('imageUploadWednesday').click();">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag & drop images here or click to browse</p>
                            <input type="file" id="imageUploadWednesday" multiple accept="image/*" style="display: none;">
                        </div>
                <!-- Removed Browse Images button as requested -->
                <div id="imagePreviewWednesday" class="image-preview"></div>
            </div>
        </div>

        <div class="day-report">
            <!-- Thursday Description textarea removed as per request -->
            <label>Thursday Images:</label>
            <div class="image-upload-area" data-day="thursday">
                        <div class="upload-placeholder" id="uploadPlaceholderThursday" onclick="document.getElementById('imageUploadThursday').click();">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag & drop images here or click to browse</p>
                            <input type="file" id="imageUploadThursday" multiple accept="image/*" style="display: none;">
                        </div>
                <!-- Removed Browse Images button as requested -->
                <div id="imagePreviewThursday" class="image-preview"></div>
            </div>
        </div>

        <div class="day-report">
            <!-- Friday Description textarea removed as per request -->
            <label>Friday Images:</label>
            <div class="image-upload-area" data-day="friday">
                        <div class="upload-placeholder" id="uploadPlaceholderFriday" onclick="document.getElementById('imageUploadFriday').click();">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Drag & drop images here or click to browse</p>
                            <input type="file" id="imageUploadFriday" multiple accept="image/*" style="display: none;">
                        </div>
                <!-- Removed Browse Images button as requested -->
                <div id="imagePreviewFriday" class="image-preview"></div>
            </div>
        </div>
    </div>
                    
                    <div class="report-actions">
                        <!-- Removed Browse Images button as requested -->
                        <button id="previewReportBtn" class="btn btn-info">
                            <i class="fas fa-eye"></i> Preview Report
                        </button>
                        <button id="saveDraftBtn" class="btn btn-secondary">
                            <i class="fas fa-save"></i> Save Draft
                        </button>
                        <button id="submitReportBtn" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Submit Report
                        </button>
                        <button id="exportPdfBtn" class="btn btn-success" style="display: none;">
                            <i class="fas fa-file-pdf"></i> Export PDF
                        </button>
                    </div>
                    
<div id="reportStatus" class="report-status"></div>
<div id="draftPreview" class="draft-preview">
    <h4><i class="fas fa-eye"></i> Draft Preview</h4>
    <div id="draftContentPreview"></div>
    <div id="draftImagesPreview"></div>
</div>
                </div>

                <div id="reportDraft" class="report-draft">
                    <div class="report-header">
                        <h3><i class="fas fa-file-alt"></i> Weekly Activity Report Preview</h3>
                        <div class="report-meta">
                            <div class="report-period">Week <span id="draftWeekNumber"><?php echo date('W'); ?></span> (<span id="draftWeekRange"><?php echo date('M d', strtotime('monday this week')); ?> - <?php echo date('M d', strtotime('friday this week')); ?>, <?php echo date('Y'); ?></span>)</div>
                            <div class="report-status draft">Draft</div>
                        </div>
                    </div>

                    <div class="report-grid">
                        <div class="day-section">
                            <h4>Monday</h4>
                            <div class="day-content">
                                <p id="draftMondayContent">No activities reported for Monday.</p>
                                <div class="day-images" id="draftMondayImages">
                                    <!-- Images will be populated here -->
                                </div>
                            </div>
                        </div>

                        <div class="day-section">
                            <h4>Tuesday</h4>
                            <div class="day-content">
                                <p id="draftTuesdayContent">No activities reported for Tuesday.</p>
                                <div class="day-images" id="draftTuesdayImages">
                                    <!-- Images will be populated here -->
                                </div>
                            </div>
                        </div>

                        <div class="day-section">
                            <h4>Wednesday</h4>
                            <div class="day-content">
                                <p id="draftWednesdayContent">No activities reported for Wednesday.</p>
                                <div class="day-images" id="draftWednesdayImages">
                                    <!-- Images will be populated here -->
                                </div>
                            </div>
                        </div>

                        <div class="day-section">
                            <h4>Thursday</h4>
                            <div class="day-content">
                                <p id="draftThursdayContent">No activities reported for Thursday.</p>
                                <div class="day-images" id="draftThursdayImages">
                                    <!-- Images will be populated here -->
                                </div>
                            </div>
                        </div>

                        <div class="day-section">
                            <h4>Friday</h4>
                            <div class="day-content">
                                <p id="draftFridayContent">No activities reported for Friday.</p>
                                <div class="day-images" id="draftFridayImages">
                                    <!-- Images will be populated here -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="weekly-report-content">
                        <div class="report-section">
                            <h4>Challenges Faced:</h4>
                            <p id="draftChallengesFaced">No challenges reported</p>
                        </div>
                        <div class="report-section">
                            <h4>Lessons Learned:</h4>
                            <p id="draftLessonsLearned">No lessons reported</p>
                        </div>
                        <div class="report-section">
                            <h4>Goals for Next Week:</h4>
                            <p id="draftGoalsNextWeek">No goals reported</p>
                        </div>
                    </div>

                    <div class="report-footer">
                        <div class="submitted-date">Created: <span id="draftCreatedDate"><?php echo date('M d, Y'); ?></span></div>
                        <div class="updated-date">Last Updated: <span id="draftUpdatedDate"><?php echo date('M d, Y'); ?></span></div>
                    </div>
                </div>

                <div id="submittedReports" class="submitted-reports" style="display: none;">
                    <h4>Submitted Reports</h4>
                    <div id="reportsList"></div>
                </div>
            </div>
        </div>
    </div>
</div>
            </div>
        </main>

    <!-- Profile Modal -->
    <div id="profileModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Profile Details</h2>
                <button class="modal-close" id="closeProfileModal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div id="profileModalContent">
                    <!-- Profile modal content will be populated here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Hidden Fields -->
    <input type="hidden" id="hiddenStudentId" value="<?php echo htmlspecialchars($student_id); ?>">
    <input type="hidden" id="hiddenSessionId" value="<?php echo htmlspecialchars($sessionId ?? ''); ?>">
    <input type="hidden" id="hiddenHteId" value="<?php echo htmlspecialchars($hteId ?? ''); ?>">

    <script src="js/jquery.js"></script>
    <script src="js/student_dashboard.js"></script>
    <script>
        // Initialize dashboard
        $(document).ready(function() {
            // Load initial data
            loadDashboardStats();
            loadAttendanceStatus();
            loadCurrentWeek();
            loadWeekOverview();
            loadRecentActivity();
            updateCurrentDate();
            
            // Tab navigation
$('.sidebar-item').click(function() {
    const tab = $(this).data('tab');
    $('.sidebar-item').removeClass('active');
    $(this).addClass('active');
    $('.tab-content').removeClass('active');
    $(`#${tab}Tab`).addClass('active');

    // Load attendance history if the history tab is selected
    if (tab === 'history') {
        loadAttendanceHistory();
    }
});
            
            // Sidebar toggle - handled by external student_dashboard.js
            // This prevents conflict with the click-outside functionality
            
            // Update date every minute
            setInterval(updateCurrentDate, 60000);
        });
        
        function updateCurrentDate() {
            const today = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                timeZone: 'Asia/Manila'
            };
            const formattedDate = today.toLocaleDateString('en-PH', options);
            $('#currentDateHeader span').text(formattedDate);
        }
        
        function printAttendance() {
            // Placeholder for print functionality
            alert('Print functionality will be implemented soon');
        }
    </script>
</body>
</html>
