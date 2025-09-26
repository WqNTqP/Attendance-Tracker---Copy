// Function to manage shown notifications using sessionStorage
const notificationTracker = {
    getShown: function() {
        const shown = sessionStorage.getItem('shownNotifications');
        return shown ? new Set(JSON.parse(shown)) : new Set();
    },
    markAsShown: function(id) {
        const shown = this.getShown();
        shown.add(id);
        sessionStorage.setItem('shownNotifications', JSON.stringify([...shown]));
    },
    isShown: function(id) {
        return this.getShown().has(id);
    }
};

// Function to load notifications
function loadNotifications() {
    const studentId = $("#hiddenStudentId").val();
    
    if (!studentId) {
        console.error('No student ID found');
        return;
    }
    
    console.log('Loading notifications for student:', studentId);
    $.ajax({
        url: "ajaxhandler/getNotifications.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getNotifications",
            studentId: studentId
        },
        success: function(response) {
            console.log('Notifications response:', response);
            
            const $notificationDropdown = $("#notificationDropdown");
            // Only clear if this is not a refresh after marking as read
            if (!window.isMarkingAsRead) {
                $notificationDropdown.empty();
            }
            
            if (response.status === "success" && response.data && response.data.length > 0) {
                // Keep track of unread notifications
                let unreadCount = 0;
                let hasNewNotifications = false;
                
                // Show all notifications, but track unread count
                // Reverse so newest notifications are at the top
                response.data.slice().reverse().forEach(notification => {
                    // Count unread notifications
                    if (!notification.isRead) {
                        unreadCount++;
                    }
                    // Mark this notification as shown
                    notificationTracker.markAsShown(notification.id);
                    const formattedTime = notification.time || new Date().toLocaleTimeString('en-PH', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    // Show the notification
                    notificationSystem.show(
                        notification.title,
                        notification.message,
                        formattedTime,
                        notification.id,
                        notification.isRead
                    );
                });
                
                // Update badge only if there are actual unread notifications
                if (unreadCount > 0) {
                    $(".notification-badge").text(unreadCount).show();
                } else {
                    $(".notification-badge").hide();
                }
            } else {
                $notificationDropdown.html('<div class="no-notifications">No notifications</div>');
                $(".notification-badge").hide();
            }
        },
        error: function(xhr, status, error) {
            console.error("Error loading notifications:", error);
        }
    });
}

// Global Notification System
const notificationSystem = {
        init: function() {
            const $dropdown = $('#notificationDropdown');
            
            // Add initial no notifications message
            if ($dropdown.children().length === 0) {
                $dropdown.html('<div class="no-notifications">No notifications</div>');
            }
            
            $('#notificationIcon').on('click', function(e) {
                e.stopPropagation();
                $dropdown.toggleClass('show');
            });

            $(document).on('click', function(e) {
                if (!$(e.target).closest('#notificationIcon').length) {
                    $('#notificationDropdown').removeClass('show');
                }
            });
        },
        show: function(title, message, time = null, id = null, isRead = false) {
            const notificationDropdown = $('#notificationDropdown');
            const badge = $('.notification-badge');
            const timestamp = time || new Date().toLocaleTimeString('en-PH', {
                hour: '2-digit',
                minute: '2-digit'
            });

            // Remove 'No notifications' message if it exists
            notificationDropdown.find('.no-notifications').remove();

            // Create notification with proper message truncation
            const truncatedMessage = message.length > 100 ? message.substring(0, 100) + '...' : message;
            
            const notification = $(`
                <div class="notification-item ${isRead ? '' : 'unread'}" data-notification-id="${id}">
                    <div class="notification-title">
                        <i class="fas fa-bell-exclamation"></i>
                        ${title}
                    </div>
                    <div class="notification-message">${truncatedMessage}</div>
                    <div class="notification-time">
                        <i class="fas fa-clock"></i>
                        ${timestamp}
                    </div>
                </div>
            `);

            notificationDropdown.prepend(notification);

            // Update badge
            const unreadCount = $('.notification-item.unread').length;
            badge.text(unreadCount);
            badge.show();

            // Mark notification as read when clicked
            if (id) {
                notification.on('click', function() {
                    const $this = $(this);
                    const notificationId = $this.data('notification-id');
                    
                    console.log('Notification clicked:', notificationId); // Debug log
                    
                    // Set flag to prevent clearing notifications on refresh
                    window.isMarkingAsRead = true;
                    
                    // Proceed regardless of unread status to ensure it gets marked as read
                    $.ajax({
                        url: 'ajaxhandler/markNotificationRead.php',
                        type: 'POST',
                        data: { notificationId: notificationId },
                        success: function(response) {
                            console.log('Mark as read response:', response); // Debug log
                            
                            if (response.status === 'success') {
                                // Update visual state
                                $this.removeClass('unread');
                                
                                // Recalculate actual unread count
                                const newUnreadCount = $('.notification-item.unread').length;
                                
                                // Update badge
                                if (newUnreadCount > 0) {
                                    badge.text(newUnreadCount).show();
                                } else {
                                    badge.hide();
                                }
                            }
                            
                            // Reset flag after a short delay
                            setTimeout(function() {
                                window.isMarkingAsRead = false;
                            }, 100);
                        },
                        error: function(xhr, status, error) {
                            console.error('Error marking notification as read:', error);
                            console.error('Full error details:', xhr.responseText); // More detailed error
                            window.isMarkingAsRead = false; // Reset flag on error
                        }
                    });
                });
            }
        }
    };

