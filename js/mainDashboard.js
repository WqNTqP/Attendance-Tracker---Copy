
let currentHteId;
let currentSessionId;

// Function to format contact number to Philippine format: +63 951 3762 404
function formatPhilippineContactNumber(input) {
    let value = input.value.replace(/\D/g, ''); // Remove non-numeric characters

    if (value.startsWith('09') && value.length === 11) {
        // Convert 09123456789 to +63 912 345 6789
        value = '+63 ' + value.substring(1, 4) + ' ' + value.substring(4, 7) + ' ' + value.substring(7);
    } else if (value.startsWith('639') && value.length === 12) {
        // Convert 639123456789 to +63 912 345 6789
        value = '+63 ' + value.substring(2, 5) + ' ' + value.substring(5, 8) + ' ' + value.substring(8);
    } else if (value.length === 10 && !value.startsWith('0')) {
        // Assume it's 9123456789, format as +63 912 345 6789
        value = '+63 ' + value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6);
    }

    input.value = value;
}

// Attach formatting to contact number inputs
$(document).on('blur', '#contactNumber, #hteContactNumber, #profileContact', function() {
    formatPhilippineContactNumber(this);
});

    // Tab switching functionality
function switchTab(tabName) {
    console.log('switchTab called with:', tabName);
    
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all sidebar items
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected tab content
    const tabContent = document.getElementById(tabName + 'Content');
    console.log('Tab content element:', tabContent);
    if (tabContent) {
        tabContent.classList.add('active');
        console.log('Added active class to tab content');
    } else {
        console.error('Tab content element not found:', tabName + 'Content');
    }

    // Add active class to selected sidebar item
    const sidebarItem = document.getElementById(tabName + 'Tab');
    console.log('Sidebar item element:', sidebarItem);
    if (sidebarItem) {
        sidebarItem.classList.add('active');
        console.log('Added active class to sidebar item');
    } else {
        console.error('Sidebar item not found:', tabName + 'Tab');
    }

    // Just log which tab we switched to
    console.log('Tab switched to: ' + tabName);
}

// Utility functions
function getSessionHTML(rv) {
    let x = `<option value=-1>SELECT ONE</option>`;
    let i = 0;
    for(i = 0; i < rv.length; i++) {
        let cs = rv[i];
        x = x + `<option value=${cs['ID']}>${cs['YEAR']+" "+cs['TERM']}</option>`;
    }
    return x;
}

    // Dashboard button click handler (use getDashboardStats)
    $(document).on("click", ".btnDashboardStudent", function() {
        let studentId = $(this).data('studentid');
        if (!studentId) {
            alert("Student ID not found.");
            return;
        }
        $.ajax({
            url: "ajaxhandler/studentDashboardAjax.php",
            type: "POST",
            dataType: "json",
            data: {
                action: "getDashboardStats",
                studentId: studentId
            },
            success: function(response) {
                if (response.status === "success" && response.data) {
                    let presentDays = response.data.presentDays || 0;
                    let totalHours = response.data.totalHours || 0;
                    let attendanceRate = response.data.attendanceRate || 0;
                    showStudentDashboardModal({ presentDays, totalHours, attendanceRate }, studentId);
                } else {
                    alert("Could not fetch student dashboard info.");
                }
            },
            error: function(xhr, status, error) {
                alert("Error fetching student dashboard info: " + error);
            }
        });
    });

    // Modal for displaying student dashboard info (all stats)
    function showStudentDashboardModal(stats) {
        // Create modal if not exists
        if ($("#studentDashboardModal").length === 0) {
            $("body").append(`
                <div id="studentDashboardModal" class="main-dashboard-modal-bg" style="display:none;">
                    <div class="main-dashboard-modal-content">
                        <div class="main-dashboard-modal-header">
                            <h2 class="main-dashboard-modal-title">Student Stats</h2>
                            <button class="main-dashboard-modal-close" id="closeStudentDashboardModal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="main-dashboard-modal-body">
                            <div id="studentDashboardModalContent"></div>
                        </div>
                    </div>
                </div>
            `);
        }
        let statsHtml = `
            <div class="main-dashboard-modal-grid">
                <div class="main-dashboard-stats-row">
                    <div class='main-dashboard-card'>
                        <h3>Present Count (This Week)</h3>
                        <p>${stats.presentDays}</p>
                    </div>
                    <div class='main-dashboard-card'>
                        <h3>Total Hours</h3>
                        <p>${stats.totalHours}h</p>
                    </div>
                    <div class='main-dashboard-card'>
                        <h3>Attendance Percentage</h3>
                        <p>${stats.attendanceRate}%</p>
                    </div>
                </div>
                <div class="main-dashboard-recent-activity-card">
                    <h3>Recent Activity</h3>
                    <div id="dashboardRecentActivityTable"></div>
                </div>
            </div>
        `;
        // Fetch and render recent weekly report status
        return function(studentId) {
            $.ajax({
                url: "ajaxhandler/studentDashboardAjax.php",
                type: "POST",
                dataType: "json",
                data: {
                    action: "getRecentReportStatus",
                    studentId: studentId
                },
                success: function(response) {
                    $("#studentDashboardModalContent").html(statsHtml);
                    let tableHtml = "";
                    if (response.status === "success" && Array.isArray(response.data) && response.data.length > 0) {
                        tableHtml += `<div class=\"weekly-report-table-wrapper\"><table class=\"weekly-report-table\"><thead><tr><th>Week</th><th>Status</th><th>Submitted</th><th>Approved</th></tr></thead><tbody>`;
                        response.data.forEach(report => {
                            const approvedClass = report.approved_at ? '' : 'na';
                            tableHtml += `
                                <tr class=\"weekly-report-row\">
                                    <td>${report.week_start} to ${report.week_end}</td>
                                    <td>${report.status} / ${report.approval_status}</td>
                                    <td>${report.created_at || 'N/A'}</td>
                                    <td class=\"weekly-report-approved ${approvedClass}\">${report.approved_at || 'N/A'}</td>
                                </tr>
                            `;
                        });
                        tableHtml += '</tbody></table></div>';
                    } else {
                        tableHtml += '<p>No recent weekly report submissions found.</p>';
                    }
                    $("#dashboardRecentActivityTable").html(tableHtml);
                },
                error: function(xhr, status, error) {
                    $("#studentDashboardModalContent").html(statsHtml);
                    $("#dashboardRecentActivityTable").html('<p>Error loading recent weekly report status.</p>');
                }
            });
            $("#studentDashboardModal").fadeIn();
        }(arguments[1]);
    }

    $(document).on("click", "#closeStudentDashboardModal", function() {
        $("#studentDashboardModal").fadeOut();
    });

function loadSeassions() {
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {action: "getSession"},
        success: function(response) {
            if (response.success) {
                $("#sessionSelect").html(getSessionHTML(response.data));
            }
        }
    });
}

