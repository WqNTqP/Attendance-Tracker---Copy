<?php
session_start();
$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker - Copy - NP/database/database.php";
require_once $path."/Attendance Tracker - Copy - NP/database/sessionDetails.php";
require_once $path."/Attendance Tracker - Copy - NP/database/coordinator.php";
require_once $path."/Attendance Tracker - Copy - NP/database/buildingRegistrationDetails.php";
require_once $path."/Attendance Tracker - Copy - NP/database/attendanceDetails.php";
require('C:/xampp/htdocs/Attendance Tracker - Copy - NP/fpdf/fpdf.php');
// Prevent any direct output of errors
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Start output buffering to catch any unexpected output
ob_start();

// Set JSON header
header('Content-Type: application/json');



function deleteExistingPDFs() {
    $directory = __DIR__; // Current directory
    $files = glob($directory . '/*.pdf');
    foreach($files as $file) {
        if(is_file($file)) {
            unlink($file);
        }
    }
}



function createPDFReport($list, $filename) {
    $error = 0;
    $path = dirname(__FILE__) . '/';
    $finalFileName = $path . $filename;

    try {
        $pdf = new FPDF();
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);
        
        // Add a title
        $pdf->Cell(0, 10, 'Attendance Report', 0, 1, 'C');
        $pdf->Ln(5);

        // Add session, HTE, and coordinator info
        $pdf->SetFont('Arial', '', 12);
        for ($i = 0; $i < 3; $i++) {
            $pdf->Cell(40, 10, $list[$i][0], 0);
            $pdf->Cell(0, 10, $list[$i][1], 0, 1);
        }
        $pdf->Ln(5);

        // Add table headers
        $pdf->SetFont('Arial', 'B', 12);
        $header = $list[3];
        $widths = array(30, 30, 60, 30, 30, 30);
        for($i = 0; $i < count($header); $i++) {
            $pdf->Cell($widths[$i], 10, $header[$i], 1, 0, 'C');
        }
        $pdf->Ln();

        // Add data to the PDF
        $pdf->SetFont('Arial', '', 10);
        for ($i = 4; $i < count($list); $i++) {
            $line = $list[$i];
            $pdf->Cell($widths[0], 10, $line['INTERNS_ID'], 1, 0, 'C');
            $pdf->Cell($widths[1], 10, $line['STUDENT_ID'], 1, 0, 'C');
            $pdf->Cell($widths[2], 10, $line['SURNAME'] . ', ' . $line['NAME'], 1, 0, 'L');
            $pdf->Cell($widths[4], 10, $line['TIMEIN'], 1, 0, 'C');
            $pdf->Cell($widths[5], 10, $line['TIMEOUT'], 1, 0, 'C');
            $pdf->Ln();
        }

        // Output the PDF file
        $pdf->Output('F', $finalFileName);
    } catch (Exception $e) {
        $error = 1;
        error_log("Error creating PDF: " . $e->getMessage());
        echo "Error: " . $e->getMessage();
    }

    return $filename;
}


  if(isset($_REQUEST['action']))
  {
    $action = $_REQUEST['action'];
    if($action=="getSession")
    {
        //mao ni ang mag kuha ug information sa database
        $dbo=new Database();
        $sobj=new SessionDetails();
        $rv=$sobj->getSession($dbo);

        //$rv=["2023 SPRING","2023 AUTUMN"];
        echo json_encode($rv);
    }
    // data: {cdrid:cdrid,sessionid:sessionid,action:"getHTE"},
    if($action=="getHTE")
    {
        //mao ni ang mag kuha ug mga HTE list sa current coordinator didto sa database
        
        $cdrid=$_POST['cdrid'];
        $sessionid=$_POST['sessionid'];
        $dbo=new Database();
        $fo=new coordinator();
        $rv=$fo->getHTEInASession($dbo,$sessionid,$cdrid);
        // $rv=[];
        echo json_encode($rv);
    }


    if($action=="getStudentList")
    {
        $dbo = new Database();
        $sessionid = $_POST['sessionid'];
        $classid = $_POST['classid'];
        $cdrid = $_POST['cdrid'];
        $ondate = $_POST['ondate'];

        $ado = new attendanceDetails();
        $crgo = new BuildingRegistrationDetails();

        $allStudents = $crgo->getRegisteredStudents($dbo, $sessionid, $classid);
        $presentStudents = $ado->getPresentListOfAClassByACDROnDate($dbo, $sessionid, $classid, $cdrid, $ondate);

        foreach($allStudents as &$student)
        {
            $student['ispresent']='NO';// default value
            $student['timein']='';// default value
            $student['timeout']='';// default value
            foreach($presentStudents as $presentStudent)
            {
                if($student['INTERNS_ID']==$presentStudent['INTERNS_ID'])
                {
                    $student['ispresent']='YES';
                    $student['timein']=$presentStudent['TIMEIN'];
                    $student['timeout']=$presentStudent['TIMEOUT'];
                    break;
                }
            }
            // Add display_name: Surname, Name
            $student['display_name'] = $student['SURNAME'] . ', ' . $student['NAME'];
        }

        // Sort students alphabetically by SURNAME, then NAME
        usort($allStudents, function($a, $b) {
            $surnameCmp = strcasecmp($a['SURNAME'], $b['SURNAME']);
            if ($surnameCmp === 0) {
                return strcasecmp($a['NAME'], $b['NAME']);
            }
            return $surnameCmp;
        });

        echo json_encode($allStudents);
    }


    if($action=="saveattendance")
    {
        $dbo = new Database();
        $studentid = $_POST['studentid'];
        $hteid = $_POST['hteid'];
        $coordinatorid = $_POST['coordinatorid'];
        $sessionid = $_POST['sessionid'];
        $ondate = $_POST['ondate'];
        $timein = isset($_POST['timein']) ? $_POST['timein'] : null;
        $timeout = isset($_POST['timeout']) ? $_POST['timeout'] : null;

        $ado = new attendanceDetails();
        $rv = $ado->saveAttendance($dbo, $sessionid, $hteid, $coordinatorid, $studentid, $ondate, $timein, $timeout);
        echo json_encode($rv);
    }



    if ($action == "downloadReport") {
        $hteid = $_POST['classid'];
        $sessionid = $_POST['sessionid'];
        $cdrid = $_POST['cdrid'];
        $ondate = $_POST['ondate'];
    
        $dbo = new Database();
        $ado = new attendanceDetails();
    
        $list = $ado->getAttendanceReport($dbo, $sessionid, $hteid, $cdrid, $ondate);
        error_log("Attendance report data: " . json_encode($list));
    
        // Delete existing PDF files
        deleteExistingPDFs();
    
        // Use a consistent filename
        $filename = 'attendance_report.pdf';
    
        // Create the PDF report
        $result = createPDFReport($list, $filename);
        error_log("PDF creation result: " . $result);
    
        // Return the filename as a JSON response
        $rv = ["filename" => $filename];
        echo json_encode($rv);
    }
    
    
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
            
        if ($action == "addStudent") {
            // Collect all necessary data from POST
            $intern_id = $_POST['internId'] ?? null;
            $student_id = $_POST['studentId'] ?? null;
            $name = $_POST['name'] ?? null;
            $surname = $_POST['surname'] ?? null;
            $age = $_POST['age'] ?? null;
            $gender = $_POST['gender'] ?? null;
            $email = $_POST['email'] ?? null;
            $contact_number = $_POST['contactNumber'] ?? null;
            $coordinator_id = $_SESSION['current_user'] ?? null;
            $hte_id = $_POST['hteId'] ?? null; // This line is now optional
            $session_id = $_POST['sessionId'] ?? null; // This line is now optional
        
            // Add these lines for debugging
            error_log("Received POST data: " . print_r($_POST, true));
            error_log("HTE_ID: " . $hte_id);
            error_log("Coordinator ID: " . $coordinator_id);
        
            // Check for required fields except hte_id and session_id
            if (!$student_id || !$name || !$age || !$gender || !$email || !$contact_number) {
                echo json_encode(['success' => false, 'message' => 'Error: All student fields are required.']);
                return; // Stop execution if validation fails
            }
    
            // Debugging: Log all parameters to check their values
            error_log("Adding student with: internId=$intern_id, studentId=$student_id, name=$name, surname=$surname, age=$age, gender=$gender, email=$email, contact_number=$contact_number, coordinator_id=$coordinator_id, hte_id=$hte_id, session_id=$session_id");
    
            $dbo = new Database(); // Create a Database instance
            $ado = new attendanceDetails(); // Create an instance of attendanceDetails
    
            // Add this new logging block right before calling addStudent
            error_log("About to call addStudent with the following parameters:");
            error_log("student_id: " . $student_id);
            error_log("name: " . $name);
            error_log("surname: " . $surname);
            error_log("age: " . $age);
            error_log("gender: " . $gender);
            error_log("email: " . $email);
            error_log("contact_number: " . $contact_number);
            error_log("coordinator_id: " . $coordinator_id);
            error_log("hte_id: " . $hte_id);
            error_log("session_id: " . $session_id);
    
            try {
                // Call addStudent with the database instance
                $new_intern_id = $ado->addStudent($dbo, $student_id, $name, $surname, $age, $gender, $email, $contact_number, $coordinator_id, $hte_id, $session_id);
                echo json_encode(['success' => true, 'message' => 'Student added successfully', 'new_intern_id' => $new_intern_id]);
            } catch (Exception $e) {
                error_log("Exception caught: " . $e->getMessage());
                echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
            }
        }
    }
    
    

    if (isset($_POST['action'])) {
        $action = $_POST['action'];

        if ($action == "addHTE") {
            // Collect all necessary data from POST
            $name = $_POST['NAME'] ?? null;
            $industry = $_POST['INDUSTRY'] ?? null;
            $address = $_POST['ADDRESS'] ?? null;
            $contact_email = $_POST['CONTACT_EMAIL'] ?? null;
            $contact_person = $_POST['CONTACT_PERSON'] ?? null;
            $contact_number = $_POST['CONTACT_NUMBER'] ?? null;
            $coordinator_id = $_SESSION['current_user'] ?? null;
            $session_id = $_POST['sessionId'] ?? null;

            // Add these lines for debugging
            error_log("Received POST data: " . print_r($_POST, true));
            error_log("Coordinator ID: " . $coordinator_id);
            error_log("Session ID: " . $session_id);

            // Check for required fields
            if (!$name || !$industry || !$address || !$contact_email || !$contact_person || !$contact_number || !$coordinator_id || !$session_id) {
                echo json_encode(['success' => false, 'message' => 'Error: All fields are required.']);
                return; // Stop execution if validation fails
            }

            // Debugging: Log all parameters to check their values
            error_log("Adding HTE with: name=$name, industry=$industry, address=$address, contact_email=$contact_email, contact_person=$contact_person, contact_number=$contact_number, coordinator_id=$coordinator_id, session_id=$session_id");

            $dbo = new Database(); // Create a Database instance
            $hdo = new attendanceDetails(); // Create an instance of hteDetails

            // Add this new logging block right before calling addHTE
            error_log("About to call addHTE with the following parameters:");
            error_log("name: " . $name);
            error_log("industry: " . $industry);
            error_log("address: " . $address);
            error_log("contact_email: " . $contact_email);
            error_log("contact_person: " . $contact_person);
            error_log("contact_number: " . $contact_number);
            error_log("coordinator_id: " . $coordinator_id);
            error_log("session_id: " . $session_id);

            try {
                // Call addHTE with the database instance
                $new_hte_id = $hdo->addHTE($dbo, $name, $industry, $address, $contact_email, $contact_person, $contact_number, $coordinator_id, $session_id);
                echo json_encode(['success' => true, 'message' => 'HTE added successfully', 'new_hte_id' => $new_hte_id]);
            } catch (Exception $e) {
                error_log("Exception caught: " . $e->getMessage());
                echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
            }
        }

        if ($action == "addHTEControl") {
            // Collect all necessary data from POST
            $name = $_POST['NAME'] ?? null;
            $industry = $_POST['INDUSTRY'] ?? null;
            $address = $_POST['ADDRESS'] ?? null;
            $contact_email = $_POST['CONTACT_EMAIL'] ?? null;
            $contact_person = $_POST['CONTACT_PERSON'] ?? null;
            $contact_number = $_POST['CONTACT_NUMBER'] ?? null;
            $coordinator_id = $_SESSION['current_user'] ?? null;
            $session_id = $_POST['sessionId'] ?? null;

            // Add these lines for debugging
            error_log("Received POST data for addHTEControl: " . print_r($_POST, true));
            error_log("Coordinator ID: " . $coordinator_id);
            error_log("Session ID: " . $session_id);

            // Check for required fields
            if (!$name || !$industry || !$address || !$contact_email || !$contact_person || !$contact_number || !$coordinator_id || !$session_id) {
                echo json_encode(['success' => false, 'message' => 'Error: All fields are required.']);
                return; // Stop execution if validation fails
            }

            // Debugging: Log all parameters to check their values
            error_log("Adding HTE via Control with: name=$name, industry=$industry, address=$address, contact_email=$contact_email, contact_person=$contact_person, contact_number=$contact_number, coordinator_id=$coordinator_id, session_id=$session_id");

            $dbo = new Database(); // Create a Database instance
            $hdo = new attendanceDetails(); // Create an instance of hteDetails

            // Add this new logging block right before calling addHTE
            error_log("About to call addHTE for Control with the following parameters:");
            error_log("name: " . $name);
            error_log("industry: " . $industry);
            error_log("address: " . $address);
            error_log("contact_email: " . $contact_email);
            error_log("contact_person: " . $contact_person);
            error_log("contact_number: " . $contact_number);
            error_log("coordinator_id: " . $coordinator_id);
            error_log("session_id: " . $session_id);

            try {
                // Call addHTE with the database instance
                $new_hte_id = $hdo->addHTE($dbo, $name, $industry, $address, $contact_email, $contact_person, $contact_number, $coordinator_id, $session_id);
                echo json_encode(['success' => true, 'message' => 'HTE added successfully via Control', 'new_hte_id' => $new_hte_id]);
            } catch (Exception $e) {
                error_log("Exception caught in addHTEControl: " . $e->getMessage());
                echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
            }
        }
    }
    
