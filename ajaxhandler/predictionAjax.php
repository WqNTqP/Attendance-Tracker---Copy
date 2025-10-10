
<?php
// predictionAjax.php - Backend for Prediction Tab (Student OJT Placement Prediction)
header('Content-Type: application/json');
session_start();
require_once '../database/database.php';

$response = ["success" => false, "students" => [], "error" => ""];

if (!isset($_SESSION["current_user"])) {
    $response["error"] = "Not logged in.";
    echo json_encode($response);
    exit;
}

$db = new Database();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'savePrediction') {
    // Save prediction and analysis to pre_assessment table
    $student_id = $_POST['student_id'] ?? null;
    $ojt_placement = $_POST['ojt_placement'] ?? null;
    $reasoning = $_POST['prediction_reasoning'] ?? null;
    $probabilities = $_POST['prediction_probabilities'] ?? null;
    $confidence = $_POST['prediction_confidence'] ?? null;
    if (!$student_id || !$ojt_placement) {
        echo json_encode(["success" => false, "error" => "Missing student_id or ojt_placement"]);
        exit;
    }
    try {
        $sql = "UPDATE pre_assessment SET ojt_placement = ?, prediction_reasoning = ?, prediction_probabilities = ?, prediction_confidence = ? WHERE STUDENT_ID = ?";
        $stmt = $db->conn->prepare($sql);
        $stmt->execute([$ojt_placement, $reasoning, $probabilities, $confidence, $student_id]);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
    exit;
}

// Default: fetch students and their predictions
$coordinator_id = $_SESSION["current_user"];
try {
    // ...existing code...
    $sql = "SELECT id.INTERNS_ID, id.STUDENT_ID, id.NAME, id.SURNAME, hte.NAME AS HTE_NAME
            FROM internship_needs ineed
            JOIN intern_details idet ON ineed.HTE_ID = idet.HTE_ID
            JOIN interns_details id ON idet.INTERNS_ID = id.INTERNS_ID
            JOIN host_training_establishment hte ON idet.HTE_ID = hte.HTE_ID
            WHERE ineed.COORDINATOR_ID = ?";
    $stmt = $db->conn->prepare($sql);
    $stmt->execute([$coordinator_id]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($students as $student) {
        $student_id = $student['STUDENT_ID'];
        // Get pre-assessment data
        $pre_sql = "SELECT * FROM pre_assessment WHERE STUDENT_ID = ?";
        $pre_stmt = $db->conn->prepare($pre_sql);
        $pre_stmt->execute([$student_id]);
        $pre = $pre_stmt->fetch(PDO::FETCH_ASSOC);

        // ...existing code...
        $required = [
            'CC 102','CC 103','PF 101','CC 104','IPT 101','IPT 102','CC 106','CC 105',
            'IM 101','IM 102','HCI 101','HCI 102','WS 101','NET 101','NET 102',
            'IAS 101','IAS 102','CAP 101','CAP 102','SP 101','soft_skill','communication_skill'
        ];
        $missing = [];
        $valid = true;
        if ($pre) {
            foreach ($required as $col) {
                if (!isset($pre[$col]) || $pre[$col] === null || $pre[$col] === "") {
                    $missing[] = $col;
                    $valid = false;
                }
            }
        } else {
            $valid = false;
            $missing = $required;
        }
        // Status
        $status = ($pre && $pre['soft_skill'] !== null && $pre['communication_skill'] !== null) ? "Rated" : "Not Rated";
        // Prepare student data
        $student_data = [
            "INTERNS_ID" => $student['INTERNS_ID'],
            "STUDENT_ID" => $student['STUDENT_ID'],
            "NAME" => $student['SURNAME'] . ", " . $student['NAME'],
            "HTE_ASSIGNED" => $student['HTE_NAME'],
            "STATUS" => $status,
            "valid" => $valid,
            "missing" => $missing,
            "pre_assessment" => $pre
        ];
        $response["students"][] = $student_data;
    }
    $response["success"] = true;
} catch (Exception $e) {
    $response["error"] = $e->getMessage();
}

echo json_encode($response);
exit;
?>
