$(function(e) {
    // Initialize dashboard
    loadDashboardStats();
    loadAttendanceStatus();
    loadCurrentWeek();
    loadWeekOverview();
    loadRecentActivity();
    updateCurrentDate();

    // Global flag to prevent concurrent image uploads
    window.isProcessingUpload = false;

    // Tab navigation
    $('.sidebar-item').click(function() {
        const tab = $(this).data('tab');
        $('.sidebar-item').removeClass('active');
        $(this).addClass('active');
        $('.tab-content').removeClass('active');
        $(`#${tab}Tab`).addClass('active');

        // Load attendance history if the history tab is selected
        if (tab === 'history') {
            loadAttendanceHistory();
        }

        // Initialize report system if the report tab is selected
        if (tab === 'report') {
            initializeReportSystem();
        }
    });

    // Sidebar toggle
    $('#sidebarToggle').click(function(e) {
        e.stopPropagation();
        $('.sidebar').toggleClass('sidebar-open');
        $('.main-content').toggleClass('sidebar-collapsed');
        // Content area margin is handled by CSS when sidebar is open
    });

    // Close sidebar when clicking outside
    $(document).click(function(e) {
        // Check if sidebar is open and click is outside sidebar and not on the toggle button
        if ($('.sidebar').hasClass('sidebar-open') &&
            !$(e.target).closest('.sidebar').length &&
            !$(e.target).closest('#sidebarToggle').length) {
            $('.sidebar').removeClass('sidebar-open');
            $('.main-content').removeClass('sidebar-collapsed');
        }
    });

    // Prevent clicks inside sidebar from closing it
    $('.sidebar').click(function(e) {
        e.stopPropagation();
    });

    // User dropdown toggle
    $('#userName').click(function(e) {
        e.stopPropagation();
        $('#userDropdown').toggle();
    });

    // Close dropdown when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.user-profile').length) {
            $('#userDropdown').hide();
        }
    });

    // Attendance buttons
    $("#timeInButton").click(function() {
        recordAttendance('timein');
    });

    $("#timeOutButton").click(function() {
        recordAttendance('timeout');
    });

    // History filter
    $("#historyFilter").change(function() {
        loadAttendanceHistory();
    });

    // Update date every minute
    setInterval(updateCurrentDate, 60000);
    setInterval(checkAndResetAttendance, 60000);

    // Modal close functionality
    $("#closeProfileModal").click(function() {
        $("#profileModal").css('display', 'none');
    });

    // Close modal when clicking outside
    $("#profileModal").click(function(e) {
        if (e.target === this) {
            $("#profileModal").css('display', 'none');
        }
    });

    // Close modal with Escape key
    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            $("#profileModal").css('display', 'none');
        }
    });

    // Report preview button
    $("#previewReportBtn").click(function() {
        generateReportPreview();
    });

    // Separate logic for draft and dropdown usernames
    function updateUserNameDisplay() {
        // Handle draft username separately
        var draftName = $('#hiddenDraftUserName').val() || '';
        if (draftName) {
            $('#draftUserName').text(draftName).show();
        } else {
            $('#draftUserName').hide();
        }

        // Handle dropdown username separately
        var userName = $('#userName').text().trim();
        if (!userName.endsWith('▼')) {
            $('#userName').text(userName + ' ▼');
        }
    }

    // Call updateUserNameDisplay on document ready
    updateUserNameDisplay();
});

// Dashboard Statistics
function loadDashboardStats() {
    const studentId = $("#hiddenStudentId").val();
    
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getDashboardStats",
            studentId: studentId
        },
        success: function(response) {
            if (response.status === "success") {
                $("#presentDays").text(response.data.presentDays || 0);
                $("#totalHours").text((response.data.totalHours || 0) + "h");
                $("#attendanceRate").text((response.data.attendanceRate || 0) + "%");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error loading dashboard stats:", error);
        }
    });
}

function loadWeekOverview() {
    const studentId = $("#hiddenStudentId").val();
    
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getWeekOverview",
            studentId: studentId
        },
        success: function(response) {
            if (response.status === "success") {
                let html = '<div class="week-chart">';
                response.data.forEach(day => {
                    html += `
                        <div class="day-bar">
                            <div class="bar" style="height: ${day.percentage}%"></div>
                            <span>${day.day}</span>
                        </div>
                    `;
                });
                html += '</div>';
                $("#weekOverview").html(html);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error loading week overview:", error);
        }
    });
}

