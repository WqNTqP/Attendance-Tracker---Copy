<?php 
session_start();
unset($_SESSION["admin_user"]);
$rv=[];
echo json_encode($rv);
?>