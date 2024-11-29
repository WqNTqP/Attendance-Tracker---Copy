<?php
// session_start();
// $path = $_SERVER['DOCUMENT_ROOT'];
// require_once $path . "/Attendance Tracker - Copy - NP/database/database.php";
// require_once $path . "/Attendance Tracker - Copy - NP/database/attendanceDetails.php"; // Ensure this is correct


// header('Content-Type: application/json');
// ini_set('display_errors', 0); // Suppress error display
// ini_set('log_errors', 1); // Log errors to a file
// error_reporting(E_ALL); // Report all errors


// if (isset($_POST['action']) && $_POST['action'] == 'updateStudent') {
//     $dbo = new Database(); // Instantiate the Database class
//     $attendanceDetails = new attendanceDetails(); // Instantiate the attendanceDetails class

//     // Gather and sanitize data from the form with trimming for extra spaces
//     $studentId = isset($_POST['studentId']) ? trim($_POST['studentId']) : null;
//     $name = isset($_POST['name']) ? trim($_POST['name']) : null;
//     $age = isset($_POST['age']) ? trim($_POST['age']) : null;
//     $gender = isset($_POST['gender']) ? trim($_POST['gender']) : null;
//     $email = isset($_POST['email']) ? trim($_POST['email']) : null;
//     $contact_number = isset($_POST['contactNumber']) ? trim($_POST['contactNumber']) : null;

//     // Cast studentId to an integer
//     $studentId = (int) $studentId; // Ensures studentId is an integer

//     // Validate the input data
//     if (empty($studentId) || empty($name) || empty($age) || empty($gender) || empty($email) || empty($contact_number)) {
//         // echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
//         exit(); // Stop the script if validation fails
//     }

//     // Validate studentId to ensure it's a valid number
//     if (!is_numeric($studentId)) {
//         // echo json_encode(['status' => 'error', 'message' => 'Invalid Student ID.']);
//         exit(); // Stop the script if student ID is invalid
//     }

//     // Validate age to ensure it's a valid number
//     if (!is_numeric($age) || $age < 1 || $age > 120) {
//         // echo json_encode(['status' => 'error', 'message' => 'Please enter a valid age.']);
//         exit(); // Stop the script if age is invalid
//     }

//     // Validate email format
//     if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
//         // echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
//         exit(); // Stop the script if the email is invalid
//     }

//     // Validate contact number (Ensure it's numeric and of a reasonable length)
//     if (!is_numeric($contact_number) || strlen($contact_number) < 10 || strlen($contact_number) > 15) {
//         // echo json_encode(['status' => 'error', 'message' => 'Invalid contact number.']);
//         exit(); // Stop the script if the contact number is invalid
//     }

//     // Call the updateStudent method to update the details in the database
//     $result = $attendanceDetails->updateStudent($dbo, $studentId, $name, $age, $gender, $email, $contact_number);

//     // Respond based on the result of the update
//     if ($result) {
//         // echo json_encode(['status' => 'success', 'message' => 'Student details updated successfully.']);
//     } else {
//         // echo json_encode(['status' => 'error', 'message' => 'Failed to update student details.']);
//     }
// }
?>
