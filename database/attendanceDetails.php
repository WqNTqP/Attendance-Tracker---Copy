<?php
$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker - Copy - NP/database/database.php";

class attendanceDetails
{
   
    public function getAttendanceReport($dbo,$sessionid,$hteid,$coordinatorid,$ondate)
    {
        $report=[];
        $sessionName='';
        $coordinatorName='';
        $hteName='';
        $c="SELECT * FROM session_details WHERE  ID=:ID";
        $s=$dbo->conn->prepare($c);
        try{
            $s->execute([":ID"=>$sessionid]);
            $sd=$s->fetchAll(PDO::FETCH_ASSOC)[0];
            $sessionName=$sd['YEAR']." ".$sd['TERM'];
        }
        catch (Exception $e)
        {

        }
        
        $c="SELECT * FROM host_training_establishment WHERE  HTE_ID=:ID";
        $s=$dbo->conn->prepare($c);
        try{
            $s->execute([":ID"=>$hteid]);
            $sd=$s->fetchAll(PDO::FETCH_ASSOC);
            if(count($sd) > 0) {
                $hteName=$sd[0]['INDUSTRY']."-".$sd[0]['NAME'];
            } else {
                $hteName = "No HTE found with ID $hteid";
            }
        }
        catch (PDOException $e)
        {
            
        }

        $c="SELECT * FROM coordinator WHERE  COORDINATOR_ID=:ID";
        $s=$dbo->conn->prepare($c);
        try{
            $s->execute([":ID"=>$coordinatorid]);
            $sd=$s->fetchAll(PDO::FETCH_ASSOC)[0];
            $coordinatorName=$sd['NAME'];
        }
        catch (Exception $e)
        {

        }
        

        array_push($report,["Session:",$sessionName]);
        array_push($report,["HTE:",$hteName]);
        array_push($report,["Coordinator:",$coordinatorName]);

        // una kay kuhaon sa kung pila ka hte sa current nga coordinator
        $c="SELECT DISTINCT ON_DATE FROM interns_attendance WHERE
            ID = :sessionid AND HTE_ID=:hteid AND COORDINATOR_ID=:coordinatorid
            ORDER BY ON_DATE";
        $s=$dbo->conn->prepare($c);
        try{
            $s->execute([":sessionid"=>$sessionid,":hteid"=>$hteid,":coordinatorid"=>$coordinatorid]);
            $rv=$s->fetchAll(PDO::FETCH_ASSOC);
        }
        catch(Exception $e)
        {
    
        }

        $rv = [];
        $c = "SELECT 
        rsd.INTERNS_ID, 
        rsd.STUDENT_ID, 
        rsd.NAME, 
        ita.ON_DATE, 
        ita.TIMEIN, 
        ita.TIMEOUT
        FROM (
            SELECT id.INTERNS_ID, id.STUDENT_ID, id.NAME, itd.SESSION_ID, itd.HTE_ID
            FROM interns_details AS id
            JOIN intern_details AS itd ON itd.INTERNS_ID = id.INTERNS_ID
            WHERE itd.SESSION_ID = :sessionid 
            AND itd.HTE_ID = :hteid
        ) AS rsd
        JOIN interns_attendance AS ita ON rsd.INTERNS_ID = ita.INTERNS_ID 
                                        AND rsd.HTE_ID = ita.HTE_ID 
                                        AND ita.COORDINATOR_ID = :coordinatorid
        WHERE ita.ON_DATE = :ondate  -- Filter by selected ondate
        AND ita.TIMEIN IS NOT NULL 
        AND ita.TIMEOUT IS NOT NULL";
        $s = $dbo->conn->prepare($c);

        try {
            $s->execute([
                ":sessionid" => $sessionid, 
                ":hteid" => $hteid, 
                ":coordinatorid" => $coordinatorid, 
                ":ondate" => $ondate  // Selected ondate
            ]);
            $rv = $s->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            // Handle the exception, if needed
        }

        array_push($report,["Intern ID","Student ID","Name","Time In","Time Out"]);
        $report = array_merge($report, $rv);
        return $report;

    }

