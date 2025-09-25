// Global URLs object accessible to all functions
const URLs = {
    logout: "ajaxhandler/adminLogout.php",
    attendance: "ajaxhandler/approveAttendanceAjax.php",
    history: "ajaxhandler/loadHistoryAjax.php",
    adminDashboard: "ajaxhandler/adminDashboardAjax.php",
    weeklyReports: "ajaxhandler/weeklyReportAjax.php",
    reports: "ajaxhandler/approveReportAjax.php"
};

// Global variable to store current report ID for modal operations
let currentReportId = null;

// Function to handle returning a report
function returnReport(reportId) {
    currentReportId = reportId;
    $('#returnReportModal').show();
    $('#returnReason').val(''); // Clear any previous reason
}

// Function to submit return report
function submitReturnReport() {
    if (!currentReportId) return;

    const reason = $('#returnReason').val().trim();
    if (!reason) {
        alert('Please provide a reason for returning the report.');
        return;
    }

    $.ajax({
        url: URLs.reports,
        type: 'POST',
        data: {
            action: 'returnReport',
            reportId: currentReportId,
            returnReason: reason
        },
        success: function(response) {
            window.isSubmittingReturn = false;
            if (response.status === 'success') {
                // First close the modal
                closeReturnModal();
                // Then show the alert
                alert('Report returned successfully! The student can now edit it.');
                
                // Reset any loading states
                isLoadingReports = false;
                window.isRefreshing = false;
                
                // Clear any existing timeouts
                if (window.refreshTimeout) clearTimeout(window.refreshTimeout);
                if (window.loadingTimeout) clearTimeout(window.loadingTimeout);
                if (window.reportsTimeout) clearTimeout(window.reportsTimeout);
                
                // Then refresh the reports once with current filters
                const studentId = $('#studentFilter').val();
                if (window.currentWeekNumber) {
                    loadWeeklyReports(studentId, window.currentWeekNumber);
                }
            } else {
                closeReturnModal();
                alert('Error: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', status, error);
            alert('Error connecting to server');
            closeReturnModal();
        }
    });
}

// Function to format time to 12-hour format with AM/PM
function formatTimeToPH(timeString) {
    if (!timeString || timeString === '--:--') return '--:--';
    const timeParts = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2]));
    return date.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: true });
}

