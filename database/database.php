<?php

class Database 
{
private $servername = "localhost:3307";
private $username = "root";
private $password = "emping";
private $dbname = "attendancetracker";
public $conn = null;


public function __construct() {
    try {
        $this->conn = new PDO("mysql:host=$this->servername;dbname=$this->dbname", $this->username, $this->password);
        // set the PDO error mode to exception
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        //echo "connected successfully";
      } catch(PDOException $e) {
        echo "connection failed: " . $e->getMessage();
      }
}

}


?>