    // original
    // public function saveAttendance($dbo,$sessionid,$hteid,$coordinatorid,$studentid,$ondate,$status)
    // {
    //     $rv=[-1];
    //     $c="insert into interns_attendance 
    //     (COORDINATOR_ID,HTE_ID,ID,INTERNS_ID,ON_DATE,STATUS)
    //     VALUES (:COORDINATOR_ID,:HTE_ID,:ID,:INTERNS_ID,:ON_DATE,:STATUS)";
    //     $s=$dbo->conn->prepare($c);
    //     try{
    //         $s->execute([":COORDINATOR_ID"=>$coordinatorid,":HTE_ID"=>$hteid,":ID"=>$sessionid,":INTERNS_ID"=>$studentid,":ON_DATE"=>$ondate,":STATUS"=>$status]);
    //         $rv=[1];
    //     }
    //     catch(Exception $e)
    //     {
    //         // $rv=[$e->getMessage()];
    //         // kung date kay nag exist na mag update na
    //         $rv=[-1];
    //         $c="UPDATE interns_attendance
    //         SET STATUS = :STATUS
    //         WHERE COORDINATOR_ID = :COORDINATOR_ID AND HTE_ID = :HTE_ID AND ID = :ID
    //         AND INTERNS_ID = :INTERNS_ID AND ON_DATE = :ON_DATE";
    //         $s=$dbo->conn->prepare($c);
    //         try
    //         {
    //             $s->execute([":COORDINATOR_ID"=>$coordinatorid,":HTE_ID"=>$hteid,":ID"=>$sessionid,":INTERNS_ID"=>$studentid,":ON_DATE"=>$ondate,":STATUS"=>$status]);
    //             $rv=[1];
    //         }
    //         catch(Exception $ee)
    //         {
    //             $rv=[$e->getMessage()];
    //         }
    //     }
    //     return $rv;
    // }


    public function saveAttendance($dbo, $sessionid, $hteid, $coordinatorid, $studentid, $ondate, $timein, $timeout)
    {
        $rv = [-1];
        $c = "SELECT * FROM interns_attendance
        WHERE COORDINATOR_ID = :COORDINATOR_ID AND HTE_ID = :HTE_ID AND ID = :ID AND INTERNS_ID = :INTERNS_ID AND ON_DATE = :ON_DATE";
        $s = $dbo->conn->prepare($c);
        try {
            $s->execute([
                ":COORDINATOR_ID" => $coordinatorid,
                ":HTE_ID" => $hteid,
                ":ID" => $sessionid,
                ":INTERNS_ID" => $studentid,
                ":ON_DATE" => $ondate
            ]);
            $result = $s->fetch();
            if ($result) {
                $c = "UPDATE interns_attendance
                SET TIMEIN = :TIMEIN, TIMEOUT = :TIMEOUT
                WHERE COORDINATOR_ID = :COORDINATOR_ID AND HTE_ID = :HTE_ID AND ID = :ID AND INTERNS_ID = :INTERNS_ID AND ON_DATE = :ON_DATE";
                $s = $dbo->conn->prepare($c);
                try {
                    $s->execute([
                        ":COORDINATOR_ID" => $coordinatorid,
                        ":HTE_ID" => $hteid,
                        ":ID" => $sessionid,
                        ":INTERNS_ID" => $studentid,
                        ":ON_DATE" => $ondate,
                        ":TIMEIN" => $timein,
                        ":TIMEOUT" => $timeout
                    ]);
                    // echo "Updated existing record";
                    $rv = [1];
                } catch (PDOException $e) {
                    echo "Error updating existing record: " . $e->getMessage();
                    $rv = [$e->getMessage()];
                }
            } else {
                $c = "INSERT INTO interns_attendance 
                (COORDINATOR_ID, HTE_ID, ID, INTERNS_ID, ON_DATE, TIMEIN, TIMEOUT)
                VALUES (:COORDINATOR_ID, :HTE_ID, :ID, :INTERNS_ID, :ON_DATE, :TIMEIN, :TIMEOUT)";
                $s = $dbo->conn->prepare($c);
                try {
                    $s->execute([
                        ":COORDINATOR_ID" => $coordinatorid,
                        ":HTE_ID" => $hteid,
                        ":ID" => $sessionid,
                        ":INTERNS_ID" => $studentid,
                        ":ON_DATE" => $ondate,
                        ":TIMEIN" => $timein,
                        ":TIMEOUT" => $timeout
                    ]);
                    // echo "Inserted new record";
                    $rv = [1];
                } catch (PDOException $e) {
                    // echo "Error inserting new record: " . $e->getMessage();
                    $rv = [$e->getMessage()];
                }
            }
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
            $rv = [$e->getMessage()];
        }
        return $rv;
    }

