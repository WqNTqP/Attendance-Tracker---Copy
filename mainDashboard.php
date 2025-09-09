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
            $stmt = $db->conn->prepare("SELECT NAME FROM student WHERE STUDENT_ID = ?");
            $stmt->execute([$_SESSION["student_user"]]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($result) {
                $displayName = $result['NAME'];
                $_SESSION["student_name"] = $result['NAME']; // Cache for future use
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
    <link rel="stylesheet" href="css/mainDashboard.css">
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>Attendance</title>
</head>
<body>



    <div class="page">
    <div class="top-header">
        <button id="sidebarToggle" class="sidebar-toggle" aria-label="Toggle Sidebar">&#9776;</button>
        <div class="sidebar-logo" style="margin-left: 1rem; cursor: pointer;" onclick="window.location.href='mainDashboard.php';">
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
                <li class="sidebar-item active" id="attendanceTab" onclick="switchTab('attendance')">Attendance</li>
                <li class="sidebar-item" id="evaluationTab" onclick="switchTab('evaluation')">Evaluation</li>
                <li class="sidebar-item" id="controlTab" onclick="switchTab('control')">Control</li>
            </ul>
        </div>

    <div class="content-area">
        <!-- Attendance Tab Content -->
        <div id="attendanceContent" class="tab-content active">
            <div class="left-column">
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
                
                <div class="reportsection">
                    <button id="btnReport" class="btnReport">Generate Report</button>
                </div>

            </div>

            <div class="right-column">
                <div class="studentlist-area" id="studentlistarea">
                </div>
        </div>


    </div>
            <!-- Evaluation Tab Content -->
        <div id="evaluationContent" class="tab-content">
            <div class="welcome-container">
                <h1 class="welcome-title">Welcome to Evaluation</h1>
                <p class="welcome-subtitle">Attendance Tracker System</p>
                <p class="welcome-message">
                    This is the new Evaluation interface. Here you can manage and evaluate various aspects of the attendance system.
                    Explore the features and tools available to streamline your attendance evaluation process.
                </p>
            </div>
        </div>

        <!-- Control Tab Content -->
        <div id="controlContent" class="tab-content">
            <div class="control-left">
                <div class="control-buttons">
                    <button id="btnViewAllStudents" class="control-btn">View All Students</button>
                    <button id="btnAddStudent" class="control-btn">Add Student</button>
                    <button id="btnAddHTE" class="control-btn">Add HTE</button>
                    <button id="btnAddSession" class="control-btn">Add Session</button>
                    <button id="btnDeleteHTE" class="control-btn">Delete HTE</button>
                    <button id="btnDeleteSession" class="control-btn">Delete Session</button>
                </div>
            </div>

            <div class="control-right">
                <div class="control-forms">
                        <!-- Add Session Form -->
                        <div id="sessionFormContainer" class="form-container" style="display:none;">
                            <h3>Add New Session</h3>
                            <form id="sessionForm">
                                <div class="form-group">
                                    <label for="sessionYear">Year:</label>
                                    <input type="number" id="sessionYear" name="year" min="2000" max="2050" required>
                                </div>
                                <div class="form-group">
                                    <label for="sessionTerm">Term:</label>
                                    <select id="sessionTerm" name="term" required>
                                        <option value="">Select Term</option>
                                        <option value="FIRST SEMESTER">FIRST SEMESTER</option>
                                        <option value="SECOND SEMESTER">SECOND SEMESTER</option>
                                    </select>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn-submit">Add Session</button>
                                    <button type="button" id="closeSessionForm" class="btn-cancel">Cancel</button>
                                </div>
                            </form>
                        </div>

                        <!-- Add Student Form -->
                        <div id="studentFormContainer" class="form-container" style="display:none;">
                            <h3>Add New Student</h3>
                            <form id="studentForm" method="POST" enctype="multipart/form-data">
                                <div class="form-group">
                                    <label for="studentId">Student ID:</label>
                                    <input type="text" id="studentId" name="studentId" required>
                                </div>
                                <div class="form-group">
                                    <label for="name">Name:</label>
                                    <input type="text" id="name" name="name" required>
                                </div>
                                <div class="form-group">
                                    <label for="age">Age:</label>
                                    <input type="number" id="age" name="age" min="15" max="100" required>
                                </div>
                                <div class="form-group">
                                    <label for="gender">Gender:</label>
                                    <select id="gender" name="gender" required>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="email">Email:</label>
                                    <input type="email" id="email" name="email" required>
                                </div>
                                <div class="form-group">
                                    <label for="contactNumber">Contact Number:</label>
                                    <input type="tel" id="contactNumber" name="contactNumber" pattern="[0-9+\-\s()]{7,20}" required>
                                </div>


                                <!-- CSV Upload Section -->
                                <div class="form-group">
                                    <label for="csvFile">Upload CSV File (Bulk Import):</label>
                                    <input type="file" id="csvFile" name="csvFile" accept=".csv">
                                    <small style="color: #666; font-size: 0.8em;">
                                        CSV format: student_id,name,age,gender,email,contact_number
                                    </small>
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn-submit">Add Student</button>
                                    <button type="button" id="closeStudentForm" class="btn-cancel">Cancel</button>
                                </div>
                            </form>
                        </div>

                        <!-- Add HTE Form -->
                        <div id="addHTEFormContainer" class="form-container" style="display:none;">
                            <h3>Add New HTE</h3>
                            <form id="hteForm">
                                <div class="form-group">
                                    <label for="hteName">Name:</label>
                                    <input type="text" id="hteName" name="NAME" required>
                                </div>
                                <div class="form-group">
                                    <label for="hteIndustry">Industry:</label>
                                    <input type="text" id="hteIndustry" name="INDUSTRY" required>
                                </div>
                                <div class="form-group">
                                    <label for="hteAddress">Address:</label>
                                    <input type="text" id="hteAddress" name="ADDRESS" required>
                                </div>
                                <div class="form-group">
                                    <label for="hteEmail">Contact Email:</label>
                                    <input type="email" id="hteEmail" name="CONTACT_EMAIL" required>
                                </div>
                                <div class="form-group">
                                    <label for="hteContactPerson">Contact Person:</label>
                                    <input type="text" id="hteContactPerson" name="CONTACT_PERSON" required>
                                </div>
                                <div class="form-group">
                                    <label for="hteContactNumber">Contact Number:</label>
                                    <input type="text" id="hteContactNumber" name="CONTACT_NUMBER" required>
                                </div>
                                <div class="form-group">
                                    <label for="sessionSelect">Assign to Session:</label>
                                    <select id="sessionSelect" name="sessionId" required>
                                        <option value="">Select Session</option>
                                    </select>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn-submit">Add HTE</button>
                                    <button type="button" id="closeHTEForm" class="btn-cancel">Cancel</button>
                                </div>
                            </form>
                        </div>

                        <!-- Delete HTE Form -->
                        <div id="deleteHTEFormContainer" class="form-container" style="display:none;">
                            <h3>Delete HTE</h3>
                            <form id="deleteHTEFormSubmit">
                                <div class="form-group">
                                    <label for="deleteHteSelect">Select HTE to Delete:</label>
                                    <select id="deleteHteSelect" name="hteId" required>
                                        <option value="">Select HTE</option>
                                    </select>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn-submit" style="background-color: #e74c3c;">Delete HTE</button>
                                    <button type="button" id="closeDeleteHTEForm" class="btn-cancel">Cancel</button>
                                </div>
                            </form>
                        </div>

                        <!-- Delete Session Form -->
                        <div id="deleteSessionFormContainer" class="form-container" style="display:none;">
                            <h3>Delete Session</h3>
                            <form id="deleteSessionFormSubmit">
                                <div class="form-group">
                                    <label for="deleteSessionSelect">Select Session to Delete:</label>
                                    <select id="deleteSessionSelect" name="sessionId" required>
                                        <option value="">Select Session</option>
                                    </select>
                                </div>
                                <p style="color: #e74c3c; font-size: 0.9em; margin: 10px 0;">
                                    <strong>Warning:</strong> This will delete the session and all associated students, HTEs, and attendance records.
                                </p>
                                <div class="form-actions">
                                    <button type="submit" class="btn-submit" style="background-color: #e74c3c;">Delete Session</button>
                                    <button type="button" id="closeDeleteSessionForm" class="btn-cancel">Cancel</button>
                                </div>
                            </form>
                        </div>

                        <!-- View All Students Container -->
                        <div id="allStudentsContainer" class="form-container" style="display:none;">
                            <h3>All Students Under Coordinator</h3>
                            <div class="table-container">
                                <table id="allStudentsTable" class="students-table">
                                    <thead>
                                        <tr>
                                            <th>Student ID</th>
                                            <th>Name</th>
                                            <th>Age</th>
                                            <th>Gender</th>
                                            <th>Email</th>
                                            <th>Contact</th>
                                            <th>HTE Name</th>
                                            <th>Session</th>
                                        </tr>
                                    </thead>
                                    <tbody id="allStudentsTableBody">
                                    </tbody>
                                </table>
                            </div>
                            <div class="form-actions">
                                <button id="closeAllStudents" class="btn-cancel">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
 
    </div>
    <!-- Profile Modal -->
    <div id="profileModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Profile Details</h2>
                <button class="modal-close" id="closeProfileModal">&times;</button>
            </div>
            <div class="modal-body" id="profileModalContent">
                <!-- Profile content will be loaded here -->
            </div>
        </div>
    </div>

    <input type="hidden" id="hiddencdrid" value="<?php echo($cdrid)?>">
    <input type="hidden" id="hiddenSelectedHteID" value="-1">
    <input type="hidden" id="hiddenSelectedSessionId" value="-1">

    <script src="js/jquery.js"></script>
    <script src="js/mainDashboard.js"></script>

    <script>
        // Tab switching functionality
        function switchTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Remove active class from all sidebar items
            document.querySelectorAll('.sidebar-item').forEach(item => {
                item.classList.remove('active');
            });

            // Show selected tab content
            document.getElementById(tabName + 'Content').classList.add('active');

            // Add active class to selected sidebar item
            document.getElementById(tabName + 'Tab').classList.add('active');
        }

        // Control Panel JavaScript
        $(document).ready(function() {
            // Function to close all form containers
            function closeAllForms() {
                $('.form-container').slideUp();
                $('#studentForm')[0].reset();
                $('#hteForm')[0].reset();
                $('#deleteHTEFormSubmit')[0].reset();
                $('#sessionForm')[0].reset();
                $('#deleteSessionFormSubmit')[0].reset();
            }

            // Show Add Student Form with session and HTE loading
            $('#btnAddStudent').click(function() {
                closeAllForms();
                $('#studentFormContainer').slideDown();
                loadSessionOptionsForStudent();
                $('#studentForm')[0].reset();
                $('#studentForm input, #studentForm select').prop('disabled', false);
            });

            // Show Add HTE Form
            $('#btnAddHTE').click(function() {
                closeAllForms();
                loadSessionOptions();
                $('#addHTEFormContainer').slideDown();
            });

            // Show Delete HTE Form and populate HTE dropdown
            $('#btnDeleteHTE').click(function() {
                closeAllForms();
                loadHTEOptions();
                $('#deleteHTEFormContainer').slideDown();
            });

            // Show Add Session Form
            $('#btnAddSession').click(function() {
                closeAllForms();
                $('#sessionFormContainer').slideDown();
            });

            // Show Delete Session Form and populate session dropdown
            $('#btnDeleteSession').click(function() {
                closeAllForms();
                loadSessionOptionsForDelete();
                $('#deleteSessionFormContainer').slideDown();
            });

            // Close forms
            $('#closeStudentForm').click(function() {
                $('#studentFormContainer').slideUp();
                $('#studentForm')[0].reset();
            });

            $('#closeHTEForm').click(function() {
                $('#addHTEFormContainer').slideUp();
                $('#hteForm')[0].reset();
            });

            $('#closeDeleteHTEForm').click(function() {
                $('#deleteHTEFormContainer').slideUp();
            });

            // Enhanced Add Student Form Submission with CSV support
            $('#studentForm').submit(function(e) {
                e.preventDefault();

                let formData = new FormData(this);
                let hasCsvFile = $('#csvFile').get(0).files.length > 0;

                if (hasCsvFile) {
                    // Handle CSV upload
                    $.ajax({
                        url: "ajaxhandler/uploadCSV.php",
                        type: "POST",
                        data: formData,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        success: function(response) {
                            if (response.success) {
                                alert(response.message || "Students added successfully from CSV!");
                                $('#studentFormContainer').slideUp();
                                $('#studentForm')[0].reset();
                            } else {
                                alert("Error: " + (response.message || "Failed to process CSV"));
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error("CSV upload error:", error);
                            alert("Error uploading CSV file. Please check the format and try again.");
                        }
                    });
                } else {
                    // Handle single student addition
                    let sessionId = $('#sessionSelectStudent').val();
                    let hteId = $('#hteSelectStudent').val();

                    // Session and HTE are now optional
                    formData.append('action', 'addStudent');
                    if (sessionId) formData.append('sessionId', sessionId);
                    if (hteId) formData.append('hteId', hteId);

                    $.ajax({
                        url: "ajaxhandler/attendanceAJAX.php",
                        type: "POST",
                        data: formData,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        success: function(response) {
                            if (response.success) {
                                alert("Student added successfully!");
                                $('#studentFormContainer').slideUp();
                                $('#studentForm')[0].reset();
                            } else {
                                alert("Error adding student: " + (response.message || "Unknown error"));
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error("Add student error:", error);
                            alert("Error adding student. Please check your input and try again.");
                        }
                    });
                }
            });

            // Load sessions for student form
            function loadSessionOptionsForStudent() {
                $.ajax({
                    url: "ajaxhandler/attendanceAJAX.php",
                    type: "POST",
                    dataType: "json",
                    data: {action: "getSession"},
                    success: function(response) {
                        if (response && response.length > 0) {
                            let options = '<option value="">Select Session</option>';
                            response.forEach(function(session) {
                                const sessionId = session.ID;
                                const sessionName = session.YEAR + " " + session.TERM;
                                options += `<option value="${sessionId}">${sessionName}</option>`;
                            });
                            $('#sessionSelectStudent').html(options);
                        } else {
                            alert("No sessions found. Please add a session first.");
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Error loading sessions:", error);
                        alert("Error loading sessions. Please try again.");
                    }
                });
            }

            // Load HTEs based on selected session for student form
            function loadHTEOptionsForStudent(sessionId) {
                if (!sessionId) {
                    $('#hteSelectStudent').html('<option value="">Select HTE</option>');
                    return;
                }

                let cdrid = $('#hiddencdrid').val();
                $.ajax({
                    url: "ajaxhandler/attendanceAJAX.php",
                    type: "POST",
                    dataType: "json",
                    data: {cdrid: cdrid, sessionid: sessionId, action: "getHTE"},
                    success: function(response) {
                        if (response && response.length > 0) {
                            let options = '<option value="">Select HTE</option>';
                            response.forEach(function(hte) {
                                options += `<option value="${hte.HTE_ID}">${hte.NAME} (${hte.INDUSTRY})</option>`;
                            });
                            $('#hteSelectStudent').html(options);
                        } else {
                            $('#hteSelectStudent').html('<option value="">No HTEs found for this session</option>');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Error loading HTEs:", error);
                        alert("Error loading HTEs. Please try again.");
                    }
                });
            }

            // CSV file change handler
            $(document).on('change', '#csvFile', function() {
                let hasFile = $(this).get(0).files.length > 0;
                $('#studentForm input[type="text"], #studentForm input[type="number"], #studentForm input[type="email"], #studentForm input[type="tel"], #studentForm select')
                    .not('#csvFile')
                    .prop('disabled', hasFile);

                if (hasFile) {
                    $('#sessionSelectStudent, #hteSelectStudent').prop('disabled', false);
                }
            });

            // Session change handler for student form
            $(document).on('change', '#sessionSelectStudent', function() {
                let sessionId = $(this).val();
                loadHTEOptionsForStudent(sessionId);
            });

            // Add HTE Form Submission
            $('#hteForm').submit(function(e) {
                e.preventDefault();
                let formData = $(this).serialize();

                $.ajax({
                    url: "ajaxhandler/attendanceAJAX.php",
                    type: "POST",
                    dataType: "json",
                    data: formData + "&action=addHTEControl",
                        success: function(response) {
                            if (response.success) {
                                alert("HTE added successfully!");
                                $('#addHTEFormContainer').slideUp();
                                $('#hteForm')[0].reset();
                            } else {
                                alert("Error adding HTE: " + response.message);
                            }
                        },
                    error: function(xhr, status, error) {
                        alert("Error adding HTE. Please try again.");
                    }
                });
            });

            // Function to load HTE options for delete dropdown
            function loadHTEOptions() {
                $.ajax({
                    url: "ajaxhandler/attendanceAJAX.php",
                    type: "POST",
                    dataType: "json",
                    data: {action: "getHTEList"},
                    success: function(response) {
                        if (response.success) {
                            let options = '<option value="">Select HTE</option>';
                            response.htes.forEach(function(hte) {
                                options += `<option value="${hte.HTE_ID}">${hte.NAME}</option>`;
                            });
                            $('#deleteHteSelect').html(options);
                        } else {
                            alert("Error loading HTEs: " + response.message);
                        }
                    },
                    error: function(xhr, status, error) {
                        alert("Error loading HTEs. Please try again.");
                    }
                });
            }

            // Function to load session options for HTE form
            function loadSessionOptions() {
                $.ajax({
                    url: "ajaxhandler/attendanceAJAX.php",
                    type: "POST",
                    dataType: "json",
                    data: {action: "getSession"},
                    success: function(response) {
                        console.log("Session response:", response);
                        if (response && response.length > 0) {
                            let options = '<option value="">Select Session</option>';
                            response.forEach(function(session) {
                                const sessionId = session.ID;
                                const sessionName = session.YEAR + " " + session.TERM;
                                options += `<option value="${sessionId}">${sessionName}</option>`;
                            });
                            $('#sessionSelect').html(options);
                        } else {
                            alert("Error loading sessions: No sessions found");
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Error loading sessions:", error);
                        alert("Error loading sessions. Please try again.");
                    }
                });
            }

            // Delete HTE Form Submission - fixed endpoint name
            $('#deleteHTEFormSubmit').submit(function(e) {
                e.preventDefault();
                let hteId = $('#deleteHteSelect').val();

                if (confirm("Are you sure you want to delete this HTE?")) {
                    $.ajax({
                        url: "ajaxhandler/attendanceAJAX.php",
                        type: "POST",
                        dataType: "json",
                        data: {hteId: hteId, action: "deleteHTE"},
                        success: function(response) {
                            if (response.success) {
                                alert("HTE deleted successfully!");
                                $('#deleteHTEFormContainer').slideUp();
                                loadHTEOptions(); // Refresh the dropdown
                            } else {
                                alert("Error deleting HTE: " + response.message);
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("AJAX Error:", error);
                            alert("Error deleting HTE. Please try again.");
                        }
                    });
                }
            });

            // Show Add Session Form
            $('#btnAddSession').click(function() {
                $('#sessionFormContainer').slideDown();
            });

            // Close Session Form
            $('#closeSessionForm').click(function() {
                $('#sessionFormContainer').slideUp();
                $('#sessionForm')[0].reset();
            });

            // Add Session Form Submission
            $('#sessionForm').submit(function(e) {
                e.preventDefault();
                let formData = $(this).serialize();

                $.ajax({
                    url: "ajaxhandler/addSessionAjax.php",
                    type: "POST",
                    dataType: "json",
                    data: formData,
                    success: function(response) {
                        if (response.success) {
                            alert("Session added successfully!");
                            $('#sessionFormContainer').slideUp();
                            $('#sessionForm')[0].reset();
                            // Refresh session options in HTE form
                            loadSessionOptions();
                        } else {
                            alert("Error adding session: " + response.message);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Error adding session:", error);
                        alert("Error adding session. Please try again.");
                    }
                });
            });

            // Show Delete Session Form and populate session dropdown
            $('#btnDeleteSession').click(function() {
                loadSessionOptionsForDelete();
                $('#deleteSessionFormContainer').slideDown();
            });

            // Close Delete Session Form
            $('#closeDeleteSessionForm').click(function() {
                $('#deleteSessionFormContainer').slideUp();
            });

            // Function to load session options for delete dropdown
            function loadSessionOptionsForDelete() {
                $.ajax({
                    url: "ajaxhandler/attendanceAJAX.php",
                    type: "POST",
                    dataType: "json",
                    data: {action: "getSession"},
                    success: function(response) {
                        console.log("Session response for delete:", response);
                        if (response && response.length > 0) {
                            let options = '<option value="">Select Session</option>';
                            response.forEach(function(session) {
                                const sessionId = session.ID;
                                const sessionName = session.YEAR + " " + session.TERM;
                                options += `<option value="${sessionId}">${sessionName}</option>`;
                            });
                            $('#deleteSessionSelect').html(options);
                        } else {
                            alert("Error loading sessions: No sessions found");
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Error loading sessions for delete:", error);
                        alert("Error loading sessions. Please try again.");
                    }
                });
            }

            // Delete Session Form Submission
            $('#deleteSessionFormSubmit').submit(function(e) {
                e.preventDefault();
                let sessionId = $('#deleteSessionSelect').val();

                if (confirm("Are you sure you want to delete this session? This will delete all associated students, HTEs, and attendance records.")) {
                    $.ajax({
                        url: "ajaxhandler/deleteSessionAjax.php",
                        type: "POST",
                        dataType: "json",
                        data: {sessionId: sessionId},
                        success: function(response) {
                            if (response.success) {
                                alert("Session deleted successfully! " + response.message);
                                $('#deleteSessionFormContainer').slideUp();
                                // Refresh session options in other forms
                                loadSessionOptions();
                                loadSessionOptionsForDelete();
                            } else {
                                alert("Error deleting session: " + response.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error("Error deleting session:", error);
                            alert("Error deleting session. Please try again.");
                        }
                    });
                }
            });
        });
    </script>
</body>
</html>
