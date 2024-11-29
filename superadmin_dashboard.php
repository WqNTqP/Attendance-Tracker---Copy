<?php
session_start();
if (!isset($_SESSION['current_user_role']) || $_SESSION['current_user_role'] !== 'SUPERADMIN') {
    header("Location: index.php"); // Redirect to admin page if not authorized
    exit();
}

// Include necessary files for database connection and functions
require_once $_SERVER['DOCUMENT_ROOT'] . "/Attendance Tracker - Copy - NP/database/database.php";

// Fetch existing coordinators/admins for display
$dbo = new Database();
$stmt = $dbo->conn->prepare("SELECT * FROM coordinator");
$stmt->execute();
$coordinators = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/superadmin_dashboard.css"> <!-- Add your CSS file -->
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>Super Admin Dashboard</title>
</head>
<body>
    <h1>Super Admin Dashboard</h1>

    <button id="btnAddCoordinator">Add New Coordinator/Admin</button>

    <h2>Existing Coordinators/Admins</h2>
    <table>
        <thead>
            <tr>
                <th>Coordinator ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Department</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($coordinators as $coordinator): ?>
                <tr>
                    <td><?php echo htmlspecialchars($coordinator['COORDINATOR_ID']); ?></td>
                    <td><?php echo htmlspecialchars($coordinator['NAME']); ?></td>
                    <td><?php echo htmlspecialchars($coordinator['EMAIL']); ?></td>
                    <td><?php echo htmlspecialchars($coordinator['CONTACT_NUMBER']); ?></td>
                    <td><?php echo htmlspecialchars($coordinator['DEPARTMENT']); ?></td>
                    <td><?php echo htmlspecialchars($coordinator['ROLE']); ?></td>
                    <td>
                        <button onclick="deleteCoordinator('<?php echo $coordinator['COORDINATOR_ID']; ?>')">Delete</button>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <!-- Modal for Adding Coordinator -->
    <div id="addCoordinatorModal" style="display:none;">
        <form id="addCoordinatorForm">
            <h2>Add New Coordinator/Admin</h2>
            <label for="coordinatorId">Coordinator ID:</label>
            <input type="text" id="coordinatorId" name="coordinatorId" required>

            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="contactNumber">Contact Number:</label>
            <input type="text" id="contactNumber" name="contactNumber" required>

            <label for="department">Department:</label>
            <input type="text" id="department" name="department" required>

            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>

            <label for="role">Role:</label>
            <select id="role" name="role" required>
                <option value="COORDINATOR">Coordinator</option>
                <option value="ADMIN">Admin</option>
            </select>

            <!-- HTE Dropdown Container -->
            <div id="hteDropdownContainer" style="display:none;">
                <label for="hteSelect">Select HTE:</label>
                <select id="hteSelect" name="hteId">
                    <!-- HTE options will be populated here -->
                </select>
            </div>

            <button type="submit">Add</button>
            <button type="button" id="closeModal">Close</button>
        </form>
    </div>

    <script src="js/jquery.js"></script>
    <script src="js/superadmin_dashboard.js"></script>
</body>
</html>