    // public function getPresentListOfAClassByACDROnDate($dbo,$sessionid,$hteid,$coordinatorid,$ondate)
    // {
    //     $rv = [];
    //     $c="select INTERNS_ID from interns_attendance
    //     WHERE COORDINATOR_ID = :COORDINATOR_ID AND HTE_ID = :HTE_ID AND ID = :ID
    //         AND ON_DATE = :ON_DATE
    //         AND  STATUS='YES'";
    //     $s=$dbo->conn->prepare($c);
    //     try{
    //         $s->execute([":COORDINATOR_ID"=>$coordinatorid,":HTE_ID"=>$hteid,":ID"=>$sessionid,":ON_DATE"=>$ondate]);
    //         $rv=$s->fetchAll(PDO::FETCH_ASSOC);
    //     }
    //     catch(Exception $e)
    //     {

    //     }
    //     return $rv;

    // }

    public function getPresentListOfAClassByACDROnDate($dbo,$sessionid,$classid,$coordinatorid,$ondate)
    {
        $rv = [];
        $c="select INTERNS_ID, TIMEIN, TIMEOUT from interns_attendance
            WHERE COORDINATOR_ID = :COORDINATOR_ID AND HTE_ID = :HTE_ID AND ID = :ID
                AND ON_DATE = :ON_DATE
                AND  TIMEIN IS NOT NULL AND TIMEOUT IS NOT NULL";
        $s=$dbo->conn->prepare($c);
        try{
            $s->execute([":COORDINATOR_ID"=>$coordinatorid,":HTE_ID"=>$classid,":ID"=>$sessionid,":ON_DATE"=>$ondate]);
            $rv=$s->fetchAll(PDO::FETCH_ASSOC);
        }
        catch(Exception $e)
        {

        }
        return $rv;
    }

    

    // public function addStudent($dbo, $student_id, $name, $age, $gender, $email, $contact_number, $coordinator_id, $hte_id, $session_id) {
    //     try {
    //         $dbo->conn->beginTransaction();
            
    //         // Check if the HTE exists
    //         $stmt = $dbo->conn->prepare("SELECT COUNT(*) FROM host_training_establishment WHERE HTE_ID = ?");
    //         $stmt->execute([$hte_id]);
    //         if ($stmt->fetchColumn() == 0) {
    //             throw new Exception("HTE_ID $hte_id does not exist.");
    //         }
    
    //         // Check if the student already exists
    //         $stmt = $dbo->conn->prepare("SELECT INTERNS_ID FROM interns_details WHERE STUDENT_ID = ?");
    //         $stmt->execute([$student_id]);
            
    //         if ($stmt->rowCount() > 0) {
    //             // Student already exists, get the existing INTERNS_ID
    //             $intern_id = $stmt->fetchColumn();
                
