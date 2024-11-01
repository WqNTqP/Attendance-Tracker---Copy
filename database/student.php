<?php
class Student {
    public function verifyStudent($dbo, $email, $studentId) {
        $rv = ["id" => -1, "status" => "ERROR", "message" => "Invalid email or student ID"];

        $c = "SELECT INTERNS_ID, NAME FROM interns_details WHERE EMAIL = :email AND STUDENT_ID = :studentId";
        $s = $dbo->conn->prepare($c);
        try {
            $s->execute([":email" => $email, ":studentId" => $studentId]);
            if ($s->rowCount() > 0) {
                $result = $s->fetch(PDO::FETCH_ASSOC);
                $rv = [
                    "id" => $result['INTERNS_ID'],
                    "name" => $result['NAME'],
                    "status" => "ALL OK"
                ];
            } else {
                $rv["message"] = "No matching student found";
            }
        } catch (PDOException $e) {
            $rv["message"] = "Database error: " . $e->getMessage();
        }
        return $rv;
    }
}
?>