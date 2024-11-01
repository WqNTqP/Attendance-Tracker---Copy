<?php
date_default_timezone_set('Asia/Manila');
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

$path = dirname(__FILE__) . '/../';
require_once $path . "database/database.php";

error_log("Full path to database.php: " . $path . "database/database.php");

function sendResponse($status, $data, $message = '') {
    echo json_encode(array("status" => $status, "data" => $data, "message" => $message));
    exit;
}

function logError($message) {
    error_log(date('[Y-m-d H:i] ') . "ERROR: " . $message . "\n", 3, 'error.log');
}

try {
    $dbo = new Database();
} catch (Exception $e) {
    logError("Database connection failed: " . $e->getMessage());
    sendResponse('error', null, 'Database connection failed');
}

$action = isset($_POST['action']) ? $_POST['action'] : '';

if (empty($action)) {
    sendResponse('error', null, 'No action specified');
}

switch ($action) {
    case "getStudentDetails":
        $studentId = $_POST['studentId'] ?? null;
        if (!$studentId) {
            sendResponse('error', null, 'Student ID is required');
        }
        try {
            $stmt = $dbo->conn->prepare("SELECT * FROM interns_details WHERE INTERNS_ID = ?");
            $stmt->execute([$studentId]);
            $studentDetails = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($studentDetails) {
                sendResponse('success', $studentDetails, 'Student details retrieved successfully');
            } else {
                sendResponse('error', null, 'Student not found');
            }
        } catch (Exception $e) {
            logError("Error retrieving student details: " . $e->getMessage());
            sendResponse('error', null, 'Error retrieving student details');
        }
        break;

    case "getInternshipDetails":
        $studentId = $_POST['studentId'] ?? null;
        if (!$studentId) {
            sendResponse('error', null, 'Student ID is required');
        }
        try {
            $stmt = $dbo->conn->prepare("SELECT * FROM intern_details WHERE INTERNS_ID = ?");
            $stmt->execute([$studentId]);
            $internshipDetails = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($internshipDetails) {
                sendResponse('success', $internshipDetails, 'Internship details retrieved successfully');
            } else {
                sendResponse('error', null, 'Internship details not found');
            }
        } catch (Exception $e) {
            logError("Error retrieving internship details: " . $e->getMessage());
            sendResponse('error', null, 'Error retrieving internship details');
        }
        break;

    case "getAttendanceStatus":
        $studentId = $_POST['studentId'] ?? null;
        $date = $_POST['date'] ?? date('Y-m-d');
        if (!$studentId) {
            sendResponse('error', null, 'Student ID is required');
        }
        try {
            $stmt = $dbo->conn->prepare("
                SELECT ON_DATE, TIMEIN, TIMEOUT 
                FROM interns_attendance 
                WHERE INTERNS_ID = ? AND ON_DATE = ?
            ");
            $stmt->execute([$studentId, $date]);
            $attendanceData = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($attendanceData) {
                sendResponse('success', $attendanceData, 'Attendance status retrieved successfully');
            } else {
                sendResponse('success', ['ON_DATE' => $date, 'TIMEIN' => null, 'TIMEOUT' => null], 'No attendance record for today');
            }
        } catch (Exception $e) {
            logError("Error retrieving attendance status: " . $e->getMessage());
            sendResponse('error', null, 'Error retrieving attendance status');
        }
        break;

        case "recordAttendance":
            $studentId = $_POST['studentId'] ?? null;
            $type = $_POST['type'] ?? null;
            $sessionId = $_POST['sessionId'] ?? null;
            $hteId = $_POST['hteId'] ?? null;
            
            if (!$studentId || !$type || !$sessionId || !$hteId) {
                sendResponse('error', null, 'Missing required parameters');
            }
            
            $currentDate = date('Y-m-d');
            $currentTime = date('H:i');
            
            try {
                $dbo->conn->beginTransaction();
        
                // Debug log
                error_log("Recording attendance for Student ID: $studentId, Type: $type, Session ID: $sessionId, HTE ID: $hteId");
        
                $stmt = $dbo->conn->prepare("
                    SELECT COORDINATOR_ID 
                    FROM internship_needs 
                    WHERE HTE_ID = ? AND SESSION_ID = ?
                ");
                $stmt->execute([$hteId, $sessionId]);
                $coordinatorId = $stmt->fetchColumn();
        
                // Debug log
                error_log("Coordinator ID found: " . ($coordinatorId ? $coordinatorId : 'Not found'));
        
                if (!$coordinatorId) {
                    throw new Exception("Unable to find coordinator for this internship. HTE_ID: $hteId, SESSION_ID: $sessionId");
                }
        
                $stmt = $dbo->conn->prepare("SELECT * FROM interns_attendance WHERE INTERNS_ID = ? AND ON_DATE = ?");
                $stmt->execute([$studentId, $currentDate]);
                $existingRecord = $stmt->fetch(PDO::FETCH_ASSOC);
        
                // Debug log
                error_log("Existing record: " . json_encode($existingRecord));
        
                if ($existingRecord) {
                    if ($type == 'timein' && !$existingRecord['TIMEIN']) {
                        $stmt = $dbo->conn->prepare("UPDATE interns_attendance SET TIMEIN = ? WHERE INTERNS_ID = ? AND ON_DATE = ?");
                        $stmt->execute([$currentTime, $studentId, $currentDate]);
                        error_log("Updated TIMEIN for existing record");
                    } elseif ($type == 'timeout' && !$existingRecord['TIMEOUT']) {
                        $stmt = $dbo->conn->prepare("UPDATE interns_attendance SET TIMEOUT = ? WHERE INTERNS_ID = ? AND ON_DATE = ?");
                        $stmt->execute([$currentTime, $studentId, $currentDate]);
                        error_log("Updated TIMEOUT for existing record");
                    } else {
                        throw new Exception("Attendance already recorded for this type today.");
                    }
                } else {
                    $stmt = $dbo->conn->prepare("INSERT INTO interns_attendance (COORDINATOR_ID, HTE_ID, ID, INTERNS_ID, ON_DATE, TIMEIN, TIMEOUT) VALUES (?, ?, ?, ?, ?, ?, ?)");
                    $timeIn = ($type == 'timein') ? $currentTime : null;
                    $timeOut = ($type == 'timeout') ? $currentTime : null;
                    $stmt->execute([$coordinatorId, $hteId, $sessionId, $studentId, $currentDate, $timeIn, $timeOut]);
                    error_log("Inserted new attendance record");
                }
        
                $dbo->conn->commit();
        
                sendResponse('success', null, 'Attendance recorded successfully');
            } catch (Exception $e) {
                $dbo->conn->rollBack();
                error_log("Error recording attendance: " . $e->getMessage());
                sendResponse('error', null, 'Error recording attendance: ' . $e->getMessage());
            }
            break;
}
?>