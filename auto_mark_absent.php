<?php
session_start();
require_once $_SERVER['DOCUMENT_ROOT'] . "/Attendance Tracker - Copy - NP/database/database.php";

header('Content-Type: application/json');

// Check if user is admin (for manual trigger)
if (isset($_GET['manual']) && !isset($_SESSION["admin_user"])) {
    echo json_encode(['status' => 'error', 'message' => 'Admin access required']);
    exit();
}

$dbo = new Database();

// Get current date and time
$currentDate = date('Y-m-d');
$currentTime = date('H:i:s');
$cutoffTime = '16:00:00'; // 4:00 PM

// Check if it's after 4:00 PM (for automated runs)
if (!isset($_GET['manual']) && $currentTime < $cutoffTime) {
    echo json_encode(['status' => 'info', 'message' => 'Not yet 4:00 PM', 'current_time' => $currentTime]);
    exit();
}

try {
    // Get all active coordinators/admins
    $stmt = $dbo->conn->prepare("SELECT DISTINCT COORDINATOR_ID FROM coordinator WHERE ROLE = 'ADMIN'");
    $stmt->execute();
    $coordinators = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $totalMarked = 0;
    $errors = [];

    foreach ($coordinators as $coordinator) {
        $coordinatorId = $coordinator['COORDINATOR_ID'];

        // Get admin's HTE_ID
        $stmt = $dbo->conn->prepare("SELECT HTE_ID FROM coordinator WHERE COORDINATOR_ID = :cdrid AND ROLE = 'ADMIN'");
        $stmt->execute([':cdrid' => $coordinatorId]);
        $adminDetails = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$adminDetails) continue;

        $hteId = $adminDetails['HTE_ID'];

        // Get all interns for this coordinator
        $stmt = $dbo->conn->prepare("
            SELECT id.INTERNS_ID, id.STUDENT_ID 
            FROM intern_details id
            JOIN internship_needs in ON id.INTERNS_ID = in.INTERNS_ID
            WHERE in.COORDINATOR_ID = :coordinatorId
        ");
        $stmt->execute([':coordinatorId' => $coordinatorId]);
        $interns = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($interns as $intern) {
            $internId = $intern['INTERNS_ID'];
            $studentId = $intern['STUDENT_ID'];

            // Check if attendance record already exists for today
            $stmt = $dbo->conn->prepare("
                SELECT COUNT(*) as count 
                FROM interns_attendance 
                WHERE INTERN_ID = :internId 
                AND ON_DATE = :currentDate
                AND HTE_ID = :hteId
                AND COORDINATOR_ID = :coordinatorId
            ");
            $stmt->execute([
                ':internId' => $internId,
                ':currentDate' => $currentDate,
                ':hteId' => $hteId,
                ':coordinatorId' => $coordinatorId
            ]);
            $exists = $stmt->fetch(PDO::FETCH_ASSOC)['count'] > 0;

            if (!$exists) {
                // Insert absent record
                $stmt = $dbo->conn->prepare("
                    INSERT INTO interns_attendance 
                    (COORDINATOR_ID, HTE_ID, INTERN_ID, STUDENT_ID, ON_DATE, TIMEIN, TIMEOUT, STATUS)
                    VALUES 
                    (:coordinatorId, :hteId, :internId, :studentId, :currentDate, NULL, NULL, 'Absent')
                ");
                
                try {
                    $stmt->execute([
                        ':coordinatorId' => $coordinatorId,
                        ':hteId' => $hteId,
                        ':internId' => $internId,
                        ':studentId' => $studentId,
                        ':currentDate' => $currentDate
                    ]);
                    $totalMarked++;
                } catch (PDOException $e) {
                    $errors[] = "Error marking intern $internId as absent: " . $e->getMessage();
                }
            }
        }
    }

    $response = [
        'status' => 'success',
        'message' => "Marked $totalMarked students as absent for $currentDate",
        'marked_count' => $totalMarked,
        'current_date' => $currentDate,
        'current_time' => $currentTime
    ];

    if (!empty($errors)) {
        $response['errors'] = $errors;
        $response['status'] = 'partial';
    }

    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
}
?>