$(function () {
    // Return Report Modal Event Handlers
    $('#closeReturnModal, #cancelReturn').on('click', function() {
        $('#returnReportModal').hide();
        currentReportId = null;
    });

    $('#confirmReturn').on('click', function() {
        submitReturnReport();
    });

    // Close modal when clicking outside
    $('#returnReportModal').on('click', function(e) {
        if (e.target === this) {
            $(this).hide();
            currentReportId = null;
        }
    });

    // Close modal with Escape key
    $(document).on('keyup', function(e) {
        if (e.key === "Escape") {
            $('#returnReportModal').hide();
            currentReportId = null;
        }
    });

    // Close sidebar when clicking outside
    $(document).click(function(e) {
        // Check if sidebar is open and click is outside sidebar and not on the toggle button
        if ($('.sidebar').hasClass('sidebar-open') && 
            !$(e.target).closest('.sidebar').length && 
            !$(e.target).closest('#sidebarToggle').length) {
            $('.sidebar').removeClass('sidebar-open');
            $('.content-area').removeClass('sidebar-open');
        }
    });

    // Close user dropdown when clicking outside
    $(document).click(function(e) {
        const userProfile = $('#userProfile');
        const userDropdown = $('#userDropdown');
        if (!userProfile.is(e.target) && userProfile.has(e.target).length === 0) {
            userDropdown.hide();
        }
    });

    // Tab functionality
    $('.sidebar-item').on('click', function() {
        const tabId = $(this).attr('id');
        
        // Hide all tab contents
        $('.tab-content').hide();
        
        // Show the selected tab content
        if (tabId === 'pendingTab') {
            $('#pendingTabContent').show();
        } else if (tabId === 'dashboardTab') {
            $('#dashboardTabContent').show();
        } else if (tabId === 'historyTab') {
            $('#historyTabContent').show();
            // Auto-load current date when history tab is opened
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById('historyDate');
            dateInput.value = today;
            loadHistoryRecords(today);
        } else if (tabId === 'reportsTab') {
            $('#reportsTabContent').show();
               // Automatically load the current week's report when Reports tab is opened
               const today = new Date().toISOString().split('T')[0];
               const dateInput = document.getElementById('dateFilter');
               if (dateInput) {
                   dateInput.value = today;
               }
               let studentId = document.getElementById('studentFilter').value;
               const date = new Date(today);
               const day = date.getDay();
               const diff = date.getDate() - day + (day === 0 ? -6 : 1);
               const weekStart = new Date(date.setDate(diff));
               const weekEnd = new Date(weekStart);
               weekEnd.setDate(weekStart.getDate() + 6);
               const formattedWeekStart = weekStart.toISOString().split('T')[0];
               const formattedWeekEnd = weekEnd.toISOString().split('T')[0];
               document.getElementById('previewWeekNumber').textContent = getWeekNumber(weekStart);
               document.getElementById('previewWeekRange').textContent = `${formattedWeekStart} to ${formattedWeekEnd}`;
               window.currentWeekStart = formattedWeekStart;
               window.currentWeekEnd = formattedWeekEnd;
               if (isNaN(studentId) && studentId !== "") {
                   const options = document.getElementById('studentList').options;
                   for (let i = 0; i < options.length; i++) {
                       if (options[i].value === studentId) {
                           studentId = options[i].getAttribute('data-intern-id');
                           break;
                       }
                   }
               }
               const weekNumber = getWeekNumber(new Date(window.currentWeekStart));
               loadWeeklyReports(studentId, weekNumber);
        } else if (tabId === 'contralTab') {
            $('#contralTabContent').show();
        }
        
        // Update active tab
        $('.sidebar-item').removeClass('active');
        $(this).addClass('active');
    });

    function handleAjaxError(xhr, status, error) {
        console.error("AJAX Error:", error);
        console.log("Response text:", xhr.responseText);
        alert(`An error occurred (${status}): ${xhr.statusText}. Please try again.`);
    }

    // Logout functionality
    $(document).on("click", "#btnlogout", function () {
        $.ajax({
            url: URLs.logout,
            type: "POST",
            dataType: "json",
            data: { id: 1 },
            beforeSend: function () {
                $("#btnlogout").prop("disabled", true);
            },
            complete: function () {
                $("#btnlogout").prop("disabled", false);
            },
            success: function (response) {
                document.location.replace("admin.php");
            },
            error: handleAjaxError,
        });
    });

    // Approve attendance functionality
    window.approveAttendance = function (recordId) {
        if (!recordId) {
            alert("Invalid record ID. Please try again.");
            return;
        }

        if (confirm("Are you sure you want to approve this attendance?")) {
            $.ajax({
                url: URLs.attendance,
                type: "POST",
                dataType: "json",
                data: { action: 'approveAttendance', id: recordId },
                beforeSend: function () {
                    console.log(`Sending approval request for record ID: ${recordId}`);
                },
                success: function (response) {
                    if (response.status === 'success') {
                        alert(response.message); // Display success message
                        location.reload(); // Reload the page to reflect changes
                    } else {
                        alert(`Error: ${response.message}`); // Display error message
                    }
                },
                error: handleAjaxError,
            });
        }
    };

    // Decline attendance functionality
    window.deletePendingAttendance = function (recordId) {
        if (!recordId) {
            alert("Invalid record ID. Please try again.");
            return;
        }

        if (confirm("Are you sure you want to decline this attendance?")) {
            $.ajax({
                url: "ajaxhandler/deletePendingAttendanceAjax.php",
                type: "POST",
                dataType: "json",
                data: { action: 'deletePendingAttendance', id: recordId },
                beforeSend: function () {
                    console.log(`Sending deletion request for record ID: ${recordId}`);
                },
                success: function (response) {
                    if (response.status === 'success') {
                        alert(response.message); // Display success message
                        location.reload(); // Reload the page to reflect changes
                    } else {
                        alert(`Error: ${response.message}`); // Display error message
                    }
                },
                error: function (xhr, status, error) {
                    console.error("AJAX Error:", error);
                    alert(`An error occurred: ${xhr.statusText}. Please try again.`);
                },
            });
        }
    };

    // Load history records functionality
    document.getElementById('historyDate').addEventListener('change', function() {
        const selectedDate = this.value;
        if (!selectedDate) {
            alert('Please select a date first.');
            return;
        }
        
        loadHistoryRecords(selectedDate);
    });

    // Function to get week range from a date
    function getWeekRange(date) {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is sunday
        const monday = new Date(currentDate.setDate(diff));
        const sunday = new Date(currentDate.setDate(diff + 6));
        
        return {
            start: monday.toISOString().split('T')[0],
            end: sunday.toISOString().split('T')[0],
            weekNumber: getWeekNumber(monday)
        };
    }

    // Function to get week number
    function getWeekNumber(date) {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
        return weekNo;
    }

    // Load weekly reports functionality
    document.getElementById('loadReportsBtn').addEventListener('click', function() {
        let studentId = document.getElementById('studentFilter').value;
        const selectedDate = document.getElementById('dateFilter').value;

        if (!selectedDate) {
            alert('Please select a date first.');
            return;
        }

        // Convert selected date to week start and end dates
        const date = new Date(selectedDate);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
        const weekStart = new Date(date.setDate(diff));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        // Format dates as YYYY-MM-DD to match database format
        const formattedWeekStart = weekStart.toISOString().split('T')[0];
        const formattedWeekEnd = weekEnd.toISOString().split('T')[0];
        
        // Update the preview week range display
        document.getElementById('previewWeekNumber').textContent = getWeekNumber(weekStart);
        document.getElementById('previewWeekRange').textContent = `${formattedWeekStart} to ${formattedWeekEnd}`;

        // Store week dates for the AJAX request
        window.currentWeekStart = formattedWeekStart;
        window.currentWeekEnd = formattedWeekEnd;

        // If studentId is not a number (because user typed a name), try to find matching INTERNS_ID from datalist options
        if (isNaN(studentId) && studentId !== "") {
            const options = document.getElementById('studentList').options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === studentId) {
                    studentId = options[i].getAttribute('data-intern-id');
                    break;
                }
            }
        }

        const weekNumber = getWeekNumber(new Date(window.currentWeekStart));
        loadWeeklyReports(studentId, weekNumber);
    });

    // Function to load history records via AJAX
    function loadHistoryRecords(date) {
        $.ajax({
            url: URLs.history,
            type: 'POST',
            dataType: 'json',
            data: { 
                action: 'loadHistory',
                date: date 
            },
            beforeSend: function() {
                // Show loading state
                document.getElementById('historyTableBody').innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading...</td></tr>';
                document.getElementById('historyTable').style.display = 'table';
                document.getElementById('historyNoRecords').style.display = 'none';
            },
            success: function(response) {
                if (response.status === 'success') {
                    // Update summary
                    document.getElementById('selectedDate').textContent = date;
                    document.getElementById('historyPresent').textContent = response.summary.present || 0;
                    document.getElementById('historyOnTime').textContent = response.summary.on_time || 0;
                    document.getElementById('historyLate').textContent = response.summary.late || 0;
                    document.getElementById('historyTotal').textContent = response.summary.total || 0;
                    document.getElementById('historySummary').style.display = 'block';

                    // Populate student lists
                    function populateList(listId, students) {
                        const ul = document.getElementById(listId);
                        ul.innerHTML = '';
                        if (students && students.length > 0) {
                            students.forEach(student => {
                                const li = document.createElement('li');
                                li.textContent = student.SURNAME;
                                ul.appendChild(li);
                            });
                        } else {
                            const li = document.createElement('li');
                            li.textContent = 'No students';
                            ul.appendChild(li);
                        }
                    }

                    // Populate student lists as tables with details
                    function populateTable(tableId, students) {
                        const tbody = document.querySelector(`#${tableId} tbody`);
                        tbody.innerHTML = '';
                        if (students && students.length > 0) {
                            students.forEach(student => {
                                const tr = document.createElement('tr');
                                tr.innerHTML = `
                                    <td>${student.STUDENT_ID}</td>
                                    <td>${student.display_name}</td>
                                    <td>${student.TIMEIN || '--:--'}</td>
                                    <td>${student.TIMEOUT || '--:--'}</td>
                                    <td>${student.status}</td>
                                `;
                                tbody.appendChild(tr);
                            });
                        } else {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `<td colspan="5" style="text-align:center;">No students</td>`;
                            tbody.appendChild(tr);
                        }
                    }

                    // populateTable('historyPresentList', response.presentList);
                    // populateTable('historyOnTimeList', response.onTimeList);
                    // populateTable('historyLateList', response.lateList);
                    // populateTable('historyAbsentList', response.absentList);

                    // Update table
                    if (response.records && response.records.length > 0) {
                        let tableHTML = '';
                        response.records.forEach(function(record) {
                            const statusClass = record.status.toLowerCase().replace(' ', '-');
                            tableHTML += `
                                <tr>
                                    <td>${record.STUDENT_ID}</td>
                                    <td>${record.SURNAME}</td>
                                    <td>${formatTimeToPH(record.TIMEIN)}</td>
                                    <td>${formatTimeToPH(record.TIMEOUT)}</td>
                                    <td class="status-${statusClass}">${record.status}</td>
                                </tr>
                            `;
                        });
                        document.getElementById('historyTableBody').innerHTML = tableHTML;
                        document.getElementById('historyTable').style.display = 'table';
                        document.getElementById('historyNoRecords').style.display = 'none';
                    } else {
                        document.getElementById('historyTable').style.display = 'none';
                        document.getElementById('historyNoRecords').style.display = 'block';
                    }
                } else {
                    alert('Error loading history: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', error);
                alert('An error occurred while loading history records.');
            }
        });
    }

});

