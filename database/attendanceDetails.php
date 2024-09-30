<?php
$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker/database/database.php";

class attendanceDetails
{
    public function saveAttendance($dbo,$sessionid,$hteid,$coordinatorid,$studentid,$ondate,$status)
    {
        $rv=[-1];
        $c="insert into interns_attendance 
        (COORDINATOR_ID,HTE_ID,ID,INTERNS_ID,ON_DATE,STATUS)
        VALUES (:COORDINATOR_ID,:HTE_ID,:ID,:INTERNS_ID,:ON_DATE,:STATUS)";
        $s=$dbo->conn->prepare($c);
        try{
            $s->execute([":COORDINATOR_ID"=>$coordinatorid,":HTE_ID"=>$hteid,":ID"=>$sessionid,":INTERNS_ID"=>$studentid,":ON_DATE"=>$ondate,":STATUS"=>$status]);
            $rv=[1];
        }
        catch(Exception $e)
        {
            // $rv=[$e->getMessage()];
            // kung date kay nag exist na mag update na
            $rv=[-1];
            $c="UPDATE interns_attendance
            SET STATUS = :STATUS
            WHERE COORDINATOR_ID = :COORDINATOR_ID AND HTE_ID = :HTE_ID AND ID = :ID
            AND INTERNS_ID = :INTERNS_ID AND ON_DATE = :ON_DATE";
            $s=$dbo->conn->prepare($c);
            try
            {
                $s->execute([":COORDINATOR_ID"=>$coordinatorid,":HTE_ID"=>$hteid,":ID"=>$sessionid,":INTERNS_ID"=>$studentid,":ON_DATE"=>$ondate,":STATUS"=>$status]);
                $rv=[1];
            }
            catch(Exception $ee)
            {
                $rv=[$e->getMessage()];
            }
        }
        return $rv;
    }

    public function getPresentListOfAClassByACDROnDate($dbo,$sessionid,$hteid,$coordinatorid,$ondate)
    {
        $rv = [];
        $c="select INTERNS_ID from interns_attendance
        WHERE COORDINATOR_ID = :COORDINATOR_ID AND HTE_ID = :HTE_ID AND ID = :ID
            AND ON_DATE = :ON_DATE
            AND  STATUS='YES'";
        $s=$dbo->conn->prepare($c);
        try{
            $s->execute([":COORDINATOR_ID"=>$coordinatorid,":HTE_ID"=>$hteid,":ID"=>$sessionid,":ON_DATE"=>$ondate]);
            $rv=$s->fetchAll(PDO::FETCH_ASSOC);
        }
        catch(Exception $e)
        {

        }
        return $rv;

    }
        
    
}

?>