// Document ready handler
$(function() {
    // Toggle user dropdown on profile click
    $(document).on('click', '#userProfile', function(e) {
        $('#userDropdown').toggle();
        e.stopPropagation();
    });
    // Hide dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#userProfile').length) {
            $('#userDropdown').hide();
        }
    });
    // Tab click event for sidebar
    $('.sidebar-item').click(function() {
        var tabName = $(this).data('tab');
        switchTab(tabName);
        if (tabName === 'control') {
            loadAllStudentsData();
        }
    });
    // ...existing code...

    // --- Report Tab Filters ---
    function loadStudentFilterDropdown() {
        var coordinatorId = $("#hiddencdrid").val();
        $.ajax({
            url: "ajaxhandler/adminDashboardAjax.php",
            type: "POST",
            dataType: "json",
            data: { action: "getAllStudents", coordinatorId: coordinatorId },
            success: function(rv) {
                let options = `<option value=\"all\">All Students</option>`;
                if (rv && rv.data && Array.isArray(rv.data)) {
                    rv.data.forEach(function(stu) {
                        // Use INTERNS_ID for filtering
                        options += `<option value=\"${stu.INTERNS_ID}\">${stu.SURNAME}, ${stu.NAME}</option>`;
                    });
                }
                $("#filterStudent").html(options);
            },
            error: function() {
                $("#filterStudent").html('<option value=\"all\">All Students</option>');
            }
        });
    }

    function loadApprovedReportsWithFilters() {
        let studentId = $("#filterStudent").val() || "all";
        let date = $("#filterDate").val();
        let weekStart = date || null;
        let weekEnd = date || null;
        $.ajax({
            url: "ajaxhandler/coordinatorWeeklyReportAjax.php",
            type: "POST",
            dataType: "json",
            data: {
                action: "getWeeklyReports",
                studentId: studentId,
                weekStart: weekStart,
                weekEnd: weekEnd
            },
            beforeSend: function() {
                $("#approvedReportsList").html("<p>Loading approved weekly reports...</p>");
            },
            success: function(rv) {
                // Render reports from rv.reports if status is success
                if (rv && rv.status === "success" && Array.isArray(rv.reports) && rv.reports.length > 0) {
                    let html = "";
                    rv.reports.forEach(function(report) {
                        html += `<div class='report-card admin-report-preview'>`;
                        html += `<div class='report-header'>`;
                        html += `<h3>${report.student_name} - Week ${getWeekNumber(report.week_start)}</h3>`;
                        html += `<div class='report-meta'>`;
                        html += `<span class='report-period'>Period: ${report.week_start} to ${report.week_end}</span>`;
                        html += `<span class='approval-status ${report.approval_status}'>${report.approval_status.charAt(0).toUpperCase() + report.approval_status.slice(1)}</span>`;
                        html += `</div></div>`;

                        html += `<div class='report-grid'>`;
                        ['monday','tuesday','wednesday','thursday','friday'].forEach(function(day) {
                            html += `<div class='day-section ${day}'>`;
                            html += `<h4>${capitalize(day)}</h4>`;
                            html += `<div class='day-images'>`;
                            if (report.imagesPerDay && report.imagesPerDay[day] && report.imagesPerDay[day].length > 0) {
                                report.imagesPerDay[day].forEach(function(img) {
                                    html += `<img src='http://localhost/Attendance Tracker - Copy - NP/uploads/reports/${img.filename}' alt='${capitalize(day)} activity' class='activity-image'>`;
                                });
                            }
                            html += `</div>`;
                            html += `<div class='day-description'><p>${report[day+'_description'] || report[day+'Description'] || ''}</p></div>`;
                            html += `</div>`;
                        });
                        html += `</div>`;

                        html += `<div class='report-footer'>`;
                        html += `<div class='footer-left'><span class='updated-date'>Last Updated: ${report.updated_at}</span></div>`;
                        html += `</div>`;
                        html += `</div>`;
                    });
                    $("#approvedReportsList").html(html);

                    // Helper to capitalize day names
                    function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
                } else {
                    $("#approvedReportsList").html("<p>No approved reports found.</p>");
                }

                // Helper to get week number from date
                function getWeekNumber(dateStr) {
                    const date = new Date(dateStr);
                    const firstJan = new Date(date.getFullYear(),0,1);
                    const days = Math.floor((date - firstJan) / (24*60*60*1000));
                    return Math.ceil((days + firstJan.getDay()+1) / 7);
                }
            },
            error: function() {
                $("#approvedReportsList").html("<p>Error loading reports.</p>");
            }
        });
    }


    // Track if report tab has loaded
    let reportTabLoaded = false;
    $(document).on('click', '#reportTab', function() {
        if (!reportTabLoaded) {
            loadStudentFilterDropdown();
            setTimeout(loadApprovedReportsWithFilters, 300); // slight delay to ensure dropdown is populated
            reportTabLoaded = true;
        }
    });

    // Reset flag if user changes filter (forces reload)
    $(document).on('change', '#filterStudent, #filterDate', function() {
        reportTabLoaded = false;
    });

    // Apply filters button
    $(document).on('click', '#applyReportFilters', function() {
        loadApprovedReportsWithFilters();
    });

    // ...existing code...

    // Profile button click handler
    $(document).on('click', '#btnProfile', function() {
        let cdrid = $("#hiddencdrid").val();

        if (!cdrid) {
            alert("Coordinator ID not found.");
            return;
        }

        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            dataType: "json",
            data: {cdrid: cdrid, action: "getCoordinatorDetails"},
            success: function(response) {
                if (response.success) {
                    displayCoordinatorDetails(response.data);
                } else {
                    alert("Error: " + (response.message || "Unknown error occurred."));
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX error:", status, error);
                alert("Error fetching coordinator details. Please check the console for more information.");
            }
        });
    });

    // Function to display coordinator details modal with Edit Profile and Change Password buttons
    function displayCoordinatorDetails(coordinatorData) {
        let html = `
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${coordinatorData.PROFILE 
                            ? `<img src="uploads/${coordinatorData.PROFILE}" alt="Profile" class="profile-image">` 
                            : `<div class="avatar-placeholder">${coordinatorData.NAME.charAt(0)}</div>`
                        }
                    </div>
                    <h2>${coordinatorData.NAME}</h2>
                    <p class="profile-subtitle">Coordinator</p>
                </div>

                <div class="profile-details">
                    <div class="detail-row">
                        <span class="detail-label">Coordinator ID</span>
                        <span class="detail-value">${coordinatorData.COORDINATOR_ID}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Department</span>
                        <span class="detail-value">${coordinatorData.DEPARTMENT}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Contact Number</span>
                        <span class="detail-value">${coordinatorData.CONTACT_NUMBER}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${coordinatorData.EMAIL}</span>
                    </div>
                </div>

                <div class="profile-actions">
                    <button type="button" id="btnEditProfile" class="btn-edit">Edit Profile</button>
                    <button type="button" id="btnChangePassword" class="btn-change-password">Change Password</button>
                </div>
            </div>
        `;

        // Clear existing content and add new content to the modal body
        $("#profileModalContent").html(html);
        
        // Show the profile modal
        $("#profileModal").css('display', 'flex');
    }

    // Close profile modal and all other modals
    $(document).on('click', '#closeProfileModal', function() {
        // Hide the profile modal
        $("#profileModal").fadeOut();
        
        // Close any other open modals
        $('#editableProfileModal, #changePasswordModal').fadeOut(function() {
            $(this).remove();
        });
    });

    // Edit Profile button click handler inside coordinator details modal
    $(document).on('click', '#btnEditProfile', function() {
        loadEditableProfile();
    });

    // Change Password button click handler inside coordinator details modal
    $(document).on('click', '#btnChangePassword', function() {
        showChangePasswordModal();
    });

    // Function to load editable profile modal
    function loadEditableProfile() {
        let cdrid = $("#hiddencdrid").val();

        if (!cdrid) {
            alert("Coordinator ID not found.");
            return;
        }

        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            dataType: "json",
            data: {cdrid: cdrid, action: "getCoordinatorDetails"},
            success: function(response) {
                if (response.success) {
                    displayEditableProfileModal(response.data);
                } else {
                    alert("Error: " + (response.message || "Unknown error occurred."));
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX error:", status, error);
                alert("Error fetching coordinator details. Please check the console for more information.");
            }
        });
    }

    // Function to display editable profile modal
    function displayEditableProfileModal(coordinatorData) {
        let html = `
            <div id="editableProfileModal" class="modal" style="display: flex;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Edit Profile Picture</h2>
                        <button class="modal-close" id="closeEditableProfileModal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="editProfileForm" class="edit-profile-picture-form" enctype="multipart/form-data">
                            <div class="profile-picture-section">
                                <div class="current-profile-picture">
                                    ${coordinatorData.PROFILE_PICTURE ? 
                                        `<img src="uploads/${coordinatorData.PROFILE_PICTURE}" alt="Current Profile" class="current-image">` :
                                        `<div class="avatar-placeholder">
                                            <i class="fas fa-user"></i>
                                        </div>`
                                    }
                                </div>
                                <div class="profile-picture-upload file-upload-group">
                                    <label for="profilePicture">Upload Profile Picture:</label>
                                    <input type="file" id="profilePicture" name="profilePicture" accept="image/*" class="file-input-wrapper">
                                    <small>Max file size: 2MB (JPG, PNG, GIF)</small>
                                </div>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn-submit">Save Changes</button>
                                <button type="button" class="btn-cancel" id="closeEditableProfileModalCancel">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        $('body').append(html);
        $("#editableProfileModal").hide().fadeIn();
    }

    // Close editable profile modal
    $(document).on('click', '#closeEditableProfileModal', function(e) {
        e.stopPropagation(); // Prevent event from bubbling up
        $('#editableProfileModal').fadeOut(function() {
            $(this).remove();
        });
    });

    // Cancel profile edit
    $(document).on('click', '#closeEditableProfileModalCancel', function(e) {
        e.stopPropagation(); // Prevent event from bubbling up
        $('#editableProfileModal').fadeOut(function() {
            $(this).remove();
        });
    });

    // Close modal when clicking outside
    $(document).on('click', '#editableProfileModal', function(e) {
        if (e.target === this) {
            $(this).fadeOut(function() {
                $(this).remove();
            });
        }
    });

    // Prevent clicks inside the modal from propagating to parent
    $(document).on('click', '#editableProfileModal .modal-content', function(e) {
        e.stopPropagation();
    });

    // Handle file input change for preview
    $(document).on('change', '#profilePicture', function(e) {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('.image-preview').show();
                $('.preview-image').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        } else {
            $('.image-preview').hide();
        }
    });

    // Handle profile form submission
    function handleProfileFormSubmit(e) {
        e.preventDefault();

        // Validate profile picture file size and type if selected
        const fileInput = $('#profilePicture')[0];
        if (fileInput.files.length === 0) {
            alert('Please select a profile picture to upload.');
            return;
        }

        const file = fileInput.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Only JPG, PNG, and GIF are allowed.');
            return;
        }
        if (file.size > maxSize) {
            alert('File size exceeds 2MB limit.');
            return;
        }

        // Prepare FormData for AJAX
        const formData = new FormData();
        formData.append('action', 'updateCoordinatorProfilePicture');
        formData.append('cdrid', $('#hiddencdrid').val());
        formData.append('profilePicture', file);

        // Show loading state
        const $submitButton = $('.btn-submit');
        $submitButton.prop('disabled', true).text('Uploading...');

        // Create loading indicator
        const $loadingIndicator = $('<div class="upload-progress">Uploading profile picture...</div>');
        $submitButton.after($loadingIndicator);

        console.log('Uploading profile picture for coordinator:', $('#hiddencdrid').val());
        
        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                console.log('Upload response:', response);
                $submitButton.prop('disabled', false).text('Update Profile Picture');
                $loadingIndicator.remove();
                
                try {
                    // Try to parse the response as JSON if it's a string
                    let jsonResponse = typeof response === 'string' ? JSON.parse(response) : response;
                    
                    if (jsonResponse.success) {
                        console.log('Profile picture updated successfully:', jsonResponse.filename);
                        // Show success message
                        const $successMessage = $('<div class="alert alert-success">Profile picture updated successfully!</div>');
                        $submitButton.after($successMessage);
                        
                        // Update the profile picture display
                        $('.profile-image, .profile-image-preview').attr('src', 'uploads/' + jsonResponse.filename);
                        
                        // Fade out the modal and show profile after a short delay
                        setTimeout(() => {
                            $('#editableProfileModal').fadeOut(function() {
                                $(this).remove();
                                // Show coordinator details modal again
                                let cdrid = $("#hiddencdrid").val();
                                $.ajax({
                                    url: "ajaxhandler/attendanceAJAX.php",
                                    type: "POST",
                                    dataType: "json",
                                    data: {cdrid: cdrid, action: "getCoordinatorDetails"},
                                    success: function(response) {
                                        if (response.success) {
                                            displayCoordinatorDetails(response.data);
                                        } else {
                                            console.error("Error fetching updated profile:", response.message);
                                        }
                                    },
                                    error: function(xhr, status, error) {
                                        console.error("Error fetching updated profile:", error);
                                    }
                                });
                            });
                        }, 1500);
                    } else {
                        // Show error message with details from server
                        const errorMessage = jsonResponse.message || "Unknown error occurred";
                        const $errorMessage = $('<div class="alert alert-danger">Error: ' + errorMessage + '</div>');
                        $submitButton.after($errorMessage);
                        console.error("Server error:", errorMessage);
                    }
                } catch (e) {
                    console.error("Error parsing response:", e);
                    console.error("Raw response:", response);
                    
                    let errorMessage;
                    if (typeof response === 'string') {
                        if (response.includes('Warning') || response.includes('Notice')) {
                            errorMessage = "Server error: " + response.split("\n")[0];
                            console.error("PHP Error:", response);
                        } else {
                            errorMessage = "Invalid server response format";
                        }
                    } else {
                        errorMessage = "Unexpected response type";
                    }
                    
                    const $errorMessage = $('<div class="alert alert-danger">' + errorMessage + '</div>');
                    $submitButton.after($errorMessage);
                }
            },
            error: function(xhr, status, error) {
                $('.btn-submit').prop('disabled', false).text('Update Profile Picture');
                console.error("Error updating profile - Status:", status);
                console.error("Error updating profile - Error:", error);
                console.error("Server response:", xhr.responseText);
                console.error("Response headers:", xhr.getAllResponseHeaders());
                
                let errorMessage = "Error updating profile picture. ";
                if (xhr.responseText) {
                    try {
                        let response = JSON.parse(xhr.responseText);
                        errorMessage += response.message || "Please try again.";
                    } catch (e) {
                        if (xhr.responseText.includes('Warning') || xhr.responseText.includes('Error')) {
                            errorMessage += "Server error encountered. Please try again or contact support.";
                            console.error("PHP Error:", xhr.responseText);
                        } else {
                            errorMessage += "Unexpected server response. Please try again.";
                        }
                    }
                } else {
                    errorMessage += xhr.statusText || "Please try again.";
                }
                
                alert(errorMessage);
            }
        });
    }

    // Attach submit handler for profile form
    $(document).on('submit', '#editProfileForm', handleProfileFormSubmit);

    // Change password button handler
    $(document).on('click', '#changePasswordBtn', function() {
        showChangePasswordModal();
    });

    // Function to show change password modal
    function showChangePasswordModal() {
        let html = `
            <div id="changePasswordModal" class="modal" style="display: flex;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Change Password</h2>
                        <button type="button" class="modal-close" id="closeChangePasswordModal">&times;</button>
                    </div>
                        <div class="modal-body">
                            <form id="changePasswordForm">
                                <div class="form-group">
                                    <label for="currentPassword">Current Password:</label>
                                    <input type="password" id="currentPassword" name="current_password" required style="position: relative; z-index: 1501;">
                                </div>
                                <div class="form-group">
                                    <label for="newPassword">New Password:</label>
                                    <input type="password" id="newPassword" name="new_password" required style="position: relative; z-index: 1501;">
                                </div>
                                <div class="form-group">
                                    <label for="confirmPassword">Confirm New Password:</label>
                                    <input type="password" id="confirmPassword" name="confirm_password" required style="position: relative; z-index: 1501;">
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn-submit">Change Password</button>
                                    <button type="button" id="cancelPasswordChange" class="btn-cancel">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(html);
        $("#changePasswordModal").hide().fadeIn();
    }

    // Modal event handlers
    $(document).on('click', '#closeChangePasswordModal', function() {
        $('#changePasswordModal').fadeOut(function() {
            $(this).remove();
        });
    });

    $(document).on('click', '#cancelPasswordChange', function() {
        $('#changePasswordModal').fadeOut(function() {
            $(this).remove();
        });
    });

    $(document).on('click', '#changePasswordModal', function(e) {
        if (e.target === this) {
            $(this).fadeOut(function() {
                $(this).remove();
            });
        }
    });

    $(document).on('click', '#changePasswordModal .modal-content', function(e) {
        e.stopPropagation();
    });

    // Load sessions on page load
    loadSeassions();
}); // End of document ready

    // Handle change password form submission
    $(document).on('submit', '#changePasswordForm', function(e) {
        e.preventDefault();

        let currentPassword = $('#currentPassword').val();
        let newPassword = $('#newPassword').val();
        let confirmPassword = $('#confirmPassword').val();
        let coordinatorId = $('#hiddencdrid').val();

        console.log('Attempting to change password for coordinator:', coordinatorId);

        if (!coordinatorId) {
            alert("Error: Coordinator ID not found. Please try logging in again.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        if (newPassword.length < 6) {
            alert("New password must be at least 6 characters long!");
            return;
        }

        // Show loading state
        $('.btn-submit').prop('disabled', true).text('Verifying...');
        
        console.log("Starting password change for coordinator:", coordinatorId);
        
        // First verify the current password
        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            dataType: "json",
            data: {
                action: 'verifyCoordinatorPassword',
                coordinator_id: coordinatorId,
                current_password: currentPassword
            },
            success: function(response) {
                console.log("Password verification response:", response);
                $('.btn-submit').prop('disabled', false).text('Change Password');
                
                if (response.success) {
                    console.log("Password verified, proceeding with update");
                    // Password verified, now update it
                    $('.btn-submit').text('Updating...');
                    
                    $.ajax({
                        url: "ajaxhandler/attendanceAJAX.php",
                        type: "POST",
                        dataType: "json",
                        data: {
                            action: 'updateCoordinatorPassword',
                            coordinator_id: coordinatorId,
                            current_password: currentPassword,
                            new_password: newPassword
                        },
                        success: function(updateResponse) {
                            console.log("Password update response:", updateResponse);
                            if (updateResponse.success) {
                                alert("Password changed successfully!");
                                $('#changePasswordModal').fadeOut(function() {
                                    $(this).remove();
                                    console.log("Change password modal removed");
                                    // Show coordinator details modal again
                                    $.ajax({
                                        url: "ajaxhandler/attendanceAJAX.php",
                                        type: "POST",
                                        dataType: "json",
                                        data: {
                                            cdrid: coordinatorId, 
                                            action: "getCoordinatorDetails"
                                        },
                                        success: function(response) {
                                            if (response.success) {
                                                displayCoordinatorDetails(response.data);
                                            }
                                        }
                                    });
                                });
                            } else {
                                alert("Error: " + (updateResponse.message || "Failed to update password"));
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error("Error updating password:", error);
                            alert("Error updating password. Please try again.");
                        }
                    });
                } else {
                    alert("Current password is incorrect!");
                }
            },
            error: function(xhr, status, error) {
                $('.btn-submit').prop('disabled', false).text('Change Password');
                console.error("Error verifying password - Status:", status);
                console.error("Error verifying password - Error:", error);
                
                let errorMessage = "Error verifying password. ";
                try {
                    // Try to parse error response as JSON
                    let response = JSON.parse(xhr.responseText);
                    errorMessage += response.message || "Please try again.";
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage += xhr.statusText || "Please try again.";
                }
                
                alert(errorMessage);
            }
        });
    });

    // Sidebar toggle button click handler
    $('#sidebarToggle').on('click', function() {
        $('.sidebar').toggleClass('sidebar-open');
    });

    // Click outside to close modals and sidebar
    $(document).on('click', function(event) {
        // Close coordinator details modal
        if (!$(event.target).closest('#coordinatorDetailsModal .modal-content').length && !$(event.target).is('#btnProfile')) {
            $('#coordinatorDetailsModal').fadeOut(function() {
                $(this).remove();
            });
        }

        // Close add student form
        if (!$(event.target).closest('#addStudentForm').length && !$(event.target).is('.btnAdd')) {
            $('#addStudentForm').fadeOut(function() {
                $('#studentForm')[0].reset();
                $('#studentForm input, #studentForm select').prop('disabled', false);
            });
        }

        // Close add HTE form
        if (!$(event.target).closest('#addHTEForm').length && !$(event.target).is('.btnAddHTE')) {
            $('#addHTEForm').fadeOut();
        }

        // Close sidebar when clicking outside
        if (!$(event.target).closest('.sidebar').length && !$(event.target).is('#sidebarToggle')) {
            $('.sidebar').removeClass('sidebar-open');
        }
    });

    // Function to load all students data
    function loadAllStudentsData() {
        console.log('loadAllStudentsData function called');
        console.log('Coordinator ID:', $("#hiddencdrid").val()); // Log the coordinator ID
        // Close other forms
        $('#studentFormContainer').fadeOut(function() {
            $('#studentForm')[0].reset();
            $('#studentForm input, #studentForm select').prop('disabled', false);
        });
        $('#addHTEFormContainer').hide();
        $('#sessionFormContainer').hide();
        $('#deleteHTEFormContainer').hide();
        $('#deleteSessionFormContainer').hide();
        $('#deleteStudentFormContainer').hide();

        let cdrid = $("#hiddencdrid").val();

        if (!cdrid) {
            alert("Coordinator ID not found.");
            return;
        }

        console.log('Making AJAX request with cdrid:', cdrid);
        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            dataType: "json",
            data: {cdrid: cdrid, action: "getAllStudentsUnderCoordinator"},
            success: function(response) {
                console.log('AJAX response received:', response);
                if (response.success) {
                    console.log('Success - Displaying students data');
                    displayAllStudents(response.data);
                } else {
                    console.error('Error in response:', response.message);
                    alert("Error: " + (response.message || "Unknown error occurred."));
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX error:", status, error);
                alert("Error fetching students. Please check the console for more information.");
            }
        });
    }

    // View All Students button click handler
    $(document).on('click', '#btnViewAllStudents', function() {
        loadAllStudentsData();
    });

    // Function to display all students under coordinator
    function displayAllStudents(students) {
        console.log('displayAllStudents called with data:', students);
        let tbodyHtml = '';

        if (students && students.length > 0) {
            students.forEach(student => {
                tbodyHtml += `
                    <tr>
                        <td>${student.STUDENT_ID || ''}</td>
                        <td>${student.NAME || ''}</td>
                        <td>${student.SURNAME || ''}</td>
                        <td>${student.AGE || ''}</td>
                        <td>${student.GENDER || ''}</td>
                        <td>${student.EMAIL || ''}</td>
                        <td>${student.CONTACT_NUMBER || ''}</td>
                        <td>${student.HTE_NAME || 'Not Assigned'}</td>
                        <td>${student.SESSION_NAME || 'Not Assigned'}</td>
                    </tr>
                `;
            });
        } else {
            tbodyHtml = `<tr><td colspan="9">No students found under this coordinator.</td></tr>`;
        }

        $('#allStudentsTableBody').html(tbodyHtml);
        $('#allStudentsContainer').fadeIn();
    }

    // Close all students container
    $(document).on('click', '#closeAllStudents', function() {
        $('#allStudentsContainer').fadeOut();
    });