function loadRecentActivity() {
    const studentId = $("#hiddenStudentId").val();
    
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getRecentActivity",
            studentId: studentId
        },
        success: function(response) {
            if (response.status === "success") {
                let html = '<div class="activity-list">';
                response.data.forEach(activity => {
                    html += `
                        <div class="activity-item">
                            <i class="fas fa-${activity.icon}"></i>
                            <div class="activity-content">
                                <p>${activity.description}</p>
                                <small>${activity.time}</small>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                $("#recentActivity").html(html);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error loading recent activity:", error);
        }
    });
}

function updateCurrentDate() {
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Manila'
    };
    const formattedDate = today.toLocaleDateString('en-PH', options);
    $('#currentDateHeader span').text(formattedDate);
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
            action: "recordPendingAttendance",
            studentId: studentId,
            type: type,
            sessionId: sessionId,
            hteId: hteId,
            time: currentTime
        },
        success: function(response) {
            if(response.status === "success") {
                $("#attendanceStatusMessage").text("Attendance recorded as pending.").removeClass("error").addClass("success");
                loadAttendanceStatus();
                loadDashboardStats();
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

function loadAttendanceStatus() {
    let studentId = $("#hiddenStudentId").val();
    let options = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: 'numeric' };
    let currentDate = new Intl.DateTimeFormat('en-PH', options).format(new Date());
    let [month, day, year] = currentDate.split('/');
    let formattedDate = `${year}-${month}-${day}`;

    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getAttendanceStatus",
            studentId: studentId,
            date: formattedDate
        },
        success: function(response) {
            console.log("Attendance Status Response:", response);
            updateAttendanceUI(response.data);
        },
        error: function(xhr, status, error) {
            console.error("AJAX error when loading attendance status:", status, error);
        }
    });
}

function updateAttendanceUI(data) {
    console.log("Updating UI with data:", data);
    
    // Reset buttons
    $("#timeInButton").prop('disabled', false);
    $("#timeOutButton").prop('disabled', false);
    $("#todayStatusBadge").text("Not Checked In").removeClass("present checked-in").addClass("pending");
    
    if (data.TIMEIN) {
        $("#timeInDisplay").text(data.TIMEIN);
        $("#timeInButton").prop('disabled', true);
        $("#todayStatusBadge").text("Checked In").removeClass("pending").addClass("checked-in");
    }
    if (data.TIMEOUT) {
        $("#timeOutDisplay").text(data.TIMEOUT);
        $("#timeOutButton").prop('disabled', true);
        $("#todayStatusBadge").text("Present").removeClass("checked-in").addClass("present");
    }
}

function checkAndResetAttendance() {
    let now = new Date();
    let options = { timeZone: 'Asia/Manila', hour12: false, hour: '2-digit', minute: '2-digit' };
    let currentTime = now.toLocaleTimeString('en-PH', options);

    // If it's midnight (00:00), reset the attendance UI
    if (currentTime === "00:00") {
        $("#timeInDisplay").text("--:--");
        $("#timeOutDisplay").text("--:--");
        $("#timeInButton").prop('disabled', false);
        $("#timeOutButton").prop('disabled', false);
        $("#todayStatusBadge").text("Not Checked In").removeClass("present checked-in").addClass("pending");
        $("#attendanceStatusMessage").text("").removeClass("success error");
    }
}

function loadCurrentWeek() {
    const studentId = $("#hiddenStudentId").val();

    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getLatestReportWeek",
            studentId: studentId
        },
        success: function(response) {
            if (response.status === "success" && response.data) {
                const startDate = new Date(response.data.week_start);
                const endDate = new Date(response.data.week_end);

                const options = { month: 'long', day: 'numeric', year: 'numeric' };
                const formattedStartDate = startDate.toLocaleDateString('en-PH', options);
                const formattedEndDate = endDate.toLocaleDateString('en-PH', options);

                const weekInfo = `${formattedStartDate} - ${formattedEndDate}`;
                $("#currentWeekRange").text(weekInfo);
            } else {
                // Fallback to current week if no report found
                const currentDate = new Date();
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                startOfWeek.setHours(0, 0, 0, 0);

                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);

                const options = { month: 'long', day: 'numeric', year: 'numeric' };
                const formattedStartDate = startOfWeek.toLocaleDateString('en-PH', options);
                const formattedEndDate = endOfWeek.toLocaleDateString('en-PH', options);

                const weekInfo = `${formattedStartDate} - ${formattedEndDate}`;
                $("#currentWeekRange").text(weekInfo);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error loading current week:", error);
            // Fallback to current week on error
            const currentDate = new Date();
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const options = { month: 'long', day: 'numeric', year: 'numeric' };
            const formattedStartDate = startOfWeek.toLocaleDateString('en-PH', options);
            const formattedEndDate = endOfWeek.toLocaleDateString('en-PH', options);

            const weekInfo = `${formattedStartDate} - ${formattedEndDate}`;
            $("#currentWeekRange").text(weekInfo);
        }
    });
}

function loadAttendanceHistory() {
    const studentId = $("#hiddenStudentId").val();
    const filter = $("#historyFilter").val();
    let startDate, endDate;

    const currentDate = new Date();
    if (filter === 'week') {
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDate.getDay());
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
    } else if (filter === 'month') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    } else {
        // All time - use a very old date and future date
        startDate = new Date(2000, 0, 1);
        endDate = new Date(2100, 0, 1);
    }

    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getAttendanceHistory",
            studentId: studentId,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        },
        success: function(response) {
            if (response.status === "success") {
                let html = `
                    <div class="history-header">
                        <h3>Attendance History</h3>
                        <span class="filter-badge">${filter === 'week' ? 'This Week' : filter === 'month' ? 'This Month' : 'All Time'}</span>
                    </div>
                `;
                
                if (response.data.length > 0) {
                    html += `<div class="history-cards">`;
                    
                    response.data.forEach(record => {
                        const recordDate = new Date(record.ON_DATE);
                        const formattedDate = recordDate.toLocaleDateString('en-PH', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        });
                        const formattedDay = recordDate.toLocaleDateString('en-PH', {
                            weekday: 'long'
                        });
                        const formattedTimeIn = record.TIMEIN ? formatTimeToPH(record.TIMEIN) : '--:--';
                        const formattedTimeOut = record.TIMEOUT ? formatTimeToPH(record.TIMEOUT) : '--:--';
                        const status = record.TIMEIN && record.TIMEOUT ? 'Present' : record.TIMEIN ? 'Checked In' : 'Absent';
                        
                        // Determine status class and icon
                        let statusClass = '';
                        let statusIcon = '';
                        if (status === 'Present') {
                            statusClass = 'status-present';
                            statusIcon = 'fa-check-circle';
                        } else if (status === 'Checked In') {
                            statusClass = 'status-checked-in';
                            statusIcon = 'fa-clock';
                        } else {
                            statusClass = 'status-absent';
                            statusIcon = 'fa-times-circle';
                        }

                        html += `
                            <div class="history-card ${statusClass}">
                                <div class="history-date">
                                    <div class="day">${formattedDay}</div>
                                    <div class="date">${formattedDate}</div>
                                </div>
                                <div class="history-times">
                                    <div class="time-entry">
                                        <i class="fas fa-sign-in-alt"></i>
                                        <span class="time-label">Time In:</span>
                                        <span class="time-value">${formattedTimeIn}</span>
                                    </div>
                                    <div class="time-entry">
                                        <i class="fas fa-sign-out-alt"></i>
                                        <span class="time-label">Time Out:</span>
                                        <span class="time-value">${formattedTimeOut}</span>
                                    </div>
                                </div>
                                <div class="history-status">
                                    <i class="fas ${statusIcon}"></i>
                                    <span>${status}</span>
                                </div>
                            </div>
                        `;
                    });
                    html += `</div>`;
                } else {
                    html += `
                        <div class="no-records">
                            <i class="fas fa-calendar-times"></i>
                            <p>No attendance records found for the selected period.</p>
                        </div>
                    `;
                }

                $("#attendanceHistoryArea").html(html);
            } else {
                $("#attendanceHistoryArea").html(`
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error loading attendance history: ${response.message || "Unknown error"}</p>
                    </div>
                `);
            }
        },
        error: function(xhr, status, error) {
            $("#attendanceHistoryArea").html(`
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error: ${error}</p>
                </div>
            `);
        }
    });
}

function formatTimeToPH(timeString) {
    const timeParts = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2]));
    return date.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: true });
}

function loadProfileDetails() {
    console.log("Profile button clicked"); // Added log to check if function is triggered
    let studentId = $("#hiddenStudentId").val();
    
    // Show modal and set loading state
    $("#profileModalContent").html('<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading profile details...</div>');
    $("#profileModal").css('display', 'flex');
    
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {action: "getStudentDetails", studentId: studentId},
        success: function(rv) {
            console.log("AJAX response for profile details:", rv); // Added log to check the AJAX response
            if(rv.status === "success") {
                displayProfileDetails(rv.data);
            } else {
                $("#profileModalContent").html("<p>Error loading profile details: " + (rv.message || "Unknown error") + "</p>");
            }
        },
        error: function(xhr, status, error) {
            $("#profileModalContent").html("<p>Error: " + error + "</p>");
        }
    });
}

function displayProfileDetails(data) {
    console.log("Profile details data:", data); // Added log to check the data
    
    // Create full name by combining NAME and SURNAME if available
    const fullName = data.SURNAME ? `${data.NAME} ${data.SURNAME}` : data.NAME;
    
    let html = `
        <div class="profile-card">
            <div class="profile-header">
                <div class="profile-avatar">
                    ${data.profile_picture ? `<img src="uploads/${data.profile_picture}" alt="Profile Picture" class="avatar-placeholder">` : `<div class="avatar-placeholder"><i class="fas fa-user"></i></div>`}
                </div>
                <h2>${fullName}</h2>
                <p class="profile-subtitle">Student Profile</p>
            </div>
            
            <div class="profile-details">
                <div class="detail-row">
                    <span class="detail-label">Intern ID:</span>
                    <span class="detail-value">${data.INTERNS_ID}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Student ID:</span>
                    <span class="detail-value">${data.STUDENT_ID}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Full Name:</span>
                    <span class="detail-value">${fullName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Age:</span>
                    <span class="detail-value">${data.AGE || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Gender:</span>
                    <span class="detail-value">${data.GENDER || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${data.EMAIL || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Contact Number:</span>
                    <span class="detail-value">${data.CONTACT_NUMBER || 'N/A'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">HTE Name:</span>
                    <span class="detail-value">${data.HTE_NAME || 'Not assigned'}</span>
                </div>
            </div>
            
            <div class="profile-actions">
                <button type="button" id="editProfileBtn" class="btn-edit">Edit Profile</button>
                <button type="button" id="changePasswordBtn" class="btn-change-password">Change Password</button>
            </div>
        </div>
    `;
    
    $("#profileModalContent").html(html);
    
    // Add event listener for the edit profile button
    $("#editProfileBtn").click(function() {
        toggleEditMode(true);
    });
    
    // Add event listener for the change password button
    $("#changePasswordBtn").click(function() {
        showChangePasswordForm();
    });
}

function toggleEditMode(enable = true) {
    if (enable) {
        let studentId = $("#hiddenStudentId").val();
        
        $.ajax({
            url: "ajaxhandler/studentDashboardAjax.php",
            type: "POST",
            dataType: "json",
            data: {action: "getStudentDetails", studentId: studentId},
            success: function(rv) {
                if(rv.status === "success") {
                    let data = rv.data;
                    let editForm = `
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <div class="avatar-placeholder">
                                    <i class="fas fa-user-edit"></i>
                                </div>
                            </div>
                            <h2>Edit Profile</h2>
                        </div>
                        
                        <form id="profileEditForm">
                            <div class="form-group">
                                <label for="editProfilePicture">Profile Picture:</label>
                                <input type="file" id="editProfilePicture" name="profile_picture" accept="image/*">
                            </div>
                            
                            <div class="profile-actions">
                                <button type="button" id="saveProfileBtn" class="btn-save">Save Changes</button>
                                <button type="button" id="cancelEditBtn" class="btn-cancel">Cancel</button>
                            </div>
                        </form>
                    `;
                    
                    $("#profileModalContent").html(editForm);
                    
                    // Add event listeners for the new buttons
                    $("#saveProfileBtn").click(saveProfileChanges);
                    $("#cancelEditBtn").click(function() {
                        toggleEditMode(false);
                    });
                }
            }
        });
    } else {
        loadProfileDetails();
    }
}

function saveProfileChanges() {
    let studentId = $("#hiddenStudentId").val();
    
    // Create FormData object to handle file upload
    let formData = new FormData();
    formData.append('action', 'updateStudentProfile');
    formData.append('studentId', studentId);
    
    // Add profile picture file if selected
    let profilePictureFile = $("#editProfilePicture")[0].files[0];
    if (profilePictureFile) {
        formData.append('profile_picture', profilePictureFile);
    } else {
        alert("Please select a profile picture to upload.");
        return;
    }
    
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function() {
            $("#saveProfileBtn").text("Saving...").prop("disabled", true);
        },
        success: function(response) {
            if(response.status === "success") {
                alert("Profile picture updated successfully!");
                toggleEditMode(false);
            } else {
                alert("Error updating profile picture: " + (response.message || "Unknown error"));
            }
        },
        error: function(xhr, status, error) {
            alert("Error: " + error);
        },
        complete: function() {
            $("#saveProfileBtn").text("Save Changes").prop("disabled", false);
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showChangePasswordForm() {
    const studentId = $("#hiddenStudentId").val();
    
    let passwordForm = `
        <div class="password-change-form">
            <div class="profile-header">
                <div class="profile-avatar">
                    <div class="avatar-placeholder">
                        <i class="fas fa-lock"></i>
                    </div>
                </div>
                <h2>Change Password</h2>
                <p class="profile-subtitle">Update your account password</p>
            </div>
            
            <form id="passwordChangeForm">
                <div class="form-group password-field">
                    <label for="currentPassword">Current Password:</label>
                    <div class="password-input-container">
                        <input type="password" id="currentPassword" name="currentPassword" required>
                        <span class="toggle-password-visibility" data-target="currentPassword">👁️</span>
                    </div>
                </div>
                
                <div class="form-group password-field">
                    <label for="newPassword">New Password:</label>
                    <div class="password-input-container">
                        <input type="password" id="newPassword" name="newPassword" required minlength="6">
                        <span class="toggle-password-visibility" data-target="newPassword">👁️</span>
                    </div>
                </div>
                
                <div class="form-group password-field">
                    <label for="confirmPassword">Confirm New Password:</label>
                    <div class="password-input-container">
                        <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6">
                        <span class="toggle-password-visibility" data-target="confirmPassword">👁️</span>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" id="savePasswordBtn" class="btn-save">Change Password</button>
                    <button type="button" id="cancelPasswordBtn" class="btn-cancel">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    $("#profileModalContent").html(passwordForm);
    
    // Add event listeners
    $("#savePasswordBtn").click(changePassword);
    $("#cancelPasswordBtn").click(function() {
        loadProfileDetails();
    });
    
    // Add password visibility toggle functionality
    $(".toggle-password-visibility").click(function() {
        const targetId = $(this).data('target');
        const passwordField = $("#" + targetId);
        const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);
        $(this).text(type === 'password' ? '👁️' : '🔒');
    });
}

function changePassword() {
    const studentId = $("#hiddenStudentId").val();
    const currentPassword = $("#currentPassword").val();
    const newPassword = $("#newPassword").val();
    const confirmPassword = $("#confirmPassword").val();
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all password fields.");
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert("New password and confirmation do not match.");
        return;
    }
    
    if (newPassword.length < 6) {
        alert("New password must be at least 6 characters long.");
        return;
    }
    
    // Disable button and show loading
    $("#savePasswordBtn").text("Changing...").prop("disabled", true);
    
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "updatePassword",
            studentId: studentId,
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        },
        success: function(response) {
            if (response.status === "success") {
                alert("Password changed successfully!");
                loadProfileDetails();
            } else {
                alert("Error: " + response.message);
                $("#savePasswordBtn").text("Change Password").prop("disabled", false);
            }
        },
        error: function(xhr, status, error) {
            alert("Error changing password: " + error);
            $("#savePasswordBtn").text("Change Password").prop("disabled", false);
        }
    });
}

function printAttendance() {
    alert('Print functionality will be implemented soon');
}

// Weekly Report System Functions
function initializeReportSystem() {
    // Load current week's report on page load
    loadCurrentWeekReport();

    // Week selection change event
    $("#reportWeek").change(function() {
        loadCurrentWeekReport();
    });

    // Disable week selector to enforce automatic current week assignment
    $("#reportWeek").prop('disabled', true);

    // Image upload functionality
    setupImageUpload();

    // Report action buttons
    $("#saveDraftBtn").click(saveReportDraft);
    $("#submitReportBtn").click(submitFinalReport);
}

// Global variables to store current report week dates
let currentReportWeekStart = null;
let currentReportWeekEnd = null;

function loadCurrentWeekReport() {
    const studentId = $("#hiddenStudentId").val();
    const selectedWeek = $("#reportWeek").val();
    
    // Show loading state
    $("#reportStatus").html('<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading report...</div>');
    $("#submittedReports").html('<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading submitted reports...</div>');
    
    $.ajax({
        url: "ajaxhandler/weeklyReportAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getWeeklyReport",
            studentId: studentId,
            week: selectedWeek
        },
        success: function(response) {
            if (response.status === "success") {
                // Store the current report week dates
                if (response.data.report && response.data.report.week_start && response.data.report.week_end) {
                    currentReportWeekStart = new Date(response.data.report.week_start);
                    currentReportWeekEnd = new Date(response.data.report.week_end);
                } else {
                    // Fallback to current week if no report dates available
                    const currentDate = new Date();
                    currentReportWeekStart = new Date(currentDate);
                    currentReportWeekStart.setDate(currentDate.getDate() - currentDate.getDay());
                    currentReportWeekStart.setHours(0, 0, 0, 0);

                    currentReportWeekEnd = new Date(currentReportWeekStart);
                    currentReportWeekEnd.setDate(currentReportWeekStart.getDate() + 6);
                    currentReportWeekEnd.setHours(23, 59, 59, 999);
                }

                populateReportEditor(response.data.report);
                displaySubmittedReports(response.data.submittedReports);
                updateReportStatus(response.data.report);
            } else {
                $("#reportStatus").html('<div class="report-status error">Error loading report: ' + (response.message || "Unknown error") + '</div>');
            }
        },
        error: function(xhr, status, error) {
            $("#reportStatus").html('<div class="report-status error">Error: ' + error + '</div>');
        }
    });
}

function populateReportEditor(report) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    console.log("Populating report editor with report data:", report);

    // Clear existing content for all days - removed description clearing since textareas are removed
    days.forEach(day => {
        $(`#imagePreview${capitalize(day)}`).empty();
    });

    // Populate images per day if they exist (removed description population)
    if (report) {
        // Populate images per day
                if (report.imagesPerDay) {
                    days.forEach(day => {
                        console.log(`Loading images for ${day}:`, report.imagesPerDay[day]);
                        if (report.imagesPerDay[day] && report.imagesPerDay[day].length > 0) {
                            report.imagesPerDay[day].forEach(image => {
                                console.log(`Loading image for ${day}: ${image.url}`);
                                addImagePreviewToDay(day, image.filename, image.url);
                            });
                            existingImagesPerDay[day] = report.imagesPerDay[day].map(img => img.filename);
                        } else {
                            existingImagesPerDay[day] = [];
                        }
                    });
                } else if (report.images && report.images.length > 0) {
                    // Fallback for old single image array format
                    report.images.forEach(image => {
                        addImagePreviewToDay('monday', image.filename, image.url);
                    });
                    existingImagesPerDay['monday'] = report.images.map(img => img.filename);
                } else {
                    days.forEach(day => {
                        existingImagesPerDay[day] = [];
                    });
                }

        // Populate new weekly report fields
        $("#challengesFaced").val(report.challenges_faced || '');
        $("#lessonsLearned").val(report.lessons_learned || '');
        $("#goalsNextWeek").val(report.goals_next_week || '');
    } else {
        // Clear fields if no report data
        $("#challengesFaced").val('');
        $("#lessonsLearned").val('');
        $("#goalsNextWeek").val('');
        days.forEach(day => {
            existingImagesPerDay[day] = [];
        });
    }

    // Update image counters for all days
    updateImageCounters();

    // Update buttons based on report status
    if (report && report.status === 'submitted') {
        $("#saveDraftBtn").prop('disabled', true).text('Report Submitted');
        $("#submitReportBtn").prop('disabled', true).text('Already Submitted');
    } else {
        $("#saveDraftBtn").prop('disabled', false).text('Save Draft');
        $("#submitReportBtn").prop('disabled', false).text('Submit Report');
    }
}

// Restore image preview and removal functionality with file tracking

// Object to track selected files per day
const selectedFilesPerDay = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
};