// Profile modal buttons event delegation (since buttons are dynamically loaded)
$(document).on('click', '.btn-edit', function() {
    showEditProfileModal();
});

$(document).on('click', '.btn-change-password', function() {
    showChangePasswordModal();
});

// Function to show Edit Profile modal
function showEditProfileModal() {
    const profileContent = `
        <div class="modal" id="editProfileModal" style="display: flex;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Edit Profile Picture</h2>
                    <button class="modal-close" id="closeEditProfileModal">&times;</button>
                </div>
                <div class="modal-body">
<form id="editProfileForm" class="edit-profile-picture-form" enctype="multipart/form-data">
                        <div class="profile-picture-section">
                            <div class="current-profile-picture">
                                <div class="avatar-placeholder">
                                    <i class="fas fa-user-shield"></i>
                                </div>
                            </div>
                        <div class="profile-picture-upload file-upload-group">
                            <label for="profilePicture">Upload Profile Picture:</label>
                            <input type="file" id="profilePicture" name="profilePicture" accept="image/*" class="file-input-wrapper">
                            <small>Max file size: 2MB (JPG, PNG, GIF)</small>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-submit">Save Changes</button>
                        <button type="button" class="btn-cancel" id="closeEditProfileModalCancel">Cancel</button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    // Append modal to body
    $('body').append(profileContent);

    // Close modal event
    $('#closeEditProfileModal, #closeEditProfileModalCancel').on('click', function() {
        $('#editProfileModal').remove();
    });

    // Submit form event
    $('#editProfileForm').on('submit', function(e) {
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
        formData.append('action', 'updateAdminProfilePicture');
        formData.append('adminId', $('#userName').data('admin-id'));
        formData.append('profilePicture', fileInput.files[0]);

        // Send AJAX request to update profile picture only
        $.ajax({
            url: URLs.adminDashboard,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    alert('Profile picture updated successfully.');
                    $('#editProfileModal').remove();
                    // Reload profile details in modal
                    loadAdminProfileDetails();
                } else {
                    alert('Error updating profile picture: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", error);
                alert('An error occurred while updating profile picture.');
            }
        });
    });
}

// Global loading flag to prevent multiple simultaneous calls
let isLoadingReports = false;

// Function to load weekly reports via AJAX
function loadWeeklyReports(studentId, weekNumber) {
    // Allow the request if it's after a return, regardless of loading state
    if (isLoadingReports && !window.isAfterReturn) {
        console.log('Reports are already being loaded, skipping this request...');
        return;
    }
    
    // Clear any existing timeouts
    if (window.reportsTimeout) {
        clearTimeout(window.reportsTimeout);
    }
    if (window.loadingTimeout) {
        clearTimeout(window.loadingTimeout);
    }
    if (window.refreshTimeout) {
        clearTimeout(window.refreshTimeout);
    }
    
    // Set loading flag
    isLoadingReports = true;
    
    // Clear refresh flag if it was set
    window.isRefreshing = false;
    
    // Set a safety timeout to reset all flags after 5 seconds
    window.loadingTimeout = setTimeout(() => {
        isLoadingReports = false;
        window.isRefreshing = false;
        console.log('Loading flags reset by safety timeout');
    }, 5000);

    $.ajax({
        url: URLs.weeklyReports,
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'getWeeklyReports',
            studentId: studentId,
            week: weekNumber,
            weekStart: window.currentWeekStart,
            weekEnd: window.currentWeekEnd,
            adminId: $('#userName').data('admin-id')
        },
        beforeSend: function() {
            // Show loading state
            document.getElementById('reportsLoading').style.display = 'block';
            document.getElementById('reportsList').style.display = 'none';
            document.getElementById('noReports').style.display = 'none';
        },
        success: function(response) {
            document.getElementById('reportsLoading').style.display = 'none';
            // Reset all flags
            isLoadingReports = false;
            window.isRefreshing = false;
            
            // Clear any timeouts
            if (window.loadingTimeout) clearTimeout(window.loadingTimeout);
            if (window.refreshTimeout) clearTimeout(window.refreshTimeout);
            if (window.reportsTimeout) clearTimeout(window.reportsTimeout);
            
            // Only log response if it's from a return report refresh
            if (window.isAfterReturn) {
                console.log("Weekly Reports Response after return:", response);
                window.isAfterReturn = false;
            }
            
            if (response.status === 'success') {
                if (response.reports && response.reports.length > 0) {
                    displayWeeklyReports(response.reports);
                    document.getElementById('reportsList').style.display = 'block';
                    document.getElementById('noReports').style.display = 'none';
                } else {
                    document.getElementById('reportsList').style.display = 'none';
                    document.getElementById('noReports').style.display = 'block';
                }
            } else {
                alert('Error loading reports: ' + response.message);
                document.getElementById('reportsList').style.display = 'none';
                document.getElementById('noReports').style.display = 'block';
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', error);
            alert('An error occurred while loading weekly reports.');
            document.getElementById('reportsLoading').style.display = 'none';
            document.getElementById('reportsList').style.display = 'none';
            document.getElementById('noReports').style.display = 'block';
            // Reset loading flag
            isLoadingReports = false;
        }
    });
}

// Function to calculate week number from date
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Function to display weekly reports
function displayWeeklyReports(reports) {
    const reportsList = document.getElementById('reportsList');
    reportsList.innerHTML = '';

    reports.forEach(report => {
        const reportCard = document.createElement('div');
        reportCard.className = 'report-card admin-report-preview';

        // Calculate week number from week_start date
        let weekNumber = 'undefined';
        if (report.week_start) {
            const weekStartDate = new Date(report.week_start);
            weekNumber = getWeekNumber(weekStartDate);
        }

        // Use the pre-parsed contentPerDay from backend, or parse report_content if not available
        let contentPerDay = {};
        if (report.contentPerDay && typeof report.contentPerDay === 'object') {
            contentPerDay = report.contentPerDay;
        } else if (report.report_content) {
            try {
                // Try to parse as JSON first (new format)
                contentPerDay = JSON.parse(report.report_content);
            } catch (e) {
                // Fallback to old format - put all content in monday
                contentPerDay = {
                    monday: report.report_content,
                    tuesday: '',
                    wednesday: '',
                    thursday: '',
                    friday: ''
                };
            }
        } else {
            contentPerDay = {
                monday: '',
                tuesday: '',
                wednesday: '',
                thursday: '',
                friday: ''
            };
        }

        // Get images per day if available
        const imagesPerDay = report.imagesPerDay || {};
        const legacyImages = report.images || [];

        // Remove fallback that assigns all images to Monday
        // if (!Object.keys(imagesPerDay).length && legacyImages.length > 0) {
        //     imagesPerDay.monday = legacyImages;
        // }

        // Ensure all days have image arrays
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        days.forEach(day => {
            if (!imagesPerDay[day]) {
                imagesPerDay[day] = [];
            }
        });

        reportCard.innerHTML = `
            <div class="report-header">
                <h3>${report.student_name} - Week ${weekNumber}</h3>
                <div class="report-meta">
                    <span class="report-period">Period: ${report.week_start} to ${report.week_end}</span>
                    <span class="approval-status ${report.approval_status.toLowerCase()}">${report.approval_status.charAt(0).toUpperCase() + report.approval_status.slice(1)}</span>
                </div>
            </div>

            <div class="report-grid">
                <div class="day-section monday">
                    <h4>Monday</h4>
                    <div class="day-content">
                        <div class="day-images">
                            ${imagesPerDay.monday.map(image => `
                                <img src="${image.url ? image.url : (image.image_path ? image.image_path : '')}" alt="Monday activity" class="activity-image">
                            `).join('')}
                        </div>
                        <div class="day-description">
                            <p>${report.monday_description || 'No description provided for Monday'}</p>
                        </div>
                    </div>
                </div>

                <div class="day-section tuesday">
                    <h4>Tuesday</h4>
                    <div class="day-content">
                        <div class="day-images">
                            ${imagesPerDay.tuesday.map(image => `
                                <img src="${image.url ? image.url : (image.image_path ? image.image_path : '')}" alt="Tuesday activity" class="activity-image">
                            `).join('')}
                        </div>
                        <div class="day-description">
                            <p>${report.tuesday_description || 'No description provided for Tuesday'}</p>
                        </div>
                    </div>
                </div>

                <div class="day-section wednesday">
                    <h4>Wednesday</h4>
                    <div class="day-content">
                        <div class="day-images">
                            ${imagesPerDay.wednesday.map(image => `
                                <img src="${image.url ? image.url : (image.image_path ? image.image_path : '')}" alt="Wednesday activity" class="activity-image">
                            `).join('')}
                        </div>
                        <div class="day-description">
                            <p>${report.wednesday_description || 'No description provided for Wednesday'}</p>
                        </div>
                    </div>
                </div>

                <div class="day-section thursday">
                    <h4>Thursday</h4>
                    <div class="day-content">
                        <div class="day-images">
                            ${imagesPerDay.thursday.map(image => `
                                <img src="${image.url ? image.url : (image.image_path ? image.image_path : '')}" alt="Thursday activity" class="activity-image">
                            `).join('')}
                        </div>
                        <div class="day-description">
                            <p>${report.thursday_description || 'No description provided for Thursday'}</p>
                        </div>
                    </div>
                </div>

                <div class="day-section friday">
                    <h4>Friday</h4>
                    <div class="day-content">
                        <div class="day-images">
                            ${imagesPerDay.friday.map(image => `
                                <img src="${image.url ? image.url : (image.image_path ? image.image_path : '')}" alt="Friday activity" class="activity-image">
                            `).join('')}
                        </div>
                        <div class="day-description">
                            <p>${report.friday_description || 'No description provided for Friday'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="report-footer">
                <div class="footer-left">
                    ${report.updated_at ? `<span class="updated-date">Last Updated: ${report.updated_at}</span>` : ''}
                </div>
                <div class="footer-right">
                    <button class="action-btn approve-btn" onclick="approveReport(${report.report_id})">Approve</button>
                    <button class="action-btn return-btn" onclick="returnReport(${report.report_id})">Return</button>
                </div>
            </div>
        `;

        reportsList.appendChild(reportCard);
    });
}

// Function to load admin profile details
function loadAdminProfileDetails() {
    // Clear previous content
    $('#profileModalContent').html('');
    
    // Show modal and set loading state
    $('#profileModalContent').html('<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading profile details...</div>');
    $('#profileModal').css('display', 'flex');
    
    // Fetch profile data from server
    $.ajax({
        url: URLs.adminDashboard,
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'getAdminDetails',
            adminId: $('#userName').data('admin-id')
        },
        success: function(response) {
            if (response.status === 'success') {
                displayAdminProfileDetails(response.data);
            } else {
                alert('Error loading profile details: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("AJAX Error:", error);
            alert('An error occurred while loading profile details.');
        }
    });
}

// Function to approve a report
function approveReport(reportId) {
    if (!confirm('Are you sure you want to approve this report?')) {
        return;
    }

    $.ajax({
        url: URLs.reports,
        type: 'POST',
        data: {
            action: 'approveReport',
            reportId: reportId
        },
        success: function(response) {
            if (response.status === 'success') {
                alert('Report approved successfully!');
                // Refresh the reports list
                loadWeeklyReports();
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('An error occurred while approving the report.');
        }
    });
}

// Function to return a report
function returnReport(reportId) {
    currentReportId = reportId;
    const modal = document.getElementById('returnReportModal');
    const textarea = document.getElementById('returnReason');
    textarea.value = ''; // Clear previous input
    modal.style.display = 'block';
}

// Modal event handlers
$(document).ready(function() {
    const closeBtn = document.getElementById('closeReturnModal');
    const cancelBtn = document.getElementById('cancelReturn');
    const confirmBtn = document.getElementById('confirmReturn');

    if (closeBtn) closeBtn.onclick = closeReturnModal;
    if (cancelBtn) cancelBtn.onclick = closeReturnModal;
    if (confirmBtn) confirmBtn.onclick = submitReturnReport;
});

function closeReturnModal() {
    const modal = document.getElementById('returnReportModal');
    if (modal) {
        modal.style.display = 'none';
        $('#returnReason').val('');
        currentReportId = null;
    }
}

function submitReturnReport() {
    const reason = document.getElementById('returnReason').value.trim();
    if (!reason) {
        alert('Please provide a return reason');
        return;
    }

    if (!currentReportId) {
        alert('No report selected');
        return;
    }

    // Prevent duplicate submissions
    if (window.isSubmittingReturn) {
        return;
    }
    window.isSubmittingReturn = true;

    $.ajax({
        url: URLs.reports,
        type: 'POST',
        data: {
            action: 'returnReport',
            reportId: currentReportId,
            returnReason: reason
        },
        success: function(response) {
            window.isSubmittingReturn = false;
            if (response.status === 'success') {
                // First close the modal
                closeReturnModal();
                // Then show the alert
                alert('Report returned successfully! The student can now edit it.');
                
                // Reset any loading states
                isLoadingReports = false;
                window.isRefreshing = false;
                
                // Clear any existing timeouts
                if (window.refreshTimeout) clearTimeout(window.refreshTimeout);
                if (window.loadingTimeout) clearTimeout(window.loadingTimeout);
                if (window.reportsTimeout) clearTimeout(window.reportsTimeout);
                
                // Set flag to indicate this refresh is after a return
                window.isAfterReturn = true;
                
                // Then refresh the reports with current filters
                const studentId = $('#studentFilter').val();
                // Get the current week number from the preview
                const weekNumber = parseInt($('#previewWeekNumber').text());
                if (weekNumber) {
                    loadWeeklyReports(studentId, weekNumber);
                }
            } else {
                closeReturnModal();
                alert('Error: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            window.isSubmittingReturn = false;
            console.error('Error:', error);
            alert('An error occurred while returning the report.');
            closeReturnModal();
        }
    });
}

// Function to display admin profile details
function displayAdminProfileDetails(data) {
    // Check if profile picture exists
    const profilePicture = data.PROFILE ? `uploads/${data.PROFILE}` : null;
    
    const html = `
        <div class="profile-card">
            <div class="profile-header">
                <div class="profile-avatar">
                    ${profilePicture ? 
                        `<img src="${profilePicture}" alt="Profile Picture" class="profile-image">` :
                        `<div class="avatar-placeholder">
                            <i class="fas fa-user-shield"></i>
                         </div>`
                    }
                </div>
                <h2>${data.NAME}</h2>
                <p class="profile-subtitle">HTE Manager</p>
            </div>
            
            <div class="profile-details">
                <div class="detail-row">
                    <span class="detail-label">Manager ID:</span>
                    <span class="detail-value">${data.COORDINATOR_ID}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Full Name:</span>
                    <span class="detail-value">${data.NAME}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${data.EMAIL}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Contact Number:</span>
                    <span class="detail-value">${data.CONTACT_NUMBER}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Department:</span>
                    <span class="detail-value">${data.DEPARTMENT}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">HTE:</span>
                    <span class="detail-value">${data.HTE_NAME}</span>
                </div>
            </div>
            
            <div class="profile-actions">
                <button type="button" class="btn-edit">Edit Profile</button>
                <button type="button" class="btn-change-password">Change Password</button>
            </div>
        </div>
    `;
    
    $('#profileModalContent').html(html);
}

// Function to show Change Password modal
function showChangePasswordModal() {
    const passwordContent = `
        <div class="modal" id="changePasswordModal" style="display: flex;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Change Password</h2>
                    <button class="modal-close" id="closeChangePasswordModal">&times;</button>
                </div>
                <div class="modal-body">
<form id="changePasswordForm" class="change-password-form">
    <h3>Update Your Password</h3>
    <div class="form-group">
        <label for="currentPassword">Current Password:</label>
        <input type="password" id="currentPassword" name="currentPassword" required>
    </div>
    <div class="form-group">
        <label for="newPassword">New Password:</label>
        <input type="password" id="newPassword" name="newPassword" required>
    </div>
    <div class="form-group">
        <label for="confirmPassword">Confirm New Password:</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required>
    </div>
    <div class="form-actions">
        <button type="submit" class="btn-submit">Change Password</button>
        <button type="button" class="btn-cancel" id="closeChangePasswordModalCancel">Cancel</button>
    </div>
</form>
                </div>
            </div>
        </div>
    `;
    // Append modal to body
    $('body').append(passwordContent);

    // Close modal event
    $('#closeChangePasswordModal, #closeChangePasswordModalCancel').on('click', function() {
        $('#changePasswordModal').remove();
    });

    // Submit form event
    $('#changePasswordForm').on('submit', function(e) {
        e.preventDefault();
        const currentPassword = $('#currentPassword').val().trim();
        const newPassword = $('#newPassword').val().trim();
        const confirmPassword = $('#confirmPassword').val().trim();

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New password and confirmation do not match.');
            return;
        }

        // Send AJAX request to update password
        $.ajax({
            url: URLs.adminDashboard,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'updatePassword',
                adminId: $('#userName').data('admin-id'),
                currentPassword: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            },
            success: function(response) {
                if (response.status === 'success') {
                    alert('Password changed successfully.');
                    $('#changePasswordModal').remove();
                } else {
                    alert('Error changing password: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX Error:", error);
                alert('An error occurred while changing password.');
            }
        });
    });
}
