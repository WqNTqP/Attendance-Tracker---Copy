$(function(e) {
    loadStudentDetails();
    loadAttendanceStatus();
    loadCurrentWeek();
    loadAttendanceHistory(); 

    $(document).on("click", "#btnLogout", function(ee) {
        $.ajax({
            url: "ajaxhandler/studentLogout.php",
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


function recordAttendance(type) {
    let studentId = $("#hiddenStudentId").val();
    let sessionId = $("#hiddenSessionId").val();
    let hteId = $("#hiddenHteId").val();
    
    // Get the current time in Philippine Standard Time
    let options = { timeZone: 'Asia/Manila', hour12: true, hour: '2-digit', minute: '2-digit' };
    let currentTime = new Date().toLocaleTimeString('en-PH', options);
    
    console.log("Recording attendance at Philippine time:", currentTime);

    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "recordPendingAttendance", // Change action to recordPendingAttendance
            studentId: studentId,
            type: type,
            sessionId: sessionId,
            hteId: hteId,
            time: currentTime
        },
        success: function(response) {
            if(response.status === "success") {
                // Update UI to reflect pending status
                $("#attendanceStatusMessage").text("Attendance recorded as pending.").removeClass("error").addClass("success");

                // Fetch updated attendance status to display timein and timeout
                loadAttendanceStatus(); // Load updated attendance status
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
//
function loadAttendanceStatus() {
    let studentId = $("#hiddenStudentId").val();
    // Fetching attendance status
    let options = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' };
    let currentDate = new Intl.DateTimeFormat('en-PH', options).format(new Date());
    let [month, day, year] = currentDate.split('/');
    let formattedDate = `${year}-${month}-${day}`; // Format it to YYYY-MM-DD
    console.log("Fetching attendance for date:", formattedDate);

    // Now use formattedDate in your AJAX request
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getAttendanceStatus",
            studentId: studentId,
            date: formattedDate // Use formattedDate here
        },
        success: function(response) {
            console.log("Attendance Status Response:", response);
            updateAttendanceUI(response.data);
        },
        error: function(xhr, status, error) {
            console.error("AJAX error when loading attendance status:", status, error);
            $("#attendanceStatus").text("Error loading attendance status");
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

function checkAndResetAttendance() {
    let now = new Date();
    let options = { timeZone: 'Asia/Manila', hour12: false, hour: '2-digit', minute: '2-digit' };
    let currentTime = now.toLocaleTimeString('en-PH', options);
    let currentDate = now.toLocaleDateString('en-PH', {timeZone: 'Asia/Manila'});

    // If it's midnight (00:00), reset the attendance UI
    if (currentTime === "00:00") {
        $("#timeInDisplay").text("--:--");
        $("#timeOutDisplay").text("--:--");
        $("#timeInButton").prop('disabled', false);
        $("#timeOutButton").prop('disabled', false);
        $("#attendanceStatus").text("Not Checked In");
        $("#currentDate").text(currentDate);
    }
}



function loadCurrentWeek() {
    const currentDate = new Date();
    
    // Calculate start and end of the current week
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0); // Midnight, start of Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999); // End of Saturday

    // Format dates to a readable format for display
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedStartDate = startOfWeek.toLocaleDateString('en-PH', options);
    const formattedEndDate = endOfWeek.toLocaleDateString('en-PH', options);

    // Display the current week range
    const weekInfo = `${formattedStartDate} - ${formattedEndDate}`;
    $("#currentWeek").text(weekInfo); // Update the UI element with the week range
}

function loadAttendanceHistory() {
    const studentId = $("#hiddenStudentId").val();

    // Calculate the start and end of the current week
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0); // Midnight, start of Sunday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999); // End of Saturday

    // Send AJAX request to fetch attendance history
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getAttendanceHistory",
            studentId: studentId,
            startDate: startOfWeek.toISOString().split('T')[0], // Format: YYYY-MM-DD
            endDate: endOfWeek.toISOString().split('T')[0] // Format: YYYY-MM-DD
        },
        success: function(response) {
            console.log("Attendance History Response:", response);
            
            if (response.status === "success") {
                let html = `<h3>Attendance History (This Week)</h3>`;
                
                if (response.data.length > 0) {
                    html += `<table><tr><th>Date</th><th>Time In</th><th>Time Out</th></tr>`;
                    response.data.forEach(record => {
                        // Ensure the record's date is within the current week
                        const recordDate = new Date(record.ON_DATE);
                        if (recordDate >= startOfWeek && recordDate <= endOfWeek) {
                            // Format date and time for Philippine timezone
                            const formattedDate = recordDate.toLocaleDateString('en-PH', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            });
                            const formattedTimeIn = record.TIMEIN ? formatTimeToPH(record.TIMEIN) : 'Not Checked In';
                            const formattedTimeOut = record.TIMEOUT ? formatTimeToPH(record.TIMEOUT) : 'Not Checked Out';

                            html += `
                                <tr>
                                    <td>${formattedDate}</td>
                                    <td>${formattedTimeIn}</td>
                                    <td>${formattedTimeOut}</td>
                                </tr>`;
                        }
                    });
                    html += `</table>`;
                } else {
                    html += `<p>No attendance records found for this week.</p>`;
                }

                // Display attendance history in the designated area
                $("#attendanceHistoryArea").html(html);
            } else {
                $("#attendanceHistoryArea").html(
                    `<p>Error loading attendance history: ${response.message || "Unknown error"}</p>`
                );
            }
        },
        error: function(xhr, status, error) {
            console.log("Attendance History Error Response:", xhr.responseText);
            $("#attendanceHistoryArea").html(`<p>Error: ${error}</p>`);
        }
    });
}



// Helper function to format time in Philippine time
function formatTimeToPH(timeString) {
    // Assuming timeString is in "HH:mm:ss" format
    const timeParts = timeString.split(':'); // Split the time into parts
    const date = new Date(); // Create a new date object
    date.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2])); // Set hours, minutes, seconds

    // Format the date to Philippine time
    return date.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: true });
}


// Call this function every minute
setInterval(checkAndResetAttendance, 60000);