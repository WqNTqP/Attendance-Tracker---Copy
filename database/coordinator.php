<?php
$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker/database/database.php";

class coordinator
{
    public function verifyUser($dbo,$un,$pw)
    {
        $rv=["id"=>-1,"status"=>"ERROR"];
        $c="select COORDINATOR_ID,NAME from coordinator where EMAIL=:un";
        $s=$dbo->conn->prepare($c);
        try{
            $s->execute([":un"=>$un]);
            if($s->rowCount()>0){
                $result=$s->fetchAll(PDO::FETCH_ASSOC)[0];
                if($result['COORDINATOR_ID']==$pw){
                    $rv=["id"=>$result['COORDINATOR_ID'],"status"=>"ALL OK"];
                }
                else{
                    $rv=["id"=>$result['COORDINATOR_ID'],"status"=>"Wrong Password"];
                }
            }
            else{
                $rv=["id"=>-1,"status"=>"USER NAME DOES NOT EXIST"];
            }
        }
        catch(PDOException $e){
        }
        return $rv;
    }
    public function getHTEInASession($dbo,$sessionid,$cdrid)
    {
        $rv=[];
        $c="SELECT hte.HTE_ID, hte.NAME, hte.INDUSTRY
            FROM internship_needs AS itn, host_training_establishment AS hte
            WHERE itn.HTE_ID = hte.HTE_ID 
            AND itn.COORDINATOR_ID = :cdrid AND itn.SESSION_ID = :sessionid";
        $s=$dbo->conn->prepare($c);
        try
        {
            $s->execute([":cdrid"=>$cdrid,":sessionid"=>$sessionid]);
            $rv=$s->fetchAll(PDO::FETCH_ASSOC);
        }
        catch(Exception $e)
        {
            echo "An error occurred: " . $e->getMessage();
        }
        return $rv;
    }
}
?>

