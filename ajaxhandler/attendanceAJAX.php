<?php
session_start();
$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker - Copy - NP/database/database.php";
require_once $path."/Attendance Tracker - Copy - NP/database/sessionDetails.php";
require_once $path."/Attendance Tracker - Copy - NP/database/coordinator.php";
require_once $path."/Attendance Tracker - Copy - NP/database/buildingRegistrationDetails.php";
require_once $path."/Attendance Tracker - Copy - NP/database/attendanceDetails.php";
require('C:/xampp/htdocs/Attendance Tracker - Copy - NP/fpdf/fpdf.php');
error_reporting(E_ALL);
ini_set('display_errors', 1);
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
            $pdf->Cell($widths[2], 10, $line['NAME'], 1, 0, 'L');
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
        }

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
            $age = $_POST['age'] ?? null;
            $gender = $_POST['gender'] ?? null;
            $email = $_POST['email'] ?? null;
            $contact_number = $_POST['contactNumber'] ?? null;
            $coordinator_id = $_SESSION['current_user'] ?? null;
            $hte_id = $_POST['hteId'] ?? null; // This line is crucial
            $session_id = $_POST['sessionId'] ?? null;
        
            // Add these lines for debugging
            error_log("Received POST data: " . print_r($_POST, true));
            error_log("HTE_ID: " . $hte_id);
            error_log("Coordinator ID: " . $coordinator_id);
        
            // Check if HTE_ID is set
            if (!$hte_id) {
                echo json_encode(['success' => false, 'message' => 'Error: HTE_ID is missing.']);
                return;
            }
    
            // Check for required fields
            if (!$student_id || !$name || !$age || !$gender || !$email || !$contact_number || !$hte_id || !$session_id) {
                echo json_encode(['success' => false, 'message' => 'Error: All fields are required.']);
                return; // Stop execution if validation fails
            }
    
            // Debugging: Log all parameters to check their values
            error_log("Adding student with: internId=$intern_id, studentId=$student_id, name=$name, age=$age, gender=$gender, email=$email, contact_number=$contact_number, coordinator_id=$coordinator_id, hte_id=$hte_id, session_id=$session_id");
    
            $dbo = new Database(); // Create a Database instance
            $ado = new attendanceDetails(); // Create an instance of attendanceDetails
    
            // Add this new logging block right before calling addStudent
            error_log("About to call addStudent with the following parameters:");
            error_log("student_id: " . $student_id);
            error_log("name: " . $name);
            error_log("age: " . $age);
            error_log("gender: " . $gender);
            error_log("email: " . $email);
            error_log("contact_number: " . $contact_number);
            error_log("coordinator_id: " . $coordinator_id);
            error_log("hte_id: " . $hte_id);
            error_log("session_id: " . $session_id);
    
            try {
                // Call addStudent with the database instance
                $new_intern_id = $ado->addStudent($dbo, $student_id, $name, $age, $gender, $email, $contact_number, $coordinator_id, $hte_id, $session_id);
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




// Assuming you're handling the deleteHTE action in PHP
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'deleteHTE') {
    $hteId = $_POST['hteId'];

    // Database connection
    $dbo = new Database(); // Assuming you have a Database class to handle connections
    $response = [];

    try {
        // Prepare the SQL statement to delete from host_training_establishment
        $stmt = $dbo->conn->prepare("DELETE FROM host_training_establishment WHERE HTE_ID = :hteId");
        $stmt->bindParam(':hteId', $hteId, PDO::PARAM_INT);
        
        // Execute the deletion
        if ($stmt->execute()) {
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







  }
?>