// Object to track existing images per day
const existingImagesPerDay = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
};

function addImagePreviewToDay(day, filename, dataUrl) {
    const previewItem = $(`  
        <div class="image-preview-item" data-filename="${filename}">  
            <img src="${dataUrl}" alt="Preview">  
            <button type="button" class="remove-image" data-filename="${filename}">  
                <i class="fas fa-times"></i>  
            </button>  
        </div>  
    `);  
  
    $(`#imagePreview${capitalize(day)}`).append(previewItem);  
  
    // Add remove functionality  
    previewItem.find('.remove-image').click(function() {  
        const filenameToRemove = $(this).data('filename');  
        // Check if it's an existing image or new file  
        if (existingImagesPerDay[day].includes(filenameToRemove)) {  
            // Remove from existing images  
            existingImagesPerDay[day] = existingImagesPerDay[day].filter(filename => filename !== filenameToRemove);  
        } else {  
            // Remove from selected files  
            selectedFilesPerDay[day] = selectedFilesPerDay[day].filter(file => file.name !== filenameToRemove);  
        }  
        // Remove preview item  
        $(this).closest('.image-preview-item').remove();  
        updateImageCounters();  
        // Update placeholder visibility  
        const uploadPlaceholder = $(`#uploadPlaceholder${capitalize(day)}`);  
        const imageCount = $(`#imagePreview${capitalize(day)} .image-preview-item`).length;  
        if (imageCount > 0) {  
            uploadPlaceholder.css('display', 'none');  
        } else {  
            uploadPlaceholder.css('display', 'block');  
        }  
    });  
  
    // Update placeholder visibility after adding new image  
    const uploadPlaceholder = $(`#uploadPlaceholder${capitalize(day)}`);  
    const imageCount = $(`#imagePreview${capitalize(day)} .image-preview-item`).length;  
    if (imageCount > 0) {  
        uploadPlaceholder.css('display', 'none');  
    } else {  
        uploadPlaceholder.css('display', 'block');  
    }  
}

