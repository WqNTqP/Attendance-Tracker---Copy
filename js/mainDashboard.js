let currentHteId;
let currentSessionId;

// --- Post-Analysis Student List Logic ---
let allPostAnalysisStudents = [];
// Handle student selection in Post-Analysis tab
$(document).on('click', '.postanalysis-student-item', function() {
    // Remove selection from all, add to clicked
    $('.postanalysis-student-item').removeClass('selected');
    $(this).addClass('selected');
    // Get student name and IDs
    const internsId = $(this).data('studentid');
    const student = allPostAnalysisStudents.find(s => s.INTERNS_ID == internsId);
    let displayName = student ? (student.NAME + ' ' + student.SURNAME) : '';
    // Use STUDENT_ID for API call
    const studentId = student && student.STUDENT_ID ? student.STUDENT_ID : internsId;
    // Show loading message
    $('#postAnalysisContentArea').html('<div class="loading">Loading post-analysis...</div>');

    // Fetch post-analysis data from Flask API
    const postAnalysisUrl = 'http://localhost:5000/post_analysis';
    // Add conlog for table and student id
    const tableName = 'pre_assessment';
    console.log(`[Post-Analysis] Table selected: ${tableName}, student_id:`, studentId);
    console.log('Requesting post-analysis from:', postAnalysisUrl, 'with student_id:', studentId);
    $.ajax({
        url: postAnalysisUrl,
        type: 'GET',
        data: { student_id: studentId },
        dataType: 'json',
        success: function(data) {
            // Build HTML for post-analysis (modern card layout)
            let html = '';
            html += `<div class="postanalysis-summary-card modern-card">`;
            html += `<div class="postanalysis-section-header"><span class="postanalysis-icon">🔮</span> Predicted Placement</div>`;
            html += `<div class="predicted-placement-badge">${data.placement || '-'}</div>`;
            html += `<div class="prediction-reasoning"><b>Reasoning:</b> ${data.reasoning ? data.reasoning.replace(/\n/g, '<br>') : '-'}</div>`;
            html += `</div>`;


            // Post-Assessment Averages Table

            // Post-Assessment Averages Table
            if (data.post_assessment_averages && data.post_assessment_averages.length) {
                html += `<div class="postanalysis-averages-table modern-card">`;
                html += `<div class="postanalysis-section-header"><span class="postanalysis-icon">📊</span> Post-Assessment Averages</div>`;
                html += `<table><thead><tr><th>Category</th><th>Supervisor Avg</th><th>Self Avg</th></tr></thead><tbody>`;
                data.post_assessment_averages.forEach(function(row) {
                    html += `<tr><td>${row.category}</td><td>${row.supervisor_avg !== null ? row.supervisor_avg : '-'}<\/td><td>${row.self_avg !== null ? row.self_avg : '-'}<\/td><\/tr>`;
                });
                html += `</tbody></table></div>`;
            }

            // Supervisor Comment (Comment/Recommendation) - now after averages
            if (data.supervisor_comment) {
                html += `<div class="postanalysis-supervisor-comment modern-card">
                    <div class="postanalysis-section-header"><span class="postanalysis-icon">🗨️</span> Comment/Recommendation</div>
                    <div class="postanalysis-section-body supervisor-comment-body">${data.supervisor_comment.replace(/\n/g, '<br>')}</div>
                </div>`;
            }

            // Comparative Analysis
            if (data.comparative_analysis) {
                html += `<div class="postanalysis-comparative modern-card">
                    <div class="postanalysis-section-header"><span class="postanalysis-icon">⚖️</span> Comparative Analysis</div>
                    <div class="postanalysis-section-body">${data.comparative_analysis.replace(/\n/g, '<br>')}</div>
                </div>`;
            }
            // Strengths Identified in Post-Assessment (now after Comparative Analysis)
            if (data.strengths_post_assessment) {
                html += `<div class="postanalysis-strengths modern-card">
                    <div class="postanalysis-section-header"><span class="postanalysis-icon">🏅</span> Strengths Identified in Post-Assessment</div>
                    <div class="postanalysis-section-body">${data.strengths_post_assessment}</div>
                </div>`;
            }

            // Correlation Analysis

            if (data.correlation_analysis) {
                html += `<div class="postanalysis-correlation modern-card">
                    <div class="postanalysis-section-header"><span class="postanalysis-icon">🔗</span> Correlation Analysis</div>
                    <div class="postanalysis-section-body">${data.correlation_analysis.replace(/\n/g, '<br>')}</div>
                </div>`;
            }

            // Conclusion & Recommendation
            if (data.conclusion_recommendation) {
                // Enhanced layout for job recommendations
                let recHtml = data.conclusion_recommendation.replace(/\n/g, '<br>');
                // Try to extract job recommendations and highlight them
                const jobMatch = recHtml.match(/jobs? like <b>(.*?)<\/b>|jobs? in <b>(.*?)<\/b>|jobs? like <b>(.*?)<\/b> or <b>(.*?)<\/b>/i);
                if (jobMatch) {
                    // Find all job lists in the match
                    let jobs = [];
                    if (jobMatch[1]) jobs = jobMatch[1].split(',').map(j => j.trim());
                    if (jobMatch[2]) jobs = jobMatch[2].split(',').map(j => j.trim());
                    if (jobMatch[3] && jobMatch[4]) jobs = [...jobMatch[3].split(','), ...jobMatch[4].split(',')].map(j => j.trim());
                    // Remove duplicates
                    jobs = [...new Set(jobs)];
                    // Remove empty
                    jobs = jobs.filter(j => j.length > 0);
                    // Remove the jobs text from the summary
                    recHtml = recHtml.replace(/(jobs? like <b>.*?<\/b> (would likely be a great fit\.|are both good options\.)|jobs? in <b>.*?<\/b> (would likely be a great fit\.|are both good options\.))/gi, '').replace(/\s+/g, ' ').trim();
                    // Build job badges
                    let jobsHtml = jobs.length ? `<div class="job-recommendation-label">Recommended Jobs:</div><div class="job-badges">${jobs.map(j => `<span class="job-badge">${j}</span>`).join('')}</div>` : '';
                    recHtml += jobsHtml;
                }
                html += `<div class="postanalysis-insights modern-card"><div class="postanalysis-section-header"><span class="postanalysis-icon">💡</span> Conclusion &amp; Recommendation</div><div class="postanalysis-section-body">${recHtml}</div></div>`;
            }

            // View Details Button
            html += `<div style="margin-top:1.5em;text-align:right;"><button class="btn-view-details" onclick="document.getElementById('postAssessmentTabBtn').click();">View Full Post-Assessment Details</button></div>`;

            $('#postAnalysisContentArea').html(html);
        },
        error: function(xhr, status, error) {
            let backendMsg = '';
            try {
                backendMsg = xhr.responseText ? JSON.parse(xhr.responseText).error : '';
            } catch (e) {
                backendMsg = xhr.responseText;
            }
            console.error('Post-analysis AJAX error:', {
                status: xhr.status,
                error: error,
                backendMsg: backendMsg
            });
            if (xhr.status === 404) {
                $('#postAnalysisContentArea').html('<div class="postanalysis-message">No post-analysis data found for this student.</div>');
            } else {
                $('#postAnalysisContentArea').html('<div class="postanalysis-message">Unable to load post-analysis data.</div>');
            }
        }
    });
});

function loadPostAnalysisStudents() {
    $.ajax({
        url: 'ajaxhandler/coordinatorPostAnalysisAjax.php',
        type: 'POST',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.students) {
                allPostAnalysisStudents = response.students;
                renderPostAnalysisStudentList(allPostAnalysisStudents);
            } else {
                allPostAnalysisStudents = [];
                $('#postAnalysisStudentListPanel').html('<div class="no-students">No students found for post-analysis.</div>');
            }
        },
        error: function() {
            allPostAnalysisStudents = [];
            $('#postAnalysisStudentListPanel').html('<div class="no-students">Error loading students.</div>');
        }
    });
}

function renderPostAnalysisStudentList(students) {
    let html = '';
    students.forEach(function(student) {
        const displayName = student.NAME + ' ' + student.SURNAME;
        html += `<div class="postanalysis-student-item" data-studentid="${student.INTERNS_ID}">${displayName}</div>`;
    });
    $('#postAnalysisStudentListPanel').html(html);
}

$(document).on('input', '#postAnalysisStudentSearch', function() {
    const query = $(this).val().trim().toLowerCase();
    let filtered = allPostAnalysisStudents.filter(s => {
        const displayName = (s.NAME + ' ' + s.SURNAME).toLowerCase();
        return displayName.includes(query);
    });
    renderPostAnalysisStudentList(filtered);
});

