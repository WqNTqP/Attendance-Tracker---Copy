<?php
$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker - Copy - NP/database/database.php";
require_once $path."/Attendance Tracker - Copy - NP/database/student.php";

if(isset($_POST["action"]) && $_POST["action"] == "verifyStudent")
{
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Debug logging
    error_log("Login attempt - Email: $email, Password: $password");

    $dbo = new Database();
    $sdo = new Student();

    $rv = $sdo->verifyStudent($dbo, $email, $password);
    
    // Debug logging
    error_log("Login result: " . json_encode($rv));
    
    if($rv['status'] == "ALL OK")
    {
        session_start();
        $_SESSION['student_user'] = $rv['id'];
        $_SESSION['student_name'] = $rv['name'];
    }

    echo json_encode($rv);
}
?>
