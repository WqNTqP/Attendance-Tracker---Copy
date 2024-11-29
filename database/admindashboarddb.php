<?php 
// Start the session
session_start();

// Check if the user is logged in
if(isset($_SESSION["admin_user"])) {
    $cdrid = $_SESSION["admin_user"];
    
    // Assuming you have a Database class to handle connections
    require_once $_SERVER['DOCUMENT_ROOT'] . "/Attendance Tracker - Copy - NP/database/database.php"; // Adjust the path as necessary

    $dbo = new Database();
    
    // Fetch admin details
    $stmt = $dbo->conn->prepare("SELECT * FROM coordinator WHERE COORDINATOR_ID = :cdrid AND ROLE = 'ADMIN'");
    $stmt->execute([':cdrid' => $cdrid]);
    $adminDetails = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($adminDetails) {
        // Admin is logged in, you can display their details
        $adminId = htmlspecialchars($adminDetails['COORDINATOR_ID']);
        $name = htmlspecialchars($adminDetails['NAME']);
        $email = htmlspecialchars($adminDetails['EMAIL']);
        $contactNumber = htmlspecialchars($adminDetails['CONTACT_NUMBER']);
        $department = htmlspecialchars($adminDetails['DEPARTMENT']);
        $hteId = htmlspecialchars($adminDetails['HTE_ID']);
        
        // Fetch session ID associated with the admin's HTE_ID from the intern_details table
        $stmt = $dbo->conn->prepare("
            SELECT DISTINCT SESSION_ID
            FROM intern_details
            WHERE HTE_ID = :hteId
        ");
        $stmt->execute([':hteId' => $hteId]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);
        $sessionId = $session ? htmlspecialchars($session['SESSION_ID']) : 'Not Assigned';

        // Fetch pending attendance records
        $stmt = $dbo->conn->prepare("SELECT * FROM pending_attendance WHERE status = 'pending'");
        $stmt->execute();
        $pendingRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        // Not an admin or doesn't exist
        echo "You are not logged in as an admin.";
        exit();
    }
} else {
    // Not logged in
    header("location: admin.php"); // Redirect to the login page
    die();
}
?>