$(document).on('click', '#postAnalysisTab', function() {
    loadPostAnalysisStudents();
});
$(document).ready(function() {
    if ($('#postAnalysisContent').is(':visible')) {
        loadPostAnalysisStudents();
    }
});

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
    // Add a message element for no matches in rateEvalList
    if ($('#rateEvalList .no-match-message').length === 0) {
        $('#rateEvalList').append('<div class="no-match-message" style="display:none; text-align:center; color:#a0aec0; font-size:1.2em; margin-top:2em;">No record for this student</div>');
    }
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
        // Show/hide no match message
        if (!foundMatch && query.length > 0) {
            $('#rateEvalList .no-match-message').show();
        } else {
            $('#rateEvalList .no-match-message').hide();
        }
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
    // --- Post-Assessment Student List Logic ---
    let allPostStudents = [];
    let selectedPostStudentId = null;

    function renderPostStudentList(students) {
        let sorted = students.slice().sort((a, b) => (a.NAME + ' ' + a.SURNAME).localeCompare(b.NAME + ' ' + b.SURNAME));
        let html = '';
        sorted.forEach(function(student) {
            const displayName = student.NAME + ' ' + student.SURNAME;
            html += `<div class="postassessment-student-item${student.INTERNS_ID === selectedPostStudentId ? ' selected' : ''}" data-studentid="${student.INTERNS_ID}">${displayName}</div>`;
        });
        $('#postStudentListPanel').html(html);
    }

    // Populate post-assessment student list when tab is activated
    // Load post-assessment students for coordinator
    function loadPostAssessmentStudents() {
        $.ajax({
            url: 'ajaxhandler/coordinatorPostAssessmentAjax.php',
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                if (response.success && response.students) {
                    allPostStudents = response.students;
                    renderPostStudentList(allPostStudents);
                } else {
                    allPostStudents = [];
                    $('#postStudentListPanel').html('<div class="no-students">No students found for post-assessment.</div>');
                }
            },
            error: function(xhr, status, error) {
                allPostStudents = [];
                $('#postStudentListPanel').html('<div class="no-students">Error loading students.</div>');
            }
        });
    }

    $(document).on('click', '#postAssessmentTabBtn', function() {
        loadPostAssessmentStudents();
    });

    // Also populate on page load if tab is visible
    $(document).ready(function() {
        if ($('#postAssessmentTabContent').is(':visible')) {
            loadPostAssessmentStudents();
        }
    });

    // Search filter for post-assessment student list
    $(document).on('input', '#postStudentSearch', function() {
        const query = $(this).val().trim().toLowerCase();
        let filtered = allPostStudents.filter(s => {
            const displayName = (s.NAME + ' ' + s.SURNAME).toLowerCase();
            return displayName.includes(query);
        });
        renderPostStudentList(filtered);
    });

    // Handle student selection in Post-Assessment tab
    $(document).on('click', '.postassessment-student-item', function() {
    $('.postassessment-student-item').removeClass('selected');
    $(this).addClass('selected');
    selectedPostStudentId = $(this).data('studentid');
    loadPostAssessmentEvaluation(selectedPostStudentId);
// Load and display post-assessment evaluation for selected student
function loadPostAssessmentEvaluation(studentId) {
    // Show loading indicator (optional)
    $('#postEvalList').html('<div class="loading">Loading evaluation...</div>');
    $.ajax({
        url: 'ajaxhandler/coordinatorPostAssessmentAjax.php',
        type: 'POST',
        dataType: 'json',
        data: {
            action: 'getStudentPostAssessment',
            interns_id: studentId
        },
        success: function(response) {
            if (response.success) {
                if (response.hasSupervisorRating && response.records.length > 0) {
                    // Group records by category
                    const grouped = {};
                    response.records.forEach(function(rec) {
                        if (!grouped[rec.category]) grouped[rec.category] = [];
                        grouped[rec.category].push(rec);
                    });
                    let html = '<h3>Post-Evaluation</h3>';
                    Object.keys(grouped).forEach(function(category) {
                        html += `<h4 class="post-eval-category-header">${category}</h4>`;
                        // Ratings table
                        html += '<table class="table post-eval-table"><thead><tr><th>Disciplines/Task</th><th>Self Rating</th><th>Supervisor Rating</th></tr></thead><tbody>';
                        grouped[category].forEach(function(rec) {
                            html += `<tr><td>${rec.question_text ?? rec.question_id}</td><td>${rec.self_rating ?? ''}</td><td>${rec.supervisor_rating ?? ''}</td></tr>`;
                        });
                        html += '</tbody></table>';
                    });
                    // Show the comment only once below all tables
                    const firstComment = response.records.find(rec => rec.comment && rec.comment.trim() !== '');
                    if (firstComment) {
                        html += '<table class="table post-eval-comments-table" style="margin-top:10px"><thead><tr><th>Comment/Recommendation</th></tr></thead><tbody>';
                        html += `<tr><td>${firstComment.comment}</td></tr>`;
                        html += '</tbody></table>';
                    }
                    $('#postEvalList').html(html);
                } else {
                    $('#postEvalList').html('<div class="no-eval">Not rated yet by supervisor.</div>');
                }
            } else {
                $('#postEvalList').html('<div class="no-eval">No evaluation data found.</div>');
            }
        },
        error: function() {
            $('#postEvalList').html('<div class="no-eval">Error loading evaluation.</div>');
        }
    });
}
    });
    // Evaluation tab bar navigation
    $('.evaluation-tab-img').click(function() {
        // Remove active class from all tab buttons
        $('.evaluation-tab-img').removeClass('active');
        $(this).addClass('active');

        // Hide all evaluation tab contents
        $('.evaluation-inner-content').hide();

        // Show the selected tab content
        if (this.id === 'evalQuestionsTabBtn') {
            $('#evalQuestionsTabContent').show();
        } else if (this.id === 'rateTabBtn') {
            $('#rateTabContent').show();
        } else if (this.id === 'postAssessmentTabBtn') {
            $('#postAssessmentTabContent').show();
        } else if (this.id === 'reviewTabBtn') {
            $('#reviewTabContent').show();
        } else if (this.id === 'statsTabBtn') {
            $('#statsTabContent').show();
        }
    });

    // Show default tab on page load
    $('#evalQuestionsTabContent').show();
    $('#rateTabContent, #postAssessmentTabContent, #reviewTabContent, #statsTabContent').hide();
    // --- Prediction Tab Logic ---
    // Load students for prediction tab on tab switch or page load
    function loadPredictionStudents() {
        $('#predictionSpinner').show();
        $.ajax({
            url: 'ajaxhandler/predictionAjax.php',
            type: 'POST',
            dataType: 'json',
            success: function(response) {
                $('#predictionSpinner').hide();
                if (!response.success) {
                    alert('Error: ' + response.error);
                    return;
                }
                let students = response.students;
                let tbody = '';
                students.forEach(function(student, idx) {
                    let statusIcon = student.valid ? '<span style="color:green;">✔️</span>' : '<span style="color:red;" title="Missing: ' + student.missing.join(', ') + '">❌</span>';
                    let statusText = student.STATUS + ' ' + statusIcon;
                    let hasPrediction = student.pre_assessment && student.pre_assessment.ojt_placement;
                    let placementText = hasPrediction ? student.pre_assessment.ojt_placement : (student.valid ? '<span style="color:gray;">Ready</span>' : '<span style="color:gray;">Incomplete Data</span>');
                    let analysisData = {};
                    if (hasPrediction) {
                        analysisData = {
                            placement: student.pre_assessment.ojt_placement,
                            reasoning: student.pre_assessment.prediction_reasoning,
                            probabilities: student.pre_assessment.prediction_probabilities ? JSON.parse(student.pre_assessment.prediction_probabilities) : {},
                            confidence: student.pre_assessment.prediction_confidence
                        };
                    }
                    tbody += '<tr data-row="' + idx + '">' +
                        '<td>' + student.NAME + '</td>' +
                        '<td>' + student.HTE_ASSIGNED + '</td>' +
                        '<td>' + statusText + '</td>' +
                        '<td class="predicted-placement">' + placementText + '</td>' +
                        '<td><button class="analysis-btn" style="background-color:' + (hasPrediction ? 'green' : 'gray') + ';color:white;" data-analysis="' + encodeURIComponent(JSON.stringify(analysisData)) + '">Analysis</button></td>' +
                    '</tr>';
                });
                $('#predictionTable tbody').html(tbody);
                // Store students for later prediction
                window.predictionStudents = students;
            },
            error: function() {
                $('#predictionSpinner').hide();
                alert('Failed to fetch students for prediction.');
            }
        });
    }

    // Load students when prediction tab is shown
    $(document).on('click', '#predictionTab', function() {
        loadPredictionStudents();
    });
    // Also load on page ready if prediction tab is default
    $(document).ready(function() {
        if ($('#predictionContent').hasClass('active')) {
            loadPredictionStudents();
        }
    });

    // Run prediction only updates placement columns
    $(document).on('click', '#runPredictionBtn', function() {
        if (!window.predictionStudents) return;
        $('#predictionSpinner').show();
        window.predictionStudents.forEach(function(student, idx) {
            if (student.valid) {
                $.ajax({
                    url: 'http://localhost:5000/predict',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(student.pre_assessment),
                    success: function(mlres) {
                        let predicted = mlres.placement;
                        let row = $('#predictionTable tbody tr[data-row="' + idx + '"]');
                        row.find('.predicted-placement').text(predicted);
                        // Store analysis data for modal (set as URI-encoded string for compatibility)
                        row.find('.analysis-btn').attr('data-analysis', encodeURIComponent(JSON.stringify(mlres)));
                        row.find('.analysis-btn').css({'background-color':'green','color':'white'});

                        // Save prediction and analysis to DB
                        $.ajax({
                            url: 'ajaxhandler/predictionAjax.php',
                            type: 'POST',
                            data: {
                                action: 'savePrediction',
                                student_id: student.STUDENT_ID,
                                ojt_placement: mlres.placement,
                                prediction_reasoning: mlres.reasoning,
                                prediction_probabilities: JSON.stringify(mlres.probabilities),
                                prediction_confidence: mlres.confidence
                            },
                            success: function(resp) {
                                // Optionally handle success
                            }
                        });
                    },
                    error: function() {
                        let row = $('#predictionTable tbody tr[data-row="' + idx + '"]');
                        row.find('.predicted-placement').html('<span style="color:red;">ML Error</span>');
                        row.find('.analysis-btn').data('analysis', {error: 'ML Error'});
                        row.find('.analysis-btn').css({'background-color':'gray','color':'white'});
                    }
                });
            } else {
                let row = $('#predictionTable tbody tr[data-row="' + idx + '"]');
                row.find('.predicted-placement').html('<span style="color:gray;">Incomplete Data</span>');
                row.find('.analysis-btn').data('analysis', {error: 'Incomplete Data'});
                row.find('.analysis-btn').css({'background-color':'gray','color':'white'});
            }
        });
        $('#predictionSpinner').hide();
    });

    // Show analysis modal when Analysis button is clicked
    $(document).on('click', '.analysis-btn', function() {
        let analysisRaw = $(this).attr('data-analysis');
        let analysis = {};
        try {
            analysis = analysisRaw ? JSON.parse(decodeURIComponent(analysisRaw)) : {};
        } catch (e) {
            analysis = {};
        }
        let html = '';
        if (!analysis || analysis.error) {
                html = '<p>' + (analysis && analysis.error ? analysis.error : 'No analysis available.') + '</p>';
        } else {
                // Highlight grades in reasoning text
                function highlightGrades(text) {
                    return text.replace(/([A-Z]{2,} \d{3}: \d{1,3}\.\d+)/g, '<span class="subject-list">$1</span>');
                }
                // Only show the first reasoning line if subjects is not empty
                let reasoningLine = '';
                if (analysis.subjects && analysis.subjects.trim() !== '') {
                    reasoningLine = `<p>Recommended for <span class="highlight">${analysis.placement}</span> due to strong performance in: <span class="subject-list">${analysis.subjects}</span>.</p>`;
                }
                html = `<div class="prediction-card">
                    <h3 class="prediction-title">
                        Predicted OJT Placement:
                        <span class="prediction-badge">${analysis.placement}</span>
                    </h3>
                    <div class="prediction-reasoning">
                        <b>Reasoning:</b>
                        ${reasoningLine}
                        <p>
                            ${highlightGrades((analysis.reasoning || '').replace(/\s*\(average: [^)]+\)/g, ''))}
                        </p>
                    </div>
                    <div class="prediction-probability">
                        <b>Probability Explanation:</b>
                        <p>
                            The model is <span class="confidence-high">${analysis.confidence || ''}</span> that <span class="highlight">${analysis.placement}</span> is the best placement for this student. ${analysis.prob_explanation || ''}
                        </p>
                    </div>
                    <div class="probability-bars">
                        ${Object.entries(analysis.probabilities).map(([k, v]) => {
                                let color = '#3867d6';
                                if (k === 'Systems Development') color = '#20bf6b';
                                else if (k === 'Business Operations') color = '#f7b731';
                                else if (k === 'OJT Placement') color = '#eb3b5a';
                                else if (k === 'Research') color = '#3867d6';
                                return `<div class="probability-row"><span>${k}</span><div class="bar" style="width:${v}%;background:${color};"></div><span>${v}%</span></div>`;
                        }).join('')}
                    </div>
                </div>`;
        }
    if ($('#analysisModal').length === 0) {
        $('body').append('<div id="analysisModal" class="main-dashboard-modal-bg" style="display:none;"><div class="main-dashboard-modal-content"><div class="main-dashboard-modal-header"><h2 class="main-dashboard-modal-title">Prediction Analysis</h2><button class="main-dashboard-modal-close" id="closeAnalysisModal"><i class="fas fa-times"></i></button></div><div class="main-dashboard-modal-body" id="analysisModalContent"></div></div></div>');
    }
    $('#analysisModalContent').html(html);
    $('#analysisModal').fadeIn();
});