////////////////////////////////////////////////////////////////////////////




    if (isset($_POST['action']) && $_POST['action'] == 'getCoordinatorDetails') {
        header('Content-Type: application/json');
        
        try {
            $dbo = new Database();
            $attendanceDetails = new attendanceDetails();
    
            $cdrid = $_POST['cdrid'] ?? null;
            if (!$cdrid) {
                throw new Exception("Coordinator ID not provided.");
            }
    
            $coordinator = $attendanceDetails->getCoordinatorDetails($dbo, $cdrid);
            
            $response = [
                'success' => true,
                'data' => $coordinator
            ];
        } catch (Exception $e) {
            $response = [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    
        echo json_encode($response);
        exit;
    }

    


if ($action == "deleteStudent") {
    $studentId = $_POST['studentId'] ?? null;
    if (!$studentId) {
        echo json_encode(['success' => false, 'message' => 'Student ID is required.']);
        exit;
    }
    $dbo = new Database();
    $ado = new attendanceDetails();
    $response = $ado->deleteStudent($dbo, $studentId);
    echo json_encode($response);
}

if ($action=="getStudentsBySessionAndHTE") {
    $sessionId = $_POST['sessionid'] ?? null;
    $hteId = $_POST['hteid'] ?? null;
    $cdrid = $_POST['cdrid'] ?? null;

    if (!$sessionId || !$hteId || !$cdrid) {
        echo json_encode([]);
        exit;
    }

    $dbo = new Database();
    $ado = new attendanceDetails();

    try {
        // Call the method to get students by session and HTE
        $students = $ado->getStudentsBySessionAndHTE($dbo, $sessionId, $hteId, $cdrid);
        echo json_encode($students);
    } catch (Exception $e) {
        error_log("Error in getStudentsBySessionAndHTE AJAX: " . $e->getMessage());
        echo json_encode([]);
    }
}

if ($action == "deleteStudents") {
    $studentIds = $_POST['studentIds'] ?? [];
    if (empty($studentIds)) {
        echo json_encode(['success' => false, 'message' => 'No students selected for deletion.']);
        exit;
    }

    $dbo = new Database();
    $ado = new attendanceDetails();

    try {
        $result = $ado->deleteStudents($dbo, $studentIds);
        echo json_encode(['success' => $result, 'message' => $result ? 'Students deleted successfully.' : 'Failed to delete students.']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error deleting students: ' . $e->getMessage()]);
    }
}

    if ($action == "getHTEList") {
        $dbo = new Database();
        $ado = new attendanceDetails();

        try {
            // Get all HTEs for the dropdown
            $c = "SELECT hte.HTE_ID, hte.NAME, hte.INDUSTRY
                  FROM host_training_establishment hte
                  ORDER BY hte.NAME";
            $s = $dbo->conn->prepare($c);
            $s->execute();
            $htes = $s->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(['success' => true, 'htes' => $htes]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error loading HTEs: ' . $e->getMessage()]);
        }
    }

    if ($action == "assignStudents") {
        $studentIds = isset($_POST['studentIds']) ? json_decode($_POST['studentIds'], true) : [];
        $sessionId = $_POST['sessionId'] ?? null;
        $hteId = $_POST['hteId'] ?? null;
        $coordinatorId = $_SESSION['current_user'] ?? null;

        if (empty($studentIds) || !$sessionId || !$hteId || !$coordinatorId) {
            echo json_encode(['success' => false, 'message' => 'Missing required parameters.']);
            exit;
        }

        $dbo = new Database();
        $ado = new attendanceDetails();

        try {
            $result = $ado->assignStudents($dbo, $studentIds, $sessionId, $hteId, $coordinatorId);
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error assigning students: ' . $e->getMessage()]);
        }
    }

    if ($action == "getAllStudentsUnderCoordinator") {
        $cdrid = $_POST['cdrid'] ?? null;
        if (!$cdrid) {
            echo json_encode(['success' => false, 'message' => 'Coordinator ID not provided.']);
            exit;
        }

        $dbo = new Database();
        $ado = new attendanceDetails();

        try {
            $students = $ado->getAllStudentsUnderCoordinator($dbo, $cdrid);
            echo json_encode(['success' => true, 'data' => $students]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error fetching students: ' . $e->getMessage()]);
        }
    }

// Handle deleteHTE action with permission check
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'deleteHTE') {
    $hteId = $_POST['hteId'];
    $currentUserId = $_SESSION['current_user'] ?? null;

    // Database connection
    $dbo = new Database();
    $response = [];

    if (!$currentUserId) {
        $response['success'] = false;
        $response['message'] = 'User not logged in.';
        echo json_encode($response);
        exit;
    }

    try {
        // Check if the current user is assigned to this HTE
        $stmt = $dbo->conn->prepare("
            SELECT COUNT(*) as count 
            FROM internship_needs 
            WHERE HTE_ID = :hteId AND COORDINATOR_ID = :coordinatorId
        ");
        $stmt->execute([
            ':hteId' => $hteId,
            ':coordinatorId' => $currentUserId
        ]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] == 0) {
            $response['success'] = false;
            $response['message'] = 'You do not have permission to delete this HTE. It is not assigned to you.';
            echo json_encode($response);
            exit;
        }

        // Check if there are any students assigned to this HTE
        $stmt = $dbo->conn->prepare("
            SELECT COUNT(*) as count 
            FROM intern_details 
            WHERE HTE_ID = :hteId
        ");
        $stmt->execute([':hteId' => $hteId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] > 0) {
            $response['success'] = false;
            $response['message'] = 'Cannot delete HTE. There are students assigned to it.';
            echo json_encode($response);
            exit;
        }

        // Prepare the SQL statement to delete from host_training_establishment
        $stmt = $dbo->conn->prepare("DELETE FROM host_training_establishment WHERE HTE_ID = :hteId");
        $stmt->bindParam(':hteId', $hteId, PDO::PARAM_INT);
        
        // Execute the deletion
        if ($stmt->execute()) {
            // Also delete from internship_needs
            $stmt = $dbo->conn->prepare("DELETE FROM internship_needs WHERE HTE_ID = :hteId AND COORDINATOR_ID = :coordinatorId");
            $stmt->execute([
                ':hteId' => $hteId,
                ':coordinatorId' => $currentUserId
            ]);
            
            $response['success'] = true;
            $response['message'] = 'HTE deleted successfully.';
        } else {
            $response['success'] = false;
            $response['message'] = 'Failed to delete HTE.';
        }
    } catch (PDOException $e) {
        $response['success'] = false;
        $response['message'] = 'Error: ' . $e->getMessage();
    }

    // Return a JSON response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

// Profile management actions
if (isset($_POST['action']) && $_POST['action'] == 'updateCoordinatorProfilePicture') {
    // Clear any previous output and set headers
    if (ob_get_length()) ob_clean();
    header('Content-Type: application/json');

    try {
        error_log("\n=== Profile Picture Update Request ===");
        error_log("POST data: " . print_r($_POST, true));
        error_log("FILES data: " . print_r($_FILES, true));

        if (!isset($_POST['cdrid'])) {
            throw new Exception('Coordinator ID is required');
        }

        $cdrid = $_POST['cdrid'];
        error_log("Updating profile for coordinator: " . $cdrid);

        if (!isset($_FILES['profilePicture']) || $_FILES['profilePicture']['error'] !== 0) {
            throw new Exception('No profile picture uploaded or upload error: ' . 
                ($_FILES['profilePicture']['error'] ?? 'No file uploaded'));
        }

        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $_FILES['profilePicture']['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $allowedTypes)) {
            throw new Exception('Invalid file type. Only JPG and PNG are allowed.');
        }

        // Create upload directory if it doesn't exist
        $uploadDir = __DIR__ . '/../uploads/';
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                throw new Exception('Failed to create upload directory');
            }
        }

        // Generate unique filename
        $extension = pathinfo($_FILES['profilePicture']['name'], PATHINFO_EXTENSION);
        $uniqueId = uniqid();
        $fileName = $uniqueId . '_' . $cdrid . '.' . $extension;
        $targetFilePath = $uploadDir . $fileName;

        error_log("Attempting to move uploaded file to: " . $targetFilePath);

        if (!move_uploaded_file($_FILES['profilePicture']['tmp_name'], $targetFilePath)) {
            throw new Exception('Failed to move uploaded file. Check permissions and path.');
        }

        // Update database
        $attendanceDetails = new attendanceDetails();
        if (!isset($dbo)) {
            $dbo = new Database();
        }

        $updateResult = $attendanceDetails->updateCoordinatorProfilePicture($dbo, $cdrid, $fileName);
        
        if (!$updateResult) {
            // If database update fails, remove the uploaded file
            if (file_exists($targetFilePath)) {
                unlink($targetFilePath);
            }
            throw new Exception('Failed to update profile picture in database');
        }

        echo json_encode([
            'success' => true, 
            'message' => 'Profile picture updated successfully',
            'filename' => $fileName
        ]);

    } catch (Exception $e) {
        error_log("Error updating profile picture: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    exit;
}

if (isset($_POST['action']) && $_POST['action'] == 'updateCoordinatorDetails') {
    $cdrid = $_POST['cdrid'];
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $contactNumber = $_POST['contactNumber'] ?? '';
    $department = $_POST['department'] ?? '';

    $attendanceDetails = new attendanceDetails();
    $updateResult = $attendanceDetails->updateCoordinatorDetails($dbo, $cdrid, $name, $email, $contactNumber, $department);
    if ($updateResult) {
        echo json_encode(['success' => true, 'message' => 'Profile details updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update profile details']);
    }
    exit;
}

if (isset($_POST['action']) && $_POST['action'] == 'verifyCoordinatorPassword') {
    // Clear any previous output
    if (ob_get_length()) ob_clean();
    
    header('Content-Type: application/json'); // Ensure JSON content type
    
    try {
        // Validate input parameters
        $coordinator_id = $_POST['coordinator_id'] ?? $_POST['cdrid'] ?? null;
        $current_password = $_POST['current_password'] ?? '';

        error_log("=== AJAX Request Debug ===");
        error_log("POST data received: " . print_r($_POST, true));
        error_log("Coordinator ID: " . $coordinator_id);
        error_log("Current password received: " . $current_password);

        if (!$coordinator_id) {
            throw new Exception('Coordinator ID is required');
        }

        if (!$current_password) {
            throw new Exception('Password is required');
        }

        // Verify database connection
        if (!isset($dbo)) {
            $dbo = new Database(); // Create new connection if not exists
        }

        if (!$dbo->conn) {
            throw new Exception('Database connection failed');
        }

        $attendanceDetails = new attendanceDetails();
        error_log("Verifying password for coordinator: " . $coordinator_id);
        
        // Try to verify password
        $isValid = $attendanceDetails->verifyCoordinatorPassword($dbo, $coordinator_id, $current_password);
        error_log("Password verification result: " . ($isValid ? "valid" : "invalid"));

        if ($isValid) {
            echo json_encode([
                'success' => true, 
                'message' => 'Password verified'
            ]);
        } else {
            echo json_encode([
                'success' => false, 
                'message' => 'Invalid password',
                'debug' => 'Password verification failed for coordinator ' . $coordinator_id
            ]);
        }

    } catch (Exception $e) {
        error_log("Error in password verification: " . $e->getMessage() . "\n" . $e->getTraceAsString());
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Internal server error occurred', 
            'error' => $e->getMessage(),
            'debug' => true
        ]);
    }
    exit;
}

if (isset($_POST['action']) && $_POST['action'] == 'updateCoordinatorPassword') {
    // Clear any previous output and set headers
    if (ob_get_length()) ob_clean();
    header('Content-Type: application/json');
    
    try {
        error_log("\n=== Password Update Request ===");
        error_log("POST data: " . print_r($_POST, true));
        
        // Ensure we have a database connection
        if (!isset($dbo)) {
            error_log("Creating new database connection");
            $dbo = new Database();
        }
        
        if (!$dbo || !$dbo->conn) {
            throw new Exception("Failed to establish database connection");
        }
        
        // Get and validate input parameters
        $coordinator_id = $_POST['coordinator_id'] ?? null;
        $currentPassword = $_POST['current_password'] ?? '';
        $newPassword = $_POST['new_password'] ?? '';

        error_log("Parsed parameters:");
        error_log("Coordinator ID: " . ($coordinator_id ?? 'null'));
        error_log("Current password length: " . strlen($currentPassword));
        error_log("New password length: " . strlen($newPassword));

        // Validate database connection
        if (!isset($dbo) || !$dbo instanceof Database) {
            error_log("Database connection issue - dbo: " . print_r($dbo, true));
            throw new Exception('Database connection not properly initialized');
        }

        // Validate required parameters
        if (!$coordinator_id) {
            throw new Exception('Coordinator ID is required');
        }

        if (!$currentPassword) {
            throw new Exception('Current password is required');
        }

        if (!$newPassword) {
            throw new Exception('New password is required');
        }

        $attendanceDetails = new attendanceDetails();

        // First verify the current password
        error_log("Verifying current password for coordinator: " . $coordinator_id);
        $isValid = $attendanceDetails->verifyCoordinatorPassword($dbo, $coordinator_id, $currentPassword);
        
        if (!$isValid) {
            error_log("Password verification failed for coordinator: " . $coordinator_id);
            throw new Exception('Current password is incorrect');
        }
        
        error_log("Current password verified successfully. Proceeding with update.");

        // Update the password
        try {
            $updateResult = $attendanceDetails->updateCoordinatorPassword($dbo, $coordinator_id, $newPassword);
            
            if ($updateResult) {
                error_log("Password updated successfully for coordinator: " . $coordinator_id);
                echo json_encode([
                    'success' => true, 
                    'message' => 'Password updated successfully'
                ]);
            } else {
                throw new Exception('Failed to update password in database');
            }
        } catch (Exception $e) {
            error_log("Error during password update: " . $e->getMessage());
            throw new Exception('Error updating password: ' . $e->getMessage());
        }

    } catch (Exception $e) {
        error_log("Password update error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage(),
            'debug' => true
        ]);
    }
    exit;
}

  }
?>
