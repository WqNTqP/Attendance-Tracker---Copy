<?php 

//kani na code kay condition ni siya 
//para if wala naka login mo balik raka sa login page
session_start();
    if(isset($_SESSION["current_user"]))
        {
            $cdrid=$_SESSION["current_user"];
        }
    else{
        header("location:index.php");
        die();
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/attendance.css">
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>Attendance</title>
</head>
<body>



    <div class="page">
    <div class="top-header">
        <button id="sidebarToggle" class="sidebar-toggle" aria-label="Toggle Sidebar">&#9776;</button>
        <div class="user-profile" id="userProfile">
            <span id="userName">KIM CHARLES &#x25BC;</span>
            <img src="icon/nobglogo.ico" alt="User Icon" class="user-icon" />
            <div class="user-dropdown" id="userDropdown" style="display:none;">
                <button id="logoutBtn">Logout</button>
            </div>
        </div>
    </div>

    <div class="sidebar">
        <div class="sidebar-logo">
            <h2 class="logo">ATTENDANCE TRACKER</h2>
        </div>
        <ul class="sidebar-menu">
            <li class="sidebar-item active" id="attendanceTab">Attendance</li>
            <li class="sidebar-item" id="evaluationTab">Evaluation</li>
        </ul>
        <div class="sidebar-bottom-buttons">
            <div class="coordinator-button-area">
                <button class="btnShowCoordinator" id="btnShowCoordinator">Show Coordinator Details</button>
            </div>
            <div class="logout-area">
                <button class="btnlogout" id="btnLogout"><span>LOGOUT</span></button>
            </div>
        </div>
    </div>

    <div class="content-area">
        <div class="session-area">
            <div class="label-area"><label>SESSION</label></div>
            <div class="dropdown-area">
                <select class="ddlclass" id="ddlclass">

                </select>
            </div>
        </div>

        <div class="classlist-area" id="classlistarea">

        </div>

        <div class="classdetails-area" id="classdetailsarea">

        </div>

        <div class="studentlist-area" id="studentlistarea">

        </div>
    </div>
 
    </div>
    <input type="hidden" id="hiddencdrid" value="<?php echo($cdrid)?>">
    <input type="hidden" id="hiddenSelectedHteID" value="-1">
    <input type="hidden" id="hiddenSelectedSessionId" value="-1">

    <script src="js/jquery.js"></script>
    <script src="js/attendance.js"></script>
</body>
</html>