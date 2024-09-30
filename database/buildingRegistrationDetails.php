<?php
$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker/database/database.php";

class BuildingRegistrationDetails
{
    public function getRegisteredStudents($dbo, $sessionid, $courseid)
    {
        $rv = [];
        $c = "SELECT id.INTERNS_ID, id.STUDENT_ID, id.NAME, id.GENDER 
            FROM interns_details AS id, intern_details AS itd 
            WHERE itd.INTERNS_ID = id.INTERNS_ID 
            AND itd.SESSION_ID = :sessionid 
            AND itd.HTE_ID = :courseid";

        $s = $dbo->conn->prepare($c);
        $s->execute([':sessionid' => $sessionid, ':courseid' => $courseid]);
        $rv = $s->fetchAll(PDO::FETCH_ASSOC);
        return $rv;
    }
}

?>