$(function(e) {
    // Initialize dashboard
    // Disable Time In/Out buttons after 4:00pm
    var now = new Date();
    var currentHour = now.getHours();
    var currentMinute = now.getMinutes();
    if (currentHour > 16 || (currentHour === 8 && currentMinute >= 16)) {
        $("#timeInButton").prop('disabled', true);
        $("#timeOutButton").prop('disabled', true);
    }
    notificationSystem.init();
    
    // Initial load of notifications
    loadNotifications();
    
    // Only refresh notifications every minute to reduce server load
    setInterval(loadNotifications, 60000);
    
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
        const selectedFilter = $(this).val();
        loadAttendanceHistory();
        if (selectedFilter === 'all') {
            $("#yearFilter").show();
            $("#monthFilter").show();
            $("#clearFiltersBtn").show();
            loadAvailableYears();
            loadAvailableMonths();
        } else {
            $("#yearFilter").hide();
            $("#monthFilter").hide();
            $("#clearFiltersBtn").hide();
        }
    });

    // Clear filters button
    $("#clearFiltersBtn").click(function() {
        // Clear only year and month filters, keep "all" filter active
        $("#yearFilter").val('');
        $("#monthFilter").val('');

        // Clear current month to prevent auto-selection
        window.currentMonth = null;

        // Reload attendance history with cleared year/month but keep "all" filter
        loadAttendanceHistory();
    });

    // Year filter
    $("#yearFilter").change(function() {
        const selectedYear = $(this).val();
        loadAvailableMonths(selectedYear);
        if (window.currentMonth) {
            window.currentMonth.setFullYear(parseInt(selectedYear));
        }
        loadAttendanceHistory();
    });

    // Month filter
    $("#monthFilter").change(function() {
        const selectedMonth = $(this).val();
        if (selectedMonth) {
            // Month-only format: "MM" (1-12)
            const month = parseInt(selectedMonth);
            // Use the selected year from yearFilter, or current year if no year selected
            const selectedYear = $("#yearFilter").val() || new Date().getFullYear();
            window.currentMonth = new Date(parseInt(selectedYear), month - 1, 1);
        } else {
            // Clear label if no selection
        }
        loadAttendanceHistory();
    });



    // Update label on page load after months are loaded
    function updateMonthNavigationDisplay() {
        if (window.currentMonth === undefined) {
            window.currentMonth = new Date();
        }

        if (window.currentMonth) {
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const currentMonthName = monthNames[window.currentMonth.getMonth()];
            const currentYear = window.currentMonth.getFullYear();

            // Update the month display if there's an element for it
            if ($("#currentMonthDisplay").length > 0) {
                $("#currentMonthDisplay").text(`${currentMonthName} ${currentYear}`);
            }

            // Update the selected month label as well
            updateSelectedMonthLabel(window.currentMonth);
        }
    }

    // Function to update the selected month label in the dropdown
    function updateSelectedMonthLabel(currentMonth) {
        if (!currentMonth) {
            console.log("No current month provided to updateSelectedMonthLabel");
            return;
        }

        const monthFilter = $("#monthFilter");
        if (monthFilter.length === 0) {
            console.log("Month filter element not found");
            return;
        }

        // Get the month value (1-based)
        const monthValue = (currentMonth.getMonth() + 1).toString();

        // Set the selected value in the month filter dropdown
        monthFilter.val(monthValue);

        console.log(`Updated month filter to show month: ${monthValue} (${currentMonth.toLocaleString('default', { month: 'long' })})`);
    }

    function loadAvailableMonths(year) {
        console.log("loadAvailableMonths called with year:", year);
        const monthFilter = $("#monthFilter");
        console.log("Month filter element:", monthFilter);
        monthFilter.empty(); // Clear existing options

        // Add a default option
        monthFilter.append('<option value="">Select Month</option>');

        const currentYear = new Date().getFullYear();

        // Always show all 12 months regardless of current date or database records
        for (let month = 1; month <= 12; month++) {
            let monthValue, monthName;
            if (year) {
                // If year is selected, include year in value
                monthValue = `${year}-${month.toString().padStart(2, '0')}`;
                monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
                monthFilter.append(`<option value="${monthValue}">${monthName} ${year}</option>`);
            } else {
                // If no year selected, use month-only value
                monthValue = `${month.toString().padStart(2, '0')}`;
                monthName = new Date(currentYear, month - 1, 1).toLocaleString('default', { month: 'long' });
                monthFilter.append(`<option value="${monthValue}">${monthName}</option>`);
            }
        }

        console.log("Month filter options after population:", monthFilter.html());
        // Make sure the filter is visible
        monthFilter.show();

        // Set the current month as selected unconditionally to ensure dropdown shows current month
        if (window.currentMonth) {
            const year = window.currentMonth.getFullYear();
            const month = window.currentMonth.getMonth() + 1; // 1-based
            const monthValue = `${year}-${month.toString().padStart(2, '0')}`;
            monthFilter.val(monthValue);
            updateSelectedMonthLabel(window.currentMonth);
        }
    }



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

    // Initialize year filter on page load if history filter is 'all'
    if ($("#historyFilter").val() === 'all') {
        loadAvailableYears();
    }
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
            action: "getRecentReportStatus",
            studentId: studentId
        },
        success: function(response) {
            if (response.status === "success" && Array.isArray(response.data) && response.data.length > 0) {
                let html = `<div class=\"weekly-report-table-wrapper\"><table class=\"weekly-report-table\"><thead><tr><th>Week</th><th>Status</th><th>Submitted</th><th>Approved</th></tr></thead><tbody>`;
                response.data.forEach(report => {
                    const approvedClass = report.approved_at ? '' : 'na';
                    html += `
                        <tr class=\"weekly-report-row\">
                            <td>${report.week_start} to ${report.week_end}</td>
                            <td>${report.status} / ${report.approval_status}</td>
                            <td>${report.created_at || 'N/A'}</td>
                            <td class=\"weekly-report-approved ${approvedClass}\">${report.approved_at || 'N/A'}</td>
                        </tr>
                    `;
                });
                html += '</tbody></table></div>';
                $("#recentActivity").html(html);
            } else {
                $("#recentActivity").html('<p>No recent weekly report submissions found.</p>');
            }
        },
        error: function(xhr, status, error) {
            console.error("Error loading recent weekly report status:", error);
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

    // Unify logic: disable buttons and show message if time is 8:16am or later
    var now = new Date();
    var currentHour = now.getHours();
    var currentMinute = now.getMinutes();
    if ((currentHour === 8 && currentMinute > 15) || currentHour > 8) {
        $("#timeInButton").prop('disabled', true);
        $("#timeOutButton").prop('disabled', true);
        $("#attendanceStatusMessage").text("Attendance for today is closed").show();
    } else {
        $("#attendanceStatusMessage").text("").hide();
    // removed extra closing brace
    }

    if (data.TIMEIN) {
        $("#timeInDisplay").text(convertTo12HourFormat(data.TIMEIN));
        $("#timeInButton").prop('disabled', true);

        // Determine status based on TIMEIN
        const timeInParts = data.TIMEIN.split(":");
        const hours = parseInt(timeInParts[0]);
        const minutes = parseInt(timeInParts[1]);
        if (hours === 8 && minutes === 0) {
            $("#todayStatusBadge").text("On Time - Checked In").removeClass("pending").addClass("checked-in");
        } else if (hours === 8 && minutes >= 1 && minutes <= 15) {
            $("#todayStatusBadge").text("Late - Checked In").removeClass("pending").addClass("checked-in");
        } else if ((hours === 8 && minutes > 15) || hours > 8) {
            $("#todayStatusBadge").text("Attendance for today is closed").removeClass("pending").addClass("checked-in");
            $("#timeInButton").prop('disabled', true);
            $("#timeOutButton").prop('disabled', true);
        } else {
            $("#todayStatusBadge").text("On Time - Checked In").removeClass("pending").addClass("checked-in");
        }
    }
    if (data.TIMEOUT) {
        $("#timeOutDisplay").text(convertTo12HourFormat(data.TIMEOUT));
        $("#timeOutButton").prop('disabled', true);

        // Determine if on time or late based on TIMEIN for Present status
        const timeInParts = data.TIMEIN.split(':');
        const hours = parseInt(timeInParts[0]);
        const minutes = parseInt(timeInParts[1]);
        const isLate = hours > 8 || (hours === 8 && minutes > 0);

        if (isLate) {
            $("#todayStatusBadge").text("Late - Present").removeClass("checked-in").addClass("present");
        } else {
            $("#todayStatusBadge").text("On Time - Present").removeClass("checked-in").addClass("present");
        }
    }
}

