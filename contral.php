<?php
session_start();
// Check if user is logged in
if(!isset($_SESSION["current_user"]) && !isset($_SESSION["student_user"]) && !isset($_SESSION['current_user_role'])) {
    header("location:index.php");
    die();
}

// Determine user type and name
$userName = 'User';
if(isset($_SESSION["current_user"])) {
    $userName = $_SESSION["current_user"];
} elseif(isset($_SESSION["student_user"])) {
    $userName = $_SESSION["student_user"];
} elseif(isset($_SESSION['current_user_name'])) {
    $userName = $_SESSION['current_user_name'];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/attendance.css">
    <link rel="icon" type="image/x-icon" href="icon/favicon.ico">
    <title>Control - Attendance Tracker</title>
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
            <div class="sidebar-logo" style="margin-left: 1rem; cursor: pointer;" onclick="window.location.href='contral.php';">
                <h2 class="logo" style="cursor: pointer;">ATTENDANCE TRACKER</h2>
            </div>
        <div class="user-profile" id="userProfile">
            <span id="userName">
                <?php 
                // Get the actual user name from session
                $displayName = 'User';
                if(isset($_SESSION["current_user_name"])) {
                    $displayName = $_SESSION["current_user_name"];
                } elseif(isset($_SESSION["current_user"])) {
                    $displayName = $_SESSION["current_user"];
                } elseif(isset($_SESSION["student_user"])) {
                    $displayName = $_SESSION["student_user"];
                }
                echo htmlspecialchars($displayName);
                ?> &#x25BC;
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
                <li class="sidebar-item <?php echo basename($_SERVER['PHP_SELF']) == 'contral.php' ? 'active' : ''; ?>" id="controlTab">Control</li>
            </ul>
        </div>

        <div class="content-area">
            <div class="control-container">
                <h1 class="control-title">Control Panel</h1>
                <p class="control-subtitle">Manage Students and HTEs</p>
                
                <div class="control-buttons">
                    <button id="btnAddStudent" class="control-btn">Add Student</button>
                    <button id="btnAddHTE" class="control-btn">Add HTE</button>
                    <button id="btnDeleteHTE" class="control-btn">Delete HTE</button>
                    <button id="btnAddSession" class="control-btn">Add Session</button>
                    <button id="btnDeleteSession" class="control-btn">Delete Session</button>
                </div>
                
                <div class="control-forms">
                    <!-- Add Session Form -->
                    <div id="addSessionForm" class="modal" style="display:none;">
                        <form id="sessionForm">
                            <h2>Add New Session</h2>
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
                            <button type="submit">Add Session</button>
                            <button type="button" id="closeSessionForm">Close</button>
                        </form>
                    </div>

                    <!-- Add Student Form -->
                    <div id="addStudentForm" class="modal" style="display:none;">
                        <form id="studentForm" method="POST" enctype="multipart/form-data">
                            <h2>Add New Student</h2>
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
                            <div class="form-group">
                                <label for="sessionSelectStudent">Assign to Session:</label>
                                <select id="sessionSelectStudent" name="sessionId" required>
                                    <option value="">Select Session</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="hteSelectStudent">Assign to HTE:</label>
                                <select id="hteSelectStudent" name="hteId" required>
                                    <option value="">Select HTE</option>
                                </select>
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
                                <button type="button" id="closeStudentForm" class="btn-cancel">Close</button>
                            </div>
                        </form>
                    </div>

                    <!-- Add HTE Form -->
                    <div id="addHTEForm" class="modal" style="display:none;">
                        <form id="hteForm">
                            <h2>Add New HTE</h2>
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
                            <button type="submit">Add HTE</button>
                            <button type="button" id="closeHTEForm">Close</button>
                        </form>
                    </div>

                    <!-- Delete HTE Form -->
                    <div id="deleteHTEForm" class="modal" style="display:none;">
                        <form id="deleteHTEFormSubmit">
                            <h2>Delete HTE</h2>
                            <div class="form-group">
                                <label for="deleteHteSelect">Select HTE to Delete:</label>
                                <select id="deleteHteSelect" name="hteId" required>
                                    <option value="">Select HTE</option>
                                </select>
                            </div>
                            <button type="submit">Delete HTE</button>
                            <button type="button" id="closeDeleteHTEForm">Close</button>
                        </form>
                    </div>

                    <!-- Delete Session Form -->
                    <div id="deleteSessionForm" class="modal" style="display:none;">
                        <form id="deleteSessionFormSubmit">
                            <h2>Delete Session</h2>
                            <div class="form-group">
                                <label for="deleteSessionSelect">Select Session to Delete:</label>
                                <select id="deleteSessionSelect" name="sessionId" required>
                                    <option value="">Select Session</option>
                                </select>
                            </div>
                            <p style="color: #e74c3c; font-size: 0.9em; margin: 10px 0;">
                                <strong>Warning:</strong> This will delete the session and all associated students, HTEs, and attendance records.
                            </p>
                            <button type="submit" style="background-color: #e74c3c;">Delete Session</button>
                            <button type="button" id="closeDeleteSessionForm">Close</button>
                        </form>
                    </div>
                </div>
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

        // Control Panel JavaScript
        $(document).ready(function() {
            // Show Add Student Form with session and HTE loading
            $('#btnAddStudent').click(function() {
                $('#addStudentForm').css('display', 'flex').hide().fadeIn();
                loadSessionOptionsForStudent();
                $('#studentForm')[0].reset();
                $('#studentForm input, #studentForm select').prop('disabled', false);
            });

            // Show Add HTE Form
            $('#btnAddHTE').click(function() {
                loadSessionOptions();
                $('#addHTEForm').css('display', 'flex').hide().fadeIn();
            });

            // Show Delete HTE Form and populate HTE dropdown
            $('#btnDeleteHTE').click(function() {
                loadHTEOptions();
                $('#deleteHTEForm').css('display', 'flex').hide().fadeIn();
            });

            // Close forms
            $('#closeStudentForm').click(function() {
                $('#addStudentForm').fadeOut();
                $('#studentForm')[0].reset();
            });

            $('#closeHTEForm').click(function() {
                $('#addHTEForm').fadeOut();
                $('#hteForm')[0].reset();
            });

            $('#closeDeleteHTEForm').click(function() {
                $('#deleteHTEForm').fadeOut();
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
                                $('#addStudentForm').fadeOut();
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
                    
                    if (!sessionId || !hteId) {
                        alert("Please select both session and HTE for the student.");
                        return;
                    }
                    
                    formData.append('action', 'addStudent');
                    formData.append('sessionId', sessionId);
                    formData.append('hteId', hteId);
                    
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
                                $('#addStudentForm').fadeOut();
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
                            $('#addHTEForm').fadeOut();
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
                                $('#deleteHTEForm').fadeOut();
                                loadHTEOptions(); // Refresh the dropdown
                            } else {
                                alert("Error deleting HTE: " + response.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error("AJAX Error:", error);
                            alert("Error deleting HTE. Please try again.");
                        }
                    });
                }
            });

            // Show Add Session Form
            $('#btnAddSession').click(function() {
                $('#addSessionForm').css('display', 'flex').hide().fadeIn();
            });

            // Close Session Form
            $('#closeSessionForm').click(function() {
                $('#addSessionForm').fadeOut();
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
                            $('#addSessionForm').fadeOut();
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
                $('#deleteSessionForm').css('display', 'flex').hide().fadeIn();
            });

            // Close Delete Session Form
            $('#closeDeleteSessionForm').click(function() {
                $('#deleteSessionForm').fadeOut();
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
                                $('#deleteSessionForm').fadeOut();
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
