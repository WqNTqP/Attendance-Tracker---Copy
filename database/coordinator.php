<?php
$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker - Copy - NP/database/database.php";

class coordinator
{
    public function verifyUser  ($dbo, $un, $pw) {
        $rv = ["id" => -1, "status" => "ERROR", "role" => ""]; // Include role in the response
        $c = "SELECT COORDINATOR_ID, NAME, username, password, ROLE FROM coordinator WHERE username = :un";
        $s = $dbo->conn->prepare($c);
        try {
            $s->execute([":un" => $un]);
            if ($s->rowCount() > 0) {
                $result = $s->fetchAll(PDO::FETCH_ASSOC)[0];
                if ($result['password'] == $pw) {
                    // Return the id, status, and role (either COORDINATOR or ADMIN)
                    $rv = ["id" => $result['COORDINATOR_ID'], "status" => "ALL OK", "role" => $result['ROLE']];
                } else {
                    $rv = ["id" => $result['COORDINATOR_ID'], "status" => "Wrong Password", "role" => ""];
                }
            } else {
                $rv = ["id" => -1, "status" => "USER NAME DOES NOT EXIST", "role" => ""];
            }
        } catch (PDOException $e) {
            // Handle exceptions if needed
            $rv = ["id" => -1, "status" => "Database Error", "role" => ""];
        }
        return $rv;
    }

    public function getHTEInASession($dbo, $sessionid, $cdrid)
    {
        $rv = [];
        $c = "SELECT hte.HTE_ID, hte.NAME, hte.INDUSTRY
              FROM internship_needs AS itn
              JOIN host_training_establishment AS hte
              ON itn.HTE_ID = hte.HTE_ID
              WHERE itn.COORDINATOR_ID = :cdrid AND itn.SESSION_ID = :sessionid";
        $s = $dbo->conn->prepare($c);
        try {
            $s->execute([":cdrid" => $cdrid, ":sessionid" => $sessionid]);
            $rv = $s->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            echo "An error occurred: " . $e->getMessage();
        }
        return $rv;
    }
}
?>