    //             // Check if this student is already assigned to the HTE and SESSION
    //             $stmt = $dbo->conn->prepare("SELECT COUNT(*) FROM intern_details WHERE INTERNS_ID = ? AND SESSION_ID = ? AND HTE_ID = ?");
    //             $stmt->execute([$intern_id, $session_id, $hte_id]);
    //             if ($stmt->fetchColumn() > 0) {
    //                 throw new Exception("This student is already assigned to this HTE and SESSION.");
    //             }
                
    //             // Update intern_details for the existing student
    //             $stmt = $dbo->conn->prepare("UPDATE intern_details SET SESSION_ID = ?, HTE_ID = ? WHERE INTERNS_ID = ?");
    //             $stmt->execute([$session_id, $hte_id, $intern_id]);
    //         } else {
    //             // Insert into interns_details (new student)
    //             $stmt = $dbo->conn->prepare("INSERT INTO interns_details (STUDENT_ID, NAME, AGE, GENDER, EMAIL, CONTACT_NUMBER) VALUES (?, ?, ?, ?, ?, ?)");
    //             $stmt->execute([$student_id, $name, $age, $gender, $email, $contact_number]);
    //             $intern_id = $dbo->conn->lastInsertId();
    
    //             // Insert new record in intern_details
    //             $stmt = $dbo->conn->prepare("INSERT INTO intern_details (INTERNS_ID, SESSION_ID, HTE_ID) VALUES (?, ?, ?)");
    //             $stmt->execute([$intern_id, $session_id, $hte_id]);
    //         }
    
