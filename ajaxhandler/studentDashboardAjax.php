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

            
            case "getAttendanceHistory":
                $studentId = $_POST['studentId'] ?? null;
                $startDate = $_POST['startDate'] ?? null;
                $endDate = $_POST['endDate'] ?? null;
            
                if (!$studentId) {
                    sendResponse('error', null, 'Student ID is required');
                    break;
                }
            
                try {
                    // Base query to fetch attendance for the student
                    $query = "SELECT * FROM interns_attendance WHERE INTERNS_ID = ?";
                    $params = [$studentId];
            
                    // Check if startDate and endDate are provided and add to query
                    if ($startDate && $endDate) {
                        $query .= " AND ON_DATE BETWEEN ? AND ?";
                        $params[] = $startDate;
                        $params[] = $endDate;
                    }
            
                    $query .= " ORDER BY ON_DATE DESC";
            
                    // Execute the query
                    $stmt = $dbo->conn->prepare($query);
                    $stmt->execute($params);
            
                    // Fetch results
                    $attendanceHistory = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
                    // Return results
                    sendResponse('success', $attendanceHistory, 'Attendance history retrieved successfully');
                } catch (Exception $e) {
                    // Handle errors gracefully
                    logError("Error retrieving attendance history: " . $e->getMessage());
                    sendResponse('error', null, 'Error retrieving attendance history');
                }
            break;

            case "recordPendingAttendance":
                $studentId = $_POST['studentId'] ?? null; // INTERNS_ID
                $type = $_POST['type'] ?? null; // This will be 'timein' or 'timeout'
                $hteId = $_POST['hteId'] ?? null; // HTE_ID
                $currentDate = date('Y-m-d'); // Current date
                $currentTime = date('H:i'); // Current time
            
                // Validate required parameters
                if (!$studentId || !$type || !$hteId) {
                    sendResponse('error', null, 'Missing required parameters');
                }
            
                try {
                    // Check for existing record for today
                    $stmt = $dbo->conn->prepare("SELECT * FROM pending_attendance WHERE INTERNS_ID = ? AND ON_DATE = ?");
                    $stmt->execute([$studentId, $currentDate]);
                    $existingRecord = $stmt->fetch(PDO::FETCH_ASSOC);
            
                    if ($type == 'timein') {
                        if (!$existingRecord) {
                            // No existing record, insert new timein
                            $stmt = $dbo->conn->prepare("INSERT INTO pending_attendance (INTERNS_ID, HTE_ID, ON_DATE, TIMEIN, TIMEOUT, STATUS) VALUES (?, ?, ?, ?, ?, 'pending')");
                            $stmt->execute([$studentId, $hteId, $currentDate, $currentTime, null]);
                            error_log("Inserted new timein record");
                        } else {
                            // If timein already exists, return an error
                            sendResponse('error', null, 'Time In already recorded for today');
                        }
                    } elseif ($type == 'timeout') {
                        if ($existingRecord && $existingRecord['TIMEIN']) {
                            // Update existing record with timeout
                            $stmt = $dbo->conn->prepare("UPDATE pending_attendance SET TIMEOUT = ? WHERE INTERNS_ID = ? AND ON_DATE = ?");
                            $stmt->execute([$currentTime, $studentId, $currentDate]);
                            error_log("Updated timeout for existing record");
                        } else {
                            // If no timein exists, return an error
                            sendResponse('error', null, 'No Time In record found for today. Please record Time In first.');
                        }
                    }
            
                    sendResponse('success', null, 'Attendance recorded successfully');
                } catch (Exception $e) {
                    sendResponse('error', null, 'Database error: ' . $e->getMessage());
                }
            break;
            
            
}
?>