function getSessionHTML(rv)
{
    let x = ``;
    x=`<option value=-1>SELECT ONE</option>`;
    let i=0;
    for(i=0;i<rv.length;i++)
    {
        let cs = rv[i];
        x=x+ `<option value=${cs['ID']}>${cs['YEAR']+" "+cs['TERM']}</option>`;
    }

    return x;
}

function loadSeassions()
{
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {action: "getSession" },
        beforeSend: function() {
            // para mo show ni siya loading

        },
        success: function(rv) {
            {
                //alert(JSON.stringify(rv));
                let x=getSessionHTML(rv);
                $("#ddlclass").html(x);

                // Auto-select the first session if available
                if (rv && rv.length > 0) {
                    $("#ddlclass").val(rv[0].ID);
                    // Trigger the change event to load HTEs for the selected session
                    $("#ddlclass").trigger("change");
                }

            }
        },
        error: function(xhr, status, error) {

            alert("OOPS!");
        }
    });
}

function getHTEHTML(classlist)
{
    let x = ``;
    x=``;
    let i=0;
    for(i=0;i<classlist.length;i++)
        {
            let cc = classlist[i];
            x=x+`<div class="classcard" data-building='${JSON.stringify(cc)}'>${cc['NAME']}</div>`;
        }         
    return x;
}