$(document).on('click', '#closeAnalysisModal', function() {
    $('#analysisModal').fadeOut();
});
});
// --- End Prediction Tab Logic ---

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
// End of document ready

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
    // Load all students for autocomplete on page load
    $(document).ready(function() {
        let cdrid = $("#hiddencdrid").val();
        if (cdrid) {
            $.ajax({
                url: "ajaxhandler/attendanceAJAX.php",
                type: "POST",
                dataType: "json",
                data: {cdrid: cdrid, action: "getAllStudentsUnderCoordinator"},
                success: function(response) {
                    if (response.success) {
                        window.allStudentsList = response.data || [];
                    } else {
                        window.allStudentsList = [];
                    }
                },
                error: function() {
                    window.allStudentsList = [];
                }
            });
        } else {
            window.allStudentsList = [];
        }
    });
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

    // Store all students globally for autocomplete
    window.allStudentsList = students || [];
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
    console.log('[Student Profile Modal] Fetching profile for STUDENT_ID:', studentId);
    $.ajax({
        url: "ajaxhandler/studentDashboardAjax.php",
        type: "POST",
        dataType: "json",
        data: {
            action: "getStudentProfile",
            studentId: studentId // Now using STUDENT_ID
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
                html += `<div class='detail-row'><span class='detail-label'>Student ID:</span><span class='detail-value'>${profile.STUDENT_ID || ''}</span></div>`;
                html += `<div class='detail-row'><span class='detail-label'>Intern ID:</span><span class='detail-value'>${profile.INTERNS_ID || ''}</span></div>`;
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

            x += `<div class="timein-area" data-studentid='${cs['STUDENT_ID']}'>`;
            x += `<span class="cbtimein">${formatTime(cs['timein'])}</span>`;
            x += `</div>`;

            x += `<div class="timeout-area" data-studentid='${cs['STUDENT_ID']}'>`;
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
    // Tab click event for stats tab
    $('#statsTabBtn').click(function() {
        $(this).addClass('active');
        $('#evalQuestionsTabBtn').removeClass('active');
        $('#rateTabBtn').removeClass('active');
        $('#reviewTabBtn').removeClass('active');
        $('#statsTabContent').addClass('active');
        $('#evalQuestionsTabContent').removeClass('active');
        $('#rateTabContent').removeClass('active');
        $('#reviewTabContent').removeClass('active');
        loadEvaluationStats();
    });

    // Hide stats cards when switching away from stats tab
    $('#evalQuestionsTabBtn, #rateTabBtn, #reviewTabBtn').click(function() {
        $('#statsSummary').html('');
        // Optionally remove per-question stats table if present
        $('.per-question-stats-table').remove();
        // Hide the entire stats-eval-container
        $('.stats-eval-container').hide();
    });

    // Show stats-eval-container only when stats tab is active
    $('#statsTabBtn').click(function() {
        $('.stats-eval-container').show();
    });

    // Load stats and render charts
    function loadEvaluationStats() {
        // Load Chart.js if not loaded
        if (typeof Chart === 'undefined') {
            $.getScript('https://cdn.jsdelivr.net/npm/chart.js', function() {
                fetchAndRenderStats();
            });
        } else {
            fetchAndRenderStats();
        }
    }

    function fetchAndRenderStats() {
        $.ajax({
            url: 'ajaxhandler/evaluationStatsAjax.php',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // Summary as individual cards
                $('#statsSummary').html(
                    `<div class='stats-summary-cards'>`
                        + `<div class='stat-card'><div class='stat-card-title'>Students Answered</div><div class='stat-card-value'>${data.answeredCount} / ${data.totalStudents}</div></div>`
                        + `<div class='stat-card'><div class='stat-card-title'>Students Rated</div><div class='stat-card-value'>${data.ratedCount} / ${data.totalStudents}</div></div>`
                    + `</div>`
                );

                // Prepare chart data
                let labels = [];
                let datasets = [
                    { label: '5', backgroundColor: '#3182ce', data: [] },
                    { label: '4', backgroundColor: '#4299e1', data: [] },
                    { label: '3', backgroundColor: '#63b3ed', data: [] },
                    { label: '2', backgroundColor: '#90cdf4', data: [] },
                    { label: '1', backgroundColor: '#bee3f8', data: [] }
                ];
                let questionRows = '';
                let allZero = true;
                if (!data.questionStats || Object.keys(data.questionStats).length === 0) {
                    allZero = true;
                } else {
                    // Check if all ratings for all questions are zero
                    Object.values(data.questionStats).forEach(q => {
                        let sum = Object.values(q.ratings).reduce((a, b) => a + b, 0);
                        if (sum > 0) allZero = false;
                    });
                }
                if (allZero) {
                    $('#tableContainer').html('<div class="no-eval-message" style="text-align:center;color:#e53e3e;font-size:1.2em;margin-top:2em;">No evaluation received yet.</div>');
                    $('#chartContainer').html('');
                    return;
                }
                Object.values(data.questionStats).forEach(q => {
                    labels.push(q.question_text);
                    let row = `<tr><td style='font-weight:500;'>${q.question_text}</td>`;
                    for (let i = 5; i >= 1; i--) {
                        datasets[5-i].data.push(q.ratings[i] || 0);
                        row += `<td style='text-align:center;'>${q.ratings[i] || 0}</td>`;
                    }
                    row += '</tr>';
                    questionRows += row;
                });

                // Destroy previous chart if exists and is a Chart.js instance
                if (window.questionRatingsChart && typeof window.questionRatingsChart.destroy === 'function') {
                    window.questionRatingsChart.destroy();
                }
                // Ensure chart and table containers exist
                if ($('#chartContainer').length === 0) {
                    $('#statsSummary').after('<div id="chartContainer" style="margin-top:2rem;"></div>');
                }
                if ($('#tableContainer').length === 0) {
                    $('#chartContainer').after('<div id="tableContainer"></div>');
                }
                // Render chart in chartContainer
                $('#chartContainer').html('<canvas id="questionRatingsChart" style="max-width:900px;"></canvas>');
                let ctx = document.getElementById('questionRatingsChart').getContext('2d');
                window.questionRatingsChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: { display: true, text: 'Ratings Distribution per Question' }
                        },
                        scales: {
                            x: { title: { display: true, text: 'Questions' }, stacked: true },
                            y: { title: { display: true, text: 'Number of Ratings' }, beginAtZero: true, stacked: true }
                        }
                    }
                });

                // Render per-question stats table in tableContainer
                $('.per-question-stats-table').remove();
                let statsTableHtml = `<div class='per-question-stats-table' style='margin-top:2.5rem;'>
                    <h4 style='margin-bottom:1rem;'>Per-Question Rating Stats</h4>
                    <table style='width:100%;max-width:700px;border-collapse:collapse;background:#fff;'>
                        <thead>
                            <tr style='background:#f7fafc;'>
                                <th style='padding:8px 6px;text-align:left;'>Question</th>
                                <th>5</th><th>4</th><th>3</th><th>2</th><th>1</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${questionRows}
                        </tbody>
                    </table>
                </div>`;
                $('#tableContainer').html(statsTableHtml);
            },
            error: function() {
                $('#statsSummary').html('<span style="color:red;">Error loading stats.</span>');
            }
        });
    }
    // Student search filter for Review & Rate Student Answers
    $(document).on('input', '#reviewStudentSearch', function() {
        const query = $(this).val().toLowerCase();
        let lastMatch = [];
        $('.student-review-group').each(function() {
            const name = $(this).find('.student-review-title').text().toLowerCase();
            if (name.includes(query)) {
                $(this).show();
                lastMatch.push(this);
            } else {
                $(this).hide();
            }
        });
        if (lastMatch.length === 0 && query.length > 0) {
            // If no match, show last matched students for previous query
            if (window.lastStudentSearchMatch && window.lastStudentSearchMatch.length > 0) {
                $(window.lastStudentSearchMatch).show();
            }
        } else {
            window.lastStudentSearchMatch = lastMatch;
        }
    });
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
            if ($(this).data('submitted')) {
                return;
            }
            $(this).data('submitted', true);

            let studentId = $("#studentId").val();  // Ensure this is correctly populated
            let action = studentId ? "updateStudent" : "addStudent"; // Determine action based on studentId

            var formData = new FormData(this);
            // Use the actual selected dropdown values for HTE and session
            formData.append('hte_id', $("#hteSelectStudent").val());
            formData.append('session_id', $("#sessionSelectStudent").val());
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
                        console.log("CSV upload response:", response); // Log the full response for debugging
                        if (response.success) {
                            alert("Students added successfully from CSV!");
                            $("#addStudentForm").hide(); // Hide the form after success
                            let cdrid = $("#hiddencdrid").val();
                            let ondate = $("#dtpondate").val();
                            fetchStudentList(currentSessionId, currentHteId, cdrid, ondate); // Refresh the student list
                        } else {
                            // Only show error if no students were inserted
                            if (!response.inserted || response.inserted === 0) {
                                alert(response.message); // Show error message only if nothing was inserted
                            }
                        }
                        $("#studentForm").data('submitted', false);
                    },
                    error: function(xhr, status, error) {
                        console.error("Error uploading CSV:", error);
                        if (xhr && xhr.responseText) {
                            console.log("CSV upload error response:", xhr.responseText);
                        }
                        alert("An error occurred while uploading the CSV file. Please check the console for details.");
                        $("#studentForm").data('submitted', false);
                    }
                });
            } else {
                // Check if HTE and Session are selected
                // Handle single student addition
                if (!currentHteId || currentHteId === "") {
                    alert("Please select an HTE before adding a student.");
                    $("#studentForm").data('submitted', false);
                    return;
                }
                if (!currentSessionId || currentSessionId === "-1") {
                    alert("Please select a session before adding a student.");
                    $("#studentForm").data('submitted', false);
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
                        $("#studentForm").data('submitted', false);
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
                        $("#studentForm").data('submitted', false);
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
            // Disable all except HTE and Session dropdowns
            $("#studentForm input[type='text'], #studentForm input[type='number'], #studentForm input[type='email']").prop("disabled", $(this).get(0).files.length > 0);
            // Keep HTE and Session enabled
            $("#hteSelectStudent, #sessionSelectStudent").prop("disabled", false);
            // Disable other selects except HTE and Session
            $("#studentForm select").not("#hteSelectStudent, #sessionSelectStudent").prop("disabled", $(this).get(0).files.length > 0);
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



// --- Coordinator Evaluation Question Management ---

// Fetch and display all evaluation questions
function loadEvaluationQuestions() {
    $.ajax({
        url: 'ajaxhandler/coordinatorEvaluationQuestionsAjax.php',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success && response.questions) {
                let html = '<table class="table"><thead><tr><th>Category</th><th>Question</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
                response.questions.forEach(function(q) {
                    html += `<tr>
                        <td>${q.category}</td>
                        <td>${q.question_text}</td>
                        <td>${q.status}</td>
                        <td>
                            <button class="btn-edit-question" data-id="${q.question_id}">Edit</button>
                            <button class="btn-deactivate-question" data-id="${q.question_id}">Deactivate</button>
                        </td>
                    </tr>`;
                });
                html += '</tbody></table>';
                $('#evaluationQuestionsList').html(html);
            } else {
                $('#evaluationQuestionsList').html('<p>No questions found.</p>');
            }
        },
        error: function() {
            $('#evaluationQuestionsList').html('<p>Error loading questions.</p>');
        }
    });
}

