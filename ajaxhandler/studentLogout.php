<?php 
session_start();
unset($_SESSION["student_user"]);
$rv=[];
echo json_encode($rv);
?>