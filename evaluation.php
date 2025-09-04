<?php
session_start();
// Check if user is logged in
if(!isset($_SESSION["current_user"]) && !isset($_SESSION["student_user"]) && !isset($_SESSION['current_user_role'])) {
    header("location:index.php");
    die();
}

// Get display name for user
$displayName = 'User';
if(isset($_SESSION["current_user_name"])) {
    $displayName = $_SESSION["current_user_name"];
} elseif(isset($_SESSION["current_user"])) {
    // For backwards compatibility, fetch name from database
    $path=$_SERVER['DOCUMENT_ROOT'];
    require_once $path."/Attendance Tracker - Copy - NP/database/database.php";
    try {
        $db = new Database();
        $stmt = $db->conn->prepare("SELECT NAME FROM coordinator WHERE COORDINATOR_ID = ?");
        $stmt->execute([$_SESSION["current_user"]]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            $displayName = $result['NAME'];
            $_SESSION["current_user_name"] = $result['NAME']; // Cache for future use
        } else {
            $displayName = $_SESSION["current_user"];
        }
    } catch (Exception $e) {
        $displayName = $_SESSION["current_user"];
    }
    } elseif(isset($_SESSION["student_user"])) {
        // For student users, fetch name from database
        $path=$_SERVER['DOCUMENT_ROOT'];
        require_once $path."/Attendance Tracker - Copy - NP/database/database.php";
        try {
            $db = new Database();
            $stmt = $db->conn->prepare("SELECT NAME, SURNAME FROM interns_details WHERE STUDENT_ID = ?");
            $stmt->execute([$_SESSION["student_user"]]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($result) {
                $displayName = ($result['NAME'] ?? '') . ' ' . ($result['SURNAME'] ?? '');
                $_SESSION["student_name"] = $displayName; // Cache for future use
            } else {
                $displayName = $_SESSION["student_user"];
            }
        } catch (Exception $e) {
            $displayName = $_SESSION["student_user"];
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/attendance.css">
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>Evaluation - Attendance Tracker</title>
    <style>
        .welcome-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 70vh;
            text-align: center;
        }
        
        .welcome-title {
            font-size: 3rem;
            color: #2c3e50;
            margin-bottom: 1rem;
            font-weight: bold;
        }
        
        .welcome-subtitle {
            font-size: 1.5rem;
            color: #7f8c8d;
            margin-bottom: 2rem;
        }
        
        .welcome-message {
            font-size: 1.2rem;
            color: #34495e;
            max-width: 600px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="top-header">
            <button id="sidebarToggle" class="sidebar-toggle" aria-label="Toggle Sidebar">&#9776;</button>
            <div class="sidebar-logo" style="margin-left: 1rem; cursor: pointer;" onclick="window.location.href='evaluation.php';">
                <h2 class="logo" style="cursor: pointer;">ATTENDANCE TRACKER</h2>
            </div>
        <div class="user-profile" id="userProfile">
            <span id="userName">
                <?php echo htmlspecialchars($displayName); ?> &#x25BC;
            </span>
            <div class="user-dropdown" id="userDropdown" style="display:none;">
                <button id="btnProfile">Profile</button>
                <button id="logoutBtn">Logout</button>
            </div>
        </div>
        </div>

        <div class="sidebar">
            <ul class="sidebar-menu">
                <li class="sidebar-item <?php echo basename($_SERVER['PHP_SELF']) == 'attendance.php' ? 'active' : ''; ?>" id="attendanceTab" onclick="window.location.href='attendance.php'">Attendance</li>
                <li class="sidebar-item <?php echo basename($_SERVER['PHP_SELF']) == 'evaluation.php' ? 'active' : ''; ?>" id="evaluationTab" onclick="window.location.href='evaluation.php'">Evaluation</li>
                <li class="sidebar-item <?php echo basename($_SERVER['PHP_SELF']) == 'contral.php' ? 'active' : ''; ?>" id="controlTab" onclick="window.location.href='contral.php'">Control</li>
            </ul>
        </div>

        <div class="content-area">
            <div class="welcome-container">
                <h1 class="welcome-title">Welcome to Evaluation</h1>
                <p class="welcome-subtitle">Attendance Tracker System</p>
                <p class="welcome-message">
                    This is the new Evaluation interface. Here you can manage and evaluate various aspects of the attendance system.
                    Explore the features and tools available to streamline your attendance evaluation process.
                </p>
            </div>
        </div>
    </div>

    <input type="hidden" id="hiddencdrid" value="<?php echo isset($_SESSION["current_user"]) ? $_SESSION["current_user"] : ''; ?>">
    
    <script src="js/jquery.js"></script>
    <script>
        // Add sidebar toggle functionality
        document.getElementById('sidebarToggle').addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('sidebar-open');
        });

        // User profile dropdown
        document.getElementById('userProfile').addEventListener('click', function() {
            const dropdown = document.getElementById('userDropdown');
            dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const userProfile = document.getElementById('userProfile');
            const userDropdown = document.getElementById('userDropdown');
            if (!userProfile.contains(event.target)) {
                userDropdown.style.display = 'none';
            }
        });

        // Logout functionality - same as attendance tracker
        document.getElementById('logoutBtn').addEventListener('click', function() {
            $.ajax({
                url: "ajaxhandler/logoutAjax.php",
                type: "POST",
                dataType: "json",
                data: {id: 1},
                success: function(rv) {
                    document.location.replace("index.php");
                },
                error: function(xhr, status, error) {
                    alert("Logout failed! Please try again.");
                }
            });
        });

        // Profile button functionality - same as attendance tracker
        document.getElementById('btnProfile').addEventListener('click', function() {
            console.log("Profile button clicked");
            let cdrid = document.getElementById('hiddencdrid').value;
            console.log("CDRID:", cdrid);
            
            if (!cdrid) {
                console.log("No CDRID found");
                alert("Coordinator ID not found.");
                return;
            }

            $.ajax({
                url: "ajaxhandler/attendanceAJAX.php",
                type: "POST",
                dataType: "json",
                data: {cdrid: cdrid, action: "getCoordinatorDetails"},
                success: function(response) {
                    console.log("AJAX Success:", response);
                    if (response.success) {
                        displayCoordinatorDetails(response.data);
                    } else {
                        console.error("Error in response:", response.message);
                        alert("Error: " + (response.message || "Unknown error occurred."));
                    }
                },
                error: function(xhr, status, error) {
                    console.error("Error fetching coordinator details:", error);
                    alert("Error fetching coordinator details. Please check the console for more information.");
                }
            });
        });

        // Function to display coordinator details
        function displayCoordinatorDetails(coordinatorData) {
            console.log("Displaying coordinator details:", coordinatorData);
            
            let html = generateCoordinatorDetailsHTML(coordinatorData);
            // Remove the Add New Coordinator/Admin button from the HTML before appending
            html = html.replace(/<button[^>]*id="btnAddCoordinator"[^>]*>.*?<\/button>/, '');
            document.body.insertAdjacentHTML('beforeend', html);
            
            document.getElementById('coordinatorDetailsModal').style.display = 'flex';
            document.getElementById('coordinatorDetailsModal').classList.add('fade-in');
        }

        // Function to generate coordinator details HTML
        function generateCoordinatorDetailsHTML(data) {
            return `
                <div id="coordinatorDetailsModal" class="modal" style="display:block;">
                    <div class="modal-content">
                        <h2>Coordinator Details</h2>
                        <div class="form-group">
                            <label>COORDINATOR ID:</label>
                            <span>${data.COORDINATOR_ID}</span>
                        </div>
                        <div class="form-group">
                            <label>Name:</label>
                            <span>${data.NAME}</span>
                        </div>
                        <div class="form-group">
                            <label>Email:</label>
                            <span>${data.EMAIL}</span>
                        </div>
                        <div class="form-group">
                            <label>Contact Number:</label>
                            <span>${data.CONTACT_NUMBER}</span>
                        </div>
                        <div class="form-group">
                            <label>Department:</label>
                            <span>${data.DEPARTMENT}</span>
                        </div>
                        <button type="button" id="closeCoordinatorDetails" class="common-button">Close</button>
                    </div>
                </div>
            `;
        }

        // Close coordinator details modal
        $(document).on('click', '#closeCoordinatorDetails', function() {
            $('#coordinatorDetailsModal').fadeOut(function() {
                $(this).remove();
            });
        });
    </script>
</body>
</html>
