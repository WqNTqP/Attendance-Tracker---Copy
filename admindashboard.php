<?php 
// Include the database and session handling
require_once $_SERVER['DOCUMENT_ROOT'] . "/Attendance Tracker - Copy - NP/database/admindashboarddb.php";

// Fetch pending attendance records
$stmt = $dbo->conn->prepare("SELECT * FROM pending_attendance WHERE status = 'pending'");
$stmt->execute();
$pendingRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get admin details for display
$adminName = $name ?? 'Admin';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/attendance.css">
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>HTE Dashboard</title>
</head>
<body>
    <div class="page">
        <div class="top-header">
            <button id="sidebarToggle" class="sidebar-toggle" aria-label="Toggle Sidebar">&#9776;</button>
            <div class="sidebar-logo" style="margin-left: 1rem; cursor: pointer;" onclick="window.location.href='admindashboard.php';">
                <h2 class="logo" style="cursor: pointer;">ATTENDANCE TRACKER</h2>
            </div>
            <div class="user-profile" id="userProfile">
                <span id="userName"><?php echo htmlspecialchars($adminName); ?> &#x25BC;</span>
                <div class="user-dropdown" id="userDropdown" style="display:none;">
                    <button id="btnProfile">Profile</button>
                    <button id="logoutBtn">Logout</button>
                </div>
            </div>
        </div>

        <div class="sidebar">
            <ul class="sidebar-menu">
                <li class="sidebar-item active" id="dashboardTab">Dashboard</li>
                <li class="sidebar-item" id="pendingTab">Pending Attendance</li>
                <li class="sidebar-item" id="reportsTab">Reports</li>
            </ul>
        </div>

        <div class="content-area">
            <h1>Welcome, <?php echo htmlspecialchars($name); ?></h1>

            <div class="pending-attendance">
                <h3>Pending Attendance Records</h3>
                <table>
                    <tr>
                        <th>Student ID</th>
                        <th>Intern ID</th>
                        <th>Time In</th>
                        <th>Time Out</th>
                        <th>Action</th>
                    </tr>
                    <?php if (!empty($pendingRecords)): ?>
                        <?php foreach ($pendingRecords as $record): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($record['INTERNS_ID']); ?></td>
                            <td><?php echo htmlspecialchars($record['INTERNS_ID']); ?></td>
                            <td><?php echo htmlspecialchars($record['TIMEIN'] ?? '--:--'); ?></td>
                            <td><?php echo htmlspecialchars($record['TIMEOUT'] ?? '--:--'); ?></td>
                            <td>
                                <button onclick="approveAttendance(<?php echo $record['ID']; ?>)" class="btn-accept">Approve</button>
                                <button onclick="deletePendingAttendance(<?php echo $record['ID']; ?>)" class="btn-decline">Decline</button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="5">No pending attendance records found.</td>
                        </tr>
                    <?php endif; ?>
                </table>
            </div>

            <!-- Display Admin Details -->
            <div class="admin-details">
                <h3>HTE Manager Details</h3>
                <table class="admin-details-table">
                    <tr>
                        <th>Manager ID</th>
                        <td><?php echo htmlspecialchars($adminId); ?></td>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <td><?php echo htmlspecialchars($name); ?></td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td><?php echo htmlspecialchars($email); ?></td>
                    </tr>
                    <tr>
                        <th>Contact Number</th>
                        <td><?php echo htmlspecialchars($contactNumber); ?></td>
                    </tr>
                    <tr>
                        <th>Department</th>
                        <td><?php echo htmlspecialchars($department); ?></td>
                    </tr>
                    <tr>
                        <th>HTE ID</th>
                        <td><?php echo htmlspecialchars($hteId); ?></td>
                    </tr>
                    <tr>
                        <th>Session ID</th>
                        <td><?php echo $sessionId; ?></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <script src="js/jquery.js"></script>
    <script src="js/admindashboard.js"></script>
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
            window.location.href = 'ajaxhandler/adminLogout.php';
        });

        // Profile button
        document.getElementById('btnProfile').addEventListener('click', function() {
            alert('Profile functionality to be implemented');
        });
    </script>
</body>
</html>