    //         $dbo->conn->commit();
    //         return $intern_id;
    //     } catch (Exception $e) {
    //         $dbo->conn->rollBack();
    //         throw $e;
    //     }
    // }
    public function addStudent($dbo, $student_id, $name, $age, $gender, $email, $contact_number, $coordinator_id, $hte_id, $session_id) {
        try {
            // Ensure HTE_ID is not null or empty
            if (empty($hte_id)) {
                throw new Exception("HTE must be selected.");
            }
    
            $dbo->conn->beginTransaction();
            
            // Check if the HTE exists
            $stmt = $dbo->conn->prepare("SELECT COUNT(*) FROM host_training_establishment WHERE HTE_ID = ?");
            $stmt->execute([$hte_id]);
            if ($stmt->fetchColumn() == 0) {
                throw new Exception("HTE_ID $hte_id does not exist.");
            }
    
            // Check if the student already exists
            $stmt = $dbo->conn->prepare("SELECT INTERNS_ID FROM interns_details WHERE STUDENT_ID = ?");
            $stmt->execute([$student_id]);
            
            if ($stmt->rowCount() > 0) {
                // Student already exists, get the existing INTERNS_ID
                $intern_id = $stmt->fetchColumn();
                
                // Check if this student is already assigned to the same HTE and SESSION
                $stmt = $dbo->conn->prepare("
                    SELECT COUNT(*) 
                    FROM intern_details 
                    WHERE INTERNS_ID = ? AND SESSION_ID = ? AND HTE_ID = ?
                ");
                $stmt->execute([$intern_id, $session_id, $hte_id]);
                
                if ($stmt->fetchColumn() > 0) {
                    // Student is already assigned to the same session and HTE, return early
                    throw new Exception("This student ID is already assigned to the same session and HTE.");
                }
    
                // Insert new assignment if the student is not in the same HTE and SESSION
                $stmt = $dbo->conn->prepare("INSERT INTO intern_details (INTERNS_ID, SESSION_ID, HTE_ID) VALUES (?, ?, ?)");
                $stmt->execute([$intern_id, $session_id, $hte_id]);
            } else {
                // Insert into interns_details (new student)
                $stmt = $dbo->conn->prepare("INSERT INTO interns_details (STUDENT_ID, NAME, AGE, GENDER, EMAIL, CONTACT_NUMBER) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$student_id, $name, $age, $gender, $email, $contact_number]);
                $intern_id = $dbo->conn->lastInsertId();
    
                // Insert new record in intern_details
                $stmt = $dbo->conn->prepare("INSERT INTO intern_details (INTERNS_ID, SESSION_ID, HTE_ID) VALUES (?, ?, ?)");
                $stmt->execute([$intern_id, $session_id, $hte_id]);
            }
    
            $dbo->conn->commit();
            return $intern_id;
        } catch (Exception $e) {
            $dbo->conn->rollBack();
            throw $e;
        }
    }
    


    public function addHTE($dbo, $name, $industry, $address, $contact_email, $contact_person, $contact_number, $coordinator_id, $session_id) {
        try {
            $dbo->conn->beginTransaction();
            
            // Check if the HTE already exists
            $stmt = $dbo->conn->prepare("SELECT HTE_ID FROM host_training_establishment WHERE NAME = ? AND CONTACT_EMAIL = ?");
            $stmt->execute([$name, $contact_email]);
            $existing_hte = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($existing_hte) {
                $hte_id = $existing_hte['HTE_ID'];
                
                // Update existing HTE
                $stmt = $dbo->conn->prepare("UPDATE host_training_establishment SET INDUSTRY = ?, ADDRESS = ?, CONTACT_PERSON = ?, CONTACT_NUMBER = ? WHERE HTE_ID = ?");
                $stmt->execute([$industry, $address, $contact_person, $contact_number, $hte_id]);
            } else {
                // Insert new HTE
                $stmt = $dbo->conn->prepare("INSERT INTO host_training_establishment (NAME, INDUSTRY, ADDRESS, CONTACT_EMAIL, CONTACT_PERSON, CONTACT_NUMBER) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$name, $industry, $address, $contact_email, $contact_person, $contact_number]);
                $hte_id = $dbo->conn->lastInsertId();
            }

            // Check if the HTE is already associated with this coordinator and session
            $stmt = $dbo->conn->prepare("SELECT COUNT(*) FROM internship_needs WHERE HTE_ID = ? AND COORDINATOR_ID = ? AND SESSION_ID = ?");
            $stmt->execute([$hte_id, $coordinator_id, $session_id]);
            $exists = $stmt->fetchColumn();

            if (!$exists) {
                // Insert into internship_needs only if the association doesn't exist
                $stmt = $dbo->conn->prepare("INSERT INTO internship_needs (HTE_ID, COORDINATOR_ID, SESSION_ID) VALUES (?, ?, ?)");
                $stmt->execute([$hte_id, $coordinator_id, $session_id]);
            }

            $dbo->conn->commit();
            return $hte_id;
        } catch (Exception $e) {
            $dbo->conn->rollBack();
            throw $e;
        }
    }


    /////////////////////////////////////////////////////////////////////

    public function getCoordinatorDetails($dbo, $coordinator_id) {
        try {
            $stmt = $dbo->conn->prepare("SELECT COORDINATOR_ID, NAME, EMAIL, CONTACT_NUMBER, DEPARTMENT 
                                         FROM coordinator 
                                         WHERE COORDINATOR_ID = ?");
            $stmt->execute([$coordinator_id]);
            $coordinator = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if (!$coordinator) {
                throw new Exception("Coordinator not found.");
            }
    
            return $coordinator;
        } catch (Exception $e) {
            // Log the error
            error_log("Error fetching coordinator details: " . $e->getMessage());
            throw $e;
        }
    }





    public function isStudentAlreadyAssigned($dbo, $student_id, $session_id, $coordinator_id, $hte_id) {
        $query = "SELECT * FROM interns 
                  WHERE STUDENT_ID = ? AND 
                  (SESSION_ID != ? OR COORDINATOR_ID != ? OR HTE_ID != ?)";
        $stmt = $dbo->prepare($query);
        $stmt->execute([$student_id, $session_id, $coordinator_id, $hte_id]);
        return $stmt->rowCount() > 0;
    }

    
}

?>