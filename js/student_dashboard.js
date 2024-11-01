$(function(e) {
    loadStudentDetails();
    loadInternshipDetails();
    loadAttendanceStatus();

    $(document).on("click", "#btnLogout", function(ee) {
        $.ajax({
            url: "ajaxhandler/logoutAjax.php",
            type: "POST",
            dataType: "json",
            data: {id: 1},
            beforeSend: function(e) {
            },
            success: function(rv) {
                document.location.replace("student_login.php");
            },
            error: function(xhr, status, error) {
                alert("Something went wrong!")
            }
        });
    });

    $("#timeInButton").click(function() {
        recordAttendance('timein');
    });

    $("#timeOutButton").click(function() {
        recordAttendance('timeout');
    });
});

function loadStudentDetails() {
    let studentId = $("#hiddenStudentId").val();
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {action: "getStudentDetails", studentId: studentId},
        success: function(rv) {
            console.log("Student Details Response:", rv);
            if(rv.status === "success") {
                let html = `
                    <h3>Student Details</h3>
                    <p><strong>Intern ID:</strong> ${rv.data.INTERNS_ID}</p>
                    <p><strong>Student ID:</strong> ${rv.data.STUDENT_ID}</p>
                    <p><strong>Name:</strong> ${rv.data.NAME}</p>
                    <p><strong>Age:</strong> ${rv.data.AGE}</p>
                    <p><strong>Gender:</strong> ${rv.data.GENDER}</p>
                    <p><strong>Email:</strong> ${rv.data.EMAIL}</p>
                    <p><strong>Contact Number:</strong> ${rv.data.CONTACT_NUMBER}</p>
                `;
                $("#studentDetailsArea").html(html);
            } else {
                $("#studentDetailsArea").html("<p>Error loading student details: " + (rv.message || "Unknown error") + "</p>");
            }
        },
        error: function(xhr, status, error) {
            console.log("Student Details Error Response:", xhr.responseText);
            $("#studentDetailsArea").html("<p>Error: " + error + "</p>");
        }
    });
}

function loadInternshipDetails() {
    let studentId = $("#hiddenStudentId").val();
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {action: "getInternshipDetails", studentId: studentId},
        success: function(rv) {
            console.log("Internship Details Response:", rv);
            if(rv.status === "success") {
                let html = `
                    <h3>Internship Details</h3>
                    <p><strong>Intern ID:</strong> ${rv.data.INTERNS_ID}</p>
                    <p><strong>Session ID:</strong> ${rv.data.SESSION_ID}</p>
                    <p><strong>HTE ID:</strong> ${rv.data.HTE_ID}</p>
                `;
                $("#internshipDetailsArea").html(html);
            } else {
                $("#internshipDetailsArea").html("<p>Error loading internship details: " + (rv.message || "Unknown error") + "</p>");
            }
        },
        error: function(xhr, status, error) {
            console.log("Internship Details Error Response:", xhr.responseText);
            $("#internshipDetailsArea").html("<p>Error: " + error + "</p>");
        }
    }); 
}

function recordAttendance(type) {
    let studentId = $("#hiddenStudentId").val();
    let sessionId = $("#hiddenSessionId").val();
    let hteId = $("#hiddenHteId").val();
    
    // Get the current time in Philippine Standard Time, with only hours and minutes
    let options = { timeZone: 'Asia/Manila', hour12: true, hour: '2-digit', minute: '2-digit' };
    let currentTime = new Date().toLocaleTimeString('en-US', options);
    
    console.log("Recording attendance at Philippine time:", currentTime);

    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "recordAttendance", 
            studentId: studentId, 
            type: type,
            sessionId: sessionId,
            hteId: hteId,
            time: currentTime
        },
        success: function(response) {
            if(response.status === "success") {
                let updateData = {
                    ON_DATE: new Date().toLocaleDateString('en-US', {timeZone: 'Asia/Manila'}),
                    [type.toUpperCase()]: currentTime
                };
                updateAttendanceUI(updateData);
                $("#attendanceStatusMessage").text(response.message).removeClass("error").addClass("success");
            } else {
                console.error("Error recording attendance:", response.message);
                $("#attendanceStatusMessage").text("Error: " + response.message).removeClass("success").addClass("error");
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX error when recording attendance:", status, error);
            $("#attendanceStatusMessage").text("Error recording attendance. Please try again.").removeClass("success").addClass("error");
        }
    });
}

function updateAttendanceUI(data) {
    console.log("Updating UI with data:", data);
    if (data.ON_DATE) {
        $("#currentDate").text(data.ON_DATE);
    }
    if (data.TIMEIN) {
        $("#timeInDisplay").text(data.TIMEIN);
        $("#timeInButton").prop('disabled', true);
    }
    if (data.TIMEOUT) {
        $("#timeOutDisplay").text(data.TIMEOUT);
        $("#timeOutButton").prop('disabled', true);
    }
    
    // Update attendance status
    if (data.TIMEIN && data.TIMEOUT) {
        $("#attendanceStatus").text("Present");
    } else if (data.TIMEIN) {
        $("#attendanceStatus").text("Checked In");
    } else {
        $("#attendanceStatus").text("Not Checked In");
    }
}



function loadAttendanceStatus() {
    let studentId = $("#hiddenStudentId").val();
    let currentDate = new Date().toISOString().split('T')[0];

    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getAttendanceStatus",
            studentId: studentId,
            date: currentDate
        },
        success: function(response) {
            console.log("Attendance Status Response:", response);
            if(response.status === "success") {
                updateAttendanceUI(response.data);
            } else {
                console.error("Error loading attendance status:", response.message);
                $("#attendanceStatus").text("Error loading attendance status");
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX error when loading attendance status:", status, error);
            console.log("Server response:", xhr.responseText);
            $("#attendanceStatus").text("Error loading attendance status");
        }
    });
}


function checkAndResetAttendance() {
    let now = new Date();
    let options = { timeZone: 'Asia/Manila', hour12: false, hour: '2-digit', minute: '2-digit' };
    let currentTime = now.toLocaleTimeString('en-US', options);
    let currentDate = now.toLocaleDateString('en-US', {timeZone: 'Asia/Manila'});

    // If it's midnight (00:00), reset the attendance UI
    if (currentTime === "00:00") {
        $("#timeInDisplay").text("--:-- --");
        $("#timeOutDisplay").text("--:-- --");
        $("#timeInButton").prop('disabled', false);
        $("#timeOutButton").prop('disabled', false);
        $("#attendanceStatus").text("Not Checked In");
        $("#currentDate").text(currentDate);
    }
}

// Call this function every minute
setInterval(checkAndResetAttendance, 60000);