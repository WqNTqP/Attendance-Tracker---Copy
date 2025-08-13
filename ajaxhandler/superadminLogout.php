<?php 
session_start();
unset($_SESSION["current_user_role"]);
unset($_SESSION["current_user_name"]);
header("location:../index.php");
exit();
?>