// Helper function to convert 24-hour time string to 12-hour format with AM/PM
function convertTo12HourFormat(timeString) {
    if (!timeString || timeString === '--:--') return '--:--';

    const [hours, minutes, seconds] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert 0 to 12 for midnight

    return `${hour12}:${minutes} ${ampm}`;
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
    const selectedMonth = $("#monthFilter").val();
    let startDate, endDate;

    const currentDate = new Date();

    if (filter === 'all' && window.currentMonth) {
        // Use window.currentMonth for date range when navigating months
        startDate = new Date(window.currentMonth.getFullYear(), window.currentMonth.getMonth(), 1);
        endDate = new Date(window.currentMonth.getFullYear(), window.currentMonth.getMonth() + 1, 0);
    } else if (filter === 'week') {
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
    } else if (filter === 'lastweek') {
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - currentDate.getDay() - 6);
        endDate = new Date(currentDate);
        endDate.setDate(currentDate.getDate() - currentDate.getDay());
    } else if (filter === 'month') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    } else if (filter === 'lastmonth') {
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    } else if (filter === 'all' && selectedMonth) {
        // Month is now always in format "MM" (1-12), combine with selected year
        const month = parseInt(selectedMonth);
        const selectedYear = $("#yearFilter").val() || new Date().getFullYear();
        startDate = new Date(parseInt(selectedYear), month - 1, 1);
        endDate = new Date(parseInt(selectedYear), month, 0);
        // Set the monthFilter dropdown to show the selected month
        $("#monthFilter").val(selectedMonth);
    } else {
        // All time - use a very old date and future date
        const earliestYear = window.earliestAttendanceYear || 2000; // Fallback to 2000 if not set
        startDate = new Date(earliestYear, 0, 1);
        endDate = new Date(2100, 0, 1);
        // Reset the monthFilter dropdown to default
        $("#monthFilter").val('');
    }

    // Show/hide month filter based on filter
    if (filter === 'all') {
        $("#monthFilter").show();
        $("#attendanceHistoryArea").addClass("alltime-filter-active");
        loadAvailableMonths();
    } else {
        $("#monthFilter").hide();
        $("#attendanceHistoryArea").removeClass("alltime-filter-active");
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
                        <span class="filter-badge">${filter === 'week' ? 'This Week' : filter === 'lastweek' ? 'Last Week' : filter === 'month' ? 'This Month' : filter === 'lastmonth' ? 'Last Month' : 'All Time'}</span>
                    </div>
                `;
                
                if (response.data.length > 0) {
                    html += `<div class="history-cards">`;

                    response.data.forEach(record => {
                        // Check if this is a month header record
                        if (record.month_header) {
                            html += `
                                <div class="month-header">
                                    <h4>${record.month_header}</h4>
                                    <span class="record-count">${record.record_count} record${record.record_count !== 1 ? 's' : ''}</span>
                                </div>
                                <hr class="month-separator" />
                            `;
                            return; // Skip to next record
                        }

                        const recordDate = new Date(record.ON_DATE);
                        const formattedDate = recordDate.toLocaleDateString('en-PH', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        });
                        const formattedDay = recordDate.toLocaleDateString('en-PH', {
                            weekday: 'long'
                        });
                        const formattedTimeIn = record.TIMEIN ? formatTimeToPH(record.TIMEIN) : '--:--';
                        const formattedTimeOut = record.TIMEOUT ? formatTimeToPH(record.TIMEOUT) : '--:--';

                        // Handle status display with timing information
                        let statusDisplay = '';
                        let statusClass = '';
                        let statusIcon = '';

                        if (record.TIMEIN && record.TIMEOUT) {
                            // Determine if on time or late based on TIMEIN (On Time up to 08:00:59)
                            const timeInParts = record.TIMEIN.split(':');
                            const hours = parseInt(timeInParts[0]);
                            const minutes = parseInt(timeInParts[1]);
                            const seconds = parseInt(timeInParts[2]);
                            const isLate = hours > 8 || (hours === 8 && minutes > 0);

                            if (isLate) {
                                statusDisplay = '<span class="status-present-text">Present</span> <span class="status-timing status-late">Late</span>';
                                statusClass = 'status-present';
                                statusIcon = 'fa-check-circle';
                            } else {
                                statusDisplay = '<span class="status-present-text">Present</span> <span class="status-timing status-on-time">On Time</span>';
                                statusClass = 'status-present';
                                statusIcon = 'fa-check-circle';
                            }
                        } else if (record.TIMEIN) {
                            statusDisplay = '<span class="status-present-text">Checked In</span>';
                            statusClass = 'status-checked-in';
                            statusIcon = 'fa-clock';
                        }
                        // No status display for records with no attendance data

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
                                    <span>${statusDisplay}</span>
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

// Flag to track if report system has been initialized
let reportSystemInitialized = false;

// Weekly Report System Functions
function initializeReportSystem() {
    // Check if already initialized
    if (reportSystemInitialized) {
        loadCurrentWeekReport(); // Just refresh the report
        return;
    }
    
    reportSystemInitialized = true;
    
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

    // Hide the preview button since we now have auto-preview
    $("#previewReportBtn").hide();
}

// Global variables to store current report week dates
let currentReportWeekStart = null;
let currentReportWeekEnd = null;

function loadCurrentWeekReport() {
    const studentId = $("#hiddenStudentId").val();
    const selectedWeek = $("#reportWeek").val();
    
    // Clear old status
    $("#reportStatus").empty();
    $("#submittedReports").empty();
    
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

    // Clear existing content and force refresh of all days
    days.forEach(day => {
        $(`#imagePreview${capitalize(day)}`).empty();
        selectedFilesPerDay[day] = [];
        existingImagesPerDay[day] = [];
    });

    // Add auto-preview functionality
    function updatePreview() {
        // Populate day sections with images
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

            // Update description
            const description = $(`#${day}Description`).val().trim();
            $(`#draft${capitalize(day)}Description`).html(description ? description.replace(/\n/g, '<br>') : 'No description provided for this day');
        });

        // Show the report preview
        $("#reportDraft").show();
        $("#draftPreview").hide();
    }

    // Populate images and descriptions if they exist
    if (report) {
        // Populate descriptions for each day
        days.forEach(day => {
            // Load description if available
            const descriptionKey = day.toLowerCase() + '_description';  // Match the backend field name
            if (report[descriptionKey]) {
                $(`#${day}Description`).val(report[descriptionKey]);
            } else {
                $(`#${day}Description`).val('');
            }
        });

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

        // Populate weekly report fields
        $("#challengesFaced").val(report.challenges_faced || '');
        $("#lessonsLearned").val(report.lessons_learned || '');
        $("#goalsNextWeek").val(report.goals_next_week || '');
    } else {
        // Clear all fields if no report data
        days.forEach(day => {
            $(`#${day}Description`).val('');
            existingImagesPerDay[day] = [];
        });
        $("#challengesFaced").val('');
        $("#lessonsLearned").val('');
        $("#goalsNextWeek").val('');
    }

    // Update image counters for all days
    updateImageCounters();

                // Update buttons and fields based on report status and approval status
                if (report && report.status === 'submitted') {
                    let statusText = 'Report Submitted';
                    let submitText = 'Already Submitted';
                    
                    // Change button text based on approval status
                    if (report.approval_status) {
                        switch(report.approval_status) {
                            case 'pending':
                                statusText = 'Report Pending Review';
                                submitText = 'Waiting for Review';
                                // Clear return reason when resubmitting
                                $('#returnReasonContainer').empty();
                                break;
                            case 'approved':
                                statusText = 'Report Approved';
                                submitText = 'Report Approved';
                                // Clear return reason
                                $('#returnReasonContainer').empty();
                                break;
                            case 'returned':
                                statusText = 'Report Returned';
                                submitText = 'Returned for Revision';
                                break;
                        }
                    }        // Update button text to reflect current status
        $("#saveDraftBtn").prop('disabled', true).text(statusText);
        $("#submitReportBtn").prop('disabled', true).text(submitText);
        
        // Disable all textareas
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        days.forEach(day => {
            $(`#${day}Description`).prop('disabled', true);
            // Disable file upload inputs
            $(`#imageUpload${capitalize(day)}`).prop('disabled', true);
            // Disable drag and drop area
            $(`.upload-placeholder[data-day="${day}"]`).addClass('disabled');
        });
        
        // Disable additional weekly report fields if they exist
        $("#challengesFaced").prop('disabled', true);
        $("#lessonsLearned").prop('disabled', true);
        $("#goalsNextWeek").prop('disabled', true);
    } else {
        // Enable all buttons
        $("#saveDraftBtn").prop('disabled', false).text('Save Draft');
        $("#submitReportBtn").prop('disabled', false).text('Submit Report');
        
        // Enable all textareas
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        days.forEach(day => {
            $(`#${day}Description`).prop('disabled', false);
            // Enable file upload inputs
            $(`#imageUpload${capitalize(day)}`).prop('disabled', false);
            // Enable drag and drop area
            $(`.upload-placeholder[data-day="${day}"]`).removeClass('disabled');
        });
        
        // Enable additional weekly report fields if they exist
        $("#challengesFaced").prop('disabled', false);
        $("#lessonsLearned").prop('disabled', false);
        $("#goalsNextWeek").prop('disabled', false);
    }

    // Add event listeners for real-time preview updates
    days.forEach(day => {
        // Update preview when description changes
        $(`#${day}Description`).on('input', updatePreview);
        
        // Update preview when images change
        const observer = new MutationObserver(updatePreview);
        observer.observe($(`#imagePreview${capitalize(day)}`)[0], {
            childList: true,
            subtree: true
        });
    });

    // Initial preview update
    updatePreview();
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
    // Check if report is submitted - check both at creation time and get latest status
    const isSubmitted = $("#saveDraftBtn").prop('disabled') && $("#saveDraftBtn").text() === 'Report Submitted';
    
    const previewItem = $(`  
        <div class="image-preview-item" data-filename="${filename}">  
            <img src="${dataUrl}" alt="Preview">  
            ${!isSubmitted ? `
                <button type="button" class="remove-image" data-filename="${filename}">  
                    <i class="fas fa-times"></i>  
                </button>  
            ` : ''}
        </div>  
    `);  
  
    $(`#imagePreview${capitalize(day)}`).append(previewItem);  
  
    // Add remove functionality only if report is not submitted
    if (!isSubmitted) {
        previewItem.find('.remove-image').click(function() {  
            // Double-check submission status at time of click to prevent any edit attempts
            const isCurrentlySubmitted = $("#saveDraftBtn").prop('disabled') && $("#saveDraftBtn").text() === 'Report Submitted';
            if (isCurrentlySubmitted) {
                // If the report is now submitted, remove the button entirely and prevent any changes
                $(this).remove();
                return;
            }
            
            const filenameToRemove = $(this).data('filename');  
            // Remove from appropriate array
            if (existingImagesPerDay[day].includes(filenameToRemove)) {  
                existingImagesPerDay[day] = existingImagesPerDay[day].filter(filename => filename !== filenameToRemove);  
            } else {  
                selectedFilesPerDay[day] = selectedFilesPerDay[day].filter(file => file.name !== filenameToRemove);  
            }  
            // Remove preview item  
            $(this).closest('.image-preview-item').remove();  
            updateImageCounters();  
            // Update placeholder visibility  
            const uploadPlaceholder = $(`#uploadPlaceholder${capitalize(day)}`);  
            const imageCount = $(`#imagePreview${capitalize(day)} .image-preview-item`).length;  
            uploadPlaceholder.css('display', imageCount > 0 ? 'none' : 'block');
        });  
    }
  
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

    // Check if report is submitted
    const isSubmitted = $("#saveDraftBtn").prop('disabled') && $("#saveDraftBtn").text() === 'Report Submitted';

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

    // Update submit button state based on total image count and submission status
    const submitBtn = $("#submitReportBtn");
    if (isSubmitted) {
        submitBtn.prop('disabled', true);
        submitBtn.attr('title', 'Report already submitted');
    } else if (totalImages >= 5) {
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
                    ${typeof report.content === 'string' ?
                        report.content.substring(0, 150) + (report.content.length > 150 ? '...' : '')
                        : ''}
                </div>
${report.images && report.images.length > 0 ? `
                <div class="report-images-preview">
                    ${report.images.slice(0, 3).map(image => `
                        <img src="uploads/${image.filename}" alt="Report image" class="report-image-thumb" onerror="this.onerror=null;this.src='icon/nobglogo.ico';">
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
        $("#returnReasonContainer").empty();
        return;
    }
    
    let statusHtml = '';
    let returnReasonHtml = '';
    
    if (report.status === 'draft' && report.approval_status === 'returned') {
        // Report was returned by admin
        statusHtml = '<div class="report-status warning">Report was returned for revision</div>';
        returnReasonHtml = `
            <div class="return-reason-notice">
                <h4><i class="fas fa-exclamation-circle"></i> Return Reason:</h4>
                <p>${report.return_reason || 'No reason provided'}</p>
            </div>
        `;
    } else if (report.status === 'draft') {
        const lastSaved = new Date(report.updated_at);
        const formattedTime = lastSaved.toLocaleTimeString('en-PH', {
            hour: '2-digit', minute: '2-digit'
        });
        statusHtml = `<div class="report-status info">Draft last saved at ${formattedTime}</div>`;
    } else if (report.status === 'submitted') {
        const submittedDate = new Date(report.submitted_at || report.updated_at);
        const formattedDate = submittedDate.toLocaleDateString('en-PH', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        
        let statusClass, statusText;
        
        // Show approval status for submitted reports
        switch(report.approval_status) {
            case 'pending':
                statusClass = 'warning';
                statusText = 'Pending Review';
                break;
            case 'approved':
                statusClass = 'success';
                statusText = 'Approved';
                break;
            case 'returned':
                statusClass = 'warning';
                statusText = 'Returned for Revision';
                break;
            default:
                statusClass = 'info';
                statusText = 'Submitted';
        }
        
        statusHtml = `<div class="report-status ${statusClass}">
            Report submitted on ${formattedDate}<br>
            <strong>Status: ${statusText}</strong>
        </div>`;
    }
    
    $("#reportStatus").html(statusHtml);
    $("#returnReasonContainer").html(returnReasonHtml);
}

function setupImageUpload() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    days.forEach(day => {
        const uploadPlaceholder = $(`#uploadPlaceholder${capitalize(day)}`);
        const fileInput = $(`#imageUpload${capitalize(day)}`);
        const browseButton = $(`#browseImagesBtn${capitalize(day)}`);

        // Check if report is submitted
        const isSubmitted = $("#saveDraftBtn").prop('disabled') && $("#saveDraftBtn").text() === 'Report Submitted';

        // If report is submitted, disable all upload functionality and return early
        if (isSubmitted) {
            uploadPlaceholder.addClass('disabled').css('pointer-events', 'none');
            fileInput.prop('disabled', true);
            if (browseButton.length) browseButton.prop('disabled', true);
            return;
        }

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

        if (file.size > 5 * 1024 * 1024) // 5MB limit
        {
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

    // Collect daily descriptions
    const mondayDescription = $("#mondayDescription").val().trim();
    const tuesdayDescription = $("#tuesdayDescription").val().trim();
    const wednesdayDescription = $("#wednesdayDescription").val().trim();
    const thursdayDescription = $("#thursdayDescription").val().trim();
    const fridayDescription = $("#fridayDescription").val().trim();

    // Prepare FormData
    const formData = new FormData();
    formData.append('action', 'saveReportDraft');
    formData.append('studentId', studentId);
    formData.append('week', week);
    formData.append('mondayDescription', mondayDescription);
    formData.append('tuesdayDescription', tuesdayDescription);
    formData.append('wednesdayDescription', wednesdayDescription);
    formData.append('thursdayDescription', thursdayDescription);
    formData.append('fridayDescription', fridayDescription);

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

    // Collect daily descriptions
    const mondayDescription = $("#mondayDescription").val().trim();
    const tuesdayDescription = $("#tuesdayDescription").val().trim();
    const wednesdayDescription = $("#wednesdayDescription").val().trim();
    const thursdayDescription = $("#thursdayDescription").val().trim();
    const fridayDescription = $("#fridayDescription").val().trim();

    if (confirm('Are you sure you want to submit this report? Once submitted, you cannot edit it.')) {
        const formData = new FormData();
        formData.append('action', 'submitFinalReport');
        formData.append('studentId', studentId);
        formData.append('week', week);
        formData.append('mondayDescription', mondayDescription);
        formData.append('tuesdayDescription', tuesdayDescription);
        formData.append('wednesdayDescription', wednesdayDescription);
        formData.append('thursdayDescription', thursdayDescription);
        formData.append('fridayDescription', fridayDescription);

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
        
        // Clear any existing return reason message
        $('#returnReasonContainer').empty();

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



function loadAvailableYears() {
    const yearFilter = $("#yearFilter");
    yearFilter.empty(); // Clear existing options

    // Add a default option
    yearFilter.append('<option value="">Select Year</option>');

    // Fetch the earliest year from the database
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getEarliestAttendanceYear"
        },
        success: function(response) {
            if (response.status === "success") {
                window.earliestAttendanceYear = parseInt(response.data.earliest_year);
                const currentYear = new Date().getFullYear();

                // Generate years from current year back to the earliest year
                for (let year = currentYear; year >= window.earliestAttendanceYear; year--) {
                    yearFilter.append(`<option value="${year}">${year}</option>`);
                }
            } else {
                console.error("Error fetching earliest attendance year:", response.message);
                // Fallback to current year only if API fails
                const currentYear = new Date().getFullYear();
                window.earliestAttendanceYear = currentYear;
                yearFilter.append(`<option value="${currentYear}">${currentYear}</option>`);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error fetching earliest attendance year:", error);
            // Fallback to current year only if AJAX fails
            const currentYear = new Date().getFullYear();
            window.earliestAttendanceYear = currentYear;
            yearFilter.append(`<option value="${currentYear}">${currentYear}</option>`);
        }
    });
}

function loadAvailableMonths(year) {
    console.log("loadAvailableMonths called with year:", year);
    const monthFilter = $("#monthFilter");
    console.log("Month filter element:", monthFilter);
    monthFilter.empty(); // Clear existing options

    // Add a default option
    monthFilter.append('<option value="">Select Month</option>');

    // Always show all 12 months regardless of current date or database records
    for (let month = 1; month <= 12; month++) {
        // Use month-only value (1-12) regardless of year selection
        const monthValue = month.toString();
        const monthName = new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
        monthFilter.append(`<option value="${monthValue}">${monthName}</option>`);
    }

    console.log("Month filter options after population:", monthFilter.html());
    // Make sure the filter is visible
    monthFilter.show();

    // Set the current month as selected unconditionally to ensure dropdown shows current month
    if (window.currentMonth) {
        const month = window.currentMonth.getMonth() + 1; // 1-based
        monthFilter.val(month.toString());
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

    // Populate daily descriptions next to each day's images
    days.forEach(day => {
        const description = $(`#${day}Description`).val().trim();
        $(`#draft${capitalize(day)}Description`).html(description ? description.replace(/\n/g, '<br>') : 'No description provided for this day');
    });

    // Update report status in preview
    const report = getCurrentReport();
    let statusClass = 'info';
    let statusText = 'Draft';
    
    if (report && report.status === 'submitted') {
        switch(report.approval_status) {
            case 'pending':
                statusClass = 'warning';
                statusText = 'Pending Review';
                break;
            case 'approved':
                statusClass = 'success';
                statusText = 'Approved';
                break;
            case 'returned':
                statusClass = 'warning';
                statusText = 'Returned for Revision';
                break;
            default:
                statusClass = 'info';
                statusText = 'Submitted';
        }
    }
    
    // Update the status display in preview
    $('#reportStatus').html(`<div class="report-status ${statusClass}">${statusText}</div>`);

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