// Add new evaluation question
$('#addEvaluationQuestionForm').on('submit', function(e) {
    e.preventDefault();
    const category = $('#questionCategory').val();
    const question_text = $('#questionText').val();
    $.ajax({
        url: 'ajaxhandler/coordinatorEvaluationQuestionsAjax.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ category, question_text }),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                loadEvaluationQuestions();
                $('#addEvaluationQuestionForm')[0].reset();
            } else {
                alert('Failed to add question.');
            }
        },
        error: function() {
            alert('Error adding question.');
        }
    });
});

// Edit or deactivate question
$(document).on('click', '.btn-edit-question, .btn-deactivate-question', function() {
    const question_id = $(this).data('id');
    let updateData = { question_id };
    if ($(this).hasClass('btn-edit-question')) {
        // For simplicity, prompt for new text and category
        updateData.question_text = prompt('Enter new question text:');
        updateData.category = prompt('Enter new category:');
    } else {
        updateData.status = 'inactive';
    }
    $.ajax({
        url: 'ajaxhandler/coordinatorEvaluationQuestionsAjax.php',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updateData),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                loadEvaluationQuestions();
            } else {
                alert('Failed to update question.');
            }
        },
        error: function() {
            alert('Error updating question.');
        }
    });
});

// Initial load
$(document).ready(function() {
    loadEvaluationQuestions();
});