function updateImageCounters() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    let totalImages = 0;

    days.forEach(day => {
        const dayImages = $(`#imagePreview${capitalize(day)} .image-preview-item`).length;
        totalImages += dayImages;

        let counterElement = $(`#imageCounter${capitalize(day)}`);
        if (counterElement.length === 0) {
            $(`#imagePreview${capitalize(day)}`).before(`<div id="imageCounter${capitalize(day)}" class="image-counter"></div>`);
            counterElement = $(`#imageCounter${capitalize(day)}`);
        }

        if (dayImages > 0) {
            counterElement.text(`Images for ${capitalize(day)}: ${dayImages}`);
        } else {
            counterElement.text(`No images for ${capitalize(day)}`);
        }
    });

    // Update submit button state based on total image count
    const submitBtn = $("#submitReportBtn");
    if (totalImages >= 5) {
        submitBtn.prop('disabled', false);
        submitBtn.attr('title', '');
    } else {
        submitBtn.prop('disabled', true);
        submitBtn.attr('title', 'Upload at least 5 images total to submit the report');
    }
}

function displaySubmittedReports(reports) {
    if (!reports || reports.length === 0) {
        $("#submittedReports").html('<div class="no-records"><i class="fas fa-file-alt"></i><p>No submitted reports yet</p></div>');
        return;
    }
    
    let html = '<h4>Submitted Reports</h4>';
    
    reports.forEach(report => {
        const reportDate = new Date(report.submitted_at);
        const formattedDate = reportDate.toLocaleDateString('en-PH', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        
        html += `
            <div class="report-item">
                <div class="report-item-header">
                    <span class="report-week">Week ${report.week_number}</span>
                    <span class="report-status-badge ${report.status}">${report.status}</span>
                </div>
                <div class="report-content-preview">
                    ${report.content.substring(0, 150)}${report.content.length > 150 ? '...' : ''}
                </div>
${report.images && report.images.length > 0 ? `
                <div class="report-images-preview">
                    ${report.images.slice(0, 3).map(image => `
                        <img src="uploads/${image.filename}" alt="Report image" class="report-image-thumb">
                    `).join('')}
                    ${report.images.length > 3 ? `<span>+${report.images.length - 3} more</span>` : ''}
                </div>
                ` : ''}
                <div class="report-item-actions">
                    <small>Submitted: ${formattedDate}</small>
                </div>
            </div>
        `;
    });
    
    $("#submittedReports").html(html);
}

function updateReportStatus(report) {
    if (!report) {
        $("#reportStatus").html('<div class="report-status info">No report started for this week</div>');
        return;
    }
    
    if (report.status === 'draft') {
        const lastSaved = new Date(report.updated_at);
        const formattedTime = lastSaved.toLocaleTimeString('en-PH', {
            hour: '2-digit', minute: '2-digit'
        });
        $("#reportStatus").html(`<div class="report-status info">Draft last saved at ${formattedTime}</div>`);
    } else if (report.status === 'submitted') {
        const submittedDate = new Date(report.submitted_at);
        const formattedDate = submittedDate.toLocaleDateString('en-PH', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        $("#reportStatus").html(`<div class="report-status success">Report submitted on ${formattedDate}</div>`);
    }
}

function setupImageUpload() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    days.forEach(day => {
        const uploadPlaceholder = $(`#uploadPlaceholder${capitalize(day)}`);
        const fileInput = $(`#imageUpload${capitalize(day)}`);
        const browseButton = $(`#browseImagesBtn${capitalize(day)}`);

        // Add a flag to prevent multiple rapid clicks
        let isFileDialogOpen = false;

        // Function to update placeholder visibility based on images count
        function updatePlaceholderVisibility() {
            const imageCount = $(`#imagePreview${capitalize(day)} .image-preview-item`).length;
            if (imageCount > 0) {
                uploadPlaceholder.css('display', 'none');
            } else {
                uploadPlaceholder.css('display', 'block');
            }
        }

        // Initial check on page load
        updatePlaceholderVisibility();

        // Browse button click - triggers file selection
        browseButton.off('click').on('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (isFileDialogOpen) return;
            isFileDialogOpen = true;
            console.log(`Browse button clicked for ${day}`);
            fileInput[0].click();
            // Reset flag after a short delay
            setTimeout(() => { isFileDialogOpen = false; }, 1000);
        });

        // File input change - handles file selection
        fileInput.off('change').on('change', function(e) {
            console.log(`File input changed for ${day}`);
            isFileDialogOpen = false; // Reset flag when file is selected
            handleImageUploadForDay(e.target.files, day);
            updatePlaceholderVisibility();
        });

        // Drag and drop functionality on placeholder
        uploadPlaceholder.off('dragover').on('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Drag over on upload placeholder for ${day}`);
            uploadPlaceholder.addClass('drag-over');
        });

        uploadPlaceholder.off('dragleave').on('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Drag leave on upload placeholder for ${day}`);
            uploadPlaceholder.removeClass('drag-over');
        });

        uploadPlaceholder.off('drop').on('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log(`Drop on upload placeholder for ${day}`);
            uploadPlaceholder.removeClass('drag-over');
            handleImageUploadForDay(e.originalEvent.dataTransfer.files, day);
            updatePlaceholderVisibility();
        });

        // Make the upload placeholder clickable to open file dialog
        uploadPlaceholder.off('click').on('click', function(e) {
            e.stopPropagation();
            if (isFileDialogOpen) return;
            isFileDialogOpen = true;
            console.log(`Upload placeholder clicked for ${day}`);
            fileInput[0].click();
            // Reset flag after a short delay
            setTimeout(() => { isFileDialogOpen = false; }, 1000);
        });

        // Add cursor pointer to indicate clickable
        uploadPlaceholder.css('cursor', 'pointer');
    });
}

