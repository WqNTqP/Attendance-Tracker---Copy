<?php 

//kani na code kay condition ni siya 
//para if wala naka login mo balik raka sa login page
session_start();
// Ensure coordinator session variables are set for backend access
if (isset($_SESSION["current_user"]) && !isset($_SESSION["coordinator_user"])) {
    $_SESSION["coordinator_user"] = $_SESSION["current_user"];
    $_SESSION["user_type"] = "coordinator";
    $_SESSION["user_id"] = $_SESSION["current_user"];
}
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <title>Attendance</title>
</head>
<body>

    <!-- Report Tab Loader -->
    <div id="reportLoader" class="lockscreen" style="z-index:9999;">
        <div class="spinner"></div>
    </div>




    <div class="page">
    <div class="top-header">
        <button id="sidebarToggle" class="sidebar-toggle" aria-label="Toggle Sidebar">&#9776;</button>
        <div class="sidebar-logo" style="margin-left: 1rem; cursor: pointer;" onclick="window.location.href='mainDashboard.php';">
            <h2 class="logo" style="cursor: pointer;">InternConnect</h2>
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
                <li class="sidebar-item active" id="attendanceTab" data-tab="attendance"><i class="fas fa-calendar-check"></i> Attendance</li>
                <li class="sidebar-item" id="evaluationTab" data-tab="evaluation"><i class="fas fa-clipboard-list"></i> Evaluation</li>
                <li class="sidebar-item" id="controlTab" data-tab="control"><i class="fas fa-cogs"></i> Control</li>
                <li class="sidebar-item" id="reportTab" data-tab="report"><i class="fas fa-file-alt"></i> Report</li>
                <li class="sidebar-item" id="predictionTab" data-tab="prediction"><i class="fas fa-chart-line"></i> Prediction</li>
                <li class="sidebar-item" id="postAnalysisTab" data-tab="postAnalysis"><i class="fas fa-chart-bar"></i> Post-Analysis</li>
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
        <!-- Report Tab Content -->
        <div id="reportContent" class="tab-content">
            <div class="reports-container">
                <div class="reports-header">
                    <h2>Approved Weekly Reports</h2>
                    <p class="welcome-subtitle">Attendance Tracker System</p>
                    <div class="report-filters">
                        <label for="filterStudent">Student:</label>
                        <select id="filterStudent"></select>
                        <label for="filterDate">Date:</label>
                        <input type="date" id="filterDate" />
                        <button id="applyReportFilters" class="btnReport">Apply Filters</button>
                    </div>
                </div>
                <div id="approvedReportsList">
                    <p>Loading approved weekly reports...</p>
                </div>
            </div>
        </div>
            <!-- Evaluation Tab Content -->
        <div id="evaluationContent" class="tab-content">
            <div class="evaluation-top">
                <div class="evaluation-tab-bar-img">
                    <button class="evaluation-tab-img active" id="evalQuestionsTabBtn">All Evaluation Questions</button>
                    <button class="evaluation-tab-img" id="rateTabBtn">Pre-Assessment</button>
                    <button class="evaluation-tab-img" id="postAssessmentTabBtn">Post-Assessment</button>
                    <button class="evaluation-tab-img" id="reviewTabBtn">Review</button>
                    <button class="evaluation-tab-img" id="statsTabBtn">Stats</button>
                </div>
            </div>
            <div class="evaluation-content-area">
                <div class="evaluation-tab-panel">
                    <div class="evaluation-tab-content-img">
                        <div id="evalQuestionsTabContent" class="evaluation-inner-content active">
                            <div class="all-questions-container">
                                <ul id="allQuestionsList" class="question-list">
                                    <!-- Questions will be loaded here dynamically as <li class='question-card'> ... </li> -->
                                </ul>
                            </div>
                        </div>
                        <div id="rateTabContent" class="evaluation-inner-content">
                            <div class="preassessment-flex-container">
                                <div class="preassessment-left-panel">
                                    <div class="preassessment-search-bar">
                                        <input type="text" id="rateStudentSearch" placeholder="Search student" style="padding: 0.5rem 1rem; font-size: 1rem; border-radius: 6px; border: 1px solid #e2e8f0; width: 100%;">
                                    </div>
                                    <div id="studentListPanel" class="preassessment-student-list">
                                        <!-- Student list will be loaded here dynamically -->
                                    </div>
                                </div>
                                <div class="preassessment-right-panel">
                                    <div id="rateEvalList">
                                        <!-- Evaluation cards/messages will be loaded here dynamically -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="postAssessmentTabContent" class="evaluation-inner-content" style="display:none;">
                            <div class="postassessment-flex-container">
                                <div class="postassessment-left-panel">
                                    <div class="postassessment-search-bar">
                                        <input type="text" id="postStudentSearch" placeholder="Search student" style="padding: 0.5rem 1rem; font-size: 1rem; border-radius: 6px; border: 1px solid #e2e8f0; width: 100%;">
                                    </div>
                                    <div id="postStudentListPanel" class="postassessment-student-list">
                                        <!-- Student list will be loaded here dynamically -->
                                    </div>
                                </div>
                                <div class="postassessment-right-panel">
                                    <div id="postEvalList">
                                        <!-- Post-assessment evaluation cards/messages will be loaded here dynamically -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="reviewTabContent" class="evaluation-inner-content">
                            <div class="review-flex-container">
                                <div class="review-left-panel">
                                    <div class="review-search-bar">
                                        <input type="text" id="reviewStudentSearch" placeholder="Search reviewed students..." style="padding: 0.5rem 1rem; font-size: 1rem; border-radius: 6px; border: 1px solid #e2e8f0; width: 100%;">
                                    </div>
                                    <div id="reviewStudentListPanel" class="review-student-list">
                                        <!-- Rated student list will be loaded here dynamically -->
                                    </div>
                                </div>
                                <div class="review-right-panel">
                                    <div id="reviewedEvalList">
                                        <!-- View-only evaluation cards/messages will be loaded here dynamically -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="statsTabContent" class="evaluation-inner-content">
                            <div class="stats-eval-container">
                                <h3>Evaluation Statistics</h3>
                                <div id="statsSummary" style="margin-bottom:2rem;"></div>
                                <div>
                                    <canvas id="questionRatingsChart" style="max-width:700px;"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Prediction Tab Content -->
        <div id="predictionContent" class="tab-content">
            <div class="prediction-container">
                <h2>Prediction</h2>
                <button id="runPredictionBtn" class="btnReport">Run Prediction</button>
                <div id="predictionSpinner" style="display:none; margin:1em 0; text-align:center;">
                    <div class="spinner"></div>
                    <span>Validating and predicting...</span>
                </div>
                <div class="prediction-table-wrapper">
                    <table id="predictionTable" class="prediction-table">
                        <thead>
                            <tr>
                                <th>STUDENT NAME</th>
                                <th>HTE ASSIGNED</th>
                                <th>STATUS</th>
                                <th>Predicted Placement</th>
                                <th>Analysis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Rows will be populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>





        <!-- Control Tab Content -->
        <div id="controlContent" class="tab-content">
            <div class="control-top">
                <div class="control-buttons">
                    <button id="btnViewAllStudents" class="control-btn" aria-label="View All Students" title="View All Students"><i class="fas fa-users"></i></button>
                    <button id="btnAddStudent" class="control-btn" aria-label="Add Student" title="Add Student"><i class="fas fa-user-plus"></i></button>
                    <button id="btnAddHTE" class="control-btn" aria-label="Add HTE" title="Add HTE"><i class="fas fa-building"></i></button>
                    <button id="btnAddSession" class="control-btn" aria-label="Add Session" title="Add Session"><i class="fas fa-calendar-plus"></i></button>
                    <button id="btnDeleteStudent" class="control-btn" aria-label="Delete Student" title="Delete Student"><i class="fas fa-user-minus"></i></button>
                    <button id="btnDeleteHTE" class="control-btn" aria-label="Delete HTE" title="Delete HTE"><i class="fas fa-building"></i></button>
                    <button id="btnDeleteSession" class="control-btn" aria-label="Delete Session" title="Delete Session"><i class="fas fa-calendar-minus"></i></button>
                </div>
            </div>

            <div class="control-bottom">
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
                            <form id="studentForm" method="POST" enctype="multipart/form-data" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group" style="grid-column: 1 / 3;">
                                    <label for="studentId">Student ID:</label>
                                    <input type="text" id="studentId" name="studentId" required placeholder="Enter Student ID">
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="name">First Name:</label>
                                    <input type="text" id="name" name="name" required placeholder="Enter First Name">
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="surname">Last Name:</label>
                                    <input type="text" id="surname" name="surname" required placeholder="Enter Last Name">
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="gender">Gender:</label>
                                    <select id="gender" name="gender" required>
                                        <option value="" disabled selected>Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="age">Age:</label>
                                    <input type="number" id="age" name="age" min="15" max="100" required placeholder="Enter Age">
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="email">Email:</label>
                                    <input type="email" id="email" name="email" required placeholder="Enter Email">
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="contactNumber">Contact Number:</label>
                                    <input type="tel" id="contactNumber" name="contactNumber" pattern="[0-9+\-\s()]{7,20}" required placeholder="Enter Contact Number">
                                </div>

                                <!-- Grade Inputs for Pre-Assessment -->
                                <div class="form-group" style="grid-column: 1 / 3;">
                                    <h4>Enter Grades for Pre-Assessment Subjects</h4>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="cc102">CC 102:</label>
                                    <input type="number" id="cc102" name="cc102" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="cc103">CC 103:</label>
                                    <input type="number" id="cc103" name="cc103" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="pf101">PF 101:</label>
                                    <input type="number" id="pf101" name="pf101" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="cc104">CC 104:</label>
                                    <input type="number" id="cc104" name="cc104" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="ipt101">IPT 101:</label>
                                    <input type="number" id="ipt101" name="ipt101" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="ipt102">IPT 102:</label>
                                    <input type="number" id="ipt102" name="ipt102" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="cc106">CC 106:</label>
                                    <input type="number" id="cc106" name="cc106" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="cc105">CC 105:</label>
                                    <input type="number" id="cc105" name="cc105" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="im101">IM 101:</label>
                                    <input type="number" id="im101" name="im101" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="im102">IM 102:</label>
                                    <input type="number" id="im102" name="im102" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="hci101">HCI 101:</label>
                                    <input type="number" id="hci101" name="hci101" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="hci102">HCI 102:</label>
                                    <input type="number" id="hci102" name="hci102" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="ws101">WS 101:</label>
                                    <input type="number" id="ws101" name="ws101" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="net101">NET 101:</label>
                                    <input type="number" id="net101" name="net101" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="net102">NET 102:</label>
                                    <input type="number" id="net102" name="net102" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="ias101">IAS 101:</label>
                                    <input type="number" id="ias101" name="ias101" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="ias102">IAS 102:</label>
                                    <input type="number" id="ias102" name="ias102" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="cap101">CAP 101:</label>
                                    <input type="number" id="cap101" name="cap101" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="cap102">CAP 102:</label>
                                    <input type="number" id="cap102" name="cap102" min="0" max="100" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="sp101">SP 101:</label>
                                    <input type="number" id="sp101" name="sp101" min="0" max="100" required>
                                </div>
                                 <!-- Move SESSION and HTE dropdowns to the very bottom of the form -->
                                <div class="form-group" style="grid-column: 1 / 3;">
                                    <label for="sessionSelectStudent">Assign to Session:</label>
                                    <select id="sessionSelectStudent" name="sessionId" required style="width: 100%;">
                                        <option value="">Select Session</option>
                                    </select>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 3;">
                                    <label for="hteSelectStudent">Assign to HTE:</label>
                                    <select id="hteSelectStudent" name="hteId" required style="width: 100%;">
                                        <option value="">Select HTE</option>
                                    </select>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="csvFile">Upload CSV File (Bulk Import):</label>
                                    <input type="file" id="csvFile" name="csvFile" accept=".csv">
                                    <small style="color: #666; font-size: 0.8em;">
                                        CSV format: student_id,name,surname,age,gender,email,contact_number
                                    </small>
                                    <br/>
                                    <a href="sample_students.csv" download style="font-size: 0.9em;">Download Sample CSV Format</a>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3; display: flex; flex-direction: column; justify-content: flex-end;">
                                    <div class="form-actions" style="display: flex; gap: 1rem;">
                                        <button type="submit" class="btn-submit" style="flex: 1;">Add Student</button>
                                        <button type="button" id="closeStudentForm" class="btn-cancel" style="flex: 1;">Close</button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <!-- Add HTE Form -->
                        <div id="addHTEFormContainer" class="form-container" style="display:none;">
                            <h3>Add New HTE</h3>
                            <form id="hteForm" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="hteName">Name:</label>
                                    <input type="text" id="hteName" name="NAME" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="hteIndustry">Industry:</label>
                                    <input type="text" id="hteIndustry" name="INDUSTRY" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="hteAddress">Address:</label>
                                    <input type="text" id="hteAddress" name="ADDRESS" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="hteEmail">Contact Email:</label>
                                    <input type="email" id="hteEmail" name="CONTACT_EMAIL" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="hteContactPerson">Contact Person:</label>
                                    <input type="text" id="hteContactPerson" name="CONTACT_PERSON" required>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3;">
                                    <label for="hteContactNumber">Contact Number:</label>
                                    <input type="text" id="hteContactNumber" name="CONTACT_NUMBER" required>
                                </div>
                                <div class="form-group" style="grid-column: 1 / 2;">
                                    <label for="sessionSelect">Assign to Session:</label>
                                    <select id="sessionSelect" name="sessionId" required>
                                        <option value="">Select Session</option>
                                    </select>
                                </div>
                                <div class="form-group" style="grid-column: 2 / 3; display: flex; flex-direction: column; justify-content: flex-end;">
                                    <div class="form-actions" style="display: flex; gap: 1rem;">
                                        <button type="submit" class="btn-submit" style="flex: 1;">Add HTE</button>
                                        <button type="button" id="closeHTEForm" class="btn-cancel" style="flex: 1;">Cancel</button>
                                    </div>
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

                        <!-- Delete Student Form -->
                        <div id="deleteStudentFormContainer" class="form-container" style="display:none;">
                            <h3>Delete Student(s)</h3>
                            <form id="deleteStudentForm">
                                <div style="display: flex; gap: 1rem;">
                                    <div class="form-group" style="flex: 1;">
                                        <label for="deleteStudentSessionSelect">Select Session:</label>
                                        <select id="deleteStudentSessionSelect" name="sessionId" required>
                                            <option value="">Select Session</option>
                                        </select>
                                    </div>
                                    <div class="form-group" style="flex: 1;">
                                        <label for="deleteStudentHteSelect">Select HTE:</label>
                                        <select id="deleteStudentHteSelect" name="hteId" required>
                                            <option value="">Select HTE</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Students:</label>
                                    <div id="deleteStudentList" style="max-height: 490px; overflow-y: auto; border: 1px solid #ccc; padding: 0.5rem;">
                                        <!-- Student checkboxes will be loaded here -->
                                    </div>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn-submit" style="background-color: #e74c3c;">Delete Selected Students</button>
                                    <button type="button" id="closeDeleteStudentForm" class="btn-cancel">Cancel</button>
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
                        <div id="allStudentsContainer" class="form-container">
                            <h3>All Students Under Coordinator</h3>
                            <div class="table-container">
                                <table id="allStudentsTable" class="students-table">
                                    <thead>
                                        <tr>
                                            <th>Student ID</th>
                                            <th>Name</th>
                                            <th>Surname</th>
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
            <!-- Post-Analysis Tab Content -->
            <div id="postAnalysisContent" class="tab-content">
                <div class="postanalysis-flex-container">
                    <div class="postanalysis-left-panel">
                        <div class="postanalysis-search-bar" style="margin-bottom: 1rem;">
                            <input type="text" id="postAnalysisStudentSearch" placeholder="Search student" style="padding: 0.5rem 1rem; font-size: 1rem; border-radius: 6px; border: 1px solid #e2e8f0; width: 100%;">
                        </div>
                        <div id="postAnalysisStudentListPanel" class="postanalysis-student-list">
                            <!-- Student list will be loaded here dynamically -->
                        </div>
                    </div>
                    <div class="postanalysis-right-panel">
                        <div id="postAnalysisEvalPanel">
                            <h2>Post-Analysis</h2>
                            <p class="welcome-subtitle">Insights and analysis after all evaluations and predictions.</p>
                            <div id="postAnalysisContentArea">
                                <div class="postanalysis-summary-card">
                                    <h3>Predicted Placement</h3>
                                    <div class="predicted-placement-badge">Systems Development</div>
                                    <p class="prediction-reasoning">
                                        <b>Reasoning:</b> Recommended for <b>Systems Development</b> due to strong performance in: <span class="subject-list">IPT 101: 92.0, CC 106: 91.0, PF 101: 90.0</span>.<br>
                                        Both soft skill and communication skill ratings reinforce the suitability of this placement.
                                    </p>
                                </div>
                                <div class="postanalysis-averages-table">
                                    <h3>Post-Assessment Averages</h3>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Supervisor Avg</th>
                                                <th>Self Avg</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Systems Development</td>
                                                <td>3.0</td>
                                                <td>3.0</td>
                                            </tr>
                                            <tr>
                                                <td>Research</td>
                                                <td>5.0</td>
                                                <td>3.0</td>
                                            </tr>
                                            <tr>
                                                <td>Business Operations</td>
                                                <td>3.0</td>
                                                <td>3.0</td>
                                            </tr>
                                            <tr>
                                                <td>Technical Support</td>
                                                <td>5.0</td>
                                                <td>3.0</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="postanalysis-insights">
                                    <h3>Analysis &amp; Recommendation</h3>
                                    <ul>
                                        <li><b>Strengths:</b> The student’s self-assessment and supervisor ratings are consistent, especially in Systems Development, supporting the original placement prediction.</li>
                                        <li><b>Growth Areas:</b> Research supervisor average is high (5.0), but self-assessment is lower (3.0), suggesting the student may underestimate their research skills.</li>
                                        <li><b>Final Recommendation:</b> The original placement in Systems Development is validated by both detailed and average post-assessment ratings. The student is also encouraged to consider research roles, given the high supervisor feedback.</li>
                                    </ul>
                                </div>
                                <div style="margin-top:1em;">
                                    <button class="btn-view-details" onclick="document.getElementById('postAssessmentTabBtn').click();">View Full Post-Assessment Details</button>
                                </div>
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
        // Load approved weekly reports when Report tab is shown
        function loadApprovedWeeklyReports() {
            $.ajax({
                url: 'ajaxhandler/coordinatorWeeklyReportAjax.php',
                type: 'POST',
                dataType: 'json',
                data: { action: 'getWeeklyReports' },
                success: function(response) {
                    if (response.status === 'success' && response.reports && response.reports.length > 0) {
                        let html = '<div class="reports-list">';
                        response.reports.forEach(function(report) {
                            // Calculate week number
                            const weekNumber = (function(start) {
                                const d = new Date(start);
                                d.setHours(0,0,0,0);
                                d.setDate(d.getDate() + 4 - (d.getDay()||7));
                                const yearStart = new Date(d.getFullYear(),0,1);
                                return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
                            })(report.week_start);
                            html += '<div class="report-card admin-report-preview">';
                            html += '<div class="report-header">';
                            html += `<h3>${report.student_name || ''} - Week ${weekNumber}</h3>`;
                            html += '<div class="report-meta">';
                            html += `<span class="report-period">Period: ${report.week_start} to ${report.week_end}</span>`;
                            html += `<span class="approval-status approved">Approved</span>`;
                            html += '</div></div>';
                            html += '<div class="report-grid">';
                            ["monday","tuesday","wednesday","thursday","friday"].forEach(function(day) {
                                html += `<div class='day-section ${day}'>`;
                                html += `<h4>${day.charAt(0).toUpperCase() + day.slice(1)}</h4>`;
                                html += `<div class='day-content'>`;
                                html += `<div class='day-images'>`;
                                if (report.imagesPerDay && report.imagesPerDay[day]) {
                                    report.imagesPerDay[day].forEach(function(img) {
                                        html += `<img src='${img.url}' alt='${day} activity' class='activity-image'>`;
                                    });
                                }
                                html += '</div>';
                                // Show description for each day (prefer dayDescription if available)
                                let desc = "";
                                if (report[day + 'Description']) {
                                    desc = report[day + 'Description'];
                                } else if (report.contentPerDay && report.contentPerDay[day]) {
                                    desc = report.contentPerDay[day];
                                }
                                html += `<div class='day-description'><p>${desc}</p></div>`;
                                html += '</div>';
                                html += '</div>';
                            });
                            html += '</div>';
                            html += `<div class='report-footer'><div class='footer-left'><span class='updated-date'>Last Updated: ${report.updated_at || ''}</span></div></div>`;
                            html += '</div>';
                        });
                        html += '</div>';
                        $('#approvedReportsList').html(html);
                    } else {
                        $('#approvedReportsList').html('<p>No approved weekly reports found.</p>');
                    }
                },
                error: function(xhr, status, error) {
                    $('#approvedReportsList').html('<p>Error loading reports. Please try again.</p>');
                }
            });
        }

        // Hook into tab switching to load reports when Report tab is activated
        $(document).ready(function() {
    // Guard variable for student form submission
    let isSubmittingStudentForm = false;
            $('.sidebar-item').click(function() {
                var tabName = $(this).data('tab');
                if (tabName === 'report') {
                    loadApprovedWeeklyReports();
                }
            });
        });
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
            var tabContent = document.getElementById(tabName + 'Content');
            if(tabContent) tabContent.classList.add('active');

            // Add active class to selected sidebar item
            var tabSidebar = document.getElementById(tabName + 'Tab');
            if(tabSidebar) tabSidebar.classList.add('active');
        }



        // Control Panel JavaScript
        $(document).ready(function() {
            // Tab click event for sidebar
            $('.sidebar-item').click(function() {
                var tabName = $(this).data('tab');
                switchTab(tabName);
            });

            // Function to close all form containers
            function closeAllForms() {
                $('.form-container').slideUp();
                $('#studentForm')[0].reset();
                $('#hteForm')[0].reset();
                $('#deleteHTEFormSubmit')[0].reset();
                $('#sessionForm')[0].reset();
                $('#deleteSessionFormSubmit')[0].reset();
                $('#studentlistarea').html(''); // Hide student list
            }

            // Show Add Student Form with session and HTE loading
            $('#btnAddStudent').click(function() {
                closeAllForms();
                $('#studentlistarea').html(''); // Hide student list
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
                if (isSubmittingStudentForm) {
                    console.warn('[StudentForm] Submission blocked: already submitting.');
                    return;
                }
                isSubmittingStudentForm = true;

                let formData = new FormData(this);
                let hasCsvFile = $('#csvFile').get(0).files.length > 0;

                // Helper to log FormData contents
                function logFormData(fd) {
                    let out = {};
                    for (let pair of fd.entries()) {
                        out[pair[0]] = pair[1];
                    }
                    return out;
                }

                if (hasCsvFile) {
                    // Handle CSV upload
                    console.log('[StudentForm] Sending CSV upload request to ajaxhandler/uploadCSV.php');
                    console.log('[StudentForm] FormData:', logFormData(formData));
                    $.ajax({
                        url: "ajaxhandler/uploadCSV.php",
                        type: "POST",
                        data: formData,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        success: function(response) {
                            isSubmittingStudentForm = false;
                            console.log('[StudentForm] Response from uploadCSV.php:', response);
                            if (response.success) {
                                alert(response.message || "Students added successfully from CSV!");
                                $('#studentFormContainer').slideUp();
                                $('#studentForm')[0].reset();
                            } else {
                                alert("Error: " + (response.message || "Failed to process CSV"));
                            }
                        },
                        error: function(xhr, status, error) {
                            isSubmittingStudentForm = false;
                            console.error("CSV upload error:", error);
                            console.error('[StudentForm] Rejected by uploadCSV.php:', xhr.responseText);
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

                    console.log('[StudentForm] Sending single student request to ajaxhandler/attendanceAJAX.php');
                    console.log('[StudentForm] FormData:', logFormData(formData));
                    $.ajax({
                        url: "ajaxhandler/attendanceAJAX.php",
                        type: "POST",
                        data: formData,
                        contentType: false,
                        processData: false,
                        dataType: 'json',
                        success: function(response) {
                            isSubmittingStudentForm = false;
                            console.log('[StudentForm] Response from attendanceAJAX.php:', response);
                            if (response.success) {
                                alert("Student added successfully!");
                                $('#studentFormContainer').slideUp();
                                $('#studentForm')[0].reset();
                            } else {
                                alert("Error adding student: " + (response.message || "Unknown error"));
                            }
                        },
                        error: function(xhr, status, error) {
                            isSubmittingStudentForm = false;
                            console.error("Add student error:", error);
                            console.error('[StudentForm] Rejected by attendanceAJAX.php:', xhr.responseText);
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
                // Disable all except CSV, SESSION, and HTE dropdowns
                $('#studentForm input[type="text"], #studentForm input[type="number"], #studentForm input[type="email"], #studentForm input[type="tel"], #studentForm select')
                    .not('#csvFile, #sessionSelectStudent, #hteSelectStudent')
                    .prop('disabled', hasFile);
                // Always keep SESSION and HTE enabled
                $('#sessionSelectStudent, #hteSelectStudent').prop('disabled', false);
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

            // Show Delete Student Form
            $('#btnDeleteStudent').click(function() {
                closeAllForms();
                loadSessionOptionsForDeleteStudent();
                $('#deleteStudentFormContainer').slideDown();
            });

            // Close Delete Student Form
            $('#closeDeleteStudentForm').click(function() {
                $('#deleteStudentFormContainer').slideUp();
                $('#deleteStudentForm')[0].reset();
                $('#deleteStudentList').empty();
            });

            // Load sessions for Delete Student form
            function loadSessionOptionsForDeleteStudent() {
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
                            $('#deleteStudentSessionSelect').html(options);
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

            // Load HTEs based on selected session for Delete Student form
            $('#deleteStudentSessionSelect').change(function() {
                let sessionId = $(this).val();
                if (!sessionId) {
                    $('#deleteStudentHteSelect').html('<option value="">Select HTE</option>');
                    $('#deleteStudentList').empty();
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
                            $('#deleteStudentHteSelect').html(options);
                        } else {
                            $('#deleteStudentHteSelect').html('<option value="">No HTEs found for this session</option>');
                            $('#deleteStudentList').empty();
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Error loading HTEs:", error);
                        alert("Error loading HTEs. Please try again.");
                    }
                });
            });

            // Load students based on selected session and HTE for Delete Student form
            $('#deleteStudentHteSelect').change(function() {
                let sessionId = $('#deleteStudentSessionSelect').val();
                let hteId = $(this).val();
                if (!sessionId || !hteId) {
                    $('#deleteStudentList').empty();
                    return;
                }
                let cdrid = $('#hiddencdrid').val();
                $.ajax({
                    url: "ajaxhandler/attendanceAJAX.php",
                    type: "POST",
                    dataType: "json",
                    data: {cdrid: cdrid, sessionid: sessionId, hteid: hteId, action: "getStudentsBySessionAndHTE"},
                    success: function(response) {
                        if (response && response.length > 0) {
                            let html = '<table class="student-delete-table"><thead><tr><th>Student ID</th><th>Name</th><th>Surname</th><th>Checkbox</th></tr></thead><tbody>';
                            response.forEach(function(student) {
                            html += `<tr><td>${student.STUDENT_ID}</td><td>${student.NAME}</td><td>${student.SURNAME}</td><td style="text-align: center;"><input type="checkbox" class="deleteStudentCheckbox" value="${student.STUDENT_ID}" id="student_${student.STUDENT_ID}"></td></tr>`;
                            });
                            html += '</tbody></table>';
                            $('#deleteStudentList').html(html);
                        } else {
                            $('#deleteStudentList').html('<p>No students found for the selected session and HTE.</p>');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Error loading students:", error);
                        alert("Error loading students. Please try again.");
                    }
                });
            });

            // Handle Delete Student form submission
            $('#deleteStudentForm').submit(function(e) {
                e.preventDefault();
                let selectedStudents = [];
                $('.deleteStudentCheckbox:checked').each(function() {
                    selectedStudents.push($(this).val());
                });
                if (selectedStudents.length === 0) {
                    alert("Please select at least one student to delete.");
                    return;
                }
                if (!confirm("Are you sure you want to delete the selected student(s)?")) {
                    return;
                }
                $.ajax({
                    url: "ajaxhandler/attendanceAJAX.php",
                    type: "POST",
                    dataType: "json",
                    data: {studentIds: selectedStudents, action: "deleteStudents"},
                    success: function(response) {
                        if (response.success) {
                            alert("Selected student(s) deleted successfully!");
                            $('#deleteStudentFormContainer').slideUp();
                            $('#deleteStudentForm')[0].reset();
                            $('#deleteStudentList').empty();
                        } else {
                            alert("Error deleting students: " + response.message);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Error deleting students:", error);
                        alert("Error deleting students. Please try again.");
                    }
                });
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