$(document).ready(function() {
    // Load all active questions for reference in Evaluation tab
    function loadAllQuestionsList() {
        $.ajax({
            url: 'ajaxhandler/coordinatorEvaluationQuestionsAjax.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success && response.questions) {
                    // Filter only active questions
                    const activeQuestions = response.questions.filter(q => q.status === 'active');
                    let html = `<div class='all-questions-container' style='max-height:540px;overflow-y:auto;padding-right:8px;'>`;
                    html += `<h2 class='all-questions-title'>All Evaluation Questions</h2>`;
                    // Separate questions by category
                    const softSkillQuestions = activeQuestions.filter(q => q.category && q.category.toLowerCase().includes('soft'));
                    const commSkillQuestions = activeQuestions.filter(q => q.category && q.category.toLowerCase().includes('comm'));
                    if (softSkillQuestions.length > 0) {
                        html += `<div style='text-align:center;margin-top:18px;margin-bottom:8px;'>
                            <span style='display:inline-block;background:#4f6ef7;color:#fff;padding:8px 32px;border-radius:8px;font-size:1.25rem;font-weight:700;box-shadow:0 2px 8px rgba(79,110,247,0.12);letter-spacing:1px;'>Soft Skill</span>
                        </div>`;
                        html += `<ul class='question-list'>`;
                        softSkillQuestions.forEach(function(q) {
                            html += `<li class='question-card'>
                                <div class='question-body' contenteditable='true' data-questionid='${q.question_id}'>${q.question_text}</div>
                            </li>`;
                        });
                        html += `</ul>`;
                    }
                    if (commSkillQuestions.length > 0) {
                        html += `<div style='text-align:center;margin-top:18px;margin-bottom:8px;'>
                            <span style='display:inline-block;background:#3182ce;color:#fff;padding:8px 32px;border-radius:8px;font-size:1.25rem;font-weight:700;box-shadow:0 2px 8px rgba(49,130,206,0.12);letter-spacing:1px;'>Comm Skill</span>
                        </div>`;
                        html += `<ul class='question-list'>`;
                        commSkillQuestions.forEach(function(q) {
                            html += `<li class='question-card'>
                                <div class='question-body' contenteditable='true' data-questionid='${q.question_id}'>${q.question_text}</div>
                            </li>`;
                        });
                        html += `</ul>`;
                    }
                    // If there are other categories, show them below
                    const otherQuestions = activeQuestions.filter(q => {
                        const cat = q.category ? q.category.toLowerCase() : '';
                        return !cat.includes('soft') && !cat.includes('comm');
                    });
                    if (otherQuestions.length > 0) {
                        html += `<div style='text-align:center;margin-top:18px;margin-bottom:8px;'>
                            <span style='display:inline-block;background:#e53e3e;color:#fff;padding:8px 32px;border-radius:8px;font-size:1.25rem;font-weight:700;box-shadow:0 2px 8px rgba(229,62,62,0.12);letter-spacing:1px;'>Person and Inperpersonal Skills</span>
                        </div>`;
                        html += `<ul class='question-list'>`;
                        otherQuestions.forEach(function(q) {
                            html += `<li class='question-card'>
                                <div class='question-body' contenteditable='true' data-questionid='${q.question_id}'>${q.question_text}</div>
                            </li>`;
                        });
                        html += `</ul>`;
                    }
                    html += `</div>`;
                    // Add Save All Changes button below all questions
                    html += `<div style='text-align:center;margin-top:24px;'>
                        <button id='btnSaveAllQuestions' style='padding:10px 32px;font-size:1.1rem;background:#4f6ef7;color:#fff;border:none;border-radius:6px;box-shadow:0 2px 8px rgba(79,110,247,0.08);font-weight:600;cursor:pointer;'>Save All Changes</button>
                        <span id='saveAllStatus' style='margin-left:16px;'></span>
                    </div>`;
                    $('#evalQuestionsTabContent').html(html);
                    // Save all edited questions via AJAX
                    $(document).off('click', '#btnSaveAllQuestions').on('click', '#btnSaveAllQuestions', function() {
                        var questions = [];
                        $('.question-body[contenteditable="true"]').each(function() {
                            var questionId = $(this).data('questionid');
                            var newText = $(this).text().trim();
                            questions.push({ question_id: questionId, question_text: newText });
                        });
                        var $status = $('#saveAllStatus');
                        $status.text('Saving...').css('color', '#0077b6');
                        $.ajax({
                            url: 'ajaxhandler/coordinatorEvaluationQuestionsAjax.php',
                            type: 'PUT',
                            contentType: 'application/json',
                            data: JSON.stringify({ questions: questions }),
                            dataType: 'json',
                            success: function(response) {
                                if (response.success) {
                                    $status.text('All changes saved!').css('color', 'green');
                                } else {
                                    $status.text('Failed to save changes.').css('color', 'red');
                                }
                            },
                            error: function() {
                                $status.text('Error saving changes.').css('color', 'red');
                            }
                        });
                    });
                } else {
                    $('#evalQuestionsTabContent').html("<div class='all-questions-container'><h2 class='all-questions-title'>No active questions found.</h2></div>");
                }
            },
            error: function() {
                $('#evalQuestionsTabContent').html("<div class='all-questions-container'><h2 class='all-questions-title'>Error loading questions.</h2></div>");
            }
        });
    }

    // Initial load for Evaluation tab
    loadAllQuestionsList();

    // Load student answers for coordinator review/rating
    function loadReviewEvalList() {
        // Get reviewed student IDs first
        $.ajax({
            url: 'ajaxhandler/coordinatorRateStudentAnswersAjax.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({ action: 'getReviewedStudents' }),
            contentType: 'application/json',
            success: function(reviewedResp) {
                let reviewedIds = reviewedResp.reviewedIds || [];
                let ratingLookup = {};
                if (Array.isArray(reviewedResp.ratings)) {
                    reviewedResp.ratings.forEach(function(r) {
                        ratingLookup[r.student_evaluation_id] = r.rating;
                    });
                }
                // Now fetch all answers
                $.ajax({
                    url: 'ajaxhandler/coordinatorRateStudentAnswersAjax.php',
                    type: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        if (response.success && response.answers) {
                            let html = '';
                            let students = {};
                            response.answers.forEach(function(ans) {
                                // Always use STUDENT_ID for grouping
                                const sid = ans.STUDENT_ID || ans.student_id;
                                if (!students[sid]) students[sid] = {};
                                if (!students[sid][ans.category]) students[sid][ans.category] = [];
                                students[sid][ans.category].push(ans);
                            });
                            // REVIEW TAB: Only show reviewed students
                            const reviewedIdsStr = reviewedIds.map(String);
                            let reviewedStudents = Object.keys(students).filter(sid => reviewedIdsStr.includes(String(sid)));
                            if (reviewedStudents.length === 0) {
                                html = `<div class="no-match-message" style="text-align:center; color:#a0aec0; font-size:1.2em; margin-top:2em;">No reviewed students</div>`;
                            } else {
                                reviewedStudents.forEach(function(studentId) {
                                    let firstAns = null;
                                    Object.keys(students[studentId]).forEach(function(category) {
                                        if (!firstAns) firstAns = students[studentId][category][0];
                                    });
                                    let fullName = firstAns ? `${firstAns.SURNAME}, ${firstAns.NAME}` : '';
                                    html += `<div class='student-review-group'><h3 class='student-review-title'>${fullName}<br><span style='font-size:1rem;font-weight:400;'>Student ID: ${studentId}</span></h3>`;
                                    html += `<div class='question-cards-row'>`;
                                    Object.keys(students[studentId]).forEach(function(category) {
                                        html += `<div class='student-category-group'><h4 class='student-category-title'>${category}</h4>`;
                                        students[studentId][category].forEach(function(ans) {
                                            let actualRating = ratingLookup[ans.student_evaluation_id] || '';
                                            html += `<div class='student-eval-block' data-evalid='${ans.student_evaluation_id}'>
                                                <div class='eval-question-box'>${ans.question_text}</div>
                                                <table class='eval-table'>
                                                    <tr>
                                                        <td class='eval-answer-cell' rowspan='2'>${ans.answer}</td>
                                                        <td class='eval-rating-header' colspan='5' style='text-align:center;'>Table Rating</td>
                                                    </tr>
                                                    <tr>`;
                                            for (let i = 5; i >= 1; i--) {
                                                html += `<td class='eval-rating-cell'><span>${i}<br><span class='reviewed-rating' style='color:${actualRating == i ? "#3182ce" : "#a0aec0"};font-size:1.3em;'>${actualRating == i ? '&#9733;' : '&#9734;'}</span></span></td>`;
                                            }
                                            html += `</tr>
                                                </table>
                                                <span class='rate-status' id='rateStatus_${ans.student_evaluation_id}'></span>
                                            </div>`;
                                        });
                                        html += `</div>`;
                                    });
                                    html += `</div>`;
                                    html += `</div>`;
                                });
                            }
                            $('#reviewEvalList').html(html);
                        } else {
                            $('#reviewEvalList').html('<div class="no-match-message" style="text-align:center; color:#a0aec0; font-size:1.2em; margin-top:2em;">No record for this student</div>');
                        }
                    },
                    error: function() {
                        $('#reviewEvalList').html('<p>Error loading student answers for review.</p>');
                    }
                });
            }
        });
    }

    // Load on tab show (or page load)
    loadReviewEvalList();

    // Handle rating submission
    $(document).on('click', '.btn-save-all-ratings', function() {
    const $btn = $(this);
    const studentId = $btn.data('studentid');
    // Use #rateEvalList as parent for pre-assessment tab, fallback to .student-review-group for review tab
    let $parentGroup = $btn.closest('#rateEvalList');
    if ($parentGroup.length === 0) {
        $parentGroup = $btn.closest('.student-review-group');
    }
    if ($parentGroup.length === 0) {
        // Fallback: find by studentId in data attribute
        $parentGroup = $(`#rateEvalList:has(.btn-save-all-ratings[data-studentid='${studentId}'])`);
        if ($parentGroup.length === 0) {
            $parentGroup = $(`.student-review-group:has(.btn-save-all-ratings[data-studentid='${studentId}'])`);
        }
    }
    console.log('[DEBUG] Parent container HTML:', $parentGroup.html());
    // Find all .student-eval-block elements in this group
    const $evalBlocks = $parentGroup.find('.student-eval-block');
    console.log(`[DEBUG] Found ${$evalBlocks.length} .student-eval-block elements for studentId ${studentId}`);
    $evalBlocks.each(function(idx) {
        console.log(`[DEBUG] .student-eval-block[${idx}] data-evalid:`, $(this).data('evalid'));
    });
    // Prevent multiple clicks
    if ($btn.prop('disabled')) return;
    console.log('[DEBUG] Save All Ratings button pressed for studentId:', studentId);
    // Collect ratings for debug
    let debugRatings = [];
    $evalBlocks.each(function() {
        const student_evaluation_id = $(this).data('evalid');
        const rating = $(`input[name='likert_${studentId}_${student_evaluation_id}']:checked`).val();
        debugRatings.push({ student_evaluation_id, rating, STUDENT_ID: studentId });
    });
    console.log('[DEBUG] Ratings to be submitted:', debugRatings);
    const coordinator_id = $('#hiddencdrid').val();
    let ratings = [];
    $evalBlocks.each(function() {
        const student_evaluation_id = $(this).data('evalid');
        const rating = $(`input[name='likert_${studentId}_${student_evaluation_id}']:checked`).val();
        ratings.push({ student_evaluation_id, rating, STUDENT_ID: studentId });
    });
    let missing = ratings.filter(r => !r.rating);
    if (missing.length > 0) {
        // Show modal for missing ratings (reuse modal)
        showStatusModal('Please Rate All.');
        missing.forEach(r => {
            $(`#rateStatus_${r.student_evaluation_id}`).text('Please select a rating.').css('color', 'red');
        });
        return;
    }
    // Only disable button after AJAX success
    $.ajax({
        url: 'ajaxhandler/coordinatorRateStudentAnswersAjax.php',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ coordinator_id, ratings }),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                ratings.forEach(r => {
                    $(`#rateStatus_${r.student_evaluation_id}`).text('Rating saved!').css('color', 'green');
                });
                $btn.prop('disabled', true);
                showStatusModal('Ratings have been saved!');
            } else {
                ratings.forEach(r => {
                    $(`#rateStatus_${r.student_evaluation_id}`).text('Failed to save rating.').css('color', 'red');
                });
            }
        },
        error: function() {
            ratings.forEach(r => {
                $(`#rateStatus_${r.student_evaluation_id}`).text('Error saving rating.').css('color', 'red');
            });
        }
    });