function showUploadError(message) {
    // Create or update error message display
    let errorElement = $("#uploadError");
    if (errorElement.length === 0) {
        $("#imageUploadArea").prepend('<div id="uploadError" class="upload-error-message"></div>');
        errorElement = $("#uploadError");
    }

    errorElement.html('<i class="fas fa-exclamation-triangle"></i> ' + message);
    errorElement.show();

    // Hide error after 5 seconds
    setTimeout(function() {
        errorElement.fadeOut();
    }, 5000);
}

function handleImageUploadForDay(files, day) {
    if (!files || files.length === 0) return;

    // Check if already processing an upload
    if (window.isProcessingUpload) {
        showUploadError("Please wait for the current upload to complete.");
        return;
    }

    // Set processing flag
    window.isProcessingUpload = true;

    let validFiles = [];
    let invalidFiles = [];

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            invalidFiles.push(`${file.name}: Not an image file`);
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            invalidFiles.push(`${file.name}: File size exceeds 5MB limit`);
            return;
        }

        validFiles.push(file);
    });

    // Add valid files to selectedFilesPerDay for the day
    selectedFilesPerDay[day] = selectedFilesPerDay[day].concat(validFiles);

    // Show validation errors if any
    if (invalidFiles.length > 0) {
        showUploadError("Some files were rejected:\n" + invalidFiles.join('\n'));
        window.isProcessingUpload = false; // Reset flag on error
        return;
    }

    // Process valid files
    let processedCount = 0;
    validFiles.forEach(file => {
        // Create preview
        const reader = new FileReader();
        reader.onload = function(e) {
            addImagePreviewToDay(day, file.name, e.target.result);
            updateImageCounters();
            processedCount++;
            if (processedCount === validFiles.length) {
                // All files processed, reset flag
                window.isProcessingUpload = false;
            }
        };
        reader.onerror = function() {
            showUploadError(`Failed to read file: ${file.name}`);
            processedCount++;
            if (processedCount === validFiles.length) {
                // All files processed, reset flag
                window.isProcessingUpload = false;
            }
        };
        reader.readAsDataURL(file);
    });

    // Clear file input after processing
    $(`#imageUpload${capitalize(day)}`).val('');
}