function fetchTHE(cdrid,sessionid)
{   console.log("Fetching THE for session:", sessionid);
    //kuhaon tanan mga H.T.E nga gi handle sa current login coordinator
    //didto sa database gamit ang ajax call
    $.ajax({
        
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {cdrid:cdrid,sessionid:sessionid,action:"getHTE"},
        beforeSend: function(e) {
            // para mo show ni siya loading

        },
        success: function(rv) {
            {
                // console.log(rv);
                // alert(JSON.stringify(rv));
                let  x=getHTEHTML(rv);
                $("#classlistarea").html(x);
            }
        },
        error: function(e) {
            console.error("Error fetching THE:", e);
        }
    });

}

 function getClassdetailsAreaHTML(building)
{
    let dobj=new Date();
    let ondate=`2024-09-11`;
    let year=dobj.getFullYear();//format ni sa data
    let month=dobj.getMonth()+1;//para sa 0-11 na months
    if(month<10)
    {
        month="0"+month;//para ma string siya
    }
    let day=dobj.getDate();//para sa 1-31 na days
    if(day<10)
        {
            day="0"+day;//para ma string siya
        }
    ondate=year+"-"+month+"-"+day;
    // alert(ondate);
    let x = `<div class="classdetails">
                <div class="code-area">${building['INDUSTRY']}</div>
                <div class="title-area">${building['NAME']}</div>
                <div class="ondate-area">
                    <input type="date" value='${ondate}' id='dtpondate'>
                </div>
            </div>`;
    return x;
}
///////


