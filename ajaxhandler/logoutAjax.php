<?php 
session_start();

// Clear all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Return JSON response instead of redirect
echo json_encode(['status' => 'success', 'message' => 'Logged out successfully']);
exit();
?>
