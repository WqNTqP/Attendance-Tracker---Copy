<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// $response = ['success' => true, 'message' => 'Student added successfully!'];

// echo json_encode($response);
// exit;

$path=$_SERVER['DOCUMENT_ROOT'];
require_once $path."/Attendance Tracker - Copy - NP/database/database.php";


class attendanceDetails
{

    public function getStudentsByHteId($dbo, $hteId) {
        try {
            $stmt = $dbo->conn->prepare("SELECT id.INTERNS_ID, id.STUDENT_ID, id.NAME, id.GENDER, id.EMAIL, id.CONTACT_NUMBER 
                                          FROM interns_details AS id 
                                          JOIN intern_details AS itd ON id.INTERNS_ID = itd.INTERNS_ID 
                                          WHERE itd.HTE_ID = :hteId");
            $stmt->execute([':hteId' => $hteId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ["success" => false, "message" => "Error: " . $e->getMessage()];
        }
    }
    
    


    public function getStudentById($dbo, $studentId) {
        try {
            // Debugging: check if studentId is passed correctly
            echo "Student ID received: " . $studentId . "<br>";
    
            $stmt = $dbo->prepare("SELECT * FROM interns_details WHERE STUDENT_ID = :studentId");
            $stmt->execute(['studentId' => $studentId]);
    
            // Debugging: check if the query was executed and if any result is fetched
            if ($stmt->rowCount() > 0) {
                $student = $stmt->fetch(); // Fetch the student data
                // Debugging: log or print the student data
                echo "<pre>";
                print_r($student);
                echo "</pre>";
                return $student;
            } else {
                // Debugging: check when no result is found
                echo "No student found with ID: " . $studentId . "<br>";
                return false;
            }
        } catch (PDOException $e) {
            // Log the exception message for debugging
            echo "Error: " . $e->getMessage();
            return false;
        }
    }
    
       



    public function deleteStudent($dbo, $studentId) {
        try {
            // First, delete related records in intern_details
            $c = "DELETE FROM intern_details WHERE INTERNS_ID = :studentId";
            $s = $dbo->conn->prepare($c);
            $s->execute([":studentId" => $studentId]);
    
            // Then, delete the student from interns_details
            $c = "DELETE FROM interns_details WHERE INTERNS_ID = :studentId";
            $s = $dbo->conn->prepare($c);
            $s->execute([":studentId" => $studentId]);
            
            return ["success" => true, "message" => "Student deleted successfully."];
        } catch (PDOException $e) {
            return ["success" => false, "message" => "Error deleting student: " . $e->getMessage()];
        }
    }



   
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

    public function addStudent($dbo, $student_id, $name, $age, $gender, $email, $contact_number, $coordinator_id, $hte_id, $session_id) {
        try {
            // Check if HTE_ID is provided
            if (empty($hte_id)) {
                throw new Exception("HTE must be selected.");
            }
    
            // Start transaction
            $dbo->conn->beginTransaction();
    
            // Validate if HTE exists
            $stmt = $dbo->conn->prepare("SELECT COUNT(*) FROM host_training_establishment WHERE HTE_ID = :hte_id");
            $stmt->bindParam(':hte_id', $hte_id, PDO::PARAM_INT);  // Binding the parameter
            $stmt->execute();
            if ($stmt->fetchColumn() == 0) {
                throw new Exception("HTE_ID $hte_id does not exist.");
            }
    
            // Check if the student is already assigned to any HTE in any session
            $stmt = $dbo->conn->prepare("SELECT COUNT(*) 
                                         FROM intern_details 
                                         INNER JOIN interns_details ON intern_details.INTERNS_ID = interns_details.INTERNS_ID
                                         WHERE interns_details.STUDENT_ID = :student_id");
            $stmt->bindParam(':student_id', $student_id, PDO::PARAM_INT);  // Binding the parameter
            $stmt->execute();
    
            // If the student already has an assignment, throw an exception
            if ($stmt->fetchColumn() > 0) {
                throw new Exception("This student is already assigned to an HTE in another session.");
            }
    
            // Check if the student is already assigned to the same HTE in the selected session
            $stmt = $dbo->conn->prepare("SELECT COUNT(*) 
                                         FROM intern_details 
                                         WHERE INTERNS_ID IN (SELECT INTERNS_ID FROM interns_details WHERE STUDENT_ID = :student_id) 
                                         AND SESSION_ID = :session_id 
                                         AND HTE_ID = :hte_id");
            $stmt->bindParam(':student_id', $student_id, PDO::PARAM_INT);  // Binding the parameter
            $stmt->bindParam(':session_id', $session_id, PDO::PARAM_INT);  // Binding the parameter
            $stmt->bindParam(':hte_id', $hte_id, PDO::PARAM_INT);  // Binding the parameter
            $stmt->execute();
    
            if ($stmt->fetchColumn() > 0) {
                throw new Exception("This student is already assigned to the same session and HTE.");
            }
    
            // Check if student already exists in the interns_details table
            $stmt = $dbo->conn->prepare("SELECT INTERNS_ID FROM interns_details WHERE STUDENT_ID = :student_id");
            $stmt->bindParam(':student_id', $student_id, PDO::PARAM_INT);  // Binding the parameter
            $stmt->execute();
    
            if ($stmt->rowCount() > 0) {
                // Student already exists, get the existing INTERNS_ID
                $intern_id = $stmt->fetchColumn();
    
                // Check if the student is already assigned to the same session and HTE
                $stmt = $dbo->conn->prepare("SELECT COUNT(*) FROM intern_details WHERE INTERNS_ID = :intern_id AND SESSION_ID = :session_id AND HTE_ID = :hte_id");
                $stmt->bindParam(':intern_id', $intern_id, PDO::PARAM_INT);  // Binding the parameter
                $stmt->bindParam(':session_id', $session_id, PDO::PARAM_INT);  // Binding the parameter
                $stmt->bindParam(':hte_id', $hte_id, PDO::PARAM_INT);  // Binding the parameter
                $stmt->execute();
    
                if ($stmt->fetchColumn() > 0) {
                    // Student already assigned to the same session and HTE
                    throw new Exception("This student ID is already assigned to the same session and HTE.");
                }
    
                // Insert into intern_details if student is not already assigned
                $stmt = $dbo->conn->prepare("INSERT INTO intern_details (INTERNS_ID, SESSION_ID, HTE_ID) VALUES (:intern_id, :session_id, :hte_id)");
                $stmt->bindParam(':intern_id', $intern_id, PDO::PARAM_INT);  // Binding the parameter
                $stmt->bindParam(':session_id', $session_id, PDO::PARAM_INT);  // Binding the parameter
                $stmt->bindParam(':hte_id', $hte_id, PDO::PARAM_INT);  // Binding the parameter
                if (!$stmt->execute()) {
                    throw new Exception("Failed to assign student to HTE and session.");
                }
            } else {
                // Insert new student into interns_details
                $stmt = $dbo->conn->prepare("INSERT INTO interns_details (STUDENT_ID, NAME, AGE, GENDER, EMAIL, CONTACT_NUMBER) VALUES (:student_id, :name, :age, :gender, :email, :contact_number)");
                $stmt->bindParam(':student_id', $student_id, PDO::PARAM_INT);  // Binding the parameter
                $stmt->bindParam(':name', $name, PDO::PARAM_STR);  // Binding the parameter
                $stmt->bindParam(':age', $age, PDO::PARAM_INT);  // Binding the parameter
                $stmt->bindParam(':gender', $gender, PDO::PARAM_STR);  // Binding the parameter
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);  // Binding the parameter
                $stmt->bindParam(':contact_number', $contact_number, PDO::PARAM_STR);  // Binding the parameter
                if (!$stmt->execute()) {
                    throw new Exception("Failed to add new student.");
                }
                // Get the newly inserted INTERN_ID
                $intern_id = $dbo->conn->lastInsertId();
    
                // Insert into intern_details for new student
                $stmt = $dbo->conn->prepare("INSERT INTO intern_details (INTERNS_ID, SESSION_ID, HTE_ID) VALUES (:intern_id, :session_id, :hte_id)");
                $stmt->bindParam(':intern_id', $intern_id, PDO::PARAM_INT);  // Binding the parameter
                $stmt->bindParam(':session_id', $session_id, PDO::PARAM_INT);  // Binding the parameter
                $stmt->bindParam(':hte_id', $hte_id, PDO::PARAM_INT);  // Binding the parameter
                if (!$stmt->execute()) {
                    throw new Exception("Failed to assign new student to HTE and session.");
                }
            }
    
            // Commit transaction if all operations succeed
            $dbo->conn->commit();
    
            // Return the intern_id of the assigned student
            return $intern_id;
    
        } catch (Exception $e) {
            // Rollback the transaction on any exception
            $dbo->conn->rollBack();
    
            // Return a JSON response with the error message
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
            exit;
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