function getStudentListHTML(studentList) {
    let x = `<div class="studentlist"><label>STUDENT LIST</label></div>`;
    if (studentList && studentList.length > 0) {
        x += `<div class="studentdetails header-row">`;
        // Removed checkbox column header
        // x += `<div class="select-area"><input type="checkbox" id="selectAll"></div>`;
        x += `<div class="rollno-area">Student ID</div>`;
        x += `<div class="name-area">Name</div>`;
        x += `<div class="delete-area"></div>`;
        x += `<div class="timein-area">Time In</div>`;
        x += `<div class="timeout-area">Time Out</div>`;
        x += `</div>`; // close header-row div

        studentList.forEach((cs, index) => {
            x += `<div class="studentdetails">`;
            x += `<div class="rollno-area">${cs['STUDENT_ID']}</div>`;
            x += `<div class="name-area">${cs['SURNAME']}, ${cs['NAME']}</div>`;

            // Delete button in separate column
            x += `<div class="delete-area">`;
            x += `<button class="btnProfileStudent student-action-btn" data-studentid="${cs['INTERNS_ID']}">Profile</button>`;
            x += `<button class="btnDashboardStudent student-action-btn" data-studentid="${cs['INTERNS_ID']}">Stats</button>`;
            x += `</div>`;
// Student Profile Modal (view-only)
if ($("#studentProfileModal").length === 0) {
    $("body").append(`
        <div id="studentProfileModal" class="modal" style="display:none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Student Profile</h2>
                    <button class="modal-close" id="closeStudentProfileModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="studentProfileModalContent">
                        <!-- Student profile details will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `);
}

$(document).on("click", ".btnProfileStudent", function() {
    let studentId = $(this).data('studentid');
    if (!studentId) {
        alert("Student ID not found.");
        return;
    }
    console.log('[Student Profile Modal] Fetching profile for studentId:', studentId);
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getStudentProfile",
            studentId: studentId
        },
        success: function(response) {
            console.log('[Student Profile Modal] AJAX response:', response);
            if (response.status === "success" && response.data) {
                let profile = response.data;
                let html = `<div class='profile-header'>`;
                html += `<div class='profile-avatar'>`;
                html += `<img src='${profile.profile_picture ? 'uploads/' + profile.profile_picture : 'icon/nobglogo.ico'}' alt='Profile Picture' class='avatar-placeholder'>`;
                html += `</div>`;
                html += `<h2>${profile.NAME} ${profile.SURNAME}</h2>`;
                html += `<p class='profile-subtitle'>Student Profile</p>`;
                html += `</div>`;
                html += `<div class='profile-details'>`;
                html += `<div class='detail-row'><span class='detail-label'>Intern ID:</span><span class='detail-value'>${profile.INTERNS_ID || ''}</span></div>`;
                html += `<div class='detail-row'><span class='detail-label'>Student ID:</span><span class='detail-value'>${profile.STUDENT_ID || ''}</span></div>`;
                html += `<div class='detail-row'><span class='detail-label'>Full Name:</span><span class='detail-value'>${profile.NAME} ${profile.SURNAME}</span></div>`;
                html += `<div class='detail-row'><span class='detail-label'>Age:</span><span class='detail-value'>${profile.AGE || ''}</span></div>`;
                html += `<div class='detail-row'><span class='detail-label'>Gender:</span><span class='detail-value'>${profile.GENDER || ''}</span></div>`;
                html += `<div class='detail-row'><span class='detail-label'>Email:</span><span class='detail-value'>${profile.EMAIL || ''}</span></div>`;
                html += `<div class='detail-row'><span class='detail-label'>Contact Number:</span><span class='detail-value'>${profile.CONTACT_NUMBER || ''}</span></div>`;
                html += `<div class='detail-row'><span class='detail-label'>HTE Name:</span><span class='detail-value'>${profile.HTE_NAME || 'N/A'}</span></div>`;
                html += `</div>`;
                $("#studentProfileModalContent").html(html);
                $("#studentProfileModal").fadeIn();
                console.log('[Student Profile Modal] Profile loaded and modal shown.');
            } else {
                console.error('[Student Profile Modal] Student profile not found.', response);
                alert("Student profile not found.");
            }
        },
        error: function(xhr, status, error) {
            console.error('[Student Profile Modal] AJAX error:', error, xhr.responseText);
            alert("Error loading student profile: " + error);
        }
    });
});

$(document).on("click", "#closeStudentProfileModal", function() {
    $("#studentProfileModal").fadeOut();
});

            // Convert time to AM/PM format for timein and timeout, or display '--:-- --' if empty
            const formatTime = (time) => {
                if (!time) return '--:-- --'; // Return '--:-- --' if time is empty

                let [hours, minutes] = time.split(':');
                let suffix = 'AM';
                hours = parseInt(hours);

                if (hours >= 12) {
                    suffix = 'PM';
                    if (hours > 12) hours -= 12; // Convert to 12-hour format
                } else if (hours === 0) {
                    hours = 12; // Midnight case
                }

                return `${hours}:${minutes} ${suffix}`;
            };

            x += `<div class="timein-area" data-studentid='${cs['INTERNS_ID']}'>`;
            x += `<span class="cbtimein">${formatTime(cs['timein'])}</span>`;
            x += `</div>`;

            x += `<div class="timeout-area" data-studentid='${cs['INTERNS_ID']}'>`;
            x += `<span class="cbtimeout">${formatTime(cs['timeout'])}</span>`;
            x += `</div>`;

            x += `</div>`; // close studentdetails div
        });

    } else {
        x += `<p>No students found.</p>`;
    }
        // Create the report button only, removed assign button
        x += `<div class="reportsection">`;
        // x += `<button id="btnAssign" class="common-button btnAssign">ASSIGN</button>`;
        x += `</div>`; // close reportsection div

    return x;
}














