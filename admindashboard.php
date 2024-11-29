<?php 
// Include the database and session handling
require_once $_SERVER['DOCUMENT_ROOT'] . "/Attendance Tracker - Copy - NP/database/admindashboarddb.php"; // Include the database connection and admin details fetching

// Fetch pending attendance records
$stmt = $dbo->conn->prepare("SELECT * FROM pending_attendance WHERE status = 'pending'");
$stmt->execute();
$pendingRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/admindashboard.css">
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>HTE Dashboard</title>
</head>
<body>
    <h1>Welcome, <?php echo htmlspecialchars($name); ?></h1> <!-- Displaying the admin's name -->


    
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
                        <td><?php echo htmlspecialchars($record['INTERNS_ID']); ?></td> <!-- Use INTERNS_ID -->
                        <td><?php echo htmlspecialchars($record['INTERNS_ID']); ?></td> <!-- Assuming you want to show the same ID -->
                        <td><?php echo htmlspecialchars($record['TIMEIN'] ?? '--:--'); ?></td> <!-- Display Time In -->
                        <td><?php echo htmlspecialchars($record['TIMEOUT'] ?? '--:--'); ?></td> <!-- Display Time Out -->
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
                <th>Manger ID</th>
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

        <div class="logout-area">
                <button class="btnlogout" id="btnlogout"><span>LOGOUT</span></button>
            </div>
    </div>


    <script src="js/jquery.js"></script>
    <script src="js/admindashboard.js"></script>
</body>
</html>