function saveReportDraft() {
    const studentId = $("#hiddenStudentId").val();
    const week = $("#reportWeek").val();

    // Collect new weekly report fields
    const challengesFaced = $("#challengesFaced").val().trim();
    const lessonsLearned = $("#lessonsLearned").val().trim();
    const goalsNextWeek = $("#goalsNextWeek").val().trim();

    // Prepare FormData
    const formData = new FormData();
    formData.append('action', 'saveReportDraft');
    formData.append('studentId', studentId);
    formData.append('week', week);
    formData.append('challengesFaced', challengesFaced);
    formData.append('lessonsLearned', lessonsLearned);
    formData.append('goalsNextWeek', goalsNextWeek);

    // Add image files for each day from selectedFilesPerDay
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    days.forEach(day => {
        selectedFilesPerDay[day].forEach(file => {
            formData.append(`images[${day}][]`, file);
        });
    });

    // Send existing images per day
    formData.append('existingImages', JSON.stringify(existingImagesPerDay));

    // Show saving state
    $("#saveDraftBtn").text('Saving...').prop('disabled', true);

    $.ajax({
        url: "ajaxhandler/weeklyReportAjax.php",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        dataType: "json",
        success: function(response) {
            if (response.status === "success") {
                $("#reportStatus").html('<div class="report-status success">Draft saved successfully!</div>');
                // Clear file inputs and selected files, but keep image previews visible
                days.forEach(day => {
                    $(`#imageUpload${capitalize(day)}`).val('');
                    selectedFilesPerDay[day] = [];
                    // Don't clear image previews here - let the reload handle it
                });

                // Reload to get updated data
                setTimeout(loadCurrentWeekReport, 1000);
            } else {
                $("#reportStatus").html('<div class="report-status error">Error: ' + (response.message || "Unknown error") + '</div>');
            }
        },
        error: function(xhr, status, error) {
            $("#reportStatus").html('<div class="report-status error">Error: ' + error + '</div>');
        },
        complete: function() {
            $("#saveDraftBtn").text('Save Draft').prop('disabled', false);
        }
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function submitFinalReport() {
    const studentId = $("#hiddenStudentId").val();
    const week = $("#reportWeek").val();

    // Collect new weekly report fields
    const challengesFaced = $("#challengesFaced").val().trim();
    const lessonsLearned = $("#lessonsLearned").val().trim();
    const goalsNextWeek = $("#goalsNextWeek").val().trim();

    if (confirm('Are you sure you want to submit this report? Once submitted, you cannot edit it.')) {
        const formData = new FormData();
        formData.append('action', 'submitFinalReport');
        formData.append('studentId', studentId);
        formData.append('week', week);
        formData.append('challengesFaced', challengesFaced);
        formData.append('lessonsLearned', lessonsLearned);
        formData.append('goalsNextWeek', goalsNextWeek);

        // Add image files for each day from selectedFilesPerDay
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        days.forEach(day => {
            selectedFilesPerDay[day].forEach(file => {
                formData.append(`images[${day}][]`, file);
            });
        });

        // Send existing images per day
        formData.append('existingImages', JSON.stringify(existingImagesPerDay));

        // Show submitting state
        $("#submitReportBtn").text('Submitting...').prop('disabled', true);

        $.ajax({
            url: "ajaxhandler/weeklyReportAjax.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function(response) {
                if (response.status === "success") {
                    $("#reportStatus").html('<div class="report-status success">Report submitted successfully!</div>');
                    // Clear file inputs and selected files, but keep image previews visible
                    days.forEach(day => {
                        $(`#imageUpload${capitalize(day)}`).val('');
                        selectedFilesPerDay[day] = [];
                        // Don't clear image previews here - let the reload handle it
                    });
                    // Reload to get updated data
                    setTimeout(loadCurrentWeekReport, 1000);
                } else {
                    $("#reportStatus").html('<div class="report-status error">Error: ' + (response.message || "Unknown error") + '</div>');
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX error response text:", xhr.responseText);
                $("#reportStatus").html('<div class="report-status error">Error: ' + error + '</div>');
            },
            complete: function() {
                $("#submitReportBtn").text('Submit Report').prop('disabled', false);
            }
        });
    }
}

function generateReportPreview() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    // Populate day sections with images saved in draft
    days.forEach(day => {
        const dayImagesContainer = $(`#draft${capitalize(day)}Images`);
        const dayContent = $(`#draft${capitalize(day)}Content`);

        // Clear existing images
        dayImagesContainer.empty();

        // Get images from preview area
        const images = $(`#imagePreview${capitalize(day)} .image-preview-item img`);

        if (images.length > 0) {
            images.each(function() {
                const imgSrc = $(this).attr('src');
                const imgElement = $(`<img src="${imgSrc}" alt="Image for ${capitalize(day)}" class="preview-image">`);
                dayImagesContainer.append(imgElement);
            });
            dayContent.text(''); // Clear "No activities reported" text if images exist
        } else {
            dayContent.text(`No activities reported for ${capitalize(day)}.`);
        }
    });

    // Populate summary sections with student responses or placeholders
    const challengesFaced = $("#challengesFaced").val().trim();
    const lessonsLearned = $("#lessonsLearned").val().trim();
    const goalsNextWeek = $("#goalsNextWeek").val().trim();

    $("#draftChallengesFaced").html(challengesFaced ? challengesFaced.replace(/\n/g, '<br>') : 'No challenges reported');
    $("#draftLessonsLearned").html(lessonsLearned ? lessonsLearned.replace(/\n/g, '<br>') : 'No lessons reported');
    $("#draftGoalsNextWeek").html(goalsNextWeek ? goalsNextWeek.replace(/\n/g, '<br>') : 'No goals reported');

    // Show the report draft preview
    $("#reportDraft").show();
    // Hide the old draft preview container if visible
    $("#draftPreview").hide();
}

$(document).ready(function() {
    $("#previewReportBtn").click(function() {
        generateReportPreview();
    });
});