function fetchStudentList(sessionid,classid,cdrid,ondate)
{
    console.log("fetchStudentList called with sessionid: " + sessionid + ", classid: " + classid + ", cdrid: " + cdrid + ", ondate: " + ondate);
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {cdrid:cdrid,ondate:ondate,sessionid:sessionid,classid:classid, action: "getStudentList" },
        beforeSend: function() {
            // para mo show ni siya loading

        },
        success: function(rv) {
            // console.log("fetchStudentList success: " + JSON.stringify(rv));
            {
                // alert(JSON.stringify(rv))
                let x = getStudentListHTML(rv);
                $("#studentlistarea").html(x);
            }
        },
        error: function(xhr, status, error) {
            console.log("fetchStudentList error: " + error);
        }
    });
}



// after sa  page mag loading kani na ang e call or e execute

function  saveAttendance(studentid,hteid,coordinatorid,sessionid,ondate,timein,timeout)
{
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {studentid:studentid,hteid:hteid,coordinatorid:coordinatorid,sessionid:sessionid,ondate:ondate,timein:timein,timeout:timeout, action: "saveattendance" },
        beforeSend: function() {
            // para mo show ni siya loading
        },
        success: function(rv) {
            if(rv[0] == 1) {
                alert("Attendance saved successfully!");
            } else {
                alert("Error saving attendance: " + rv[0]);
            }
        },
        error: function(xhr, status, error) {
            alert("OOPSIE FROM saveAttendance! " + error);
        }
    });
}


function downloadPDF(sessionid, classid, cdrid) {
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: { 
            sessionid: sessionid, 
            classid: classid, 
            cdrid: cdrid, 
            ondate: $("#dtpondate").val(), 
            action: "downloadReport" 
        },
        beforeSend: function() {
            console.log("Downloading PDF...");
        },
        success: function(rv) {
            console.log(rv);
            if (rv.filename) {
                var a = document.createElement('a');
                a.href = "ajaxhandler/" + rv.filename;
                a.download = 'attendance_report.pdf';
                a.click();
            } else {
                console.log("Error: No filename returned");
            }
        },
        error: function(xhr, status, error) {
            console.log("Error: " + error);
        }
    });
}