// Reusable modal function for status messages
function showStatusModal(message) {
    if ($('#statusModal').length === 0) {
        $('body').append(`
            <div id="statusModal" class="custom-modal-bg" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center;">
                <div class="custom-modal-content" style="background:#fff;padding:32px 24px;border-radius:10px;box-shadow:0 2px 16px rgba(0,0,0,0.18);max-width:350px;text-align:center;">
                    <h3 class="status-modal-message" style="margin-bottom:18px;font-size:1.3rem;color:#3182ce;">${message}</h3>
                    <button id="closeStatusModal" style="margin-top:12px;padding:8px 24px;background:#3182ce;color:#fff;border:none;border-radius:6px;font-size:1rem;cursor:pointer;">OK</button>
                </div>
            </div>
        `);
        $(document).on('click', '#closeStatusModal', function() {
            $('#statusModal').remove();
        });
    } else {
        $('.status-modal-message').text(message);
        $('#statusModal').show();
    }
}
    });
});
});
});
// Evaluation Inner Tab Switching Logic
$(document).ready(function() {
    // Only show All Evaluation Questions tab content by default
    $('#evalQuestionsTabBtn').addClass('active');
    $('#evalQuestionsTabContent').addClass('active');
    $('#rateTabBtn').removeClass('active');
    $('#rateTabContent').removeClass('active');
    $('#reviewTabBtn').removeClass('active');
    $('#reviewTabContent').removeClass('active');

    // Tab click event for evaluation inner tabs
    $('#evalQuestionsTabBtn').click(function() {
        $(this).addClass('active');
        $('#rateTabBtn').removeClass('active');
        $('#reviewTabBtn').removeClass('active');
        $('#evalQuestionsTabContent').addClass('active');
        $('#rateTabContent').removeClass('active');
        $('#reviewTabContent').removeClass('active');
    });
    $('#rateTabBtn').click(function() {
        $(this).addClass('active');
        $('#evalQuestionsTabBtn').removeClass('active');
        $('#reviewTabBtn').removeClass('active');
        $('#rateTabContent').addClass('active');
        $('#evalQuestionsTabContent').removeClass('active');
        $('#reviewTabContent').removeClass('active');
    });
    $('#reviewTabBtn').click(function() {
        $(this).addClass('active');
        $('#evalQuestionsTabBtn').removeClass('active');
        $('#rateTabBtn').removeClass('active');
        $('#reviewTabContent').addClass('active');
        $('#evalQuestionsTabContent').removeClass('active');
        $('#rateTabContent').removeClass('active');
    });

    // Load and separate students for Rate and Review tabs
    function loadRateAndReviewLists() {
        $.ajax({
            url: 'ajaxhandler/coordinatorRateStudentAnswersAjax.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.success && response.answers) {
                    let students = {};
                    let reviewedStudents = {};
                    // Group answers by student and category
                    response.answers.forEach(function(ans) {
                        // Always use STUDENT_ID for grouping
                        const sid = ans.STUDENT_ID || ans.student_id;
                        if (!students[sid]) students[sid] = {};
                        if (!students[sid][ans.category]) students[sid][ans.category] = [];
                        students[sid][ans.category].push(ans);
                    });
                    // Get reviewed student IDs from coordinator_evaluation table
                    $.ajax({
                        url: 'ajaxhandler/coordinatorRateStudentAnswersAjax.php',
                        type: 'POST',
                        dataType: 'json',
                        data: JSON.stringify({ action: 'getReviewedStudents' }),
                        contentType: 'application/json',
                        success: function(reviewedResp) {
                            let reviewedIds = reviewedResp.reviewedIds || [];
                            let rateHtml = '';
                            let reviewHtml = '';
                            // Build a lookup for ratings: { student_evaluation_id: rating }
                            let ratingLookup = {};
                            if (Array.isArray(reviewedResp.ratings)) {
                                reviewedResp.ratings.forEach(function(r) {
                                    ratingLookup[r.student_evaluation_id] = r.rating;
                                });
                            }
                            Object.keys(students).forEach(function(studentId) {
                                // Normalize both IDs to string for comparison
                                const studentIdStr = String(studentId);
                                let firstAns = null;
                                Object.keys(students[studentId]).forEach(function(category) {
                                    if (!firstAns) firstAns = students[studentId][category][0];
                                });
                                let fullName = firstAns ? `${firstAns.SURNAME}, ${firstAns.NAME}` : '';
                                let studentGroupHtml = `<div class='student-review-group'><h3 class='student-review-title'>${fullName}</h3><div class='question-cards-row'>`;
                                // Combine Soft Skill and Comm Skill in one card
                                // Find all categories that match 'soft' or 'comm' (case-insensitive, partial match)
                                let combinedCategories = [];
                                Object.keys(students[studentId]).forEach(function(category) {
                                    let catLower = category.toLowerCase();
                                    if (catLower.includes('soft') || catLower.includes('comm')) {
                                        combinedCategories.push(category);
                                    }
                                });
                                // Determine if student is reviewed
                                const reviewedIdsStr = reviewedIds.map(String);
                                const isReviewed = reviewedIdsStr.includes(studentIdStr);
                                if (combinedCategories.length > 0) {
                                    studentGroupHtml += `<div class='student-category-group'>`;
                                    combinedCategories.forEach(function(category) {
                                        studentGroupHtml += `<h4 class='student-category-title'>${category}</h4>`;
                                        students[studentId][category].forEach(function(ans) {
                                            let actualRating = ratingLookup[ans.student_evaluation_id] || '';
                                            if (isReviewed) {
                                                // REVIEW TAB: show only rating stars
                                                studentGroupHtml += `<div class='student-eval-block' data-evalid='${ans.student_evaluation_id}'>
                                                    <div class='eval-question-box'>${ans.question_text}</div>
                                                    <table class='eval-table'>
                                                        <tr>
                                                            <td class='eval-answer-cell' rowspan='2'>${ans.answer}</td>
                                                            <td class='eval-rating-header' colspan='5' style='text-align:center;'>Table Rating</td>
                                                        </tr>
                                                        <tr>`;
                                                for (let i = 5; i >= 1; i--) {
                                                    studentGroupHtml += `<td class='eval-rating-cell'><span>${i}<br><span class='reviewed-rating' style='color:${actualRating == i ? "#3182ce" : "#a0aec0"};font-size:1.3em;'>${actualRating == i ? '&#9733;' : '&#9734;'}</span></span></td>`;
                                                }
                                                studentGroupHtml += `</tr>
                                                    </table>
                                                </div>`;
                                            } else {
                                                // RATE TAB: show radio buttons and Save button
                                                studentGroupHtml += `<div class='student-eval-block' data-evalid='${ans.student_evaluation_id}'>
                                                    <div class='eval-question-box'>${ans.question_text}</div>
                                                    <table class='eval-table'>
                                                        <tr>
                                                            <td class='eval-answer-cell' rowspan='2'>${ans.answer}</td>
                                                            <td class='eval-rating-header' colspan='5' style='text-align:center;'>Table Rating</td>
                                                        </tr>
                                                        <tr>
                                                            <td class='eval-rating-cell'><label>5<br><input type='radio' name='likert_${studentId}_${ans.student_evaluation_id}' value='5'></label></td>
                                                            <td class='eval-rating-cell'><label>4<br><input type='radio' name='likert_${studentId}_${ans.student_evaluation_id}' value='4'></label></td>
                                                            <td class='eval-rating-cell'><label>3<br><input type='radio' name='likert_${studentId}_${ans.student_evaluation_id}' value='3'></label></td>
                                                            <td class='eval-rating-cell'><label>2<br><input type='radio' name='likert_${studentId}_${ans.student_evaluation_id}' value='2'></label></td>
                                                            <td class='eval-rating-cell'><label>1<br><input type='radio' name='likert_${studentId}_${ans.student_evaluation_id}' value='1'></label></td>
                                                        </tr>
                                                    </table>
                                                    <div style='text-align:right;'><button type='button' class='btn-clear-table' data-evalid='${ans.student_evaluation_id}' data-studentid='${studentId}' style='background:none;border:none;color:#2d3748;text-decoration:underline;cursor:pointer;padding:0;margin-top:8px;'>Clear Table</button></div>
                                                    <span class='rate-status' id='rateStatus_${ans.student_evaluation_id}'></span>
                                                </div>`;
                                            }
                                        });
                                    });
                                    studentGroupHtml += `</div>`;
                                }
                                // Render other categories as separate cards
                                Object.keys(students[studentId]).forEach(function(category) {
                                    if (combinedCategories.includes(category)) return;
                                    studentGroupHtml += `<div class='student-category-group'><h4 class='student-category-title'>${category}</h4>`;
                                    students[studentId][category].forEach(function(ans) {
                                        let actualRating = ratingLookup[ans.student_evaluation_id] || '';
                                        if (isReviewed) {
                                            // REVIEW TAB: show only rating stars
                                            studentGroupHtml += `<div class='student-eval-block' data-evalid='${ans.student_evaluation_id}'>
                                                <div class='eval-question-box'>${ans.question_text}</div>
                                                <table class='eval-table'>
                                                    <tr>
                                                        <td class='eval-answer-cell' rowspan='2'>${ans.answer}</td>
                                                        <td class='eval-rating-header' colspan='5' style='text-align:center;'>Table Rating</td>
                                                    </tr>
                                                    <tr>`;
                                            for (let i = 5; i >= 1; i--) {
                                                studentGroupHtml += `<td class='eval-rating-cell'><span>${i}<br><span class='reviewed-rating' style='color:${actualRating == i ? "#3182ce" : "#a0aec0"};font-size:1.3em;'>${actualRating == i ? '&#9733;' : '&#9734;'}</span></span></td>`;
                                            }
                                            studentGroupHtml += `</tr>
                                                </table>
                                            </div>`;
                                        } else {
                                            // RATE TAB: show radio buttons and Save button
                                            studentGroupHtml += `<div class='student-eval-block' data-evalid='${ans.student_evaluation_id}'>
                                                <div class='eval-question-box'>${ans.question_text}</div>
                                                <table class='eval-table'>
                                                    <tr>
                                                        <td class='eval-answer-cell' rowspan='2'>${ans.answer}</td>
                                                        <td class='eval-rating-header' colspan='5' style='text-align:center;'>Table Rating</td>
                                                    </tr>
                                                    <tr>
                                                        <td class='eval-rating-cell'><label>5<br><input type='radio' name='likert_${studentId}_${ans.student_evaluation_id}' value='5'></label></td>
                                                        <td class='eval-rating-cell'><label>4<br><input type='radio' name='likert_${studentId}_${ans.student_evaluation_id}' value='4'></label></td>
                                                        <td class='eval-rating-cell'><label>3<br><input type='radio' name='likert_${studentId}_${ans.student_evaluation_id}' value='3'></label></td>
                                                        <td class='eval-rating-cell'><label>2<br><input type='radio' name='likert_${studentId}_${ans.student_evaluation_id}' value='2'></label></td>
                                                        <td class='eval-rating-cell'><label>1<br><input type='radio' name='likert_${studentId}_${ans.student_evaluation_id}' value='1'></label></td>
                                                    </tr>
                                                </table>
                                                <div style='text-align:right;'><button type='button' class='btn-clear-table' data-evalid='${ans.student_evaluation_id}' data-studentid='${studentId}' style='background:none;border:none;color:#2d3748;text-decoration:underline;cursor:pointer;padding:0;margin-top:8px;'>Clear Table</button></div>
                                                <span class='rate-status' id='rateStatus_${ans.student_evaluation_id}'></span>
                                            </div>`;
                                        }
                                    });
                                    studentGroupHtml += `</div>`;
                                });
                                studentGroupHtml += `</div>`; // close question-cards-row
                                // Only show Save button for unrated students (use STUDENT_ID)
                                if (!isReviewed) {
                                    studentGroupHtml += `<div style='text-align:right; margin-top:18px;'><button class='btn-save-all-ratings' data-studentid='${studentId}' ${reviewedIds.includes(String(studentId)) ? 'disabled' : ''}>Save All Ratings</button></div>`;
                                }
                                studentGroupHtml += `</div>`; // close student-review-group
                                if (isReviewed) {
                                    reviewHtml += studentGroupHtml;
                                } else {
                                    rateHtml += studentGroupHtml;
                                }
                            });
                            $('#rateEvalList').html(rateHtml);
                            // Always append the no-match-message after rendering
                            if ($('#rateEvalList .no-match-message').length === 0) {
                                $('#rateEvalList').append('<div class="no-match-message" style="display:none; text-align:center; color:#a0aec0; font-size:1.2em; margin-top:2em;">No record for this student</div>');
                            }
                            $('#reviewedEvalList').html(reviewHtml || '<p>No reviewed student evaluations found.</p>');
                        }
                    });
                } else {
                    $('#rateEvalList').html('<p>No student answers found for rating.</p>');
                    $('#reviewedEvalList').html('<p>No reviewed student evaluations found.</p>');
                }
            },
            error: function() {
                $('#rateEvalList').html('<p>Error loading student answers for rating.</p>');
                $('#reviewedEvalList').html('<p>Error loading reviewed student evaluations.</p>');
            }
        });
    }

    // Initial load for Rate and Review tabs
    // --- Pre-Assessment Tab: Left-Right UI Logic ---
    let allStudents = [];
    let selectedStudentId = null;

    function loadPreassessmentStudentList() {
        // Fetch all students eligible for rating (AJAX or from global)
        $.ajax({
            url: 'ajaxhandler/studentDashboardAjax.php',
            type: 'POST',
            dataType: 'json',
            data: { action: 'getStudentsForPreassessment' },
            success: function(response) {
                if (response.success && Array.isArray(response.students)) {
                    allStudents = response.students;
                    renderStudentList(allStudents);
                } else {
                    $('#studentListPanel').html('<div class="preassessment-message">No students found.</div>');
                }
            },
            error: function() {
                $('#studentListPanel').html('<div class="preassessment-message">Error loading students.</div>');
            }
        });
    }

    function renderStudentList(students) {
        let sorted = students.slice().sort((a, b) => a.name.localeCompare(b.name));
        let html = '';
        sorted.forEach(function(student) {
            html += `<div class="preassessment-student-item${student.id === selectedStudentId ? ' selected' : ''}" data-studentid="${student.id}">${student.name}</div>`;
        });
        $('#studentListPanel').html(html);
    }

    // Search filter for student list
    $(document).on('input', '#rateStudentSearch', function() {
        const query = $(this).val().trim().toLowerCase();
        let filtered = allStudents.filter(s => s.name.toLowerCase().includes(query));
        renderStudentList(filtered);
    });

    // Handle student selection
    $(document).on('click', '.preassessment-student-item', function() {
        $('.preassessment-student-item').removeClass('selected');
        $(this).addClass('selected');
        selectedStudentId = $(this).data('studentid');
        loadStudentEvaluation(selectedStudentId);
    });

    function loadStudentEvaluation(studentId) {
        // Fetch evaluation for selected student
        $.ajax({
            url: 'ajaxhandler/studentDashboardAjax.php',
            type: 'POST',
            dataType: 'json',
            data: { action: 'getPreassessmentEvaluation', studentId: studentId },
            success: function(response) {
                if (response.success) {
                    if (response.isRated) {
                        $('#rateEvalList').html('<div class="preassessment-message">This student has been rated. Check the Review tab.</div>');
                    } else if (response.evaluations && response.evaluations.length > 0) {
                        // Render evaluation cards (reuse existing HTML if possible)
                        let evalHtml = '';
                        response.evaluations.forEach(function(ev) {
                            evalHtml += `<div class='student-eval-block' data-evalid='${ev.student_evaluation_id}'>
                                <div class='eval-question-box'>${ev.question_text}</div>
                                <table class='eval-table'>
                                    <tr>
                                        <td class='eval-answer-cell' rowspan='2'>${ev.answer}</td>
                                        <td class='eval-rating-header' colspan='5' style='text-align:center;'>Table Rating</td>
                                    </tr>
                                    <tr>
                                        <td class='eval-rating-cell'><label>5<br><input type='radio' name='likert_${studentId}_${ev.id}' value='5'></label></td>
                                        <td class='eval-rating-cell'><label>4<br><input type='radio' name='likert_${studentId}_${ev.id}' value='4'></label></td>
                                        <td class='eval-rating-cell'><label>3<br><input type='radio' name='likert_${studentId}_${ev.id}' value='3'></label></td>
                                        <td class='eval-rating-cell'><label>2<br><input type='radio' name='likert_${studentId}_${ev.id}' value='2'></label></td>
                                        <td class='eval-rating-cell'><label>1<br><input type='radio' name='likert_${studentId}_${ev.id}' value='1'></label></td>
                                    </tr>
                                </table>
                            </div>`;
                        });
                        evalHtml += `<div style='text-align:right; margin-top:18px;'><button class='btn-save-all-ratings' data-studentid='${studentId}'>Save All Ratings</button></div>`;
                        $('#rateEvalList').html(evalHtml);
                    } else {
                        $('#rateEvalList').html('<div class="preassessment-message">Student has not submitted an evaluation yet.</div>');
                    }
                } else {
                    $('#rateEvalList').html('<div class="preassessment-message">Error loading evaluation.</div>');
                }
            },
            error: function() {
                $('#rateEvalList').html('<div class="preassessment-message">Error loading evaluation.</div>');
            }
        });
    }

    // Initial load for Pre-Assessment tab
    $(document).ready(function() {
        if ($('#rateTabContent').length) {
            loadPreassessmentStudentList();
        }
    });

    // --- Review Tab: Populate student list and handle selection ---
    let allReviewStudents = [];
    let selectedReviewStudentId = null;

    function loadReviewStudentList() {
        // Fetch all students eligible for review (same as pre-assessment)
        $.ajax({
            url: 'ajaxhandler/studentDashboardAjax.php',
            type: 'POST',
            dataType: 'json',
            data: { action: 'getStudentsForPreassessment' },
            success: function(response) {
                if (response.success && Array.isArray(response.students)) {
                    // Map students to use STUDENT_ID for review selection
                    allReviewStudents = response.students.map(function(student) {
                        return {
                            id: student.STUDENT_ID || student.id, // Use STUDENT_ID if available
                            name: student.name || (student.SURNAME ? student.SURNAME + ', ' + student.NAME : student.NAME)
                        };
                    });
                    renderReviewStudentList(allReviewStudents);
                } else {
                    $('#reviewStudentListPanel').html('<div class="review-message">No students found.</div>');
                }
            },
            error: function() {
                $('#reviewStudentListPanel').html('<div class="review-message">Error loading students.</div>');
            }
        });
    }

    function renderReviewStudentList(students) {
        let sorted = students.slice().sort((a, b) => a.name.localeCompare(b.name));
        let html = '';
        sorted.forEach(function(student) {
            html += `<div class="review-student-item${student.id === selectedReviewStudentId ? ' selected' : ''}" data-studentid="${student.id}">${student.name}</div>`;
        });
        $('#reviewStudentListPanel').html(html);
    }

    // Search filter for review student list
    $(document).on('input', '#reviewStudentSearch', function() {
        const query = $(this).val().trim().toLowerCase();
        let filtered = allReviewStudents.filter(s => s.name.toLowerCase().includes(query));
        renderReviewStudentList(filtered);
    });

    // Handle student selection in Review tab
    $(document).on('click', '.review-student-item', function() {
    $('.review-student-item').removeClass('selected');
    $(this).addClass('selected');
    selectedReviewStudentId = $(this).data('studentid'); // This is now STUDENT_ID
    loadReviewedEvaluation(selectedReviewStudentId);
    });

    function loadReviewedEvaluation(studentId) {
        // Fetch reviewed evaluation for selected student
        $.ajax({
            url: 'ajaxhandler/coordinatorRateStudentAnswersAjax.php',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({ action: 'getReviewedEvaluation', studentId: studentId }),
            contentType: 'application/json',
            success: function(response) {
                if (response.success && response.evaluations && response.evaluations.length > 0) {
                    // Render reviewed evaluation cards
                    let evalHtml = '';
                    response.evaluations.forEach(function(ev) {
                        evalHtml += `<div class='student-eval-block'>
                            <div class='eval-question-box'>${ev.question_text}</div>
                            <table class='eval-table'>
                                <tr>
                                    <td class='eval-answer-cell' rowspan='2'>${ev.answer}</td>
                                    <td class='eval-rating-header' colspan='5' style='text-align:center;'>Table Rating</td>
                                </tr>
                                <tr>`;
                        for (let i = 5; i >= 1; i--) {
                            evalHtml += `<td class='eval-rating-cell'><span>${i}<br><span class='reviewed-rating' style='color:${ev.rating == i ? "#3182ce" : "#a0aec0"};font-size:1.3em;'>${ev.rating == i ? '&#9733;' : '&#9734;'}</span></span></td>`;
                        }
                        evalHtml += `</tr>
                            </table>
                        </div>`;
                    });
                    $('#reviewedEvalList').html(evalHtml);
                } else {
                    $('#reviewedEvalList').html('<div class="not-reviewed-message" style="text-align:center; color:#a0aec0; font-size:1.2em; margin-top:2em;">This student has not been rated. Check the Pre-Assessment.</div>');
                }
            },
            error: function() {
                $('#reviewedEvalList').html('<div class="review-message">Error loading reviewed evaluation.</div>');
            }
        });
    }

    // Initial load for Review tab student list
    $(document).ready(function() {
        if ($('#reviewTabContent').length) {
            loadReviewStudentList();
        }
    });

    // Handle click on autocomplete suggestion in Review tab
    $(document).on('mousedown', '.autocomplete-item-review', function(e) {
        e.preventDefault();
        let selectedName = $(this).text();
        $('#reviewStudentSearch').val(selectedName);
        $('#reviewStudentSearchAutocomplete').remove();
        // Only show the card for the selected student
        let normalizedSelected = selectedName.toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ').trim();
        let foundCard = false;
        $('.reviewed-eval-container .student-review-group').each(function() {
            let name = $(this).find('.student-review-title').text().toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ').trim();
            if (name === normalizedSelected) {
                $(this).show();
                foundCard = true;
            } else {
                $(this).hide();
            }
        });
        // Show message if not reviewed
        if (!foundCard) {
            if ($('.reviewed-eval-container .not-reviewed-message').length === 0) {
                $('.reviewed-eval-container').append('<div class="not-reviewed-message" style="text-align:center; color:#a0aec0; font-size:1.2em; margin-top:2em;">This student has not been rated. Check the Rate tab.</div>');
            }
            $('.reviewed-eval-container .not-reviewed-message').show();
        } else {
            $('.reviewed-eval-container .not-reviewed-message').hide();
        }
    });

    // Hide autocomplete dropdown when clicking outside (Review tab)
    $(document).on('mousedown', function(e) {
        const $dropdown = $('#reviewStudentSearchAutocomplete');
        const $input = $('#reviewStudentSearch');
        if ($dropdown.length && !$dropdown.is(e.target) && $dropdown.has(e.target).length === 0 && !$input.is(e.target)) {
            $dropdown.remove();
        }
    });
    // lastValidSearch already declared above, do not redeclare
    $(document).on('input', '#rateStudentSearch', function() {
        const query = $(this).val().trim().toLowerCase();
        // Only filter the left panel student list, no autocomplete dropdown
        let filtered = allStudents.filter(s => s.name.toLowerCase().includes(query));
        renderStudentList(filtered);
        // Remove any autocomplete dropdown if present
        $('#rateStudentSearchAutocomplete').remove();
    });

    // Handle click on autocomplete suggestion
    $(document).on('mousedown', '.autocomplete-item', function(e) {
        e.preventDefault();
        let selectedName = $(this).text();
        $('#rateStudentSearch').val(selectedName);
        $('#rateStudentSearchAutocomplete').remove();

        // Only show the card for the selected student, override input filter
        let normalizedSelected = selectedName.toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ').trim();
        let foundCard = false;
        $('.student-review-group').each(function() {
            let name = $(this).find('.student-review-title').text().toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ').trim();
            if (name === normalizedSelected) {
                $(this).show();
                foundCard = true;
            } else {
                $(this).hide();
            }
        });
        // Do NOT trigger input event, just update messages below

        // Check if selected student is already rated and show message if so
        let alreadyRated = false;
        $('#reviewedEvalList .student-review-group').each(function() {
            let name = $(this).find('.student-review-title').text().toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ').trim();
            if (name === normalizedSelected) {
                alreadyRated = true;
            }
        });
        if (alreadyRated) {
            if ($('#rateEvalList .already-rated-message').length === 0) {
                $('#rateEvalList').append('<div class="already-rated-message" style="text-align:center; color:#a0aec0; font-size:1.2em; margin-top:2em;">This student has already been rated. Check the Review tab.</div>');
            }
            $('#rateEvalList .no-match-message').hide();
            $('#rateEvalList .already-rated-message').show();
        } else if (!foundCard) {
            $('#rateEvalList .already-rated-message').hide();
            $('#rateEvalList .no-match-message').show();
        } else {
            $('#rateEvalList .already-rated-message').hide();
            $('#rateEvalList .no-match-message').hide();
        }
    });

    // Hide autocomplete dropdown when clicking outside
    $(document).on('mousedown', function(e) {
        const $dropdown = $('#rateStudentSearchAutocomplete');
        const $input = $('#rateStudentSearch');
        if ($dropdown.length && !$dropdown.is(e.target) && $dropdown.has(e.target).length === 0 && !$input.is(e.target)) {
            $dropdown.remove();
        }
    });

    // Sticky search for student names in rateEvalList
    let lastValidSearch = '';
    $(document).on('input', '#rateStudentSearch', function() {
        const query = $(this).val().trim().toLowerCase();
        let foundMatch = false;
        $('.student-review-group').each(function() {
            const name = $(this).find('.student-review-title').text().toLowerCase();
            if (name.includes(query) && query.length > 0) {
                $(this).show();
                foundMatch = true;
            } else {
                $(this).hide();
            }
        });
        // If no match, revert to last valid search
        if (!foundMatch && lastValidSearch.length > 0) {
            $('.student-review-group').each(function() {
                const name = $(this).find('.student-review-title').text().toLowerCase();
                if (name.includes(lastValidSearch)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        } else if (foundMatch) {
            lastValidSearch = query;
        }
        // If search is cleared, show all
        if (query.length === 0) {
            $('.student-review-group').show();
            lastValidSearch = '';
        }
    });

    // Show reviewed evaluations button
    $(document).on('click', '#btnShowReviewedEvaluations', function() {
        $('#reviewTabBtn').click();
    });
});