$(function(e)
{
    $(document).on("click","#logoutBtn",function(ee)
    {
            $.ajax(
            {
                // para mo connect ni siya sa logoutAjac.php
                url: "ajaxhandler/logoutAjax.php",
                type: "POST",
                dataType: "json",
                data: {id:1 },
                beforeSend: function(e) {
                    
                },
                success: function(rv) {
                    document.location.replace("index.php");
                },
                error: function(xhr, status, error) {
                    alert("Something went wrong!")
                }
            }
        );

    });



    loadSeassions();

    $(document).on("change", "#ddlclass", function(e) {
        currentSessionId = $(this).val();
        $("#hiddenSelectedSessionId").val(currentSessionId);
        $("#classlistarea").html(``);
        $("#classdetailsarea").html(``);
        if (currentSessionId != -1) {
            let cdrid = $("#hiddencdrid").val();
            fetchTHE(cdrid, currentSessionId); // Fetch HTEs for the selected session
            // Display student list area with only Add HTE button enabled
            $("#studentlistarea").html(getStudentListHTML([]));
        } else {
            $("#studentlistarea").html(``);
        }
    });

    $(document).on("click", ".classcard", function(e ) {
        // Hide control panel forms when showing student list
        $('.form-container').slideUp();
        let building = $(this).data('building');
        currentHteId = building['HTE_ID'];
        $("#hiddenSelectedHteID").val(currentHteId);
        let x = getClassdetailsAreaHTML(building);
        $("#classdetailsarea").html(x);
        let cdrid = $("#hiddencdrid").val();
        let ondate = $("#dtpondate").val();
        if (currentSessionId != -1) {
            fetchStudentList(currentSessionId, currentHteId, cdrid, ondate);
        }
    });



    $(document).on("click",".cbpresent",function(e){
        let studentid=$(this).data('studentid');
        let hteid=$("#hiddenSelectedHteID").val();
        let coordinatorid= $("#hiddencdrid").val();
        let sessionid=$("#ddlclass").val();
        let ondate=$("#dtpondate").val();
        let timein = $(this).closest(".studentdetails").find(".cbtimein").val();
        let timeout = $(this).closest(".studentdetails").find(".cbtimeout").val();
        if(timein === undefined || timein === null || timein === ""){
            timein = "";
        }
        if(timeout === undefined || timeout === null || timeout === ""){
            timeout = "";
        }
        saveAttendance(studentid, hteid, coordinatorid, sessionid, ondate, timein, timeout);
    });

    $(document).on("change", ".cbtimein", function() {
        let studentid = $(this).data('studentid');
        let hteid = $("#hiddenSelectedHteID").val();
        let coordinatorid = $("#hiddencdrid").val();
        let sessionid = $("#ddlclass").val();
        let ondate = $("#dtpondate").val();
        let timein = $(this).val();
        let timeout = $(this).closest(".studentdetails").find(".cbtimeout").val();
    
        saveAttendance(studentid, hteid, coordinatorid, sessionid, ondate, timein, timeout);
    });
    
    $(document).on("change", ".cbtimeout", function() {
        let studentid = $(this).data('studentid');
        let hteid = $("#hiddenSelectedHteID").val();
        let coordinatorid = $("#hiddencdrid").val();
        let sessionid = $("#ddlclass").val();
        let ondate = $("#dtpondate").val();
        let timein = $(this).closest(".studentdetails").find(".cbtimein").val();
        let timeout = $(this).val();
    
        saveAttendance(studentid, hteid, coordinatorid, sessionid, ondate, timein, timeout);
    });

    $(document).on("change","#dtpondate",function(e){

        let sessionid=$("#ddlclass").val();
        let classid= $("#hiddenSelectedHteID").val();
        let cdrid=$("#hiddencdrid").val();
        let ondate=$("#dtpondate").val();
        if(sessionid!=-1)
        {
        
            fetchStudentList(sessionid,classid,cdrid,ondate);
        }
    });
    $(document).on("click", "#btnReport", function() {
        if (currentSessionId != -1 && currentHteId) {
            let cdrid = $("#hiddencdrid").val();
            downloadPDF(currentSessionId, currentHteId, cdrid);
        } else {
            alert("Please select an HTE first.");
        }
    });
    $(document).ready(function() {
        $(document).on("click", ".btnAdd", function(e) {
            e.preventDefault();
            let hteId = $("#hiddenSelectedHteID").val();

            if (!hteId || hteId === "") {
                alert("Please Select HTE Before Adding Student");
                return;
            }
            // Close other forms
            $('#allStudentsContainer').fadeOut();
            $('#addHTEForm').fadeOut();
            $("#addStudentForm").show();
        });
    


        // $(document).on("submit", "#studentEditForm", function(e) {
        //     e.preventDefault(); // Prevent the default form submission
        
        //     // Get the student ID from the form (should be populated)
        //     var studentId = $("#editStudentId").val();
        //     console.log("Student ID before submission:", studentId); // Debug: Check if studentId is populated
        
        //     // Ensure studentId is not empty
        //     if (!studentId) {
        //         alert("Student ID is required!");
        //         return; // Stop the submission if the student ID is missing
        //     }
        
        //     // Serialize the form data, including the studentId
        //     var formData = $(this).serialize();
        //     console.log("Serialized Form Data:", formData); // Debug: Check serialized form data
        
        //     // Ensure the action is appended to the form data
        //     formData += "&action=updateStudent"; 
        
        //     // Log the final form data before sending the request
        //     console.log("Final Form Data:", formData); 
        
        //     // Send AJAX request to update student details
        //     $.ajax({
        //         url: 'ajaxhandler/coordinatorEditStudentAjax.php',
        //         type: 'POST',
        //         data: formData,
        //         dataType: 'json',
        //         success: function(response) {
        //             if (response.status === 'success') {
        //                 alert("Student details updated successfully!");
        //                 $("#editStudentForm").hide(); // Hide the modal after successful update
        //                 loadStudentDetails(studentId); // Optionally refresh the student details
        //             } else {
        //                 alert("Error: " + response.message);
        //             }
        //         },
        //         error: function(xhr, status, error) {
        //             alert("An error occurred: " + error);
        //         }
        //     });
        // });
        
        
        
        $(document).on("submit", "#studentForm", function(e) {
            e.preventDefault(); // Prevent the default form submission
        
            let studentId = $("#studentId").val();  // Ensure this is correctly populated
            let action = studentId ? "updateStudent" : "addStudent"; // Determine action based on studentId
        
            var formData = new FormData(this);
            formData.append('hte_id', $("#hiddenSelectedHteID").val());
            formData.append('session_id', $("#hiddenSelectedSessionId").val());
            formData.append('action', action);  // Append action to FormData
            formData.append('student_id', studentId); // Append studentId for update
        
            // Check if a CSV file is selected
            if ($("#csvFile").get(0).files.length > 0) {
                console.log($("#csvFile").get(0).files); // Log selected files
                $("#studentForm input, #studentForm select").prop("disabled", true); // Disable form inputs during submission
        
                // AJAX request to upload CSV
                $.ajax({
                    url: "ajaxhandler/uploadCSV.php",
                    type: "POST",
                    data: formData,
                    contentType: false, // Important for file uploads
                    processData: false, // Important for file uploads
                    success: function(response) {
                        if (response.success) {
                            alert("Students added successfully from CSV!");
                            $("#addStudentForm").hide(); // Hide the form after success
                            let cdrid = $("#hiddencdrid").val();
                            let ondate = $("#dtpondate").val();
                            fetchStudentList(currentSessionId, currentHteId, cdrid, ondate); // Refresh the student list
                        } else {
                            alert(response.message); // Show error message
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("Error uploading CSV:", error);
                        alert("An error occurred while uploading the CSV file. Please check the console for details.");
                    }
                });
            } else {
                // Check if HTE and Session are selected
                // Handle single student addition
                if (!currentHteId || currentHteId === "") {
                    alert("Please select an HTE before adding a student.");
                    return;
                }
            
                if (!currentSessionId || currentSessionId === "-1") {
                    alert("Please select a session before adding a student.");
                    return;
                }
            
                let formData = $(this).serialize();
                formData += "&action=addStudent&hteId=" + currentHteId + "&sessionId=" + currentSessionId;
            
                console.log("Form data being sent:", formData);
            
                $.ajax({
                    url: "ajaxhandler/attendanceAJAX.php",
                    type: "POST",
                    data: formData,
                    dataType: "json",
                    success: function(response) {
                        console.log("Server response:", response);
                        if (response.success) {
                            alert("Student added successfully!");
                            $("#addStudentForm").hide();
                        
                            let cdrid = $("#hiddencdrid").val();
                            let ondate = $("#dtpondate").val();
                            fetchStudentList(currentSessionId, currentHteId, cdrid, ondate);
             
                            $("#studentForm")[0].reset();
                        } else {
                            console.error(response.message);
                            alert(response.message);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("AJAX error:", status, error);
                        console.log("Response text:", xhr.responseText);
                        let errorMessage = "An error occurred while adding the student.";
                        try {
                            let errorResponse = JSON.parse(xhr.responseText);
                            if (errorResponse.message) {
                                errorMessage = errorResponse.message;
                            }
                        } catch (e) {
                            console.error("Error parsing error response:", e);
                        }
                        alert("Error: " + errorMessage + "\nPlease check the console for more details.");
                    }
                });
            }
        });      

        $(document).on("click", "#closeForm", function() {
            if ($("#addStudentForm").is(":visible")) {
                $("#addStudentForm").fadeOut(function() {
                    $("#studentForm")[0].reset();
                    $("#studentForm input, #studentForm select").prop("disabled", false);
                });
            }
        });
    
        $(document).on("change", "#csvFile", function() {
            $("#studentForm input[type='text'], #studentForm input[type='number'], #studentForm input[type='email'], #studentForm select").prop("disabled", $(this).get(0).files.length > 0);
        });
    });
    
    


    
    $(document).ready(function() {

        $(document).on("click", ".btnAddHTE", function(e) {
            e.preventDefault();
            $("#addHTEForm").css("display", "flex").hide().fadeIn();
        });
    

        $(document).on("submit", "#hteForm", function(e) {
            e.preventDefault();
            let formData = $(this).serialize();
            formData += "&action=addHTE&sessionId=" + currentSessionId;
        
            console.log("Form data being sent:", formData);
        
            $.ajax({
                url: "ajaxhandler/attendanceAJAX.php",
                type: "POST",
                data: formData,
                dataType: "json",
                success: function(response) {
                    console.log("Server Response:", response); // Log the raw response
                    if (response.success) {
                        alert("HTE added successfully! ");
                        $("#addHTEForm").hide();
                    } else {
                        alert("Error adding HTE: " + response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX error:", status, error);
                    console.log("Response text:", xhr.responseText); // Log the response text for debugging
                    alert("Error adding HTE: " + error + "\nCheck console for more details.");
                }
            });
        });
    
    
        $(document).on("click", "#closeHTEForm", function(e) {
            $("#addHTEForm").fadeOut();
        });


    $(document).on("click", ".btnDelete", function() {
        let studentId = $(this).data('studentid'); 
        if (confirm("Are you sure you want to delete this student?")) { 
            deleteStudent(studentId); 
        }
    });

    function deleteStudent(studentId) {
        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php", // URL to your AJAX handler
            type: "POST",
            dataType: "json",
            data: {
                studentId: studentId,
                action: "deleteStudent" // Specify the action to be performed
            },
            success: function(response) {
                if (response.success) {
                    alert("Student deleted successfully!");
                    // Automatically refresh the list after successful deletion
                    fetchStudentList(currentSessionId, currentHteId, cdrid, ondate); // Refresh the list
                } else {
                    alert("Error deleting student: " + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("Error deleting student:", error);
                alert("An error occurred while deleting the student.");
            }
        });
    }

///////////////////////////////////

$(document).on("click", ".btnDeleteHTE", function () {
    const hteId = $(this).data("hteid");
    const sessionId = $(this).data("sessionid");

    // Log to verify the values of hteId and sessionId
    console.log("HTE ID:", hteId);
    console.log("Session ID:", sessionId);

    if (!hteId || !sessionId) {
        alert("HTE ID or Session ID not found!");
        return;
    }

    // Proceed with the AJAX request if both values are valid
    $('#hiddenSelectedHteID').val(hteId);
    $('#hiddenSelectedSessionId').val(sessionId);

    if (confirm("Are you sure you want to delete this HTE and all associated students?")) {
        $.ajax({
            url: "ajaxhandler/attendanceAJAX.php",
            type: "POST",
            data: {
                action: "deleteHTE",
                hteId: hteId,
                sessionId: sessionId,
            },
            success: function(response) {
                console.log("Server Response: ", response);  // Log the response to check what it contains

                if (typeof response === 'string') {
                    try {
                        const result = JSON.parse(response);  // Parse if it's a string
                        handleResponse(result);
                    } catch (e) {
                        console.error('Error parsing response:', e);
                        alert('Error: Unable to parse server response');
                    }
                } else {
                    // If it's already an object, just pass it to the handler
                    handleResponse(response);
                }
            },
            error: function (xhr, status, error) {
                // alert("AJAX Error: " + error);
            },
        });

        function handleResponse(result) {
            if (result.success) {
                alert(result.message); // Success message

                // Remove HTE row from the frontend
                // Assuming the HTML structure has an element with id `hteRow_${hteId}`
                $('#hteRow_' + hteId).remove(); // Adjust the selector based on your HTML structure

                // Optionally, fetch and update the student list to ensure data is in sync
                fetchUpdatedStudentList();
            } else {
                alert("Error: " + result.message);
            }
        }

        function fetchUpdatedStudentList() {
            // Assuming you have a function to fetch and update the student list
            $.ajax({
                url: "ajaxhandler/attendanceAJAX.php",
                type: "POST",
                data: {
                    action: "fetchStudentList",
                    sessionId: sessionId,
                    classId: $("#classId").val(),  // Assuming classId is available
                    cdrid: $("#cdrid").val(),  // Assuming cdrid is available
                    ondate: $("#ondate").val(),  // Assuming ondate is available
                },
                success: function(response) {
                    if (response && response.success) {
                        // Update the student list UI based on the new data
                        $('#studentListContainer').html(getStudentListHTML(response.studentList));
                    } else {
                        alert("Error fetching updated student list.");
                    }
                },
                error: function(xhr, status, error) {
                    // alert("AJAX Error: " + error);
                }
            });
        }
    }
});




$(document).on("submit", "#coordinatorForm", function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Serialize the form data
    var formData = $(this).serialize();

    $.ajax({
        url: "ajaxhandler/addCoordinatorAjax.php", // Your server-side script to handle the addition
        type: "POST",
        data: formData,
        dataType: "json",
        success: function(response) {
            if (response.success) {
                alert("Coordinator/Admin added successfully!");
                $("#addCoordinatorForm").hide(); // Hide the form after success
                // Optionally refresh the coordinator list or do something else
            } else {
                alert("Error: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error adding coordinator/admin:", error);
            alert("An error occurred while adding the coordinator/admin.");
        }
    });
});



// Role-based HTE dropdown logic
$(document).on("change", "#role", function() {
    const selectedRole = $(this).val();
    if (selectedRole === "ADMIN") {
        $("#hteDropdownContainer").show();
        fetchHTEOptions(); // Fetch and populate HTE options
    } else {
        $("#hteDropdownContainer").hide();
    }
});

// Fetch HTE options based on role
function fetchHTEOptions() {
    $.ajax({
        url: "ajaxhandler/addCoordinatorAjax.php", // Adjust the URL as needed
        type: "POST",
        dataType: "json",
        data: { action: "getHTEs" }, // Specify the action to fetch HTEs
        success: function(response) {
            console.log("HTE Fetch Response:", response); // Debugging line
            if (response.success) {
                const hteSelect = $("#hteSelect");
                hteSelect.empty(); // Clear existing options
                response.htes.forEach(hte => {
                    hteSelect.append(`<option value="${hte.HTE_ID}">${hte.NAME}</option>`);
                });
            } else {
                alert("Error fetching HTEs: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error fetching HTEs:", error); // Log the error
            alert("An error occurred while fetching HTEs. Please check the console for more details.");
        }
    });
}

// Select all checkboxes functionality
$(document).on("change", "#selectAll", function() {
    const isChecked = $(this).is(":checked");
    $(".student-checkbox").prop("checked", isChecked);
});

// Assign button click handler
$(document).on("click", "#btnAssign", function() {
    const selectedStudents = [];
    $(".student-checkbox:checked").each(function() {
        selectedStudents.push($(this).data("studentid"));
    });

    if (selectedStudents.length === 0) {
        alert("Please select at least one student to assign.");
        return;
    }

    showAssignModal(selectedStudents);
});

// Function to show assign modal
function showAssignModal(selectedStudents) {
    const modalHTML = `
        <div id="assignModal" class="modal" style="display:flex;">
            <div class="modal-content">
                <h3>Assign Students to Session and HTE</h3>
                <form id="assignForm">
                    <div class="form-group">
                        <label for="assignSessionSelect">Select Session:</label>
                        <select id="assignSessionSelect" name="sessionId" required>
                            <option value="">Select Session</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="assignHTESelect">Select HTE:</label>
                        <select id="assignHTESelect" name="hteId" required>
                            <option value="">Select HTE</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-submit">Assign</button>
                        <button type="button" id="closeAssignModal" class="btn-cancel">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    $('body').append(modalHTML);
    loadAssignSessionOptions();
}

// Load session options for assign modal
function loadAssignSessionOptions() {
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
                $('#assignSessionSelect').html(options);
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

// Load HTE options based on selected session for assign modal
$(document).on("change", "#assignSessionSelect", function() {
    const sessionId = $(this).val();
    if (!sessionId) {
        $('#assignHTESelect').html('<option value="">Select HTE</option>');
        return;
    }

    const cdrid = $('#hiddencdrid').val();
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
                $('#assignHTESelect').html(options);
            } else {
                $('#assignHTESelect').html('<option value="">No HTEs found for this session</option>');
            }
        },
        error: function(xhr, status, error) {
            console.error("Error loading HTEs:", error);
            alert("Error loading HTEs. Please try again.");
        }
    });
});

// Assign form submission
$(document).on("submit", "#assignForm", function(e) {
    e.preventDefault();

    const sessionId = $('#assignSessionSelect').val();
    const hteId = $('#assignHTESelect').val();
    const selectedStudents = [];

    $(".student-checkbox:checked").each(function() {
        selectedStudents.push($(this).data("studentid"));
    });

    if (!sessionId || !hteId) {
        alert("Please select both session and HTE.");
        return;
    }

    if (selectedStudents.length === 0) {
        alert("No students selected.");
        return;
    }

    // Send assignment request
    $.ajax({
        url: "ajaxhandler/attendanceAJAX.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "assignStudents",
            studentIds: selectedStudents,
            sessionId: sessionId,
            hteId: hteId
        },
        success: function(response) {
            if (response.success) {
                alert("Students assigned successfully!");
                $('#assignModal').remove();
                // Refresh the student list
                const cdrid = $('#hiddencdrid').val();
                const ondate = $("#dtpondate").val();
                fetchStudentList(currentSessionId, currentHteId, cdrid, ondate);
            } else {
                alert("Error assigning students: " + (response.message || "Unknown error"));
            }
        },
        error: function(xhr, status, error) {
            console.error("Error assigning students:", error);
            alert("Error assigning students. Please try again.");
        }
    });
});

// Close assign modal
$(document).on("click", "#closeAssignModal", function() {
    $('#assignModal').remove();
});

// Close modal when clicking outside
$(document).on("click", function(event) {
    if ($(event.target).is('#assignModal')) {
        $('#assignModal').remove();
    }
});

});

});